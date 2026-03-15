"use strict";
const express = require("express");
const database = require("../db");
const auth = require("../middleware/auth");

const router = express.Router();

// GET all — public
router.get("/", (_req, res) => {
  const db = database.read();
  res.json((db.services || []).slice().sort((a, b) => a.id - b.id));
});

// POST — admin only
router.post("/", auth, (req, res) => {
  const { titre, description, details, bgIcon, iconColor, borderColor } =
    req.body;
  if (!titre || !description) {
    return res
      .status(400)
      .json({ message: "Titre et description sont obligatoires" });
  }
  const db = database.read();
  if (!db.services) db.services = [];
  const item = {
    id: database.nextId(db.services),
    titre: String(titre).trim().slice(0, 100),
    description: String(description).trim().slice(0, 500),
    details: Array.isArray(details)
      ? details
          .map((d) => String(d).trim())
          .filter(Boolean)
          .slice(0, 20)
      : String(details || "")
          .split("\n")
          .map((d) => d.trim())
          .filter(Boolean)
          .slice(0, 20),
    bgIcon: String(bgIcon || "bg-blue-100"),
    iconColor: String(iconColor || "text-blue-700"),
    borderColor: String(borderColor || "border-blue-200"),
  };
  db.services.push(item);
  database.write(db);
  res.status(201).json(item);
});

// PUT — admin only
router.put("/:id", auth, (req, res) => {
  const id = parseInt(req.params.id);
  const db = database.read();
  const idx = (db.services || []).findIndex((s) => s.id === id);
  if (idx === -1)
    return res.status(404).json({ message: "Service introuvable" });
  const { titre, description, details, bgIcon, iconColor, borderColor } =
    req.body;
  if (!titre || !description) {
    return res
      .status(400)
      .json({ message: "Titre et description sont obligatoires" });
  }
  db.services[idx] = {
    ...db.services[idx],
    titre: String(titre).trim().slice(0, 100),
    description: String(description).trim().slice(0, 500),
    details: Array.isArray(details)
      ? details
          .map((d) => String(d).trim())
          .filter(Boolean)
          .slice(0, 20)
      : String(details || "")
          .split("\n")
          .map((d) => d.trim())
          .filter(Boolean)
          .slice(0, 20),
    bgIcon: String(bgIcon || "bg-blue-100"),
    iconColor: String(iconColor || "text-blue-700"),
    borderColor: String(borderColor || "border-blue-200"),
  };
  database.write(db);
  res.json(db.services[idx]);
});

// DELETE — admin only
router.delete("/:id", auth, (req, res) => {
  const id = parseInt(req.params.id);
  const db = database.read();
  const idx = (db.services || []).findIndex((s) => s.id === id);
  if (idx === -1)
    return res.status(404).json({ message: "Service introuvable" });
  db.services.splice(idx, 1);
  database.write(db);
  res.json({ message: "Service supprimé" });
});

module.exports = router;
