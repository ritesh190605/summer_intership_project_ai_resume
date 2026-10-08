<div align="center">

# ✨ AI Resume Builder & Analyzer

**Create, import, analyze, and optimize a career-ready resume with AI-powered intelligence.**

A full-stack **MERN** application that turns resume building from a mundane task into an interactive, career-launching strategy — powered by large language models (Gemini & OpenAI).

![MongoDB](https://img.shields.io/badge/MongoDB-47A248?style=for-the-badge&logo=mongodb&logoColor=white)
![Express](https://img.shields.io/badge/Express-000000?style=for-the-badge&logo=express&logoColor=white)
![React](https://img.shields.io/badge/React-20232A?style=for-the-badge&logo=react&logoColor=61DAFB)
![Node.js](https://img.shields.io/badge/Node.js-339933?style=for-the-badge&logo=node.js&logoColor=white)
![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white)
![Gemini](https://img.shields.io/badge/Gemini-8E75B2?style=for-the-badge&logo=google&logoColor=white)
![OpenAI](https://img.shields.io/badge/OpenAI-412991?style=for-the-badge&logo=openai&logoColor=white)

</div>

---

## 📖 About

**AI Resume Builder & Analyzer** is a full-stack platform built on the **MERN stack** (MongoDB, Express, React, Node.js) and powered by large language models (Gemini & OpenAI) to turn resume writing into a fast, intelligent, career-launching experience. It streamlines the entire resume lifecycle — guided creation, one-click import, AI-powered analysis, and ATS optimization — so you can go from a blank page to a polished, job-ready document in minutes.

- **Guided Creation** — a step-by-step wizard covers Personal Info, Experience, Education, Skills, Certifications, and Languages, with validation at every step.
- **Smart Import** — upload an existing resume (PDF, Word, or TXT) and let the AI auto-extract your details, save them, and trigger an instant analysis.
- **Comprehensive AI Suite** — ATS matching, skill gap analysis, keyword density, context quality, tech stack recommendations, and tailored interview questions.
- **Live Preview** — a real-time preview inside an interactive 3D diary interface with page-turn effects.
- **Flexible & Secure** — provider-agnostic AI, rate limiting, Helmet, and a MongoDB setup that falls back to an in-memory database for instant local development.

---

## ✨ Features

###  Smart Builder

- Step-by-step **wizard** with guided forms and per-section validation
- **Real-time live preview** with interactive 3D paper/diary effects
- **Import existing resume** (PDF, Word, TXT) with AI auto-extraction
- Round-trip saving & download once confirmed

### AI Intelligence Suite

- **Overall Resume Score** — clarity, quantified impact, and keyword alignment
- **ATS & Job Description Match** — score against a real job description
- **Skill Gap Analysis** — missing/underdeveloped skills with actionable advice
- **Keyword Density & Context** — frequency, relevance, and usage context
- **Context Quality & Impact** — quantified results, action verbs, rich context
- **Tech Stack Recommendations** — role-relevant technologies to learn/highlight
- **Interview Questions** — tailored technical, behavioral, system-design, and deep-dive questions
- **History & Analytics** — track score progression across analyses

### Authentication Portal

- Fully **simulated client-side** login (Google, Apple, Email/Password, Phone OTP)
- Session persistence via `localStorage`

### Backend & Security

- **Provider-agnostic AI** — switch Gemini ⇄ OpenAI via a single env variable
- **Rate limiting** on AI-heavy endpoints to prevent abuse
- **Helmet** security headers, **CORS**, and **Morgan** logging
- **Flexible MongoDB** connection with **in-memory fallback** for instant dev

---

## Tech Stack

| Layer            | Technology                                                 |
| ---------------- | ---------------------------------------------------------- |
| **Frontend**     | React 18, Tailwind CSS, Lucide React, Axios                |
| **Backend**      | Node.js, Express, Mongoose, Multer                         |
| **Database**     | MongoDB (with `mongodb-memory-server` fallback)            |
| **AI/LLM**       | Google Gemini (`gemini-2.0-flash`), OpenAI (`gpt-4o-mini`) |
| **File Parsing** | `pdf-parse`, `mammoth`                                     |
| **Security**     | Helmet, Express Rate Limit, CORS                           |

---

## 🏗️ Architecture

```
┌────────────────────────────────────────────────────────────┐
│                        FRONTEND (React)                    │
│  ┌──────────┐  ┌──────────┐  ┌─────────────┐  ┌────────┐  │
│  │  Wizard   │  │ Upload/  │  │ AI Feedback │  │ Login/ │  │
│  │  Builder  │  │ Import   │  │ Panel       │  │ Auth   │  │
│  └──────────┘  └──────────┘  └─────────────┘  └────────┘  │
│                    ResumeContext (state)                    │
└──────────────────────────┬─────────────────────────────────┘
                           │ REST API (Axios)
┌──────────────────────────▼─────────────────────────────────┐
│                     BACKEND (Express)                       │
│  ┌──────────────┐  ┌───────────────┐  ┌──────────────────┐  │
│  │  Resume Routes│ │  Controllers   │  │  AI Service      │  │
│  │  + Rate Limit│ │  (CRUD, AI)    │  │  (Gemini/OpenAI) │  │
│  └──────────────┘  └───────────────┘  └──────────────────┘  │
└──────────────────────────┬─────────────────────────────────┘
                           │
┌──────────────────────────▼─────────────────────────────────┐
│                     MongoDB (Mongoose)                      │
│     Persistent Atlas  ──OR──  In-Memory (dev fallback)      │
└────────────────────────────────────────────────────────────┘
```


---

##  AI Analysis Dimensions

1. **Overall Resume Score** — clarity, quantified impact, and keyword alignment.
2. **ATS & Job Description Match** — keyword match, format compatibility, and section completeness.
3. **Skill Gap Analysis** — missing/underdeveloped skills with actionable suggestions.
4. **Keyword Density & Context** — frequency, density, and usage context.
5. **Context Quality & Impact** — quantified results, action verbs, and rich context.
6. **Tech Stack Recommendations** — role-relevant technologies to learn or highlight.
7. **Interview Questions** — tailored technical, behavioral, and system-design questions.
8. **History & Analytics** — track score progression over time.

---

## ✅ Upcoming / Roadmap

- [ ] Real, server-side authentication (JWT + role-based access)
- [ ] PDF/Word export with professional templates
- [ ] More resume templates & customization
- [ ] Cloud file storage for uploaded resumes
- [ ] Multi-resume management & comparison

---

## 📄 License

Distributed under the **MIT License**. See `LICENSE` for more information.

---

<div align="center">

**Built with ❤️ using the MERN stack + AI**

</div>
