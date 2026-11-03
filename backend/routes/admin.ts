import { Router, Request, Response } from 'express';
import { dataStore } from '../data/dataStore.ts';
import { isSupabaseConfigured, getSupabaseCredentials } from '../data/supabaseClient.ts';

const router = Router();

// GET /api/admin/cloud-status - Check Supabase cloud database connection status
router.get('/cloud-status', (_req: Request, res: Response) => {
  const configured = isSupabaseConfigured();
  const { url } = getSupabaseCredentials();

  res.json({
    success: true,
    provider: 'supabase',
    configured,
    projectUrl: configured ? url.replace(/^(https:\/\/[^.]+).*/, '$1.supabase.co') : null,
    listingsCount: dataStore.getListings().length,
    usersCount: dataStore.getUsers().length,
    message: configured
      ? 'Connected to live Supabase Cloud Database'
      : 'Supabase credentials not configured in .env (running in local synchronized mode)',
  });
});

// POST /api/admin/cloud-sync - Push all current listings and users to Supabase Cloud
router.post('/cloud-sync', async (_req: Request, res: Response) => {
  const result = await dataStore.syncAllToSupabase();
  res.json(result);
});

// POST /api/admin/cloud-pull - Pull all data from Supabase Cloud
router.post('/cloud-pull', async (_req: Request, res: Response) => {
  const synced = await dataStore.initSupabaseSync();
  res.json({
    success: synced,
    message: synced
      ? 'Successfully synchronized latest data from Supabase Cloud Database!'
      : 'Failed to synchronize with Supabase Cloud. Check .env credentials.',
    listings: dataStore.getListings(),
    users: dataStore.getUsers(),
  });
});

// POST /api/admin/reset - Reset platform data to initial defaults and persist to file
router.post('/reset', (_req: Request, res: Response) => {
  const result = dataStore.resetToDefaults();
  res.json({
    success: true,
    message: 'All platform data reset to initial seed state and written to backend file and cloud database',
    listings: result.listings,
    users: result.users,
  });
});

// POST /api/admin/import - Import backup JSON and persist directly to file & cloud
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
    message: 'Data imported successfully and written to backend data files & cloud database!',
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
