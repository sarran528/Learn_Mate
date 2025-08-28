import React, { useState } from 'react';

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
  }
};

export default function Chatbot({ onSuggest }) {
  const [query, setQuery] = useState('');
  const [loading, setLoading] = useState(false);
  const [messages, setMessages] = useState([
    { text: "Hello! I'm your learning assistant. What would you like to learn today?", isUser: false }
  ]);

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
      'data analysis': 'Data Science'
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
    if (!query.trim()) return;
    
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
          resources: template.resources 
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
          ]
        });
      }
      
      // Clear the input
      setQuery('');
    }, 800);
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      handleSuggest();
    }
  };

  return (
    <div className="p-4 bg-white rounded shadow">
      <h3 className="font-semibold mb-2">Learning Assistant</h3>
      
      {/* Chat message display area */}
      <div className="mb-3 h-64 overflow-y-auto border rounded p-3 bg-gray-50">
        {messages.map((msg, idx) => (
          <div key={idx} className={`mb-2 ${msg.isUser ? 'text-right' : ''}`}>
            <div className={`inline-block px-3 py-2 rounded-lg ${
              msg.isUser 
                ? 'bg-blue-600 text-white rounded-br-none' 
                : 'bg-gray-200 text-gray-800 rounded-bl-none'
            }`}>
              {msg.text}
            </div>
            <div className={`text-xs text-gray-500 mt-1 ${msg.isUser ? 'text-right' : ''}`}>
              {msg.isUser ? 'You' : 'Assistant'}
            </div>
          </div>
        ))}
        {loading && (
          <div className="text-gray-500 text-sm">
            <span className="inline-block animate-bounce">●</span>
            <span className="inline-block animate-bounce delay-100">●</span>
            <span className="inline-block animate-bounce delay-200">●</span>
          </div>
        )}
      </div>
      
      {/* Input area */}
      <div className="flex gap-2">
        <input 
          value={query} 
          onChange={e => setQuery(e.target.value)}
          onKeyPress={handleKeyPress}
          placeholder="What do you want to learn? (e.g. JavaScript, Machine Learning)" 
          className="flex-grow border rounded px-3 py-2" 
        />
        <button 
          onClick={() => {
            console.log('Send button clicked');
            handleSuggest();
          }} 
          disabled={loading || !query.trim()}
          className={`px-4 py-2 bg-blue-600 text-white rounded ${
            loading || !query.trim() ? 'opacity-50 cursor-not-allowed' : 'hover:bg-blue-700'
          }`}
        >
          Send
        </button>
      </div>
      
      {/* Quick suggestions */}
      <div className="mt-3 flex flex-wrap gap-2">
        <button 
          onClick={() => { 
            console.log('JavaScript button clicked');
            setQuery('JavaScript'); 
            setTimeout(() => handleSuggest(), 100);
          }} 
          className="px-2 py-1 text-xs border rounded text-blue-600 hover:bg-blue-50"
        >
          JavaScript
        </button>
        <button 
          onClick={() => { setQuery('Machine Learning'); handleSuggest(); }} 
          className="px-2 py-1 text-xs border rounded text-blue-600 hover:bg-blue-50"
        >
          Machine Learning
        </button>
        <button 
          onClick={() => { setQuery('Python'); handleSuggest(); }} 
          className="px-2 py-1 text-xs border rounded text-blue-600 hover:bg-blue-50"
        >
          Python
        </button>
        <button 
          onClick={() => { setQuery('Data Science'); handleSuggest(); }} 
          className="px-2 py-1 text-xs border rounded text-blue-600 hover:bg-blue-50"
        >
          Data Science
        </button>
      </div>
    </div>
  );
}
