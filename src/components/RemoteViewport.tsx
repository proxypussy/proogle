import React, { useRef, useState, useCallback, useEffect } from 'react';
import { ViewportConfig } from '../types';
import { Loader2, MousePointer, RefreshCw } from 'lucide-react';

interface Ripple {
  id: number;
  x: number;
  y: number;
}

interface RemoteViewportProps {
  frameData: string | null;
  viewport: ViewportConfig;
  isLoading: boolean;
  onSendMouse: (event: {
    type: 'mousePressed' | 'mouseReleased' | 'mouseMoved' | 'mouseWheel';
    x: number;
    y: number;
    button?: 'none' | 'left' | 'middle' | 'right';
    clickCount?: number;
    deltaX?: number;
    deltaY?: number;
  }) => void;
  onSendKey: (event: {
    type: 'rawKeyDown' | 'keyDown' | 'keyUp' | 'char';
    key?: string;
    code?: string;
    text?: string;
    windowsVirtualKeyCode?: number;
  }) => void;
  onSendText: (text: string) => void;
  onReload: () => void;
  isRecording?: boolean;
}

export const RemoteViewport: React.FC<RemoteViewportProps> = ({
  frameData,
  viewport,
  isLoading,
  onSendMouse,
  onSendKey,
  onSendText,
  onReload,
  isRecording = false,
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [ripples, setRipples] = useState<Ripple[]>([]);
  const [cursorPos, setCursorPos] = useState<{ x: number; y: number } | null>(null);
  const isMouseDownRef = useRef(false);
  const touchStartRef = useRef<{ x: number; y: number; time: number; hasMoved: boolean } | null>(null);
  const lastTouchPosRef = useRef<{ x: number; y: number } | null>(null);

  // Convert client coordinates to remote canvas pixel coordinates
  const getRemoteCoords = useCallback(
    (clientX: number, clientY: number): { x: number; y: number; localX: number; localY: number } | null => {
      if (!containerRef.current) return null;
      const rect = containerRef.current.getBoundingClientRect();
      const vw = viewport.width;
      const vh = viewport.height;

      const containerAspect = rect.width / rect.height;
      const remoteAspect = vw / vh;
      let renderWidth = rect.width;
      let renderHeight = rect.height;
      let offsetX = 0;
      let offsetY = 0;

      if (containerAspect > remoteAspect) {
        // Pillarboxed
        renderHeight = rect.height;
        renderWidth = renderHeight * remoteAspect;
        offsetX = (rect.width - renderWidth) / 2;
      } else {
        // Letterboxed
        renderWidth = rect.width;
        renderHeight = renderWidth / remoteAspect;
        offsetY = (rect.height - renderHeight) / 2;
      }

      const localX = clientX - rect.left - offsetX;
      const localY = clientY - rect.top - offsetY;

      if (localX < 0 || localX > renderWidth || localY < 0 || localY > renderHeight) {
        return null;
      }

      const remoteX = (localX / renderWidth) * vw;
      const remoteY = (localY / renderHeight) * vh;

      return {
        x: Math.max(0, Math.min(vw, remoteX)),
        y: Math.max(0, Math.min(vh, remoteY)),
        localX: localX + offsetX,
        localY: localY + offsetY,
      };
    },
    [viewport.width, viewport.height]
  );

  const addRipple = useCallback((localX: number, localY: number) => {
    const newRipple = { id: Date.now() + Math.random(), x: localX, y: localY };
    setRipples((prev) => [...prev.slice(-4), newRipple]);
    setTimeout(() => {
      setRipples((prev) => prev.filter((r) => r.id !== newRipple.id));
    }, 500);
  }, []);

  // Mouse Handlers
  const handleMouseDown = useCallback(
    (e: React.MouseEvent) => {
      const coords = getRemoteCoords(e.clientX, e.clientY);
      if (!coords) return;

      isMouseDownRef.current = true;
      const button = e.button === 2 ? 'right' : e.button === 1 ? 'middle' : 'left';
      addRipple(coords.localX, coords.localY);

      onSendMouse({
        type: 'mousePressed',
        x: coords.x,
        y: coords.y,
        button,
        clickCount: 1,
      });
    },
    [getRemoteCoords, onSendMouse, addRipple]
  );

  const handleMouseUp = useCallback(
    (e: React.MouseEvent) => {
      const coords = getRemoteCoords(e.clientX, e.clientY);
      if (!coords) {
        isMouseDownRef.current = false;
        return;
      }

      isMouseDownRef.current = false;
      const button = e.button === 2 ? 'right' : e.button === 1 ? 'middle' : 'left';

      onSendMouse({
        type: 'mouseReleased',
        x: coords.x,
        y: coords.y,
        button,
      });
    },
    [getRemoteCoords, onSendMouse]
  );

  const handleMouseMove = useCallback(
    (e: React.MouseEvent) => {
      const coords = getRemoteCoords(e.clientX, e.clientY);
      if (!coords) {
        setCursorPos(null);
        return;
      }

      setCursorPos({ x: coords.localX, y: coords.localY });
      onSendMouse({
        type: 'mouseMoved',
        x: coords.x,
        y: coords.y,
        button: isMouseDownRef.current ? 'left' : 'none',
      });
    },
    [getRemoteCoords, onSendMouse]
  );

  const handleDoubleClick = useCallback(
    (e: React.MouseEvent) => {
      const coords = getRemoteCoords(e.clientX, e.clientY);
      if (!coords) return;
      onSendMouse({
        type: 'mousePressed',
        x: coords.x,
        y: coords.y,
        button: 'left',
        clickCount: 2,
      });
    },
    [getRemoteCoords, onSendMouse]
  );

  const handleContextMenu = useCallback(
    (e: React.MouseEvent) => {
      e.preventDefault();
      const coords = getRemoteCoords(e.clientX, e.clientY);
      if (!coords) return;
      onSendMouse({
        type: 'mousePressed',
        x: coords.x,
        y: coords.y,
        button: 'right',
        clickCount: 1,
      });
      setTimeout(() => {
        onSendMouse({
          type: 'mouseReleased',
          x: coords.x,
          y: coords.y,
          button: 'right',
        });
      }, 50);
    },
    [getRemoteCoords, onSendMouse]
  );

  // Wheel / Scroll Handler
  const handleWheel = useCallback(
    (e: React.WheelEvent) => {
      const coords = getRemoteCoords(e.clientX, e.clientY);
      const x = coords ? coords.x : viewport.width / 2;
      const y = coords ? coords.y : viewport.height / 2;

      onSendMouse({
        type: 'mouseWheel',
        x,
        y,
        deltaX: e.deltaX,
        deltaY: e.deltaY,
      });
    },
    [getRemoteCoords, onSendMouse, viewport.width, viewport.height]
  );

  // Touch Handlers (Natural mobile touch: swipe scrolls, tap clicks)
  const handleTouchStart = useCallback(
    (e: React.TouchEvent) => {
      if (e.touches.length !== 1) return;
      const touch = e.touches[0];
      const coords = getRemoteCoords(touch.clientX, touch.clientY);
      if (!coords) return;

      touchStartRef.current = {
        x: touch.clientX,
        y: touch.clientY,
        time: Date.now(),
        hasMoved: false,
      };
      lastTouchPosRef.current = { x: touch.clientX, y: touch.clientY };
    },
    [getRemoteCoords]
  );

  const handleTouchMove = useCallback(
    (e: React.TouchEvent) => {
      if (e.touches.length !== 1 || !touchStartRef.current || !lastTouchPosRef.current) return;
      const touch = e.touches[0];
      const deltaX = lastTouchPosRef.current.x - touch.clientX;
      const deltaY = lastTouchPosRef.current.y - touch.clientY;

      const totalDist = Math.hypot(
        touch.clientX - touchStartRef.current.x,
        touch.clientY - touchStartRef.current.y
      );

      if (totalDist > 8) {
        touchStartRef.current.hasMoved = true;
        const coords = getRemoteCoords(touch.clientX, touch.clientY);
        const x = coords ? coords.x : viewport.width / 2;
        const y = coords ? coords.y : viewport.height / 2;

        onSendMouse({
          type: 'mouseWheel',
          x,
          y,
          deltaX: deltaX * 1.8,
          deltaY: deltaY * 1.8,
        });
        lastTouchPosRef.current = { x: touch.clientX, y: touch.clientY };
      }
    },
    [getRemoteCoords, onSendMouse, viewport.width, viewport.height]
  );

  const handleTouchEnd = useCallback(
    (e: React.TouchEvent) => {
      if (!touchStartRef.current) return;
      const start = touchStartRef.current;
      touchStartRef.current = null;
      lastTouchPosRef.current = null;

      // If stationary tap (<8px movement & duration < 500ms)
      if (!start.hasMoved && Date.now() - start.time < 500) {
        const coords = getRemoteCoords(start.x, start.y);
        if (coords) {
          addRipple(coords.localX, coords.localY);
          onSendMouse({
            type: 'mousePressed',
            x: coords.x,
            y: coords.y,
            button: 'left',
            clickCount: 1,
          });
          setTimeout(() => {
            onSendMouse({
              type: 'mouseReleased',
              x: coords.x,
              y: coords.y,
              button: 'left',
            });
          }, 40);
        }
      }
    },
    [getRemoteCoords, onSendMouse, addRipple]
  );

  // Global physical keyboard capture when viewport container is focused
  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent) => {
      // Don't intercept if user is typing in an actual input or textarea outside canvas
      if (
        e.target instanceof HTMLInputElement ||
        e.target instanceof HTMLTextAreaElement
      ) {
        return;
      }

      // Prevent default page scroll on arrow keys or space
      if (['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight', 'Space', 'Tab'].includes(e.code)) {
        e.preventDefault();
      }

      onSendKey({
        type: 'keyDown',
        key: e.key,
        code: e.code,
        text: e.key.length === 1 ? e.key : undefined,
        windowsVirtualKeyCode: e.keyCode,
      });
    },
    [onSendKey]
  );

  const handleKeyUp = useCallback(
    (e: React.KeyboardEvent) => {
      if (
        e.target instanceof HTMLInputElement ||
        e.target instanceof HTMLTextAreaElement
      ) {
        return;
      }

      onSendKey({
        type: 'keyUp',
        key: e.key,
        code: e.code,
        windowsVirtualKeyCode: e.keyCode,
      });
    },
    [onSendKey]
  );

  return (
    <div
      ref={containerRef}
      tabIndex={0}
      onKeyDown={handleKeyDown}
      onKeyUp={handleKeyUp}
      onMouseDown={handleMouseDown}
      onMouseUp={handleMouseUp}
      onMouseMove={handleMouseMove}
      onDoubleClick={handleDoubleClick}
      onContextMenu={handleContextMenu}
      onWheel={handleWheel}
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
      className="relative flex-1 w-full h-full bg-slate-950 flex items-center justify-center overflow-hidden outline-none select-none touch-none cursor-crosshair"
    >
      {/* Remote Frame Display */}
      {frameData ? (
        <img
          src={`data:image/jpeg;base64,${frameData}`}
          alt="Remote Browser Viewport"
          className="max-w-full max-h-full object-contain pointer-events-none select-none shadow-2xl transition-opacity duration-75"
          draggable={false}
          style={{
            aspectRatio: `${viewport.width} / ${viewport.height}`,
          }}
        />
      ) : (
        <div className="flex flex-col items-center justify-center gap-3 text-slate-500">
          <Loader2 className="w-8 h-8 animate-spin text-sky-400" />
          <p className="text-sm">リモートブラウザ画面を読み込み中...</p>
        </div>
      )}

      {/* Ripple Animation on Click/Tap */}
      {ripples.map((r) => (
        <span
          key={r.id}
          className="absolute pointer-events-none rounded-full border-2 border-sky-400/80 bg-sky-400/20 animate-ping -translate-x-1/2 -translate-y-1/2 z-20"
          style={{
            left: `${r.x}px`,
            top: `${r.y}px`,
            width: '28px',
            height: '28px',
          }}
        />
      ))}

      {/* Subtle Hover Pointer Indicator */}
      {cursorPos && (
        <div
          className="absolute pointer-events-none -translate-x-1/2 -translate-y-1/2 z-10 transition-[transform] duration-75 opacity-70"
          style={{
            left: `${cursorPos.x}px`,
            top: `${cursorPos.y}px`,
          }}
        >
          <div className="w-2.5 h-2.5 rounded-full bg-sky-400 border border-white/60 shadow-[0_0_6px_rgba(56,189,248,0.8)]" />
        </div>
      )}

      {/* Recording Active Frame Border & Badge */}
      {isRecording && (
        <>
          <div className="absolute inset-0 pointer-events-none border-2 border-rose-500/70 z-20 animate-pulse" />
          <div className="absolute top-3 right-3 px-2.5 py-1 rounded-md bg-rose-950/80 backdrop-blur-sm border border-rose-500/60 text-xs font-mono font-medium text-rose-300 pointer-events-none flex items-center gap-1.5 z-20 shadow-lg">
            <span className="w-2 h-2 rounded-full bg-rose-500 animate-ping" />
            <span>REC (録画中)</span>
          </div>
        </>
      )}

      {/* Interactive Helper Overlay (Shows once on connect) */}
      <div className="absolute bottom-3 left-3 px-2.5 py-1 rounded bg-slate-900/80 backdrop-blur-sm border border-slate-800 text-[11px] text-slate-400 pointer-events-none flex items-center gap-2 z-10">
        <MousePointer className="w-3 h-3 text-sky-400 shrink-0" />
        <span>画面タップ・クリック・ホイールで直接操作できます</span>
      </div>
    </div>
  );
};
