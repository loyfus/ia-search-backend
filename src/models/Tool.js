const mongoose = require('mongoose');

const ToolSchema = new mongoose.Schema({
    name: { type: String, required: true },
    description: { type: String, required: true },
    link: { type: String, required: true },
    icon: { type: String }, // (URL da imagem)
    categories: [{ type: String }],
    ratings: [{ type: Number }],
    comments: [{ type: String }],
    status: { type: String, enum: ['pending', 'approved'], default: 'pending' },
  });

module.exports = mongoose.model('Tool', ToolSchema);