/**
 * AuthController
 *
 * @description :: Server-side actions for handling incoming requests.
 * @help        :: See https://sailsjs.com/docs/concepts/actions
 */

module.exports = {
  googleAuth: function (req, res, next) {
    if (!req.query.device) {
      res.status(401);
      return res.json({error: '401 Unauthorized'});
    }

    return sails.passport.authenticate('google', {
      scope: ['profile', 'email', 'https://www.googleapis.com/auth/calendar'],
      accessType: 'offline',
      prompt : 'consent',
      state: req.query.device
    })(req, res, next);
  },
  googleCallback: function (req, res, next) {
    return sails.passport.authenticate('google', async function (err, respond) {
      if (!req.query.state) {
        res.status(401);
        return res.json({error: '401 Unauthorized'});
      }
      // Generate and store temporary token.
      const tempToken = sails.crypto.randomBytes(16).toString('hex');
      const uniqueId = Buffer.from(req.query.state, 'base64').toString('ascii');
      await sails.models.temporarytoken.create({googleId: respond.profile.id, uniqueId: uniqueId, tempToken: tempToken});

      // Check and store user information.
      if (await sails.models.user.findOne({googleId: respond.profile.id})) {
        const userDb = sails.models.user.getDatastore().manager.collection('users');
        await userDb.updateOne({googleId: respond.profile.id}, {'$push': {device: uniqueId}}); // Push new unique device id.
        await sails.models.user.updateOne({googleId: respond.profile.id}, {refreshToken: respond.refreshToken}); // Update refresh token.
      } else {
        const appToken = sails.crypto.randomBytes(16).toString('hex');
        await sails.models.user.create({googleId: respond.profile.id, appToken: appToken, device: [uniqueId], refreshToken: respond.refreshToken});
      }

      // return res.json(tempToken); // for testing.
      return res.redirect('our://calendar.tu.ac.th?temp=' + tempToken);
    })(req, res, next);
  },
  exchangeToken: async function (req, res, next) {
    if (!req.body.device || !req.body.token) {
      res.status(401);
      return res.json({error: '401 Unauthorized'});
    }

    const uniqueId = Buffer.from(req.body.device, 'base64').toString('ascii');

    // Check if unique ID and temporary token is same in database.
    const respond = await sails.models.temporarytoken.findOne({uniqueId: uniqueId, tempToken: req.body.token});
    if (respond) {
      const user = await sails.models.user.findOne({googleId: respond.googleId});
      await sails.models.temporarytoken.destroyOne({tempToken: req.body.token});
      return res.json({token: user.appToken});
    } else {
      res.status(401);
      return res.json({error: '401 Unauthorized', description: 'Temporary token or device ID not found.'});
    }
  }
};

