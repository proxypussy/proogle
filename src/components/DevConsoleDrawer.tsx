import React from 'react';
import { ConsoleMessage, BrowserStatus } from '../types';
import {
  X,
  RotateCw,
  Terminal,
  Activity,
  ShieldCheck,
  ShieldAlert,
  Download,
  AlertTriangle,
  Info,
  Bug,
  Clock,
  Server,
} from 'lucide-react';

interface DevConsoleDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  status: BrowserStatus;
  latencyMs: number | null;
  fps: number;
  isConnected: boolean;
  isUsingFallback: boolean;
  consoleLogs: ConsoleMessage[];
  onResetSession: () => void;
  onReload: () => void;
  onCaptureScreenshot: () => void;
}

export const DevConsoleDrawer: React.FC<DevConsoleDrawerProps> = ({
  isOpen,
  onClose,
  status,
  latencyMs,
  fps,
  isConnected,
  isUsingFallback,
  consoleLogs,
  onResetSession,
  onReload,
  onCaptureScreenshot,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-y-0 right-0 w-full sm:w-96 bg-slate-900 border-l border-slate-800 shadow-2xl z-40 flex flex-col animate-in slide-in-from-right duration-200">
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-3 border-b border-slate-800 bg-slate-900/90">
        <div className="flex items-center gap-2">
          <Terminal className="w-4 h-4 text-sky-400" />
          <h3 className="font-semibold text-slate-100 text-sm">開発コンソール & 診断</h3>
        </div>
        <button
          onClick={onClose}
          className="p-1 rounded text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
        >
          <X className="w-4 h-4" />
        </button>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {/* Stream Metrics Card */}
        <div className="p-3 rounded-lg bg-slate-950/70 border border-slate-800 space-y-2 text-xs">
          <div className="flex items-center justify-between font-medium text-slate-300">
            <span className="flex items-center gap-1.5">
              <Activity className="w-3.5 h-3.5 text-sky-400" />
              <span>ストリーミング状態</span>
            </span>
            <span
              className={`px-1.5 py-0.5 rounded text-[10px] font-mono ${
                isConnected
                  ? 'bg-emerald-500/20 text-emerald-300'
                  : isUsingFallback
                  ? 'bg-amber-500/20 text-amber-300'
                  : 'bg-rose-500/20 text-rose-300'
              }`}
            >
              {isConnected ? 'WebSocket' : isUsingFallback ? 'HTTP Polling' : 'Disconnected'}
            </span>
          </div>

          <div className="grid grid-cols-2 gap-2 pt-1 font-mono text-[11px] text-slate-400">
            <div>
              <span className="text-slate-500 block">フレームレート:</span>
              <span className="text-slate-200 text-xs font-semibold">{fps} FPS</span>
            </div>
            <div>
              <span className="text-slate-500 block">RTT 往復遅延:</span>
              <span className="text-slate-200 text-xs font-semibold">
                {latencyMs !== null ? `${latencyMs} ms` : '計測中...'}
              </span>
            </div>
            <div>
              <span className="text-slate-500 block">解像度:</span>
              <span className="text-slate-200 text-xs">
                {status.viewport.width} × {status.viewport.height}
              </span>
            </div>
            <div>
              <span className="text-slate-500 block">JPEG品質:</span>
              <span className="text-slate-200 text-xs">{status.quality}%</span>
            </div>
          </div>
        </div>

        {/* Remote Page Info */}
        <div className="p-3 rounded-lg bg-slate-950/70 border border-slate-800 space-y-2 text-xs">
          <div className="font-medium text-slate-300 flex items-center justify-between">
            <span className="flex items-center gap-1.5">
              <Server className="w-3.5 h-3.5 text-indigo-400" />
              <span>対象ページ情報</span>
            </span>
            {status.sslSecure ? (
              <span className="flex items-center gap-1 text-emerald-400 text-[11px]">
                <ShieldCheck className="w-3 h-3" />
                <span>SSL保護</span>
              </span>
            ) : (
              <span className="flex items-center gap-1 text-amber-400 text-[11px]">
                <ShieldAlert className="w-3 h-3" />
                <span>非暗号化</span>
              </span>
            )}
          </div>

          <div className="space-y-1.5 text-[11px]">
            <div>
              <span className="text-slate-500">タイトル:</span>
              <p className="text-slate-200 font-medium truncate">{status.title}</p>
            </div>
            <div>
              <span className="text-slate-500">URL:</span>
              <p className="text-slate-300 font-mono break-all line-clamp-2">{status.url}</p>
            </div>
            <div className="flex items-center gap-1 text-slate-500 text-[10px]">
              <Clock className="w-3 h-3" />
              <span>稼働時間: {status.uptime}秒</span>
            </div>
          </div>
        </div>

        {/* Actions */}
        <div className="grid grid-cols-2 gap-2">
          <button
            onClick={onCaptureScreenshot}
            className="p-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-medium flex items-center justify-center gap-1.5 border border-slate-700 transition-colors"
          >
            <Download className="w-3.5 h-3.5 text-sky-400" />
            <span>スクショ保存</span>
          </button>
          <button
            onClick={onResetSession}
            className="p-2 rounded-lg bg-rose-500/10 hover:bg-rose-500/20 text-rose-300 text-xs font-medium flex items-center justify-center gap-1.5 border border-rose-500/30 transition-colors"
          >
            <RotateCw className="w-3.5 h-3.5" />
            <span>ブラウザ再起動</span>
          </button>
        </div>

        {/* Remote Console Output Logs */}
        <div className="space-y-1.5">
          <div className="flex items-center justify-between text-xs font-medium text-slate-300">
            <span className="flex items-center gap-1.5">
              <Bug className="w-3.5 h-3.5 text-amber-400" />
              <span>ページコンソールログ ({consoleLogs.length})</span>
            </span>
          </div>

          <div className="h-60 bg-slate-950 border border-slate-800 rounded-lg p-2 overflow-y-auto font-mono text-[11px] space-y-1">
            {consoleLogs.length === 0 ? (
              <div className="h-full flex items-center justify-center text-slate-600">
                ログはありません
              </div>
            ) : (
              consoleLogs.map((log, index) => {
                const isErr = log.type === 'error';
                const isWarn = log.type === 'warning' || log.type === 'warn';
                return (
                  <div
                    key={index}
                    className={`flex items-start gap-1.5 p-1 rounded ${
                      isErr
                        ? 'bg-rose-950/40 text-rose-300'
                        : isWarn
                        ? 'bg-amber-950/40 text-amber-300'
                        : 'text-slate-400'
                    }`}
                  >
                    {isErr ? (
                      <AlertTriangle className="w-3 h-3 text-rose-400 shrink-0 mt-0.5" />
                    ) : (
                      <Info className="w-3 h-3 text-slate-500 shrink-0 mt-0.5" />
                    )}
                    <span className="break-all">{log.text}</span>
                  </div>
                );
              })
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
