import { useState, useEffect, useRef, useCallback } from 'react';
import { BrowserStatus, ConsoleMessage, ViewportConfig, FrameMetadata } from '../types';

export function useRemoteBrowser() {
  const [status, setStatus] = useState<BrowserStatus>({
    url: '',
    title: '接続中...',
    isLoading: true,
    canGoBack: false,
    canGoForward: false,
    viewport: { width: 1280, height: 800, isMobile: false, hasTouch: false },
    quality: 70,
    clientCount: 1,
    uptime: 0,
    sslSecure: true,
  });

  const [frameData, setFrameData] = useState<string | null>(null);
  const [frameMeta, setFrameMeta] = useState<FrameMetadata | null>(null);
  const [isConnected, setIsConnected] = useState<boolean>(false);
  const [isUsingFallback, setIsUsingFallback] = useState<boolean>(false);
  const [latencyMs, setLatencyMs] = useState<number | null>(null);
  const [fps, setFps] = useState<number>(0);
  const [consoleLogs, setConsoleLogs] = useState<ConsoleMessage[]>([]);

  const wsRef = useRef<WebSocket | null>(null);
  const reconnectTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const pingIntervalRef = useRef<NodeJS.Timeout | null>(null);
  const frameCountRef = useRef<number>(0);
  const fpsTimerRef = useRef<NodeJS.Timeout | null>(null);
  const fallbackIntervalRef = useRef<NodeJS.Timeout | null>(null);

  // Send message over WS or fallback to HTTP
  const sendMessage = useCallback((msg: any) => {
    if (wsRef.current && wsRef.current.readyState === WebSocket.OPEN) {
      wsRef.current.send(JSON.stringify(msg));
    } else {
      // HTTP fallback
      if (msg.type === 'navigate') {
        fetch('/api/browser/navigate', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ url: msg.url }),
        }).catch(() => {});
      } else if (msg.type === 'mouse') {
        fetch('/api/browser/mouse', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(msg.mouseEvent),
        }).catch(() => {});
      } else if (msg.type === 'touch') {
        fetch('/api/browser/touch', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(msg.touchEvent),
        }).catch(() => {});
      } else if (msg.type === 'key') {
        fetch('/api/browser/key', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(msg.keyEvent),
        }).catch(() => {});
      } else if (msg.type === 'text') {
        fetch('/api/browser/text', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ text: msg.text }),
        }).catch(() => {});
      } else if (['back', 'forward', 'reload', 'reset'].includes(msg.type)) {
        fetch('/api/browser/control', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ action: msg.type }),
        }).catch(() => {});
      } else if (msg.type === 'viewport') {
        fetch('/api/browser/control', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ action: 'viewport', value: msg.viewport }),
        }).catch(() => {});
      } else if (msg.type === 'quality') {
        fetch('/api/browser/control', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ action: 'quality', value: msg.quality }),
        }).catch(() => {});
      }
    }
  }, []);

  // Connect WebSocket
  const connectWebSocket = useCallback(() => {
    if (wsRef.current && (wsRef.current.readyState === WebSocket.OPEN || wsRef.current.readyState === WebSocket.CONNECTING)) {
      return;
    }

    const protocol = window.location.protocol === 'https:' ? 'wss:' : 'ws:';
    const wsUrl = `${protocol}//${window.location.host}/ws/browser`;

    try {
      const ws = new WebSocket(wsUrl);
      wsRef.current = ws;

      ws.onopen = () => {
        setIsConnected(true);
        setIsUsingFallback(false);
        // Clear fallback polling if active
        if (fallbackIntervalRef.current) {
          clearInterval(fallbackIntervalRef.current);
          fallbackIntervalRef.current = null;
        }

        // Start ping measuring
        if (pingIntervalRef.current) clearInterval(pingIntervalRef.current);
        pingIntervalRef.current = setInterval(() => {
          if (ws.readyState === WebSocket.OPEN) {
            ws.send(JSON.stringify({ type: 'ping', time: Date.now() }));
          }
        }, 2000);
      };

      ws.onmessage = (event) => {
        try {
          const msg = JSON.parse(event.data);
          if (msg.type === 'frame') {
            setFrameData(msg.data);
            if (msg.meta) setFrameMeta(msg.meta);
            frameCountRef.current++;
          } else if (msg.type === 'status') {
            setStatus(msg.status);
          } else if (msg.type === 'pong') {
            const rtt = Date.now() - msg.clientTime;
            setLatencyMs(rtt);
          } else if (msg.type === 'console') {
            setConsoleLogs((prev) => [...prev.slice(-30), msg.message]);
          }
        } catch (_) {}
      };

      ws.onclose = () => {
        setIsConnected(false);
        wsRef.current = null;
        if (pingIntervalRef.current) clearInterval(pingIntervalRef.current);

        // Switch to HTTP fallback polling
        startHttpFallback();

        // Attempt reconnect after delay
        if (reconnectTimeoutRef.current) clearTimeout(reconnectTimeoutRef.current);
        reconnectTimeoutRef.current = setTimeout(() => {
          connectWebSocket();
        }, 3000);
      };

      ws.onerror = () => {
        // ws.onclose handles recovery
      };
    } catch (_) {
      startHttpFallback();
    }
  }, []);

  const startHttpFallback = useCallback(() => {
    setIsUsingFallback(true);
    if (!fallbackIntervalRef.current) {
      fallbackIntervalRef.current = setInterval(async () => {
        try {
          const [statusRes, frameRes] = await Promise.all([
            fetch('/api/browser/status'),
            fetch('/api/browser/frame?t=' + Date.now()),
          ]);
          if (statusRes.ok) {
            const data = await statusRes.json();
            setStatus(data);
          }
          if (frameRes.ok && frameRes.status === 200) {
            const blob = await frameRes.blob();
            const reader = new FileReader();
            reader.onloadend = () => {
              const base64 = (reader.result as string)?.split(',')[1];
              if (base64) {
                setFrameData(base64);
                frameCountRef.current++;
              }
            };
            reader.readAsDataURL(blob);
          }
        } catch (_) {}
      }, 250);
    }
  }, []);

  // Measure FPS
  useEffect(() => {
    fpsTimerRef.current = setInterval(() => {
      setFps(frameCountRef.current);
      frameCountRef.current = 0;
    }, 1000);

    return () => {
      if (fpsTimerRef.current) clearInterval(fpsTimerRef.current);
    };
  }, []);

  // Fetch initial logs
  const fetchLogs = useCallback(async () => {
    try {
      const res = await fetch('/api/browser/logs');
      if (res.ok) {
        const data = await res.json();
        setConsoleLogs(data);
      }
    } catch (_) {}
  }, []);

  useEffect(() => {
    connectWebSocket();
    fetchLogs();

    return () => {
      if (wsRef.current) {
        wsRef.current.close();
      }
      if (reconnectTimeoutRef.current) clearTimeout(reconnectTimeoutRef.current);
      if (pingIntervalRef.current) clearInterval(pingIntervalRef.current);
      if (fallbackIntervalRef.current) clearInterval(fallbackIntervalRef.current);
    };
  }, [connectWebSocket, fetchLogs]);

  // Public control API
  const navigate = useCallback((url: string) => {
    setStatus((prev) => ({ ...prev, isLoading: true, url }));
    sendMessage({ type: 'navigate', url });
  }, [sendMessage]);

  const goBack = useCallback(() => {
    setStatus((prev) => ({ ...prev, isLoading: true }));
    sendMessage({ type: 'back' });
  }, [sendMessage]);

  const goForward = useCallback(() => {
    setStatus((prev) => ({ ...prev, isLoading: true }));
    sendMessage({ type: 'forward' });
  }, [sendMessage]);

  const reload = useCallback(() => {
    setStatus((prev) => ({ ...prev, isLoading: true }));
    sendMessage({ type: 'reload' });
  }, [sendMessage]);

  const setViewport = useCallback((viewport: Partial<ViewportConfig>) => {
    sendMessage({ type: 'viewport', viewport });
  }, [sendMessage]);

  const setQuality = useCallback((quality: number) => {
    sendMessage({ type: 'quality', quality });
  }, [sendMessage]);

  const resetSession = useCallback(() => {
    setStatus((prev) => ({ ...prev, isLoading: true }));
    sendMessage({ type: 'reset' });
  }, [sendMessage]);

  const sendMouse = useCallback((event: {
    type: 'mousePressed' | 'mouseReleased' | 'mouseMoved' | 'mouseWheel';
    x: number;
    y: number;
    button?: 'none' | 'left' | 'middle' | 'right';
    clickCount?: number;
    deltaX?: number;
    deltaY?: number;
  }) => {
    sendMessage({ type: 'mouse', mouseEvent: event });
  }, [sendMessage]);

  const sendTouch = useCallback((event: {
    type: 'touchStart' | 'touchMove' | 'touchEnd' | 'touchCancel';
    touchPoints: Array<{ x: number; y: number; id?: number }>;
  }) => {
    sendMessage({ type: 'touch', touchEvent: event });
  }, [sendMessage]);

  const sendKey = useCallback((event: {
    type: 'rawKeyDown' | 'keyDown' | 'keyUp' | 'char';
    key?: string;
    code?: string;
    text?: string;
    windowsVirtualKeyCode?: number;
  }) => {
    sendMessage({ type: 'key', keyEvent: event });
  }, [sendMessage]);

  const sendText = useCallback((text: string) => {
    sendMessage({ type: 'text', text });
  }, [sendMessage]);

  return {
    status,
    frameData,
    frameMeta,
    isConnected,
    isUsingFallback,
    latencyMs,
    fps,
    consoleLogs,
    navigate,
    goBack,
    goForward,
    reload,
    setViewport,
    setQuality,
    resetSession,
    sendMouse,
    sendTouch,
    sendKey,
    sendText,
    fetchLogs,
  };
}
