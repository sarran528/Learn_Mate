
import React, { useState } from 'react';
import { Plus, Trash2, CheckCircle, Circle, Search, Target, ListTodo, Sparkles, MapPin, Edit3, Save, X, Flag, Award } from 'lucide-react';

interface WorkspaceProps {
  checklist: string[];
  roadmap: string[];
  setChecklist: (checklist: string[]) => void;
  setRoadmap: (roadmap: string[]) => void;
  darkMode: boolean;
}

const roadmapTemplates: Record<string, string[]> = {
  'react': [
    'Learn JSX and components',
    'Understand state and props',
    'Explore hooks',
    'Build a sample app',
    'Learn routing',
    'Deploy the app'
  ],
  'python': [
    'Learn Python syntax',
    'Understand data structures',
    'Practice with projects',
    'Explore libraries',
    'Build a CLI tool',
    'Deploy to cloud'
  ],
  'node': [
    'Learn Node.js basics',
    'Understand modules',
    'Build REST API',
    'Connect to database',
    'Add authentication',
    'Deploy server'
  ]
};

const checklistTemplates: Record<string, { task: string; done: boolean }[]> = {
  'react': [
    { task: 'Set up React project', done: false },
    { task: 'Create components', done: false },
    { task: 'Write tests', done: false }
  ],
  'python': [
    { task: 'Install Python', done: false },
    { task: 'Write scripts', done: false },
    { task: 'Test code', done: false }
  ],
  'node': [
    { task: 'Install Node.js', done: false },
    { task: 'Set up Express', done: false },
    { task: 'Write endpoints', done: false }
  ]
};

export default function Workspace({ checklist, roadmap, setChecklist, setRoadmap, darkMode }: WorkspaceProps) {
  const [search, setSearch] = useState('');
  const [newRoadmapStep, setNewRoadmapStep] = useState('');
  const [newChecklistTask, setNewChecklistTask] = useState('');
  const [topic, setTopic] = useState('');
  const [selectedTopic, setSelectedTopic] = useState('');
  const [viewMode, setViewMode] = useState<'list' | 'roadmap'>('roadmap');
  const [editingStep, setEditingStep] = useState<number | null>(null);
  const [editValue, setEditValue] = useState('');
  const [completedSteps, setCompletedSteps] = useState<Set<number>>(new Set());

  // Simulate topic suggestions
  const topicSuggestions = ['React', 'Python', 'Node', 'JavaScript', 'TypeScript', 'Vue', 'Angular', 'Django', 'Flask', 'Express'];
  const filteredSuggestions = topicSuggestions.filter(t => t.toLowerCase().includes(topic.toLowerCase()));

  // Filter roadmap and checklist by search
  const filteredRoadmap = roadmap.filter(step => step.toLowerCase().includes(search.toLowerCase()));
  const filteredChecklist = checklist.filter(item => item.toLowerCase().includes(search.toLowerCase()));

  // Calculate progress
  const progress = roadmap.length > 0 ? (completedSteps.size / roadmap.length) * 100 : 0;

  // Add roadmap step
  const addRoadmapStep = () => {
    if (newRoadmapStep.trim()) {
      const updatedRoadmap = [...roadmap, newRoadmapStep.trim()];
      setRoadmap(updatedRoadmap);
      setNewRoadmapStep('');
    }
  };

  // Remove roadmap step
  const removeRoadmapStep = (idx: number) => {
    const updatedRoadmap = roadmap.filter((_, i) => i !== idx);
    setRoadmap(updatedRoadmap);
    
    // Update completed steps
    const newCompletedSteps = new Set(completedSteps);
    newCompletedSteps.delete(idx);
    setCompletedSteps(newCompletedSteps);
  };

  // Edit roadmap step
  const startEditing = (idx: number, value: string) => {
    setEditingStep(idx);
    setEditValue(value);
  };

  const saveEdit = () => {
    if (editingStep !== null && editValue.trim()) {
      const updatedRoadmap = [...roadmap];
      updatedRoadmap[editingStep] = editValue.trim();
      setRoadmap(updatedRoadmap);
      setEditingStep(null);
      setEditValue('');
    }
  };

  const cancelEdit = () => {
    setEditingStep(null);
    setEditValue('');
  };

  // Toggle step completion
  const toggleStepCompletion = (idx: number) => {
    const newCompletedSteps = new Set(completedSteps);
    if (newCompletedSteps.has(idx)) {
      newCompletedSteps.delete(idx);
    } else {
      newCompletedSteps.add(idx);
    }
    setCompletedSteps(newCompletedSteps);
  };

  // Add checklist task
  const addChecklistTask = () => {
    if (newChecklistTask.trim()) {
      const updatedChecklist = [...checklist, newChecklistTask.trim()];
      setChecklist(updatedChecklist);
      setNewChecklistTask('');
    }
  };

  // Remove checklist task
  const removeChecklistTask = (idx: number) => {
    const updatedChecklist = checklist.filter((_, i) => i !== idx);
    setChecklist(updatedChecklist);
  };

  // Handle topic selection
  const handleSelectTopic = (t: string) => {
    setSelectedTopic(t);
    setTopic(t);
    // Update roadmap and checklist with templates
    const roadmapTemplate = roadmapTemplates[t.toLowerCase()] || [];
    const checklistTemplate = checklistTemplates[t.toLowerCase()] || [];
    setRoadmap(roadmapTemplate);
    setChecklist(checklistTemplate.map(item => item.task));
    setCompletedSteps(new Set()); // Reset progress for new topic
  };

  // Graphical Roadmap Component
  const GraphicalRoadmap = () => (
    <div className="flex-1 overflow-y-auto p-6 custom-scrollbar">
      {filteredRoadmap.length === 0 ? (
        <div className="text-center py-8">
          <div className={`p-4 rounded-xl inline-block mb-4 ${darkMode ? 'bg-slate-800/50' : 'bg-gray-50/50'}`}>
            <Target className={`h-8 w-8 ${darkMode ? 'text-gray-400' : 'text-gray-500'}`} />
          </div>
          <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
            No roadmap steps yet. Add your first step below!
          </p>
        </div>
      ) : (
        <div className="relative">
          {/* Progress Bar */}
          <div className="mb-6">
            <div className="flex items-center justify-between mb-2">
              <span className={`text-sm font-medium ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                Progress: {Math.round(progress)}%
              </span>
              <span className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                {completedSteps.size} of {roadmap.length} completed
              </span>
            </div>
            <div className={`w-full h-2 rounded-full ${darkMode ? 'bg-slate-700' : 'bg-gray-200'}`}>
              <div 
                className="h-2 rounded-full bg-gradient-to-r from-blue-500 via-purple-500 to-green-500 transition-all duration-500 ease-out"
                style={{ width: `${progress}%` }}
              ></div>
            </div>
          </div>

          {/* Road Path */}
          <div className="absolute left-8 top-16 bottom-0 w-1 bg-gradient-to-b from-blue-500 via-purple-500 to-green-500 rounded-full"></div>
          
          {/* Roadmap Steps */}
          <div className="space-y-8 ml-16">
            {filteredRoadmap.map((step, i) => {
              const isCompleted = completedSteps.has(i);
              const isNextStep = !isCompleted && i === Math.min(...Array.from(completedSteps).map(s => s + 1).filter(s => s < roadmap.length));
              
              return (
                <div key={i} className="relative group">
                  {/* Connection Line */}
                  {i < filteredRoadmap.length - 1 && (
                    <div className={`absolute left-6 top-12 w-0.5 h-8 transition-colors duration-300 ${
                      isCompleted 
                        ? 'bg-green-500' 
                        : darkMode ? 'bg-slate-600' : 'bg-gray-300'
                    }`}></div>
                  )}
                  
                  {/* Step Circle */}
                  <div 
                    className={`absolute left-0 top-2 w-12 h-12 rounded-full flex items-center justify-center text-white font-bold text-sm shadow-lg transition-all duration-300 cursor-pointer hover:scale-110 ${
                      isCompleted
                        ? 'bg-gradient-to-br from-green-500 to-emerald-600 shadow-green-500/25 animate-pulse'
                        : isNextStep
                        ? 'bg-gradient-to-br from-yellow-500 to-orange-500 shadow-yellow-500/25 animate-bounce'
                        : darkMode 
                          ? 'bg-gradient-to-br from-blue-600 to-purple-600 shadow-blue-500/25' 
                          : 'bg-gradient-to-br from-blue-500 to-purple-600 shadow-blue-500/25'
                    }`}
                    onClick={() => toggleStepCompletion(i)}
                    title={isCompleted ? 'Mark as incomplete' : 'Mark as complete'}
                  >
                    {isCompleted ? <CheckCircle className="h-6 w-6" /> : i + 1}
                  </div>
                  
                  {/* Step Content */}
                  <div className={`ml-16 p-4 rounded-xl border transition-all duration-300 hover:shadow-lg ${
                    isCompleted
                      ? `${darkMode ? 'bg-green-900/20 border-green-700' : 'bg-green-50 border-green-200'}`
                      : darkMode 
                        ? 'bg-slate-800/50 border-slate-700 hover:bg-slate-800' 
                        : 'bg-white border-gray-200 hover:bg-gray-50'
                  }`}>
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        {editingStep === i ? (
                          <div className="flex items-center space-x-2">
                            <input
                              type="text"
                              value={editValue}
                              onChange={(e) => setEditValue(e.target.value)}
                              onKeyDown={(e) => {
                                if (e.key === 'Enter') saveEdit();
                                if (e.key === 'Escape') cancelEdit();
                              }}
                              className={`flex-1 px-3 py-2 rounded-lg border-2 transition-all duration-300 focus:outline-none focus:ring-4 ${
                                darkMode 
                                  ? 'bg-slate-700 border-slate-600 text-gray-100 focus:border-blue-500 focus:ring-blue-500/20' 
                                  : 'bg-white border-gray-200 text-gray-900 focus:border-blue-500 focus:ring-blue-500/20'
                              }`}
                              autoFocus
                            />
                            <button
                              onClick={saveEdit}
                              className={`p-2 rounded-lg transition-all duration-300 hover:scale-110 ${
                                darkMode ? 'text-green-400 hover:bg-green-900/20' : 'text-green-600 hover:bg-green-50'
                              }`}
                              title="Save"
                            >
                              <Save className="h-4 w-4" />
                            </button>
                            <button
                              onClick={cancelEdit}
                              className={`p-2 rounded-lg transition-all duration-300 hover:scale-110 ${
                                darkMode ? 'text-red-400 hover:bg-red-900/20' : 'text-red-600 hover:bg-red-50'
                              }`}
                              title="Cancel"
                            >
                              <X className="h-4 w-4" />
                            </button>
                          </div>
                        ) : (
                          <div className="flex items-center space-x-3">
                            <MapPin className={`h-5 w-5 ${
                              isCompleted 
                                ? 'text-green-500' 
                                : darkMode ? 'text-blue-400' : 'text-blue-600'
                            }`} />
                            <span className={`font-medium transition-all duration-300 ${
                              isCompleted 
                                ? `${darkMode ? 'text-green-300 line-through' : 'text-green-700 line-through'}` 
                                : `${darkMode ? 'text-gray-100' : 'text-gray-900'}`
                            }`}>
                              {step}
                            </span>
                            {isCompleted && (
                              <Award className="h-4 w-4 text-yellow-500 animate-pulse" />
                            )}
                          </div>
                        )}
                      </div>
                      
                      {/* Action Buttons */}
                      <div className="flex items-center space-x-1 opacity-0 group-hover:opacity-100 transition-all duration-300">
                        {editingStep !== i && (
                          <button
                            onClick={() => startEditing(i, step)}
                            className={`p-2 rounded-lg transition-all duration-300 hover:scale-110 ${
                              darkMode ? 'text-blue-400 hover:bg-blue-900/20' : 'text-blue-600 hover:bg-blue-50'
                            }`}
                            title="Edit step"
                          >
                            <Edit3 className="h-4 w-4" />
                          </button>
                        )}
                        <button
                          onClick={() => removeRoadmapStep(i)}
                          className={`p-2 rounded-lg transition-all duration-300 hover:scale-110 ${
                            darkMode ? 'text-red-400 hover:bg-red-900/20' : 'text-red-500 hover:bg-red-50'
                          }`}
                          title="Remove step"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
          
          {/* Destination Flag */}
          <div className="ml-16 mt-8">
            <div className={`p-4 rounded-xl border-2 border-dashed transition-all duration-300 ${
              progress === 100
                ? `${darkMode ? 'border-green-500 bg-green-900/20' : 'border-green-500 bg-green-50'} animate-pulse`
                : `${darkMode ? 'border-slate-600 bg-slate-800/30' : 'border-gray-300 bg-gray-50/30'}`
            }`}>
              <div className="flex items-center space-x-3">
                <div className={`p-2 rounded-lg transition-all duration-300 ${
                  progress === 100
                    ? 'bg-green-600 animate-bounce'
                    : darkMode ? 'bg-slate-600' : 'bg-gray-400'
                }`}>
                  {progress === 100 ? (
                    <Award className="h-5 w-5 text-white" />
                  ) : (
                    <Flag className="h-5 w-5 text-white" />
                  )}
                </div>
                <div>
                  <h4 className={`font-semibold ${darkMode ? 'text-gray-100' : 'text-gray-900'}`}>
                    {progress === 100 ? '🎉 Journey Complete!' : 'Destination'}
                  </h4>
                  <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                    {progress === 100 
                      ? `Congratulations! You've mastered ${selectedTopic}`
                      : `Complete all steps to reach your ${selectedTopic} goal`
                    }
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );

  // List Roadmap Component
  const ListRoadmap = () => (
    <div className="flex-1 overflow-y-auto p-6 custom-scrollbar">
      {filteredRoadmap.length === 0 ? (
        <div className="text-center py-8">
          <div className={`p-4 rounded-xl inline-block mb-4 ${darkMode ? 'bg-slate-800/50' : 'bg-gray-50/50'}`}>
            <Target className={`h-8 w-8 ${darkMode ? 'text-gray-400' : 'text-gray-500'}`} />
          </div>
          <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
            No roadmap steps yet. Add your first step below!
          </p>
        </div>
      ) : (
        <div className="space-y-3">
          {filteredRoadmap.map((step, i) => {
            const isCompleted = completedSteps.has(i);
            
            return (
              <div 
                key={i} 
                className={`group flex items-center justify-between p-4 rounded-xl border transition-all duration-300 hover:shadow-lg ${
                  isCompleted
                    ? `${darkMode ? 'bg-green-900/20 border-green-700' : 'bg-green-50 border-green-200'}`
                    : darkMode 
                      ? 'bg-slate-800/50 border-slate-700 hover:bg-slate-800' 
                      : 'bg-white border-gray-200 hover:bg-gray-50'
                }`}
              >
                <div className="flex items-center space-x-3">
                  <button
                    onClick={() => toggleStepCompletion(i)}
                    className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold transition-all duration-300 hover:scale-110 ${
                      isCompleted
                        ? 'bg-green-500 text-white'
                        : darkMode ? 'bg-blue-600 text-white' : 'bg-blue-500 text-white'
                    }`}
                    title={isCompleted ? 'Mark as incomplete' : 'Mark as complete'}
                  >
                    {isCompleted ? <CheckCircle className="h-4 w-4" /> : i + 1}
                  </button>
                  <span className={`font-medium transition-all duration-300 ${
                    isCompleted 
                      ? `${darkMode ? 'text-green-300 line-through' : 'text-green-700 line-through'}` 
                      : `${darkMode ? 'text-gray-100' : 'text-gray-900'}`
                  }`}>
                    {step}
                  </span>
                  {isCompleted && (
                    <Award className="h-4 w-4 text-yellow-500 animate-pulse" />
                  )}
                </div>
                <div className="flex items-center space-x-1 opacity-0 group-hover:opacity-100 transition-all duration-300">
                  <button
                    onClick={() => startEditing(i, step)}
                    className={`p-2 rounded-lg transition-all duration-300 hover:scale-110 ${
                      darkMode ? 'text-blue-400 hover:bg-blue-900/20' : 'text-blue-600 hover:bg-blue-50'
                    }`}
                    title="Edit step"
                  >
                    <Edit3 className="h-4 w-4" />
                  </button>
                  <button
                    onClick={() => removeRoadmapStep(i)}
                    className={`p-2 rounded-lg transition-all duration-300 hover:scale-110 ${
                      darkMode ? 'text-red-400 hover:bg-red-900/20' : 'text-red-500 hover:bg-red-50'
                    }`}
                    title="Remove step"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );

  return (
    <div className="flex flex-col h-full">
      {/* Header */}
      <div className={`px-6 py-4 border-b ${darkMode ? 'border-slate-700 bg-slate-800/50' : 'border-gray-200 bg-gray-50/50'}`}>
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center space-x-3">
            <div className={`p-2 rounded-xl ${darkMode ? 'bg-slate-700' : 'bg-white'} shadow-sm`}>
              <Target className={`h-5 w-5 ${darkMode ? 'text-purple-400' : 'text-purple-600'}`} />
            </div>
            <div>
              <h3 className={`font-semibold ${darkMode ? 'text-gray-100' : 'text-gray-900'}`}>
                Learning Workspace
              </h3>
              <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                Organize your learning journey
              </p>
            </div>
          </div>
        </div>

        {/* Topic Search */}
        <div className="relative">
          <div className="relative">
            <Search className={`absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 ${darkMode ? 'text-gray-400' : 'text-gray-500'}`} />
            <input
              type="text"
              placeholder="What do you want to learn? (e.g. React, Python...)"
              value={topic}
              onChange={e => {
                setTopic(e.target.value);
                setSelectedTopic('');
              }}
              className={`w-full pl-10 pr-4 py-3 rounded-xl border-2 transition-all duration-300 focus:outline-none focus:ring-4 ${
                darkMode 
                  ? 'bg-slate-700 border-slate-600 text-gray-100 placeholder-gray-400 focus:border-purple-500 focus:ring-purple-500/20' 
                  : 'bg-white border-gray-200 text-gray-900 placeholder-gray-500 focus:border-purple-500 focus:ring-purple-500/20'
              }`}
            />
          </div>
          
          {topic && !selectedTopic && (
            <div className={`absolute mt-2 w-full bg-white shadow-2xl rounded-xl z-10 border ${
              darkMode ? 'bg-slate-800 text-gray-100 border-slate-700' : 'bg-white text-gray-900 border-gray-200'
            }`}>
              {filteredSuggestions.length === 0 ? (
                <div className="p-4 text-center text-gray-500">No suggestions found</div>
              ) : (
                filteredSuggestions.map((t, i) => (
                  <div
                    key={i}
                    className={`cursor-pointer px-4 py-3 hover:bg-purple-50 transition-colors duration-200 ${
                      darkMode ? 'hover:bg-slate-700' : 'hover:bg-purple-50'
                    } ${i === 0 ? 'rounded-t-xl' : ''} ${i === filteredSuggestions.length - 1 ? 'rounded-b-xl' : ''}`}
                    onClick={() => handleSelectTopic(t)}
                  >
                    <div className="flex items-center space-x-3">
                      <Sparkles className="h-4 w-4 text-purple-500" />
                      <span className="font-medium">{t}</span>
                    </div>
                  </div>
                ))
              )}
            </div>
          )}
        </div>
      </div>

      {/* If no topic selected, show empty workspace */}
      {!selectedTopic ? (
        <div className="flex-1 flex flex-col items-center justify-center p-8 text-center">
          <div className={`p-6 rounded-2xl ${darkMode ? 'bg-slate-800/50' : 'bg-gray-50/50'} mb-6`}>
            <Target className={`h-12 w-12 mx-auto mb-4 ${darkMode ? 'text-purple-400' : 'text-purple-600'}`} />
          </div>
          <h3 className={`text-xl font-semibold mb-2 ${darkMode ? 'text-gray-100' : 'text-gray-900'}`}>
            Start Your Learning Journey
          </h3>
          <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'} max-w-md`}>
            Search for a topic above to get started with personalized learning roadmaps and checklists.
          </p>
        </div>
      ) : (
        <div className="flex-1 flex flex-col lg:flex-row min-h-0">
          {/* Roadmap Section */}
          <div className={`flex-1 flex flex-col border-r ${darkMode ? 'border-slate-700' : 'border-gray-200'}`}>
            <div className={`px-6 py-4 border-b ${darkMode ? 'border-slate-700 bg-slate-800/30' : 'border-gray-200 bg-gray-50/30'}`}>
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center space-x-2">
                  <Target className={`h-5 w-5 ${darkMode ? 'text-blue-400' : 'text-blue-600'}`} />
                  <h2 className={`text-lg font-semibold ${darkMode ? 'text-gray-100' : 'text-gray-900'}`}>
                    Learning Roadmap
                  </h2>
                </div>
                
                {/* View Mode Toggle */}
                <div className="flex items-center space-x-2">
                  <button
                    onClick={() => setViewMode('roadmap')}
                    className={`px-3 py-1 rounded-lg text-sm font-medium transition-all duration-300 ${
                      viewMode === 'roadmap'
                        ? `${darkMode ? 'bg-blue-600 text-white' : 'bg-blue-500 text-white'}`
                        : `${darkMode ? 'text-gray-400 hover:text-gray-300' : 'text-gray-600 hover:text-gray-700'}`
                    }`}
                  >
                    Road
                  </button>
                  <button
                    onClick={() => setViewMode('list')}
                    className={`px-3 py-1 rounded-lg text-sm font-medium transition-all duration-300 ${
                      viewMode === 'list'
                        ? `${darkMode ? 'bg-blue-600 text-white' : 'bg-blue-500 text-white'}`
                        : `${darkMode ? 'text-gray-400 hover:text-gray-300' : 'text-gray-600 hover:text-gray-700'}`
                    }`}
                  >
                    List
                  </button>
                </div>
              </div>
              <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                {viewMode === 'roadmap' ? 'Visual journey through your learning path' : 'Step-by-step guide for'} {selectedTopic}
              </p>
            </div>
            
            {/* Roadmap Content */}
            {viewMode === 'roadmap' ? <GraphicalRoadmap /> : <ListRoadmap />}
            
            <div className={`p-6 border-t ${darkMode ? 'border-slate-700 bg-slate-800/30' : 'border-gray-200 bg-gray-50/30'}`}>
              <div className="flex gap-3">
                <input
                  type="text"
                  placeholder="Add roadmap step..."
                  value={newRoadmapStep}
                  onChange={e => setNewRoadmapStep(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && addRoadmapStep()}
                  className={`flex-1 px-4 py-3 rounded-xl border-2 transition-all duration-300 focus:outline-none focus:ring-4 ${
                    darkMode 
                      ? 'bg-slate-700 border-slate-600 text-gray-100 placeholder-gray-400 focus:border-blue-500 focus:ring-blue-500/20' 
                      : 'bg-white border-gray-200 text-gray-900 placeholder-gray-500 focus:border-blue-500 focus:ring-blue-500/20'
                  }`}
                />
                <button
                  onClick={addRoadmapStep}
                  disabled={!newRoadmapStep.trim()}
                  className={`px-4 py-3 rounded-xl font-semibold transition-all duration-300 ${
                    newRoadmapStep.trim()
                      ? `${darkMode ? 'bg-blue-600 hover:bg-blue-700' : 'bg-blue-500 hover:bg-blue-600'} text-white hover:scale-105`
                      : 'opacity-50 cursor-not-allowed bg-gray-300 text-gray-500'
                  }`}
                >
                  <Plus className="h-5 w-5" />
                </button>
              </div>
            </div>
          </div>

          {/* Checklist Section */}
          <div className="flex-1 flex flex-col">
            <div className={`px-6 py-4 border-b ${darkMode ? 'border-slate-700 bg-slate-800/30' : 'border-gray-200 bg-gray-50/30'}`}>
              <div className="flex items-center space-x-2 mb-2">
                <ListTodo className={`h-5 w-5 ${darkMode ? 'text-purple-400' : 'text-purple-600'}`} />
                <h2 className={`text-lg font-semibold ${darkMode ? 'text-gray-100' : 'text-gray-900'}`}>
                  Checklist
                </h2>
              </div>
              <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                Track your progress with tasks
              </p>
            </div>
            
            <div className="flex-1 overflow-y-auto p-6 custom-scrollbar">
              {filteredChecklist.length === 0 ? (
                <div className="text-center py-8">
                  <div className={`p-4 rounded-xl inline-block mb-4 ${darkMode ? 'bg-slate-800/50' : 'bg-gray-50/50'}`}>
                    <ListTodo className={`h-8 w-8 ${darkMode ? 'text-gray-400' : 'text-gray-500'}`} />
                  </div>
                  <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                    No tasks yet. Add your first task below!
                  </p>
                </div>
              ) : (
                <div className="space-y-3">
                  {filteredChecklist.map((task, i) => (
                    <div 
                      key={i} 
                      className={`group flex items-center justify-between p-4 rounded-xl border transition-all duration-300 hover:shadow-lg ${
                        darkMode 
                          ? 'bg-slate-800/50 border-slate-700 hover:bg-slate-800' 
                          : 'bg-white border-gray-200 hover:bg-gray-50'
                      }`}
                    >
                      <div className="flex items-center space-x-3">
                        <button
                          className={`p-1 rounded-full transition-all duration-300 hover:scale-110 ${
                            darkMode ? 'text-purple-400 hover:bg-purple-900/20' : 'text-purple-500 hover:bg-purple-50'
                          }`}
                          title="Toggle task"
                        >
                          {task.includes('✓') ? (
                            <CheckCircle className="h-5 w-5 text-green-500" />
                          ) : (
                            <Circle className="h-5 w-5" />
                          )}
                        </button>
                        <span className={`font-medium transition-all duration-300 ${
                          task.includes('✓') 
                            ? `${darkMode ? 'text-gray-500 line-through' : 'text-gray-400 line-through'}` 
                            : `${darkMode ? 'text-gray-100' : 'text-gray-900'}`
                        }`}>
                          {task.replace('✓ ', '')}
                        </span>
                      </div>
                      <button
                        onClick={() => removeChecklistTask(i)}
                        className={`p-2 rounded-lg opacity-0 group-hover:opacity-100 transition-all duration-300 hover:scale-110 ${
                          darkMode ? 'text-red-400 hover:bg-red-900/20' : 'text-red-500 hover:bg-red-50'
                        }`}
                        title="Remove task"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>
            
            <div className={`p-6 border-t ${darkMode ? 'border-slate-700 bg-slate-800/30' : 'border-gray-200 bg-gray-50/30'}`}>
              <div className="flex gap-3">
                <input
                  type="text"
                  placeholder="Add checklist task..."
                  value={newChecklistTask}
                  onChange={e => setNewChecklistTask(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && addChecklistTask()}
                  className={`flex-1 px-4 py-3 rounded-xl border-2 transition-all duration-300 focus:outline-none focus:ring-4 ${
                    darkMode 
                      ? 'bg-slate-700 border-slate-600 text-gray-100 placeholder-gray-400 focus:border-purple-500 focus:ring-purple-500/20' 
                      : 'bg-white border-gray-200 text-gray-900 placeholder-gray-500 focus:border-purple-500 focus:ring-purple-500/20'
                  }`}
                />
                <button
                  onClick={addChecklistTask}
                  disabled={!newChecklistTask.trim()}
                  className={`px-4 py-3 rounded-xl font-semibold transition-all duration-300 ${
                    newChecklistTask.trim()
                      ? `${darkMode ? 'bg-purple-600 hover:bg-purple-700' : 'bg-purple-500 hover:bg-purple-600'} text-white hover:scale-105`
                      : 'opacity-50 cursor-not-allowed bg-gray-300 text-gray-500'
                  }`}
                >
                  <Plus className="h-5 w-5" />
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
