const express = require('express');
const Contact = require('../Model/Contact');
const User = require('../Model/User');
const { check, validationResult } = require('express-validator');
const auth = require('../Middlewares/auth');
const router = express.Router();

// Routes /api/contact
// Describe get all contacts
// Acess private
router.get('/', auth, async (req, res) => {
  try {
    const contacts = await Contact.find({ user: req.user.id }).sort({
      created_at: -1,
    });
    res.json(contacts);
  } catch (err) {
    console.log(err.message);
    res.status(500).json({
      msg: 'server error',
    });
  }
});

// Routes /api/contact
// Describe add new contact
// Acess private
router.post('/', [auth], async (req, res) => {
  const result = validationResult(req);
  if (!result.isEmpty()) {
    return res.status(400).json({ errors: result.array() });
  }
  const { name, email, phone, relation } = req.body;
  try {
    let contact = await new Contact({
      name,
      email,
      phone,
      relation,
      user: req.user.id,
    });

    contact.save();

    res.json(contact);
  } catch (err) {
    console.log(error.message);
    return res.status(500).json({ msg: 'Server error' });
  }
});

// Routes /api/contact:id
// Describe update contact
// Access private
router.put('/:id', auth, async (req, res) => {
  const id = req.params.id;
  const { name, email, phone } = req.body;
  try {
    let contactfields = {};
    if (name) contactfields.name = name;
    if (email) contactfields.email = email;
    if (phone) contactfields.phone = phone;

    let contact = await Contact.findById(id);

    if (!contact) {
      return res.status(400).json({ msg: 'Contact not found' });
    }

    if (req.user.id.toString() !== contact.user.toString()) {
      return res.status(401).json({ msg: 'Invalid authorization' });
    }

    contact = await Contact.findByIdAndUpdate(
      id,
      { $set: contactfields },
      { new: true }
    );

    return res.json({ msg: 'Contact updated', contact: contact });
  } catch (err) {
    console.log(err.message);
    return res.status(500).json({ msg: 'Server error' });
  }
});


// Routes /api/contact:id
// Describe delete contact
// Access private
router.delete('/:id', auth, async (req, res) => {
  const id = req.params.id;
  try {
    let contact = await Contact.findById(id);
    if (!contact) {
      res.status(400).json({ msg: 'Contact not found' });
    }

    if (req.user.id.toString() !== contact.user.toString()) {
      return res.status(401).json({ msg: 'Invalid authorization' });
    }

    await Contact.findByIdAndDelete(id);

    res.send('Contact deleted');
  } catch (err) {
    console.log(err.message);
    res.status(500).json({ msg: 'Server error' });
  }
});

module.exports = router;
