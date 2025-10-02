const { Sequelize } = require("sequelize");
const mongoose = require("mongoose");

const pgHost = process.env.POSTGRES_HOST;
const pgPort = Number(process.env.POSTGRES_PORT || 5432);
const pgDb   = process.env.POSTGRES_DB;
const pgUser = process.env.POSTGRES_USER;
const pgPass = process.env.POSTGRES_PASSWORD;

const sequelize = new Sequelize(pgDb, pgUser, pgPass, {
  host: pgHost,
  port: pgPort,
  dialect: "postgres",
  logging: false,
});

const connectSQL = async (retries = 12, delayMs = 2500) => {
 
  console.log(`Trying Postgres @ ${pgHost}:${pgPort}/${pgDb} as ${pgUser}`);
  while (retries) {
    try {
      await sequelize.authenticate();
      console.log("Postgres connected");
      await sequelize.sync(); 
      console.log("Postgres synced");
      return;
    } catch (e) {
      retries -= 1;
      console.error(`Postgres connect failed (${retries} left):`, e.message);
      if (!retries) throw e;
      await new Promise(r => setTimeout(r, delayMs));
    }
  }
};

const mongoUri = process.env.MONGO_URI;

const connectMongo = async (retries = 12, delayMs = 2500) => {
  console.log(`Trying Mongo @ ${mongoUri}`);
  while (retries) {
    try {
      await mongoose.connect(mongoUri);
      console.log("MongoDB connected");
      return;
    } catch (e) {
      retries -= 1;
      console.error(`Mongo connect failed (${retries} left):`, e.message);
      if (!retries) throw e;
      await new Promise(r => setTimeout(r, delayMs));
    }
  }
};

module.exports = { sequelize, connectSQL, connectMongo };
