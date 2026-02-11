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
