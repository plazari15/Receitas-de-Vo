'use strict';

/** @typedef {import('@adonisjs/framework/src/Request')} Request */
/** @typedef {import('@adonisjs/framework/src/Response')} Response */
/** @typedef {import('@adonisjs/framework/src/View')} View */

const User = use('App/Models/User');
const { validate } = use('Validator');
/**
 * Resourceful controller for interacting with users
 */
class UserController {
  /**
   * Render a form to be used for creating a new user.
   * GET users/create
   *
   * @param {object} ctx
   * @param {Request} ctx.request
   * @param {Response} ctx.response
   * @param {View} ctx.view
   */
  async create ({ request, response, view }) {
    const rules = {
      username: 'required|unique:users,username',
      email: 'required|unique:users,email|email',
      password: 'required',
      name: 'required',
      lastname: 'required',
    };

    const isValid = await validate(request.all(), rules);

    if (isValid.fails()) {
      return response.status(400)
        .json({
          success: false,
          message: isValid.messages(),
        });
    }
    const {
      username, email, password, name, lastname,
    } = request.all();

    const user = await User.create({
      username,
      name,
      lastname,
      email,
      password,
    });

    if (user.id) {
      return response.status(201)
        .json({
          success: true,
          message: 'Usuário criado com sucesso',
          data: user.id,
        });
    }

    return response.status(200)
      .json({
        success: true,
        message: 'Ok!',
      });
  }

  /**
   * Create/save a new user.
   * POST users
   *
   * @param {object} ctx
   * @param {Request} ctx.request
   * @param {Response} ctx.response
   */
  async store ({ request, response }) {
  }

  /**
   * Display a single user.
   * GET users/:id
   *
   * @param {object} ctx
   * @param {Request} ctx.request
   * @param {Response} ctx.response
   * @param {View} ctx.view
   */
  async show ({
    params, request, response, view,
  }) {
  }

  /**
   * Render a form to update an existing user.
   * GET users/:id/edit
   *
   * @param {object} ctx
   * @param {Request} ctx.request
   * @param {Response} ctx.response
   * @param {View} ctx.view
   */
  async edit ({
    params, request, response, view,
  }) {
  }

  /**
   * Update user details.
   * PUT or PATCH users/:id
   *
   * @param {object} ctx
   * @param {Request} ctx.request
   * @param {Response} ctx.response
   */
  async update ({ params, request, response }) {
  }

  /**
   * Delete a user with id.
   * DELETE users/:id
   *
   * @param {object} ctx
   * @param {Request} ctx.request
   * @param {Response} ctx.response
   */
  async destroy ({ params, request, response }) {
  }
}

module.exports = UserController;
