import express from 'express';
import http from 'http';
import path from 'path';
import { fileURLToPath } from 'url';
import { WebSocketServer, WebSocket } from 'ws';
import { remoteBrowser } from './server/remoteBrowser.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT ? parseInt(process.env.PORT, 10) : 3000;
const isProduction = process.env.NODE_ENV === 'production';

app.use(express.json());

// API Routes
app.get('/api/browser/status', (req, res) => {
  res.json(remoteBrowser.getStatus());
});

app.post('/api/browser/navigate', async (req, res) => {
  const { url } = req.body;
  if (!url || typeof url !== 'string') {
    res.status(400).json({ error: 'Valid URL is required' });
    return;
  }
  const ok = await remoteBrowser.navigate(url);
  res.json({ success: ok, status: remoteBrowser.getStatus() });
});

app.post('/api/browser/control', async (req, res) => {
  const { action, value } = req.body;
  switch (action) {
    case 'back':
      await remoteBrowser.goBack();
      break;
    case 'forward':
      await remoteBrowser.goForward();
      break;
    case 'reload':
      await remoteBrowser.reload();
      break;
    case 'quality':
      if (typeof value === 'number') {
        await remoteBrowser.setQuality(value);
      }
      break;
    case 'viewport':
      if (typeof value === 'object') {
        await remoteBrowser.setViewport(value);
      }
      break;
    case 'reset':
      await remoteBrowser.resetSession();
      break;
    default:
      res.status(400).json({ error: 'Unknown action' });
      return;
  }
  res.json({ success: true, status: remoteBrowser.getStatus() });
});

app.post('/api/browser/mouse', async (req, res) => {
  await remoteBrowser.dispatchMouseEvent(req.body);
  res.json({ success: true });
});

app.post('/api/browser/touch', async (req, res) => {
  await remoteBrowser.dispatchTouchEvent(req.body);
  res.json({ success: true });
});

app.post('/api/browser/key', async (req, res) => {
  await remoteBrowser.dispatchKeyEvent(req.body);
  res.json({ success: true });
});

app.post('/api/browser/text', async (req, res) => {
  const { text } = req.body;
  if (typeof text === 'string') {
    await remoteBrowser.insertText(text);
  }
  res.json({ success: true });
});

app.get('/api/browser/frame', (req, res) => {
  const frame = remoteBrowser.getLatestFrame();
  if (!frame) {
    res.status(204).end();
    return;
  }
  const imgBuffer = Buffer.from(frame, 'base64');
  res.set('Content-Type', 'image/jpeg');
  res.set('Cache-Control', 'no-store, no-cache, must-revalidate');
  res.send(imgBuffer);
});

app.get('/api/browser/screenshot', async (req, res) => {
  const buffer = await remoteBrowser.captureScreenshot();
  if (!buffer) {
    res.status(500).json({ error: 'Failed to capture screenshot' });
    return;
  }
  res.set('Content-Type', 'image/png');
  res.set('Content-Disposition', 'attachment; filename="cloudcast-screenshot.png"');
  res.send(buffer);
});

app.get('/api/browser/logs', (req, res) => {
  res.json(remoteBrowser.getConsoleLogs());
});

// Create HTTP server
const server = http.createServer(app);

// WebSocket Server
const wss = new WebSocketServer({ noServer: true });
const fallbackWss = new WebSocketServer({
  noServer: true,
  handleProtocols: (protocols) => {
    // Acknowledge requested protocol (like 'vite-hmr') so handshake completes without errors
    const first = protocols.values().next().value;
    return first || false;
  },
});

server.on('upgrade', (request, socket, head) => {
  const { pathname } = new URL(request.url || '', `http://${request.headers.host}`);
  if (pathname === '/ws/browser') {
    wss.handleUpgrade(request, socket, head, (ws) => {
      wss.emit('connection', ws, request);
    });
  } else {
    // Gracefully accept Vite HMR / any fallback WebSocket so it never throws in browser console
    fallbackWss.handleUpgrade(request, socket, head, (ws) => {
      ws.on('error', () => {});
    });
  }
});

wss.on('connection', (ws: WebSocket) => {
  remoteBrowser.addClient(ws);

  ws.on('message', async (data: Buffer | string) => {
    try {
      const msg = JSON.parse(data.toString());
      switch (msg.type) {
        case 'ping':
          ws.send(JSON.stringify({ type: 'pong', clientTime: msg.time, serverTime: Date.now() }));
          break;
        case 'navigate':
          if (msg.url) {
            await remoteBrowser.navigate(msg.url);
          }
          break;
        case 'mouse':
          await remoteBrowser.dispatchMouseEvent(msg.mouseEvent || msg);
          break;
        case 'touch':
          await remoteBrowser.dispatchTouchEvent(msg.touchEvent || msg);
          break;
        case 'key':
          await remoteBrowser.dispatchKeyEvent(msg.keyEvent || msg);
          break;
        case 'text':
          if (typeof msg.text === 'string') {
            await remoteBrowser.insertText(msg.text);
          }
          break;
        case 'back':
          await remoteBrowser.goBack();
          break;
        case 'forward':
          await remoteBrowser.goForward();
          break;
        case 'reload':
          await remoteBrowser.reload();
          break;
        case 'viewport':
          if (msg.viewport) {
            await remoteBrowser.setViewport(msg.viewport);
          }
          break;
        case 'quality':
          if (typeof msg.quality === 'number') {
            await remoteBrowser.setQuality(msg.quality);
          }
          break;
        case 'reset':
          await remoteBrowser.resetSession();
          break;
      }
    } catch (err) {
      console.warn('[WS] Parse message error:', err);
    }
  });

  ws.on('close', () => {
    remoteBrowser.removeClient(ws);
  });

  ws.on('error', (err) => {
    console.warn('[WS] Client error:', err);
    remoteBrowser.removeClient(ws);
  });
});

// Setup Vite middleware in dev or static files in production
async function startServer() {
  if (!isProduction) {
    const { createServer: createViteServer } = await import('vite');
    const vite = await createViteServer({
      server: {
        middlewareMode: true,
        hmr: false,
      },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.resolve(__dirname, 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.resolve(distPath, 'index.html'));
    });
  }

  server.listen(PORT, '0.0.0.0', () => {
    console.log(`[CloudCast Browser] Server running on http://0.0.0.0:${PORT}`);
  });

  // Start Chromium in background
  remoteBrowser.initialize().catch((err) => {
    console.error('[CloudCast Browser] Failed to initialize Chromium:', err);
  });
}

startServer().catch((err) => {
  console.error('[Server] Startup error:', err);
});
