const express = require("express");
const pool = require("../mysql");
const auth = require("../middleware/auth");

const router = express.Router();

function parseDetails(row) {
  return {
    ...row,
    details:
      typeof row.details === "string" ? JSON.parse(row.details) : row.details,
  };
}

router.get("/", async (_req, res) => {
  try {
    const [rows] = await pool.query("SELECT * FROM services ORDER BY id ASC");
    res.json(rows.map(parseDetails));
  } catch (error) {
    res.status(500).json({ message: "Erreur serveur" });
  }
});

router.post("/", auth, async (req, res) => {
  const { titre, description, details, bgIcon, iconColor, borderColor } =
    req.body;

  if (!titre || !description) {
    return res
      .status(400)
      .json({ message: "Titre et description obligatoires" });
  }

  try {
    const detailsArray = Array.isArray(details)
      ? details
      : (details || "").split("\n");

    const [result] = await pool.query(
      "INSERT INTO services (titre, description, details, bgIcon, iconColor, borderColor) VALUES (?, ?, ?, ?, ?, ?)",
      [
        titre.trim().slice(0, 100),
        description.trim().slice(0, 500),
        JSON.stringify(detailsArray),
        bgIcon || "bg-blue-100",
        iconColor || "text-blue-700",
        borderColor || "border-blue-200",
      ],
    );

    const [rows] = await pool.query("SELECT * FROM services WHERE id = ?", [
      result.insertId,
    ]);
    res.status(201).json(parseDetails(rows[0]));
  } catch (error) {
    res.status(500).json({ message: "Erreur serveur" });
  }
});

router.put("/:id", auth, async (req, res) => {
  const id = Number(req.params.id);
  const { titre, description, details, bgIcon, iconColor, borderColor } =
    req.body;

  if (!titre || !description) {
    return res
      .status(400)
      .json({ message: "Titre et description obligatoires" });
  }

  try {
    const detailsArray = Array.isArray(details)
      ? details
      : (details || "").split("\n");

    const [result] = await pool.query(
      "UPDATE services SET titre = ?, description = ?, details = ?, bgIcon = ?, iconColor = ?, borderColor = ? WHERE id = ?",
      [
        titre.trim().slice(0, 100),
        description.trim().slice(0, 500),
        JSON.stringify(detailsArray),
        bgIcon || "bg-blue-100",
        iconColor || "text-blue-700",
        borderColor || "border-blue-200",
        id,
      ],
    );

    if (result.affectedRows === 0) {
      return res.status(404).json({ message: "Service introuvable" });
    }

    const [rows] = await pool.query("SELECT * FROM services WHERE id = ?", [
      id,
    ]);
    res.json(parseDetails(rows[0]));
  } catch (error) {
    res.status(500).json({ message: "Erreur serveur" });
  }
});

router.delete("/:id", auth, async (req, res) => {
  const id = Number(req.params.id);

  try {
    const [result] = await pool.query("DELETE FROM services WHERE id = ?", [
      id,
    ]);

    if (result.affectedRows === 0) {
      return res.status(404).json({ message: "Service introuvable" });
    }

    res.json({ message: "Service supprimé" });
  } catch (error) {
    res.status(500).json({ message: "Erreur serveur" });
  }
});

module.exports = router;
