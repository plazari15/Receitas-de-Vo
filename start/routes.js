'use strict';

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
const Route = use('Route');

Route.get('/', () => ({ greeting: 'Hello world in PM2' }));

Route.group(() => {
  Route.post('/register', 'UserController.create');
  Route.post('/login', 'AuthController.authenticate');
  Route.put('/user/update/:id', 'UserController.update').middleware(['auth:jwt']);
}).prefix('/api/v1/auth');

Route.group(() => {
  Route.resource('/recipes', 'RecipeController')
    .apiOnly()
    .middleware(new Map([
      [['store', 'update', 'destroy'], ['auth:jwt']],
    ]));
  Route.post('recipes/:id/photo', 'RecipeController.photoUpload')
    .middleware('auth:jwt');

  Route.delete('recipes/step/:recipe_id/:id', 'RecipeController.deleteStep').middleware('auth:jwt');

  Route.get('my-recipes', 'MyRecipeController.index')
    .middleware('auth:jwt');
}).prefix('/api/v1/');


Route.group(() => {
  Route.get('/all', 'CategoryController.getAll');
}).prefix('/api/v1/categories');

// Route.post('/auth', 'AuthController.authenticate').middleware(['auth'])
