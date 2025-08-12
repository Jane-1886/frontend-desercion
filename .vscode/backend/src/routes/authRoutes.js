
// src/routes/authRoutes.js
const express = require('express');
const router = express.Router();

router.post('/login', (req, res) => {
  res.json({ message: 'Ruta de login activa 🟢' });
});

module.exports = router;
