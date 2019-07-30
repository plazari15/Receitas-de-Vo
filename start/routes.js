'use strict'

/*
|--------------------------------------------------------------------------
| Routes
|--------------------------------------------------------------------------
|
| Http routes are entry points to your web application. You can create
| routes for different URLs and bind Controller actions to them.
|
| A complete guide on routing is available here.
| http://adonisjs.com/docs/4.1/routing
|
*/

/** @type {typeof import('@adonisjs/framework/src/Route/Manager')} */
const Route = use('Route')

require
Route.get('/', () => {
  return { greeting: 'Hello world in JSON TEDSDS' }
})

Route.group(() => {
  Route.post('/register', 'AuthController.register')
  Route.post('/login', 'AuthController.authenticate')
  Route.get('/user', 'AuthController.checkUser').middleware(['auth:jwt'])
}).prefix('/api/v1/auth')

Route.group(() => {
  Route.get('/all', 'CategoryController.getAll')
}).prefix('/api/v1/categories')

// Route.post('/auth', 'AuthController.authenticate').middleware(['auth'])
