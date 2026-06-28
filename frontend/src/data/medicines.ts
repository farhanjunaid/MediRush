export type Medicine = {
  id: string;
  name: string;
  brand: string;
  price: number;
  category: string;
  inStock: boolean;
  emoji: string;
  accent: string;
};

export const CATEGORIES = [
  "Pain Relief",
  "Vitamins",
  "Antibiotics",
  "Skincare",
  "Diabetes",
  "Cold & Flu",
] as const;

export const MEDICINES: Medicine[] = [
  { id: "m1", name: "Paracetamol 500mg", brand: "Crocin", price: 35, category: "Pain Relief", inStock: true, emoji: "💊", accent: "from-rose-200 to-rose-50" },
  { id: "m2", name: "Ibuprofen 400mg", brand: "Brufen", price: 48, category: "Pain Relief", inStock: true, emoji: "💊", accent: "from-orange-200 to-orange-50" },
  { id: "m3", name: "Vitamin D3 60K", brand: "Calcirol", price: 89, category: "Vitamins", inStock: true, emoji: "🟡", accent: "from-amber-200 to-amber-50" },
  { id: "m4", name: "Multivitamin Tabs", brand: "Revital", price: 220, category: "Vitamins", inStock: true, emoji: "🧴", accent: "from-yellow-200 to-yellow-50" },
  { id: "m5", name: "Amoxicillin 500mg", brand: "Mox", price: 110, category: "Antibiotics", inStock: true, emoji: "🟣", accent: "from-violet-200 to-violet-50" },
  { id: "m6", name: "Azithromycin 500mg", brand: "Azithral", price: 145, category: "Antibiotics", inStock: false, emoji: "🟣", accent: "from-purple-200 to-purple-50" },
  { id: "m7", name: "Vitamin C Serum", brand: "Minimalist", price: 599, category: "Skincare", inStock: true, emoji: "🧪", accent: "from-emerald-200 to-emerald-50" },
  { id: "m8", name: "Sunscreen SPF 50", brand: "Re'equil", price: 449, category: "Skincare", inStock: true, emoji: "🧴", accent: "from-sky-200 to-sky-50" },
  { id: "m9", name: "Metformin 500mg", brand: "Glycomet", price: 65, category: "Diabetes", inStock: true, emoji: "💊", accent: "from-teal-200 to-teal-50" },
  { id: "m10", name: "Glimepiride 2mg", brand: "Amaryl", price: 180, category: "Diabetes", inStock: true, emoji: "💊", accent: "from-cyan-200 to-cyan-50" },
  { id: "m11", name: "Cetirizine 10mg", brand: "Zyrtec", price: 42, category: "Cold & Flu", inStock: true, emoji: "🟢", accent: "from-lime-200 to-lime-50" },
  { id: "m12", name: "Cough Syrup 100ml", brand: "Benadryl", price: 125, category: "Cold & Flu", inStock: true, emoji: "🍯", accent: "from-amber-200 to-orange-50" },
];