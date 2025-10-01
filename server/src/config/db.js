const { Sequelize } = require('sequelize');
const mongoose = require('mongoose');
require('dotenv').config();

// PostgreSQL
const sequelize = new Sequelize(process.env.PG_DB, process.env.PG_USER, process.env.PG_PASSWORD, {
  host: process.env.PG_HOST,
  dialect: 'postgres',
});

// MongoDB
const connectMongo = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log(' MongoDB connected');
  } catch (err) {
    console.error(' MongoDB connection error', err);
  }
};

module.exports = { sequelize, connectMongo };
