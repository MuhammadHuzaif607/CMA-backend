var mongoose = require('mongoose');

var ContactSchema = new mongoose.Schema({
  user: {
    type: mongoose.Types.ObjectId,
    ref: 'user',
  },
  name: {
    type: String,
    unique: true,
  },
  email: {
    type: String,
  },
  phone: {
    type: String,
    require: true,
    uniquw: true,
  },
  relation: {
    type: String,
    default: 'personal',
  },
  created_at: {
    type: Date,
    default: Date.now(),
  },
});

module.exports = mongoose.model('Contact', ContactSchema);
