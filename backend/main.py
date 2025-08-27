
from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import List
import os
from dotenv import load_dotenv
from langchain_google_genai import ChatGoogleGenerativeAI
from langchain.schema import HumanMessage, SystemMessage, AIMessage
import logging

load_dotenv()

app = FastAPI(title="Learn_mate API", version="2.0.0")

# Configure CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:5173",
        "http://localhost:5174",
        "http://localhost:3000",
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Configure logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

# Initialize Gemini model
try:
    llm = ChatGoogleGenerativeAI(
        model="gemini-2.0-flash-exp",
        temperature=0.7,
        google_api_key=os.getenv("GEMINI_API_KEY"),
    )
except Exception as e:
    logger.error(f"Failed to initialize Gemini model: {e}")
    llm = None


class Message(BaseModel):
    text: str
    isUser: bool


class ChatHistory(BaseModel):
    messages: List[Message]


class ChatResponse(BaseModel):
    message: str


SYSTEM_PROMPT = """You are Learn_mate, an expert AI Learning Guide Agent.

Your main goal is to help users create, understand, and follow personalized learning plans. You are friendly, encouraging, and an expert in any topic the user wants to learn.

Core Capabilities:
1.  **Interactive Chat:** Engage in a natural, conversational manner.
2.  **Learning Plan Generation:** If the user wants a learning plan, ask for the topic, their available time (in days), and their preferred language. Once you have this, generate a comprehensive plan.
3.  **Question Answering:** Answer questions about the learning plan, suggest resources, and explain concepts.
4.  **Progress & Motivation:** Encourage users and help them stay on track. (For now, just be encouraging in your responses).

When a user asks for a learning plan, respond in a conversational way, and you can format the plan using markdown for readability in a chat interface.
"""


@app.get("/")
async def root():
    return {"message": "Learn_mate Chat API is running!", "version": "2.0.0"}


@app.get("/health")
async def health_check():
    return {
        "status": "healthy",
        "gemini_configured": llm is not None,
    }


@app.post("/chat", response_model=ChatResponse)
async def chat_with_agent(chat_history: ChatHistory):
    if not llm:
        raise HTTPException(status_code=500, detail="Gemini model not configured.")

    try:
        logger.info(f"Received chat history containing {len(chat_history.messages)} messages.")

        messages = [SystemMessage(content=SYSTEM_PROMPT)]
        for msg in chat_history.messages:
            if msg.isUser:
                messages.append(HumanMessage(content=msg.text))
            else:
                messages.append(AIMessage(content=msg.text))

        # Generate response
        response = llm.invoke(messages)
        ai_response_text = response.content

        logger.info(f"Sending AI response.")
        return ChatResponse(message=ai_response_text)

    except Exception as e:
        logger.error(f"Error in chat endpoint: {e}")
        raise HTTPException(
            status_code=500, detail=f"Failed to get response from agent: {str(e)}"
        )


if __name__ == "__main__":
    import uvicorn

    uvicorn.run(app, host="0.0.0.0", port=8000)
