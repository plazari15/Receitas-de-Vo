'use strict';

/*
|--------------------------------------------------------------------------
| MeasureSeeder
|--------------------------------------------------------------------------
|
| Make use of the Factory instance to seed database with dummy data or
| make use of Lucid models directly.
|
*/

/** @type {import('@adonisjs/lucid/src/Factory')} */
const Factory = use('Factory');
const Measure = use('App/Models/Measure');

class MeasureSeeder {
  async run () {
    const data = [
      {
        name: 'Litro',
      },
      {
        name: 'Cálice',
      },
      {
        name: 'Colher de Sopa',
      },
      {
        name: 'Colher de Sobremesa',
      },
      {
        name: 'Colher de Chá',
      },
      {
        name: 'Colher de Café',
      },
      {
        name: 'Xícara',
      },
      {
        name: 'Copo',
      },
      {
        name: 'Copo Américano (200 ml)',
      },
    ];

    for (let i = 0; i < data.length; i++) {
      await Measure.create(data[i]);
    }
  }
}

module.exports = MeasureSeeder;
