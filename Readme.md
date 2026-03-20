# 🚀 LokDrishti

### 🧠 Know Before You Vote

LokDrishti is an **AI-powered civic intelligence platform** that transforms raw parliamentary data into **powerful, easy-to-understand insights** about Members of Parliament (MPs).

It empowers citizens with **data-driven transparency**, helping them evaluate political performance beyond speeches and promises.

---

## 🌐 Live Demo

🔗 https://lokdrishti.online

---

## ⚡ What Makes LokDrishti Unique?

* 📊 Converts complex parliamentary data into **visual insights**
* 🏆 Ranks MPs across **national, state, and party levels**
* 🤖 Uses a custom **Legislative Contribution Index (LCI)**
* 🔍 Detects **Silent MPs** (low participation)
* ⚖️ Integrates **Criminal Record Intelligence**
* 🧠 Provides **AI-like civic insights for voters**

---

## ✨ Features

### 📈 MP Intelligence Dashboard

* Attendance tracking
* Questions asked
* Debate participation
* Engagement Index
* LCI Score with grading (A–F)

### 🏆 Ranking System

* National rankings
* State-wise rankings
* Party-wise rankings
* Leaderboards

### ⚠️ Civic Risk Indicators

* Silent MP detection
* Low-performance alerts
* Criminal case tracking (IPC-based insights)

### 🔎 Smart Exploration

* Search MPs by name, state, constituency
* Compare MPs side-by-side
* Constituency finder

---

## 🧠 Core Metric: LCI (Legislative Contribution Index)

A proprietary score combining:

* Attendance
* Questions asked
* Debate participation

👉 Provides a **single, unbiased performance score (0–1)**

---

## 🏗️ System Architecture

```
Frontend (Next.js + React)
        ↓
Flask REST API (Backend)
        ↓
Service Layer (Business Logic)
        ↓
Analytics Engine (Scoring & Ranking)
        ↓
SQLite Database (Structured Data)
```

---

## 🔌 API Endpoints

### 📊 MP Data

```
GET /api/mps
GET /api/mps/<name>
```

### 🏆 Rankings

```
GET /api/rankings/national
GET /api/rankings/state/<state>
GET /api/rankings/party/<party>
GET /api/rankings/leaderboard/state
GET /api/rankings/leaderboard/party
```

### 📈 Analytics

```
GET /api/analytics/state-strength
GET /api/analytics/party-dominance
GET /api/analytics/inequality
GET /api/analytics/imbalance
```

### ⚖️ Criminal Intelligence

```
GET /api/mps/<name>/criminal
```

---

## 📊 Performance Metrics

LokDrishti evaluates MPs using:

* 📊 LCI Score
* 📅 Attendance %
* 💬 Questions Asked
* 🎤 Debate Participation
* ⚡ Engagement Index
* 🏆 National Rank
* 📍 State Rank
* 🏛 Party Rank
* 📈 Percentile Ranking
* 🔇 Silent MP Detection
* ⚖️ Criminal Case Analysis

---

## 🛠 Tech Stack

### 🔙 Backend

* Python
* Flask
* SQLAlchemy
* SQLite
* Pandas

### 🌐 Frontend

* Next.js
* React
* Tailwind CSS
* Vercel (Deployment)

### ☁️ Deployment

* Backend → Render
* Frontend → Vercel
* Domain → Hostinger

---

## 📍 Project Status

* ✅ Backend API — Completed
* ✅ Deployment (Render + Vercel) — Completed
* 🚧 Frontend UI — Advanced Development
* 🚀 AI Insights Layer — Upcoming

---

## 🔮 Future Roadmap

* 🤖 AI-powered MP insights & summaries
* 📊 Predictive election analytics
* 📱 Mobile app version
* 🌍 Public civic dashboard
* 🗳 Voter awareness tools

---

## 🎯 Vision

LokDrishti aims to build a future where:

> **Every citizen can evaluate leaders using data, not opinions.**

We believe democracy becomes stronger when voters are informed.

---

## 💡 Inspiration

India has vast parliamentary data — but it is **complex, scattered, and inaccessible**.

LokDrishti bridges that gap by making data:

* Simple
* Visual
* Actionable

---

## 👨‍💻 Author

**Piyush Ladukar**
Software Developer | Civic Tech Builder

---

## ⭐ Support

If you like this project:

* ⭐ Star the repo
* 🔁 Share it
* 🧠 Contribute ideas

---

## 🇮🇳 Final Thought

> Democracy is not just about voting.
> It’s about voting **informed**.

### 🔥 Know Before You Vote.
