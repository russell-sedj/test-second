const express = require("express");
const pool = require("../mysql");
const auth = require("../middleware/auth");

const router = express.Router();

router.get("/", async (_req, res) => {
  try {
    const [rows] = await pool.query(
      "SELECT * FROM conseillers ORDER BY ordre ASC",
    );
    res.json(rows);
  } catch (error) {
    res.status(500).json({ message: "Erreur serveur" });
  }
});

router.post("/", auth, async (req, res) => {
  const { nom, role, responsabilite, ordre } = req.body;

  if (!nom || !role) {
    return res.status(400).json({ message: "Nom et rôle obligatoires" });
  }

  try {
    const [result] = await pool.query(
      "INSERT INTO conseillers (nom, role, responsabilite, ordre) VALUES (?, ?, ?, ?)",
      [
        nom.trim().slice(0, 100),
        role.trim().slice(0, 100),
        responsabilite || "",
        ordre || 999,
      ],
    );

    const [rows] = await pool.query("SELECT * FROM conseillers WHERE id = ?", [
      result.insertId,
    ]);
    res.status(201).json(rows[0]);
  } catch (error) {
    res.status(500).json({ message: "Erreur serveur" });
  }
});

router.put("/:id", auth, async (req, res) => {
  const id = Number(req.params.id);
  const { nom, role, responsabilite, ordre } = req.body;

  if (!nom || !role) {
    return res.status(400).json({ message: "Nom et rôle obligatoires" });
  }

  try {
    const [result] = await pool.query(
      "UPDATE conseillers SET nom = ?, role = ?, responsabilite = ?, ordre = ? WHERE id = ?",
      [
        nom.trim().slice(0, 100),
        role.trim().slice(0, 100),
        responsabilite || "",
        ordre || 999,
        id,
      ],
    );

    if (result.affectedRows === 0) {
      return res.status(404).json({ message: "Conseiller introuvable" });
    }

    const [rows] = await pool.query("SELECT * FROM conseillers WHERE id = ?", [
      id,
    ]);
    res.json(rows[0]);
  } catch (error) {
    res.status(500).json({ message: "Erreur serveur" });
  }
});

router.delete("/:id", auth, async (req, res) => {
  const id = Number(req.params.id);

  try {
    const [result] = await pool.query("DELETE FROM conseillers WHERE id = ?", [
      id,
    ]);

    if (result.affectedRows === 0) {
      return res.status(404).json({ message: "Conseiller introuvable" });
    }

    res.json({ message: "Conseiller supprimé" });
  } catch (error) {
    res.status(500).json({ message: "Erreur serveur" });
  }
});

module.exports = router;
