'use strict';

const RecipeHook = module.exports;

const Model = use('App/Models/Recipe');
const Algolia = use('App/Services/Algolia');

const AlgoliaIndex = Algolia.initIndex('recipes');

RecipeHook.sendSearch = async recipe => {
  const recipeComplete = await Model.find(recipe.id);

  if (recipe.status !== 1) {
    console.log('AQUI NÂO VAI PRO ALGOLIA');
    return true;
  }

  const recipeUser = await recipeComplete.user().fetch();
  const recipeCategory = await recipeComplete.category().fetch();


  const arrayTags = [];

  const AlgoliaObj = {
    objectID: recipe.algolia_id,
    id: recipe.id,
    post_date: recipe.created_at,
    name: recipe.name,
    description: recipe.description,
    user_name: recipeUser.name,
    username: recipeUser.username,
    category_name: recipeCategory.name,
    category_description: recipeCategory.description,
    tags: arrayTags,
  };

  if (recipe.algolia_id != undefined) {
    AlgoliaIndex.saveObject(AlgoliaObj, err => {
      if (err) {
        console.log('Erro no Algolia');
        console.log(err);
      }
    });
  } else {
    AlgoliaIndex.addObject(AlgoliaObj, async (err, content) => {
      if (err) {
        console.log('Erro no Algolia ao criar');
        console.log(err);
      }

      try {
        if (content.objectID) {
          recipeComplete.algolia_id = content.objectID;
          await recipeComplete.save();
        }
      } catch (e) {
        console.log(e);
      }
    });
  }
};
