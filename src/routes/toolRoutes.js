const express = require('express');
const { body, validationResult } = require('express-validator');
const Tool = require('../models/Tool');
const authMiddleware = require('../middlewares/authMiddleware');
const adminMiddleware = require('../middlewares/adminMiddleware');
const router = express.Router();
const { searchTools } = require('../utils/search');


router.get('/', async (req, res) => {
  const { page = 1, limit = 10, category, status, q } = req.query;

  try {
    if (q) {
      const results = await searchTools(q);

      const startIndex = (page - 1) * limit;
      const endIndex = page * limit;
      const paginatedResults = results.slice(startIndex, endIndex);

      res.json({
        tools: paginatedResults.map((hit) => hit._source), // Extrai os documentos do Elasticsearch
        total: results.length,
        page: Number(page),
        totalPages: Math.ceil(results.length / limit),
      });
    } else {
      const filters = {};

      if (category) filters.categories = category;
      if (status) filters.status = status;

      const tools = await Tool.find(filters)
        .skip((page - 1) * limit)
        .limit(limit);

      const total = await Tool.countDocuments(filters);

      res.json({
        tools,
        total,
        page: Number(page),
        totalPages: Math.ceil(total / limit),
      });
    }
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});


// Adicionar uma nova ferramenta (protegida, somente ADMIN)
router.post(
  '/',
  [
    body('name').notEmpty().withMessage('Nome é obrigatório'),
    body('description').notEmpty().withMessage('Descrição é obrigatória'),
    body('link').isURL().withMessage('Link inválido'),
    body('icon').optional().isURL().withMessage('Ícone deve ser uma URL válida'),
  ],
  authMiddleware,
  adminMiddleware,
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    try {
      const tool = new Tool(req.body);
      const savedTool = await tool.save();
      res.status(201).json(savedTool);
    } catch (err) {
      res.status(400).json({ message: err.message });
    }
  }
);

// Atualizar o status de uma ferramenta (protegida, somente ADMIN)
router.patch('/:id', authMiddleware, adminMiddleware, async (req, res) => {
  try {
    const tool = await Tool.findByIdAndUpdate(
      req.params.id,
      { status: req.body.status },
      { new: true }
    );

    if (!tool) {
      return res.status(404).json({ message: 'Ferramenta não encontrada.' });
    }

    res.json(tool);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;
