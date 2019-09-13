'use strict';

/** @type {typeof import('@adonisjs/lucid/src/Lucid/Model')} */
const Model = use('Model');

class RecipesIngredient extends Model {
  static get table () {
    return 'recipes_ingredients';
  }
}

module.exports = RecipesIngredient;
