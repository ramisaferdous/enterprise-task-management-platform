require("dotenv").config(); // keep at very top

const express = require("express");
const helmet  = require("helmet");
const cors    = require("cors");
const { errors } = require("celebrate");
const { connectSQL, connectMongo } = require("./config/db");

const authRoutes    = require("./routes/authRoutes");
const projectRoutes = require("./routes/projectRoutes");
const taskRoutes    = require("./routes/taskRoutes");

const app = express();

// Security + CORS
app.use(errors());
app.use(helmet());
app.use(cors({
  origin: (process.env.CORS_ORIGINS || "http://localhost:3000").split(",").map(s => s.trim()),
  credentials: true,
  methods: ["GET","POST","PATCH","PUT","DELETE","OPTIONS"],
  allowedHeaders: ["Content-Type","Authorization"],
}));
app.options("*", cors());
app.use(express.json({ limit: "1mb" }));

// Health
app.get("/healthz", (_req,res)=>res.json({ok:true}));
app.get("/healthz/db", async (_req,res)=>{
  const mongoState = require("mongoose").connection.readyState; // 1 connected
  res.json({ ok:true, mongoState });
});

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/projects", projectRoutes);
app.use("/api/tasks", taskRoutes);

// Fallback JSON
app.use((req, res) => res.status(404).json({ msg: "Not found" }));


const PORT = process.env.PORT || 5000;

// Boot with explicit error output
(async () => {
  try {
    await connectSQL();
    await connectMongo();
    app.listen(PORT, "0.0.0.0", () => console.log(`Server running on :${PORT}`));
  } catch (e) {
    console.error("DB boot error:", e && (e.stack || e.message || e));
    // Don’t loop forever; let container restart policy retry.
    process.exit(1);
  }
})();
