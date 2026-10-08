import React, { useState, useEffect, useRef } from 'react';
import {
  ArrowLeft,
  ArrowRight,
  RotateCw,
  X,
  Lock,
  Globe,
  Monitor,
  Smartphone,
  Tablet,
  Keyboard,
  Terminal,
  Download,
  Sliders,
  Sparkles,
  Circle,
  Square,
  Pause,
  Play,
  Video,
} from 'lucide-react';
import { BrowserStatus, DEVICE_PRESETS, DevicePreset } from '../types';

interface BrowserAddressBarProps {
  status: BrowserStatus;
  latencyMs: number | null;
  fps: number;
  isConnected: boolean;
  isUsingFallback: boolean;
  onNavigate: (url: string) => void;
  onBack: () => void;
  onForward: () => void;
  onReload: () => void;
  onSelectPreset: (preset: DevicePreset) => void;
  currentPresetId: string;
  onToggleVirtualInput: () => void;
  isVirtualInputOpen: boolean;
  onToggleDevConsole: () => void;
  isDevConsoleOpen: boolean;
  onCaptureScreenshot: () => void;
  quality: number;
  onChangeQuality: (q: number) => void;
  onOpenBookmarks: () => void;
  isRecording: boolean;
  isPaused: boolean;
  recordingTime: string;
  onStartRecording: () => void;
  onPauseRecording: () => void;
  onResumeRecording: () => void;
  onStopRecording: () => void;
}

export const BrowserAddressBar: React.FC<BrowserAddressBarProps> = ({
  status,
  latencyMs,
  fps,
  isConnected,
  isUsingFallback,
  onNavigate,
  onBack,
  onForward,
  onReload,
  onSelectPreset,
  currentPresetId,
  onToggleVirtualInput,
  isVirtualInputOpen,
  onToggleDevConsole,
  isDevConsoleOpen,
  onCaptureScreenshot,
  quality,
  onChangeQuality,
  onOpenBookmarks,
  isRecording,
  isPaused,
  recordingTime,
  onStartRecording,
  onPauseRecording,
  onResumeRecording,
  onStopRecording,
}) => {
  const [inputUrl, setInputUrl] = useState(status.url);
  const [isFocused, setIsFocused] = useState(false);
  const [showQualityMenu, setShowQualityMenu] = useState(false);
  const [showDeviceMenu, setShowDeviceMenu] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (!isFocused) {
      setInputUrl(status.url);
    }
  }, [status.url, isFocused]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (inputUrl.trim()) {
      onNavigate(inputUrl.trim());
      inputRef.current?.blur();
    }
  };

  const currentPreset = DEVICE_PRESETS.find((p) => p.id === currentPresetId) || DEVICE_PRESETS[0];

  return (
    <header className="flex-none bg-slate-900/90 border-b border-slate-800 backdrop-blur-md z-30 select-none">
      {/* Top Chrome Bar */}
      <div className="flex items-center justify-between px-3 py-2 gap-2 max-w-full overflow-x-auto">
        {/* Navigation History & Controls */}
        <div className="flex items-center gap-1">
          <button
            onClick={onBack}
            disabled={!status.canGoBack}
            title="戻る (Back)"
            className="p-1.5 rounded-md text-slate-300 hover:text-white hover:bg-slate-800 disabled:opacity-30 disabled:hover:bg-transparent transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
          </button>
          <button
            onClick={onForward}
            disabled={!status.canGoForward}
            title="進む (Forward)"
            className="p-1.5 rounded-md text-slate-300 hover:text-white hover:bg-slate-800 disabled:opacity-30 disabled:hover:bg-transparent transition-colors"
          >
            <ArrowRight className="w-4 h-4" />
          </button>
          <button
            onClick={onReload}
            title={status.isLoading ? '再読み込み中' : '再読み込み (Reload)'}
            className={`p-1.5 rounded-md text-slate-300 hover:text-white hover:bg-slate-800 transition-colors ${
              status.isLoading ? 'animate-spin text-sky-400' : ''
            }`}
          >
            <RotateCw className="w-4 h-4" />
          </button>
          <button
            onClick={onOpenBookmarks}
            title="おすすめサイト・ブックマーク"
            className="px-2 py-1 text-xs font-medium rounded-md text-slate-300 hover:text-white hover:bg-slate-800 flex items-center gap-1 transition-colors"
          >
            <Sparkles className="w-3.5 h-3.5 text-amber-400" />
            <span className="hidden sm:inline">ブックマーク</span>
          </button>
        </div>

        {/* Omnibar / Address Field */}
        <form onSubmit={handleSubmit} className="flex-1 min-w-[200px] max-w-3xl relative">
          <div
            className={`flex items-center w-full px-3 py-1.5 bg-slate-950/80 border rounded-lg transition-all ${
              isFocused
                ? 'border-sky-500/80 ring-2 ring-sky-500/20 shadow-lg'
                : 'border-slate-800 hover:border-slate-700'
            }`}
          >
            {status.sslSecure ? (
              <span title="保護された通信 (HTTPS)" className="mr-2 shrink-0 flex items-center">
                <Lock className="w-3.5 h-3.5 text-emerald-400" />
              </span>
            ) : (
              <span title="標準接続 (HTTP)" className="mr-2 shrink-0 flex items-center">
                <Globe className="w-3.5 h-3.5 text-slate-400" />
              </span>
            )}

            <input
              ref={inputRef}
              type="text"
              value={inputUrl}
              onChange={(e) => setInputUrl(e.target.value)}
              onFocus={() => {
                setIsFocused(true);
                inputRef.current?.select();
              }}
              onBlur={() => setIsFocused(false)}
              placeholder="URLを入力、または検索語句を入力..."
              className="w-full bg-transparent text-sm text-slate-100 placeholder:text-slate-500 focus:outline-none font-mono tracking-tight"
            />

            {inputUrl && (
              <button
                type="button"
                onClick={() => {
                  setInputUrl('');
                  inputRef.current?.focus();
                }}
                className="p-0.5 text-slate-500 hover:text-slate-300 ml-1 rounded transition-colors"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            )}

            <button
              type="submit"
              className="ml-2 px-2.5 py-0.5 text-xs font-medium rounded bg-sky-600 hover:bg-sky-500 text-white shrink-0 shadow-sm transition-colors"
            >
              開く
            </button>
          </div>
        </form>

        {/* Right Action Toolbar */}
        <div className="flex items-center gap-1.5 shrink-0">
          {/* Virtual Japanese IME / Keyboard Assistant Toggle */}
          <button
            onClick={onToggleVirtualInput}
            title="文字・日本語入力アシスタント"
            className={`px-2 py-1 text-xs font-medium rounded-md border flex items-center gap-1 transition-all ${
              isVirtualInputOpen
                ? 'bg-sky-500/20 border-sky-500/50 text-sky-300'
                : 'bg-slate-800/80 border-slate-700 text-slate-300 hover:text-white hover:bg-slate-800'
            }`}
          >
            <Keyboard className="w-3.5 h-3.5" />
            <span className="hidden md:inline">文字入力</span>
          </button>

          {/* Device Preset Switcher */}
          <div className="relative">
            <button
              onClick={() => setShowDeviceMenu(!showDeviceMenu)}
              title="端末・解像度切り替え"
              className="px-2 py-1 text-xs font-medium rounded-md bg-slate-800/80 border border-slate-700 text-slate-300 hover:text-white hover:bg-slate-800 flex items-center gap-1 transition-colors"
            >
              {currentPreset.isMobile ? (
                <Smartphone className="w-3.5 h-3.5 text-sky-400" />
              ) : currentPreset.id === 'tablet' ? (
                <Tablet className="w-3.5 h-3.5 text-indigo-400" />
              ) : (
                <Monitor className="w-3.5 h-3.5 text-emerald-400" />
              )}
              <span className="hidden lg:inline">{currentPreset.name.split(' ')[0]}</span>
            </button>

            {showDeviceMenu && (
              <div
                className="absolute right-0 top-full mt-1.5 w-52 bg-slate-900 border border-slate-800 rounded-lg shadow-2xl p-1 z-50 text-xs"
                onMouseLeave={() => setShowDeviceMenu(false)}
              >
                <div className="px-2 py-1 text-[11px] font-semibold text-slate-400 border-b border-slate-800">
                  表示端末・解像度
                </div>
                {DEVICE_PRESETS.map((p) => (
                  <button
                    key={p.id}
                    onClick={() => {
                      onSelectPreset(p);
                      setShowDeviceMenu(false);
                    }}
                    className={`w-full text-left px-2.5 py-1.5 rounded-md flex items-center justify-between transition-colors ${
                      p.id === currentPresetId
                        ? 'bg-sky-500/20 text-sky-300 font-medium'
                        : 'text-slate-300 hover:bg-slate-800 hover:text-white'
                    }`}
                  >
                    <span className="flex items-center gap-2">
                      {p.isMobile ? (
                        <Smartphone className="w-3.5 h-3.5" />
                      ) : p.id === 'tablet' ? (
                        <Tablet className="w-3.5 h-3.5" />
                      ) : (
                        <Monitor className="w-3.5 h-3.5" />
                      )}
                      <span>{p.name}</span>
                    </span>
                    <span className="text-[10px] text-slate-500 font-mono">
                      {p.width}×{p.height}
                    </span>
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Quality Switcher */}
          <div className="relative">
            <button
              onClick={() => setShowQualityMenu(!showQualityMenu)}
              title="画質設定"
              className="p-1.5 rounded-md bg-slate-800/80 border border-slate-700 text-slate-300 hover:text-white hover:bg-slate-800 transition-colors"
            >
              <Sliders className="w-3.5 h-3.5" />
            </button>

            {showQualityMenu && (
              <div
                className="absolute right-0 top-full mt-1.5 w-44 bg-slate-900 border border-slate-800 rounded-lg shadow-2xl p-1 z-50 text-xs"
                onMouseLeave={() => setShowQualityMenu(false)}
              >
                <div className="px-2 py-1 text-[11px] font-semibold text-slate-400 border-b border-slate-800">
                  ストリーミング画質
                </div>
                {[
                  { label: '最高画質 (85%)', val: 85 },
                  { label: '標準 (70%)', val: 70 },
                  { label: '省データ (45%)', val: 45 },
                ].map((item) => (
                  <button
                    key={item.val}
                    onClick={() => {
                      onChangeQuality(item.val);
                      setShowQualityMenu(false);
                    }}
                    className={`w-full text-left px-2.5 py-1.5 rounded-md flex items-center justify-between transition-colors ${
                      quality === item.val
                        ? 'bg-sky-500/20 text-sky-300 font-medium'
                        : 'text-slate-300 hover:bg-slate-800 hover:text-white'
                    }`}
                  >
                    <span>{item.label}</span>
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Screen Recording Controls */}
          {isRecording ? (
            <div className="flex items-center gap-1 bg-rose-950/70 border border-rose-500/60 rounded-md p-0.5 shadow-sm shadow-rose-950">
              <div className="flex items-center gap-1.5 px-2 py-0.5 text-xs font-mono text-rose-200 font-medium">
                <span className="w-2 h-2 rounded-full bg-rose-500 animate-pulse shadow-[0_0_8px_rgba(244,63,94,0.9)]" />
                <span>{recordingTime}</span>
              </div>
              {isPaused ? (
                <button
                  type="button"
                  onClick={onResumeRecording}
                  title="録画を再開"
                  className="p-1 rounded text-rose-300 hover:text-white hover:bg-rose-900/60 transition-colors"
                >
                  <Play className="w-3.5 h-3.5 fill-current" />
                </button>
              ) : (
                <button
                  type="button"
                  onClick={onPauseRecording}
                  title="録画を一時停止"
                  className="p-1 rounded text-rose-300 hover:text-white hover:bg-rose-900/60 transition-colors"
                >
                  <Pause className="w-3.5 h-3.5" />
                </button>
              )}
              <button
                type="button"
                onClick={onStopRecording}
                title="録画を停止して動画をプレビュー"
                className="px-2 py-0.5 text-xs font-semibold rounded bg-rose-600 hover:bg-rose-500 text-white flex items-center gap-1 shadow-sm transition-colors"
              >
                <Square className="w-3 h-3 fill-current" />
                <span>停止</span>
              </button>
            </div>
          ) : (
            <button
              type="button"
              onClick={onStartRecording}
              title="ライブビューの画面録画を開始 (MP4/WebM動画として保存)"
              className="px-2 py-1 text-xs font-medium rounded-md bg-slate-800/80 border border-slate-700 text-slate-300 hover:text-rose-300 hover:border-rose-500/40 hover:bg-slate-800 flex items-center gap-1.5 transition-all group"
            >
              <span className="w-2 h-2 rounded-full bg-rose-500 group-hover:shadow-[0_0_8px_rgba(244,63,94,0.8)] transition-shadow" />
              <span className="hidden sm:inline">画面録画</span>
            </button>
          )}

          {/* Screenshot capture */}
          <button
            onClick={onCaptureScreenshot}
            title="画面静止画キャプチャをダウンロード"
            className="p-1.5 rounded-md bg-slate-800/80 border border-slate-700 text-slate-300 hover:text-white hover:bg-slate-800 transition-colors"
          >
            <Download className="w-3.5 h-3.5" />
          </button>

          {/* Dev Console Drawer Toggle */}
          <button
            onClick={onToggleDevConsole}
            title="開発コンソール・情報"
            className={`p-1.5 rounded-md border transition-colors ${
              isDevConsoleOpen
                ? 'bg-sky-500/20 border-sky-500/50 text-sky-300'
                : 'bg-slate-800/80 border-slate-700 text-slate-300 hover:text-white hover:bg-slate-800'
            }`}
          >
            <Terminal className="w-3.5 h-3.5" />
          </button>

          {/* Live Streaming Status / FPS Badge */}
          <div className="flex items-center gap-1.5 px-2 py-1 bg-slate-950/60 border border-slate-800 rounded-md text-[11px] font-mono shrink-0">
            <span
              className={`w-2 h-2 rounded-full ${
                isConnected
                  ? 'bg-emerald-400 shadow-[0_0_8px_rgba(52,211,153,0.8)]'
                  : isUsingFallback
                  ? 'bg-amber-400 animate-pulse'
                  : 'bg-rose-500'
              }`}
              title={
                isConnected
                  ? 'WebSocket リアルタイム接続中'
                  : isUsingFallback
                  ? 'HTTP ポーリングモード'
                  : '切断中'
              }
            />
            <span className="text-slate-400">{fps} FPS</span>
            {latencyMs !== null && (
              <>
                <span className="text-slate-600">·</span>
                <span className="text-slate-400">{latencyMs}ms</span>
              </>
            )}
          </div>
        </div>
      </div>

      {/* Subtle Loading Progress Bar */}
      {status.isLoading && (
        <div className="h-0.5 w-full bg-slate-800 overflow-hidden relative">
          <div className="h-full bg-gradient-to-r from-sky-500 via-indigo-500 to-sky-400 animate-[loading-bar_1.2s_ease-in-out_infinite]" />
        </div>
      )}
    </header>
  );
};
