/**
 * TeamController
 *
 * @description :: Server-side actions for handling incoming requests.
 * @help        :: See https://sailsjs.com/docs/concepts/actions
 */

module.exports = {
  createTeam: async function (req, res, next) {
    if (!req.body.name) {
      res.status(401);
      return res.json({error: '401 Unauthorized'});
    }

    const id = await sails.helpers.randomId(8);
    const user = await sails.models.user.findOne({appToken: req.headers.authorization});

    await sails.models.team.create({teamId: id, teamName: req.body.name, teamIcon: '', teamMember: [user.googleId]});

    return res.json({teamId: id});
  },
  joinTeam: async function (req, res, next) {
    if (!req.body.team_id) {
      res.status(401);
      return res.json({error: '401 Unauthorized'});
    }

    const user = await sails.models.user.findOne({appToken: req.headers.authorization});
    const team = await sails.models.team.findOne({teamId: req.body.team_id});

    if (team) {
      if (!team.teamMember.some(i => i === user.googleId)) {
        const userDb = sails.models.team.getDatastore().manager.collection('teams');
        await userDb.updateOne({teamId: team.teamId}, {'$push': {teamMember: user.googleId}});
      }

      return res.json({status: 'success'});
    } else {
      return res.json({status: 'failed'});
    }
  },
  leaveTeam: async function (req, res, next) {
    if (!req.body.team_id) {
      res.status(401);
      return res.json({error: '401 Unauthorized'});
    }

    const user = await sails.models.user.findOne({appToken: req.headers.authorization});
    const team = await sails.models.team.findOne({teamId: req.body.team_id});

    if (team) {
      if (team.teamMember.some(i => i === user.googleId)) {
        let teamMember = team.teamMember.filter(e => e !== user.googleId);
        await sails.models.team.updateOne({teamId: team.teamId}, {teamMember: teamMember})

        return res.json({status: 'success'});
      }
    }

    res.status(401);
    return res.json({error: '401 Unauthorized'});
  },
  teamInfo: async function (req, res, next) {
    if (!req.query.team_id) {
      res.status(401);
      return res.json({error: '401 Unauthorized'});
    }

    const user = await sails.models.user.findOne({appToken: req.headers.authorization});
    const team = await sails.models.team.findOne({teamId: req.query.team_id});

    if (team) {
      if (!team.teamMember.some(i => i === user.googleId)) {
        res.status(401);
        return res.json({error: '401 Unauthorized'});
      }

      const teamMember = await sails.models.user.find({googleId: {in: team.teamMember}});

      let teamMemberInfo = [];
      await Promise.all(teamMember.map(async (i) => {
        let accessToken = await sails.helpers.gAccessToken(i.googleId);
        let userInfo = (await sails.axios.get('https://www.googleapis.com/oauth2/v1/userinfo', { headers: { Authorization: "Bearer " + accessToken } })).data;

        teamMemberInfo.push({googleId: i.googleId, name: userInfo.name, picture: userInfo.picture});
      }));

      const teamInfo = {
        teamId: team.teamId,
        teamName: team.teamName,
        teamIcon: team.teamIcon,
        teamMember: teamMemberInfo
      };

      return res.json(teamInfo);
    }

    res.status(401);
    return res.json({error: '401 Unauthorized'});
  }
};

