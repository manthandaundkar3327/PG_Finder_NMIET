import { Router, Request, Response } from 'express';
import { dataStore } from '../data/dataStore.ts';

const router = Router();

// POST /api/admin/reset - Reset platform data to initial defaults and persist to file
router.post('/reset', (_req: Request, res: Response) => {
  const result = dataStore.resetToDefaults();
  res.json({
    success: true,
    message: 'All platform data reset to initial seed state and written to backend file',
    listings: result.listings,
    users: result.users,
  });
});

// POST /api/admin/import - Import backup JSON and persist directly to file
router.post('/import', (req: Request, res: Response) => {
  const { listings, accounts, users } = req.body;
  const importedUsers = accounts || users;

  if (!Array.isArray(listings) && !Array.isArray(importedUsers)) {
    return res.status(400).json({
      success: false,
      message: 'Invalid import payload: expected listings or accounts array',
    });
  }

  dataStore.importData(listings, importedUsers);

  res.json({
    success: true,
    message: 'Data imported successfully and written to backend data files!',
    listings: dataStore.getListings(),
    users: dataStore.getUsers(),
  });
});

// GET /api/admin/export - Export full JSON dataset
router.get('/export', (_req: Request, res: Response) => {
  res.json({
    platform: 'PG Finder NMIET',
    version: '1.0',
    exportedAt: new Date().toISOString(),
    listings: dataStore.getListings(),
    accounts: dataStore.getUsers(),
  });
});

export default router;

