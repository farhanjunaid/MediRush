# 🛠️ MediRush — Complete Setup Guide

Follow this guide step by step to run MediRush locally from scratch.

---

## ✅ Prerequisites

Make sure you have the following installed:

| Tool | Version | Download |
|---|---|---|
| Node.js | v18+ | https://nodejs.org |
| MongoDB | v6+ | https://www.mongodb.com/try/download/community |
| MongoDB Compass | Latest | Installed with MongoDB |
| Git | Latest | https://git-scm.com |

---

## 📥 Step 1 — Clone the Repository

```bash
git clone https://github.com/syediyanulla/health-delivered-fast.git
cd health-delivered-fast
```

---

## 🍃 Step 2 — Start MongoDB

**Windows:**
```bash
net start MongoDB
```

**Mac/Linux:**
```bash
sudo systemctl start mongod
```

Verify it's running:
```bash
mongosh
# Should show a > prompt. Type exit to leave.
```

---

## ⚙️ Step 3 — Backend Setup

```bash
cd medirush-backend
npm install
```

### Create `.env` file

Create a file called `.env` inside `medirush-backend/` with the following content:

```env
PORT=5000
MONGO_URI=mongodb://localhost:27017/medirush
JWT_SECRET=medirush_super_secret_key_2024
GOOGLE_CLIENT_ID=your_google_client_id_here
GOOGLE_CLIENT_SECRET=your_google_client_secret_here
SESSION_SECRET=medirush_session_secret_2024
CLIENT_URL=http://localhost:8080
```

> ⚠️ Replace `your_google_client_id_here` and `your_google_client_secret_here` with your actual Google OAuth credentials.
> See **Step 5** below for how to get these.

### Start the backend

```bash
node server.js
```

**Expected output:**
```
🚀 Server running on port 5000
✅ MongoDB Connected: localhost
```

> Keep this terminal open. Open a new terminal for the next steps.

---

## 🌱 Step 4 — Seed the Database

Open **MongoDB Compass** and connect to `mongodb://localhost:27017`.

1. Click **+** next to the connection to create a new database
   - Database name: `medirush`
   - Collection name: `medicines`
   - Click **Create Database**

2. Click on the `medicines` collection → **ADD DATA** → **Insert document**

3. Switch to the JSON/array view (`{ }` tab) and paste:

```json
[
  { "name": "Paracetamol 500mg", "brand": "CROCIN", "category": "Pain Relief", "price": 35, "inStock": true, "emoji": "💊", "accent": "from-rose-100 to-orange-100" },
  { "name": "Ibuprofen 400mg", "brand": "BRUFEN", "category": "Pain Relief", "price": 48, "inStock": true, "emoji": "💊", "accent": "from-orange-100 to-amber-100" },
  { "name": "Vitamin D3 60K", "brand": "CALCIROL", "category": "Vitamins", "price": 89, "inStock": true, "emoji": "🟡", "accent": "from-yellow-100 to-lime-100" },
  { "name": "Multivitamin Tabs", "brand": "REVITAL", "category": "Vitamins", "price": 220, "inStock": true, "emoji": "🧴", "accent": "from-yellow-100 to-pink-100" },
  { "name": "Amoxicillin 500mg", "brand": "MOX", "category": "Antibiotics", "price": 110, "inStock": true, "emoji": "🔵", "accent": "from-purple-100 to-violet-100" },
  { "name": "Azithromycin 500mg", "brand": "AZITHRAL", "category": "Antibiotics", "price": 145, "inStock": false, "emoji": "🔵", "accent": "from-purple-100 to-indigo-100" },
  { "name": "Vitamin C Serum", "brand": "MINIMALIST", "category": "Skincare", "price": 599, "inStock": true, "emoji": "🧴", "accent": "from-green-100 to-teal-100" },
  { "name": "Sunscreen SPF 50", "brand": "RE'EQUIL", "category": "Skincare", "price": 449, "inStock": true, "emoji": "🧴", "accent": "from-sky-100 to-blue-100" },
  { "name": "Metformin 500mg", "brand": "GLYCOMET", "category": "Diabetes", "price": 65, "inStock": true, "emoji": "💊", "accent": "from-rose-100 to-pink-100" },
  { "name": "Glimepiride 2mg", "brand": "AMARYL", "category": "Diabetes", "price": 180, "inStock": true, "emoji": "💊", "accent": "from-amber-100 to-orange-100" },
  { "name": "Cetirizine 10mg", "brand": "ZYRTEC", "category": "Cold & Flu", "price": 42, "inStock": true, "emoji": "🟢", "accent": "from-green-100 to-emerald-100" },
  { "name": "Cough Syrup 100ml", "brand": "BENADRYL", "category": "Cold & Flu", "price": 125, "inStock": true, "emoji": "🍯", "accent": "from-yellow-100 to-amber-100" }
]
```

4. Click **Insert** — you should see 12 documents added.

---

## 🔑 Step 5 — Google OAuth Setup

> Skip this step if you don't need Google login. The app will work with email/password only.

1. Go to [https://console.cloud.google.com](https://console.cloud.google.com)
2. Create a new project named `MediRush`
3. Go to **APIs & Services** → **OAuth consent screen**
   - User Type: **External** → Create
   - Fill in App name and email → Save
4. Go to **APIs & Services** → **Credentials**
   - Click **+ CREATE CREDENTIALS** → **OAuth client ID**
   - Application type: **Web application**
   - Authorized JavaScript origins:
     ```
     http://localhost:8080
     http://localhost:5000
     ```
   - Authorized redirect URIs:
     ```
     http://localhost:5000/api/auth/google/callback
     ```
   - Click **Create**
5. Copy the **Client ID** and **Client Secret** into your `.env` file

---

## 🖥️ Step 6 — Frontend Setup

Open a **new terminal**:

```bash
cd health-delivered-fast/frontend
npm install
npm run dev
```

**Expected output:**
```
VITE v7.x.x  ready in xxxx ms
➜  Local:   http://localhost:8080/
```

---

## 🧪 Step 7 — Test the App

Open your browser and go to: **http://localhost:8080**

You should be redirected to the login page. Test the following:

| Test | Expected Result |
|---|---|
| Visit `http://localhost:8080` | Redirected to `/auth` login page |
| Sign up with email | Account created, redirected to login with success message |
| Login with email | Redirected to dashboard with medicines |
| Click "Continue with Google" | Google account picker appears |
| Google login | Redirected to dashboard, name shown in navbar |
| Add medicines to cart | Cart count updates in navbar |
| Checkout & Place Order | Success modal, order saved in MongoDB |
| Sign out | Redirected to login, localStorage cleared |

---

## 🔌 Verify Backend APIs

Test your backend is working by visiting these URLs in the browser:

```
http://localhost:5000/                    → "MediRush API running ✅"
http://localhost:5000/api/medicines       → JSON array of 12 medicines
```

---

## 🐛 Common Issues & Fixes

### Medicines not loading
- Make sure backend is running on port 5000
- Check MongoDB is started (`net start MongoDB`)
- Verify CORS in `server.js` includes `http://localhost:8080`

### "Failed to fetch" on login
- Backend must be running before the frontend
- Check your `.env` file has correct values

### Google login not working
- Verify redirect URI in Google Console matches exactly: `http://localhost:5000/api/auth/google/callback`
- Make sure `GOOGLE_CLIENT_ID` and `GOOGLE_CLIENT_SECRET` are in `.env`
- Restart backend after changing `.env`

### Port already in use
```bash
# Kill process on port 5000 (Windows)
netstat -ano | findstr :5000
taskkill /PID <PID> /F

# Kill process on port 5000 (Mac/Linux)
lsof -ti:5000 | xargs kill
```

---

## 📂 Environment Variables Reference

| Variable | Description | Example |
|---|---|---|
| `PORT` | Backend server port | `5000` |
| `MONGO_URI` | MongoDB connection string | `mongodb://localhost:27017/medirush` |
| `JWT_SECRET` | Secret key for JWT tokens | Any long random string |
| `GOOGLE_CLIENT_ID` | From Google Cloud Console | `xxxxx.apps.googleusercontent.com` |
| `GOOGLE_CLIENT_SECRET` | From Google Cloud Console | `GOCSPX-xxxxx` |
| `SESSION_SECRET` | Express session secret | Any long random string |
| `CLIENT_URL` | Frontend URL | `http://localhost:8080` |

---

## 🚢 Running Both Servers Summary

```bash
# Terminal 1 — Backend
cd medirush-backend
node server.js

# Terminal 2 — Frontend
cd health-delivered-fast/frontend
npm run dev
```

Both must run simultaneously for the app to work.

---

*Built by Syed Iyanulla — B.E. ISE, GM Institute of Technology (2026)*