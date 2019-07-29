'use strict'

/*
|--------------------------------------------------------------------------
| UserSeeder
|--------------------------------------------------------------------------
|
| Make use of the Factory instance to seed database with dummy data or
| make use of Lucid models directly.
|
*/

/** @type {import('@adonisjs/lucid/src/Factory')} */
const Factory = use('Factory')
const User = use('App/Models/User')

class UserSeeder {
  async run () {
    const data = {
      "email" : "plazari96@gmail.com",
      "name" : "Pedro",
      "password" : "PEDRO",
      "username" : "plazari"
    };

    const user = await User.create(data);
  }
}

module.exports = UserSeeder
