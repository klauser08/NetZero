# NetZero – AI-Powered Carbon Reduction Advisor

[![Tech Stack](https://img.shields.io/badge/Stack-MERN%20%2B%20GenAI-brightgreen.svg)](#tech-stack)
[![RAG Pipeline](https://img.shields.io/badge/Architecture-RAG%20%2B%20Vector%20Search-blue.svg)](#rag-architecture)
[![LLM API](https://img.shields.io/badge/AI-Google%20Gemini%20API-orange.svg)](#features)

**NetZero** is a full-stack MERN application extended with a **Retrieval-Augmented Generation (RAG)** pipeline. It calculates individual carbon footprints deterministically across energy, transportation, cooking gas, and diet—and then delivers personalized, factually grounded carbon reduction recommendations backed by a curated sustainability knowledge base.

---

## 🌟 Key Features

* **Deterministic Carbon Footprint Calculation**: Computes exact monthly $CO_2$ emissions ($kg$) and category percentages ($Electricity, LPG, Travel, Food$) using verified mathematical formulas in JavaScript.
* **Retrieval-Augmented Generation (RAG) Advisor**: Analyzes user emission bottlenecks, retrieves relevant sustainability context, and generates source-cited action plans.
* **Vector Database & Similarity Search**: Utilizes **Cosine Similarity** ($\frac{\vec{A} \cdot \vec{B}}{\|\vec{A}\|\|\vec{B}\|}$) over 128-dimensional vector embeddings to query a curated knowledge base.
* **Recursive Document Chunking**: Implements text chunking ($400$ characters with $50$ character sliding overlap) to preserve context continuity.
* **Anti-Hallucination & Source Grounding**: Enforces strict system prompt constraints ($\text{temp} = 0.2$) requiring the LLM to cite sources (`[Source 1]`) and refuse unsupported claims.
* **Resilient Offline Fallback Mode**: Automatically degrades to direct vector chunk extraction if API limits or offline modes occur, ensuring 100% application uptime.
* **Modern Interactive UI**: Dynamic EJS interface featuring charts, loading state spinners, markdown advice cards, and collapsible source citations.

---

## 🏗️ RAG System Architecture

```
[User Form Inputs] ──► [Deterministic Math Engine] ──► [Percentage Breakdown]
                                                               │
                                                               ▼
[Grounding Citation UI] ◄── [Gemini LLM (temp=0.2)] ◄── [Top-K Vector Retrieval]
```

1. **Calculations**: User inputs are processed by deterministic JS handlers (`POST /calculator`).
2. **Query Formulation**: The engine extracts top emission drivers (e.g. Travel 55%) to build a domain query.
3. **Vector Retrieval**: Top-3 relevant context chunks are fetched from `data/vectorStore.json` using Cosine Similarity.
4. **Grounded Synthesis**: Context chunks + user statistics are passed to Gemini LLM with anti-hallucination rules.
5. **UI Citations**: Output is rendered in Markdown with collapsible source citations.

---

## 🛠️ Tech Stack

* **Frontend**: EJS, HTML5, CSS3, JavaScript, Chart.js, Bootstrap 5
* **Backend**: Node.js, Express.js, Passport.js, Express-Session
* **Database**: MongoDB, Mongoose
* **GenAI / RAG**: Google Gemini API (`@google/generative-ai`), Custom Vector Store, Cosine Similarity Math Engine
* **Tooling**: Dotenv, Bcrypt, Stripe

---

## 🚀 Quick Setup & Installation

### 1. Clone the Repository
```bash
git clone https://github.com/YOUR_USERNAME/NetZero-AI-Advisor.git
cd NetZero-AI-Advisor
```

### 2. Install Dependencies
```bash
npm install --legacy-peer-deps
```

### 3. Environment Configuration
Create a `.env` file in the root directory:
```env
PORT=3000
MONGODB_URI=mongodb://127.0.0.1:27017/netzeroDB
GEMINI_API_KEY=YOUR_FREE_GEMINI_API_KEY_FROM_GOOGLE_AI_STUDIO
SESSION_SECRET=netzero_secret_key
```

### 4. Run Knowledge Base Ingestion (Optional)
```bash
node rag/ingest.js
```

### 5. Start the Application
```bash
node app.js
```
Open **`http://localhost:3000/calculator`** in your browser!

---

## 📄 License
This project is open source and available under the [ISC License](LICENSE).
