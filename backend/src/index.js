require("dotenv").config();
const express = require("express");
const cors = require("cors");
const path = require("path");
const bcrypt = require("bcryptjs");

const app = express();
const PORT = process.env.PORT || 3000;

// Hash admin password once on startup (never stored on disk)
app.locals.adminPasswordHash = bcrypt.hashSync(process.env.ADMIN_PASSWORD, 10);

// Middleware
app.use(
  cors({
    origin: (process.env.CORS_ORIGIN || "http://localhost:4200").split(","),
    credentials: true,
  }),
);
app.use(express.json());

// Routes
app.use("/api/auth", require("./routes/auth"));
app.use("/api/actualites", require("./routes/actualites"));
app.use("/api/contact", require("./routes/contact"));
app.use("/api/conseillers", require("./routes/conseillers"));
app.use("/api/services", require("./routes/services"));
app.use("/api/documents", require("./routes/documents"));

app.get("/api/health", (_req, res) =>
  res.json({ status: "ok", service: "Mairie de Mbaling API" }),
);

app.listen(PORT, () => {
  console.log(`API Mairie de Mbaling demarree sur le port ${PORT}`);
  console.log(`Sante : http://localhost:${PORT}/api/health`);
});
