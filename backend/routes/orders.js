const express = require('express');
const router = express.Router();
const Order = require('../models/Order');
const protect = require('../middleware/authMiddleware');

// POST /api/orders  (place order)
router.post('/', protect, async (req, res) => {
  try {
    const { items, deliveryAddress, paymentMethod, subtotal, total } = req.body;
    const order = await Order.create({
      user: req.user.id,
      items, deliveryAddress, paymentMethod,
      subtotal, total, deliveryFee: 40,
    });
    res.status(201).json(order);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// GET /api/orders/myorders
router.get('/myorders', protect, async (req, res) => {
  try {
    const orders = await Order.find({ user: req.user.id }).sort({ createdAt: -1 });
    res.json(orders);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;