'use strict'

const Recipe = use('App/Models/Recipe')

var moment = require('moment');


const generatePhotoName = async (id, ext) => {
  const recipe = await Recipe.find(id);

  const recipeArr = recipe.name;

  const Time = moment({}).unix()

  const RecipeSlug =  recipeArr.split(' ').join('-').toLowerCase();

  return RecipeSlug + '-' + Time + '.' + ext;
}




module.exports = {
  generatePhotoName
}
