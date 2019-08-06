'use strict'

const Recipe = use('App/Models/Recipe');
const Steps = use('App/Models/RecipesStep');
const Database = use('Database')
const { validate } = use('Validator')
const Driver = use('Drive')
const { generatePhotoName } = use('App/Helpers')

/**
 * Resourceful controller for interacting with recipes
 */
class RecipeController {


  /**
   * Show a list of all recipes.
   * GET recipes
   *
   * @param {object} ctx
   * @param {Request} ctx.request
   * @param {Response} ctx.response
   * @param {View} ctx.view
   */
  async index ({ request, response }) {

    const {type, content } = request.all();

    var data = [];

    switch(type) {
      case 'category':
          data = await Recipe.query().where('category_id', content).with('user').fetch();
          break;

      case 'term':
          data = await Recipe.query().where('name', 'LIKE', content).with('user').fetch();
          break;
      case 'user':
        data = await Database
        .select([
          'recipes.id AS recipe_id',
          'recipes.photo AS recipe_photo',
          'recipes.status AS  status',
          'recipes.name AS recipe',
          'recipes.created_at As recipe_create',
          'users.username AS username',
          'users.picture AS user_pic',
          'categories.name AS category'
        ])
        .table('recipes')
        .innerJoin('users', 'users.id', 'recipes.user_id')
        .innerJoin('categories', 'categories.id', 'recipes.category_id')
        .where('users.username', content)
        break;

        default:
            data = await Recipe.query().with('user').fetch();
        break;
    }

    if(data.length <= 0){
      return response.status(404).send({
        "success" : false,
        "message" : "Nada encontrado. Tente novamente",
        "body"    : data
      })
    }

    return response.status(200).send({
      "success" : true,
      "message" : null,
      "body"    : data,
    })

  }

  /**
   * Create/save a new recipe.
   * POST recipes
   *
   * @param {object} ctx
   * @param {Request} ctx.request
   * @param {Response} ctx.response
   */
  async store ({ request, response, auth }) {
    const rules = {
      category_id : "required",
      name : "required",
    }

    const validation = await validate(request.all(), rules, {
      'category_id.required' : "Selecione uma categoria.",
      'name.required' : "Uma receita sem nome não funciona =(",
    })

    if (validation.fails()) {
      return validation.messages();
    }

    const {category_id, name, steps} = request.all();

    if(await !auth.check()){
      return response
      .status(401)
      .send({
        "error" : true,
        "message" : "Somente usuários logados podem enviar"
      });
    }

    const data = {
      "user_id" : auth.user.id,
      "category_id" : category_id,
      "name" : name,
      "status" : "3"
    }

    const recipeCreated = await Recipe.create(data);

    if(recipeCreated.id != ''){
      steps.forEach(async element => {
          const step = new Steps()
          step.order = element.order;
          step.description = element.description;

          await recipeCreated.steps().save(step);
      });
    }


    if(recipeCreated.id != ''){
      return response
      .status(201)
      .send({
        "error" : false,
        "message" : "Receita criada. A publicação da mesma pode ocorrer em até 24 horas.",
        "recipe_id" : recipeCreated.id
      });
    }


  }

  async photoUpload({ params, request, response, auth }){
    const { id } = params;

    if(id === undefined){
      return response
      .status(404)
      .send({
        "error" : false,
        "message" : "Receita não encontrada. A Foto não pode ser adicionada"
      });
    }

    const profilePic = request.multipart.file('photo', {
      types: ['image'],
      size: '2mb'
    }, async (file) => {
      const fileName = await generatePhotoName(id, file.extname);
      const recipe = await Recipe.find(id);

      if(!is_empty(recipe.photo) && await Driver.disk('s3').exists(recipe.photo)){
        console.log('Existe')
        await Driver.disk('s3').delete(recipe.photo);
      }

      await Driver.disk('s3').put(fileName, file.stream, {
        ACL : "public-read"
      });

      recipe.photo = fileName;
      recipe.save();

      return true;
    })

    await request.multipart.process();

    return response
    .status(201)
    .send({
      "error" : false,
      "message" : "Foto inserida com sucesso!"
    });


  }

  /**
   * Display a single recipe.
   * GET recipes/:id
   *
   * @param {object} ctx
   * @param {Request} ctx.request
   * @param {Response} ctx.response
   * @param {View} ctx.view
   */
  async show ({ params, response }) {
    const { id } = params

    const recipe = Recipe
      .query()
      .where('id', id)
      .with('user')
      .with('category')
      .with('steps')
      .fetch();

    return recipe;
  }

  /**
   * Update recipe details.
   * PUT or PATCH recipes/:id
   *
   * @param {object} ctx
   * @param {Request} ctx.request
   * @param {Response} ctx.response
   */
  async update ({ params, request, response, auth }) {

    const rules = {
      id : "required",
      category_id : "required",
      name : "required",
    }

    const validation = await validate(request.all(), rules, {
      'id.required' : "Edite uma receita para começar",
      'category_id.required' : "Selecione uma categoria.",
      'name.required' : "Uma receita sem nome não funciona =(",
    });

    if (validation.fails()) {
      return validation.messages();
    }

    const {category_id, name, steps, id, photo} = request.all();

    const getRecipe = await Recipe.query().where('user_id', auth.user.id).andWhere('id', id).first();

    if(!getRecipe.id){
      return response
      .status(405)
      .send({
        "error" : false,
        "message" : "Opss! Essa receita não parece pertencer a você."
      });
    }

    getRecipe.category_id = category_id;
    getRecipe.name = name;
    getRecipe.status = 2;



    if(await getRecipe.save()){
      steps.forEach(async element => {
        var step = await Steps.query().where('id', element.id).andWhere('recipe_id', id).first();

        step.order = element.order;
        step.description = element.description;

        await step.save();

    });
    }

    getRecipe.reload();
    return getRecipe;
  }

  /**
   * Delete a recipe with id.
   * DELETE recipes/:id
   *
   * @param {object} ctx
   * @param {Request} ctx.request
   * @param {Response} ctx.response
   */
  async destroy ({params, response, auth }) {
    const {id} = params;

    try{
      const getRecipe = await Recipe.query().where('user_id', auth.user.id).andWhere('id', id).first();

      if(getRecipe.delete()){
        return response
        .status(200)
        .send({
          "error" : false,
          "message" : "Ok! Receita excluída!"
        });
      }

      return response
        .status(400)
        .send({
          "error" : true,
          "message" : "Oppss! Erro ao Excluir a Receita!"
        });

    }catch(e){
      console.log(e.message);
      return response
      .status(404)
      .send({
        "error" : true,
        "message" : "Oppss! A receita que você está tentando excluir não parece ser sua!"
      });

    }

  }
}

module.exports = RecipeController
