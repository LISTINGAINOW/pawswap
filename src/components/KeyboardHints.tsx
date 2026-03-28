'use client';

import { useEffect, useState } from 'react';

interface Props {
  onLeft: () => void;
  onRight: () => void;
  onInfo: () => void;
  onUndo: () => void;
  enabled: boolean;
}

export default function KeyboardHints({ onLeft, onRight, onInfo, onUndo, enabled }: Props) {
  const [showHints, setShowHints] = useState(false);
  const [isMobile, setIsMobile] = useState(true);

  useEffect(() => {
    setIsMobile('ontouchstart' in window);
  }, []);

  useEffect(() => {
    if (!enabled || isMobile) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.target instanceof HTMLInputElement || e.target instanceof HTMLTextAreaElement) return;
      
      switch (e.key) {
        case 'ArrowLeft':
          e.preventDefault();
          onLeft();
          break;
        case 'ArrowRight':
          e.preventDefault();
          onRight();
          break;
        case 'ArrowUp':
        case 'i':
          e.preventDefault();
          onInfo();
          break;
        case 'z':
          if (e.metaKey || e.ctrlKey) {
            e.preventDefault();
            onUndo();
          }
          break;
        case '?':
          setShowHints((prev) => !prev);
          break;
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [enabled, isMobile, onLeft, onRight, onInfo, onUndo]);

  if (isMobile || !showHints) return null;

  return (
    <div className="fixed bottom-20 left-1/2 z-30 -translate-x-1/2 animate-fade-in rounded-2xl border border-sage-200 bg-white/95 px-6 py-4 shadow-lg backdrop-blur-sm">
      <div className="mb-2 flex items-center justify-between">
        <h3 className="text-sm font-bold text-gray-700">Keyboard Shortcuts</h3>
        <button type="button" onClick={() => setShowHints(false)} className="text-xs text-gray-400 hover:text-gray-600">close</button>
      </div>
      <div className="grid grid-cols-2 gap-x-8 gap-y-1 text-sm text-gray-500">
        <span><kbd className="rounded bg-gray-100 px-1.5 py-0.5 text-xs font-mono">←</kbd> Skip</span>
        <span><kbd className="rounded bg-gray-100 px-1.5 py-0.5 text-xs font-mono">→</kbd> Save</span>
        <span><kbd className="rounded bg-gray-100 px-1.5 py-0.5 text-xs font-mono">↑</kbd> Details</span>
        <span><kbd className="rounded bg-gray-100 px-1.5 py-0.5 text-xs font-mono">⌘Z</kbd> Undo</span>
      </div>
      <p className="mt-2 text-center text-xs text-gray-400">Press <kbd className="rounded bg-gray-100 px-1 py-0.5 text-xs font-mono">?</kbd> to toggle</p>
    </div>
  );
}
