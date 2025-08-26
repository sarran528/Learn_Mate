import React, { useState } from 'react';
import { CheckCircle2, Circle, Calendar, Target, BookOpen, ExternalLink, Clock, TrendingUp, Award } from 'lucide-react';
import { LearningPlanData, ChecklistItem } from '../types';

interface LearningPlanProps {
  plan: LearningPlanData;
}

const LearningPlan: React.FC<LearningPlanProps> = ({ plan }) => {
  const [checklist, setChecklist] = useState<ChecklistItem[]>(plan.checklist);
  const [activeTab, setActiveTab] = useState<'roadmap' | 'schedule' | 'checklist' | 'resources'>('roadmap');

  const toggleChecklistItem = (id: string) => {
    setChecklist(prev =>
      prev.map(item =>
        item.id === id ? { ...item, completed: !item.completed } : item
      )
    );
  };

  const completedTasks = checklist.filter(item => item.completed).length;
  const progressPercentage = Math.round((completedTasks / checklist.length) * 100);

  const getCategoryColor = (category: string) => {
    const colors = {
      setup: 'bg-blue-100 text-blue-800',
      foundation: 'bg-green-100 text-green-800',
      practice: 'bg-yellow-100 text-yellow-800',
      community: 'bg-purple-100 text-purple-800',
      project: 'bg-red-100 text-red-800',
      feedback: 'bg-indigo-100 text-indigo-800',
      portfolio: 'bg-pink-100 text-pink-800',
      assessment: 'bg-orange-100 text-orange-800',
      planning: 'bg-gray-100 text-gray-800'
    };
    return colors[category as keyof typeof colors] || 'bg-gray-100 text-gray-800';
  };

  const getResourceTypeIcon = (type: string) => {
    switch (type) {
      case 'documentation': return '📚';
      case 'tutorial': return '🎓';
      case 'interactive': return '💻';
      case 'community': return '👥';
      case 'video': return '🎥';
      case 'guide': return '📖';
      case 'practice': return '🔧';
      case 'blog': return '✍️';
      case 'tools': return '🛠️';
      case 'case-study': return '📊';
      case 'best-practices': return '⭐';
      case 'certification': return '🏆';
      case 'career': return '💼';
      default: return '🔗';
    }
  };

  const tabs = [
    { id: 'roadmap', label: 'Roadmap', icon: Target, color: 'text-blue-600' },
    { id: 'schedule', label: 'Schedule', icon: Calendar, color: 'text-purple-600' },
    { id: 'checklist', label: 'Checklist', icon: CheckCircle2, color: 'text-green-600' },
    { id: 'resources', label: 'Resources', icon: BookOpen, color: 'text-orange-600' }
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white/70 backdrop-blur-sm rounded-2xl shadow-xl border border-blue-100 p-6">
        <div className="flex items-start justify-between mb-4">
          <div>
            <h2 className="text-3xl font-bold text-gray-900 mb-2">
              Learning Plan: <span className="text-blue-600">{plan.skill}</span>
            </h2>
            <div className="flex items-center space-x-6 text-sm text-gray-600">
              <div className="flex items-center space-x-1">
                <Clock className="h-4 w-4" />
                <span>{plan.duration} days</span>
              </div>
              <div className="flex items-center space-x-1">
                <TrendingUp className="h-4 w-4" />
                <span>{progressPercentage}% Complete</span>
              </div>
              <div className="flex items-center space-x-1">
                <Award className="h-4 w-4" />
                <span>{completedTasks}/{checklist.length} tasks done</span>
              </div>
            </div>
          </div>
          <div className="text-right">
            <div className="text-2xl font-bold text-blue-600">{progressPercentage}%</div>
            <div className="w-20 h-2 bg-gray-200 rounded-full mt-1">
              <div 
                className="h-full bg-gradient-to-r from-blue-500 to-purple-600 rounded-full transition-all duration-500"
                style={{ width: `${progressPercentage}%` }}
              />
            </div>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="bg-white/70 backdrop-blur-sm rounded-2xl shadow-xl border border-blue-100">
        <div className="flex border-b border-gray-200">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`flex-1 px-6 py-4 text-center font-medium transition-all duration-200 border-b-2 ${
                  activeTab === tab.id
                    ? `border-blue-500 ${tab.color} bg-blue-50/50`
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:bg-gray-50/50'
                }`}
              >
                <div className="flex items-center justify-center space-x-2">
                  <Icon className="h-5 w-5" />
                  <span>{tab.label}</span>
                </div>
              </button>
            );
          })}
        </div>

        <div className="p-6">
          {/* Roadmap Tab */}
          {activeTab === 'roadmap' && (
            <div className="space-y-6">
              <div className="text-center mb-8">
                <h3 className="text-2xl font-bold text-gray-900 mb-2">Learning Roadmap</h3>
                <p className="text-gray-600">Your structured path to mastering {plan.skill}</p>
              </div>

              <div className="space-y-6">
                {plan.roadmap.map((milestone, index) => (
                  <div key={index} className="relative">
                    {index < plan.roadmap.length - 1 && (
                      <div className="absolute left-6 top-16 w-0.5 h-full bg-gradient-to-b from-blue-300 to-purple-300" />
                    )}
                    
                    <div className="flex items-start space-x-4">
                      <div className={`flex-shrink-0 w-12 h-12 rounded-full flex items-center justify-center font-bold text-white ${
                        index === 0 ? 'bg-blue-500' : 
                        index === 1 ? 'bg-purple-500' : 'bg-green-500'
                      }`}>
                        {index + 1}
                      </div>
                      
                      <div className="flex-1 bg-white/50 rounded-xl p-6 border border-gray-200">
                        <div className="flex items-start justify-between mb-3">
                          <h4 className="text-xl font-semibold text-gray-900">{milestone.milestone}</h4>
                          <span className="text-sm text-gray-500 bg-gray-100 px-3 py-1 rounded-full">
                            {milestone.timeframe}
                          </span>
                        </div>
                        <p className="text-gray-600 mb-4">{milestone.description}</p>
                        
                        <div className="grid md:grid-cols-2 gap-3">
                          {milestone.keyPoints.map((point, pointIndex) => (
                            <div key={pointIndex} className="flex items-start space-x-2">
                              <div className="w-1.5 h-1.5 bg-blue-500 rounded-full mt-2 flex-shrink-0" />
                              <span className="text-sm text-gray-700">{point}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Schedule Tab */}
          {activeTab === 'schedule' && (
            <div className="space-y-6">
              <div className="text-center mb-8">
                <h3 className="text-2xl font-bold text-gray-900 mb-2">Weekly Schedule</h3>
                <p className="text-gray-600">Daily tasks and focus areas for your {plan.duration}-day journey</p>
              </div>

              <div className="space-y-6">
                {plan.schedule.map((week) => (
                  <div key={week.week} className="bg-white/50 rounded-xl p-6 border border-gray-200">
                    <div className="flex items-center justify-between mb-4">
                      <h4 className="text-lg font-semibold text-gray-900">Week {week.week}</h4>
                      <span className="bg-gradient-to-r from-blue-500 to-purple-600 text-white px-3 py-1 rounded-full text-sm font-medium">
                        {week.theme}
                      </span>
                    </div>

                    <div className="grid gap-4">
                      {week.dailyTasks.map((day) => (
                        <div key={day.day} className="bg-white rounded-lg p-4 border border-gray-200">
                          <div className="flex items-center justify-between mb-3">
                            <div className="flex items-center space-x-3">
                              <div className="w-8 h-8 bg-blue-500 text-white rounded-full flex items-center justify-center font-bold text-sm">
                                {day.day}
                              </div>
                              <div>
                                <div className="font-medium text-gray-900">{day.focus}</div>
                                <div className="text-sm text-gray-500">Est. {day.estimatedTime}</div>
                              </div>
                            </div>
                            <Clock className="h-4 w-4 text-gray-400" />
                          </div>
                          
                          <div className="grid md:grid-cols-2 gap-2">
                            {day.tasks.map((task, taskIndex) => (
                              <div key={taskIndex} className="flex items-center space-x-2 text-sm text-gray-700">
                                <div className="w-1 h-1 bg-blue-500 rounded-full" />
                                <span>{task}</span>
                              </div>
                            ))}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Checklist Tab */}
          {activeTab === 'checklist' && (
            <div className="space-y-6">
              <div className="text-center mb-8">
                <h3 className="text-2xl font-bold text-gray-900 mb-2">Learning Checklist</h3>
                <p className="text-gray-600">
                  Track your progress with actionable tasks. You've completed {completedTasks} out of {checklist.length} tasks.
                </p>
                <div className="w-full h-3 bg-gray-200 rounded-full mt-4 max-w-md mx-auto">
                  <div 
                    className="h-full bg-gradient-to-r from-green-500 to-blue-500 rounded-full transition-all duration-500"
                    style={{ width: `${progressPercentage}%` }}
                  />
                </div>
              </div>

              <div className="space-y-3">
                {checklist.map((item) => (
                  <div
                    key={item.id}
                    className={`flex items-center space-x-4 p-4 rounded-xl border transition-all duration-200 cursor-pointer ${
                      item.completed
                        ? 'bg-green-50 border-green-200 text-green-800'
                        : 'bg-white hover:bg-blue-50 border-gray-200 hover:border-blue-200'
                    }`}
                    onClick={() => toggleChecklistItem(item.id)}
                  >
                    <div className="flex-shrink-0">
                      {item.completed ? (
                        <CheckCircle2 className="h-6 w-6 text-green-600" />
                      ) : (
                        <Circle className="h-6 w-6 text-gray-400 hover:text-blue-500" />
                      )}
                    </div>
                    
                    <div className="flex-1">
                      <div className={`font-medium ${item.completed ? 'line-through' : ''}`}>
                        {item.task}
                      </div>
                    </div>
                    
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${getCategoryColor(item.category)}`}>
                      {item.category}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Resources Tab */}
          {activeTab === 'resources' && (
            <div className="space-y-6">
              <div className="text-center mb-8">
                <h3 className="text-2xl font-bold text-gray-900 mb-2">Learning Resources</h3>
                <p className="text-gray-600">Curated materials and links to support your learning journey</p>
              </div>

              <div className="space-y-8">
                {plan.resources.map((resourceGroup, groupIndex) => (
                  <div key={groupIndex} className="bg-white/50 rounded-xl p-6 border border-gray-200">
                    <h4 className="text-lg font-semibold text-gray-900 mb-4 flex items-center space-x-2">
                      <Target className="h-5 w-5 text-blue-500" />
                      <span>{resourceGroup.milestone}</span>
                    </h4>
                    
                    <div className="grid gap-3">
                      {resourceGroup.links.map((link, linkIndex) => (
                        <a
                          key={linkIndex}
                          href={link.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex items-center space-x-3 p-3 bg-white rounded-lg border border-gray-200 hover:border-blue-300 hover:bg-blue-50 transition-all duration-200 group"
                        >
                          <span className="text-xl">{getResourceTypeIcon(link.type)}</span>
                          <div className="flex-1">
                            <div className="font-medium text-gray-900 group-hover:text-blue-700">
                              {link.title}
                            </div>
                            <div className="text-sm text-gray-500 capitalize">{link.type}</div>
                          </div>
                          <ExternalLink className="h-4 w-4 text-gray-400 group-hover:text-blue-500" />
                        </a>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default LearningPlan;