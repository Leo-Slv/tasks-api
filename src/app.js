const express = require('express');
const { pool } = require('./db');
const { validateTitle, parseId } = require('./validation');

const app = express();
app.use(express.json());

app.get('/health', (_req, res) => res.json({ status: 'ok' }));

app.get('/tasks', async (_req, res, next) => {
  try {
    const { rows } = await pool.query('SELECT * FROM tasks ORDER BY id');
    res.json(rows);
  } catch (err) {
    next(err);
  }
});

app.get('/tasks/:id', async (req, res, next) => {
  try {
    const id = parseId(req.params.id);
    if (!id) return res.status(400).json({ error: 'id inválido' });
    const { rows } = await pool.query('SELECT * FROM tasks WHERE id = $1', [
      id,
    ]);
    if (rows.length === 0) {
      return res.status(404).json({ error: 'tarefa não encontrada' });
    }
    return res.json(rows[0]);
  } catch (err) {
    return next(err);
  }
});

app.post('/tasks', async (req, res, next) => {
  try {
    const result = validateTitle(req.body && req.body.title);
    if (!result.valid) return res.status(400).json({ error: result.error });
    const { rows } = await pool.query(
      'INSERT INTO tasks (title) VALUES ($1) RETURNING *',
      [result.value],
    );
    return res.status(201).json(rows[0]);
  } catch (err) {
    return next(err);
  }
});

app.put('/tasks/:id', async (req, res, next) => {
  try {
    const id = parseId(req.params.id);
    if (!id) return res.status(400).json({ error: 'id inválido' });
    const result = validateTitle(req.body && req.body.title);
    if (!result.valid) return res.status(400).json({ error: result.error });
    const done = req.body.done === true;
    const { rows } = await pool.query(
      'UPDATE tasks SET title = $1, done = $2 WHERE id = $3 RETURNING *',
      [result.value, done, id],
    );
    if (rows.length === 0) {
      return res.status(404).json({ error: 'tarefa não encontrada' });
    }
    return res.json(rows[0]);
  } catch (err) {
    return next(err);
  }
});

app.delete('/tasks/:id', async (req, res, next) => {
  try {
    const id = parseId(req.params.id);
    if (!id) return res.status(400).json({ error: 'id inválido' });
    const { rowCount } = await pool.query('DELETE FROM tasks WHERE id = $1', [
      id,
    ]);
    if (rowCount === 0) {
      return res.status(404).json({ error: 'tarefa não encontrada' });
    }
    return res.status(204).end();
  } catch (err) {
    return next(err);
  }
});

// eslint-disable-next-line no-unused-vars
app.use((err, _req, res, _next) => {
  console.error(err);
  res.status(500).json({ error: 'erro interno' });
});

module.exports = app;
