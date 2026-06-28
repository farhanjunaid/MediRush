require('dotenv').config({ quiet: true });
const mongoose = require('mongoose');
const Medicine = require('./models/Medicine');

const MEDICINES = [
  { name: 'Paracetamol 500mg', brand: 'CROCIN', category: 'Pain Relief', price: 35, inStock: true, emoji: '💊', accent: 'from-rose-100 to-orange-100' },
  { name: 'Ibuprofen 400mg', brand: 'BRUFEN', category: 'Pain Relief', price: 48, inStock: true, emoji: '💊', accent: 'from-orange-100 to-amber-100' },
  { name: 'Vitamin D3 60K', brand: 'CALCIROL', category: 'Vitamins', price: 89, inStock: true, emoji: '🟡', accent: 'from-yellow-100 to-lime-100' },
  { name: 'Multivitamin Tabs', brand: 'REVITAL', category: 'Vitamins', price: 220, inStock: true, emoji: '🧴', accent: 'from-yellow-100 to-pink-100' },
  { name: 'Amoxicillin 500mg', brand: 'MOX', category: 'Antibiotics', price: 110, inStock: true, emoji: '🔵', accent: 'from-purple-100 to-violet-100' },
  { name: 'Azithromycin 500mg', brand: 'AZITHRAL', category: 'Antibiotics', price: 145, inStock: false, emoji: '🔵', accent: 'from-purple-100 to-indigo-100' },
  { name: 'Vitamin C Serum', brand: 'MINIMALIST', category: 'Skincare', price: 599, inStock: true, emoji: '🧴', accent: 'from-green-100 to-teal-100' },
  { name: 'Sunscreen SPF 50', brand: "RE'EQUIL", category: 'Skincare', price: 449, inStock: true, emoji: '🧴', accent: 'from-sky-100 to-blue-100' },
  { name: 'Metformin 500mg', brand: 'GLYCOMET', category: 'Diabetes', price: 65, inStock: true, emoji: '💊', accent: 'from-rose-100 to-pink-100' },
  { name: 'Glimepiride 2mg', brand: 'AMARYL', category: 'Diabetes', price: 180, inStock: true, emoji: '💊', accent: 'from-amber-100 to-orange-100' },
  { name: 'Cetirizine 10mg', brand: 'ZYRTEC', category: 'Cold & Flu', price: 42, inStock: true, emoji: '🟢', accent: 'from-green-100 to-emerald-100' },
  { name: 'Cough Syrup 100ml', brand: 'BENADRYL', category: 'Cold & Flu', price: 125, inStock: true, emoji: '🍯', accent: 'from-yellow-100 to-amber-100' },
];

async function seed() {
  const uri = process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/medirush';
  await mongoose.connect(uri);
  const count = await Medicine.countDocuments();
  if (count > 0) {
    // already seeded — no output
  } else {
    await Medicine.insertMany(MEDICINES);
    console.log(`✅ Seeded ${MEDICINES.length} medicines.`);
  }
  await mongoose.disconnect();
}

seed().catch((err) => {
  console.error('❌ Seed failed:', err.message);
  console.error('   Make sure MongoDB is running (e.g. net start MongoDB on Windows).');
  process.exit(1);
});
