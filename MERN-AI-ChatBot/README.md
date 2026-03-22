<div align="center">
  <img src="https://upload.wikimedia.org/wikipedia/commons/9/94/MERN-logo.png" alt="MERN Stack" width="400"/>
  <h1>🤖 MERN AI Chatbot</h1>
  <p><strong>A Next-Generation Groq-Powered Conversational AI Built on the MERN Stack</strong></p>
</div>

<div align="center">
  
  [![Features](https://img.shields.io/badge/Features-0052CC?style=for-the-badge&logo=react)](#-features)
  [![Installation](https://img.shields.io/badge/Installation-3CA55C?style=for-the-badge&logo=nodedotjs)](#-installation)
  [![Usage](https://img.shields.io/badge/Usage-FFB020?style=for-the-badge&logo=mongodb)](#-quick-start)
  [![Security](https://img.shields.io/badge/Security-E34F26?style=for-the-badge&logo=jsonwebtokens)](#-security--authentication)

</div>

---

> **MERN AI ChatBot** is an intelligent, high-performance conversational AI application modeled as a modern ChatGPT clone. It features a custom **React UI** that supports secure user authentication, active session tracking via **HTTP-only cookies**, and a beautiful interactive sidebar that saves, loads, and manages multiple chat histories in real-time. Under the hood, the backend replaces traditional OpenAI infrastructure with the **Groq Cloud API** to deliver ultra-fast responses using Meta's `llama-3.1` model.

## ✨ Features

- ⚡ **Blazing Fast AI (Groq Cloud):** Intercepts traditional OpenAI endpoints to route queries through Groq Cloud's LPU hardware, driving instant `llama-3.1-8b-instant` model responses.
- 🗂️ **Multi-Conversation Architecture:** Automatically saves distinct chat threads to MongoDB. Users can freely create new chats, load previous sessions, or safely delete specific histories from an interactive sidebar.
- 🔐 **Bulletproof Authentication:** Validates user logins and signups using `bcrypt` password hashing, encrypted JSON Web Tokens (JWT), and signed HTTP-only cookies to eliminate XSS vulnerabilities.
- 🎨 **Responsive React UI:** A fluid user experience crafted with **Material UI (MUI)**, featuring responsive typing animations (`Exploring...`), dynamic chat mapping, and real-time state popups via `react-hot-toast`.
- ⚙️ **Middleware Chains:** Robust Express routes protected efficiently by layered token authentication schemas and data validation pipelines.

---

## 🛠️ Technologies Used

### Backend Engine
- **MongoDB & Mongoose:** NoSQL Database for tracking individual user document schemas and granular multi-session chat histories.
- **Node.js & Express.js:** Scalable backend framework to handle complex API requests, environment variables, and authentication middleware.
- **JSON Web Tokens (JWT):** Persistent HTTP-only session verification mapping to authenticated users.

### Frontend Interface
- **React.js (w/ TypeScript):** Dynamic frontend ecosystem handling client-side routing, hooks, and responsive async rendering.
- **Material UI (MUI):** Premium component library utilizing `Avatar`, `Box`, and `Typography` layouts.
- **Axios:** Streamlined protocol wrapper bridging REST API parameters with React components.
- **React Syntax Highlighter:** Beautiful syntax formatting built directly into chatbot responses when the AI outputs raw code.

---

## 🚀 Quick Start

### 1. Clone the repository:
```bash
git clone https://github.com/your-username/MERN-ChatBot.git
cd MERN-ChatBot
```

### 2. Install Project Dependencies:
This architecture uses independent `package.json` configurations. You'll need to install them individually.

```bash
# Initialize the Backend
cd backend
npm install

# Initialize the Frontend
cd ../frontend
npm install
```

### 3. Environment Variables 🔑
Create a `.env` file directly inside the `backend` directory.

```env
PORT=5000
MONGODB_URL=your_mongodb_atlas_connection_string
JWT_SECRET=your_secret_hash_value_here
COOKIE_SECRET=your_cookie_secret_value_here
OPEN_AI_SECRET=gsk_your_groq_api_key_goes_here
```

> **Note:** Because this project uses the `Groq API` hardware block, replace the `OPEN_AI_SECRET` with an API Key generated from [console.groq.com](https://console.groq.com/).

### 4. Boot Up the Servers
Start both development environments simultaneously!

```bash
# On Terminal 1
cd backend
npm run dev

# On Terminal 2
cd frontend
npm run dev
```

Visit `http://localhost:5173` to access the front-end!

---

## 🛡️ Security & Authentication

- **HTTP-Only Cookies:** Auth tokens are actively blocked from frontend JavaScript reading arrays, rendering XSS injections completely useless.
- **Password Encryption:** User passwords are encrypted heavily with `bcrypt` (10 Salt Rounds) before they ever hit the database.
- **Mongoose Validation:** Database structures safely reject broken formatting schemas prior to interacting with external APIs.

<div align="center">
  <p>Built with ❤️ using the MERN Stack.</p>
</div>
