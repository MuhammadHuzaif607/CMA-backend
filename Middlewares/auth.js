const jwt = require('jsonwebtoken');
module.exports = function (req, res, next) {
  const token = req.header('Authorization');
  if (!token) {
    return res.status(401).json({ msg: 'Authorization denied ,token missing' });
  }
  try {
    const decoded = jwt.verify(token, process.env.Secret);
    req.user = decoded.user;

    next();
  } catch (err) {
    console.log(err.message);
    res.status(401).json({ msg: 'Invalid token' });
  }
};
