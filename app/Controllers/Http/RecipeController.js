'use strict'

const Recipe = use('App/Models/Recipe');
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
  async store ({ request, response }) {
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
  async show ({ params, request, response, view }) {
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
