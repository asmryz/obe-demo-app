import 'dotenv/config';
import pkg from 'pg';
import process from 'node:process';

const { Pool } = pkg;

export const db = new Pool({
  host: process.env.DB_HOST,
  port: process.env.DB_PORT,
  user: process.env.DB_USER,
  password: process.env.DB_PASS,
  database: process.env.DB_NAME,
  ssl: false
});

