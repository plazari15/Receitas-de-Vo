'use strict'

const Recipe = use('App/Models/Recipe');
const Steps = use('App/Models/RecipesStep');
const Database = use('Database')


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

    const {category, term, user, index } = request.all();

    var data = [];

    if(category !== undefined){
     data = await Recipe.query().where('category_id', category).fetch();
    }

    if(term !== undefined){
      data = await Recipe.query().where('name', 'LIKE', term).fetch();
    }

    if(user !== undefined){
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
        .where('users.username', user)
    }

    if(index !== undefined){
      data = await Recipe.all();
    }

    if(data.length > 0){
      return {
        "success" : false,
        "message" : "Nada encontrado. Tente novamente",
        "body"    : data
      }
    }

    return response.status(404).send({
      "success" : true,
      "message" : null,
      "body"    : data
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
      "photo" : "dfs",
      "status" : "2"
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
        "message" : "Receita criada. A publicação da mesma pode ocorrer em até 24 horas."
      });
    }


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
  async update ({ params, request, response }) {
  }

  /**
   * Delete a recipe with id.
   * DELETE recipes/:id
   *
   * @param {object} ctx
   * @param {Request} ctx.request
   * @param {Response} ctx.response
   */
  async destroy ({ params, request, response }) {
  }
}

module.exports = RecipeController
