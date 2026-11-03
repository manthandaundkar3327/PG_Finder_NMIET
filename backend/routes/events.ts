import { Router, Request, Response } from 'express';
import { dataStore, DataChangeEvent } from '../data/dataStore.ts';

const router = Router();

// Track all active SSE client connections across all browser sessions
const activeClients = new Set<Response>();

// Subscribe to dataStore real-time changes
dataStore.subscribe((event: DataChangeEvent) => {
  if (activeClients.size === 0) return;

  const payload = `event: update\ndata: ${JSON.stringify(event)}\n\n`;
  console.log(`[SSE Broadcast] Broadcasting "${event.action}" to ${activeClients.size} connected client(s)`);

  for (const client of activeClients) {
    try {
      client.write(payload);
    } catch (err) {
      console.warn('[SSE Broadcast] Failed to write to a client, dropping connection', err);
      activeClients.delete(client);
    }
  }
});

// GET /api/events - Realtime SSE Endpoint
router.get('/', (req: Request, res: Response) => {
  // Set SSE Headers
  res.writeHead(200, {
    'Content-Type': 'text/event-stream',
    'Cache-Control': 'no-cache, no-transform',
    'Connection': 'keep-alive',
    'X-Accel-Buffering': 'no',
    'Access-Control-Allow-Origin': '*',
  });

  // Instruct browser to reconnect after 2 seconds if connection drops
  res.write('retry: 2000\n\n');

  // Send initial live data payload on connection
  const initialPayload = `event: init\ndata: ${JSON.stringify({
    status: 'connected',
    listings: dataStore.getListings(),
    users: dataStore.getUsers(),
    timestamp: Date.now(),
  })}\n\n`;
  res.write(initialPayload);

  activeClients.add(res);
  console.log(`[SSE] Client connected. Total active clients: ${activeClients.size}`);

  // Heartbeat ping every 20 seconds to prevent intermediate proxy/browser timeouts
  const heartbeatTimer = setInterval(() => {
    try {
      res.write(': heartbeat\n\n');
    } catch {
      clearInterval(heartbeatTimer);
      activeClients.delete(res);
    }
  }, 20000);

  // Clean up when client disconnects (tab closed, navigated away, etc.)
  req.on('close', () => {
    clearInterval(heartbeatTimer);
    activeClients.delete(res);
    console.log(`[SSE] Client disconnected. Total active clients: ${activeClients.size}`);
  });
});

export default router;

