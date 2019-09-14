'use strict';

/** @type {typeof import('@adonisjs/lucid/src/Lucid/Model')} */
const Model = use('Model');

class Recipe extends Model {
  user () {
    return this.belongsTo('App/Models/User');
  }


  static boot () {
    super.boot();
    this.addHook('afterSave', 'RecipeHook.sendSearch');
    this.addHook('afterDelete', 'RecipeHook.deleteRecipe');
  }

  category () {
    return this.belongsTo('App/Models/Category');
  }

  steps () {
    return this.hasMany('App/Models/RecipesStep');
  }

  ingredients () {
    return this.hasMany('App/Models/RecipesIngredient');
  }

  tags () {
    return this
      .belongsToMany('App/Models/Tag')
      .pivotTable('recipe_tags', 'recipe_id', 'tag_id', 'id', 'id');
  }
}

module.exports = Recipe;
