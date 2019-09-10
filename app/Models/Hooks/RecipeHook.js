'use strict'

const RecipeHook = exports = module.exports = {}

const Model = use('App/Models/Recipe');
const Algolia = use('App/Services/Algolia');

const AlgoliaIndex = Algolia.initIndex('recipes');

RecipeHook.sendSearch = async (recipe) => {
  const recipeComplete = await Model.find(recipe.id);

  const recipeUser = await recipeComplete.user().fetch();
  const recipeCategory = await recipeComplete.category().fetch();

  AlgoliaIndex.addObjects([{
    id: recipe.id,
    post_date: recipe.created_at,
    name: recipe.name,
    description : recipe.description,
    user_name: recipeUser.name,
    username: recipeUser.username,
    category_name: recipeCategory.name,
    category_description: recipeCategory.description,
  }], (err) => {
    if(err){
      console.log('Erro no Algolia');
      console.log(err);
    }
  })
}
