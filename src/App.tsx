import React from 'react';
import { useState } from 'react';
import { BrainCircuit, BookOpen, Calendar, CheckSquare, ExternalLink, Clock, Target, Users, Globe } from 'lucide-react';
import LearningForm from './components/LearningForm';
import LearningPlan from './components/LearningPlan';
import { LearningGoal, LearningPlanData } from './types';

function App() {
  const [currentPlan, setCurrentPlan] = useState<LearningPlanData | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleGeneratePlan = async (goal: LearningGoal) => {
    setIsGenerating(true);
    setError(null);
    
    try {
      // Try to connect to backend first, fall back to mock if unavailable
      const backendUrl = import.meta.env.VITE_BACKEND_URL || 'http://localhost:8000';
      
      const response = await fetch(`${backendUrl}/generate-plan`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(goal),
      });

      if (!response.ok) {
        throw new Error(`Backend error: ${response.status}`);
      }

      const planData = await response.json();
      setCurrentPlan(planData);
    } catch (error) {
      console.warn('Backend not available, using mock data:', error);
      // Fallback to mock data if backend is not available
      await new Promise(resolve => setTimeout(resolve, 1500));
      const mockPlan = generateMockPlan(goal);
      setCurrentPlan(mockPlan);
    } finally {
      setIsGenerating(false);
    }
  };

  const generateMockPlan = (goal: LearningGoal): LearningPlanData => {
    const daysPerWeek = Math.min(7, Math.ceil(goal.duration / 4));
    const weeksNeeded = Math.ceil(goal.duration / daysPerWeek);
    
    return {
      skill: goal.skill,
      duration: goal.duration,
      language: goal.language,
      roadmap: [
        {
          milestone: `Foundation & Basics of ${goal.skill}`,
          description: `Establish core concepts and fundamental understanding`,
          timeframe: `Days 1-${Math.ceil(goal.duration * 0.3)}`,
          keyPoints: [
            "Learn basic terminology and concepts",
            "Understand core principles",
            "Set up necessary tools and environment",
            "Complete introductory exercises"
          ]
        },
        {
          milestone: `Intermediate Skills Development`,
          description: `Build practical skills and apply knowledge`,
          timeframe: `Days ${Math.ceil(goal.duration * 0.3) + 1}-${Math.ceil(goal.duration * 0.7)}`,
          keyPoints: [
            "Practice fundamental techniques",
            "Work on guided projects",
            "Learn best practices and patterns",
            "Build portfolio examples"
          ]
        },
        {
          milestone: `Advanced Applications & Mastery`,
          description: `Master complex concepts and real-world application`,
          timeframe: `Days ${Math.ceil(goal.duration * 0.7) + 1}-${goal.duration}`,
          keyPoints: [
            "Tackle advanced topics",
            "Complete independent projects",
            "Optimize and refine skills",
            "Prepare for practical application"
          ]
        }
      ],
      schedule: Array.from({ length: weeksNeeded }, (_, weekIndex) => ({
        week: weekIndex + 1,
        theme: weekIndex === 0 ? "Foundation Building" : 
               weekIndex < weeksNeeded - 1 ? "Skill Development" : "Mastery & Application",
        dailyTasks: Array.from({ length: daysPerWeek }, (_, dayIndex) => {
          const dayNumber = weekIndex * daysPerWeek + dayIndex + 1;
          if (dayNumber > goal.duration) return null;
          
          return {
            day: dayNumber,
            focus: weekIndex === 0 ? "Learn basics and setup" :
                   weekIndex < weeksNeeded - 1 ? "Practice and build" : "Apply and master",
            tasks: [
              "30-45 minutes of focused learning",
              "Practice exercises or hands-on work",
              "Review and note-taking",
              "Progress reflection"
            ],
            estimatedTime: "1-2 hours"
          };
        }).filter(Boolean)
      })),
      checklist: [
        { id: '1', task: `Set up learning environment for ${goal.skill}`, category: 'setup', completed: false },
        { id: '2', task: 'Complete introductory materials review', category: 'foundation', completed: false },
        { id: '3', task: 'Practice basic exercises daily', category: 'practice', completed: false },
        { id: '4', task: 'Join relevant communities or forums', category: 'community', completed: false },
        { id: '5', task: 'Complete first practical project', category: 'project', completed: false },
        { id: '6', task: 'Seek feedback from experts or peers', category: 'feedback', completed: false },
        { id: '7', task: 'Build portfolio showcase', category: 'portfolio', completed: false },
        { id: '8', task: 'Take practice tests or assessments', category: 'assessment', completed: false },
        { id: '9', task: 'Complete final capstone project', category: 'project', completed: false },
        { id: '10', task: 'Plan next steps for continued learning', category: 'planning', completed: false }
      ],
      resources: [
        {
          milestone: "Foundation & Basics",
          links: [
            { title: "Official Documentation", url: "https://example.com", type: "documentation" },
            { title: "Beginner's Guide Tutorial", url: "https://example.com", type: "tutorial" },
            { title: "Interactive Learning Platform", url: "https://example.com", type: "interactive" },
            { title: "Community Forum", url: "https://example.com", type: "community" },
            { title: "Video Course Series", url: "https://example.com", type: "video" }
          ]
        },
        {
          milestone: "Intermediate Skills",
          links: [
            { title: "Advanced Techniques Guide", url: "https://example.com", type: "guide" },
            { title: "Practice Projects Repository", url: "https://example.com", type: "practice" },
            { title: "Expert Insights Blog", url: "https://example.com", type: "blog" },
            { title: "Tools and Resources List", url: "https://example.com", type: "tools" }
          ]
        },
        {
          milestone: "Advanced Applications",
          links: [
            { title: "Real-world Case Studies", url: "https://example.com", type: "case-study" },
            { title: "Industry Best Practices", url: "https://example.com", type: "best-practices" },
            { title: "Professional Certification", url: "https://example.com", type: "certification" },
            { title: "Job Market Insights", url: "https://example.com", type: "career" }
          ]
        }
      ]
    };
  };

  const resetPlan = () => {
    setCurrentPlan(null);
    setError(null);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50">
      {/* Header */}
      <header className="bg-white/80 backdrop-blur-sm border-b border-blue-100 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-gradient-to-r from-blue-500 to-purple-600 rounded-xl">
                <BrainCircuit className="h-6 w-6 text-white" />
              </div>
              <div>
                <h1 className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                  Learn_mate
                </h1>
                <p className="text-sm text-gray-600">AI-Powered Learning Guide Agent</p>
              </div>
            </div>
            
            {currentPlan && (
              <button
                onClick={resetPlan}
                className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors duration-200 font-medium"
              >
                New Plan
              </button>
            )}
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {error && (
          <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
            <p className="text-red-700">{error}</p>
          </div>
        )}

        {!currentPlan ? (
          <>
            {/* Hero Section */}
            <div className="text-center mb-12">
              <div className="inline-flex items-center space-x-2 bg-blue-100 text-blue-700 px-4 py-2 rounded-full text-sm font-medium mb-6">
                <Globe className="h-4 w-4" />
                <span>Supports Multiple Languages</span>
              </div>
              <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
                Your Personal AI
                <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                  {' '}Learning Coach
                </span>
              </h2>
              <p className="text-xl text-gray-600 max-w-3xl mx-auto mb-8">
                Get a personalized learning roadmap, daily schedule, actionable checklist, and curated resources 
                tailored to your goals and timeline.
              </p>

              {/* Feature Cards */}
              <div className="grid md:grid-cols-4 gap-6 mb-12">
                <div className="bg-white/60 backdrop-blur-sm rounded-xl p-6 border border-blue-100 hover:bg-white/80 transition-all duration-200">
                  <Target className="h-8 w-8 text-blue-500 mx-auto mb-3" />
                  <h3 className="font-semibold text-gray-900 mb-2">Smart Roadmap</h3>
                  <p className="text-sm text-gray-600">Milestone-based learning path</p>
                </div>
                <div className="bg-white/60 backdrop-blur-sm rounded-xl p-6 border border-blue-100 hover:bg-white/80 transition-all duration-200">
                  <Calendar className="h-8 w-8 text-purple-500 mx-auto mb-3" />
                  <h3 className="font-semibold text-gray-900 mb-2">Daily Schedule</h3>
                  <p className="text-sm text-gray-600">Structured daily learning plan</p>
                </div>
                <div className="bg-white/60 backdrop-blur-sm rounded-xl p-6 border border-blue-100 hover:bg-white/80 transition-all duration-200">
                  <CheckSquare className="h-8 w-8 text-green-500 mx-auto mb-3" />
                  <h3 className="font-semibold text-gray-900 mb-2">Action Checklist</h3>
                  <p className="text-sm text-gray-600">Track progress with tasks</p>
                </div>
                <div className="bg-white/60 backdrop-blur-sm rounded-xl p-6 border border-blue-100 hover:bg-white/80 transition-all duration-200">
                  <BookOpen className="h-8 w-8 text-orange-500 mx-auto mb-3" />
                  <h3 className="font-semibold text-gray-900 mb-2">Curated Resources</h3>
                  <p className="text-sm text-gray-600">Quality learning materials</p>
                </div>
              </div>
            </div>

            {/* Learning Form */}
            <LearningForm onSubmit={handleGeneratePlan} isGenerating={isGenerating} />
          </>
        ) : (
          <LearningPlan plan={currentPlan} />
        )}
      </main>
    </div>
  );
}

export default App;