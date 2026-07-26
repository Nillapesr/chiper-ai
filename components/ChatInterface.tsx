'use client';

import React, { useState, useRef, useEffect } from 'react';
import { Send, Upload, Image, Code, Trash2, Copy, Check } from 'lucide-react';
import { sendMessage, uploadImage, AI_MODELS, ChatMessage, AIResponse } from '@/lib/api';
import ReactMarkdown from 'react-markdown';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { atomDark } from 'react-syntax-highlighter/dist/cjs/styles/prism';
import MessageBubble from './MessageBubble';
import ModelSelector from './ModelSelector';
import WebBuilder from './WebBuilder';
import ImagePreview from './ImagePreview';

export default function ChatInterface() {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [selectedModel, setSelectedModel] = useState<keyof typeof AI_MODELS>('claude-opus-4.5');
  const [uploadedImages, setUploadedImages] = useState<string[]>([]);
  const [uploadedFiles, setUploadedFiles] = useState<File[]>([]);
  const [showWebBuilder, setShowWebBuilder] = useState(false);
  const [webPreviewCode, setWebPreviewCode] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const imageInputRef = useRef<HTMLInputElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!input.trim() && uploadedImages.length === 0 && uploadedFiles.length === 0) return;

    const userMessage: ChatMessage = {
      id: Date.now().toString(),
      role: 'user',
      content: input,
      images: uploadedImages,
      files: uploadedFiles,
      timestamp: new Date(),
    };

    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setUploadedImages([]);
    setUploadedFiles([]);
    setLoading(true);

    try {
      const response = await sendMessage(input, selectedModel, uploadedFiles, uploadedImages);
      
      const assistantMessage: ChatMessage = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: response.message,
        timestamp: response.timestamp,
      };

      setMessages(prev => [...prev, assistantMessage]);

      // Check if response contains HTML/code for web builder
      if (response.message.includes('<!DOCTYPE') || response.message.includes('<html')) {
        setWebPreviewCode(response.message);
        setShowWebBuilder(true);
      }
    } catch (error) {
      console.error('Error:', error);
      const errorMessage: ChatMessage = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: 'Sorry, there was an error processing your request. Please try again.',
        timestamp: new Date(),
      };
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setLoading(false);
    }
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.currentTarget.files;
    if (files) {
      for (let i = 0; i < files.length; i++) {
        const base64 = await uploadImage(files[i]);
        setUploadedImages(prev => [...prev, base64]);
      }
    }
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.currentTarget.files;
    if (files) {
      setUploadedFiles(prev => [...prev, ...Array.from(files)]);
    }
  };

  const clearChat = () => {
    setMessages([]);
    setUploadedImages([]);
    setUploadedFiles([]);
  };

  return (
    <div className="flex h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-indigo-900">
      {/* Sidebar */}
      <div className="w-64 bg-slate-900/50 backdrop-blur border-r border-indigo-500/20 p-4 flex flex-col">
        <h1 className="text-2xl font-bold mb-6 bg-gradient-to-r from-indigo-400 to-pink-400 bg-clip-text text-transparent">
          Cipher AI
        </h1>
        
        <div className="flex-1">
          <ModelSelector 
            selectedModel={selectedModel}
            onModelChange={setSelectedModel}
          />
          
          <button
            onClick={clearChat}
            className="w-full mt-4 px-4 py-2 bg-red-500/20 hover:bg-red-500/30 text-red-200 rounded-lg transition-colors flex items-center justify-center gap-2"
          >
            <Trash2 size={18} />
            Clear Chat
          </button>
        </div>

        <div className="text-xs text-slate-400 mt-4 p-3 bg-slate-800/50 rounded border border-slate-700">
          <p className="font-semibold mb-2">Features:</p>
          <ul className="space-y-1">
            <li>✓ Multi-model AI</li>
            <li>✓ Image & File Upload</li>
            <li>✓ Web Builder</li>
            <li>✓ Code Preview</li>
          </ul>
        </div>
      </div>

      {/* Main Chat Area */}
      <div className="flex-1 flex flex-col">
        {/* Messages */}
        <div className="flex-1 overflow-y-auto p-6 space-y-4">
          {messages.length === 0 ? (
            <div className="h-full flex items-center justify-center text-center">
              <div>
                <h2 className="text-3xl font-bold mb-2 text-indigo-300">Welcome to Cipher AI</h2>
                <p className="text-slate-400">Start a conversation or upload images and files</p>
              </div>
            </div>
          ) : (
            messages.map(message => (
              <MessageBubble key={message.id} message={message} />
            ))
          )}
          
          {loading && (
            <div className="flex justify-start">
              <div className="bg-indigo-600/20 border border-indigo-500/30 rounded-lg p-4 max-w-xs">
                <div className="flex gap-2">
                  <div className="w-2 h-2 bg-indigo-400 rounded-full animate-pulse-soft"></div>
                  <div className="w-2 h-2 bg-indigo-400 rounded-full animate-pulse-soft" style={{ animationDelay: '0.2s' }}></div>
                  <div className="w-2 h-2 bg-indigo-400 rounded-full animate-pulse-soft" style={{ animationDelay: '0.4s' }}></div>
                </div>
              </div>
            </div>
          )}
          
          <div ref={messagesEndRef} />
        </div>

        {/* Image Preview */}
        {uploadedImages.length > 0 && (
          <div className="px-6 py-3 border-t border-indigo-500/20 bg-slate-800/30">
            <div className="flex gap-2 overflow-x-auto">
              {uploadedImages.map((img, idx) => (
                <ImagePreview key={idx} image={img} />
              ))}
            </div>
          </div>
        )}

        {/* Input Area */}
        <form onSubmit={handleSendMessage} className="border-t border-indigo-500/20 p-4 bg-slate-900/30 backdrop-blur">
          <div className="flex gap-3 mb-3">
            <button
              type="button"
              onClick={() => imageInputRef.current?.click()}
              className="p-2 hover:bg-indigo-600/20 rounded-lg transition-colors"
              title="Upload image"
            >
              <Image size={20} className="text-indigo-400" />
            </button>
            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              className="p-2 hover:bg-indigo-600/20 rounded-lg transition-colors"
              title="Upload file"
            >
              <Upload size={20} className="text-indigo-400" />
            </button>
            <button
              type="button"
              onClick={() => setShowWebBuilder(!showWebBuilder)}
              className={`p-2 rounded-lg transition-colors ${
                showWebBuilder 
                  ? 'bg-indigo-600/30 text-indigo-300' 
                  : 'hover:bg-indigo-600/20'
              }`}
              title="Web builder"
            >
              <Code size={20} className="text-indigo-400" />
            </button>
          </div>

          <div className="flex gap-3">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Type your message..."
              className="flex-1 bg-slate-800/50 border border-indigo-500/30 rounded-lg px-4 py-3 text-slate-100 placeholder-slate-400 focus:outline-none focus:border-indigo-500/60 transition-colors"
              disabled={loading}
            />
            <button
              type="submit"
              disabled={loading}
              className="px-6 py-3 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 rounded-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
            >
              <Send size={18} />
              Send
            </button>
          </div>

          <input
            ref={imageInputRef}
            type="file"
            multiple
            accept="image/*"
            onChange={handleImageUpload}
            className="hidden"
          />
          <input
            ref={fileInputRef}
            type="file"
            multiple
            onChange={handleFileUpload}
            className="hidden"
          />
        </form>
      </div>

      {/* Web Builder Modal */}
      {showWebBuilder && (
        <WebBuilder 
          code={webPreviewCode}
          onClose={() => setShowWebBuilder(false)}
          onCodeChange={setWebPreviewCode}
        />
      )}
    </div>
  );
}
