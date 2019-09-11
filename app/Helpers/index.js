'use strict';

const Recipe = use('App/Models/Recipe');

const moment = require('moment');


const generatePhotoName = async (name, ext) => {
  const recipeArr = name;

  const Time = moment({}).unix();

  const RecipeSlug = recipeArr.split(' ').join('-').toLowerCase();

  return `${RecipeSlug}-${Time}.${ext}`;
};


module.exports = {
  generatePhotoName,
};
