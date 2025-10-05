# Perplexity Research Copilot 🚀

A crazy, futuristic research copilot powered by the Perplexity Search API. This app transforms traditional search into an engaging, personality-driven research experience with multiple interaction modes and vibes.

![Perplexity Research Copilot](https://img.shields.io/badge/Next.js-14-black?style=for-the-badge&logo=next.js)
![TypeScript](https://img.shields.io/badge/TypeScript-5-blue?style=for-the-badge&logo=typescript)
![Tailwind CSS](https://img.shields.io/badge/Tailwind-3-38bdf8?style=for-the-badge&logo=tailwind-css)

## ✨ Features

### 🎭 Personality Vibes
Choose from 5 distinct personality modes that adapt the tone and style of responses:
- **🎓 Academic**: Precise, neutral, citation-heavy
- **💻 Hacker**: Concise, code-forward, technical tips
- **😊 Friendly**: Approachable, simple analogies
- **😂 Meme**: Brief, playful, emoji-sprinkled
- **🇮🇳 Hinglish**: Casual Hindi-English mix

### 🔍 Query Modes
Different research modes for different needs:
- **⚡ Quick Answer**: 1-2 paragraph summary with 3-5 citations
- **🔬 Deep Research**: Multi-step chain-of-search with rationale
- **⚖️ Debate Mode**: Pro vs con arguments with sources
- **📚 Explainer**: ELI5 and ELI15 breakdowns

### 🌟 Core Features
- **Real-time Streaming**: See answers appear as they're generated
- **Rich Citations**: Interactive source cards with previews
- **Chain-of-Search**: Visualize research steps in deep mode
- **Session History**: Last 20 queries saved locally
- **Keyboard Shortcuts**: Power user friendly
- **Export to Markdown**: Save your research
- **Cosmic UI**: Dark mode with glowing effects and smooth animations

## 🚀 Quick Start

### Prerequisites
- Node.js 18+ installed
- A Perplexity API key ([Get one here](https://www.perplexity.ai/))

### Installation

1. **Clone or navigate to the project**
```bash
cd perplexity-copilot
```

2. **Install dependencies**
```bash
npm install
```

3. **Configure your API key**

Edit `.env.local` and add your Perplexity API key:
```env
PPLX_API_KEY=your_actual_api_key_here
NEXT_PUBLIC_APP_URL=http://localhost:3000
RATE_LIMIT_MAX_REQUESTS=100
RATE_LIMIT_WINDOW_MS=60000
```

4. **Run the development server**
```bash
npm run dev
```

5. **Open your browser**

Navigate to [http://localhost:3000](http://localhost:3000)

## ⌨️ Keyboard Shortcuts

| Shortcut | Action |
|----------|--------|
| `Cmd/Ctrl + K` | Focus search input |
| `Enter` | Submit search |
| `Shift + Enter` | New line in input |
| `Cmd/Ctrl + B` | Toggle sidebar |
| `Escape` | Close panels/modals |

## 🎨 Tech Stack

- **Framework**: Next.js 14 (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **UI Components**: shadcn/ui
- **State Management**: Zustand + React Query
- **Animations**: Framer Motion
- **Markdown**: react-markdown
- **Icons**: Lucide React

## 📁 Project Structure

```
perplexity-copilot/
├── app/
│   ├── api/
│   │   └── search/
│   │       └── route.ts          # API endpoint for Perplexity
│   ├── layout.tsx                # Root layout
│   ├── page.tsx                  # Main search page
│   └── globals.css               # Global styles
├── components/
│   ├── ui/                       # shadcn/ui components
│   ├── AppShell.tsx              # Main layout shell
│   ├── ModeVibePicker.tsx        # Mode and vibe selectors
│   ├── Composer.tsx              # Search input
│   ├── AnswerStream.tsx          # Streaming answer display
│   ├── CitationsPanel.tsx        # Source cards
│   ├── StepTimeline.tsx          # Chain-of-search visualization
│   ├── HistoryDrawer.tsx         # Search history
│   ├── SourcePreviewPanel.tsx    # Source preview iframe
│   └── KeyboardShortcutHandler.tsx
├── lib/
│   ├── hooks/
│   │   └── useSearchStream.ts    # Streaming API hook
│   ├── prompt-builder.ts         # System prompt generator
│   ├── rate-limiter.ts           # Rate limiting
│   ├── stream-parser.ts          # SSE parser
│   ├── history-storage.ts        # LocalStorage utils
│   ├── store.ts                  # Zustand store
│   ├── providers.tsx             # React Query provider
│   ├── schemas.ts                # Zod validation
│   └── utils.ts                  # Utility functions
├── types/
│   └── index.ts                  # TypeScript types
└── .env.local                    # Environment variables
```

## 🔧 Configuration

### Environment Variables

| Variable | Description | Default |
|----------|-------------|---------|
| `PPLX_API_KEY` | Your Perplexity API key | Required |
| `NEXT_PUBLIC_APP_URL` | App URL | `http://localhost:3000` |
| `RATE_LIMIT_MAX_REQUESTS` | Max requests per window | `100` |
| `RATE_LIMIT_WINDOW_MS` | Rate limit window (ms) | `60000` |

### Perplexity API

This app uses the Perplexity Chat Completions API with the `llama-3.1-sonar-small-128k-online` model for web-grounded search.

API Endpoint: `https://api.perplexity.ai/chat/completions`

## 🎯 Usage Examples

### Quick Research
1. Select "Quick Answer" mode
2. Choose your preferred vibe (e.g., "Friendly")
3. Type your question: "How do fireflies glow?"
4. Get a concise answer with citations

### Deep Dive
1. Select "Deep Research" mode
2. Choose "Academic" vibe for formal tone
3. Ask: "What are the implications of quantum computing?"
4. See the chain-of-search steps and comprehensive analysis

### Debate Topics
1. Select "Debate Mode"
2. Choose any vibe
3. Ask: "Should AI be regulated?"
4. Get pro and con arguments with sources

## 🐛 Troubleshooting

### API Key Issues
- Make sure your `.env.local` file has the correct API key
- Restart the dev server after changing environment variables
- Check that the key hasn't expired

### Rate Limiting
- Default limit is 100 requests per minute
- Adjust `RATE_LIMIT_MAX_REQUESTS` if needed
- Rate limits reset automatically

### Streaming Issues
- Check browser console for errors
- Ensure stable internet connection
- Try refreshing the page

## 🚧 Future Enhancements

- [ ] Rabbit Hole mode (visual node-based exploration)
- [ ] Voice input and text-to-speech
- [ ] Image analysis and visual search
- [ ] Shareable permalinks
- [ ] Collaborative research sessions
- [ ] 3D graph visualizations
- [ ] Offline support with service workers

## 📝 License

MIT License - feel free to use this project however you'd like!

## 🙏 Acknowledgments

- Built with [Perplexity AI](https://www.perplexity.ai/)
- UI components from [shadcn/ui](https://ui.shadcn.com/)
- Icons from [Lucide](https://lucide.dev/)

## 💬 Support

If you encounter any issues or have questions:
1. Check the troubleshooting section above
2. Review the Perplexity API documentation
3. Open an issue on GitHub

---

**Made with ❤️ and ☕ by developers who love research**
