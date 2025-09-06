import React, { useState, useEffect, useRef } from 'react';
import { 
  Send, Bot, User, Sparkles, Zap, BookOpen, Code, Brain, 
  Database, Lightbulb, FolderPlus, LayoutDashboard
} from 'lucide-react';

// Enhanced local suggestion engine with more learning paths
const TEMPLATES = {
  React: {
    checklist: ['Read React docs', 'Build a TODO app', 'Learn Hooks', 'Practice state management', 'Create a portfolio project'],
    roadmap: ['JSX & Components', 'State & Props', 'Hooks', 'Context API', 'React Router', 'State Management (Redux/Zustand)', 'Testing', 'Deployment'],
    schedule: [
      'Week 1: JSX & Components - Learn basic React syntax and component structure',
      'Week 2: State & Props - Master component communication and state management',
      'Week 3: Hooks & Context - Explore modern React patterns and state sharing',
      'Week 4: Routing & API Integration - Build multi-page apps with data fetching',
      'Week 5-6: Build a project - Create a complete React application portfolio'
    ],
    resources: [
      'https://react.dev',
      'https://beta.reactjs.org',
      'https://www.youtube.com/c/TraversyMedia',
      'https://scrimba.com/learn/learnreact',
      'https://www.udemy.com/course/react-the-complete-guide-incl-redux/',
      'https://www.freecodecamp.org/news/learn-react-js-in-this-crash-course/'
    ]
  },
  Python: {
    checklist: ['Install Python', 'Setup development environment', 'Master basic syntax', 'Learn data structures', 'Practice OOP concepts', 'Build a command-line app'],
    roadmap: ['Syntax & Basics', 'Data Structures', 'Functions & OOP', 'Modules & Packages', 'File I/O', 'Error Handling', 'Web Frameworks (Flask/Django)', 'Data Analysis (Pandas)'],
    schedule: [
      'Week 1: Syntax & Basics - Learn Python fundamentals and basic programming concepts',
      'Week 2: Data Structures & Functions - Master lists, dictionaries, and function creation',
      'Week 3: OOP & Modules - Understand classes, objects, and code organization',
      'Week 4: Project Development - Build practical applications and solve real problems',
      'Week 5: Framework Introduction - Explore web development with Flask or Django'
    ],
    resources: [
      'https://docs.python.org/3',
      'https://realpython.com',
      'https://www.py4e.com',
      'https://automatetheboringstuff.com',
      'https://www.youtube.com/c/Coreyms',
      'https://www.coursera.org/learn/python'
    ]
  },
  JavaScript: {
    checklist: ['Learn syntax', 'Understand DOM manipulation', 'Master ES6+ features', 'Practice async programming', 'Build a web app'],
    roadmap: ['Syntax & Basics', 'DOM Manipulation', 'ES6+ Features', 'Async Programming', 'APIs & Fetch', 'Error Handling', 'Frameworks Introduction', 'Build Projects'],
    schedule: [
      'Week 1: Syntax & DOM - Learn JavaScript basics and browser manipulation',
      'Week 2: ES6+ & Functions - Master modern JavaScript features and functional programming',
      'Week 3: Async Programming - Understand promises, async/await, and API calls',
      'Week 4: APIs & Projects - Build real-world applications with external data',
      'Week 5: Framework Selection - Choose and learn a modern JavaScript framework'
    ],
    resources: [
      'https://javascript.info',
      'https://developer.mozilla.org/en-US/docs/Web/JavaScript',
      'https://www.freecodecamp.org',
      'https://www.codecademy.com/learn/introduction-to-javascript',
      'https://www.youtube.com/c/TheNetNinja',
      'https://www.udemy.com/course/the-complete-javascript-course/'
    ]
  },
  'Machine Learning': {
    checklist: ['Learn Python', 'Master NumPy & Pandas', 'Study statistics', 'Understand ML algorithms', 'Practice with datasets', 'Build a portfolio project'],
    roadmap: ['Python Fundamentals', 'Mathematics & Statistics', 'Data Preparation', 'ML Algorithms', 'Deep Learning Intro', 'Neural Networks', 'Model Deployment', 'Projects'],
    schedule: [
      'Month 1: Python & Math Foundations - Build programming and mathematical foundations',
      'Month 2: Data Analysis & Preparation - Master data manipulation and preprocessing',
      'Month 3: ML Algorithms - Learn supervised and unsupervised learning techniques',
      'Month 4: Neural Networks - Explore deep learning and neural network architectures',
      'Month 5-6: Projects & Portfolio - Build real ML projects and showcase your skills'
    ],
    resources: [
      'https://www.kaggle.com/learn',
      'https://www.coursera.org/specializations/machine-learning-introduction',
      'https://www.fast.ai',
      'https://www.tensorflow.org/tutorials',
      'https://www.youtube.com/c/KrishNaik',
      'https://www.udemy.com/course/machinelearning/'
    ]
  },
  'Web Development': {
    checklist: ['Learn HTML/CSS', 'Study JavaScript', 'Understand responsive design', 'Master a frontend framework', 'Learn backend basics', 'Build a full-stack project'],
    roadmap: ['HTML & CSS', 'JavaScript', 'Responsive Design', 'Frontend Framework (React/Vue/Angular)', 'Backend Basics', 'Databases', 'API Development', 'Deployment'],
    schedule: [
      'Month 1: HTML/CSS & JavaScript - Build strong frontend foundations',
      'Month 2: Frontend Framework - Master React, Vue, or Angular for modern web apps',
      'Month 3: Backend & Databases - Learn server-side development and data storage',
      'Month 4: Full-stack Integration - Connect frontend and backend seamlessly',
      'Month 5: Project & Deployment - Deploy your full-stack application to production'
    ],
    resources: [
      'https://www.freecodecamp.org',
      'https://www.theodinproject.com',
      'https://fullstackopen.com',
      'https://developer.mozilla.org/en-US/docs/Learn',
      'https://www.youtube.com/c/TraversyMedia',
      'https://www.udemy.com/course/the-complete-web-developer-zero-to-mastery/'
    ]
  },
  'Data Science': {
    checklist: ['Learn Python', 'Master data analysis libraries', 'Study statistics', 'Learn visualization techniques', 'Practice with real datasets', 'Create a portfolio'],
    roadmap: ['Python Basics', 'Data Analysis (Pandas)', 'Data Visualization', 'Statistics', 'SQL & Databases', 'Machine Learning Basics', 'Big Data Tools', 'Projects'],
    schedule: [
      'Month 1: Python & Data Analysis - Learn Python and pandas for data manipulation',
      'Month 2: Visualization & Statistics - Master data visualization and statistical analysis',
      'Month 3: SQL & Databases - Understand data storage and querying techniques',
      'Month 4: ML Applications - Apply machine learning to data science problems',
      'Month 5-6: Projects & Portfolio - Build comprehensive data science projects'
    ],
    resources: [
      'https://www.datacamp.com',
      'https://www.kaggle.com',
      'https://www.coursera.org/specializations/data-science',
      'https://www.edx.org/professional-certificate/harvardx-data-science',
      'https://www.youtube.com/c/KenJee_ds',
      'https://www.udemy.com/course/python-for-data-science-and-machine-learning-bootcamp/'
    ]
  },
  'Java': {
    checklist: ['Install Java JDK', 'Setup development environment (IDE)', 'Learn basic syntax', 'Understand OOP concepts', 'Practice data structures', 'Build a portfolio project'],
    roadmap: ['Java Basics', 'Object-Oriented Programming', 'Data Structures', 'Algorithms', 'Collections Framework', 'Exception Handling', 'File I/O', 'Advanced Topics'],
    schedule: [
      'Week 1: Java Basics - Learn syntax, variables, control structures, and methods',
      'Week 2: OOP Concepts - Master classes, objects, inheritance, and polymorphism',
      'Week 3: Data Structures - Learn arrays, linked lists, stacks, and queues',
      'Week 4: Algorithms - Practice sorting, searching, and problem-solving techniques',
      'Week 5-6: Advanced Topics - Explore collections, exceptions, and file handling'
    ],
    resources: [
      'https://docs.oracle.com/javase/tutorial/',
      'https://www.w3schools.com/java/',
      'https://www.geeksforgeeks.org/java/',
      'https://www.youtube.com/c/ProgrammingwithMosh',
      'https://www.udemy.com/course/java-tutorial/',
      'https://www.coursera.org/learn/java-programming'
    ]
  },
  'DSA': {
    checklist: ['Learn programming basics', 'Master fundamental data structures', 'Practice algorithm patterns', 'Solve coding problems', 'Participate in contests', 'Build problem-solving skills'],
    roadmap: ['Programming Fundamentals', 'Basic Data Structures', 'Advanced Data Structures', 'Algorithm Analysis', 'Problem Solving', 'Competitive Programming'],
    schedule: [
      'Week 1-2: Programming Fundamentals - Master basic programming concepts and syntax',
      'Week 3-4: Basic Data Structures - Learn arrays, linked lists, stacks, queues, and trees',
      'Week 5-6: Advanced Data Structures - Master heaps, graphs, and advanced tree structures',
      'Week 7-8: Algorithm Analysis - Understand time/space complexity and optimization',
      'Week 9-10: Problem Solving - Practice on platforms like LeetCode and HackerRank'
    ],
    resources: [
      'https://leetcode.com',
      'https://www.hackerrank.com',
      'https://www.geeksforgeeks.org/data-structures/',
      'https://www.youtube.com/c/BackToBackSWE',
      'https://www.udemy.com/course/data-structures-algorithms-java/',
      'https://www.coursera.org/specializations/data-structures-algorithms'
    ]
  }
};

export default function Chatbot({ onSuggest, darkMode = false }) {
  const [query, setQuery] = useState('');
  const [loading, setLoading] = useState(false);
  const [messages, setMessages] = useState([
    { text: "Hello! I'm your learning assistant. What would you like to learn today?", isUser: false }
  ]);
  const messagesEndRef = useRef(null);

  // Auto-scroll to bottom when new messages are added
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, loading]);

  const findBestMatch = (input) => {
    // Convert input to lowercase for case-insensitive matching
    const userInput = input.toLowerCase();
    
    // First try direct matches with template keys
    const directMatch = Object.keys(TEMPLATES).find(k => 
      k.toLowerCase() === userInput
    );
    
    if (directMatch) return directMatch;
    
    // Try partial matches
    const partialMatch = Object.keys(TEMPLATES).find(k => 
      userInput.includes(k.toLowerCase()) || k.toLowerCase().includes(userInput)
    );
    
    if (partialMatch) return partialMatch;
    
    // Check for topic keywords
    const keywords = {
      'javascript': 'JavaScript',
      'js': 'JavaScript',
      'python': 'Python',
      'py': 'Python',
      'react': 'React', 
      'reactjs': 'React',
      'machine learning': 'Machine Learning',
      'ml': 'Machine Learning',
      'ai': 'Machine Learning',
      'artificial intelligence': 'Machine Learning',
      'web': 'Web Development',
      'frontend': 'Web Development',
      'backend': 'Web Development',
      'fullstack': 'Web Development',
      'data science': 'Data Science',
      'data analysis': 'Data Science',
      'java': 'Java',
      'dsa': 'DSA',
      'data structures': 'DSA',
      'algorithms': 'DSA',
      'data structures and algorithms': 'DSA'
    };
    
    for (const [keyword, template] of Object.entries(keywords)) {
      if (userInput.includes(keyword)) {
        return template;
      }
    }
    
    return null;
  };

  const handleSuggest = () => {
    console.log('handleSuggest called with query:', query);
    if (!query.trim() || loading) return;
    
    // Add user message
    const userMessage = query.trim();
    console.log('Adding user message:', userMessage);
    setMessages(prev => [...prev, { text: userMessage, isUser: true }]);
    
    setLoading(true);
    
    // Find the best matching template
    const matchedTopic = findBestMatch(userMessage);
    const template = matchedTopic ? TEMPLATES[matchedTopic] : null;
    
    setTimeout(() => {
      setLoading(false);
      
      if (template) {
        // Add assistant response
        const response = `I've created a learning plan for ${matchedTopic}! Check out the roadmap, schedule, and resources.`;
        console.log('Template found, calling onSuggest with:', template);
        setMessages(prev => [...prev, { text: response, isUser: false }]);
        onSuggest({ 
          checklist: template.checklist, 
          roadmap: template.roadmap, 
          schedule: template.schedule, 
          resources: template.resources,
          topic: matchedTopic
        });
      } else {
        // Create a generic learning plan
        const response = "I don't have a specific template for that topic yet, but I've created a general learning framework to help you get started!";
        setMessages(prev => [...prev, { text: response, isUser: false }]);
        
        onSuggest({ 
          checklist: [
            'Research fundamentals of the topic',
            'Find beginner-friendly tutorials', 
            'Join a community forum or group',
            'Complete a small project',
            'Get feedback from peers'
          ], 
          roadmap: [
            'Topic Overview', 
            'Core Concepts', 
            'Hands-on Practice', 
            'Applied Projects',
            'Advanced Topics',
            'Specialization'
          ], 
          schedule: [
            'Week 1-2: Learn the fundamentals',
            'Week 3-4: Practice with exercises',
            'Week 5-6: Build a small project',
            'Week 7-8: Expand knowledge with advanced topics'
          ], 
          resources: [
            'https://www.coursera.org',
            'https://www.udemy.com', 
            'https://www.youtube.com/learning'
          ],
          topic: userMessage
        });
      }
      
      // Clear the input
      setQuery('');
    }, 800);
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSuggest();
    }
  };

  const handleInputChange = (e) => {
    setQuery(e.target.value);
    // Auto-resize textarea on mobile for better UX
    if (window.innerWidth <= 768) {
      e.target.style.height = 'auto';
      e.target.style.height = Math.min(e.target.scrollHeight, 120) + 'px';
    }
  };

  const quickSuggestOptions = [
    { name: 'JavaScript', icon: Code, color: 'from-yellow-500 to-orange-600' },
    { name: 'Machine Learning', icon: Brain, color: 'from-purple-500 to-pink-600' },
    { name: 'Python', icon: Zap, color: 'from-blue-500 to-teal-600' },
    { name: 'Data Science', icon: Database, color: 'from-green-500 to-emerald-600' },
    { name: 'Java', icon: BookOpen, color: 'from-red-500 to-rose-600' },
    { name: 'DSA', icon: Lightbulb, color: 'from-indigo-500 to-purple-600' }
  ];

  const handleQuickSuggest = (topic) => {
    setQuery(topic);
    setTimeout(() => handleSuggest(), 100);
  };

  return (
    <div className={`flex flex-col h-full rounded-xl lg:rounded-2xl shadow-xl lg:shadow-2xl overflow-hidden ${
      darkMode 
        ? 'bg-gradient-to-br from-slate-900/95 via-slate-800/95 to-slate-900/95 backdrop-blur-xl border border-slate-700/50' 
        : 'bg-gradient-to-br from-white/95 via-blue-50/95 to-indigo-50/95 backdrop-blur-xl border border-white/50'
    }`} style={{ 
      WebkitTapHighlightColor: 'transparent',
      WebkitTouchCallout: 'none',
      WebkitUserSelect: 'none',
      touchAction: 'manipulation'
    }}>
      {/* Header */}
      <div className={`px-3 sm:px-4 lg:px-6 py-3 sm:py-4 border-b ${
        darkMode 
          ? 'border-slate-700/50 bg-gradient-to-r from-slate-800/80 to-slate-900/80' 
          : 'border-blue-100/50 bg-gradient-to-r from-blue-50/80 to-indigo-50/80'
      }`}>
        <div className="flex items-center gap-2 sm:gap-3">
          <div className={`p-1.5 sm:p-2 rounded-lg sm:rounded-xl ${
            darkMode 
              ? 'bg-gradient-to-br from-blue-600 to-purple-700 shadow-lg shadow-blue-500/25' 
              : 'bg-gradient-to-br from-blue-500 to-purple-600 shadow-lg shadow-blue-500/25'
          }`}>
            <Bot className="h-4 w-4 sm:h-5 sm:w-5 text-white" />
          </div>
          <div className="flex-1 min-w-0">
            <h3 className={`font-bold text-sm sm:text-base lg:text-lg truncate ${darkMode ? 'text-white' : 'text-gray-900'}`}>
              Learning Assistant
            </h3>
            <p className={`text-xs sm:text-sm truncate ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
              AI-powered study companion
            </p>
          </div>
          <div className="flex-shrink-0">
            <Sparkles className={`h-4 w-4 sm:h-5 sm:w-5 ${darkMode ? 'text-yellow-400' : 'text-yellow-500'} animate-pulse`} />
          </div>
        </div>
      </div>
      
             {/* Chat Messages */}
       <div className={`flex-1 overflow-y-auto p-2 sm:p-3 lg:p-4 space-y-2 sm:space-y-3 lg:space-y-4 ${
         darkMode ? 'bg-slate-900/20' : 'bg-white/20'
       }`} style={{maxHeight: 'calc(100vh - 280px)', minHeight: '200px'}}>
        {messages.map((msg, idx) => (
          <div key={idx} className={`flex ${msg.isUser ? 'justify-end' : 'justify-start'} animate-fadeIn`}>
            <div className={`flex items-start gap-2 sm:gap-3 max-w-[90%] sm:max-w-[85%] ${msg.isUser ? 'flex-row-reverse' : ''}`}>
              <div className={`p-1.5 sm:p-2 rounded-full flex-shrink-0 ${
                msg.isUser 
                  ? (darkMode ? 'bg-blue-600' : 'bg-blue-500')
                  : (darkMode ? 'bg-slate-700' : 'bg-gray-200')
              }`}>
                {msg.isUser ? (
                  <User className="h-3 w-3 sm:h-4 sm:w-4 text-white" />
                ) : (
                  <Bot className={`h-3 w-3 sm:h-4 sm:w-4 ${darkMode ? 'text-gray-300' : 'text-gray-600'}`} />
                )}
              </div>
              <div className={`p-2 sm:p-3 lg:p-4 rounded-xl sm:rounded-2xl shadow-lg ${
                msg.isUser 
                  ? 'bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-br-sm sm:rounded-br-md'
                  : (darkMode 
                      ? 'bg-slate-800/90 text-gray-100 border border-slate-700/50 rounded-bl-sm sm:rounded-bl-md' 
                      : 'bg-white/90 text-gray-800 border border-gray-200/50 rounded-bl-sm sm:rounded-bl-md'
                    )
              }`}>
                <p className="text-xs sm:text-sm leading-relaxed break-words">{msg.text}</p>
              </div>
            </div>
          </div>
        ))}
        
        {loading && (
          <div className="flex justify-start animate-fadeIn">
            <div className="flex items-start gap-2 sm:gap-3">
              <div className={`p-1.5 sm:p-2 rounded-full ${darkMode ? 'bg-slate-700' : 'bg-gray-200'}`}>
                <Bot className={`h-3 w-3 sm:h-4 sm:w-4 ${darkMode ? 'text-gray-300' : 'text-gray-600'}`} />
              </div>
              <div className={`p-2 sm:p-3 lg:p-4 rounded-xl sm:rounded-2xl rounded-bl-sm sm:rounded-bl-md shadow-lg ${
                darkMode 
                  ? 'bg-slate-800/90 border border-slate-700/50' 
                  : 'bg-white/90 border border-gray-200/50'
              }`}>
                <div className="flex space-x-1">
                  <div className={`w-1.5 h-1.5 sm:w-2 sm:h-2 rounded-full animate-bounce ${darkMode ? 'bg-blue-400' : 'bg-blue-500'}`}></div>
                  <div className={`w-1.5 h-1.5 sm:w-2 sm:h-2 rounded-full animate-bounce delay-100 ${darkMode ? 'bg-blue-400' : 'bg-blue-500'}`}></div>
                  <div className={`w-1.5 h-1.5 sm:w-2 sm:h-2 rounded-full animate-bounce delay-200 ${darkMode ? 'bg-blue-400' : 'bg-blue-500'}`}></div>
                </div>
              </div>
            </div>
          </div>
        )}
        
        {/* Scroll anchor */}
        <div ref={messagesEndRef} />
      </div>
      
      {/* Input Area */}
      <div className={`p-2 sm:p-3 lg:p-4 border-t ${
        darkMode 
          ? 'border-slate-700/50 bg-gradient-to-r from-slate-800/50 to-slate-900/50' 
          : 'border-blue-100/50 bg-gradient-to-r from-blue-50/50 to-indigo-50/50'
      }`}>
        <div className="flex gap-2 sm:gap-3 mb-2 sm:mb-3 lg:mb-4">
          <div className="flex-1 relative">
            <textarea 
              value={query} 
              onChange={handleInputChange}
              onKeyPress={handleKeyPress}
              placeholder="What would you like to learn today?" 
              className={`w-full border rounded-lg sm:rounded-xl px-3 sm:px-4 py-2 sm:py-3 pr-10 sm:pr-12 transition-all duration-200 focus:outline-none focus:ring-2 text-xs sm:text-sm resize-none overflow-hidden ${
                darkMode 
                  ? 'bg-slate-700/80 border-slate-600 text-gray-100 placeholder-gray-400 focus:border-blue-500 focus:ring-blue-500/20 focus:bg-slate-700' 
                  : 'bg-white/80 border-gray-300 text-gray-900 placeholder-gray-500 focus:border-blue-500 focus:ring-blue-500/20 focus:bg-white'
              }`}
              rows={1}
              style={{ 
                minHeight: window.innerWidth <= 768 ? '36px' : '44px',
                maxHeight: '120px'
              }}
              disabled={loading}
            />
          </div>
          <button 
            onClick={handleSuggest} 
            disabled={loading || !query.trim()}
            className={`px-3 sm:px-4 lg:px-6 py-2 sm:py-3 rounded-lg sm:rounded-xl font-semibold transition-all duration-200 flex items-center gap-1 sm:gap-2 shadow-lg text-xs sm:text-sm ${
              loading || !query.trim() 
                ? (darkMode ? 'bg-gray-700 text-gray-500 cursor-not-allowed' : 'bg-gray-300 text-gray-500 cursor-not-allowed')
                : 'bg-gradient-to-r from-blue-500 to-blue-600 text-white hover:from-blue-600 hover:to-blue-700 hover:shadow-xl hover:scale-105 active:scale-95'
            }`}
          >
            <Send className="h-3 w-3 sm:h-4 sm:w-4" />
            <span className="hidden sm:inline">Send</span>
          </button>
        </div>
        
        {/* Quick Suggestions */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 xl:grid-cols-6 gap-1 sm:gap-2">
          {quickSuggestOptions.map((option, idx) => {
            const IconComponent = option.icon;
            return (
              <button 
                key={idx}
                onClick={() => handleQuickSuggest(option.name)} 
                disabled={loading}
                className={`flex items-center justify-center sm:justify-start gap-1 sm:gap-2 px-1.5 sm:px-2 lg:px-3 py-1.5 sm:py-2 rounded-md sm:rounded-lg text-xs font-medium transition-all duration-200 min-w-0 touch-manipulation ${
                  loading 
                    ? 'opacity-50 cursor-not-allowed' 
                    : `bg-gradient-to-r ${option.color} text-white hover:shadow-lg hover:scale-105 active:scale-95 active:bg-opacity-80`
                }`}
                style={{ 
                  minHeight: window.innerWidth <= 640 ? '32px' : '36px'
                }}
              >
                <IconComponent className="h-3 w-3 flex-shrink-0" />
                <span className="truncate text-xs sm:text-xs hidden xs:inline sm:inline lg:inline">
                  {window.innerWidth <= 640 ? option.name.split(' ')[0] : option.name}
                </span>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}