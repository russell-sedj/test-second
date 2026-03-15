const express = require("express");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");

const router = express.Router();

router.post("/login", (req, res) => {
  const { username, password } = req.body;

  if (!username || !password) {
    return res.status(400).json({ message: "Identifiants manquants" });
  }

  if (username !== process.env.ADMIN_USERNAME) {
    return res.status(401).json({ message: "Identifiants incorrects" });
  }

  const valid = bcrypt.compareSync(password, req.app.locals.adminPasswordHash);
  if (!valid) {
    return res.status(401).json({ message: "Identifiants incorrects" });
  }

  const token = jwt.sign({ username, role: "admin" }, process.env.JWT_SECRET, {
    expiresIn: "8h",
  });

  res.json({ token, username });
});

module.exports = router;
