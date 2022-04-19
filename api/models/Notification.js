/**
 * Notification.js
 *
 * @description :: A model definition represents a database table/collection.
 * @docs        :: https://sailsjs.com/docs/concepts/models-and-orm/models
 */

module.exports = {

  attributes: {
    googleId: {
      type: 'string',
      required: true
    },
    read: {
      type: 'boolean',
      required: true
    },
    eventId: {
      type: 'string',
      required: true
    }
  },

};

