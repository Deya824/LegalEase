# ⚖️ LegalEase

**LegalEase** is a full-stack web platform that connects clients with lawyers — making it easy to browse legal professionals, send hire requests, manage appointments, and process payments, all in one place.

---

## 🌐 Live URL

🔗 [https://hireme-zeta-two.vercel.app](https://hireme-zeta-two.vercel.app)

---

## 🎯 Purpose

LegalEase bridges the gap between clients seeking legal help and lawyers offering their services. Clients can discover lawyers, hire them, leave reviews, and track their transaction history — while lawyers can manage their profiles, services, and incoming hire requests. Admins have full oversight of users, transactions, and platform analytics.

---

## ✨ Key Features

### 👤 Client
- Browse and search all available lawyers
- Send hire requests to lawyers
- Pay for legal services through the platform
- View personal transaction history
- Leave comments/reviews (only after hiring)

### 🧑‍⚖️ Lawyer
- Create and update a professional profile
- Manage offered legal services
- View and respond to incoming hire requests
- Track paid transactions

### 🛡️ Admin
- View and manage all registered users
- Assign or update user roles
- Monitor all platform transactions
- Access analytics (total users, lawyers, hires, revenue)

### 🔐 Auth & Security
- JWT-based authentication with role-based access control
- Protected routes for users, lawyers, and admins
- Secure sign-in / sign-up flow

---

## 🛠️ NPM Packages Used

### Frontend (Next.js)
| Package | Purpose |
|---|---|
| `next` | React framework with App Router |
| `react` / `react-dom` | UI library |
| `@heroui/react` | UI component library (Button, etc.) |
| `@gravity-ui/icons` | Icon set (Bars, Xmark, etc.) |
| `better-auth` / auth-client | Authentication (session, signOut) |
| `tailwindcss` | Utility-first CSS framework |

### Backend (Node.js / Express)
| Package | Purpose |
|---|---|
| `express` | Web server framework |
| `cors` | Cross-origin resource sharing |
| `mongodb` | MongoDB driver (MongoClient, ObjectId) |
| `dotenv` | Environment variable management |
| `node:dns` | DNS resolver configuration |
| `jsonwebtoken` | JWT token verification (used in auth middleware) |

---

## 🗂️ Project Structure

```
LegalEase/
├── client/                  # Next.js frontend
│   ├── app/
│   │   ├── dashboard/       # User / Lawyer / Admin dashboards
│   │   ├── lawyers/         # Browse lawyers page
│   │   └── auth/            # Sign in / Sign up pages
│   ├── components/
│   │   └── Navbar.jsx       # Sticky responsive navbar
│   └── lib/
│       └── auth-client.js   # Auth session helpers
│
└── server/                  # Express backend
    ├── middleware/
    │   └── auth.js          # verifyToken, requireRole
    └── index.js             # All API routes
```

---

## 🚀 Getting Started

### Prerequisites
- Node.js v18+
- MongoDB Atlas account
- `.env` file with:


```

### Install & Run

```bash
# Backend
cd server
npm install
npm start

# Frontend
cd client
npm install
npm run dev
```

---

## 👨‍💻 Author

**Deya824** — [GitHub Profile](https://github.com/Deya824)
