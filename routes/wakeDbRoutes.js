import express from 'express';
import { prisma } from '../utils/prisma.js';

const router = express.Router();

router.get('/wakeDb', async (req, res) => {
  try {
    await prisma.$queryRaw`SELECT 1`;
    res.status(200).send('Database is awake!');
  } catch (err) {
    res.status(500).send('Error waking database: ' + err.message);
  }
});

export default router;
