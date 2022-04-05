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
  }
};

