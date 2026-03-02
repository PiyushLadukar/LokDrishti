# 🇮🇳 LokDrishti

**LokDrishti** is a civic analytics platform evaluating the performance of Indian Members of Parliament (MPs) using structured 18th Lok Sabha data.

---

### 🚀 Vision
Bringing transparency to governance by treating parliamentary participation with the same rigour as academic attendance.
* **Transparency:** Data-driven civic insights.
* **Objectivity:** Scalable ranking engine for elected reps.

### 📊 Performance Metric (LCI)
The **LokDrishti Civic Index (LCI)** is calculated as:
$$LCI = 0.4(\text{Attendance}) + 0.3(\text{Debates}) + 0.3(\text{Questions})$$

### ✅ Current Progress
* **Data Source:** Official PRS 18th Lok Sabha Dataset (544 MPs).
* **Engine:** Automated cleaning and normalization layers.
* **Output:** National, State, and Party-wise rankings.

### 🏗 Architecture
* **`data/`**: Raw PRS MP Track CSV.
* **`processing/`**: Python scripts for cleaning and LCI scoring.
* **`output/`**: Ranked datasets with constituency-level metrics.

### 🔜 Roadmap
* **Backend:** Migration from CSV/SQLite to PostgreSQL + FastAPI.
* **Frontend:** Interactive dashboard for public comparisons.
* **Historical:** Integration of 16th and 17th Lok Sabha data.

---
**Built by [Piyush Ladukar](https://github.com/your-profile)** | *Building in Public*
