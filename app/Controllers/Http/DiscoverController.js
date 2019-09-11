'use strict';

const Algolia = use('App/Services/Algolia');
const AlgoliaIndex = Algolia.initIndex('recipes');

class DiscoverController {
  async index ({ request, response, auth }) {
    const { search, hitsPerPage, page } = request.all();

    await AlgoliaIndex.search({
      query: (search == null ? '' : search),
      hitsPerPage: (hitsPerPage == null ? 10 : hitsPerPage),
      page: (page == null ? 1 : page),
    }).then(({ hits } = {}) => response.send({ hits }));
  }
}

module.exports = DiscoverController;
