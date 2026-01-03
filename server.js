// =========================
// server.js - Dayflow HRMS
// =========================

const express = require('express');
const cors = require('cors');
require('dotenv').config();
const db = require('./db'); // db.js is in the same folder

const app = express();
app.use(cors());
app.use(express.json());

const PORT = process.env.PORT || 5000;

// -------------------------
// Root route
// -------------------------
app.get('/', (req, res) => {
  res.send('Dayflow Backend Running');
});

// -------------------------
// Test DB connection
// -------------------------
app.get('/test-db', (req, res) => {
  db.query('SELECT NOW() AS currentTime', (err, results) => {
    if (err) {
      console.error(err);
      return res.status(500).json({ error: 'Database connection failed' });
    }
    res.json({ message: 'Database connected!', time: results[0].currentTime
        
     });
  });
});

// =========================
// Employees Routes
// =========================
app.get('/employees', (req, res) => {
  db.query('SELECT * FROM employees', (err, results) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(results);
  });
});

app.post('/employees', (req, res) => {
  const { name, email, password, position, department, date_of_joining } = req.body;
  db.query(
    'INSERT INTO employees (name, email, password, position, department, date_of_joining) VALUES (?, ?, ?, ?, ?, ?)',
    [name, email, password, position, department, date_of_joining],
    (err, result) => {
      if (err) return res.status(500).json({ error: err.message });
      res.json({ message: 'Employee added', id: result.insertId });
    }
  );
});

app.put('/employees/:id', (req, res) => {
  const { id } = req.params;
  const { name, email, position, department } = req.body;
  db.query(
    'UPDATE employees SET name=?, email=?, position=?, department=? WHERE id=?',
    [name, email, position, department, id],
    (err, result) => {
      if (err) return res.status(500).json({ error: err.message });
      res.json({ message: 'Employee updated' });
    }
  );
});

app.delete('/employees/:id', (req, res) => {
  const { id } = req.params;
  db.query('DELETE FROM employees WHERE id=?', [id], (err, result) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json({ message: 'Employee deleted' });
  });
});

// =========================
// Leaves Routes
// =========================
app.get('/leaves', (req, res) => {
  db.query(
    'SELECT l.id, e.name AS employee_name, l.leave_type, l.start_date, l.end_date, l.status FROM leaves l JOIN employees e ON l.employee_id = e.id',
    (err, results) => {
      if (err) return res.status(500).json({ error: err.message });
      res.json(results);
    }
  );
});

app.post('/leaves', (req, res) => {
  const { employee_id, leave_type, start_date, end_date, status } = req.body;
  db.query(
    'INSERT INTO leaves (employee_id, leave_type, start_date, end_date, status) VALUES (?, ?, ?, ?, ?)',
    [employee_id, leave_type, start_date, end_date, status || 'Pending'],
    (err, result) => {
      if (err) return res.status(500).json({ error: err.message });
      res.json({ message: 'Leave added', id: result.insertId });
    }
  );
});

// =========================
// Attendance Routes
// =========================
app.get('/attendance', (req, res) => {
  db.query(
    'SELECT a.id, e.name AS employee_name, a.date, a.check_in, a.check_out, a.status FROM attendance a JOIN employees e ON a.employee_id = e.id',
    (err, results) => {
      if (err) return res.status(500).json({ error: err.message });
      res.json(results);
    }
  );
});

app.post('/attendance', (req, res) => {
  const { employee_id, date, check_in, check_out, status } = req.body;
  db.query(
    'INSERT INTO attendance (employee_id, date, check_in, check_out, status) VALUES (?, ?, ?, ?, ?)',
    [employee_id, date, check_in, check_out, status || 'Present'],
    (err, result) => {
      if (err) return res.status(500).json({ error: err.message });
      res.json({ message: 'Attendance added', id: result.insertId });
    }
  );
});

// =========================
// Payroll Routes
// =========================
app.get('/payroll', (req, res) => {
  db.query(
    'SELECT p.id, e.name AS employee_name, p.basic_salary, p.deductions, p.net_salary, p.pay_date FROM payroll p JOIN employees e ON p.employee_id = e.id',
    (err, results) => {
      if (err) return res.status(500).json({ error: err.message });
      res.json(results);
    }
  );
});

app.post('/payroll', (req, res) => {
  const { employee_id, basic_salary, deductions, net_salary, pay_date } = req.body;
  db.query(
    'INSERT INTO payroll (employee_id, basic_salary, deductions, net_salary, pay_date) VALUES (?, ?, ?, ?, ?)',
    [employee_id, basic_salary, deductions, net_salary, pay_date],
    (err, result) => {
      if (err) return res.status(500).json({ error: err.message });
      res.json({ message: 'Payroll added', id: result.insertId });
    }
  );
});

// =========================
// Start Server
// =========================
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});