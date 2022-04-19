module.exports = {


  friendlyName: 'Google Access Token',


  description: 'Return google access token from refresh token that stored in database.',


  inputs: {
    googleId: {
      type: 'string',
      required: true
    }
  },


  fn: async function (inputs) {
    const refreshToken = await sails.models.user.findOne({googleId: inputs.googleId});

    if (refreshToken) {
      const res = await sails.axios.post('https://oauth2.googleapis.com/token', new URLSearchParams({
        client_id: process.env.GOOGLE_CLIENT_ID,
        client_secret: process.env.GOOGLE_CLIENT_SECRET,
        grant_type: 'refresh_token',
        refresh_token: refreshToken.refreshToken
      }));

      if (res.data.access_token) {
        return res.data.access_token
      }
    }

    return null;
  }


};

