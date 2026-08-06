# LexiAgent AI — Autonomous Legal Assistant

> **Hackathon Theme:** Agentic AI & Intelligent Systems  
> **Tech Stack:** Google Gemini API (`@google/genai`), React.js, Vite, Tailwind CSS, Node.js, Express.js, MongoDB, JWT Authentication.

---

## 🌟 Features Overview

LexiAgent AI goes beyond a basic chatbot by implementing a **Multi-Agent Architecture** coordinated by an Orchestrator Agent.

- **🤖 Multi-Agent AI System:**
  - **Orchestrator Agent:** Classifies user intent, plans workflows, dispatches tasks, and merges agent outputs.
  - **Document Analysis Agent:** Identifies contract types, extracts obligations, deadlines, and penalties.
  - **Risk Auditor Agent:** Evaluates financial liability, non-competes, privacy, and scam indicators (Low, Medium, High, Critical).
  - **Draft Generator Agent:** Creates formal Legal Notices, Complaints, NDAs, Rental Agreements, Employment Agreements, Affidavits, and Contracts.
  - **Legal Conversation Agent:** Contextually answers questions in beginner-friendly English under 120 words per clause.
  - **Memory Agent:** Maintains persistent context across chat history, uploaded documents, and generated drafts.
- **📄 Document Intelligence:** Server-side text parsing for PDF (`pdf-parse`), Word (`mammoth`), and TXT files up to 20MB.
- **🔐 Enterprise Security:** JWT token authentication, bcrypt password hashing, Zod schema validation, Helmet security headers, and Express rate-limiting (30 AI requests/hr per user).
- **🎨 Modern SaaS Design:** Glassmorphism cards, dark/light mode theme toggle, Framer Motion animations, and Toast notifications.

---

## 📁 Repository Folder Structure

```
lexiagent/
├── client/
│   ├── src/
│   │   ├── components/        # Navbar, Footer, UploadCard, RiskCard, DraftEditor, etc.
│   │   ├── context/           # AuthContext, ThemeContext, NotificationContext
│   │   ├── pages/             # Landing, Login, Register, Dashboard, Chat, Upload, Analysis, Draft, History, etc.
│   │   ├── services/          # API Axios clients (authService, documentService, etc.)
│   │   ├── App.jsx            # Protected routes & app layout
│   │   ├── index.css          # Tailwind CSS directives & glassmorphism utilities
│   │   └── main.jsx
│   ├── .env.example
│   ├── tailwind.config.js
│   └── vite.config.js
├── server/
│   ├── src/
│   │   ├── config/            # DB, Gemini SDK, Env configuration
│   │   ├── controllers/       # Auth, Chat, Document, Draft, Dashboard, Notification controllers
│   │   ├── middleware/        # JWT Protect, Multer Upload, Zod Validation, Rate Limiter, Error Handler
│   │   ├── models/            # User, Conversation, Message, Document, Analysis, Draft, Notification, Analytics, Log
│   │   ├── prompts/           # System Prompts & Injection Protections
│   │   ├── routes/            # REST API endpoints
│   │   ├── services/          # @google/genai SDK wrapper & Multi-Agent implementations
│   │   ├── utils/             # TextExtractor, JWT, ActivityLogger
│   │   ├── app.js             # Express application setup
│   │   └── server.js          # HTTP Server listener
│   ├── uploads/               # Secure document storage
│   └── .env.example
├── package.json               # Root monorepo scripts
└── README.md
```

---

## 🚀 Quick Setup & Installation

### Prerequisites
- **Node.js**: v18.0.0 or higher
- **npm**: v9.0.0 or higher
- **MongoDB**: Local MongoDB instance (`mongodb://127.0.0.1:27017`) or MongoDB Atlas URI.

### 1. Install Dependencies
Run the command below from the root directory to install dependencies for both `server` and `client`:

```bash
npm run setup
```

Alternatively, install individually:
```bash
cd server && npm install
cd ../client && npm install
```

---

## 🔑 Environment Variables Setup

### Backend (`server/.env`)
Create `server/.env` based on `server/.env.example`:

```env
PORT=5000
MONGODB_URI=mongodb://127.0.0.1:27017/lexiagent
JWT_SECRET=lexiagent_super_secret_jwt_key_2026_hackathon_demo
JWT_EXPIRES_IN=7d
GEMINI_API_KEY=your_gemini_api_key_here
CLIENT_URL=http://localhost:5173
NODE_ENV=development
```

### Frontend (`client/.env`)
Create `client/.env` based on `client/.env.example`:

```env
VITE_API_BASE_URL=http://localhost:5000/api
```

---

## 🏃 Running the Application

### Option A: Run Both Client & Backend Concurrently (Recommended)

From the root directory, execute:
```bash
npm run dev
```
- **Frontend App:** [http://localhost:5173](http://localhost:5173)
- **Backend API:** [http://localhost:5000/api/health](http://localhost:5000/api/health)

### Option B: Run Server and Client Separately

```bash
# Terminal 1: Backend Server
cd server
npm start

# Terminal 2: Frontend Client
cd client
npm run dev
```

---

## 🌐 Key REST API Endpoints

### Authentication
- `POST /api/auth/register` — Create user account
- `POST /api/auth/login` — Authenticate user & return JWT token
- `GET /api/auth/me` — Retrieve current authenticated user profile
- `PUT /api/auth/profile` — Update name, phone, bio
- `PUT /api/auth/change-password` — Change account password

### Document Intelligence & Pipeline
- `POST /api/document/upload` — Upload PDF/DOCX/TXT document (max 20MB)
- `GET /api/document` — Get all uploaded documents
- `GET /api/document/:id` — Retrieve document & latest analysis
- `POST /api/document/:id/analyze` — Trigger AI Agent analysis & risk detection

### Multi-Agent AI Legal Chat
- `POST /api/chat/start` — Start new legal conversation
- `POST /api/chat/message` — Send message to Orchestrator Agent (Rate Limited: 30/hr)
- `GET /api/chat/history` — Fetch user conversations
- `DELETE /api/chat/:conversationId` — Delete conversation

### Legal Draft Generator
- `POST /api/draft/generate` — Generate formal legal draft (NDA, Rental Agreement, Complaint, Notice, Affidavit, etc.)
- `GET /api/draft` — Fetch generated drafts list

---

## 🛠️ Verification & Production Build

To verify that the application compiles cleanly for production:

```bash
npm run build
```

This compiles the client Vite bundle into `client/dist`.

---

## 📜 License & Disclaimers

LexiAgent AI is developed for educational and hackathon demonstration purposes. LexiAgent AI provides AI-synthesized legal clarity and automated draft generation, but does not substitute licensed legal counsel.
