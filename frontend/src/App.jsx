import { useEffect, useState } from 'react'
import axios from 'axios'
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer
} from 'recharts'
import './index.css'

const API_URL = 'http://localhost:5000/api'

function App() {
  const [kpis, setKpis] = useState(null)
  const [attritionByDept, setAttritionByDept] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [kpiRes, attrRes] = await Promise.all([
          axios.get(`${API_URL}/kpis/overview`),
          axios.get(`${API_URL}/attrition/by-department`)
        ])

        setKpis(kpiRes.data)
        setAttritionByDept(attrRes.data)
        setError(null)
      } catch (err) {
        console.error(err)
        setError('Failed to load data. Is the backend running on http://localhost:5000 ?')
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [])

  if (loading) {
    return (
      <div className="app">
        <div className="loading">Loading HR Analytics Dashboard...</div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="app">
        <div className="error">{error}</div>
      </div>
    )
  }

  return (
    <div className="app">
      <header className="header">
        <h1>HR Analytics Dashboard</h1>
        <p>Key workforce metrics from your synthetic HR dataset</p>
      </header>

      <div className="container">
        {/* KPI cards */}
        <div className="kpi-grid">
          <div className="kpi-card">
            <div className="kpi-label">Total Headcount</div>
            <div className="kpi-value">
              {kpis.headcount.toLocaleString()}
            </div>
          </div>

          <div className="kpi-card">
            <div className="kpi-label">Attrition Rate</div>
            <div className="kpi-value">
              {kpis.attrition_rate}
              <span className="kpi-unit">%</span>
            </div>
          </div>

          <div className="kpi-card">
            <div className="kpi-label">Average Salary</div>
            <div className="kpi-value">
              {(kpis.avg_salary / 1000).toFixed(1)}
              <span className="kpi-unit">k</span>
            </div>
          </div>

          <div className="kpi-card">
            <div className="kpi-label">Average Tenure</div>
            <div className="kpi-value">
              {kpis.avg_tenure_months.toFixed(1)}
              <span className="kpi-unit"> months</span>
            </div>
          </div>
        </div>

        {/* Charts */}
        <div className="charts-grid">
          <div className="chart-card">
            <h3 className="chart-title">Attrition Rate by Department</h3>
            <ResponsiveContainer width="100%" height={320}>
              <BarChart data={attritionByDept}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis
                  dataKey="department"
                  angle={-45}
                  textAnchor="end"
                  height={80}
                />
                <YAxis
                  label={{ value: 'Attrition Rate (%)', angle: -90, position: 'insideLeft' }}
                />
                <Tooltip />
                <Bar dataKey="attrition_rate" fill="#667eea" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  )
}

export default App
