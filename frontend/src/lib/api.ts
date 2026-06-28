/** Dev: Vite proxies /api → backend. Production: set VITE_API_URL if needed. */
const BASE_URL = import.meta.env.VITE_API_URL ?? '/api';

const getToken = () => localStorage.getItem('token');

const authHeaders = () => ({
  'Content-Type': 'application/json',
  Authorization: `Bearer ${getToken()}`,
});

// ── Auth ──────────────────────────────────────────────────────────
export async function apiLogin(email: string, password: string) {
  const res = await fetch(`${BASE_URL}/auth/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, password }),
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.message || 'Login failed');
  localStorage.setItem('token', data.token);
  localStorage.setItem('user', JSON.stringify({ name: data.name, email: data.email }));
  return data;
}

export async function apiSignup(name: string, email: string, password: string) {
  const res = await fetch(`${BASE_URL}/auth/signup`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ name, email, password }),
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.message || 'Signup failed');
  localStorage.setItem('token', data.token);
  localStorage.setItem('user', JSON.stringify({ name: data.name, email: data.email }));
  return data;
}

export function apiLogout() {
  localStorage.removeItem('token');
  localStorage.removeItem('user');
}

export function getUser(): { name: string; email: string } | null {
  const u = localStorage.getItem('user');
  return u ? JSON.parse(u) : null;
}

export function isLoggedIn(): boolean {
  return !!localStorage.getItem('token');
}

// ── Medicines ─────────────────────────────────────────────────────
export async function fetchMedicines(params?: {
  category?: string;
  inStock?: boolean;
  maxPrice?: number;
  search?: string;
}) {
  const query = new URLSearchParams();
  if (params?.category && params.category !== 'All') query.set('category', params.category);
  if (params?.inStock) query.set('inStock', 'true');
  if (params?.maxPrice && params.maxPrice < 700) query.set('maxPrice', String(params.maxPrice));
  if (params?.search) query.set('search', params.search);

  const res = await fetch(`${BASE_URL}/medicines?${query}`);
  if (!res.ok) throw new Error('Failed to fetch medicines');
  const data = await res.json();

  // ✅ Map MongoDB's _id → id so cart-context works perfectly
  return data.map((m: any) => ({ ...m, id: m._id }));
}

// ── Orders ────────────────────────────────────────────────────────
export interface OrderPayload {
  items: {
    medicine: string;
    name: string;
    price: number;
    quantity: number;
  }[];
  deliveryAddress: {
    fullName: string;
    phone: string;
    addressLine1: string;
    addressLine2?: string;
    city: string;
    pincode: string;
  };
  paymentMethod: 'UPI' | 'Card' | 'Cash on Delivery';
  subtotal: number;
  total: number;
}

export async function placeOrder(payload: OrderPayload) {
  const res = await fetch(`${BASE_URL}/orders`, {
    method: 'POST',
    headers: authHeaders(),
    body: JSON.stringify(payload),
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.message || 'Order failed');
  return data;
}

export async function getMyOrders() {
  const res = await fetch(`${BASE_URL}/orders/myorders`, {
    headers: authHeaders(),
  });
  const data = await res.json();
  if (!res.ok) throw new Error('Failed to fetch orders');
  return data;
}