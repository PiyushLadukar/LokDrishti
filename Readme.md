# LokDrishti

### Know Before You Vote

LokDrishti is a civic analytics platform that analyzes the performance of Members of Parliament using parliamentary activity data. The platform aims to improve political transparency by converting raw parliamentary data into understandable performance metrics.

---

# Features

• MP performance analytics
• National, state, and party rankings
• Legislative Contribution Index (LCI) scoring
• Silent MP detection
• Political performance insights

---

# System Architecture

Frontend (Next.js – upcoming)
↓
Flask REST API
↓
Service Layer
↓
Analytics Engine
↓
SQLite Database

---

# API Endpoints

## MP Data

GET /api/mps
GET /api/mps/<name>

---

## Rankings

GET /api/rankings/national
GET /api/rankings/state/<state>
GET /api/rankings/party/<party>

---

## Analytics

GET /api/analytics/state-strength
GET /api/analytics/party-dominance
GET /api/analytics/inequality
GET /api/analytics/imbalance

---

# Performance Metrics

LokDrishti calculates multiple metrics including:

• LCI Score (Legislative Contribution Index)
• Attendance
• Debates
• Questions asked
• Engagement Index
• National Rank
• State Rank
• Party Rank
• Percentile ranking
• Silent MP detection

---

# Tech Stack

Backend
Python
Flask
SQLite
SQLAlchemy
Pandas

Frontend (Next Phase)
Next.js
React
TailwindCSS

---

# Project Status

Backend API Layer — Completed
Frontend Web Application — In Progress

Next milestone:
Build a Next.js dashboard to visualize MP rankings and analytics.

---

# Vision

LokDrishti aims to make political performance transparent and accessible so citizens can make informed voting decisions.

Know Before You Vote.
