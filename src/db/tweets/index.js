const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const Comment = new Schema({
  message: { type: String, required: true },
  date: { type: String, required: true },
  user: { type: Schema.Types.ObjectId, ref: 'User' },
});

const TweetSchema = new Schema({
  message: { type: String },
  retweet: { type: Schema.Types.ObjectId, ref: 'Tweet' },
  date: { type: String, required: true },
  user: { type: Schema.Types.ObjectId, ref: 'User' },
  comments: { type: [Comment], default: [] },
});

module.exports = mongoose.model('Tweet', TweetSchema);
