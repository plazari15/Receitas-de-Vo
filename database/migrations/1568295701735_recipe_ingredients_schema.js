'use strict';

/** @type {import('@adonisjs/lucid/src/Schema')} */
const Schema = use('Schema');

class RecipeIngredientsSchema extends Schema {
  up () {
    this.create('recipe_ingredients', table => {
      table.increments();
      table.integer('recipe_id')
        .unsigned()
        .references('id')
        .inTable('recipes')
        .onUpdate('CASCADE')
        .onDelete('CASCADE');
      table.integer('measure_id')
        .unsigned()
        .references('id')
        .inTable('measures');
      table.string('name').notNullable();
      table.float('quantity', [10, 2]).notNullable();
      table.timestamps();
    });
  }

  down () {
    this.drop('recipe_ingredients');
  }
}

module.exports = RecipeIngredientsSchema;
