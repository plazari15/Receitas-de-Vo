'use strict';

const cat = use('App/Models/Category');

class CategoryController {
  async getAll () {
    const categories = cat.all();

    return categories;
  }
}

module.exports = CategoryController;
