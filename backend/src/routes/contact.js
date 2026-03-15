const express = require("express");
const nodemailer = require("nodemailer");

const router = express.Router();

// Simple input sanitization - strip HTML tags
function sanitize(str) {
  return String(str)
    .replace(/<[^>]*>/g, "")
    .trim();
}

router.post("/", async (req, res) => {
  const { nom, email, sujet, message } = req.body;

  if (!nom || !email || !sujet || !message) {
    return res.status(400).json({ message: "Tous les champs sont requis" });
  }

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    return res.status(400).json({ message: "Adresse email invalide" });
  }

  if (message.length < 10) {
    return res.status(400).json({ message: "Message trop court" });
  }

  // Sanitize all inputs before using in email
  const safNom = sanitize(nom).slice(0, 100);
  const safEmail = sanitize(email).slice(0, 254);
  const safSujet = sanitize(sujet).slice(0, 200);
  const safMessage = sanitize(message).slice(0, 5000);

  try {
    const transporter = nodemailer.createTransport({
      host: process.env.EMAIL_HOST,
      port: parseInt(process.env.EMAIL_PORT || "587"),
      secure: process.env.EMAIL_PORT === "465",
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });

    await transporter.sendMail({
      from: `"Site Mairie de Mbaling" <${process.env.EMAIL_USER}>`,
      to: process.env.EMAIL_TO,
      replyTo: safEmail,
      subject: `[Contact Mairie] ${safSujet}`,
      html: `
        <div style="font-family:sans-serif;max-width:600px;margin:0 auto">
          <h2 style="color:#1e40af;border-bottom:2px solid #e2e8f0;padding-bottom:12px">
            Nouveau message depuis le site de la mairie
          </h2>
          <table style="width:100%;border-collapse:collapse;margin-bottom:16px">
            <tr style="background:#f8fafc">
              <td style="padding:10px;font-weight:600;width:120px">Nom</td>
              <td style="padding:10px">${safNom}</td>
            </tr>
            <tr>
              <td style="padding:10px;font-weight:600">Email</td>
              <td style="padding:10px"><a href="mailto:${safEmail}">${safEmail}</a></td>
            </tr>
            <tr style="background:#f8fafc">
              <td style="padding:10px;font-weight:600">Sujet</td>
              <td style="padding:10px">${safSujet}</td>
            </tr>
          </table>
          <div style="background:#f1f5f9;border-radius:8px;padding:16px">
            <p style="margin:0;white-space:pre-wrap">${safMessage}</p>
          </div>
          <p style="color:#94a3b8;font-size:12px;margin-top:24px">
            Ce message a été envoyé depuis le formulaire de contact du site mairie-mbaling.sn
          </p>
        </div>
      `,
    });

    res.json({ message: "Message envoyé avec succès" });
  } catch (error) {
    console.error("Erreur envoi email:", error.message);
    res
      .status(500)
      .json({ message: "Erreur lors de l'envoi. Veuillez réessayer." });
  }
});

module.exports = router;
