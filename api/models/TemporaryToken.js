/**
 * TemporaryToken.js
 *
 * @description :: A model definition represents a database table/collection.
 * @docs        :: https://sailsjs.com/docs/concepts/models-and-orm/models
 */

module.exports = {

  tableName: 'temporary_tokens',

  attributes: {
    googleId: {
      type: 'string',
      required: true
    },
    uniqueId: {
      type: 'string',
      required: true
    },
    tempToken: {
      type: 'string',
      required: true
    }
  },

};

