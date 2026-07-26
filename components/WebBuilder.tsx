'use client';

import React, { useState } from 'react';
import { X, Copy, Check } from 'lucide-react';

export default function WebBuilder({
  code,
  onClose,
  onCodeChange,
}: {
  code: string;
  onClose: () => void;
  onCodeChange: (code: string) => void;
}) {
  const [copied, setCopied] = useState(false);
  const [activeTab, setActiveTab] = useState<'preview' | 'code'>('preview');

  const copyCode = () => {
    navigator.clipboard.writeText(code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-slate-900 rounded-lg w-full max-w-4xl h-[90vh] flex flex-col border border-indigo-500/30">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-indigo-500/20">
          <h2 className="text-xl font-bold text-indigo-300">🌐 Web Builder Preview</h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-slate-800 rounded-lg transition-colors"
          >
            <X size={20} />
          </button>
        </div>

        {/* Tabs */}
        <div className="flex gap-4 px-4 pt-4 border-b border-indigo-500/20">
          <button
            onClick={() => setActiveTab('preview')}
            className={`pb-2 px-4 transition-colors ${
              activeTab === 'preview'
                ? 'text-indigo-400 border-b-2 border-indigo-400'
                : 'text-slate-400 hover:text-slate-300'
            }`}
          >
            Preview
          </button>
          <button
            onClick={() => setActiveTab('code')}
            className={`pb-2 px-4 transition-colors ${
              activeTab === 'code'
                ? 'text-indigo-400 border-b-2 border-indigo-400'
                : 'text-slate-400 hover:text-slate-300'
            }`}
          >
            Code
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-auto">
          {activeTab === 'preview' ? (
            <iframe
              srcDoc={code}
              className="w-full h-full border-none"
              sandbox="allow-scripts allow-same-origin"
            />
          ) : (
            <div className="relative p-4 h-full bg-slate-800/30">
              <button
                onClick={copyCode}
                className="absolute top-6 right-6 p-2 bg-indigo-600 hover:bg-indigo-500 rounded-lg transition-colors z-10 flex items-center gap-2"
              >
                {copied ? (
                  <>
                    <Check size={16} /> Copied!
                  </>
                ) : (
                  <>
                    <Copy size={16} /> Copy
                  </>
                )}
              </button>
              <pre className="bg-slate-900 rounded-lg p-4 text-sm text-slate-300 overflow-auto max-h-full text-wrap break-words">
                {code}
              </pre>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
