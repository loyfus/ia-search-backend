const mongoose = require('mongoose');

const AdSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String, required: true },
  link: { type: String, required: true },
  image: { type: String }, // URL da imagem do anúncio
  category: { type: String }, // Categoria do anúncio (Ex: "imagens", "texto")
  isPromoted: { type: Boolean, default: false }, // Anúncio promovido
});

module.exports = mongoose.model('Ad', AdSchema);