const mongoose = require("mongoose");

const tweetSchema = mongoose.Schema({
  text: String,
  creationDate: Date,
  numberOfLikes: Number,
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'users'},
  hashtag: []
});

const Tweet = mongoose.model("tweets", tweetSchema);

module.exports = Tweet;