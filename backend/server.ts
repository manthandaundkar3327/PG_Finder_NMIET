import express from 'express';
import { createServer as createViteServer } from 'vite';
import path from 'path';
import { fileURLToPath } from 'url';
import backendApp from './app.ts';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function startServer() {
  const app = express();
  const PORT = process.env.PORT ? parseInt(process.env.PORT, 10) : 3000;
  const isProduction = process.env.NODE_ENV === 'production';

  // Mount backend API routes from the /backend folder
  app.use(backendApp);

  if (!isProduction) {
    // Development mode: Vite dev server with middleware mode
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
      configFile: path.resolve(__dirname, '../vite.config.ts'),
    });
    app.use(vite.middlewares);
  } else {
    // Production mode: Serve built assets from dist directory
    const distPath = path.resolve(__dirname, '../dist');
    app.use(express.static(distPath));
    app.get('*', (_req, res) => {
      res.sendFile(path.resolve(distPath, 'index.html'));
    });
  }

  const server = app.listen(PORT, '0.0.0.0', () => {
    console.log(`[PG Finder NMIET] Server running at http://localhost:${PORT}`);
    console.log(`[PG Finder NMIET] Local access: http://127.0.0.1:${PORT}`);
  });

  server.on('error', (err: NodeJS.ErrnoException) => {
    if (err.code === 'EADDRINUSE') {
      console.error(`\n[PG Finder NMIET] Port ${PORT} is already in use by another running process.`);
      console.error(`To free port ${PORT}, run in PowerShell:`);
      console.error(`  Stop-Process -Id (Get-NetTCPConnection -LocalPort ${PORT}).OwningProcess -Force`);
      console.error(`Or start on another port:`);
      console.error(`  $env:PORT="${PORT + 1}"; npm start\n`);
      process.exit(1);
    } else {
      console.error('Server error:', err);
      process.exit(1);
    }
  });
}

startServer().catch((err) => {
  console.error('Failed to start server:', err);
  process.exit(1);
});
