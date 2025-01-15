const express = require('express');
const Ad = require('../models/Ad');
const router = express.Router();

// Listar anúncios
router.get('/', async (req, res) => {
  try {
    const ads = await Ad.find();
    res.json(ads);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Adicionar um anúncio (somente ADMIN)
router.post('/', authMiddleware, adminMiddleware, async (req, res) => {
  const ad = new Ad(req.body);
  try {
    const savedAd = await ad.save();
    res.status(201).json(savedAd);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

module.exports = router;