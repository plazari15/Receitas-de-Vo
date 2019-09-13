'use strict';

/** @type {import('@adonisjs/lucid/src/Schema')} */
const Schema = use('Schema');

class MeasureSchema extends Schema {
  up () {
    this.create('measures', table => {
      table.increments();
      table.string('name');
      table.timestamps();
    });
  }

  down () {
    this.drop('measures');
  }
}

module.exports = MeasureSchema;
