import axios from 'axios';

const API_BASE = 'https://api.synoxcloud.xyz/ai-chat';

export const AI_MODELS = {
  'claude-opus-4.5': 'Claude Opus 4.5',
  'claude-opus-4.6': 'Claude Opus 4.6',
  'claude-opus-4.7': 'Claude Opus 4.7',
  'claude-opus-4.8': 'Claude Opus 4.8',
  'claude-sonnet-4.6': 'Claude Sonnet 4.6',
};

export interface ChatMessage {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  files?: File[];
  images?: string[];
  type?: 'text' | 'code' | 'image';
  timestamp: Date;
}

export interface AIResponse {
  message: string;
  model: string;
  timestamp: Date;
}

export const sendMessage = async (
  message: string,
  model: keyof typeof AI_MODELS,
  files?: File[],
  images?: string[]
): Promise<AIResponse> => {
  try {
    const encodedMessage = encodeURIComponent(message);
    const endpoint = `${API_BASE}/${model}?pesan=${encodedMessage}`;

    const response = await axios.get(endpoint, {
      headers: {
        'Accept': 'application/json',
      },
    });

    const responseText = response.data?.pesan || response.data?.message || 'No response';
    
    return {
      message: responseText,
      model: AI_MODELS[model],
      timestamp: new Date(),
    };
  } catch (error) {
    console.error('API Error:', error);
    throw new Error('Failed to send message to AI');
  }
};

export const uploadFile = async (file: File): Promise<string> => {
  return new Promise((resolve) => {
    const reader = new FileReader();
    reader.onloadend = () => {
      resolve(reader.result as string);
    };
    reader.readAsDataURL(file);
  });
};

export const uploadImage = async (file: File): Promise<string> => {
  return new Promise((resolve) => {
    const reader = new FileReader();
    reader.onloadend = () => {
      resolve(reader.result as string);
    };
    reader.readAsDataURL(file);
  });
};

export const generateWebPreview = (htmlCode: string): string => {
  return htmlCode;
};
