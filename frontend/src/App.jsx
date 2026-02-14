import { useEffect, useState } from 'react'
import axios from 'axios'
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend
} from 'recharts'
import './index.css'

const API_URL = 'http://localhost:5000/api'

function App() {
  const [kpis, setKpis] = useState(null)
  const [attritionByDept, setAttritionByDept] = useState([])
  const [salaryByDept, setSalaryByDept] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  const [selectedDept, setSelectedDept] = useState('Engineering')
  const [insightType, setInsightType] = useState('performance')
  const [deptSummary, setDeptSummary] = useState(null)
  const [isQueryLoading, setIsQueryLoading] = useState(false)
  const [queryError, setQueryError] = useState(null)

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [kpiRes, attrRes, salaryRes] = await Promise.all([
          axios.get(`${API_URL}/kpis/overview`),
          axios.get(`${API_URL}/attrition/by-department`),
          axios.get(`${API_URL}/salary/by-department`)
        ])

        setKpis(kpiRes.data)
        setAttritionByDept(attrRes.data)
        setSalaryByDept(salaryRes.data)
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

  const handleUpdateInsights = async (e) => {
    e.preventDefault()
    setIsQueryLoading(true)
    setQueryError(null)
    setDeptSummary(null)

    try {
      const res = await axios.get(`${API_URL}/department/summary`, {
        params: { department: selectedDept }
      })
      setDeptSummary(res.data)
    } catch (err) {
      console.error(err)
      setQueryError('Could not load department insights.')
    } finally {
      setIsQueryLoading(false)
    }
  }

  if (loading) {
    return (
      <div className="app">
        <div className="loading">Loading people analytics dashboard...</div>
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

  const roundedHeadcount = Math.round(kpis.headcount || 0)
  const roundedAttritionRate = Math.round(kpis.attrition_rate || 0)
  const roundedAvgSalary = Math.round(kpis.avg_salary || 0)
  const roundedAvgTenure = Math.round(kpis.avg_tenure_months || 0)

  // Wrap long department labels onto two lines
  const wrapDeptLabel = (value) => {
    if (!value) return ''
    return value
      .replace('Customer Support', 'Customer\nSupport')
      .replace('Data & Analytics', 'Data &\nAnalytics')
  }

  return (
    <div className="app">
      <header className="header">
        <h1>People & HR Insights</h1>
        <p>Quick view of headcount, attrition and how each department is doing.</p>
      </header>

      <div className="container">
        {/* KPI cards */}
        <div className="kpi-grid">
          <div className="kpi-card">
            <div className="kpi-label">Total headcount</div>
            <div className="kpi-value">
              {roundedHeadcount.toLocaleString()}
            </div>
          </div>

          <div className="kpi-card">
            <div className="kpi-label">Attrition rate</div>
            <div className="kpi-value">
              {roundedAttritionRate}
              <span className="kpi-unit">%</span>
            </div>
          </div>

          <div className="kpi-card">
            <div className="kpi-label">Average salary</div>
            <div className="kpi-value">
              {(roundedAvgSalary / 1000).toFixed(0)}
              <span className="kpi-unit">k</span>
            </div>
          </div>

          <div className="kpi-card">
            <div className="kpi-label">Average tenure</div>
            <div className="kpi-value">
              {roundedAvgTenure}
              <span className="kpi-unit"> months</span>
            </div>
          </div>
        </div>

        {/* Department insights */}
        <div className="chart-card" style={{ marginBottom: '2rem' }}>
          <h3 className="chart-title">Department insights</h3>
          <p style={{ marginBottom: '1rem', color: '#7f8c8d', fontSize: '0.9rem' }}>
            Choose a department and insight type to get a short summary you could share with HR or business leaders.
          </p>

          <form
            onSubmit={handleUpdateInsights}
            style={{ display: 'flex', flexWrap: 'wrap', gap: '1rem', alignItems: 'flex-end' }}
          >
            <div>
              <label style={{ display: 'block', marginBottom: 4 }}>Department</label>
              <select
                value={selectedDept}
                onChange={(e) => setSelectedDept(e.target.value)}
                style={{ padding: '0.5rem', minWidth: 200 }}
              >
                <option>Engineering</option>
                <option>Sales</option>
                <option>Marketing</option>
                <option>Finance</option>
                <option>Operations</option>
                <option>HR</option>
                <option>Customer Support</option>
                <option>Product</option>
                <option>Data &amp; Analytics</option>
                <option>Legal</option>
              </select>
            </div>

            <div>
              <label style={{ display: 'block', marginBottom: 4 }}>Insight type</label>
              <select
                value={insightType}
                onChange={(e) => setInsightType(e.target.value)}
                style={{ padding: '0.5rem', minWidth: 220 }}
              >
                <option value="performance">Performance &amp; engagement</option>
                <option value="attrition">Attrition &amp; risk</option>
                <option value="comp">Compensation overview</option>
              </select>
            </div>

            <button
              type="submit"
              style={{
                padding: '0.6rem 1.4rem',
                borderRadius: 8,
                border: 'none',
                background: '#2563eb',
                color: 'white',
                cursor: 'pointer',
                fontWeight: 600
              }}
            >
              {isQueryLoading ? 'Loading…' : 'Update insights'}
            </button>
          </form>

          {queryError && (
            <div className="error" style={{ marginTop: '1rem' }}>
              {queryError}
            </div>
          )}

          {deptSummary && (
            <div style={{ marginTop: '1.5rem', fontSize: '0.95rem', lineHeight: 1.6 }}>
              <p>
                <strong>{deptSummary.department}</strong> currently has{' '}
                <strong>{deptSummary.headcount}</strong> employees and an attrition rate of{' '}
                <strong>{Math.round(deptSummary.attrition_rate)}%</strong>.
              </p>

              {insightType === 'performance' && (
                <p>
                  Average performance rating is{' '}
                  <strong>{deptSummary.avg_performance?.toFixed(1)}</strong> and average
                  job satisfaction is{' '}
                  <strong>{deptSummary.avg_satisfaction?.toFixed(1)}</strong>, giving a quick view
                  of how healthy this team feels.
                </p>
              )}

              {insightType === 'attrition' && (
                <p>
                  A total of <strong>{deptSummary.attritions}</strong> employees have left this
                  department. You can compare this against the company average to prioritise
                  retention efforts.
                </p>
              )}

              {insightType === 'comp' && (
                <p>
                  Typical salary in this department is around{' '}
                  <strong>${Math.round(deptSummary.avg_salary || 0).toLocaleString()}</strong>.
                  This helps you benchmark pay levels against other functions.
                </p>
              )}
            </div>
          )}
        </div>

        {/* Charts stacked vertically */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
          {/* Attrition chart */}
          <div className="chart-card">
            <h3 className="chart-title">Attrition rate by department</h3>
            <ResponsiveContainer width="100%" height={380}>
              <BarChart
                data={attritionByDept}
                margin={{ top: 10, right: 20, left: 0, bottom: 70 }}
              >
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis
                  dataKey="department"
                  tickFormatter={wrapDeptLabel}
                  angle={0}
                  textAnchor="middle"
                  interval={0}
                  tick={{ fontSize: 11 }}
                  label={{ value: 'Departments', position: 'insideBottom', offset: -50 }}
                />
                <YAxis
                  label={{
                    value: 'Attrition rate (%)',
                    angle: -90,
                    position: 'insideLeft',
                    offset: 10
                  }}
                />
                <Tooltip />
                <Legend />
                <Bar dataKey="attrition_rate" name="Attrition rate (%)" fill="#6366f1" />
              </BarChart>
            </ResponsiveContainer>
          </div>

          {/* Salary chart */}
          <div className="chart-card">
            <h3 className="chart-title">Average salary by department</h3>
            <p style={{ marginBottom: '0.75rem', color: '#7f8c8d', fontSize: '0.85rem' }}>
              Compare typical compensation levels across departments to spot outliers.
            </p>
            <ResponsiveContainer width="100%" height={380}>
              <BarChart
                data={salaryByDept}
                margin={{ top: 10, right: 20, left: 0, bottom: 70 }}
              >
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis
                  dataKey="department"
                  tickFormatter={wrapDeptLabel}
                  angle={0}
                  textAnchor="middle"
                  interval={0}
                  tick={{ fontSize: 11 }}
                  label={{ value: 'Departments', position: 'insideBottom', offset: -50 }}
                />
                <YAxis
  tickFormatter={(value) => `${Math.round(value / 1000)}k`}
  label={{
    value: 'Average salary ',
    angle: -90,
    position: 'insideLeft',
    offset: 15
  }}
/>
                <Tooltip
                  formatter={(value) => `$${Math.round(value).toLocaleString()}`}
                />
                <Legend />
                <Bar dataKey="avg_salary" name="Average salary" fill="#10b981" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  )
}

export default App
