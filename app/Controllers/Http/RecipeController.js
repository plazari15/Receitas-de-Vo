'use strict'

const Recipe = use('App/Models/Recipe');


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
      data = await Recipe.query()
      .where('user_id', user)
      .fetch();
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

    return {
      "success" : true,
      "message" : null,
      "body"    : data
    }

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
