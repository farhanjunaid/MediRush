# 🏥 MediRush — Medicine Delivery App

> A full-stack MERN application for ordering medicines with 30-minute delivery. Built with React (TanStack Router), Node.js, Express, and MongoDB.

![MediRush Banner](https://img.shields.io/badge/MediRush-Medicine%20Delivery-teal?style=for-the-badge)
![MongoDB](https://img.shields.io/badge/MongoDB-8.0-green?style=for-the-badge&logo=mongodb)
![Express](https://img.shields.io/badge/Express-4.x-black?style=for-the-badge&logo=express)
![React](https://img.shields.io/badge/React-18-blue?style=for-the-badge&logo=react)
![Node](https://img.shields.io/badge/Node.js-20.x-green?style=for-the-badge&logo=node.js)

---

## ✨ Features

- 🔐 **Authentication** — Email/password signup & login with JWT + Google OAuth 2.0
- 💊 **Medicine Dashboard** — Browse, search, and filter medicines by category, price, and stock
- 🛒 **Cart System** — Add/remove medicines, adjust quantities with real-time cart drawer
- 📦 **Checkout & Orders** — Delivery address form, UPI/Card/COD payment selection, order placement
- 🗄️ **MongoDB Integration** — Users, medicines, and orders stored in MongoDB Atlas/local
- 📱 **Responsive Design** — Mobile-first UI with Tailwind CSS

---

## 🛠️ Tech Stack

| Layer | Technology |
|---|---|
| Frontend | React 18, TanStack Router, Tailwind CSS, TypeScript |
| Backend | Node.js, Express.js |
| Database | MongoDB + Mongoose ODM |
| Auth | JWT (jsonwebtoken), bcryptjs, Passport.js (Google OAuth) |
| UI Builder | Lovable AI |

---

## 📁 Project Structure

```
medirush/
├── frontend/                  # React frontend (Lovable-generated)
│   ├── src/
│   │   ├── routes/
│   │   │   ├── index.tsx      # Dashboard / Medicine listing
│   │   │   ├── auth.tsx       # Login / Signup / Google OAuth callback
│   │   │   └── checkout.tsx   # Checkout & order placement
│   │   ├── components/
│   │   │   ├── navbar.tsx     # Sticky navbar with cart & user menu
│   │   │   └── cart-drawer.tsx
│   │   ├── context/
│   │   │   └── cart-context.tsx  # Global cart state
│   │   └── lib/
│   │       └── api.ts         # All API calls to backend
│   └── package.json
│
└── medirush-backend/          # Express backend
    ├── config/
    │   ├── db.js              # MongoDB connection
    │   └── passport.js        # Google OAuth strategy
    ├── models/
    │   ├── User.js
    │   ├── Medicine.js
    │   └── Order.js
    ├── routes/
    │   ├── auth.js            # /api/auth (login, signup, google)
    │   ├── medicines.js       # /api/medicines
    │   └── orders.js          # /api/orders
    ├── middleware/
    │   └── authMiddleware.js  # JWT protection
    ├── .env.example
    └── server.js
```

---

## 🚀 Getting Started

### Quick run (both servers)

From the project root (requires MongoDB running):

```bash
npm run install:all
npm run dev
```

- Frontend: http://localhost:8080  
- Backend: http://localhost:5000  

### Prerequisites

- Node.js v18+
- MongoDB (local or Atlas)
- Google Cloud Console project (for OAuth)

### 1. Clone the repository

```bash
git clone https://github.com/syediyanulla/health-delivered-fast.git
cd health-delivered-fast
```

### 2. Backend Setup

```bash
cd backend
npm install
npm run seed
```

A `backend/.env` file is included for local development. To customize, copy from `backend/.env.example`:

```env
PORT=5000
MONGO_URI=mongodb://localhost:27017/medirush
JWT_SECRET=your_jwt_secret_here
GOOGLE_CLIENT_ID=your_google_client_id
GOOGLE_CLIENT_SECRET=your_google_client_secret
SESSION_SECRET=your_session_secret
CLIENT_URL=http://localhost:8080
```

Start the backend:

```bash
npm start
```

You should see:
```
🚀 Server running on port 5000
✅ MongoDB Connected: localhost
```

### 3. Seed the Database

In MongoDB Compass, connect to `mongodb://localhost:27017`, create database `medirush`, collection `medicines`, and insert the seed data from `medirush-backend/seed/medicines.json`.

Or use the API directly:

```bash
curl -X POST http://localhost:5000/api/medicines \
  -H "Content-Type: application/json" \
  -d '{"name":"Paracetamol 500mg","brand":"CROCIN","category":"Pain Relief","price":35,"inStock":true,"emoji":"💊","accent":"from-rose-100 to-orange-100"}'
```

### 4. Frontend Setup

```bash
cd frontend
npm install
npm run dev
```

Frontend runs on: `http://localhost:8080`

---

## 🔑 API Endpoints

### Auth
| Method | Endpoint | Description |
|---|---|---|
| POST | `/api/auth/signup` | Register new user |
| POST | `/api/auth/login` | Login with email/password |
| GET | `/api/auth/google` | Initiate Google OAuth |
| GET | `/api/auth/google/callback` | Google OAuth callback |

### Medicines
| Method | Endpoint | Description |
|---|---|---|
| GET | `/api/medicines` | Get all medicines (supports `?category=&search=&maxPrice=&inStock=`) |
| POST | `/api/medicines` | Add a medicine (dev/seed) |

### Orders
| Method | Endpoint | Description | Auth |
|---|---|---|---|
| POST | `/api/orders` | Place an order | ✅ JWT |
| GET | `/api/orders/myorders` | Get user's orders | ✅ JWT |

---

## 🌐 Google OAuth Setup

1. Go to [Google Cloud Console](https://console.cloud.google.com)
2. Create a new project → **APIs & Services** → **Credentials**
3. Create OAuth 2.0 Client ID (Web application)
4. Add authorized origins: `http://localhost:8080`, `http://localhost:5000`
5. Add redirect URI: `http://localhost:5000/api/auth/google/callback`
6. Copy Client ID and Secret to your `.env`

---

## 📸 Screenshots

| Login Page | Dashboard | Checkout |
|---|---|---|
| Auth with Google OAuth | Medicine grid with filters | Address + payment form |

---

## 👨‍💻 Author

**Syed Iyanulla**
- B.E. Information Science & Engineering — GM Institute of Technology (2026)
- Cloud & Backend Engineering Intern @ Prinston Smart Engineers
- GitHub: [@syediyanulla](https://github.com/syediyanulla)

---

## 📄 License

This project is for educational purposes as part of a full-stack MERN portfolio project.