/**
 * TeamEvent.js
 *
 * @description :: A model definition represents a database table/collection.
 * @docs        :: https://sailsjs.com/docs/concepts/models-and-orm/models
 */

module.exports = {

  tableName: 'team_events',

  attributes: {
    teamId: {
      type: 'string',
      required: true
    },
    eventId: {
      type: 'string',
      required: true
    },
    event: {
      type: 'json',
      required: true
    },
    type: {
      type: 'string',
      required: true
    }
  },

};

