'use strict'

const RecipeHook = exports = module.exports = {}

const Model = use('App/Models/Recipe');
const Algolia = use('App/Services/Algolia');

const AlgoliaIndex = Algolia.initIndex('recipes');

RecipeHook.sendSearch = async (recipe) => {
  console.log(recipe);

  AlgoliaIndex.addObjects([{
    id: recipe.id,
    post_date: recipe.created_at,
    name: recipe.name,
  }], (err) => {
    if(err){
      console.log('Erro no Algolia');
      console.log(err);
    }
  })
}
