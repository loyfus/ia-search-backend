const express = require('express');
const Ad = require('../models/Ad');
const authMiddleware = require('../middlewares/authMiddleware');
const adminMiddleware = require('../middlewares/adminMiddleware');
const router = express.Router();

// Listar anúncios
router.get('/', async (req, res) => {
  try {
    const ads = await Ad.find();
    res.json({ ads }); // Retorne um objeto com a chave "ads"
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

// Excluir um anúncio (somente ADMIN)
router.delete('/:id', authMiddleware, adminMiddleware, async (req, res) => {
  try {
    const ad = await Ad.findByIdAndDelete(req.params.id);

    if (!ad) {
      return res.status(404).json({ message: 'Anúncio não encontrado.' });
    }

    res.json({ message: 'Anúncio excluído com sucesso.' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;