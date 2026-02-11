# HR Analytics Project (Synthetic Data, API, React, Power BI)

End-to-end HR analytics project with:

- Synthetic HR dataset (5,000+ employees) generated in Python
- Data stored in Parquet + SQLite
- REST API built with Node.js + Express + SQLite
- React frontend dashboard (Vite + Recharts)
- Power BI report connected directly to the Parquet file

## Project Structure

```text
hr-analytics-project/
├─ data/                    # Generated datasets
│  ├─ hr_employees.parquet
│  ├─ hr_analytics.db
├─ notebooks/               # Jupyter notebooks
│  ├─ 01_generate_hr_data.ipynb
├─ backend/                 # Node.js REST API
│  ├─ server.js
│  ├─ database.js
│  ├─ package.json
├─ frontend/                # React dashboard
│  ├─ src/App.jsx
│  ├─ src/main.jsx
│  ├─ src/index.css
│  ├─ package.json
├─ powerbi/                 # Power BI report
│  ├─ hr_analytics_dashboard.pbix
├─ .gitignore
└─ README.md

## 💡 Skills Demonstrated

- **Data Engineering**
  - Synthetic data generation with Python, Pandas, NumPy, Faker
  - Writing columnar data to Parquet and loading into SQLite
  - Designing a schema for HR analytics (employees with demographics, compensation, performance, attrition)

- **Backend Engineering**
  - Building a REST API with Node.js + Express
  - Integrating SQLite from Node, writing SQL for HR KPIs (headcount, attrition, comp)
  - Structuring endpoints for analytics use cases (/api/kpis/overview, /api/attrition/by-department, etc.)

- **Frontend Engineering**
  - React + Vite setup for a small analytics dashboard
  - Consuming REST APIs with Axios
  - Building KPI cards and charts with Recharts

- **Business Intelligence (Power BI)**
  - Connecting Power BI directly to Parquet as a data source
  - Creating HR measures in DAX (headcount, attrition rate, avg salary, avg tenure)
  - Designing multi-page HR dashboards (Overview, Attrition deep dive)

- **End-to-End Project Delivery**
  - Organizing a multi-folder project for analytics (data, notebooks, backend, frontend, powerbi)
  - Using Git and GitHub to version and share a complete portfolio project
