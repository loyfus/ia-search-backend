const express = require('express');
const { body, validationResult } = require('express-validator');
const Tool = require('../models/Tool');
const authMiddleware = require('../middlewares/authMiddleware');
const adminMiddleware = require('../middlewares/adminMiddleware');
const router = express.Router();

// Buscar todas as ferramentas (pública) com paginação e filtros
router.get('/', async (req, res) => {
  const { page = 1, limit = 10, category, status, q } = req.query;
  const filters = {};

  // Filtros
  if (category) filters.categories = category;
  if (status) filters.status = status;
  if (q) {
    filters.$or = [
      { name: { $regex: q, $options: 'i' } },
      { categories: { $in: [q] } },
    ];
  }

  try {
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
