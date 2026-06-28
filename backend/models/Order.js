const mongoose = require('mongoose');

const orderSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  items: [
    {
      medicine: { type: mongoose.Schema.Types.ObjectId, ref: 'Medicine' },
      name:     String,
      price:    Number,
      quantity: Number,
    }
  ],
  deliveryAddress: {
    fullName:   String,
    phone:      String,
    addressLine1: String,
    addressLine2: String,
    city:       String,
    pincode:    String,
  },
  paymentMethod: { type: String, enum: ['UPI', 'Card', 'Cash on Delivery'] },
  subtotal:      Number,
  deliveryFee:   { type: Number, default: 40 },
  total:         Number,
  status:        { type: String, default: 'Placed' },
}, { timestamps: true });

module.exports = mongoose.model('Order', orderSchema);