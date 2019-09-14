'use strict';

const Recipe = use('App/Models/Recipe');
const Steps = use('App/Models/RecipesStep');
const Tag = use('App/Models/Tag');
const Ingredientes = use('App/Models/RecipesIngredient');
const Database = use('Database');
const { validate } = use('Validator');
const Driver = use('Drive');
const { generatePhotoName } = use('App/Helpers');

/**
 * Resourceful controller for interacting with recipes
 */
class RecipeController {
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
      category_id: 'required',
      prepare: 'required',
      name: 'required',
      cover: 'required',
      tags: 'required',
      status: 'required',
      privacy: 'required',
      'ingredients.*.name': 'required',
      'ingredients.*.quantity': 'required',
      'ingredients.*.measure_id': 'required',
    };

    const validation = await validate(request.all(), rules, {
      'category_id.required': 'Selecione uma categoria.',
      'prepare.required': 'Insira o tempo de preparo em minutos',
      'name.required': 'Uma receita sem nome não funciona =(',
      'cover.required': 'Envie uma foto.',
      'tags.required': 'Selecione pelo menos 1 Tag',
      'status.required': 'Selecione um status para sua receita',
      'privacy.required': 'PRIVACy é um campo obrigatório, 1 = publico / 2 = privado',
      'ingredients.*.name.required': 'Insira o nome dos ingredientes',
      'ingredients.*.quantity.required': 'Insira a quantidade dos ingredientes',
      'ingredients.*.measure_id.required': 'Insira uma unidade de medida para o ingrediente',

    });

    if (validation.fails()) {
      return validation.messages();
    }

    const {
      category_id, name, steps, cover, tags, status, privacy, prepare, ingredients,
    } = request.all();

    if (await !auth.check()) {
      return response
        .status(401)
        .send({
          error: true,
          message: 'Somente usuários logados podem enviar receitas',
        });
    }

    const typeImage = cover.split(';')[0].split('/')[1];
    const imageName = await generatePhotoName(name, typeImage);
    const Image = Buffer.from(cover.replace(/^data:image\/\w+;base64,/, ''), 'base64');

    await Driver.disk('s3').put(imageName, Image, {
      ACL: 'public-read',
      Body: Image,
      ContentEncoding: 'base64',
      ContentType: `image/${typeImage}`,
    });

    const data = {
      user_id: auth.user.id,
      category_id,
      name,
      status,
      photo: imageName,
      privacy,
      prepare_time: prepare,
    };

    const recipeCreated = await Recipe.create(data);

    if (recipeCreated.id !== '') {
      steps.forEach(async element => {
        const step = new Steps();
        step.order = element.order;
        step.description = element.description;

        await recipeCreated.steps().save(step);
      });
    }

    if (recipeCreated.id !== '') {
      ingredients.forEach(async element => {
        const ing = new Ingredientes();
        ing.name = element.name;
        ing.quantity = element.quantity;
        ing.measure_id = element.measure_id;

        await recipeCreated.ingredients().save(ing);
      });
    }

    if (recipeCreated.id !== '') {
      const tagsId = [];
      tags.forEach(async element => {
        const tagId = await Tag.findOrCreate({
          name: element,
        }, {
          type: 'recipe',
          name: element,
        });

        tagsId.push(tagId.id);
      });

      await recipeCreated.tags().sync(tagsId);
    }


    if (recipeCreated.id !== '') {
      return response
        .status(201)
        .send({
          error: false,
          message: 'Receita criada. A publicação da mesma pode ocorrer em até 24 horas.',
          recipe_id: recipeCreated.id,
        });
    }

    return response
      .status(500)
      .send({
        error: true,
        message: 'Erro ao criar Receita. Tente novamente',
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
    const { id } = params;

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
   * PUT or \PATCH recipes/:id
   *
   * @param {object} ctx
   * @param {Request} ctx.request
   * @param {Response} ctx.response
   */
  async update ({
    params, request, response, auth,
  }) {
    const rules = {
      category_id: 'required',
      name: 'required',
      tags: 'required',
      steps: 'required',
      privacy: 'required',
      prepare: 'required',
      'ingredients.*.name': 'required',
      'ingredients.*.quantity': 'required',
      'ingredients.*.measure_id': 'required',
    };

    const validation = await validate(request.all(), rules, {
      'category_id.required': 'Selecione uma categoria.',
      'name.required': 'Uma receita sem nome não funciona =(',
      'tags.required': 'Insira as tags da sua receita',
      'steps.required': 'Insira o passo a passo da sua receita',
      'privacy.required': 'Defina a privacidade da sua receita',
      'prepare.required': 'Defina o tempo de preparo',
      'ingredients.*.name.required': 'Insira o nome dos ingredientes',
      'ingredients.*.quantity.required': 'Insira a quantidade dos ingredientes',
      'ingredients.*.measure_id.required': 'Insira uma unidade de medida para o ingrediente',
    });

    if (validation.fails()) {
      return validation.messages();
    }

    const {
      category_id, name, steps, cover, tags, status, description, privacy, prepare, ingredients,
    } = request.all();

    const getRecipe = await Recipe.query().where('user_id', auth.user.id).andWhere('id', params.id).first();

    if (!getRecipe.id) {
      return response
        .status(405)
        .send({
          error: false,
          message: 'Opss! Essa receita não parece pertencer a você.',
        });
    }

    getRecipe.category_id = category_id;
    getRecipe.name = name;
    getRecipe.status = status;
    getRecipe.description = description;
    getRecipe.privacy = privacy;
    getRecipe.prepare_time = prepare;
    if (cover !== undefined) {
      const typeImage = cover.split(';')[0].split('/')[1];
      const imageName = await generatePhotoName(name, typeImage);
      const Image = Buffer.from(cover.replace(/^data:image\/\w+;base64,/, ''), 'base64');

      await Driver.disk('s3').put(imageName, Image, {
        ACL: 'public-read',
        Body: Image,
        ContentEncoding: 'base64',
        ContentType: `image/${typeImage}`,
      });

      getRecipe.cover = imageName;
    }


    if (await getRecipe.save()) {
      steps.forEach(async element => {
        if (element.id !== undefined) {
          const step = await Steps.query().where('id', element.id).andWhere('recipe_id', params.id).first();

          step.order = element.order;
          step.description = element.description;

          await step.save();
        } else {
          const step = new Steps();
          step.order = element.order;
          step.description = element.description;

          await getRecipe.steps().save(step);
        }
      });


      ingredients.forEach(async element => {
        if (element.id !== undefined) {
          const ingcreated = await Ingredientes.query().where('id', element.id).andWhere('recipe_id', params.id).first();

          ingcreated.name = element.name;
          ingcreated.quantity = element.quantity;
          ingcreated.measure_id = element.measure_id;

          ingcreated.save();
        } else {
          const ing = new Ingredientes();
          ing.name = element.name;
          ing.quantity = element.quantity;
          ing.measure_id = element.measure_id;

          await getRecipe.ingredients().save(ing);
        }
      });

      if (getRecipe.id !== '') {
        const tagsId = [];
        tags.forEach(async element => {
          const tagId = await Tag.findOrCreate({
            name: element,
          }, {
            type: 'recipe',
            name: element,
          });

          tagsId.push(tagId.id);
        });

        await getRecipe.tags().sync(tagsId);
      }
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
  async destroy ({ params, response, auth }) {
    const { id } = params;

    try {
      const getRecipe = await Recipe.query().where('user_id', auth.user.id).andWhere('id', id).first();

      if (getRecipe.delete()) {
        return response
          .status(200)
          .send({
            error: false,
            message: 'Ok! Receita excluída!',
          });
      }

      return response
        .status(400)
        .send({
          error: true,
          message: 'Oppss! Erro ao Excluir a Receita!',
        });
    } catch (e) {
      console.log(e.message);
      return response
        .status(404)
        .send({
          error: true,
          message: 'Oppss! A receita que você está tentando excluir não foi encontrada em sua conta!',
        });
    }
  }

  async deleteStep ({ params, response, auth }) {
    const { id, recipe_id } = params;

    try {
      const getRecipe = await Recipe.query().where('user_id', auth.user.id).andWhere('id', recipe_id).first();

      const step = await Steps.query()
        .where('id', id)
        .andWhere('recipe_id', recipe_id)
        .first();

      if (step.delete()) {
        return response
          .status(200)
          .send({
            error: false,
            message: 'Ok! Passo excluído!',
          });
      }
    } catch (e) {
      console.log(e.message);
      return response
        .status(404)
        .send({
          error: true,
          message: 'Oppss! Você tentou excluir um passo de receita que não pertence a você.',
        });
    }

    return response
      .status(500)
      .send({
        error: true,
        message: 'Erro Geral',
      });
  }

  async deleteIngredient ({ params, response, auth }) {
    const { id, recipe_id } = params;

    try {
      const getRecipe = await Recipe.query().where('user_id', auth.user.id).andWhere('id', recipe_id).first();

      const ingredient = await Ingredientes.query()
        .where('id', id)
        .andWhere('recipe_id', recipe_id)
        .first();

      if (ingredient.delete()) {
        return response
          .status(200)
          .send({
            error: false,
            message: 'Ok! Ingrediente excluído!',
          });
      }
    } catch (e) {
      console.log(e.message);
      return response
        .status(404)
        .send({
          error: true,
          message: 'Oppss! Você tentou excluir um Ingrediente de uma receita que não pertence a você.',
        });
    }

    return response
      .status(500)
      .send({
        error: true,
        message: 'Erro Geral',
      });
  }
}

module.exports = RecipeController;
