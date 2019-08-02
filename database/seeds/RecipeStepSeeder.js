'use strict'

/*
|--------------------------------------------------------------------------
| RecipeStepSeeder
|--------------------------------------------------------------------------
|
| Make use of the Factory instance to seed database with dummy data or
| make use of Lucid models directly.
|
*/

/** @type {import('@adonisjs/lucid/src/Factory')} */
const Factory = use('Factory')
const RecipeStep = use('App/Models/RecipesStep')

class RecipeStepSeeder {
  async run () {

    const data = [
      {
        "recipe_id" : 1,
        "order" : "1",
        "description" :  "Lave o Arroz",
      },
      {
        "recipe_id" : 1,
        "order" : "3",
        "description" :  "Despeje a agua no Arroz",
      },
      {
        "recipe_id" : 1,
        "order" : "2",
        "description" :  "Refogue tudo",
      },
      {
        "recipe_id" : 3,
        "order" : "1",
        "description" :  "Lave o Arroz",
      },
      {
        "recipe_id" : 2,
        "order" : "1",
        "description" :  "Lave o Arroz",
      },
    ]

    for (var i = 0; i < data.length; i++){
      await RecipeStep.create(data[i]);
    }
  }
}

module.exports = RecipeStepSeeder
