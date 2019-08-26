'use strict'

/** @type {import('@adonisjs/lucid/src/Schema')} */
const Schema = use('Schema')

class AddPrivacityOnRecipeSchema extends Schema {
  up () {
      this.table('recipes', (table) => {
      table.bigInteger('privacy')
      .comment('1 = PUBLICO | 2 = PRIVADO | 3 = NAO LISTADO')
      .notNullable()
      .defaultTo(2);
    })
  }

  down () {
    this.table('recipes', (table) => {
      table.dropColumn('privacy');
    })
  }
}

module.exports = AddPrivacityOnRecipeSchema
