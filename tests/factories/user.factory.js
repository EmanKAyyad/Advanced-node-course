const mongoose = require("mongoose");
const User = mongoose.model("User");

module.exports = () => {
  const now = Date.now();
  return new User({
    displayName: `User ${now}`,
  }).save();
};
