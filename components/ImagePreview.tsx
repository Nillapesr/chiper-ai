'use client';

import React, { useState } from 'react';
import { X } from 'lucide-react';

export default function ImagePreview({ image }: { image: string }) {
  const [showFull, setShowFull] = useState(false);

  return (
    <>
      <div className="relative group cursor-pointer" onClick={() => setShowFull(true)}>
        <img
          src={image}
          alt="Preview"
          className="h-20 w-20 object-cover rounded-lg border border-indigo-500/30 hover:border-indigo-500/60 transition-colors"
        />
        <div className="absolute inset-0 bg-black/0 group-hover:bg-black/30 rounded-lg transition-colors flex items-center justify-center">
          <span className="text-white text-sm opacity-0 group-hover:opacity-100 transition-opacity">View</span>
        </div>
      </div>

      {showFull && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4" onClick={() => setShowFull(false)}>
          <div className="relative max-w-2xl max-h-[80vh]" onClick={(e) => e.stopPropagation()}>
            <img src={image} alt="Full preview" className="max-w-full max-h-[80vh] rounded-lg" />
            <button
              onClick={() => setShowFull(false)}
              className="absolute top-4 right-4 p-2 bg-red-600 hover:bg-red-700 rounded-lg transition-colors"
            >
              <X size={20} />
            </button>
          </div>
        </div>
      )}
    </>
  );
}
