// server/models/newsItem.js
const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const newsItemSchema = new Schema({
  url: String,
  hackerNewsUrl: String,
  postedOn: Date,
  upvotes: { type: Number, default: 0 },
  comments: { type: Number, default: 0 },
  upvoters: [{ type: Schema.Types.ObjectId, ref: 'User' }], // Assuming 'User' is your User model
});

module.exports = mongoose.model('NewsItem', newsItemSchema);
