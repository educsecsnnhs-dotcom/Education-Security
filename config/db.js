// config/db.js
const mongoose = require('mongoose');


async function connectDB() {
const uri = process.env.MONGODB_URI;
if (!uri) throw new Error('MONGODB_URI is missing');
await mongoose.connect(uri, { dbName: process.env.MONGODB_DB || undefined });
console.log('✅ MongoDB connected');
}


module.exports = connectDB;
