const mongoose = require('mongoose');

const medicineSchema = new mongoose.Schema({
  name:        { type: String, required: true },
  brand:       { type: String },
  category:    { type: String },
  price:       { type: Number, required: true },
  inStock:     { type: Boolean, default: true },
  emoji:       { type: String, default: '💊' },
  accent:      { type: String, default: 'from-slate-100 to-slate-200' },
  imageUrl:    { type: String },
  description: { type: String },
}, { timestamps: true });

module.exports = mongoose.model('Medicine', medicineSchema);