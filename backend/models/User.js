const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  name: String,
  email: { type: String, unique: true },
  password: String,
  role: { type: String, enum: ["user", "admin", "moderator"], default: "user" },
  isVerified: { type: Boolean, default: false },
  verificationCode: { type: String },
  gender: { type: String }, 
  address: { type: String }, 
  phoneNumber: { type: String }, 
});


module.exports = mongoose.model("User", userSchema);