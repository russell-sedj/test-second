const express = require("express");
const pool = require("../mysql");
const auth = require("../middleware/auth");

const router = express.Router();

router.get("/", async (_req, res) => {
  try {
    const [rows] = await pool.query(
      "SELECT * FROM actualites ORDER BY id DESC",
    );
    res.json(rows);
  } catch (error) {
    res.status(500).json({ message: "Erreur serveur" });
  }
});

router.post("/", auth, async (req, res) => {
  const { titre, description, categorie, date } = req.body;

  if (!titre || !description || !categorie || !date) {
    return res.status(400).json({ message: "Champs obligatoires manquants" });
  }

  try {
    const [result] = await pool.query(
      "INSERT INTO actualites (titre, description, categorie, date, badge_class, bg_class, created_at) VALUES (?, ?, ?, ?, ?, ?, NOW())",
      [
        titre,
        description,
        categorie,
        date,
        req.body.badge_class || "bg-blue-100 text-blue-700",
        req.body.bg_class || "bg-gradient-to-br from-blue-500 to-blue-700",
      ],
    );

    const [rows] = await pool.query("SELECT * FROM actualites WHERE id = ?", [
      result.insertId,
    ]);
    res.status(201).json(rows[0]);
  } catch (error) {
    res.status(500).json({ message: "Erreur serveur" });
  }
});

router.put("/:id", auth, async (req, res) => {
  const id = Number(req.params.id);
  const { titre, description, categorie, date } = req.body;

  if (!titre || !description || !categorie || !date) {
    return res.status(400).json({ message: "Champs obligatoires manquants" });
  }

  try {
    const [result] = await pool.query(
      "UPDATE actualites SET titre = ?, description = ?, categorie = ?, date = ?, badge_class = ?, bg_class = ? WHERE id = ?",
      [
        titre,
        description,
        categorie,
        date,
        req.body.badge_class,
        req.body.bg_class,
        id,
      ],
    );

    if (result.affectedRows === 0) {
      return res.status(404).json({ message: "Actualité introuvable" });
    }

    const [rows] = await pool.query("SELECT * FROM actualites WHERE id = ?", [
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
    const [result] = await pool.query("DELETE FROM actualites WHERE id = ?", [
      id,
    ]);

    if (result.affectedRows === 0) {
      return res.status(404).json({ message: "Actualité introuvable" });
    }

    res.json({ message: "Actualité supprimée" });
  } catch (error) {
    res.status(500).json({ message: "Erreur serveur" });
  }
});

module.exports = router;
