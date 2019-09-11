'use strict'

/** @type {import('@adonisjs/lucid/src/Schema')} */
const Schema = use('Schema')

class RecipeDescriptionSchema extends Schema {
  up () {
    this.table('recipes', (table) => {
      table.text('description');
    })
  }

  down () {
    this.table('recipes', (table) => {
      table.dropColumn('description');
    })
  }
}

module.exports = RecipeDescriptionSchema
