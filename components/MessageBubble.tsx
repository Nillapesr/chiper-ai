'use client';

import React, { useState } from 'react';
import { Copy, Check } from 'lucide-react';
import ReactMarkdown from 'react-markdown';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { atomDark } from 'react-syntax-highlighter/dist/cjs/styles/prism';
import { ChatMessage } from '@/lib/api';

export default function MessageBubble({ message }: { message: ChatMessage }) {
  const [copied, setCopied] = useState(false);

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const isUser = message.role === 'user';

  return (
    <div className={`flex ${isUser ? 'justify-end' : 'justify-start'} animate-slide-in`}>
      <div
        className={`max-w-md lg:max-w-2xl px-4 py-3 rounded-lg ${
          isUser
            ? 'bg-gradient-to-r from-indigo-600 to-purple-600 text-white'
            : 'bg-slate-800/50 border border-indigo-500/30 text-slate-100'
        }`}
      >
        {/* User Message */}
        {isUser && (
          <div>
            <p className="whitespace-pre-wrap break-words">{message.content}</p>
            
            {message.images && message.images.length > 0 && (
              <div className="mt-3 space-y-2">
                {message.images.map((img, idx) => (
                  <div key={idx} className="relative">
                    <img
                      src={img}
                      alt={`Uploaded ${idx}`}
                      className="max-w-xs rounded-lg"
                    />
                  </div>
                ))}
              </div>
            )}
            
            {message.files && message.files.length > 0 && (
              <div className="mt-3 space-y-1">
                {message.files.map((file, idx) => (
                  <div key={idx} className="text-sm opacity-80 flex items-center gap-2">
                    📎 {file.name}
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Assistant Message */}
        {!isUser && (
          <div className="prose prose-invert max-w-none text-sm">
            <ReactMarkdown
              components={{
                code({ node, inline, className, children, ...props }: any) {
                  const match = /language-(\w+)/.exec(className || '');
                  const language = match ? match[1] : '';
                  const content = String(children).replace(/\n$/, '');

                  if (!inline && language) {
                    return (
                      <div className="relative my-3 rounded-lg overflow-hidden bg-slate-900">
                        <button
                          onClick={() => copyToClipboard(content)}
                          className="absolute top-2 right-2 p-1.5 bg-slate-700 hover:bg-slate-600 rounded transition-colors z-10"
                          title="Copy code"
                        >
                          {copied ? (
                            <Check size={16} className="text-green-400" />
                          ) : (
                            <Copy size={16} className="text-slate-300" />
                          )}
                        </button>
                        <SyntaxHighlighter
                          language={language}
                          style={atomDark}
                          customStyle={{
                            margin: 0,
                            padding: '16px',
                            background: 'transparent',
                          }}
                        >
                          {content}
                        </SyntaxHighlighter>
                      </div>
                    );
                  }

                  return (
                    <code className="bg-slate-900 px-1.5 py-0.5 rounded text-amber-300 text-xs" {...props}>
                      {children}
                    </code>
                  );
                },
                a({ href, children }: any) {
                  return (
                    <a href={href} target="_blank" rel="noopener noreferrer" className="text-indigo-300 hover:text-indigo-200 underline">
                      {children}
                    </a>
                  );
                },
                p({ children }: any) {
                  return <p className="my-2">{children}</p>;
                },
                h1({ children }: any) {
                  return <h1 className="text-lg font-bold my-2">{children}</h1>;
                },
                h2({ children }: any) {
                  return <h2 className="text-base font-bold my-2">{children}</h2>;
                },
                h3({ children }: any) {
                  return <h3 className="text-sm font-bold my-1">{children}</h3>;
                },
                ul({ children }: any) {
                  return <ul className="list-disc list-inside my-2 space-y-1">{children}</ul>;
                },
                ol({ children }: any) {
                  return <ol className="list-decimal list-inside my-2 space-y-1">{children}</ol>;
                },
                li({ children }: any) {
                  return <li className="text-sm">{children}</li>;
                },
              }}
            >
              {message.content}
            </ReactMarkdown>
          </div>
        )}

        <div className={`text-xs mt-2 ${isUser ? 'text-indigo-100' : 'text-slate-400'}`}>
          {message.timestamp.toLocaleTimeString()}
        </div>
      </div>
    </div>
  );
}
