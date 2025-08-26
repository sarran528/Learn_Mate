# Learn_mate Backend

FastAPI backend with LangChain integration for the Learn_mate AI Learning Guide Agent.

## Setup

1. **Install Python 3.8+**

2. **Create virtual environment:**
   ```bash
   cd backend
   python -m venv venv
   
   # On Windows
   venv\Scripts\activate
   
   # On macOS/Linux
   source venv/bin/activate
   ```

3. **Install dependencies:**
   ```bash
   pip install -r requirements.txt
   ```

4. **Set up environment variables:**
   ```bash
   cp .env.example .env
   # Edit .env and add your OpenAI API key
   ```

5. **Run the server:**
   ```bash
   python main.py
   # Or use uvicorn directly:
   uvicorn main:app --reload --host 0.0.0.0 --port 8000
   ```

The API will be available at `http://localhost:8000`

## API Documentation

Once running, visit:
- Swagger UI: `http://localhost:8000/docs`
- ReDoc: `http://localhost:8000/redoc`

## Endpoints

- `GET /` - Health check
- `GET /health` - Detailed health status
- `POST /generate-plan` - Generate learning plan

### Generate Plan Request:
```json
{
  "skill": "Python Programming",
  "duration": 30,
  "language": "English"
}
```

## Deployment

### Railway:
1. Connect your GitHub repo to Railway
2. Add environment variable `OPENAI_API_KEY`
3. Deploy automatically

### Render:
1. Create new Web Service
2. Connect repo, set build command: `pip install -r requirements.txt`
3. Set start command: `uvicorn main:app --host 0.0.0.0 --port $PORT`
4. Add environment variable `OPENAI_API_KEY`