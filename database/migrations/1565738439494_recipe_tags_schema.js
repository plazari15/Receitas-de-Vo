'use strict'

/** @type {import('@adonisjs/lucid/src/Schema')} */
const Schema = use('Schema')

class RecipeTagsSchema extends Schema {
  up () {
    this.create('recipe_tags', (table) => {
      table.increments()
      table.integer('recipe_id')
        .unsigned()
        .references('id')
        .inTable('recipes')
        .onUpdate('CASCADE')
        .onDelete('CASCADE')
      table.integer('tag_id')
        .unsigned()
        .references('id')
        .inTable('tags')
        .onUpdate('CASCADE')
        .onDelete('CASCADE')
      table.timestamps()
    })
  }

  down () {
    this.drop('recipe_tags')
  }
}

module.exports = RecipeTagsSchema
