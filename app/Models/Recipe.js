'use strict'

/** @type {typeof import('@adonisjs/lucid/src/Lucid/Model')} */
const Model = use('Model')

class Recipe extends Model {

    user(){
        return this.belongsTo('App/Models/User')
    }

    category(){
        return this.belongsTo('App/Models/Category')
    }

    steps(){
        return this.hasMany('App/Models/RecipesStep')
    }
}

module.exports = Recipe
