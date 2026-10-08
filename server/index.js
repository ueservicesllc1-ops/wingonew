import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import path from 'path';
import s3Router from './s3Proxy.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3001;

app.use(cors());
app.use(express.json());

// Proxy router para S3 Backblaze B2
app.use('/api', s3Router);

// Endpoint de salud
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', service: 'WingoNew S3 Proxy Server', storage: 'Backblaze B2' });
});

app.listen(PORT, () => {
  console.log(`🚀 S3 Proxy Server para Backblaze B2 ejecutándose en http://localhost:${PORT}`);
});
