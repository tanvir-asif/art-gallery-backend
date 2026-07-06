# 🗄️ The Virtual Gallery — Server / API

A secure **Express + MongoDB** REST API that powers the 3D Virtual Gallery. It manages artworks, image uploads to Cloudinary, and multi-admin authentication.

**🗄️ Backend repo:** [art-gallery-backend](https://github.com/tanvir-asif/art-gallery-backend) · **🖼️ Frontend repo:** [art-gallery](https://github.com/tanvir-asif/art-gallery) · **🔗 Live demo:** _coming soon_

## ✨ Short description
The API serves the public artwork list the 3D scene builds itself from, and protects all write routes behind JWT auth delivered as an httpOnly, SameSite=Strict cookie. Admins are stored in MongoDB (bootstrapped from env on first run), so passwords can be changed and additional admins created from the dashboard. Uploads stream to Cloudinary and are validated by magic bytes — not just file extension. Login is rate-limited, Helmet sets security headers, and only Cloudinary `secure_url` + `public_id` are persisted. Designed to run comfortably on free tiers (Render + MongoDB Atlas + Cloudinary).

## 🚀 Features
- 🎨 Artworks CRUD + drag-to-reorder (`order` persisted)
- 🔐 JWT auth via httpOnly · Secure · SameSite=Strict cookie (~2h)
- 👥 Multi-admin management — create / delete admins, change own password
- 🔒 bcrypt password hashing (never plaintext) + generic login errors
- 🛡️ Rate-limited login, Helmet headers, CORS locked to the client origin
- ☁️ Cloudinary uploads with **MIME + magic-byte** validation (10 MB cap)
- 🌱 Auto-seeds the first admin from `.env`, plus a placeholder artwork script

## 🧰 Tech stack
Node.js · Express · MongoDB · Mongoose · Cloudinary SDK · Multer · jsonwebtoken · bcryptjs · Helmet · express-rate-limit

## 🏁 Getting started
```bash
npm install
cp .env.example .env
npm run hash -- "yourStrongPassword"   # → paste into ADMIN_PASSWORD_HASH
npm run seed                           # optional placeholder artworks
npm run dev                            # http://localhost:5000
```

## 📡 API
| Method | Route | Auth | Body |
|--------|-------|:----:|------|
| GET | `/api/artworks` | – | – |
| POST | `/api/artworks` | ✔ | `multipart`: image, title, description |
| PUT | `/api/artworks/:id` | ✔ | `{ title?, description?, order? }` |
| PUT | `/api/artworks/reorder` | ✔ | `{ ids: [...] }` |
| DELETE | `/api/artworks/:id` | ✔ | – |
| POST | `/api/auth/login` | – | `{ user, password }` (rate-limited) |
| POST | `/api/auth/logout` | – | – |
| GET | `/api/auth/me` | ✔ | – |
| POST | `/api/auth/change-password` | ✔ | `{ currentPassword, newPassword }` |
| GET / POST | `/api/admins` | ✔ | list / `{ username, password }` |
| PUT / DELETE | `/api/admins/:id` | ✔ | `{ username?, password? }` / – |

## 🔧 Environment
`MONGODB_URI` · `CLOUDINARY_CLOUD_NAME` · `CLOUDINARY_API_KEY` · `CLOUDINARY_API_SECRET` · `ADMIN_USER` · `ADMIN_PASSWORD_HASH` · `JWT_SECRET` · `PORT` · `CLIENT_ORIGIN` · `NODE_ENV` — see [.env.example](.env.example).

## 🔗 Related
- **Frontend:** [art-gallery](https://github.com/tanvir-asif/art-gallery)
- **Live site:** _coming soon_

## 📄 License
MIT — see [LICENSE](LICENSE).
