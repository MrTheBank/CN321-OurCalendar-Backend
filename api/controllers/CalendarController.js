/**
 * CalendarController
 *
 * @description :: Server-side actions for handling incoming requests.
 * @help        :: See https://sailsjs.com/docs/concepts/actions
 */
const { RRule } = require('rfc5545-rrule');

module.exports = {
  eventsList: async function (req, res, next) {
    const user = await sails.models.user.findOne({appToken: req.headers.authorization});
    const accessToken = await sails.helpers.gAccessToken(user.googleId);
    const list = (await sails.axios.get('https://www.googleapis.com/calendar/v3/calendars/primary/events', {
      headers: { Authorization: "Bearer " + accessToken }
    })).data;

    let ret = {};
    list.items.map((item) => {
      let recurrence = RRule.fromString(item.recurrence ? String(item.recurrence) : '');
      let recUntil = recurrence?.until ? new Date(recurrence.until) : new Date(new Date().getFullYear()+1, 0, 1);
      let endTime = new Date(item.end.dateTime);
      let end = recurrence?.frequency ? new Date(recUntil.getFullYear(), recUntil.getMonth(), recUntil.getDate(), endTime.getHours(), endTime.getMinutes()) : endTime;
      let repeat = () => {
        switch (recurrence?.frequency) {
          case 'daily':
            return 'Daily';
          case 'weekly':
            return 'Weekly';
          case 'monthly':
            return 'Monthly';
          case 'yearly':
            return 'Annually';
          default:
            return 'None';
        }
      }

      const newItem = {
        id: item.id,
        created: item.created,
        updated: item.updated,
        title: item.summary,
        start: new Date(item.start.dateTime),
        end: end,
        repeat: repeat(),
        color: '#ffffff',
        icon: {
          font: 'FontAwesome5',
          name: 'calendar-alt'
        }
      }
      ret = {...ret, [item.id] :newItem};
    });

    return res.json(ret);
  }
};

