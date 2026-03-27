const express = require("express");
const path = require("path");
const fs = require("fs");
const multer = require("multer");
const pool = require("../mysql");
const auth = require("../middleware/auth");

const router = express.Router();

const uploadsDir = path.join(__dirname, "..", "..", "uploads", "documents");
fs.mkdirSync(uploadsDir, { recursive: true });

function sanitize(str) {
  return String(str || "")
    .replace(/[<>]/g, "")
    .trim();
}

const storage = multer.diskStorage({
  destination: (_req, _file, cb) => cb(null, uploadsDir),
  filename: (_req, file, cb) => {
    const ext = path.extname(file.originalname || "").toLowerCase();
    const safeBase = path
      .basename(file.originalname || "document", ext)
      .replace(/[^a-zA-Z0-9-_]/g, "_")
      .slice(0, 80);
    const unique = `${Date.now()}-${Math.round(Math.random() * 1e9)}`;
    cb(null, `${safeBase}-${unique}${ext}`);
  },
});

const upload = multer({
  storage,
  limits: { fileSize: 10 * 1024 * 1024 }, // 10MB
  fileFilter: (_req, file, cb) => {
    const allowed = ["application/pdf", "image/jpeg", "image/png"];
    if (!allowed.includes(file.mimetype)) {
      return cb(new Error("Format non autorise. PDF, JPG, PNG uniquement."));
    }
    cb(null, true);
  },
});

// Public: depot de document
router.post("/public-upload", upload.single("fichier"), async (req, res) => {
  const { nom, prenom, email, telephone, type_demande, objet, message } =
    req.body;

  if (!req.file) {
    return res.status(400).json({ message: "Fichier requis" });
  }

  if (
    !nom ||
    !prenom ||
    !email ||
    !telephone ||
    !type_demande ||
    !objet ||
    !message
  ) {
    return res.status(400).json({ message: "Tous les champs sont requis" });
  }

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    return res.status(400).json({ message: "Adresse email invalide" });
  }

  try {
    const payload = {
      nom: sanitize(nom).slice(0, 100),
      prenom: sanitize(prenom).slice(0, 100),
      email: sanitize(email).slice(0, 254),
      telephone: sanitize(telephone).slice(0, 30),
      type_demande: sanitize(type_demande).slice(0, 120),
      objet: sanitize(objet).slice(0, 200),
      message: sanitize(message).slice(0, 5000),
      filename: req.file.filename,
      original_name: sanitize(req.file.originalname).slice(0, 255),
      mime_type: req.file.mimetype,
      size: req.file.size,
    };

    const [result] = await pool.query(
      `INSERT INTO documents
       (nom, prenom, email, telephone, type_demande, objet, message, filename, original_name, mime_type, size, statut, created_at)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 'nouveau', NOW())`,
      [
        payload.nom,
        payload.prenom,
        payload.email,
        payload.telephone,
        payload.type_demande,
        payload.objet,
        payload.message,
        payload.filename,
        payload.original_name,
        payload.mime_type,
        payload.size,
      ],
    );

    const [rows] = await pool.query("SELECT * FROM documents WHERE id = ?", [
      result.insertId,
    ]);
    return res
      .status(201)
      .json({ message: "Document envoye avec succes", document: rows[0] });
  } catch (error) {
    return res.status(500).json({ message: "Erreur serveur" });
  }
});

// Admin: liste
router.get("/", auth, async (_req, res) => {
  try {
    const [rows] = await pool.query(
      "SELECT * FROM documents ORDER BY created_at DESC",
    );
    res.json(rows);
  } catch {
    res.status(500).json({ message: "Erreur serveur" });
  }
});

// Admin: mise a jour statut
router.patch("/:id/status", auth, async (req, res) => {
  const id = Number(req.params.id);
  const { statut } = req.body;
  const allowed = ["nouveau", "en_cours", "traite", "rejete"];

  if (!allowed.includes(statut)) {
    return res.status(400).json({ message: "Statut invalide" });
  }

  try {
    const [result] = await pool.query(
      "UPDATE documents SET statut = ? WHERE id = ?",
      [statut, id],
    );
    if (result.affectedRows === 0) {
      return res.status(404).json({ message: "Document introuvable" });
    }
    const [rows] = await pool.query("SELECT * FROM documents WHERE id = ?", [
      id,
    ]);
    res.json(rows[0]);
  } catch {
    res.status(500).json({ message: "Erreur serveur" });
  }
});

// Admin: telechargement
router.get("/:id/download", auth, async (req, res) => {
  const id = Number(req.params.id);

  try {
    const [rows] = await pool.query("SELECT * FROM documents WHERE id = ?", [
      id,
    ]);
    if (!rows.length) {
      return res.status(404).json({ message: "Document introuvable" });
    }

    const doc = rows[0];
    const filePath = path.join(uploadsDir, doc.filename);

    if (!fs.existsSync(filePath)) {
      return res.status(404).json({ message: "Fichier introuvable" });
    }

    res.download(filePath, doc.original_name);
  } catch {
    res.status(500).json({ message: "Erreur serveur" });
  }
});

module.exports = router;
