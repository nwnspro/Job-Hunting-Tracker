import express from 'express';
import { auth } from '../services/auth.js';

const router = express.Router();

// Better-auth handles all auth routes automatically
router.use('/', auth.handler);

// Test route to verify auth is working
router.get('/test', (req, res) => res.json({ ok: true }));

export default router;
