
from fastapi import FastAPI, HTTPException, Depends, Header
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import List
import os
from dotenv import load_dotenv
from langchain_google_genai import ChatGoogleGenerativeAI
from langchain.schema import HumanMessage, SystemMessage, AIMessage
import logging
import sqlite3
from passlib.context import CryptContext
from jose import JWTError, jwt
from datetime import datetime, timedelta
from fastapi.security import OAuth2PasswordBearer
from google.oauth2 import id_token as google_id_token
from google.auth.transport import requests as google_requests
import json

# Load environment variables
load_dotenv()

# --- FastAPI App Initialization ---
app = FastAPI(title="Learn_mate API", version="3.0.0")

# --- CORS Configuration ---
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173", "http://localhost:5174", "http://localhost:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# OAuth2 bearer token extractor
oauth2_scheme = OAuth2PasswordBearer(tokenUrl="/login")

# --- Logging Configuration ---
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

# --- Database Configuration ---
DATABASE_URL = "learn_mate.db"

def get_db_connection():
    conn = sqlite3.connect(DATABASE_URL)
    conn.row_factory = sqlite3.Row
    return conn

def create_tables():
    conn = get_db_connection()
    conn.execute('''
        CREATE TABLE IF NOT EXISTS users (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            username TEXT UNIQUE NOT NULL,
            hashed_password TEXT NOT NULL
        )
    ''')
    conn.execute('''
        CREATE TABLE IF NOT EXISTS chat_messages (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            user_id INTEGER NOT NULL,
            message TEXT NOT NULL,
            is_user BOOLEAN NOT NULL,
            timestamp DATETIME DEFAULT CURRENT_TIMESTAMP,
            FOREIGN KEY (user_id) REFERENCES users (id)
        )
    ''')
    conn.commit()
    conn.close()

# Create tables on startup
create_tables()

# --- Security and Authentication ---
SECRET_KEY = os.getenv("SECRET_KEY", "a_super_secret_key")
ALGORITHM = "HS256"
ACCESS_TOKEN_EXPIRE_MINUTES = 30

pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")

def verify_password(plain_password, hashed_password):
    return pwd_context.verify(plain_password, hashed_password)

def get_password_hash(password):
    return pwd_context.hash(password)

def create_access_token(data: dict, expires_delta: timedelta | None = None):
    to_encode = data.copy()
    if expires_delta:
        expire = datetime.utcnow() + expires_delta
    else:
        expire = datetime.utcnow() + timedelta(minutes=15)
    to_encode.update({"exp": expire})
    encoded_jwt = jwt.encode(to_encode, SECRET_KEY, algorithm=ALGORITHM)
    return encoded_jwt

# --- Pydantic Models ---
class UserCreate(BaseModel):
    username: str
    password: str

class UserLogin(BaseModel):
    username: str
    password: str

class Token(BaseModel):
    access_token: str
    token_type: str

class Message(BaseModel):
    text: str
    isUser: bool

class ChatHistory(BaseModel):
    messages: List[Message]

class ChatResponse(BaseModel):
    message: str
    checklist: List[str] = []
    roadmap: List[str] = []
    schedule: List[str] = []
    resources: List[str] = []

# --- Gemini Model Initialization ---
try:
    llm = ChatGoogleGenerativeAI(
        model="gemini-1.5-flash-latest",
        temperature=0.7,
        google_api_key=os.getenv("GEMINI_API_KEY"),
    )
except Exception as e:
    logger.error(f"Failed to initialize Gemini model: {e}")
    llm = None

SYSTEM_PROMPT = '''You are Learn_mate, an expert AI Learning Guide Agent that helps users create personalized learning plans.

CRITICAL: You MUST ALWAYS respond with valid JSON in this exact format:
{
  "message": "your conversational response in markdown",
  "checklist": ["item1", "item2"],
  "roadmap": ["step1", "step2"],
  "schedule": ["day1: task", "day2: task"],
  "resources": ["https://example.com", "book title"]
}

Rules:
1. ALWAYS return valid JSON - no extra text before or after
2. Include ALL 5 keys: message, checklist, roadmap, schedule, resources
3. Make arrays relevant to the user's request
4. If user asks about a new topic, generate a complete learning plan
5. Be encouraging and provide practical, actionable content
6. Keep message conversational but informative

When user wants to learn something:
- Ask clarifying questions if needed (timeframe, experience level)
- Generate a complete roadmap with clear steps
- Provide actionable checklist items
- Create a realistic schedule
- Suggest quality learning resources

Example for "Learn Python":
{
  "message": "Great choice! Python is perfect for beginners. I've created a comprehensive 7-day learning plan for you. Start with the basics and work through each checkpoint systematically.",
  "checklist": ["Install Python 3.11+", "Set up VS Code with Python extension", "Complete first Hello World program", "Practice variables and data types", "Write your first function"],
  "roadmap": ["Day 1-2: Python syntax and basic operations", "Day 3-4: Data structures (lists, dicts)", "Day 5-6: Functions and modules", "Day 7: Small project"],
  "schedule": ["Day 1: Install Python, basic syntax (2 hours)", "Day 2: Variables, strings, numbers (2 hours)", "Day 3: Lists and loops (2 hours)", "Day 4: Dictionaries and sets (2 hours)", "Day 5: Functions (2 hours)", "Day 6: Modules and packages (2 hours)", "Day 7: Build a calculator project (3 hours)"],
  "resources": ["https://docs.python.org/3/tutorial/", "https://realpython.com/python-first-steps/", "Automate the Boring Stuff with Python (book)", "https://pythontutor.com/visualize.html"]
}'''

# --- API Endpoints ---
@app.get("/")
async def root():
    return {"message": "Learn_mate Chat API is running!", "version": "3.0.0"}

@app.get("/health")
async def health_check():
    return {
        "status": "healthy",
        "gemini_configured": llm is not None,
    }

@app.post("/register", status_code=201)
async def register_user(user: UserCreate):
    conn = get_db_connection()
    hashed_password = get_password_hash(user.password)
    try:
        conn.execute(
            "INSERT INTO users (username, hashed_password) VALUES (?, ?)",
            (user.username, hashed_password),
        )
        conn.commit()
    except sqlite3.IntegrityError:
        raise HTTPException(status_code=400, detail="Username already registered")
    finally:
        conn.close()
    return {"message": "User registered successfully"}

@app.post("/login", response_model=Token)
async def login_for_access_token(user: UserLogin):
    conn = get_db_connection()
    db_user = conn.execute("SELECT * FROM users WHERE username = ?", (user.username,)).fetchone()
    conn.close()
    if not db_user or not verify_password(user.password, db_user["hashed_password"]):
        raise HTTPException(
            status_code=401,
            detail="Incorrect username or password",
            headers={"WWW-Authenticate": "Bearer"},
        )
    access_token_expires = timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES)
    access_token = create_access_token(
        data={"sub": user.username}, expires_delta=access_token_expires
    )
    return {"access_token": access_token, "token_type": "bearer"}

async def get_current_user(token: str = Depends(oauth2_scheme)):
    credentials_exception = HTTPException(
        status_code=401,
        detail="Could not validate credentials",
        headers={"WWW-Authenticate": "Bearer"},
    )
    try:
        payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
        username: str = payload.get("sub")
        if username is None:
            raise credentials_exception
    except JWTError:
        raise credentials_exception

    conn = get_db_connection()
    user = conn.execute("SELECT * FROM users WHERE username = ?", (username,)).fetchone()
    conn.close()
    if user is None:
        raise credentials_exception
    return user

@app.post("/chat", response_model=ChatResponse)
async def chat_with_agent(chat_history: ChatHistory, current_user: dict = Depends(get_current_user)):
    if not llm:
        raise HTTPException(status_code=500, detail="Gemini model not configured.")

    user_id = current_user["id"]
    conn = get_db_connection()

    # Get the last user message
    last_user_message = chat_history.messages[-1]

    # Save user message to DB
    conn.execute(
        "INSERT INTO chat_messages (user_id, message, is_user) VALUES (?, ?, ?)",
        (user_id, last_user_message.text, True),
    )
    conn.commit()

    # Construct message history for AI
    messages = [SystemMessage(content=SYSTEM_PROMPT)]
    # Fetch previous messages from DB
    db_messages = conn.execute(
        "SELECT message, is_user FROM chat_messages WHERE user_id = ? ORDER BY timestamp ASC",
        (user_id,)
    ).fetchall()

    for msg in db_messages:
        if msg["is_user"]:
            messages.append(HumanMessage(content=msg["message"]))
        else:
            # The AI response is a JSON string, so we need to load it
            try:
                ai_response_data = json.loads(msg["message"])
                messages.append(AIMessage(content=ai_response_data.get("message", "")))
            except json.JSONDecodeError:
                # Handle cases where the message is not a valid JSON string
                messages.append(AIMessage(content=msg["message"]))


    # Generate response
    response = llm.invoke(messages)
    ai_response_text = response.content

    # Save AI response to DB
    conn.execute(
        "INSERT INTO chat_messages (user_id, message, is_user) VALUES (?, ?, ?)",
        (user_id, ai_response_text, False),
    )
    conn.commit()
    conn.close()

    try:
        # Clean up the response text - handle code blocks and extra whitespace
        clean_response = ai_response_text.strip()
        
        # Remove markdown code blocks if present
        if clean_response.startswith("```json"):
            clean_response = clean_response[7:]
        if clean_response.endswith("```"):
            clean_response = clean_response[:-3]
        
        # Remove any leading/trailing whitespace again
        clean_response = clean_response.strip()
        
        # Parse JSON
        response_data = json.loads(clean_response)
        
        # Ensure all required keys exist with defaults
        validated_response = {
            "message": response_data.get("message", "I'm here to help you learn!"),
            "checklist": response_data.get("checklist", []),
            "roadmap": response_data.get("roadmap", []),
            "schedule": response_data.get("schedule", []),
            "resources": response_data.get("resources", [])
        }
        
        return ChatResponse(**validated_response)
        
    except (json.JSONDecodeError, TypeError) as e:
        logger.error(f"Error decoding AI response: {e}\nResponse: {ai_response_text}")
        # Fallback to returning the raw text with empty arrays
        return ChatResponse(
            message=ai_response_text,
            checklist=[],
            roadmap=[],
            schedule=[],
            resources=[]
        )

GOOGLE_OAUTH_CLIENT_ID = os.getenv("GOOGLE_OAUTH_CLIENT_ID", "")

# Ensure DB has google profile columns
def ensure_profile_columns():
    conn = get_db_connection()
    cols = {row[1] for row in conn.execute("PRAGMA table_info(users)").fetchall()}
    alter_statements = []
    if "google_sub" not in cols:
        alter_statements.append("ALTER TABLE users ADD COLUMN google_sub TEXT UNIQUE")
    if "email" not in cols:
        alter_statements.append("ALTER TABLE users ADD COLUMN email TEXT")
    if "name" not in cols:
        alter_statements.append("ALTER TABLE users ADD COLUMN name TEXT")
    if "avatar_url" not in cols:
        alter_statements.append("ALTER TABLE users ADD COLUMN avatar_url TEXT")
    for stmt in alter_statements:
        try:
            conn.execute(stmt)
        except Exception:
            pass
    conn.commit()
    conn.close()

ensure_profile_columns()

class GoogleAuthRequest(BaseModel):
    id_token: str

class AuthResponse(BaseModel):
    access_token: str
    token_type: str = "bearer"
    username: str
    email: str | None = None
    name: str | None = None
    avatar_url: str | None = None

@app.post("/auth/google", response_model=AuthResponse)
async def auth_google(payload: GoogleAuthRequest):
    if not GOOGLE_OAUTH_CLIENT_ID:
        raise HTTPException(status_code=500, detail="Google OAuth client ID not configured")
    try:
        idinfo = google_id_token.verify_oauth2_token(payload.id_token, google_requests.Request(), GOOGLE_OAUTH_CLIENT_ID)
        if idinfo.get("aud") != GOOGLE_OAUTH_CLIENT_ID:
            raise ValueError("Invalid audience")
        google_sub = idinfo["sub"]
        email = idinfo.get("email")
        name = idinfo.get("name")
        avatar_url = idinfo.get("picture")
        username = email.split("@")[0] if email else f"user_{google_sub[:8]}"

        conn = get_db_connection()
        existing = conn.execute("SELECT * FROM users WHERE google_sub = ?", (google_sub,)).fetchone()
        if existing is None:
            # If username taken, make unique
            final_username = username
            idx = 1
            while conn.execute("SELECT 1 FROM users WHERE username = ?", (final_username,)).fetchone():
                final_username = f"{username}{idx}"
                idx += 1
            conn.execute(
                "INSERT INTO users (username, hashed_password, google_sub, email, name, avatar_url) VALUES (?, ?, ?, ?, ?, ?)",
                (final_username, "", google_sub, email, name, avatar_url),
            )
            conn.commit()
            user_row = conn.execute("SELECT * FROM users WHERE google_sub = ?", (google_sub,)).fetchone()
        else:
            conn.execute(
                "UPDATE users SET email = ?, name = ?, avatar_url = ? WHERE google_sub = ?",
                (email, name, avatar_url, google_sub),
            )
            conn.commit()
            user_row = conn.execute("SELECT * FROM users WHERE google_sub = ?", (google_sub,)).fetchone()
        conn.close()

        app_token = create_access_token({"sub": user_row["username"]}, expires_delta=timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES))
        return AuthResponse(
            access_token=app_token,
            username=user_row["username"],
            email=user_row.get("email") if isinstance(user_row, dict) else user_row["email"],
            name=user_row.get("name") if isinstance(user_row, dict) else user_row["name"],
            avatar_url=user_row.get("avatar_url") if isinstance(user_row, dict) else user_row["avatar_url"],
        )
    except Exception as e:
        logger.error(f"Google auth failed: {e}")
        raise HTTPException(status_code=401, detail="Invalid Google ID token")

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
