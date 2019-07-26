'use strict'

/** @type {import('@adonisjs/lucid/src/Schema')} */
const Schema = use('Schema')

class RecipesCommentsSchema extends Schema {
  up () {
    this.create('recipes_comments', (table) => {
      table.increments()
      table.integer('user_id').unsigned().references('id').inTable('users');
      table.integer('recipe_id').unsigned().references('id').inTable('recipes');
      table.string('title')
      table.text('comment')
      table.float('grade', null, null)
      table.timestamps()
    })
  }

  down () {
    this.drop('recipes_comments')
  }
}

module.exports = RecipesCommentsSchema
