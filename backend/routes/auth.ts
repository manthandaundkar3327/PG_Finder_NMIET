import { Router, Request, Response } from 'express';
import { INITIAL_USERS } from '../data/initialData.ts';
import { StoredAccount } from '../types.ts';

const router = Router();

let accounts: StoredAccount[] = [...INITIAL_USERS];

// POST /api/auth/login - Student Login
router.post('/login', (req: Request, res: Response) => {
  const { email, password } = req.body;

  if (!email) {
    return res.status(400).json({ success: false, message: 'Email is required' });
  }

  const trimmedEmail = email.trim().toLowerCase();
  const user = accounts.find((acc) => acc.email.toLowerCase() === trimmedEmail);

  if (!user) {
    // Auto-create guest student account
    const newStudent: StoredAccount = {
      id: `user-${Date.now()}`,
      name: email.split('@')[0],
      email: trimmedEmail,
      phone: '+91 98000 00000',
      role: 'student',
      collegeBranch: 'NMIET Engineering',
      year: 'Student',
      password: password || 'manthan',
    };
    accounts.push(newStudent);

    const { password: _, ...safeUser } = newStudent;
    return res.json({
      success: true,
      message: `Welcome to PG Finder NMIET, ${safeUser.name}!`,
      user: safeUser,
    });
  }

  // Password verification
  if (user.password && password && user.password !== password) {
    return res.status(401).json({
      success: false,
      message: 'Incorrect password.',
    });
  }

  const { password: _, ...safeUser } = user;
  res.json({
    success: true,
    message: `Logged in successfully as ${safeUser.name}!`,
    user: safeUser,
  });
});

// POST /api/auth/register - Student Registration
router.post('/register', (req: Request, res: Response) => {
  const { name, email, phone, collegeBranch, year, password } = req.body;

  if (!name || !email || !phone) {
    return res.status(400).json({
      success: false,
      message: 'Full name, email, and phone number are required',
    });
  }

  const trimmedEmail = email.trim().toLowerCase();
  const existing = accounts.find((acc) => acc.email.toLowerCase() === trimmedEmail);

  if (existing) {
    return res.status(409).json({
      success: false,
      message: 'An account with this email already exists. Please sign in.',
    });
  }

  const newAccount: StoredAccount = {
    id: `student-${Date.now()}`,
    name: name.trim(),
    email: trimmedEmail,
    phone: phone.trim(),
    role: 'student',
    collegeBranch: collegeBranch || 'Computer Engineering',
    year: year || 'Third Year (TE)',
    password: password || 'manthan',
  };

  accounts.push(newAccount);

  const { password: _, ...safeUser } = newAccount;
  res.status(201).json({
    success: true,
    message: 'Registered successfully as NMIET Student!',
    user: safeUser,
  });
});

// GET /api/auth/users - List registered accounts
router.get('/users', (_req: Request, res: Response) => {
  const safeUsers = accounts.map(({ password: _, ...user }) => user);
  res.json({ success: true, users: safeUsers });
});

export default router;
