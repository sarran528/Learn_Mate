
from fastapi import FastAPI, HTTPException, Depends
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

Core Capabilities:
1.  **Interactive Chat:** Engage in a natural, conversational manner.
2.  **Learning Plan Generation:** If the user wants a learning plan, ask for the topic, their available time (in days), and their preferred language. Once you have this, generate a comprehensive plan.
3.  **Question Answering:** Answer questions about the learning plan, suggest resources, and explain concepts.
4.  **Progress & Motivation:** Encourage users and help them stay on track. (For now, just be encouraging in your responses).

When a user asks for a learning plan, respond in a conversational way, and you can format the plan using markdown for readability in a chat interface.
'''

# --- API Endpoints ---
@app.get("/")
async def root():
    return {"message": "Learn_mate Chat API is running!", "version": "3.0.0"}

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

async def get_current_user(token: str = Depends()):
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

    # Save user message to DB
    last_user_message = chat_history.messages[-1]
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

    return ChatResponse(message=ai_response_text)

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
