# Learn_Mate Backend

## Setup

1. Install Python dependencies:
```bash
pip install -r requirements.txt
```

2. Set up your environment variables:
Create a `.env` file in the backend directory with:
```
GOOGLE_API_KEY=your_google_api_key_here
```

3. Get your Google API key:
- Go to [Google AI Studio](https://makersuite.google.com/app/apikey)
- Create a new API key
- Add it to your `.env` file

4. Run the server:
```bash
python main.py
```

The server will start on `http://localhost:8000`

## API Endpoints

- `GET /` - Root endpoint
- `GET /health` - Health check
- `POST /chat` - Chat with the AI agent