const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  name: String,
  balance: { type: Number, default: 0 },
  orderId: String
});

const User = mongoose.model('User', userSchema);

module.exports = User;
