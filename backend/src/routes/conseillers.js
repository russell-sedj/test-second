"use strict";
const express = require("express");
const database = require("../db");
const auth = require("../middleware/auth");

const router = express.Router();

// GET all — public (triés par ordre)
router.get("/", (_req, res) => {
  const db = database.read();
  res.json((db.conseillers || []).slice().sort((a, b) => a.ordre - b.ordre));
});

// POST — admin only
router.post("/", auth, (req, res) => {
  const { nom, role, responsabilite, ordre } = req.body;
  if (!nom || !role) {
    return res.status(400).json({ message: "Nom et rôle sont obligatoires" });
  }
  const db = database.read();
  if (!db.conseillers) db.conseillers = [];
  const item = {
    id: database.nextId(db.conseillers),
    nom: String(nom).trim().slice(0, 100),
    role: String(role).trim().slice(0, 100),
    responsabilite: String(responsabilite || "")
      .trim()
      .slice(0, 200),
    ordre: parseInt(ordre) || db.conseillers.length + 1,
  };
  db.conseillers.push(item);
  database.write(db);
  res.status(201).json(item);
});

// PUT — admin only
router.put("/:id", auth, (req, res) => {
  const id = parseInt(req.params.id);
  const db = database.read();
  const idx = (db.conseillers || []).findIndex((c) => c.id === id);
  if (idx === -1)
    return res.status(404).json({ message: "Conseiller introuvable" });
  const { nom, role, responsabilite, ordre } = req.body;
  if (!nom || !role) {
    return res.status(400).json({ message: "Nom et rôle sont obligatoires" });
  }
  db.conseillers[idx] = {
    ...db.conseillers[idx],
    nom: String(nom).trim().slice(0, 100),
    role: String(role).trim().slice(0, 100),
    responsabilite: String(responsabilite || "")
      .trim()
      .slice(0, 200),
    ordre: parseInt(ordre) || db.conseillers[idx].ordre,
  };
  database.write(db);
  res.json(db.conseillers[idx]);
});

// DELETE — admin only
router.delete("/:id", auth, (req, res) => {
  const id = parseInt(req.params.id);
  const db = database.read();
  const idx = (db.conseillers || []).findIndex((c) => c.id === id);
  if (idx === -1)
    return res.status(404).json({ message: "Conseiller introuvable" });
  db.conseillers.splice(idx, 1);
  database.write(db);
  res.json({ message: "Conseiller supprimé" });
});

module.exports = router;
