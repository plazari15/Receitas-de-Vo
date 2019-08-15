const es = require('elasticsearch');

const ElasticSearch = new es.Client({
  host: 'https://search.pedrolazari.dev',
  log: 'trace'
});

module.exports = ElasticSearch;


