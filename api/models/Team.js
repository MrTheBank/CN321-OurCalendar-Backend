/**
 * Team.js
 *
 * @description :: A model definition represents a database table/collection.
 * @docs        :: https://sailsjs.com/docs/concepts/models-and-orm/models
 */

module.exports = {

  tableName: 'teams',

  attributes: {
    teamId: {
      type: 'string',
      required: true
    },
    teamName: {
      type: 'string',
    },
    teamIcon: {
      type: 'string',
    },
    teamMember: {
      type: 'json',
      columnType: 'array',
      required: true
    },
  },

};

