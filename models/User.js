const mongoose = require("mongoose");

const User = mongoose.model("User", {
  email: String,
  account: {
    username: String,
    avatar: Object,
  },
  email: String,
  salt: String,
  hash: String,
  token: String,
  newsletter: Boolean,
});
module.exports = User;
