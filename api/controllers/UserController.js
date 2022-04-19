/**
 * UserController
 *
 * @description :: Server-side actions for handling incoming requests.
 * @help        :: See https://sailsjs.com/docs/concepts/actions
 */

module.exports = {
  userInfo: async function (req, res, next) {
    const user = await sails.models.user.findOne({appToken: req.headers.authorization});
    const accessToken = await sails.helpers.gAccessToken(user.googleId);
    const userInfo = await sails.axios.get('https://www.googleapis.com/oauth2/v1/userinfo', { headers: { Authorization: "Bearer " + accessToken } });
    return res.json(userInfo.data);
  },
  userExport: async function (req, res, next) {
    const user = await sails.models.user.findOne({appToken: req.headers.authorization});
    const info = await sails.models.userevent.find({googleId: user.googleId});

    if (info.length !== 0) {
      await sails.models.userevent.updateOne({type: 'event', googleId: user.googleId}, {event: JSON.parse(req.body.events)});
      await sails.models.userevent.updateOne({type: 'todo', googleId: user.googleId}, {event: JSON.parse(req.body.todos)});
    } else {
      await sails.models.userevent.create({
        googleId: user.googleId,
        event: JSON.parse(req.body.events),
        type: 'event'
      });

      await sails.models.userevent.create({
        googleId: user.googleId,
        event: JSON.parse(req.body.todos),
        type: 'todo'
      });
    }

    return res.json({info: 'success'});
  },
  userImport: async function (req, res, next) {
    const user = await sails.models.user.findOne({appToken: req.headers.authorization});

    const events = await sails.models.userevent.findOne({googleId: user.googleId, type: 'event'});
    const todos = await sails.models.userevent.findOne({googleId: user.googleId, type: 'todo'});

    return res.json({events: events.event, todos: todos.event});
  }
};

