/* eslint-disable @typescript-eslint/no-unused-vars -- Remove me */
import 'dotenv/config';
import pg from 'pg';
import express from 'express';
import { ClientError, errorMiddleware } from './lib/index.js';

const db = new pg.Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: {
    rejectUnauthorized: false,
  },
});

const app = express();

app.use(express.json());

app.get('/api/entries', async (req, res, next) => {
  try {
    const sql = `
      select *
        from "entries";
    `;
    const result = await db.query(sql);
    const entries = result.rows;
    res.status(200).json(entries);
  } catch (err) {
    next(err);
  }
});

app.get('/api/entries/:entryId', async (req, res, next) => {
  try {
    const { entryId } = req.params;
    const sql = `
      select *
        from "entries"
        where "entryId" = $1;
    `;
    const params = [entryId];
    const result = await db.query(sql, params);
    const entries = result.rows[0];
    if (!entries) {
      throw new ClientError(404, `Entry not found!`);
    }
    res.status(200).json(entries);
  } catch (err) {
    next(err);
  }
});

app.post('/api/entries', async (req, res, next) => {
  try {
    const { title, notes, photoUrl } = req.body;
    if (!title || !notes || !photoUrl) {
      throw new ClientError(400, 'You need title, notes, and photoURL.');
    }
    const sql = `
      insert into "entries" ("title", "notes", "photoUrl")
      values ($1, $2, $3)
      returning *;
    `;
    const params = [title, notes, photoUrl];
    const result = await db.query(sql, params);
    const entry = result.rows[0];
    res.status(201).json(entry);
  } catch (err) {
    next(err);
  }
});

app.put('/api/entries/:entryId', async (req, res, next) => {
  try {
    const { entryId } = req.params;
    const { title, notes, photoUrl } = req.body;
    if (!title || !notes || !photoUrl) {
      throw new ClientError(400, 'error all fields are required!');
    }
    const sql = `
    update "entries"
    set "title" = $1,
    "notes" = $2,
    "photoUrl" = $3
    where "entryId" = $4
    returning *;
    `;
    const params = [title, notes, photoUrl, entryId];
    const results = await db.query(sql, params);
    const updatedEntry = results.rows[0];
    if (!updatedEntry) {
      throw new ClientError(404, `error could not find ${entryId}`);
    }
    res.status(200).json(updatedEntry);
  } catch (error) {
    next(error);
  }
});

app.delete('/api/entries/:entryId', async (req, res, next) => {
  try {
    const { entryId } = req.params;
    const sql = `
    delete from "entries"
      where "entryId" = $1
      returning *;
    `;
    const params = [entryId];
    const results = await db.query(sql, params);
    const deleteEntry = results.rows[0];
    if (!deleteEntry) {
      throw new ClientError(404, `error could not find ${entryId}`);
    }
    res.sendStatus(204);
  } catch (error) {
    next(error);
  }
});

app.use(errorMiddleware);

app.listen(process.env.PORT, () => {
  console.log(`express server listening on port ${process.env.PORT}`);
});
