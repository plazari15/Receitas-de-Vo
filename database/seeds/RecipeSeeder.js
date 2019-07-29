'use strict'

/*
|--------------------------------------------------------------------------
| RecipeSeeder
|--------------------------------------------------------------------------
|
| Make use of the Factory instance to seed database with dummy data or
| make use of Lucid models directly.
|
*/

/** @type {import('@adonisjs/lucid/src/Factory')} */
const Factory = use('Factory')
const Recipe = use('App/Models/Recipe')

class RecipeSeeder {
  async run () {
    
  }
}

module.exports = RecipeSeeder
