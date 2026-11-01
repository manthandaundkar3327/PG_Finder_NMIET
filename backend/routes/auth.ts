import { Router, Request, Response } from 'express';
import { dataStore } from '../data/dataStore.ts';
import { StoredAccount } from '../types.ts';

const router = Router();

// POST /api/auth/login - Student / Admin Login
router.post('/login', (req: Request, res: Response) => {
  const { email, password } = req.body;

  if (!email) {
    return res.status(400).json({ success: false, message: 'Email is required' });
  }

  const trimmedEmail = email.trim().toLowerCase();
  const user = dataStore.getUserByEmail(trimmedEmail);

  if (!user) {
    // Auto-create guest student account and persist to backend file
    const formattedToday = new Date().toLocaleDateString('en-IN', {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
    });

    const newStudent: StoredAccount = {
      id: `user-${Date.now()}`,
      name: email.split('@')[0],
      email: trimmedEmail,
      phone: '+91 98000 00000',
      role: trimmedEmail === 'manthandaundkar33@gmail.com' ? 'admin' : 'student',
      collegeBranch: 'NMIET Engineering',
      year: 'Student',
      password: password || 'manthan',
      createdAt: formattedToday,
    };

    dataStore.addUser(newStudent);

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

// POST /api/auth/register - Student Registration and persist to backend file
router.post('/register', (req: Request, res: Response) => {
  const { name, email, phone, collegeBranch, year, password, role } = req.body;

  if (!name || !email || !phone) {
    return res.status(400).json({
      success: false,
      message: 'Full name, email, and phone number are required',
    });
  }

  const trimmedEmail = email.trim().toLowerCase();
  const existing = dataStore.getUserByEmail(trimmedEmail);

  if (existing) {
    return res.status(409).json({
      success: false,
      message: 'An account with this email already exists. Please sign in.',
    });
  }

  const formattedToday = new Date().toLocaleDateString('en-IN', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
  });

  const newAccount: StoredAccount = {
    id: `student-${Date.now()}`,
    name: name.trim(),
    email: trimmedEmail,
    phone: phone.trim(),
    role: role || (trimmedEmail === 'manthandaundkar33@gmail.com' ? 'admin' : 'student'),
    collegeBranch: collegeBranch || 'Computer Engineering',
    year: year || 'Third Year (TE)',
    password: password || 'manthan',
    createdAt: formattedToday,
  };

  dataStore.addUser(newAccount);

  const { password: _, ...safeUser } = newAccount;
  res.status(201).json({
    success: true,
    message: 'Registered successfully as NMIET Student!',
    user: safeUser,
  });
});

// GET /api/auth/users - List accounts (returns accounts for admin panel)
router.get('/users', (_req: Request, res: Response) => {
  const users = dataStore.getUsers();
  res.json({ success: true, users });
});

// POST /api/auth/users - Admin Create New User and persist to file
router.post('/users', (req: Request, res: Response) => {
  const { name, email, phone, role, collegeBranch, year, password } = req.body;

  if (!email || !name) {
    return res.status(400).json({ success: false, message: 'Name and email are required' });
  }

  const trimmedEmail = email.trim().toLowerCase();
  const existing = dataStore.getUserByEmail(trimmedEmail);

  if (existing) {
    return res.status(409).json({ success: false, message: 'An account with this email already exists' });
  }

  const formattedToday = new Date().toLocaleDateString('en-IN', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
  });

  const createdUser: StoredAccount = {
    id: req.body.id || `user-${Date.now()}`,
    name: name.trim(),
    email: trimmedEmail,
    phone: (phone || '+91 98000 00000').trim(),
    role: role || 'student',
    collegeBranch: collegeBranch || 'Computer Engineering',
    year: year || 'Third Year (TE)',
    password: password || 'password123',
    createdAt: req.body.createdAt || formattedToday,
  };

  dataStore.addUser(createdUser);

  res.status(201).json({
    success: true,
    message: `User ${createdUser.name} created successfully and saved to backend data file!`,
    user: createdUser,
  });
});

// PUT /api/auth/users/:id - Admin Update User and persist to file
router.put('/users/:id', (req: Request, res: Response) => {
  const { id } = req.params;
  const updated = dataStore.updateUser(id, req.body);

  if (!updated) {
    return res.status(404).json({ success: false, message: 'User not found' });
  }

  res.json({
    success: true,
    message: `User ${updated.name} updated and persisted to backend data file`,
    user: updated,
  });
});

// DELETE /api/auth/users/:id - Admin Delete User and update file
router.delete('/users/:id', (req: Request, res: Response) => {
  const { id } = req.params;
  const deleted = dataStore.deleteUser(id);

  if (!deleted) {
    return res.status(400).json({
      success: false,
      message: 'Cannot delete primary admin account or user not found',
    });
  }

  res.json({
    success: true,
    message: 'User account deleted and removed from backend data file',
  });
});

// PATCH /api/auth/users/:id/password - Admin Reset Password and persist to file
router.patch('/users/:id/password', (req: Request, res: Response) => {
  const { id } = req.params;
  const { newPassword } = req.body;

  if (!newPassword || newPassword.trim().length < 4) {
    return res.status(400).json({ success: false, message: 'Password must be at least 4 characters' });
  }

  const success = dataStore.resetPassword(id, newPassword);

  if (!success) {
    return res.status(404).json({ success: false, message: 'User not found' });
  }

  res.json({
    success: true,
    message: 'Password reset and saved to backend data file successfully',
  });
});

export default router;
