# Cipher AI 🔐

A modern AI chat application with multiple model support, file uploads, image handling, and web preview builder.

## Features ✨

- 🤖 **Multi-Model AI Support**
  - Claude Opus 4.5, 4.6, 4.7, 4.8
  - Claude Sonnet 4.6

- 📁 **File Upload & Processing**
  - Upload and analyze various file types
  - Real-time file handling

- 🖼️ **Image Support**
  - Upload multiple images
  - Image preview and processing
  - Base64 encoding for API transmission

- 🌐 **Web Builder**
  - Real-time HTML/CSS preview
  - Code editor with syntax highlighting
  - Copy code functionality

- 💬 **Rich Chat Interface**
  - Markdown support
  - Code syntax highlighting
  - Message history
  - Responsive design

## Tech Stack 🛠️

- **Frontend**: Next.js 14, React 18, TypeScript
- **Styling**: Tailwind CSS, PostCSS
- **UI Components**: Lucide React
- **API**: Axios
- **Code Highlighting**: React Syntax Highlighter
- **Markdown**: React Markdown

## Installation 🚀

```bash
# Clone the repository
git clone https://github.com/Nillapesr/chiper-ai.git
cd chiper-ai

# Install dependencies
npm install

# Set up environment variables
cp .env.example .env.local

# Run development server
npm run dev
```

Visit `http://localhost:3000` in your browser.

## Environment Variables 🔑

```env
NEXT_PUBLIC_API_BASE_URL=https://api.synoxcloud.xyz
```

## Build & Deployment 📦

### Build for Production

```bash
npm run build
npm start
```

### Deploy to Vercel

1. Push code to GitHub
2. Connect repository to Vercel
3. Deploy with one click

## API Endpoints 🔌

The app uses the following API endpoints:

```
https://api.synoxcloud.xyz/ai-chat/claude-opus-4.5?pesan={message}
https://api.synoxcloud.xyz/ai-chat/claude-opus-4.6?pesan={message}
https://api.synoxcloud.xyz/ai-chat/claude-opus-4.7?pesan={message}
https://api.synoxcloud.xyz/ai-chat/claude-opus-4.8?pesan={message}
https://api.synoxcloud.xyz/ai-chat/claude-sonnet-4.6?pesan={message}
```

## Usage 💡

1. **Select Model**: Choose your preferred AI model from the sidebar
2. **Send Message**: Type your message and press Send
3. **Upload Files**: Click the upload icon to add files
4. **Upload Images**: Click the image icon to add images
5. **Web Builder**: Click the code icon to preview and edit HTML/CSS
6. **Clear Chat**: Use the trash icon to clear conversation history

## Features in Detail 🎯

### Model Selection
Switch between different Claude models for different use cases:
- **Opus models**: Best for complex reasoning
- **Sonnet model**: Balanced performance and speed

### Rich Message Display
- Markdown rendering
- Code block syntax highlighting with copy button
- Timestamp for each message
- Support for images in user messages

### Web Preview
- Live HTML/CSS preview
- Editable code view
- Safe sandbox execution

## Performance ⚡

- Optimized for fast loading
- Lazy loading components
- Efficient state management
- Responsive design for all devices

## Browser Support 🌐

- Chrome/Edge (latest)
- Firefox (latest)
- Safari (latest)
- Mobile browsers

## Contributing 🤝

Feel free to submit issues and enhancement requests!

## License 📄

MIT License - feel free to use this project for any purpose.

## Support 💬

For support, please open an issue on GitHub or contact the maintainers.

---

**Made with ❤️ by Nillapesr**
