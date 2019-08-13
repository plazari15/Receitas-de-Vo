'use strict'

/** @type {import('@adonisjs/lucid/src/Schema')} */
const Schema = use('Schema')

class TagsSchema extends Schema {
  up () {
    this.create('tags', (table) => {
      table.increments();
      table.string('name');
      table.string('description');
      table.string('type');
      table.bigInteger('status')
        .comment('0 = DESATIVADO | 1 = Ativado')
      table.timestamps();
    })
  }

  down () {
    this.drop('tags')
  }
}

module.exports = TagsSchema
