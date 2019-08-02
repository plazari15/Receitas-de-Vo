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

    const RecipesData = [
      {
        "user_id" : "1",
        "category_id" : '1',
        "name" : "Arroz",
        "photo" : "http://photo.com",
        "status" : "1",
      },
      {
        "user_id" : "1",
        "category_id" : '1',
        "name" : "Feijão a moda mineira",
        "photo" : "http://photo.com/1",
        "status" : "1",
      },{
        "user_id" : "1",
        "category_id" : '1',
        "name" : "Arroz de Forno",
        "photo" : "http://photo.com/2",
        "status" : "1",
      }
    ]
    
    for (var i = 0; i < RecipesData.length; i++){
      await Recipe.create(RecipesData[i]);
    }
  }
}

module.exports = RecipeSeeder
