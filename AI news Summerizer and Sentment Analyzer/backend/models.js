const mongoose = require('mongoose');

const ArticleSchema = new mongoose.Schema({
  headline: String,
  source: String,
  url: String,
  summary: String,
  sentiment: String,
  publishedAt: Date,
  keywords: [String],
  createdAt: { type: Date, default: Date.now }
});

const SearchLogSchema = new mongoose.Schema({
  keyword: String,
  userIP: String,
  searchedAt: { type: Date, default: Date.now }
});

const AdminSchema = new mongoose.Schema({
  username: String,
  password: String, // hashed
  apiKeys: {
    newsApi: String
  }
});

module.exports = {
  Article: mongoose.model('Article', ArticleSchema),
  SearchLog: mongoose.model('SearchLog', SearchLogSchema),
  Admin: mongoose.model('Admin', AdminSchema)
};
