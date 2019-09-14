'use strict';

/** @type {import('@adonisjs/lucid/src/Schema')} */
const Schema = use('Schema');

class RecipeTimeSchema extends Schema {
  up () {
    this.table('recipes', table => {
      table.string('prepare_time');
    });
  }

  down () {
    this.table('recipes', table => {
      table.dropColumn('prepare_time');
    });
  }
}

module.exports = RecipeTimeSchema;
