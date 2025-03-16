const mongoose = require("mongoose");

const customerSchema = new mongoose.Schema({
  firstName: { type: String, required: true },
  lastName: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  username: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  address: { type: String, required: true },
  contactInfo: { type: String, required: true },
  birthday: { type: Date, required: true },
  gender: { type: String, required: true },
});

module.exports = mongoose.model("Customer", customerSchema);