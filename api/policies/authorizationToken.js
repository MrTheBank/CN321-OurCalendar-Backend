module.exports = async function (req, res, next) {
  if (!req.headers.authorization || !req.headers.device) {
    res.status(401);
    return res.json({error: '401 Unauthorized', description: 'Authorization or device required.'});
  }

  const user = await sails.models.user.findOne({appToken: req.headers.authorization});
  if (!user) {
    res.status(403);
    return res.json({error: '401 Unauthorized', description: 'Authorization token not found.'});
  }

  const uniqueId = Buffer.from(req.headers.device, 'base64').toString('ascii');
  if (!user.device.some(i => i === uniqueId)) {
    res.status(403);
    return res.json({error: '401 Unauthorized', description: 'Device not authorized.'});
  }

  return next();
}
