'use strict';

/** @type {typeof import('@adonisjs/lucid/src/Lucid/Model')} */
const Model = use('Model');

class RecipesStep extends Model {
  static get table () {
    return 'recipes_steps';
  }
}

module.exports = RecipesStep;
