const express = require("express");
const database = require("../db");
const auth = require("../middleware/auth");

const router = express.Router();

// GET all — public
router.get("/", (_req, res) => {
  const db = database.read();
  res.json([...db.actualites].sort((a, b) => b.id - a.id));
});

// POST — admin only
router.post("/", auth, (req, res) => {
  const { titre, description, categorie, date, badge_class, bg_class } =
    req.body;
  if (!titre || !description || !categorie || !date) {
    return res.status(400).json({ message: "Champs obligatoires manquants" });
  }
  const db = database.read();
  const item = {
    id: database.nextId(db.actualites),
    titre,
    description,
    categorie,
    date,
    badge_class: badge_class || "bg-blue-100 text-blue-700",
    bg_class: bg_class || "bg-gradient-to-br from-blue-500 to-blue-700",
    created_at: new Date().toISOString(),
  };
  db.actualites.push(item);
  database.write(db);
  res.status(201).json(item);
});

// PUT — admin only
router.put("/:id", auth, (req, res) => {
  const id = parseInt(req.params.id);
  const db = database.read();
  const idx = db.actualites.findIndex((a) => a.id === id);
  if (idx === -1)
    return res.status(404).json({ message: "Actualité introuvable" });
  const { titre, description, categorie, date, badge_class, bg_class } =
    req.body;
  db.actualites[idx] = {
    ...db.actualites[idx],
    titre,
    description,
    categorie,
    date,
    badge_class,
    bg_class,
  };
  database.write(db);
  res.json(db.actualites[idx]);
});

// DELETE — admin only
router.delete("/:id", auth, (req, res) => {
  const id = parseInt(req.params.id);
  const db = database.read();
  const idx = db.actualites.findIndex((a) => a.id === id);
  if (idx === -1)
    return res.status(404).json({ message: "Actualité introuvable" });
  db.actualites.splice(idx, 1);
  database.write(db);
  res.json({ message: "Actualité supprimée" });
});

module.exports = router;
