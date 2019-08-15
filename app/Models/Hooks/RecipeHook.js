'use strict'

const RecipeHook = exports = module.exports = {}

const Model = use('App/Models/Recipe');
const ElasticSearch = use('App/Services/ElasticSearch');

RecipeHook.sendSearch = async (recipe) => {
  const recipeComplete = await Model.find(recipe.id);

  console.log(recipeComplete.user);

  ElasticSearch.index({
    index: "receita-index",
    id: recipe.id,
    type: 'recipe_index',
    body : {
      post_date: recipe.created_at,
      id: recipe.id,
      name: recipe.name,
      user: recipeComplete.user().fetch(),
      category: recipeComplete.category().fetch(),
      tags: recipeComplete.tags().fetch()
    }
  })
}
