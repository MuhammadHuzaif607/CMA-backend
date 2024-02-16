const express = require('express');
const { check, validationResult } = require('express-validator');
const User = require('../Model/User');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const router = express.Router();

// Routes /api/users
// Describe user Register
// Acess public
router.post(
  '/',
  [
    check('name', 'Please enter your name'),
    check('email', 'Please enter an email').isEmail(),
    check('password', 'Please enter password').isLength({ min: 8, max: 60 }),
  ],
  async (req, res) => {
    const result = validationResult(req);
    if (!result) {
      res.json({ msg: result.array });
    }
    try {
      const { email, name, password } = req.body;

      let user = await User.findOne({ email });
      if (user) {
        return res
          .status(400)
          .json({ msg: 'User with this email already exist' });
      }

      user = new User({
        name,
        email,
        password,
      });

      const salt = await bcrypt.genSalt(10);
      user.password = await bcrypt.hash(password, salt);

      await user.save();

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
