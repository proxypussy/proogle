import puppeteer, { Browser, Page, CDPSession } from 'puppeteer-core';
import { WebSocket } from 'ws';
import fs from 'fs';
import path from 'path';

function findChromeExecutable(): string {
  const candidates = [
    '/app/applet/chrome/linux-155.0.8059.39/chrome-linux64/chrome',
    path.resolve(process.cwd(), 'chrome/linux-155.0.8059.39/chrome-linux64/chrome'),
    '/usr/bin/google-chrome',
    '/usr/bin/chromium',
    '/usr/bin/chromium-browser',
  ];

  for (const candidate of candidates) {
    if (fs.existsSync(candidate)) {
      return candidate;
    }
  }

  const chromeDir = path.resolve(process.cwd(), 'chrome');
  if (fs.existsSync(chromeDir)) {
    const findRecursive = (dir: string): string | null => {
      const entries = fs.readdirSync(dir, { withFileTypes: true });
      for (const entry of entries) {
        const full = path.join(dir, entry.name);
        if (entry.isFile() && entry.name === 'chrome') return full;
        if (entry.isDirectory()) {
          const res = findRecursive(full);
          if (res) return res;
        }
      }
      return null;
    };
    const found = findRecursive(chromeDir);
    if (found) return found;
  }

  return '/usr/bin/chromium';
}

export interface ViewportConfig {
  width: number;
  height: number;
  deviceScaleFactor?: number;
  isMobile?: boolean;
  hasTouch?: boolean;
}

export interface BrowserStatus {
  url: string;
  title: string;
  isLoading: boolean;
  canGoBack: boolean;
  canGoForward: boolean;
  viewport: ViewportConfig;
  quality: number;
  clientCount: number;
  uptime: number;
  sslSecure: boolean;
}

export interface ConsoleMessage {
  type: string;
  text: string;
  timestamp: number;
}

export class RemoteBrowserManager {
  private browser: Browser | null = null;
  private page: Page | null = null;
  private cdp: CDPSession | null = null;
  private clients: Set<WebSocket> = new Set();
  
  private currentUrl = 'https://ja.wikipedia.org/wiki/%E3%83%A1%E3%82%A4%E3%83%B3%E3%83%9A%E3%83%BC%E3%82%B8';
  private currentTitle = '';
  private isLoading = false;
  private canGoBack = false;
  private canGoForward = false;
  private sslSecure = true;
  private startTime = Date.now();
  private quality = 70; // JPEG quality (10-100)
  
  private viewport: ViewportConfig = {
    width: 1280,
    height: 800,
    deviceScaleFactor: 1,
    isMobile: false,
    hasTouch: false,
  };

  private latestFrame: string | null = null;
  private latestFrameMeta: any = null;
  private consoleLogs: ConsoleMessage[] = [];
  private isInitializing = false;
  private screencastActive = false;
  private navigationTimeout: NodeJS.Timeout | null = null;

  constructor() {}

  public async initialize(): Promise<void> {
    if (this.browser && this.page) return;
    if (this.isInitializing) return;
    this.isInitializing = true;

    try {
      const execPath = findChromeExecutable();
      console.log(`[RemoteBrowser] Launching Chrome in high-speed stealth mode with: ${execPath}`);
      
      let profileDir = '/tmp/chromium-profile';
      try {
        if (!fs.existsSync(profileDir)) {
          fs.mkdirSync(profileDir, { recursive: true });
        }
        // Remove stale singleton locks from previous crashes/restarts
        const staleFiles = ['SingletonLock', 'SingletonCookie', 'SingletonSocket'];
        for (const file of staleFiles) {
          const filePath = path.join(profileDir, file);
          if (fs.existsSync(filePath)) {
            fs.rmSync(filePath, { force: true });
          }
        }
      } catch (_) {}

      const launchArgs = [
        '--no-sandbox',
        '--disable-setuid-sandbox',
        '--disable-dev-shm-usage',
        '--disable-gpu',
        '--disable-software-rasterizer',
        '--disable-blink-features=AutomationControlled',
        '--disable-infobars',
        '--disable-features=IsolateOrigins,site-per-process,AudioServiceOutOfProcess',
        '--window-position=0,0',
        `--window-size=${this.viewport.width},${this.viewport.height}`,
        '--lang=ja-JP,ja',
        '--disk-cache-dir=/tmp/chromium-cache',
        '--disk-cache-size=104857600',
        '--enable-features=NetworkService,NetworkServiceInProcess',
        '--enable-fast-unload',
        '--enable-tcp-fast-open',
        '--enable-quic',
        '--dns-prefetch-disable=false',
        '--prerender-from-omnibox=enabled',
        '--user-agent=Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/133.0.0.0 Safari/537.36',
      ];

      try {
        this.browser = await puppeteer.launch({
          executablePath: execPath,
          headless: true,
          userDataDir: profileDir,
          ignoreDefaultArgs: ['--enable-automation'],
          args: launchArgs,
        });
      } catch (launchErr: any) {
        console.warn('[RemoteBrowser] Launch with default profile failed, retrying with fresh profile:', launchErr.message);
        profileDir = `/tmp/chromium-profile-${Date.now()}`;
        this.browser = await puppeteer.launch({
          executablePath: execPath,
          headless: true,
          userDataDir: profileDir,
          ignoreDefaultArgs: ['--enable-automation'],
          args: launchArgs,
        });
      }

      const pages = await this.browser.pages();
      this.page = pages.length > 0 ? pages[0] : await this.browser.newPage();

      // Configure anti-bot stealth evasions before any page opens
      await this.page.evaluateOnNewDocument(() => {
        Object.defineProperty(navigator, 'webdriver', {
          get: () => undefined,
        });
        (window as any).chrome = {
          app: { isInstalled: false },
          runtime: {},
          loadTimes: function () {},
          csi: function () {},
        };
        Object.defineProperty(navigator, 'plugins', {
          get: () => [
            { name: 'PDF Viewer', filename: 'internal-pdf-viewer', description: 'Portable Document Format' },
            { name: 'Chrome PDF Viewer', filename: 'internal-pdf-viewer', description: 'Portable Document Format' },
          ],
        });
        Object.defineProperty(navigator, 'languages', {
          get: () => ['ja-JP', 'ja', 'en-US', 'en'],
        });
      });

      // Configure viewport
      await this.applyViewport();

      // Set Japanese & modern browser headers
      await this.page.setExtraHTTPHeaders({
        'Accept-Language': 'ja-JP,ja;q=0.9,en-US;q=0.8,en;q=0.7',
        'sec-ch-ua': '"Not(A:Brand";v="99", "Google Chrome";v="133", "Chromium";v="133"',
        'sec-ch-ua-mobile': '?0',
        'sec-ch-ua-platform': '"Windows"',
        'Upgrade-Insecure-Requests': '1',
      });

      // Hook page events
      this.setupPageListeners();

      // Setup CDP Screencast
      await this.setupCDPSession();

      this.isInitializing = false;
      // Navigate to initial page
      await this.navigate(this.currentUrl);
      console.log('[RemoteBrowser] Initialized successfully');
    } catch (err) {
      console.error('[RemoteBrowser] Init error:', err);
    } finally {
      this.isInitializing = false;
    }
  }

  private async waitForReady(): Promise<boolean> {
    if (this.page) return true;
    if (!this.isInitializing) {
      this.initialize().catch(() => {});
    }
    const start = Date.now();
    while (!this.page && Date.now() - start < 15000) {
      await new Promise((r) => setTimeout(r, 100));
    }
    return !!this.page;
  }

  private setupPageListeners(): void {
    if (!this.page) return;

    this.page.on('load', async () => {
      this.isLoading = false;
      await this.updatePageStatus();
      this.broadcastStatus();
    });

    this.page.on('domcontentloaded', async () => {
      await this.updatePageStatus();
      this.broadcastStatus();
    });

    this.page.on('framenavigated', async (frame) => {
      if (frame === this.page?.mainFrame()) {
        this.currentUrl = frame.url();
        this.sslSecure = this.currentUrl.startsWith('https://');
        await this.updatePageStatus();
        this.broadcastStatus();
      }
    });

    this.page.on('console', (msg) => {
      const entry: ConsoleMessage = {
        type: msg.type(),
        text: msg.text().slice(0, 500),
        timestamp: Date.now(),
      };
      this.consoleLogs.push(entry);
      if (this.consoleLogs.length > 40) {
        this.consoleLogs.shift();
      }
      this.broadcast({
        type: 'console',
        message: entry,
      });
    });

    this.page.on('error', (err) => {
      console.error('[RemoteBrowser] Page crash error:', err);
    });

    this.page.on('pageerror', (err: any) => {
      const errorMsg = err instanceof Error ? err.message : String(err);
      const entry: ConsoleMessage = {
        type: 'error',
        text: errorMsg.slice(0, 500),
        timestamp: Date.now(),
      };
      this.consoleLogs.push(entry);
      if (this.consoleLogs.length > 40) {
        this.consoleLogs.shift();
      }
      this.broadcast({
        type: 'console',
        message: entry,
      });
    });
  }

  private async setupCDPSession(): Promise<void> {
    if (!this.page) return;

    try {
      if (this.cdp) {
        try {
          await this.cdp.detach();
        } catch (_) {}
      }

      this.cdp = await this.page.target().createCDPSession();
      await this.cdp.send('Page.enable');

      this.cdp.on('Page.screencastFrame', async ({ data, sessionId, metadata }) => {
        this.latestFrame = data;
        this.latestFrameMeta = metadata;

        // Acknowledge frame to keep the stream flowing
        try {
          if (this.cdp) {
            await this.cdp.send('Page.screencastFrameAck', { sessionId });
          }
        } catch (_) {}

        // Broadcast to clients
        if (this.clients.size > 0) {
          const framePayload = JSON.stringify({
            type: 'frame',
            data,
            meta: {
              timestamp: Date.now(),
              offsetTop: metadata.offsetTop,
              pageScaleFactor: metadata.pageScaleFactor,
              deviceWidth: metadata.deviceWidth,
              deviceHeight: metadata.deviceHeight,
              scrollOffsetX: metadata.scrollOffsetX,
              scrollOffsetY: metadata.scrollOffsetY,
            },
          });

          for (const client of this.clients) {
            if (client.readyState === WebSocket.OPEN) {
              client.send(framePayload);
            }
          }
        }
      });

      await this.startScreencast();

      // Immediately capture an initial frame to ensure immediate display
      try {
        const shot = await this.page.screenshot({ type: 'jpeg', quality: this.quality });
        this.latestFrame = (shot as Buffer).toString('base64');
      } catch (_) {}
    } catch (err) {
      console.error('[RemoteBrowser] CDP Screencast setup error:', err);
    }
  }

  private async startScreencast(): Promise<void> {
    if (!this.cdp) return;
    try {
      await this.cdp.send('Page.startScreencast', {
        format: 'jpeg',
        quality: this.quality,
        maxWidth: this.viewport.width,
        maxHeight: this.viewport.height,
        everyNthFrame: 1,
      });
      this.screencastActive = true;
    } catch (err) {
      console.error('[RemoteBrowser] Error starting screencast:', err);
    }
  }

  private async stopScreencast(): Promise<void> {
    if (!this.cdp || !this.screencastActive) return;
    try {
      await this.cdp.send('Page.stopScreencast');
      this.screencastActive = false;
    } catch (_) {}
  }

  private async updatePageStatus(): Promise<void> {
    if (!this.page) return;
    try {
      this.currentTitle = (await this.page.title()) || 'No Title';
      this.currentUrl = this.page.url();
      this.sslSecure = this.currentUrl.startsWith('https://');

      // Check navigation history states
      const historyStatus = await this.page.evaluate(() => {
        return {
          length: window.history.length,
        };
      }).catch(() => ({ length: 1 }));

      this.canGoBack = (historyStatus.length > 1);
      this.canGoForward = false; // Puppeteer doesn't expose future stack easily, but back is accurate
    } catch (_) {}
  }

  public async navigate(rawUrl: string): Promise<boolean> {
    const ready = await this.waitForReady();
    if (!ready || !this.page) return false;

    let targetUrl = rawUrl.trim();
    if (!targetUrl.startsWith('http://') && !targetUrl.startsWith('https://') && !targetUrl.startsWith('about:')) {
      // Check if it's a domain or search query
      if (targetUrl.includes('.') && !targetUrl.includes(' ')) {
        targetUrl = 'https://' + targetUrl;
      } else {
        // Search query
        targetUrl = `https://www.google.com/search?q=${encodeURIComponent(targetUrl)}`;
      }
    }

    this.isLoading = true;
    this.currentUrl = targetUrl;
    this.sslSecure = targetUrl.startsWith('https://');
    this.broadcastStatus();

    if (this.navigationTimeout) clearTimeout(this.navigationTimeout);
    this.navigationTimeout = setTimeout(() => {
      if (this.isLoading) {
        this.isLoading = false;
        this.broadcastStatus();
      }
    }, 6000);

    try {
      await this.page.goto(targetUrl, {
        waitUntil: 'domcontentloaded',
        timeout: 12000,
      });
      this.isLoading = false;
      await this.updatePageStatus();
      this.broadcastStatus();
      return true;
    } catch (err: any) {
      // Stream continues even if background tracking scripts are pending
      this.isLoading = false;
      await this.updatePageStatus();
      this.broadcastStatus();
      return true;
    }
  }

  public async goBack(): Promise<void> {
    if (!this.page) return;
    this.isLoading = true;
    this.broadcastStatus();
    try {
      await this.page.goBack({ waitUntil: 'domcontentloaded', timeout: 8000 });
    } catch (_) {}
    this.isLoading = false;
    await this.updatePageStatus();
    this.broadcastStatus();
  }

  public async goForward(): Promise<void> {
    if (!this.page) return;
    this.isLoading = true;
    this.broadcastStatus();
    try {
      await this.page.goForward({ waitUntil: 'domcontentloaded', timeout: 8000 });
    } catch (_) {}
    this.isLoading = false;
    await this.updatePageStatus();
    this.broadcastStatus();
  }

  public async reload(): Promise<void> {
    if (!this.page) return;
    this.isLoading = true;
    this.broadcastStatus();
    try {
      await this.page.reload({ waitUntil: 'domcontentloaded', timeout: 8000 });
    } catch (_) {}
    this.isLoading = false;
    await this.updatePageStatus();
    this.broadcastStatus();
  }

  public async setQuality(quality: number): Promise<void> {
    this.quality = Math.max(20, Math.min(100, quality));
    if (this.screencastActive && this.cdp) {
      await this.stopScreencast();
      await this.startScreencast();
    }
    this.broadcastStatus();
  }

  public async setViewport(config: Partial<ViewportConfig>): Promise<void> {
    this.viewport = { ...this.viewport, ...config };
    await this.applyViewport();
    if (this.screencastActive && this.cdp) {
      await this.stopScreencast();
      await this.startScreencast();
    }
    this.broadcastStatus();
  }

  private async applyViewport(): Promise<void> {
    if (!this.page) return;
    try {
      await this.page.setViewport({
        width: Math.round(this.viewport.width),
        height: Math.round(this.viewport.height),
        deviceScaleFactor: this.viewport.deviceScaleFactor || 1,
        isMobile: !!this.viewport.isMobile,
        hasTouch: !!this.viewport.hasTouch,
      });

      if (this.viewport.isMobile) {
        await this.page.setUserAgent(
          'Mozilla/5.0 (iPhone; CPU iPhone OS 17_4 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/17.4 Mobile/15E148 Safari/604.1'
        );
        await this.page.setExtraHTTPHeaders({
          'sec-ch-ua-mobile': '?1',
          'sec-ch-ua-platform': '"iOS"',
        });
      } else {
        await this.page.setUserAgent(
          'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/133.0.0.0 Safari/537.36'
        );
        await this.page.setExtraHTTPHeaders({
          'sec-ch-ua-mobile': '?0',
          'sec-ch-ua-platform': '"Windows"',
        });
      }
    } catch (err) {
      console.error('[RemoteBrowser] Error applying viewport:', err);
    }
  }

  // --- Interaction Dispatchers ---

  public async dispatchMouseEvent(event: {
    type: 'mousePressed' | 'mouseReleased' | 'mouseMoved' | 'mouseWheel';
    x: number;
    y: number;
    button?: 'none' | 'left' | 'middle' | 'right';
    clickCount?: number;
    deltaX?: number;
    deltaY?: number;
  }): Promise<void> {
    if (!this.cdp) return;
    try {
      const x = Math.max(0, Math.min(this.viewport.width, Math.round(event.x)));
      const y = Math.max(0, Math.min(this.viewport.height, Math.round(event.y)));

      if (event.type === 'mouseWheel') {
        await this.cdp.send('Input.dispatchMouseEvent', {
          type: 'mouseWheel',
          x,
          y,
          deltaX: Math.round(event.deltaX || 0),
          deltaY: Math.round(event.deltaY || 0),
        });
      } else {
        await this.cdp.send('Input.dispatchMouseEvent', {
          type: event.type,
          x,
          y,
          button: event.button || 'left',
          clickCount: event.clickCount || (event.type === 'mousePressed' ? 1 : 0),
        });
      }
    } catch (err) {
      console.warn('[RemoteBrowser] Mouse event failed:', err);
    }
  }

  public async dispatchTouchEvent(event: {
    type: 'touchStart' | 'touchMove' | 'touchEnd' | 'touchCancel';
    touchPoints: Array<{ x: number; y: number; id?: number }>;
  }): Promise<void> {
    if (!this.cdp) return;
    try {
      const touchPoints = event.touchPoints.map((pt, index) => ({
        x: Math.max(0, Math.min(this.viewport.width, Math.round(pt.x))),
        y: Math.max(0, Math.min(this.viewport.height, Math.round(pt.y))),
        id: pt.id ?? index,
      }));

      await this.cdp.send('Input.dispatchTouchEvent', {
        type: event.type,
        touchPoints,
      });
    } catch (err) {
      console.warn('[RemoteBrowser] Touch event error, falling back to mouse:', err);
      if (event.type === 'touchStart' && event.touchPoints[0]) {
        await this.dispatchMouseEvent({
          type: 'mousePressed',
          x: event.touchPoints[0].x,
          y: event.touchPoints[0].y,
          button: 'left',
          clickCount: 1,
        });
      } else if (event.type === 'touchEnd' && event.touchPoints[0]) {
        await this.dispatchMouseEvent({
          type: 'mouseReleased',
          x: event.touchPoints[0].x,
          y: event.touchPoints[0].y,
          button: 'left',
        });
      }
    }
  }

  public async dispatchKeyEvent(event: {
    type: 'rawKeyDown' | 'keyDown' | 'keyUp' | 'char';
    key?: string;
    code?: string;
    text?: string;
    windowsVirtualKeyCode?: number;
  }): Promise<void> {
    if (!this.cdp) return;
    try {
      await this.cdp.send('Input.dispatchKeyEvent', {
        type: event.type,
        key: event.key,
        code: event.code,
        text: event.text,
        windowsVirtualKeyCode: event.windowsVirtualKeyCode,
        unmodifiedText: event.text,
      });
    } catch (err) {
      console.warn('[RemoteBrowser] Key event failed:', err);
    }
  }

  public async insertText(text: string): Promise<void> {
    if (!this.cdp) return;
    try {
      await this.cdp.send('Input.insertText', { text });
    } catch (err) {
      console.warn('[RemoteBrowser] Insert text failed:', err);
      // Fallback: keyboard type
      if (this.page) {
        await this.page.keyboard.type(text).catch(() => {});
      }
    }
  }

  public async captureScreenshot(): Promise<Buffer | null> {
    if (!this.page) return null;
    try {
      const buffer = await this.page.screenshot({
        type: 'png',
        fullPage: false,
      });
      return buffer as Buffer;
    } catch (err) {
      console.error('[RemoteBrowser] Screenshot failed:', err);
      return null;
    }
  }

  public async resetSession(): Promise<void> {
    try {
      if (this.cdp) {
        await this.cdp.detach().catch(() => {});
        this.cdp = null;
      }
      if (this.browser) {
        await this.browser.close().catch(() => {});
        this.browser = null;
        this.page = null;
      }
      this.latestFrame = null;
      this.consoleLogs = [];
      await this.initialize();
    } catch (err) {
      console.error('[RemoteBrowser] Reset error:', err);
    }
  }

  // --- Client & Status Management ---

  public addClient(ws: WebSocket): void {
    this.clients.add(ws);
    // Send immediate initial state
    ws.send(
      JSON.stringify({
        type: 'status',
        status: this.getStatus(),
      })
    );

    // Send latest frame immediately if available
    if (this.latestFrame) {
      ws.send(
        JSON.stringify({
          type: 'frame',
          data: this.latestFrame,
          meta: this.latestFrameMeta || { timestamp: Date.now() },
        })
      );
    }
  }

  public removeClient(ws: WebSocket): void {
    this.clients.delete(ws);
  }

  public getStatus(): BrowserStatus {
    return {
      url: this.currentUrl,
      title: this.currentTitle || 'CloudCast Browser',
      isLoading: this.isLoading,
      canGoBack: this.canGoBack,
      canGoForward: this.canGoForward,
      viewport: this.viewport,
      quality: this.quality,
      clientCount: this.clients.size,
      uptime: Math.round((Date.now() - this.startTime) / 1000),
      sslSecure: this.sslSecure,
    };
  }

  public getLatestFrame(): string | null {
    return this.latestFrame;
  }

  public getConsoleLogs(): ConsoleMessage[] {
    return this.consoleLogs;
  }

  public broadcast(payload: any): void {
    const msg = JSON.stringify(payload);
    for (const client of this.clients) {
      if (client.readyState === WebSocket.OPEN) {
        client.send(msg);
      }
    }
  }

  public broadcastStatus(): void {
    this.broadcast({
      type: 'status',
      status: this.getStatus(),
    });
  }
}

export const remoteBrowser = new RemoteBrowserManager();
