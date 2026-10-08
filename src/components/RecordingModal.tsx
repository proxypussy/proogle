import React from 'react';
import { RecordedVideoData } from '../hooks/useScreenRecorder';
import {
  X,
  Download,
  Trash2,
  Video,
  Clock,
  Maximize2,
  HardDrive,
  CheckCircle2,
} from 'lucide-react';

interface RecordingModalProps {
  recordedVideo: RecordedVideoData | null;
  onClose: () => void;
  onDownload: () => void;
  onDiscard: () => void;
}

export const RecordingModal: React.FC<RecordingModalProps> = ({
  recordedVideo,
  onClose,
  onDownload,
  onDiscard,
}) => {
  if (!recordedVideo) return null;

  const formatFileSize = (bytes: number) => {
    if (bytes < 1024 * 1024) {
      return `${(bytes / 1024).toFixed(1)} KB`;
    }
    return `${(bytes / (1024 * 1024)).toFixed(2)} MB`;
  };

  const formatTime = (secs: number) => {
    const m = Math.floor(secs / 60);
    const s = secs % 60;
    return `${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`;
  };

  return (
    <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-md z-50 flex items-center justify-center p-4">
      <div className="bg-slate-900 border border-slate-800 rounded-xl max-w-2xl w-full shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-150">
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-3.5 border-b border-slate-800 bg-slate-900/90">
          <div className="flex items-center gap-2">
            <Video className="w-5 h-5 text-rose-400" />
            <h3 className="font-semibold text-slate-100 text-sm">
              画面録画プレビュー & 保存
            </h3>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-md text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Video Player */}
        <div className="p-5 space-y-4">
          <div className="relative rounded-lg overflow-hidden bg-black border border-slate-800 aspect-video flex items-center justify-center shadow-inner">
            <video
              src={recordedVideo.url}
              controls
              autoPlay
              className="max-w-full max-h-full object-contain"
            />
          </div>

          {/* Video Metadata Cards */}
          <div className="grid grid-cols-3 gap-2 text-xs">
            <div className="p-2.5 rounded-lg bg-slate-950/60 border border-slate-800/80 flex items-center gap-2.5">
              <Clock className="w-4 h-4 text-sky-400 shrink-0" />
              <div>
                <span className="text-[10px] text-slate-500 block">録画時間</span>
                <span className="font-semibold text-slate-200 font-mono">
                  {formatTime(recordedVideo.duration)}
                </span>
              </div>
            </div>

            <div className="p-2.5 rounded-lg bg-slate-950/60 border border-slate-800/80 flex items-center gap-2.5">
              <Maximize2 className="w-4 h-4 text-emerald-400 shrink-0" />
              <div>
                <span className="text-[10px] text-slate-500 block">解像度</span>
                <span className="font-semibold text-slate-200 font-mono">
                  {recordedVideo.width} × {recordedVideo.height}
                </span>
              </div>
            </div>

            <div className="p-2.5 rounded-lg bg-slate-950/60 border border-slate-800/80 flex items-center gap-2.5">
              <HardDrive className="w-4 h-4 text-indigo-400 shrink-0" />
              <div>
                <span className="text-[10px] text-slate-500 block">ファイル容量</span>
                <span className="font-semibold text-slate-200 font-mono">
                  {formatFileSize(recordedVideo.sizeBytes)}
                </span>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2 text-xs text-slate-400 bg-slate-950/40 p-2.5 rounded-lg border border-slate-800">
            <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
            <span>
              ブラウザセッションのライブビュー画面が動画ファイル（
              {recordedVideo.mimeType.split(';')[0]}
              ）としてエンコードされました。
            </span>
          </div>
        </div>

        {/* Footer Actions */}
        <div className="px-5 py-3 border-t border-slate-800 bg-slate-950/50 flex items-center justify-between">
          <button
            onClick={() => {
              onDiscard();
              onClose();
            }}
            className="px-3.5 py-1.5 text-xs font-medium rounded-lg text-rose-300 hover:bg-rose-500/10 border border-transparent hover:border-rose-500/30 flex items-center gap-1.5 transition-colors"
          >
            <Trash2 className="w-3.5 h-3.5" />
            <span>破棄する</span>
          </button>

          <div className="flex items-center gap-2">
            <button
              onClick={onClose}
              className="px-3.5 py-1.5 text-xs font-medium rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 transition-colors"
            >
              閉じる
            </button>

            <button
              onClick={() => {
                onDownload();
              }}
              className="px-4 py-1.5 text-xs font-semibold rounded-lg bg-sky-600 hover:bg-sky-500 text-white flex items-center gap-1.5 shadow-md shadow-sky-600/20 transition-all"
            >
              <Download className="w-3.5 h-3.5" />
              <span>動画をダウンロード</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
