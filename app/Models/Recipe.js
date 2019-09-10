'use strict';

/** @type {typeof import('@adonisjs/lucid/src/Lucid/Model')} */
const Model = use('Model');

class Recipe extends Model {
  user () {
    return this.belongsTo('App/Models/User');
  }


  static boot () {
    super.boot();
    this.addHook('afterCreate', 'RecipeHook.sendSearch');
  }

  category () {
    return this.belongsTo('App/Models/Category');
  }

  steps () {
    return this.hasMany('App/Models/RecipesStep');
  }

  tags () {
    return this
      .belongsToMany('App/Models/Tag')
      .pivotTable('recipe_tags');
  }
}

module.exports = Recipe;
