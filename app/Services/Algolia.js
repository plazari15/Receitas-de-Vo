const algolia = require('algoliasearch');
const Env = use('Env')


const Algolia = algolia(
  Env.get('ALGOLIA_APP_KEY'),
  Env.get('ALGOLIA_ADMIN_KEY'),
)

module.exports = Algolia;
