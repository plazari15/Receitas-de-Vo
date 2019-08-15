'use strict'

const { Command } = require('@adonisjs/ace')

const ElasticSearch = use('App/Services/ElasticSearch');

class CheckSearch extends Command {
  static get signature () {
    return 'check:search'
  }

  static get description () {
    return 'Check if ElastichSearch Node is Online!'
  }

  async handle (args, options) {
    this.info('Iniciando Ping no servidor de ElasticSearch')

    await ElasticSearch.ping({
      requestTimeout: 1000
    }, (error) => {
      if(error){
        this.error('Servidor FORA!')
      }else{
        this.info('Servidor ONLINE!')
      }
    });
  }
}

module.exports = CheckSearch
