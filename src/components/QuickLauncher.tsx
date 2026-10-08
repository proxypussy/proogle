import React from 'react';
import { POPULAR_BOOKMARKS, BookmarkItem } from '../types';
import { X, ExternalLink, Sparkles, Compass } from 'lucide-react';

interface QuickLauncherProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectUrl: (url: string) => void;
}

export const QuickLauncher: React.FC<QuickLauncherProps> = ({
  isOpen,
  onClose,
  onSelectUrl,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-slate-950/70 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-slate-900 border border-slate-800 rounded-xl max-w-2xl w-full shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-150">
        <div className="flex items-center justify-between px-5 py-3.5 border-b border-slate-800 bg-slate-900/90">
          <div className="flex items-center gap-2">
            <Compass className="w-5 h-5 text-sky-400" />
            <h2 className="font-semibold text-slate-100 text-sm">
              おすすめクイックアクセス・ブックマーク
            </h2>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-md text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <div className="p-5 max-h-[75vh] overflow-y-auto space-y-4">
          <p className="text-xs text-slate-400">
            ワンタップでサーバー上のChromiumでページを開きます。検索や閲覧、インタラクションをお試しください。
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
            {POPULAR_BOOKMARKS.map((bookmark: BookmarkItem) => (
              <button
                key={bookmark.url}
                onClick={() => {
                  onSelectUrl(bookmark.url);
                  onClose();
                }}
                className="flex items-start gap-3 p-3 rounded-lg bg-slate-950/60 border border-slate-800/80 hover:border-sky-500/50 hover:bg-slate-800/40 text-left transition-all group"
              >
                <div
                  className={`w-9 h-9 rounded-lg flex items-center justify-center shrink-0 text-sm font-semibold ${bookmark.iconBg}`}
                >
                  {bookmark.title.slice(0, 2)}
                </div>
                <div className="min-w-0 flex-1">
                  <div className="flex items-center justify-between">
                    <span className="font-medium text-slate-200 text-sm truncate group-hover:text-sky-300 transition-colors">
                      {bookmark.title}
                    </span>
                    <ExternalLink className="w-3.5 h-3.5 text-slate-500 group-hover:text-sky-400 shrink-0 ml-1 transition-colors" />
                  </div>
                  <div className="flex items-center gap-1.5 mt-0.5 text-xs text-slate-400">
                    <span>{bookmark.category}</span>
                    <span aria-hidden="true">·</span>
                    <span className="truncate text-slate-500 font-mono text-[11px]">{new URL(bookmark.url).hostname}</span>
                  </div>
                </div>
              </button>
            ))}
          </div>

          <div className="mt-4 p-3 rounded-lg bg-slate-950/40 border border-slate-800 text-xs text-slate-400 flex items-start gap-2.5">
            <Sparkles className="w-4 h-4 text-sky-400 shrink-0 mt-0.5" />
            <div>
              <span className="font-medium text-slate-300">クラウドストリーミングの特徴:</span>
              <p className="mt-0.5 text-slate-400">
                お使いの端末には動画/画像ストリームのみが送信されるため、安全に任意のWebページをプレビュー・操作できます。日本語フォント (Noto CJK) もサーバー上で綺麗にレンダリングされます。
              </p>
            </div>
          </div>
        </div>

        <div className="px-5 py-3 border-t border-slate-800 bg-slate-950/50 flex justify-end">
          <button
            onClick={onClose}
            className="px-4 py-1.5 text-xs font-medium rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 transition-colors"
          >
            閉じる
          </button>
        </div>
      </div>
    </div>
  );
};
