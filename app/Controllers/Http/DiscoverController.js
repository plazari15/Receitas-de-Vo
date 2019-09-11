'use strict';

const Algolia = use('App/Services/Algolia');
const AlgoliaIndex = Algolia.initIndex('recipes');

class DiscoverController {
  async index ({ request, response, auth }) {
    const { search } = request.all();

    const allRecipes = {};

    AlgoliaIndex.search({
      query: '',
      hitsPerPage: 2,
    },
    (err, { hits } = {}) => {
      if (err) throw err;

      console.log(hits);

      allRecipes = hits;
    });

    return response.send({ allRecipes });
  }
}

module.exports = DiscoverController;
