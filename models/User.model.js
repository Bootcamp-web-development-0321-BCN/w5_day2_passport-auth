const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const userSchema = new Schema({
  username: { type: String, required: true, unique: true },
  password: { type: String },
  slackID: { type: String },
  role: {
    type: String,
    enum: ["User", "Admin", "Editor"],
    default: "User"
  },
  profile_pic: { type: String, default: "https://upload.wikimedia.org/wikipedia/commons/7/7c/Profile_avatar_placeholder_large.png" }
})

const User = mongoose.model('User', userSchema);

module.exports = User;