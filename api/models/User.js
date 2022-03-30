/**
 * User.js
 *
 * @description :: A model definition represents a database table/collection.
 * @docs        :: https://sailsjs.com/docs/concepts/models-and-orm/models
 */

module.exports = {

  tableName: 'users',

  attributes: {
    googleId: {
      type: 'string',
      required: true,
      unique: true
    },
    appToken: {
      type: 'string',
      required: true
    },
    device: {
      type: 'json',
      columnType: 'array',
      required: true
    },
    refreshToken: {
      type: 'string',
      required: true
    }
  },

};

