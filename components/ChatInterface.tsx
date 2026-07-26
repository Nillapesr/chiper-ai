'use client';

import React, { useState, useRef, useEffect } from 'react';
import { Send, Plus, Upload, Image, Trash2, Code, Loader } from 'lucide-react';
import { sendMessage, AI_MODELS, ChatMessage as Message } from '@/lib/api';
import MessageBubble from './MessageBubble';
import ModelSelector from './ModelSelector';
import WebBuilder from './WebBuilder';
import ImagePreview from './ImagePreview';
import toast from 'react-hot-toast';

export default function ChatInterface() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [selectedModel, setSelectedModel] = useState<keyof typeof AI_MODELS>('claude-opus-4.8');
  const [loading, setLoading] = useState(false);
  const [files, setFiles] = useState<File[]>([]);
  const [images, setImages] = useState<string[]>([]);
  const [showWebBuilder, setShowWebBuilder] = useState(false);
  const [webCode, setWebCode] = useState('<h1>Hello World</h1>');
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSendMessage = async () => {
    if (!input.trim() && images.length === 0) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      role: 'user',
      content: input,
      files,
      images,
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setInput('');
    setFiles([]);
    setImages([]);
    setLoading(true);

    try {
      const response = await sendMessage(input, selectedModel, files, images);
      const assistantMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: response.message,
        timestamp: response.timestamp,
      };
      setMessages((prev) => [...prev, assistantMessage]);
    } catch (error) {
      toast.error('Failed to get response from AI');
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFiles = Array.from(e.target.files || []);
    setFiles(selectedFiles);
    toast.success(`${selectedFiles.length} file(s) uploaded`);
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFiles = Array.from(e.target.files || []);
    selectedFiles.forEach((file) => {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImages((prev) => [...prev, reader.result as string]);
      };
      reader.readAsDataURL(file);
    });
  };

  const clearChat = () => {
    setMessages([]);
    setInput('');
    setFiles([]);
    setImages([]);
    toast.success('Chat cleared');
  };

  return (
    <div className="flex h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
      {/* Sidebar */}
      <div className="w-64 bg-slate-900/50 border-r border-indigo-500/20 flex flex-col p-4">
        {/* Logo */}
        <div className="mb-6 pb-6 border-b border-indigo-500/20">
          <h1 className="text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 to-purple-500">
            🔐 Cipher AI
          </h1>
          <p className="text-xs text-slate-400 mt-1">Multi-model AI Chat</p>
        </div>

        {/* Model Selector */}
        <ModelSelector selectedModel={selectedModel} onModelChange={setSelectedModel} />

        {/* Actions */}
        <div className="mt-8 space-y-2">
          <button
            onClick={() => setShowWebBuilder(true)}
            className="w-full flex items-center gap-2 px-3 py-2 rounded-lg bg-indigo-600/20 hover:bg-indigo-600/30 text-indigo-300 text-sm transition-colors"
          >
            <Code size={16} /> Web Builder
          </button>
          <button
            onClick={clearChat}
            className="w-full flex items-center gap-2 px-3 py-2 rounded-lg bg-red-600/20 hover:bg-red-600/30 text-red-300 text-sm transition-colors"
          >
            <Trash2 size={16} /> Clear Chat
          </button>
        </div>

        {/* Stats */}
        <div className="mt-auto pt-6 border-t border-indigo-500/20 text-xs text-slate-400">
          <p>Messages: {messages.length}</p>
          <p>Model: {AI_MODELS[selectedModel]}</p>
        </div>
      </div>

      {/* Main Chat Area */}
      <div className="flex-1 flex flex-col">
        {/* Messages Container */}
        <div className="flex-1 overflow-y-auto p-6 space-y-4">
          {messages.length === 0 ? (
            <div className="h-full flex items-center justify-center">
              <div className="text-center">
                <h2 className="text-2xl font-bold text-slate-300 mb-2">Welcome to Cipher AI 🔐</h2>
                <p className="text-slate-400 mb-4">Start chatting with multiple AI models</p>
                <div className="inline-flex gap-4 text-sm text-slate-400">
                  <span>📁 Upload Files</span>
                  <span>🖼️ Add Images</span>
                  <span>💻 Build Web</span>
                </div>
              </div>
            </div>
          ) : (
            messages.map((message) => <MessageBubble key={message.id} message={message} />)
          )}
          {loading && (
            <div className="flex justify-start">
              <div className="bg-slate-800/50 border border-indigo-500/30 rounded-lg px-4 py-3 flex items-center gap-2 text-slate-300">
                <Loader className="animate-spin" size={16} />
                <span>AI is thinking...</span>
              </div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>

        {/* Input Area */}
        <div className="border-t border-indigo-500/20 bg-slate-900/50 p-4 space-y-3">
          {/* Image Preview */}
          {images.length > 0 && (
            <div className="flex gap-2 flex-wrap">
              {images.map((img, idx) => (
                <ImagePreview key={idx} image={img} />
              ))}
            </div>
          )}

          {/* Input Box */}
          <div className="flex gap-2">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && !loading && handleSendMessage()}
              placeholder="Type your message... (Enter to send)"
              className="flex-1 px-4 py-3 bg-slate-800/50 border border-indigo-500/30 rounded-lg text-slate-100 placeholder-slate-500 focus:outline-none focus:border-indigo-500/60 transition-colors"
            />
            <button
              onClick={handleSendMessage}
              disabled={loading || (!input.trim() && images.length === 0)}
              className="px-4 py-3 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 disabled:opacity-50 disabled:cursor-not-allowed text-white rounded-lg transition-all duration-200 flex items-center gap-2"
            >
              {loading ? <Loader size={20} className="animate-spin" /> : <Send size={20} />}
            </button>
          </div>

          {/* File Upload Buttons */}
          <div className="flex gap-2">
            <label className="flex-1 flex items-center justify-center gap-2 px-3 py-2 bg-slate-800/50 border border-indigo-500/30 rounded-lg cursor-pointer hover:bg-slate-800 transition-colors text-slate-300 text-sm">
              <Upload size={16} />
              Upload File
              <input
                type="file"
                onChange={handleFileUpload}
                className="hidden"
              />
            </label>
            <label className="flex-1 flex items-center justify-center gap-2 px-3 py-2 bg-slate-800/50 border border-indigo-500/30 rounded-lg cursor-pointer hover:bg-slate-800 transition-colors text-slate-300 text-sm">
              <Image size={16} />
              Add Image
              <input
                type="file"
                accept="image/*"
                onChange={handleImageUpload}
                multiple
                className="hidden"
              />
            </label>
          </div>
        </div>
      </div>

      {/* Web Builder Modal */}
      {showWebBuilder && (
        <WebBuilder
          code={webCode}
          onClose={() => setShowWebBuilder(false)}
          onCodeChange={setWebCode}
        />
      )}
    </div>
  );
}
