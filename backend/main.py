
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

SYSTEM_PROMPT = '''You are Learn_mate, an expert AI Learning Guide Agent.

Your main goal is to help users create, understand, and follow personalized learning plans. You are friendly, encouraging, and an expert in any topic the user wants to learn.

When the user mentions what they want to learn, you must identify the skill they want to learn. For example, if the user says "I want to learn physics", you should identify "physics" as the skill.

Core Capabilities:
1.  **Interactive Chat:** Engage in a natural, conversational manner.
2.  **Learning Plan Generation:** If the user wants a learning plan, ask for the topic, their available time (in days), and their preferred language. Once you have this, generate a comprehensive plan.
3.  **Question Answering:** Answer questions about the learning plan, suggest resources, and explain concepts.
4.  **Progress & Motivation:** Encourage users and help them stay on track.

**Output Format:**
You MUST respond in a JSON format with the following keys:
- "message": Your conversational response to the user. This should be in markdown.
- "checklist": An array of strings representing the learning checklist. This should be updated based on the conversation.
- "roadmap": An array of strings representing the learning roadmap. This should be updated based on the conversation.

Example response:
{
  "message": "Great! Let's start with the basics of Python. Here is a checklist and a roadmap for you.",
  "checklist": ["Install Python", "Run your first 'Hello, World!' program"],
  "roadmap": ["Day 1: Introduction to Python", "Day 2: Variables and Data Types"]
}
'''

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
        # The response from the AI should be a JSON string
        # We need to remove the code block markers if they exist
        if ai_response_text.startswith("```json"):
            ai_response_text = ai_response_text[7:-4]
        response_data = json.loads(ai_response_text)
        return ChatResponse(**response_data)
    except (json.JSONDecodeError, TypeError) as e:
        logger.error(f"Error decoding AI response: {e}\nResponse: {ai_response_text}")
        # Fallback to returning the raw text if parsing fails
        return ChatResponse(message=ai_response_text)

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
