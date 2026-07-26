'use client';

import React from 'react';
import { AI_MODELS } from '@/lib/api';

export default function ModelSelector({
  selectedModel,
  onModelChange,
}: {
  selectedModel: keyof typeof AI_MODELS;
  onModelChange: (model: keyof typeof AI_MODELS) => void;
}) {
  return (
    <div>
      <label className="block text-sm font-semibold mb-3 text-indigo-300">
        🤖 AI Model
      </label>
      <select
        value={selectedModel}
        onChange={(e) => onModelChange(e.target.value as keyof typeof AI_MODELS)}
        className="w-full px-3 py-2 bg-slate-800/50 border border-indigo-500/30 rounded-lg text-slate-100 text-sm focus:outline-none focus:border-indigo-500/60 transition-colors"
      >
        {Object.entries(AI_MODELS).map(([key, label]) => (
          <option key={key} value={key}>
            {label}
          </option>
        ))}
      </select>
      <p className="text-xs text-slate-400 mt-2">
        Available: Claude Opus & Sonnet models
      </p>
    </div>
  );
}
