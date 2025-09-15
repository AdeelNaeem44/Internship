// Run this script ONCE to create an initial admin user
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const { Admin } = require('./models');
require('dotenv').config();

async function createAdmin() {
  await mongoose.connect(process.env.MONGO_URI);
  const hash = await bcrypt.hash('adminpassword', 10);
  await Admin.create({ username: 'admin', password: hash, apiKeys: { newsApi: process.env.NEWS_API_KEY || '' } });
  console.log('Admin user created');
  process.exit();
}
createAdmin();
