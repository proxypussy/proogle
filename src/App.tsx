import React, { useState } from 'react';
import { useRemoteBrowser } from './hooks/useRemoteBrowser';
import { useScreenRecorder } from './hooks/useScreenRecorder';
import { BrowserAddressBar } from './components/BrowserAddressBar';
import { RemoteViewport } from './components/RemoteViewport';
import { VirtualInputBar } from './components/VirtualInputBar';
import { QuickLauncher } from './components/QuickLauncher';
import { DevConsoleDrawer } from './components/DevConsoleDrawer';
import { RecordingModal } from './components/RecordingModal';
import { DEVICE_PRESETS, DevicePreset } from './types';
import { Globe, ShieldCheck } from 'lucide-react';

export default function App() {
  const {
    status,
    frameData,
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
    sendKey,
    sendText,
  } = useRemoteBrowser();

  const {
    isRecording,
    isPaused,
    formattedTime,
    recordedVideo,
    startRecording,
    pauseRecording,
    resumeRecording,
    stopRecording,
    discardRecording,
    downloadRecording,
  } = useScreenRecorder(frameData, status.viewport);

  const [currentPresetId, setCurrentPresetId] = useState<string>('desktop-standard');
  const [isVirtualInputOpen, setIsVirtualInputOpen] = useState<boolean>(true);
  const [isDevConsoleOpen, setIsDevConsoleOpen] = useState<boolean>(false);
  const [isBookmarksOpen, setIsBookmarksOpen] = useState<boolean>(false);
  const [quality, setLocalQuality] = useState<number>(70);

  const handleSelectPreset = (preset: DevicePreset) => {
    setCurrentPresetId(preset.id);
    setViewport({
      width: preset.width,
      height: preset.height,
      isMobile: preset.isMobile,
      hasTouch: preset.hasTouch,
    });
  };

  const handleChangeQuality = (q: number) => {
    setLocalQuality(q);
    setQuality(q);
  };

  const handleCaptureScreenshot = () => {
    const a = document.createElement('a');
    a.href = '/api/browser/screenshot';
    a.download = `cloudcast-screenshot-${Date.now()}.png`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  };

  return (
    <div className="flex flex-col h-screen w-screen bg-slate-950 text-slate-100 overflow-hidden select-none font-sans">
      {/* Top Browser Tab Bar */}
      <div className="flex-none bg-slate-950 border-b border-slate-900 px-3 pt-2 pb-1 flex items-center justify-between">
        <div className="flex items-center gap-2 max-w-md min-w-0">
          <div className="flex items-center gap-2 px-3 py-1 bg-slate-900 border border-slate-800 rounded-t-lg text-xs font-medium text-slate-200 truncate shadow-sm">
            <Globe className="w-3.5 h-3.5 text-sky-400 shrink-0" />
            <span className="truncate max-w-[220px]">{status.title || '新しいタブ'}</span>
            {status.sslSecure && (
              <ShieldCheck className="w-3 h-3 text-emerald-400 shrink-0 ml-1" />
            )}
          </div>
        </div>

        <div className="flex items-center gap-3 text-xs text-slate-400">
          <span className="hidden sm:inline font-mono text-[11px] text-slate-500">
            CloudCast Remote Browser
          </span>
        </div>
      </div>

      {/* Browser Address & Control Bar */}
      <BrowserAddressBar
        status={status}
        latencyMs={latencyMs}
        fps={fps}
        isConnected={isConnected}
        isUsingFallback={isUsingFallback}
        onNavigate={navigate}
        onBack={goBack}
        onForward={goForward}
        onReload={reload}
        onSelectPreset={handleSelectPreset}
        currentPresetId={currentPresetId}
        onToggleVirtualInput={() => setIsVirtualInputOpen((prev) => !prev)}
        isVirtualInputOpen={isVirtualInputOpen}
        onToggleDevConsole={() => setIsDevConsoleOpen((prev) => !prev)}
        isDevConsoleOpen={isDevConsoleOpen}
        onCaptureScreenshot={handleCaptureScreenshot}
        quality={quality}
        onChangeQuality={handleChangeQuality}
        onOpenBookmarks={() => setIsBookmarksOpen(true)}
        isRecording={isRecording}
        isPaused={isPaused}
        recordingTime={formattedTime}
        onStartRecording={startRecording}
        onPauseRecording={pauseRecording}
        onResumeRecording={resumeRecording}
        onStopRecording={stopRecording}
      />

      {/* Interactive Remote Viewport Canvas */}
      <main className="flex-1 relative flex items-center justify-center overflow-hidden bg-slate-950">
        <RemoteViewport
          frameData={frameData}
          viewport={status.viewport}
          isLoading={status.isLoading}
          onSendMouse={sendMouse}
          onSendKey={sendKey}
          onSendText={sendText}
          onReload={reload}
          isRecording={isRecording}
        />
      </main>

      {/* Floating or Docked Japanese & Text Input Assistant */}
      <VirtualInputBar
        isOpen={isVirtualInputOpen}
        onClose={() => setIsVirtualInputOpen(false)}
        onSendText={sendText}
        onSendKey={sendKey}
      />

      {/* Bookmarks Modal */}
      <QuickLauncher
        isOpen={isBookmarksOpen}
        onClose={() => setIsBookmarksOpen(false)}
        onSelectUrl={navigate}
      />

      {/* DevConsole / Diagnostics Drawer */}
      <DevConsoleDrawer
        isOpen={isDevConsoleOpen}
        onClose={() => setIsDevConsoleOpen(false)}
        status={status}
        latencyMs={latencyMs}
        fps={fps}
        isConnected={isConnected}
        isUsingFallback={isUsingFallback}
        consoleLogs={consoleLogs}
        onResetSession={resetSession}
        onReload={reload}
        onCaptureScreenshot={handleCaptureScreenshot}
      />

      {/* Screen Recording Preview & Download Modal */}
      <RecordingModal
        recordedVideo={recordedVideo}
        onClose={discardRecording}
        onDownload={downloadRecording}
        onDiscard={discardRecording}
      />
    </div>
  );
}
