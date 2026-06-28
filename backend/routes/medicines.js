const express = require('express');
const router = express.Router();
const Medicine = require('../models/Medicine');

// GET /api/medicines  (supports ?category=&inStock=&maxPrice=&search=)
router.get('/', async (req, res) => {
  try {
    const { category, inStock, maxPrice, search } = req.query;
    const filter = {};
    if (category && category !== 'All') filter.category = category;
    if (inStock === 'true') filter.inStock = true;
    if (maxPrice) filter.price = { $lte: Number(maxPrice) };
    if (search) filter.name = { $regex: search, $options: 'i' };
    const medicines = await Medicine.find(filter);
    res.json(medicines);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// POST /api/medicines  (seed/admin — remove in production)
router.post('/', async (req, res) => {
  try {
    const medicine = await Medicine.create(req.body);
    res.status(201).json(medicine);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

module.exports = router;