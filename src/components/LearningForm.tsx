import React, { useState } from 'react';
import { Sparkles, Clock, Globe, ArrowRight } from 'lucide-react';
import { LearningGoal } from '../types';

interface LearningFormProps {
  onSubmit: (goal: LearningGoal) => void;
  isGenerating: boolean;
}

const SUPPORTED_LANGUAGES = [
  { code: 'en', name: 'English', flag: '🇺🇸' },
  { code: 'hi', name: 'Hindi', flag: '🇮🇳' },
  { code: 'ta', name: 'Tamil', flag: '🇮🇳' },
  { code: 'es', name: 'Spanish', flag: '🇪🇸' },
  { code: 'fr', name: 'French', flag: '🇫🇷' },
  { code: 'de', name: 'German', flag: '🇩🇪' },
  { code: 'zh', name: 'Chinese', flag: '🇨🇳' },
  { code: 'ja', name: 'Japanese', flag: '🇯🇵' }
];

const POPULAR_SKILLS = [
  'Python Programming',
  'React Development',
  'Data Science',
  'Machine Learning',
  'Digital Marketing',
  'UI/UX Design',
  'JavaScript',
  'Photography',
  'Public Speaking',
  'Project Management'
];

const LearningForm: React.FC<LearningFormProps> = ({ onSubmit, isGenerating }) => {
  const [skill, setSkill] = useState('');
  const [duration, setDuration] = useState<number>(30);
  const [language, setLanguage] = useState('en');
  const [showLanguageDropdown, setShowLanguageDropdown] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (skill.trim() && duration > 0) {
      onSubmit({ skill: skill.trim(), duration, language });
    }
  };

  const selectSkill = (selectedSkill: string) => {
    setSkill(selectedSkill);
  };

  const selectedLanguage = SUPPORTED_LANGUAGES.find(lang => lang.code === language) || SUPPORTED_LANGUAGES[0];

  return (
    <div className="max-w-2xl mx-auto">
      <form onSubmit={handleSubmit} className="bg-white/70 backdrop-blur-sm rounded-2xl shadow-xl border border-blue-100 p-8">
        <div className="text-center mb-8">
          <div className="inline-flex items-center space-x-2 bg-gradient-to-r from-blue-500 to-purple-600 text-white px-4 py-2 rounded-full text-sm font-medium mb-4">
            <Sparkles className="h-4 w-4" />
            <span>AI-Generated Learning Plan</span>
          </div>
          <h3 className="text-2xl font-bold text-gray-900 mb-2">Create Your Learning Journey</h3>
          <p className="text-gray-600">Tell us what you want to learn, and we'll create a personalized plan</p>
        </div>

        {/* Skill Input */}
        <div className="mb-6">
          <label htmlFor="skill" className="block text-sm font-semibold text-gray-700 mb-3">
            What do you want to learn?
          </label>
          <input
            type="text"
            id="skill"
            value={skill}
            onChange={(e) => setSkill(e.target.value)}
            placeholder="e.g., Python Programming, Digital Marketing, Photography..."
            className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 text-gray-900 bg-white/50"
            required
          />
          
          {/* Popular Skills */}
          <div className="mt-3">
            <p className="text-xs text-gray-500 mb-2">Popular skills:</p>
            <div className="flex flex-wrap gap-2">
              {POPULAR_SKILLS.map((popularSkill) => (
                <button
                  key={popularSkill}
                  type="button"
                  onClick={() => selectSkill(popularSkill)}
                  className="px-3 py-1 text-xs bg-blue-50 text-blue-600 rounded-lg hover:bg-blue-100 transition-colors duration-200 border border-blue-200"
                >
                  {popularSkill}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Duration Input */}
        <div className="mb-6">
          <label htmlFor="duration" className="block text-sm font-semibold text-gray-700 mb-3">
            <Clock className="inline h-4 w-4 mr-1" />
            How many days do you have?
          </label>
          <div className="grid grid-cols-4 gap-3 mb-3">
            {[7, 14, 30, 60].map((days) => (
              <button
                key={days}
                type="button"
                onClick={() => setDuration(days)}
                className={`px-4 py-2 rounded-lg border-2 transition-all duration-200 font-medium ${
                  duration === days
                    ? 'border-blue-500 bg-blue-50 text-blue-700'
                    : 'border-gray-200 bg-white/50 text-gray-700 hover:border-blue-300'
                }`}
              >
                {days} days
              </button>
            ))}
          </div>
          <input
            type="number"
            id="duration"
            value={duration}
            onChange={(e) => setDuration(parseInt(e.target.value) || 1)}
            min="1"
            max="365"
            className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 text-gray-900 bg-white/50"
          />
        </div>

        {/* Language Selection */}
        <div className="mb-8">
          <label className="block text-sm font-semibold text-gray-700 mb-3">
            <Globe className="inline h-4 w-4 mr-1" />
            Preferred Language
          </label>
          <div className="relative">
            <button
              type="button"
              onClick={() => setShowLanguageDropdown(!showLanguageDropdown)}
              className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 text-gray-900 bg-white/50 flex items-center justify-between"
            >
              <span className="flex items-center space-x-2">
                <span className="text-lg">{selectedLanguage.flag}</span>
                <span>{selectedLanguage.name}</span>
              </span>
              <svg className={`h-4 w-4 transition-transform duration-200 ${showLanguageDropdown ? 'rotate-180' : ''}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
            </button>
            
            {showLanguageDropdown && (
              <div className="absolute z-10 w-full mt-2 bg-white border border-gray-200 rounded-xl shadow-lg max-h-60 overflow-y-auto">
                {SUPPORTED_LANGUAGES.map((lang) => (
                  <button
                    key={lang.code}
                    type="button"
                    onClick={() => {
                      setLanguage(lang.code);
                      setShowLanguageDropdown(false);
                    }}
                    className={`w-full px-4 py-3 text-left hover:bg-blue-50 transition-colors duration-200 flex items-center space-x-3 ${
                      language === lang.code ? 'bg-blue-50 text-blue-700' : 'text-gray-900'
                    }`}
                  >
                    <span className="text-lg">{lang.flag}</span>
                    <span>{lang.name}</span>
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          disabled={!skill.trim() || duration <= 0 || isGenerating}
          className="w-full bg-gradient-to-r from-blue-500 to-purple-600 text-white font-semibold py-4 px-6 rounded-xl hover:from-blue-600 hover:to-purple-700 focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center space-x-2 group"
        >
          {isGenerating ? (
            <>
              <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
              <span>Generating Your Plan...</span>
            </>
          ) : (
            <>
              <Sparkles className="h-5 w-5" />
              <span>Generate My Learning Plan</span>
              <ArrowRight className="h-4 w-4 transition-transform duration-200 group-hover:translate-x-1" />
            </>
          )}
        </button>
      </form>

      {/* How it Works */}
      <div className="mt-8 text-center">
        <h4 className="text-lg font-semibold text-gray-900 mb-4">How Learn_mate Works</h4>
        <div className="grid md:grid-cols-3 gap-6">
          <div className="bg-white/50 backdrop-blur-sm rounded-xl p-6 border border-blue-100">
            <div className="w-10 h-10 bg-blue-500 text-white rounded-full flex items-center justify-center font-bold text-lg mx-auto mb-3">1</div>
            <p className="text-sm text-gray-600">AI analyzes your goal and creates a structured learning roadmap</p>
          </div>
          <div className="bg-white/50 backdrop-blur-sm rounded-xl p-6 border border-blue-100">
            <div className="w-10 h-10 bg-purple-500 text-white rounded-full flex items-center justify-center font-bold text-lg mx-auto mb-3">2</div>
            <p className="text-sm text-gray-600">Get daily schedules, actionable tasks, and progress tracking</p>
          </div>
          <div className="bg-white/50 backdrop-blur-sm rounded-xl p-6 border border-blue-100">
            <div className="w-10 h-10 bg-green-500 text-white rounded-full flex items-center justify-center font-bold text-lg mx-auto mb-3">3</div>
            <p className="text-sm text-gray-600">Access curated resources and track your learning journey</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LearningForm;