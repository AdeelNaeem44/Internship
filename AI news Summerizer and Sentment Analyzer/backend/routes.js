
const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { Admin } = require('./models');

// Admin login
router.post('/admin/login', async (req, res) => {
  const { username, password } = req.body;
  const admin = await Admin.findOne({ username });
  if (!admin) return res.status(401).json({ error: 'Invalid credentials' });
  const valid = await bcrypt.compare(password, admin.password);
  if (!valid) return res.status(401).json({ error: 'Invalid credentials' });
  const token = jwt.sign({ id: admin._id, username: admin.username }, process.env.JWT_SECRET || 'secret', { expiresIn: '1d' });
  res.json({ token });
});

// Middleware for admin auth
function adminAuth(req, res, next) {
  const auth = req.headers.authorization;
  if (!auth) return res.status(401).json({ error: 'No token' });
  try {
    const token = auth.split(' ')[1];
    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'secret');
    req.admin = decoded;
    next();
  } catch {
    res.status(401).json({ error: 'Invalid token' });
  }
}

// Get/set NewsAPI key (admin)
router.get('/admin/apikey', adminAuth, async (req, res) => {
  const admin = await Admin.findOne({ username: req.admin.username });
  res.json({ newsApi: admin.apiKeys.newsApi });
});
router.post('/admin/apikey', adminAuth, async (req, res) => {
  const { newsApi } = req.body;
  await Admin.updateOne({ username: req.admin.username }, { $set: { 'apiKeys.newsApi': newsApi } });
  res.json({ success: true }
  );
});

// Get search logs (admin)
router.get('/admin/searchlogs', adminAuth, async (req, res) => {
  const logs = await SearchLog.find().sort({ searchedAt: -1 }).limit(100);
  res.json({ logs });
});
// GET /api/analytics/sentiment
router.get('/analytics/sentiment', async (req, res) => {
  try {
    const data = await Article.aggregate([
      { $group: { _id: "$sentiment", count: { $sum: 1 } } }
    ]);
    res.json({ sentimentDistribution: data });
  } catch (err) {
    res.status(500).json({ error: 'Failed to get sentiment distribution' });
  }
});


// GET /api/analytics/wordcloud
router.get('/analytics/wordcloud', async (req, res) => {
  try {
    const articles = await Article.find({}, 'keywords');
    const freq = {};
    articles.forEach(a => {
      (a.keywords || []).forEach(k => { freq[k] = (freq[k] || 0) + 1; });
    });
    const wordCloud = Object.entries(freq).sort((a, b) => b[1] - a[1]).slice(0, 30);
    res.json({ wordCloud });
  } catch (err) {
    res.status(500).json({ error: 'Failed to get word cloud' });
  }
});

// GET /api/analytics/trend
router.get('/analytics/trend', async (req, res) => {
  try {
    const last7 = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);
    const data = await Article.aggregate([
      { $match: { publishedAt: { $gte: last7 } } },
      { $group: {
        _id: { day: { $dateToString: { format: "%Y-%m-%d", date: "$publishedAt" } }, sentiment: "$sentiment" },
        count: { $sum: 1 }
      } },
      { $sort: { '_id.day': 1 } }
    ]);
    res.json({ trend: data });
  } catch (err) {
    res.status(500).json({ error: 'Failed to get trend data' });
  }
});

const axios = require('axios');
const { Article, SearchLog } = require('./models');

// GET /api/news?keyword=xxx
router.get('/news', async (req, res) => {
  const keyword = req.query.keyword;
  if (!keyword) return res.status(400).json({ error: 'Keyword required' });
  try {
    // Log search
    await SearchLog.create({ keyword, userIP: req.ip });

    // Fetch news from NewsAPI
    const newsRes = await axios.get('https://newsapi.org/v2/everything', {
      params: {
        q: keyword,
        sortBy: 'publishedAt',
        pageSize: 2, // Only fetch 2 articles for speed
        apiKey: process.env.NEWS_API_KEY
      }
    });
    const articles = newsRes.data.articles;

    // For each article, summarize and analyze sentiment via AI service
    const results = await Promise.all(articles.map(async (art) => {
      // Summarize
      const sumRes = await axios.post(process.env.AI_SERVICE_URL + '/summarize', { text: art.content || art.description || art.title });
      // Sentiment
      const sentRes = await axios.post(process.env.AI_SERVICE_URL + '/sentiment', { text: art.content || art.description || art.title });
      // Keywords
      const kwRes = await axios.post(process.env.AI_SERVICE_URL + '/keywords', { text: art.content || art.description || art.title });
      // Save to DB
      const dbArt = await Article.create({
        headline: art.title,
        source: art.source.name,
        url: art.url,
        summary: sumRes.data.summary,
        sentiment: sentRes.data.sentiment,
        publishedAt: art.publishedAt,
        keywords: kwRes.data.keywords.map(k => k[0])
      });
      return {
        headline: dbArt.headline,
        source: dbArt.source,
        url: dbArt.url,
        summary: dbArt.summary,
        sentiment: dbArt.sentiment,
        publishedAt: dbArt.publishedAt,
        keywords: dbArt.keywords
      };
    }));
    res.json({ articles: results });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to fetch news' });
  }
});

module.exports = router;
