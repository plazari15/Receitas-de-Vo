'use strict';

/** @type {import('@adonisjs/lucid/src/Schema')} */
const Schema = use('Schema');

class AlgoliaIndexSchema extends Schema {
  up () {
    this.table('recipes', table => {
      table.string('algolia_id');
    });
  }

  down () {
    this.table('recipes', table => {
      table.dropColumn('algolia_id');
    });
  }
}

module.exports = AlgoliaIndexSchema;
