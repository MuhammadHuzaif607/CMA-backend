const express = require('express');
const auth = require('../Middlewares/auth');
const app = express();
const User = require('../Model/User');
const bcrypt = require('bcryptjs');
const { check, validationResult } = require('express-validator');
const router = express.Router();
const jwt = require('jsonwebtoken');

// Routes /api/auth
// Describe get user info
// Acess private
router.get('/', auth, async (req, res) => {
  try {
    const id = req.user.id;
    const user = await User.findById(id).select('-password');
    return res.json(user);
  } catch (err) {
    console.log(err.message);
  }
});

// Routes /api/auth
// Describe user register
// Acess public
router.post(
  '/',
  [
    check('email', 'Please enter an email').isEmail(),
    check('password', 'Please enter password').exists(),
  ],
  async (req, res) => {
    const result = validationResult(req);
    if (!result.isEmpty()) {
      res.json({ msg: result.array });
    }
    try {
      const { email, password } = req.body;
      let user = await User.findOne({ email });
      if (!user) {
        return res
          .status(400)
          .json({ msg: 'User with this email does not exist' });
      }
      const isMatch = await bcrypt.compare(password, user.password);
      if (!isMatch) {
        return res.status(400).json({ msg: 'Invalid Password' });
      }
      const payload = {
        user: {
          id: user.id,
        },
      };

      jwt.sign(
        payload,
        process.env.Secret,
        {
          expiresIn: 3600000,
        },
        (err, token) => {
          if (err) throw err.message;
          return res.json({ token });
        }
      );
    } catch (err) {
      console.log(err.message);
      return res.status(500).json({
        msg: 'Server error',
      });
    }
  }
);

module.exports = router;
