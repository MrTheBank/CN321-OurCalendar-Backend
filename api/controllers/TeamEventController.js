/**
 * TeamEventController
 *
 * @description :: Server-side actions for handling incoming requests.
 * @help        :: See https://sailsjs.com/docs/concepts/actions
 */

module.exports = {
  addEvent: async function (req, res, next) {
    if (!req.body.team_id || !req.body.event || !req.body.type) {
      res.status(401);
      return res.json({error: '401 Unauthorized'});
    }

    const user = await sails.models.user.findOne({appToken: req.headers.authorization});
    const team = await sails.models.team.findOne({teamId: req.body.team_id});

    if (team) {
      if (team.teamMember.some(i => i === user.googleId) && (req.body.type === 'event' || req.body.type === 'todo')) {
        const id = await sails.helpers.randomId(6);
        await sails.models.teamevent.create({
          teamId: team.teamId,
          eventId: id,
          event: JSON.parse(req.body.event),
          type: req.body.type
        });

        return res.json({id: id});
      }
    }

    res.status(401);
    return res.json({error: '401 Unauthorized'});
  },
  editEvent: async function (req, res, next) {
    if (!req.body.team_id || !req.body.event || !req.body.event_id) {
      res.status(401);
      return res.json({error: '401 Unauthorized'});
    }

    const user = await sails.models.user.findOne({appToken: req.headers.authorization});
    const event = await sails.models.teamevent.findOne({teamId: req.body.team_id, eventId: req.body.event_id});
    const team = await sails.models.team.findOne({teamId: req.body.team_id});

    if (team && event) {
      if (team.teamMember.some(i => i === user.googleId)) {
        await sails.models.teamevent.updateOne({teamId: team.teamId, eventId: event.eventId}, {event: JSON.parse(req.body.event)});

        return res.json({status: 'success'});
      }
    }

    res.status(401);
    return res.json({error: '401 Unauthorized'});
  },
  deleteEvent: async function (req, res, next) {
    if (!req.body.team_id || !req.body.event_id) {
      res.status(401);
      return res.json({error: '401 Unauthorized'});
    }

    const user = await sails.models.user.findOne({appToken: req.headers.authorization});
    const event = await sails.models.teamevent.findOne({teamId: req.body.team_id, eventId: req.body.event_id});
    const team = await sails.models.team.findOne({teamId: req.body.team_id});

    if (team && event) {
      if (team.teamMember.some(i => i === user.googleId)) {
        await sails.models.teamevent.destroyOne({eventId: event.eventId});

        return res.json({status: 'success'});
      }
    }

    res.status(401);
    return res.json({error: '401 Unauthorized'});
  },
  eventsList: async function (req, res, next) {
    if (!req.query.team_id) {
      res.status(401);
      return res.json({error: '401 Unauthorized'});
    }

    const user = await sails.models.user.findOne({appToken: req.headers.authorization});
    const events = await sails.models.teamevent.find({teamId: req.query.team_id});
    const team = await sails.models.team.findOne({teamId: req.query.team_id});

    if (team) {
      if (team.teamMember.some(i => i === user.googleId)) {
        let event = {};
        await Promise.all(events.map(i => {
          event = {...event, [i.eventId]: i.event}
        }));

        return res.json(event);
      }
    }

    res.status(401);
    return res.json({error: '401 Unauthorized'});
  }
};

