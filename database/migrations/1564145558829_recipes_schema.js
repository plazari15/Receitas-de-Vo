'use strict'

/** @type {import('@adonisjs/lucid/src/Schema')} */
const Schema = use('Schema')

class RecipesSchema extends Schema {
  up () {
    this.create('recipes', (table) => {
      table.increments()
      table.integer('user_id').unsigned().references('id').inTable('users');
      table.integer('category_id').unsigned().references('id').inTable('categories');
      table.string('name');
      table.string('short_description');
      table.text('description');
      table.string('photo');
      table.integer('status')
      table.timestamps()
    })
  }

  down () {
    this.drop('recipes')
  }
}

module.exports = RecipesSchema
