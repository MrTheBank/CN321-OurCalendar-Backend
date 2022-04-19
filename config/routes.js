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
  'POST /user/export' : 'UserController.userExport',
  'GET /user/import' : 'UserController.userImport',

  'GET /calendar/list' : 'CalendarController.eventsList',

  'POST /team/create' : 'TeamController.createTeam',
  'POST /team/join' : 'TeamController.joinTeam',
  'POST /team/leave' : 'TeamController.leaveTeam',
  'GET /team/info' : 'TeamController.teamInfo',

  'POST /team/event/add' : 'TeamEventController.addEvent',
  'POST /team/event/edit' : 'TeamEventController.editEvent',
  'POST /team/event/delete' : 'TeamEventController.deleteEvent',
  'GET /team/event/list' : 'TeamEventController.eventsList',
};
