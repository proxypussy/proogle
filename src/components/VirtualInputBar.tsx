import React, { useState, useRef } from 'react';
import {
  Send,
  CornerDownLeft,
  Delete,
  ArrowUp,
  ArrowDown,
  ArrowLeft,
  ArrowRight,
  X,
  Keyboard,
  Copy,
  Check,
} from 'lucide-react';

interface VirtualInputBarProps {
  isOpen: boolean;
  onClose: () => void;
  onSendText: (text: string) => void;
  onSendKey: (event: {
    type: 'rawKeyDown' | 'keyDown' | 'keyUp' | 'char';
    key?: string;
    code?: string;
    text?: string;
    windowsVirtualKeyCode?: number;
  }) => void;
}

export const VirtualInputBar: React.FC<VirtualInputBarProps> = ({
  isOpen,
  onClose,
  onSendText,
  onSendKey,
}) => {
  const [inputText, setInputText] = useState('');
  const [copiedNotification, setCopiedNotification] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  if (!isOpen) return null;

  const handleSend = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!inputText) return;
    onSendText(inputText);
    setInputText('');
    inputRef.current?.focus();
  };

  const pressSpecialKey = (key: string, code: string, keyCode: number) => {
    onSendKey({
      type: 'keyDown',
      key,
      code,
      windowsVirtualKeyCode: keyCode,
    });
    setTimeout(() => {
      onSendKey({
        type: 'keyUp',
        key,
        code,
        windowsVirtualKeyCode: keyCode,
      });
    }, 40);
  };

  const handleSelectAll = () => {
    // Dispatch Ctrl+A
    onSendKey({
      type: 'keyDown',
      key: 'a',
      code: 'KeyA',
      windowsVirtualKeyCode: 65,
    });
    setTimeout(() => {
      onSendKey({
        type: 'keyUp',
        key: 'a',
        code: 'KeyA',
        windowsVirtualKeyCode: 65,
      });
    }, 40);
  };

  const handlePasteClipboard = async () => {
    try {
      const text = await navigator.clipboard.readText();
      if (text) {
        onSendText(text);
        setCopiedNotification(true);
        setTimeout(() => setCopiedNotification(false), 1500);
      }
    } catch (_) {
      // Fallback: focus input so user can paste manually
      inputRef.current?.focus();
    }
  };

  return (
    <div className="flex-none bg-slate-900/95 border-t border-slate-800 backdrop-blur-md p-2.5 z-30 shadow-2xl transition-all">
      <div className="max-w-4xl mx-auto space-y-2">
        {/* Main Japanese Text Input Form */}
        <form onSubmit={handleSend} className="flex items-center gap-2">
          <div className="flex items-center gap-1.5 px-2 py-1 bg-slate-950/70 border border-slate-800 rounded-md text-xs text-sky-400 shrink-0 font-medium">
            <Keyboard className="w-3.5 h-3.5" />
            <span>文字入力</span>
          </div>

          <div className="relative flex-1">
            <input
              ref={inputRef}
              type="text"
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              placeholder="日本語やテキストを入力して「送信」でフォーカス中の入力欄に入力..."
              className="w-full bg-slate-950 border border-slate-700/80 focus:border-sky-500 rounded-lg px-3 py-1.5 text-sm text-slate-100 placeholder:text-slate-500 focus:outline-none focus:ring-1 focus:ring-sky-500 shadow-inner"
            />
            {inputText && (
              <button
                type="button"
                onClick={() => setInputText('')}
                className="absolute right-2 top-1/2 -translate-y-1/2 p-0.5 text-slate-500 hover:text-slate-300"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            )}
          </div>

          <button
            type="submit"
            disabled={!inputText}
            className="px-3.5 py-1.5 text-xs font-semibold rounded-lg bg-sky-600 hover:bg-sky-500 disabled:opacity-40 text-white flex items-center gap-1.5 shadow-sm transition-colors shrink-0"
          >
            <Send className="w-3.5 h-3.5" />
            <span>送信</span>
          </button>

          <button
            type="button"
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-slate-200 rounded-md hover:bg-slate-800 transition-colors shrink-0"
            title="閉じる"
          >
            <X className="w-4 h-4" />
          </button>
        </form>

        {/* Quick Functional Keys */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-0.5 text-xs text-slate-300 select-none">
          <span className="text-[10px] text-slate-500 font-medium shrink-0 uppercase tracking-wider">
            ショートカット:
          </span>

          <button
            type="button"
            onClick={() => pressSpecialKey('Enter', 'Enter', 13)}
            className="px-2.5 py-1 bg-slate-800 hover:bg-slate-700 active:bg-slate-600 border border-slate-700 rounded text-slate-200 flex items-center gap-1 transition-colors shrink-0"
          >
            <CornerDownLeft className="w-3 h-3 text-emerald-400" />
            <span>Enter</span>
          </button>

          <button
            type="button"
            onClick={() => pressSpecialKey('Backspace', 'Backspace', 8)}
            className="px-2.5 py-1 bg-slate-800 hover:bg-slate-700 active:bg-slate-600 border border-slate-700 rounded text-slate-200 flex items-center gap-1 transition-colors shrink-0"
          >
            <Delete className="w-3 h-3 text-rose-400" />
            <span>BS</span>
          </button>

          <button
            type="button"
            onClick={() => pressSpecialKey('Tab', 'Tab', 9)}
            className="px-2 py-1 bg-slate-800 hover:bg-slate-700 active:bg-slate-600 border border-slate-700 rounded text-slate-200 transition-colors shrink-0"
          >
            Tab
          </button>

          <button
            type="button"
            onClick={() => pressSpecialKey('Escape', 'Escape', 27)}
            className="px-2 py-1 bg-slate-800 hover:bg-slate-700 active:bg-slate-600 border border-slate-700 rounded text-slate-200 transition-colors shrink-0"
          >
            Esc
          </button>

          <button
            type="button"
            onClick={() => pressSpecialKey(' ', 'Space', 32)}
            className="px-2 py-1 bg-slate-800 hover:bg-slate-700 active:bg-slate-600 border border-slate-700 rounded text-slate-200 transition-colors shrink-0"
          >
            Space
          </button>

          <div className="h-4 w-px bg-slate-800 shrink-0 mx-1" />

          {/* Directional keys */}
          <div className="flex items-center gap-1 shrink-0">
            <button
              type="button"
              onClick={() => pressSpecialKey('ArrowUp', 'ArrowUp', 38)}
              className="p-1 bg-slate-800 hover:bg-slate-700 border border-slate-700 rounded text-slate-200 transition-colors"
              title="上矢印"
            >
              <ArrowUp className="w-3 h-3" />
            </button>
            <button
              type="button"
              onClick={() => pressSpecialKey('ArrowDown', 'ArrowDown', 40)}
              className="p-1 bg-slate-800 hover:bg-slate-700 border border-slate-700 rounded text-slate-200 transition-colors"
              title="下矢印"
            >
              <ArrowDown className="w-3 h-3" />
            </button>
            <button
              type="button"
              onClick={() => pressSpecialKey('ArrowLeft', 'ArrowLeft', 37)}
              className="p-1 bg-slate-800 hover:bg-slate-700 border border-slate-700 rounded text-slate-200 transition-colors"
              title="左矢印"
            >
              <ArrowLeft className="w-3 h-3" />
            </button>
            <button
              type="button"
              onClick={() => pressSpecialKey('ArrowRight', 'ArrowRight', 39)}
              className="p-1 bg-slate-800 hover:bg-slate-700 border border-slate-700 rounded text-slate-200 transition-colors"
              title="右矢印"
            >
              <ArrowRight className="w-3 h-3" />
            </button>
          </div>

          <div className="h-4 w-px bg-slate-800 shrink-0 mx-1" />

          <button
            type="button"
            onClick={handleSelectAll}
            className="px-2 py-1 bg-slate-800 hover:bg-slate-700 border border-slate-700 rounded text-slate-200 transition-colors shrink-0"
          >
            全選択 (Ctrl+A)
          </button>

          <button
            type="button"
            onClick={handlePasteClipboard}
            className="px-2 py-1 bg-slate-800 hover:bg-slate-700 border border-slate-700 rounded text-slate-200 flex items-center gap-1 transition-colors shrink-0"
          >
            {copiedNotification ? (
              <>
                <Check className="w-3 h-3 text-emerald-400" />
                <span>貼付完了</span>
              </>
            ) : (
              <>
                <Copy className="w-3 h-3 text-sky-400" />
                <span>クリップボード貼付</span>
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};
