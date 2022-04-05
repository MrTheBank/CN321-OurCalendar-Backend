/**
 * Route Mappings
 * (sails.config.routes)
 *
 * Your routes tell Sails what to do each time it receives a request.
 *
 * For more information on configuring custom routes, check out:
 * https://sailsjs.com/anatomy/config/routes-js
 */

module.exports.routes = {
  'GET /auth/google' : 'AuthController.googleAuth',
  'GET /auth/google/callback' : 'AuthController.googleCallback',
  'POST /auth/google/token' : 'AuthController.exchangeToken',

  'GET /user/info' : 'UserController.userInfo',
};
