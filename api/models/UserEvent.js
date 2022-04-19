/**
 * UserEvent.js
 *
 * @description :: A model definition represents a database table/collection.
 * @docs        :: https://sailsjs.com/docs/concepts/models-and-orm/models
 */

module.exports = {

  tableName: 'user_events',

  attributes: {
    googleId: {
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

