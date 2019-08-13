'use strict'

/** @typedef {import('@adonisjs/framework/src/Request')} Request */
/** @typedef {import('@adonisjs/framework/src/Response')} Response */
/** @typedef {import('@adonisjs/framework/src/View')} View */

const Recipe = use('App/Models/Recipe');

/**
 * Resourceful controller for interacting with myrecipes
 */
class MyRecipeController {
  /**
   * Show a list of all myrecipes.
   * GET myrecipes
   *
   * @param {object} ctx
   * @param {Request} ctx.request
   * @param {Response} ctx.response
   * @param {View} ctx.view
   */
  async index ({ request, response, auth }) {
    const { id }  = auth.user;

    const allRecipe = await Recipe
      .query()
      .where('user_id', id)
      .with('category')
      .with('tags')
      .fetch();

    if(allRecipe){
      return response
        .status(200)
        .send({
          'message' : "",
          'success' : true,
          'body' : allRecipe
        });
    }

    return response
        .status(404)
        .send({
          'message' : "Nenhuma receita encontrada",
          'success' : false,
          'body' : null
        });
  }
}

module.exports = MyRecipeController
