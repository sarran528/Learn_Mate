from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import List, Dict, Any
import os
from dotenv import load_dotenv
from langchain_openai import ChatOpenAI
from langchain.schema import HumanMessage, SystemMessage
import json
import logging

load_dotenv()

app = FastAPI(title="Learn_mate API", version="1.0.0")

# Configure CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173", "http://localhost:3000"],  # Vite and Next.js default ports
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Configure logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

# Initialize OpenAI model
try:
    llm = ChatOpenAI(
        model="gpt-4o-mini",
        temperature=0.7,
        openai_api_key=os.getenv("OPENAI_API_KEY")
    )
except Exception as e:
    logger.error(f"Failed to initialize OpenAI model: {e}")
    llm = None

class LearningGoal(BaseModel):
    skill: str
    duration: int
    language: str

class LearningPlan(BaseModel):
    skill: str
    duration: int
    language: str
    roadmap: List[Dict[str, Any]]
    schedule: List[Dict[str, Any]]
    checklist: List[Dict[str, Any]]
    resources: List[Dict[str, Any]]

@app.get("/")
async def root():
    return {"message": "Learn_mate API is running!", "version": "1.0.0"}

@app.get("/health")
async def health_check():
    return {
        "status": "healthy",
        "openai_configured": llm is not None,
        "api_key_configured": bool(os.getenv("OPENAI_API_KEY"))
    }

def create_learning_prompt(skill: str, duration: int, language: str) -> str:
    return f"""You are an expert Learning Guide Agent called Learn_mate. Create a comprehensive, personalized learning plan.

User wants to learn: {skill}
Available time: {duration} days
Preferred language: {language}

Create a structured learning plan with the following components:

1. ROADMAP: 3 progressive milestones with:
   - milestone: Clear milestone name
   - description: What they'll achieve
   - timeframe: Days X-Y format
   - keyPoints: 4 specific learning objectives (array)

2. SCHEDULE: Weekly breakdown with:
   - week: Week number
   - theme: Week's focus area
   - dailyTasks: Array of daily tasks with:
     - day: Day number (1 to {duration})
     - focus: Daily learning focus
     - tasks: Array of 4 specific tasks
     - estimatedTime: Time estimate (e.g., "1-2 hours")

3. CHECKLIST: 10 actionable tasks with:
   - id: Sequential number as string
   - task: Specific actionable task
   - category: One of [setup, foundation, practice, community, project, feedback, portfolio, assessment, planning]
   - completed: false

4. RESOURCES: 3 groups (Foundation, Intermediate, Advanced) with:
   - milestone: Milestone name
   - links: Array of 4-5 resources with:
     - title: Resource name
     - url: Use realistic placeholder URLs (https://example.com)
     - type: One of [documentation, tutorial, interactive, community, video, guide, practice, blog, tools, case-study, best-practices, certification, career]

Respond ONLY with valid JSON matching this exact structure. All text should be in {language} except for the JSON keys which must remain in English.

Make the plan realistic, progressive, and tailored to the {duration}-day timeframe."""

@app.post("/generate-plan", response_model=LearningPlan)
async def generate_learning_plan(goal: LearningGoal):
    try:
        if not llm:
            raise HTTPException(status_code=500, detail="OpenAI model not configured. Please check your API key.")
        
        logger.info(f"Generating plan for skill: {goal.skill}, duration: {goal.duration} days, language: {goal.language}")
        
        # Create the prompt
        prompt = create_learning_prompt(goal.skill, goal.duration, goal.language)
        
        # Create messages for the LLM
        messages = [
            SystemMessage(content="You are Learn_mate, an expert AI learning guide. Always respond with valid JSON only."),
            HumanMessage(content=prompt)
        ]
        
        # Generate response
        response = llm.invoke(messages)
        
        # Parse the JSON response
        try:
            plan_data = json.loads(response.content)
        except json.JSONDecodeError as e:
            logger.error(f"Failed to parse LLM response as JSON: {e}")
            logger.error(f"LLM Response: {response.content}")
            raise HTTPException(status_code=500, detail="Failed to generate valid learning plan format")
        
        # Ensure the response has the required structure
        required_keys = ["roadmap", "schedule", "checklist", "resources"]
        for key in required_keys:
            if key not in plan_data:
                raise HTTPException(status_code=500, detail=f"Missing required field: {key}")
        
        # Add the input parameters to the response
        plan_data["skill"] = goal.skill
        plan_data["duration"] = goal.duration
        plan_data["language"] = goal.language
        
        logger.info("Successfully generated learning plan")
        return LearningPlan(**plan_data)
        
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Error generating learning plan: {e}")
        raise HTTPException(status_code=500, detail=f"Failed to generate learning plan: {str(e)}")

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)</parameter>