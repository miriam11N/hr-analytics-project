const express = require('express');
const cors = require('cors');
const { query, queryOne } = require('./database');

const app = express();
const PORT = 5000;

// Middleware
app.use(cors()); // allow all origins in dev [web:81][web:85]
app.use(express.json());

// Health check
app.get('/', (req, res) => {
  res.json({
    message: 'HR Analytics API running',
    endpoints: {
      kpis: '/api/kpis/overview',
      attritionByDepartment: '/api/attrition/by-department'
    }
  });
});

// ----------------------------
// KPI Endpoint
// ----------------------------
app.get('/api/kpis/overview', async (req, res) => {
  try {
    const headcount = await queryOne('SELECT COUNT(*) AS c FROM employees');
    const attrition = await queryOne('SELECT AVG(attrition_flag) AS rate FROM employees');
    const salary = await queryOne('SELECT AVG(salary) AS avg_salary FROM employees');
    const tenure = await queryOne('SELECT AVG(tenure_months) AS avg_tenure FROM employees');

    res.json({
      headcount: headcount.c,
      attrition_rate: Number((attrition.rate * 100).toFixed(2)),
      avg_salary: Number(salary.avg_salary.toFixed(2)),
      avg_tenure_months: Number(tenure.avg_tenure.toFixed(1))
    });
  } catch (err) {
    console.error('Error in /api/kpis/overview:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// ----------------------------
// Attrition by department
// ----------------------------
app.get('/api/attrition/by-department', async (req, res) => {
  const sql = `
    SELECT 
      department,
      COUNT(*) AS headcount,
      SUM(attrition_flag) AS attritions,
      ROUND(100.0 * SUM(attrition_flag) / COUNT(*), 2) AS attrition_rate
    FROM employees
    GROUP BY department
    ORDER BY attrition_rate DESC;
  `;

  try {
    const rows = await query(sql);
    res.json(rows);
  } catch (err) {
    console.error('Error in /api/attrition/by-department:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Start server
app.listen(PORT, () => {
  console.log(`🚀 HR Analytics API listening on http://localhost:${PORT}`);
});
