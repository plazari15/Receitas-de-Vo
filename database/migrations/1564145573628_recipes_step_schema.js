'use strict'

/** @type {import('@adonisjs/lucid/src/Schema')} */
const Schema = use('Schema')

class RecipesStepSchema extends Schema {
  up () {
    this.create('recipes_steps', (table) => {
      table.increments()
      table.integer('recipe_id')
        .unsigned()
        .references('id')
        .inTable('recipes')
        .onUpdate('CASCADE')
        .onDelete('CASCADE')
      table.integer('order')
      table.text('description')
      table.string('photo')
      table.timestamps()
    })
  }

  down () {
    this.drop('recipes_steps')
  }
}

module.exports = RecipesStepSchema
