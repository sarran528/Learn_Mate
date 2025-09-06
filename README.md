# 🧠 Learn_mate - AI Learning Guide Agent

Learn_mate is a comprehensive AI-powered learning platform that generates personalized learning plans, roadmaps, schedules, and resources for any skill you want to master. Built with modern web technologies and powered by Google Gemini AI.

![Learn_mate Demo](https://images.pexels.com/photos/4145153/pexels-photo-4145153.jpeg?auto=compress&cs=tinysrgb&w=1200)

## ✨ Features

- **🎯 AI-Powered Learning Plans**: Generate comprehensive learning paths using Google Gemini AI
- **� Responsive Design**: Fully responsive interface that works seamlessly on desktop and mobile
- **✅ Interactive Workspace**: Complete CRUD operations for checklists, roadmaps, schedules, and resources
- **� AI Chat Interface**: Conversational AI assistant that extracts topics and creates structured learning plans
- **🔐 User Authentication**: JWT-based authentication with Google OAuth integration
- **� Local Storage**: Persistent user data and learning progress
- **🌙 Dark Mode**: Beautiful dark/light theme support
- **📊 Progress Tracking**: Visual progress indicators and completion tracking

## 🏗️ Architecture

### Frontend (React + TypeScript + Vite)
- **Framework**: React 18 with TypeScript
- **Build Tool**: Vite 5.4+
- **Styling**: Tailwind CSS with custom gradients and themes
- **Icons**: Lucide React
- **State Management**: React Hooks with localStorage persistence
- **Routing**: Single-page application with component-based navigation

### Backend (FastAPI + Google Gemini)
- **Framework**: FastAPI with automatic API documentation
- **AI Engine**: Google Gemini 1.5 Flash via LangChain
- **Database**: SQLite with SQLAlchemy-style queries
- **Authentication**: JWT tokens with Google OAuth 2.0
- **Security**: Password hashing with bcrypt, CORS configuration
- **API Documentation**: Swagger UI and ReDoc

## 🚀 Quick Start

### Prerequisites
- Node.js 18+
- Python 3.8+
- Google Gemini API Key
- Google OAuth Client ID (optional, for Google Sign-In)

### Frontend Setup

1. **Install dependencies:**
   ```bash
   npm install
   ```

2. **Configure environment:**
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

4. **Configure environment:**
   ```bash
   cp .env.example .env
   # Edit .env and add your API keys:
   # GEMINI_API_KEY=your_gemini_api_key
   # GOOGLE_OAUTH_CLIENT_ID=your_google_oauth_client_id (optional)
   # SECRET_KEY=your_jwt_secret_key
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
- `POST /chat` - AI chat with learning plan generation
- `POST /register` - User registration
- `POST /login` - User login
- `POST /auth/google` - Google OAuth authentication

### Chat API Example:
```json
{
  "messages": [
    {
      "text": "I want to learn Python programming",
      "isUser": true
    }
  ]
}
```

**Response:**
```json
{
  "message": "Great choice! Python is perfect for beginners...",
  "checklist": ["Install Python 3.11+", "Set up VS Code", "..."],
  "roadmap": ["Day 1-2: Python syntax", "Day 3-4: Data structures", "..."],
  "schedule": ["Day 1: Install Python (2 hours)", "..."],
  "resources": ["https://docs.python.org/3/tutorial/", "..."]
}
```

## 🎨 UI Features

### Authentication System
- **JWT Authentication**: Secure token-based authentication
- **Google OAuth**: One-click sign-in with Google
- **Persistent Sessions**: Automatic login on page refresh
- **User Profiles**: Avatar, name, and email integration

### AI Chat Interface
- **Conversational AI**: Natural language interaction with Gemini
- **Structured Responses**: Automatic extraction of learning components
- **Context Awareness**: Remembers conversation history
- **Error Handling**: Graceful fallbacks for API failures

### Learning Workspace
- **Tabbed Interface**: Organized into Overview, Checklist, Roadmap, Schedule, Resources
- **Full CRUD Operations**: Add, edit, remove, and reorder all items
- **Progress Tracking**: Visual completion indicators
- **Skill Persistence**: Save and load multiple learning paths
- **Mobile Responsive**: Optimized touch interactions

### Responsive Design
- **Mobile-First**: Optimized for mobile devices
- **Adaptive Layout**: Desktop sidebar, mobile overlay menu
- **Touch-Friendly**: Large touch targets and gestures
- **Dark Mode**: System-aware theme switching

## 🔧 Configuration

### Environment Variables

**Frontend (.env):**
```bash
VITE_BACKEND_URL=http://localhost:8000
```

**Backend (.env):**
```bash
# Required
GEMINI_API_KEY=your_gemini_api_key
SECRET_KEY=your_jwt_secret_key

# Optional
GOOGLE_OAUTH_CLIENT_ID=your_google_oauth_client_id
CORS_ORIGINS=http://localhost:5173,http://127.0.0.1:5173
```

## 🚀 Deployment

### Frontend (Vercel/Netlify)
1. Build the project: `npm run build`
2. Deploy the `dist` folder to your hosting service
3. Set environment variable: `VITE_BACKEND_URL=your-backend-url`

### Backend (Railway/Render/Heroku)

#### Railway:
1. Connect your GitHub repo to Railway
2. Set root directory to `backend`
3. Add environment variables
4. Railway will auto-deploy with Python detection

#### Render:
1. Create new Web Service
2. Connect repo, set root directory to `backend`
3. Set build command: `pip install -r requirements.txt`
4. Set start command: `uvicorn main:app --host 0.0.0.0 --port $PORT`
5. Add environment variables

#### Heroku:
1. Create new app
2. Set buildpack to Python
3. Deploy from `backend` directory
4. Configure environment variables

## 📁 Project Structure

```
learn_mate/
├── src/                          # Frontend source code
│   ├── components/               # React components
│   │   ├── Auth.jsx             # Authentication component
│   │   ├── Chatbot.jsx          # AI chat interface
│   │   ├── Checklist.jsx        # Task management
│   │   ├── Roadmap.jsx          # Learning roadmap
│   │   ├── Schedule.jsx         # Schedule planning
│   │   ├── Resources.jsx        # Resource management
│   │   ├── Navbar.jsx           # Navigation bar
│   │   ├── Sidebar.jsx          # Sidebar navigation
│   │   └── Workspace.tsx        # Main workspace
│   ├── App.jsx                  # Main application component
│   ├── main.tsx                 # Application entry point
│   └── index.css                # Global styles
├── backend/                      # Backend source code
│   ├── main.py                  # FastAPI application
│   ├── learn_mate.db           # SQLite database
│   ├── requirements.txt         # Python dependencies
│   ├── .env.example            # Environment template
│   └── README.md               # Backend documentation
├── public/                      # Static assets
├── dist/                        # Build output
├── package.json                 # Node.js dependencies
├── vite.config.ts              # Vite configuration
├── tailwind.config.js          # Tailwind CSS config
└── README.md                   # Project documentation
```

## 🔧 Development

### Available Scripts
```bash
npm run dev      # Start development server
npm run build    # Build for production
npm run preview  # Preview production build
npm run lint     # Run ESLint
```

### Backend Development
```bash
cd backend
python main.py   # Start FastAPI server
```

### Key Technologies
- **Frontend**: React 18, TypeScript, Vite, Tailwind CSS
- **Backend**: FastAPI, Google Gemini AI, SQLite
- **Authentication**: JWT, Google OAuth 2.0
- **Styling**: Tailwind CSS with custom themes
- **Icons**: Lucide React
- **Build Tools**: Vite, ESLint

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch: `git checkout -b feature/amazing-feature`
3. Commit changes: `git commit -m 'Add amazing feature'`
4. Push to branch: `git push origin feature/amazing-feature`
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 🙏 Acknowledgments

- **Google Gemini AI** for providing the powerful AI capabilities
- **LangChain** for the excellent AI framework integration
- **FastAPI** for the robust and fast API framework
- **Tailwind CSS** for the beautiful and responsive styling system
- **Lucide React** for the clean and consistent icon set
- **Vite** for the lightning-fast build tool

---

**Built with ❤️ using modern web technologies and AI**