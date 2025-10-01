const express = require('express');
const { sequelize, connectMongo } = require('./config/db');
const authRoutes = require("./routes/authRoutes");
const projectRoutes = require("./routes/projectRoutes");
const taskRoutes = require("./routes/taskRoutes");
require('dotenv').config();

const app = express();

app.use(express.json());
app.use("/api/auth", authRoutes);
app.use("/api/projects", projectRoutes);
app.use("/api/tasks", taskRoutes);


// connect SQL
sequelize.sync({ alter: true }) 
  .then(() => console.log("Postgres connected & synced"))
  .catch(err => console.error("Postgres connection error", err));


connectMongo();


app.get("/", (req, res) => {
  res.send("Enterprise Task Management API Running 🚀");
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));

