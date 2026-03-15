const express = require("express");
const multer = require("multer");
const path = require("path");
const fs = require("fs");
const database = require("../db");
const auth = require("../middleware/auth");

const router = express.Router();

const uploadDir = path.join(__dirname, "../../uploads");
if (!fs.existsSync(uploadDir)) fs.mkdirSync(uploadDir, { recursive: true });

const storage = multer.diskStorage({
  destination: (_req, _file, cb) => cb(null, uploadDir),
  filename: (_req, file, cb) => {
    const unique = `${Date.now()}-${Math.round(Math.random() * 1e9)}`;
    cb(null, unique + path.extname(file.originalname));
  },
});

const upload = multer({
  storage,
  limits: { fileSize: 10 * 1024 * 1024 },
  fileFilter: (_req, file, cb) => {
    if (file.mimetype === "application/pdf") cb(null, true);
    else cb(new Error("Seuls les fichiers PDF sont acceptés"));
  },
});

// GET all — public
router.get("/", (_req, res) => {
  const db = database.read();
  res.json([...db.documents].sort((a, b) => b.id - a.id));
});

// Download — public
router.get("/:id/download", (req, res) => {
  const id = parseInt(req.params.id);
  const db = database.read();
  const doc = db.documents.find((d) => d.id === id);
  if (!doc) return res.status(404).json({ message: "Document introuvable" });
  const filePath = path.join(uploadDir, doc.filename);
  if (!fs.existsSync(filePath))
    return res.status(404).json({ message: "Fichier introuvable" });
  res.download(filePath, doc.nom + ".pdf");
});

// POST — admin only
router.post("/", auth, upload.single("file"), (req, res) => {
  if (!req.file) return res.status(400).json({ message: "Fichier PDF requis" });
  const { nom, description, categorie } = req.body;
  if (!nom) return res.status(400).json({ message: "Le nom est requis" });
  const db = database.read();
  const item = {
    id: database.nextId(db.documents),
    nom,
    description: description || "",
    categorie: categorie || "Général",
    filename: req.file.filename,
    size: req.file.size,
    created_at: new Date().toISOString(),
  };
  db.documents.push(item);
  database.write(db);
  res.status(201).json(item);
});

// DELETE — admin only
router.delete("/:id", auth, (req, res) => {
  const id = parseInt(req.params.id);
  const db = database.read();
  const idx = db.documents.findIndex((d) => d.id === id);
  if (idx === -1)
    return res.status(404).json({ message: "Document introuvable" });
  const filePath = path.join(uploadDir, db.documents[idx].filename);
  if (fs.existsSync(filePath)) fs.unlinkSync(filePath);
  db.documents.splice(idx, 1);
  database.write(db);
  res.json({ message: "Document supprimé" });
});

module.exports = router;
