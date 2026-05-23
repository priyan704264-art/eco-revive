# ReCupare — Recycle. Reuse. Rebuild.

AI-powered e-waste recovery platform. Scan circuit boards, identify components, list them on the marketplace, and earn money while saving the planet.

---

## 🚀 Deploy on Railway (Monorepo — Both Services)

This repo contains both the **React frontend** and the **FastAPI backend** in one place. On Railway you create **two services** pointing to the same GitHub repo, each with a different root directory.

### Step 1 — Push to GitHub
```bash
git remote set-url origin https://github.com/priyan704264-art/eco-revive.git
git add .
git commit -m "chore: configure Railway monorepo deployment"
git push -u origin main
```

### Step 2 — Create Railway Project
1. Go to [railway.app](https://railway.app) → **New Project** → **Deploy from GitHub repo**
2. Select `priyan704264-art/eco-revive`

---

### Service 1: Backend (FastAPI + YOLO)

In Railway dashboard after creating the project:

1. Click the service → **Settings** → **Source**
2. Set **Root Directory** → `backend`
3. Railway auto-detects `nixpacks.toml` inside `backend/` and uses it
4. Go to **Variables** tab and add:
   ```
   RAZORPAY_KEY_ID=rzp_test_your_key_id
   RAZORPAY_KEY_SECRET=your_razorpay_key_secret
   PORT=8000
   ```
5. Deploy. Copy the generated URL (e.g. `https://eco-revive-backend.up.railway.app`)

---

### Service 2: Frontend (React + Vite)

1. In the same Railway project → **New Service** → **GitHub Repo** → same repo
2. Set **Root Directory** → `/` (leave blank / repo root)
3. Railway uses `nixpacks.toml` at root — builds with `npm run build`, serves with `serve`
4. Go to **Variables** tab and add:
   ```
   VITE_BACKEND_URL=https://eco-revive-backend.up.railway.app
   VITE_SUPABASE_URL=https://your-project.supabase.co
   VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
   VITE_GROQ_API_KEY=your_groq_api_key
   VITE_RAZORPAY_KEY_ID=rzp_test_your_key_id
   ```
5. Deploy. Your frontend is live!

---

## 💻 Local Development

### Backend
```bash
cd backend
pip install -r requirements.txt
# Create backend/.env with RAZORPAY_KEY_ID and RAZORPAY_KEY_SECRET
uvicorn server:app --reload --port 8000
```

### Frontend
```bash
# In repo root — create .env.local from .env.example
npm install
npm run dev
# Vite proxies /detect and /api/* to http://127.0.0.1:8000 automatically
```

---

## 🗂 Project Structure

```
eco-revive/
├── backend/              ← FastAPI + YOLO (Railway service 1)
│   ├── server.py
│   ├── best.pt           ← YOLO model weights
│   ├── requirements.txt
│   ├── Procfile
│   ├── nixpacks.toml     ← Python build config for Railway
│   └── .env.example
├── src/                  ← React frontend
│   ├── components/
│   ├── pages/
│   └── lib/
├── public/
├── index.html
├── package.json
├── vite.config.js
├── nixpacks.toml         ← Node build config for Railway (frontend)
├── railway.toml          ← Railway deployment hints
└── .env.example          ← Frontend env vars template
```

---

## 🔑 Environment Variables Reference

| Variable | Service | Description |
|---|---|---|
| `VITE_BACKEND_URL` | Frontend | Deployed backend URL |
| `VITE_SUPABASE_URL` | Frontend | Supabase project URL |
| `VITE_SUPABASE_ANON_KEY` | Frontend | Supabase anon key |
| `VITE_GROQ_API_KEY` | Frontend | Groq API key |
| `VITE_RAZORPAY_KEY_ID` | Frontend | Razorpay public key |
| `RAZORPAY_KEY_ID` | Backend | Razorpay key ID |
| `RAZORPAY_KEY_SECRET` | Backend | Razorpay secret key |
| `PORT` | Backend | Port (Railway sets this automatically) |

---

## Tech Stack

- **Frontend**: React 18, Vite, Tailwind CSS, Supabase, Groq AI
- **Backend**: FastAPI, Ultralytics YOLO, Razorpay, Python 3.11
- **Database**: Supabase (PostgreSQL)
- **Payments**: Razorpay
- **Deployment**: Railway
