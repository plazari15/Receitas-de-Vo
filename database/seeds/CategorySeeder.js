'use strict'

/*
|--------------------------------------------------------------------------
| CategorySeeder
|--------------------------------------------------------------------------
|
| Make use of the Factory instance to seed database with dummy data or
| make use of Lucid models directly.
|
*/

/** @type {import('@adonisjs/lucid/src/Factory')} */
const Factory = use('Factory')
const Category = use('App/Models/Category')

class CategorySeeder {
  async run () {

    const data = [
      {
        "name" : "BASICO",
        "short_description" : "Receitas Simples para o dia a dia ",
      },
      {
        "name" : "MEDIO",
        "short_description" : "Receitas Medias para o dia a dia ",
      },
      {
        "name" : "DIFICIL",
        "short_description" : "Receitas Dificeis para o dia a dia ",
      }
    ];

    for(var i=0; i < data.length; i++){
      await Category.create(data[i]);
    }
  }
}

module.exports = CategorySeeder
