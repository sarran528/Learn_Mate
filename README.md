# 🧠 Learn_mate - AI Learning Guide Agent

Learn_mate is a comprehensive AI-powered learning guide that generates personalized learning plans, roadmaps, schedules, and resources for any skill you want to master.

![Learn_mate Demo](https://images.pexels.com/photos/4145153/pexels-photo-4145153.jpeg?auto=compress&cs=tinysrgb&w=1200)

## ✨ Features

- **🎯 Smart Roadmap**: AI-generated milestone-based learning paths
- **📅 Daily Schedule**: Structured weekly and daily learning plans
- **✅ Interactive Checklist**: Track progress with actionable tasks
- **📚 Curated Resources**: Quality learning materials for each milestone
- **🌍 Multi-language Support**: Available in 8+ languages
- **📱 Responsive Design**: Works seamlessly on all devices
- **⚡ Real-time Generation**: Powered by OpenAI GPT-4

## 🏗️ Architecture

### Frontend (React + TypeScript)
- **Framework**: React 18 with Vite
- **Styling**: Tailwind CSS with custom gradients
- **Icons**: Lucide React
- **State Management**: React Hooks
- **Language Support**: 8 languages including English, Hindi, Tamil, Spanish, French, German, Chinese, Japanese

### Backend (FastAPI + LangChain)
- **Framework**: FastAPI with automatic API documentation
- **AI**: LangChain with OpenAI GPT-4o-mini
- **Validation**: Pydantic models
- **CORS**: Configured for development and production
- **Error Handling**: Comprehensive logging and error responses

## 🚀 Quick Start

### Prerequisites
- Node.js 16+ 
- Python 3.8+
- OpenAI API Key

### Frontend Setup

1. **Install dependencies:**
   ```bash
   npm install
   ```

2. **Set up environment variables:**
   ```bash
   cp .env.example .env
   # Edit .env to set your backend URL (default: http://localhost:8000)
   ```

3. **Start development server:**
   ```bash
   npm run dev
   ```

The frontend will be available at `http://localhost:5173`

### Backend Setup

1. **Navigate to backend directory:**
   ```bash
   cd backend
   ```

2. **Create virtual environment:**
   ```bash
   python -m venv venv
   
   # Windows
   venv\Scripts\activate
   
   # macOS/Linux
   source venv/bin/activate
   ```

3. **Install dependencies:**
   ```bash
   pip install -r requirements.txt
   ```

4. **Set up environment variables:**
   ```bash
   cp .env.example .env
   # Edit .env and add your OpenAI API key:
   # OPENAI_API_KEY=your_openai_api_key_here
   ```

5. **Start the server:**
   ```bash
   python main.py
   ```

The backend API will be available at `http://localhost:8000`

## 📖 API Documentation

Once the backend is running, visit:
- **Swagger UI**: `http://localhost:8000/docs`
- **ReDoc**: `http://localhost:8000/redoc`

### Key Endpoints

- `GET /` - Health check
- `GET /health` - Detailed health status
- `POST /generate-plan` - Generate learning plan

### Example Request:
```json
{
  "skill": "Python Programming",
  "duration": 30,
  "language": "en"
}
```

## 🎨 UI Features

### Learning Form
- **Skill Input**: Free text with popular skill suggestions
- **Duration Selection**: Quick buttons (7, 14, 30, 60 days) or custom input
- **Language Selection**: Dropdown with flag icons for 8+ languages
- **Smart Validation**: Real-time form validation with helpful hints

### Learning Plan Display
- **Tabbed Interface**: Organized into Roadmap, Schedule, Checklist, and Resources
- **Progress Tracking**: Visual progress bars and completion percentages
- **Interactive Checklist**: Click to complete tasks with visual feedback
- **Resource Links**: Categorized links with type indicators and external link icons

## 🌐 Supported Languages

- 🇺🇸 English
- 🇮🇳 Hindi
- 🇮🇳 Tamil
- 🇪🇸 Spanish
- 🇫🇷 French
- 🇩🇪 German
- 🇨🇳 Chinese
- 🇯🇵 Japanese

## 🚀 Deployment

### Frontend (Vercel/Netlify)
1. Build the project: `npm run build`
2. Deploy the `dist` folder to your preferred hosting service
3. Set environment variable: `VITE_BACKEND_URL=your-backend-url`

### Backend (Railway/Render)

#### Railway:
1. Connect your GitHub repo to Railway
2. Add environment variable: `OPENAI_API_KEY=your_key`
3. Railway will auto-deploy from the `backend` directory

#### Render:
1. Create new Web Service
2. Connect repo, set build command: `pip install -r requirements.txt`
3. Set start command: `uvicorn main:app --host 0.0.0.0 --port $PORT`
4. Add environment variable: `OPENAI_API_KEY=your_key`

## 📁 Project Structure

```
learn_mate/
├── src/                          # Frontend source code
│   ├── components/
│   │   ├── LearningForm.tsx     # Main input form
│   │   └── LearningPlan.tsx     # Plan display component
│   ├── types/
│   │   └── index.ts             # TypeScript definitions
│   ├── App.tsx                  # Main app component
│   └── main.tsx                 # Entry point
├── backend/                      # Backend source code
│   ├── main.py                  # FastAPI application
│   ├── requirements.txt         # Python dependencies
│   ├── .env.example            # Environment template
│   └── README.md               # Backend documentation
├── public/                      # Static assets
└── README.md                   # Project documentation
```

## 🔧 Development

### Adding New Languages
1. Update `SUPPORTED_LANGUAGES` in `src/components/LearningForm.tsx`
2. The backend automatically supports any language code you send

### Customizing the AI Prompt
Edit the `create_learning_prompt` function in `backend/main.py` to modify how the AI generates plans.

### Styling
The app uses Tailwind CSS with custom color schemes. Main colors:
- Primary: Blue (#3B82F6)
- Secondary: Purple (#8B5CF6)
- Accent: Green (#10B981)

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch: `git checkout -b feature/amazing-feature`
3. Commit changes: `git commit -m 'Add amazing feature'`
4. Push to branch: `git push origin feature/amazing-feature`
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 🙏 Acknowledgments

- OpenAI for providing the GPT-4 API
- LangChain for the excellent AI framework
- Tailwind CSS for the beautiful styling system
- Lucide React for the clean icons

---

**Built with ❤️ by the Learn_mate team**