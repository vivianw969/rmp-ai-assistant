# Rate My Professor AI Assistant

A modern AI-powered assistant that helps students find and evaluate professors based on Rate My Professor reviews.

## Features

- 🤖 AI-powered professor search and recommendation
- 📊 Real-time review analysis
- 💬 Modern chat interface
- 🔍 Semantic search capabilities
- 📱 Responsive design

![Demo gif](/demo.gif)
## Tech Stack

- **Frontend**: Next.js, Material UI, TypeScript
- **Backend**: Next.js API Routes
- **AI**: OpenAI GPT-3.5 Turbo, OpenAI Embeddings
- **Vector Database**: Pinecone
- **Styling**: Material UI, Tailwind CSS

## Getting Started

### Prerequisites

- Node.js 18+
- npm or yarn
- OpenAI API key
- Pinecone API key

### Installation

1. Clone the repository:
```bash
git clone https://github.com/yourusername/rmp-ai-assistant.git
cd rmp-ai-assistant
```

2. Install dependencies:
```bash
npm install
```

3. Create a `.env` file in the root directory with the following variables:
```env
OPENAI_API_KEY=your_openai_api_key
PINECONE_API_KEY=your_pinecone_api_key
```

4. Set up the Pinecone index:
```bash
python setup_rag.py
```

5. Start the development server:
```bash
npm run dev
```

The application will be available at `http://localhost:3000`.

## Usage

1. Open the application in your browser
2. Type your question about professors or courses
3. The AI assistant will analyze Rate My Professor reviews and provide relevant recommendations

## Demo

![Demo](demo.gif)

## Project Structure

```
rmp-ai-assistant/
├── app/
│   ├── components/
│   │   ├── Chat.tsx
│   │   └── Layout.tsx
│   │   
│   ├── api/
│   │   └── chat/
│   │       └── route.ts
│   ├── theme.ts
│   └── page.tsx
├── public/
│   └── demo.gif
├── setup_rag.py
├── reviews.json
└── package.json
```

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.
