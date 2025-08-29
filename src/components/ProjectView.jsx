import React, { useState } from 'react';
import { 
  File, 
  Folder, 
  ChevronRight, 
  ChevronDown, 
  ExternalLink, 
  Calendar, 
  CheckSquare, 
  Milestone, 
  Layers, 
  Code
} from 'lucide-react';

/**
 * Project View component that displays the generated project details
 */
export default function ProjectView({ project, darkMode = false }) {
  const [activeTab, setActiveTab] = useState('structure');

  if (!project) {
    return (
      <div className={`p-6 rounded-lg shadow-lg ${darkMode ? 'bg-gray-900' : 'bg-white'}`}>
        <p className={`text-center ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
          No project generated yet. Use the Project Generator to create a new learning project.
        </p>
      </div>
    );
  }

  const renderFileTree = (item, depth = 0) => {
    const isFolder = item.type === 'folder';
    const [isOpen, setIsOpen] = useState(depth < 1);
    
    return (
      <div key={item.name} className="flex flex-col">
        <div 
          className={`flex items-center px-2 py-1.5 rounded ${
            darkMode ? 'hover:bg-gray-800' : 'hover:bg-gray-100'
          }`}
          style={{ paddingLeft: `${(depth * 16) + 8}px` }}
        >
          {isFolder ? (
            <button 
              onClick={() => setIsOpen(!isOpen)} 
              className="flex items-center flex-1"
            >
              <span className="mr-1">
                {isOpen ? <ChevronDown size={16} /> : <ChevronRight size={16} />}
              </span>
              <Folder size={16} className={`mr-2 ${darkMode ? 'text-blue-400' : 'text-blue-500'}`} />
              <span className={`text-sm ${darkMode ? 'text-gray-200' : 'text-gray-700'}`}>{item.name}</span>
            </button>
          ) : (
            <div className="flex items-center flex-1">
              <span className="mr-1 w-4"></span>
              <File size={16} className={`mr-2 ${darkMode ? 'text-gray-400' : 'text-gray-500'}`} />
              <span className={`text-sm ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>{item.name}</span>
            </div>
          )}
        </div>
        
        {isFolder && isOpen && item.children && (
          <div>
            {item.children.map(child => renderFileTree(child, depth + 1))}
          </div>
        )}
      </div>
    );
  };

  const renderTabs = () => {
    const tabs = [
      { id: 'structure', label: 'Structure', icon: <Layers size={16} /> },
      { id: 'steps', label: 'Steps', icon: <CheckSquare size={16} /> },
      { id: 'milestones', label: 'Milestones', icon: <Milestone size={16} /> },
      { id: 'resources', label: 'Resources', icon: <ExternalLink size={16} /> }
    ];
    
    return (
      <div className="flex border-b mb-4 overflow-x-auto">
        {tabs.map(tab => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`flex items-center px-4 py-2 text-sm font-medium border-b-2 -mb-px transition-colors ${
              activeTab === tab.id
                ? (darkMode 
                    ? 'border-blue-500 text-blue-400'
                    : 'border-blue-500 text-blue-600'
                  )
                : (darkMode 
                    ? 'border-transparent text-gray-400 hover:text-gray-300'
                    : 'border-transparent text-gray-500 hover:text-gray-700'
                  )
            }`}
          >
            <span className="mr-2">{tab.icon}</span>
            {tab.label}
          </button>
        ))}
      </div>
    );
  };

  return (
    <div className={`rounded-lg shadow-lg overflow-hidden ${darkMode ? 'bg-gray-900' : 'bg-white'}`}>
      <div className={`p-5 border-b ${darkMode ? 'border-gray-700' : 'border-gray-200'}`}>
        <div className="flex items-center justify-between">
          <h2 className={`text-xl font-bold ${darkMode ? 'text-white' : 'text-gray-900'}`}>
            {project.name}
          </h2>
          <div className="flex items-center gap-2">
            <span className={`px-3 py-1 text-xs rounded-full font-medium ${
              darkMode ? 'bg-gray-800 text-gray-300' : 'bg-gray-200 text-gray-700'
            }`}>
              {project.type}
            </span>
            <span className={`px-3 py-1 text-xs rounded-full font-medium ${
              project.difficulty === 'beginner'
                ? (darkMode ? 'bg-green-900/40 text-green-300' : 'bg-green-100 text-green-700')
                : project.difficulty === 'intermediate'
                  ? (darkMode ? 'bg-yellow-900/40 text-yellow-300' : 'bg-yellow-100 text-yellow-700')
                  : (darkMode ? 'bg-red-900/40 text-red-300' : 'bg-red-100 text-red-700')
            }`}>
              {project.difficulty.charAt(0).toUpperCase() + project.difficulty.slice(1)}
            </span>
          </div>
        </div>
        <div className="mt-3">
          <div className="flex flex-wrap gap-2 mt-2">
            {project.technologies.map((tech, idx) => (
              <span key={idx} className={`inline-flex items-center px-2.5 py-0.5 rounded-md text-xs font-medium ${
                darkMode ? 'bg-blue-900/30 text-blue-300' : 'bg-blue-100 text-blue-700'
              }`}>
                <Code size={12} className="mr-1.5" />
                {tech}
              </span>
            ))}
          </div>
          <div className="flex flex-wrap gap-2 mt-2">
            {project.features.map((feature, idx) => (
              <span key={idx} className={`inline-flex items-center px-2.5 py-0.5 rounded-md text-xs font-medium ${
                darkMode ? 'bg-purple-900/30 text-purple-300' : 'bg-purple-100 text-purple-700'
              }`}>
                {feature}
              </span>
            ))}
          </div>
        </div>
      </div>
      
      <div className="p-5">
        {renderTabs()}
        
        <div className="mt-2">
          {activeTab === 'structure' && (
            <div className={`border rounded-lg overflow-hidden ${darkMode ? 'border-gray-700' : 'border-gray-200'}`}>
              <div className={`px-4 py-3 text-sm font-medium border-b ${
                darkMode ? 'bg-gray-800 border-gray-700' : 'bg-gray-50 border-gray-200'
              }`}>
                Project File Structure
              </div>
              <div className={`p-3 ${darkMode ? 'bg-gray-900' : 'bg-white'}`}>
                {project.structure.map(item => renderFileTree(item))}
              </div>
            </div>
          )}
          
          {activeTab === 'steps' && (
            <div className="space-y-4">
              {project.steps.map((section, idx) => (
                <div key={idx} className={`border rounded-lg overflow-hidden ${
                  darkMode ? 'border-gray-700' : 'border-gray-200'
                }`}>
                  <div className={`px-4 py-3 text-sm font-medium border-b flex items-center justify-between ${
                    darkMode ? 'bg-gray-800 border-gray-700' : 'bg-gray-50 border-gray-200'
                  }`}>
                    <span>{section.title}</span>
                    <span className={`px-2 py-0.5 rounded text-xs font-medium ${
                      darkMode ? 'bg-blue-900/30 text-blue-300' : 'bg-blue-100 text-blue-700'
                    }`}>
                      Step {idx + 1} of {project.steps.length}
                    </span>
                  </div>
                  <div className={`p-3 ${darkMode ? 'bg-gray-900' : 'bg-white'}`}>
                    <ul className="space-y-2">
                      {section.tasks.map((task, taskIdx) => (
                        <li key={taskIdx} className="flex items-start">
                          <div className={`p-1 rounded-full mr-2 mt-0.5 ${
                            darkMode ? 'bg-gray-800 text-gray-400' : 'bg-gray-100 text-gray-600'
                          }`}>
                            <CheckSquare size={14} />
                          </div>
                          <span className={`text-sm ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>{task}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              ))}
            </div>
          )}
          
          {activeTab === 'milestones' && (
            <div className="space-y-4">
              {project.milestones.map((milestone, idx) => (
                <div key={idx} className={`border rounded-lg overflow-hidden ${
                  darkMode ? 'border-gray-700' : 'border-gray-200'
                }`}>
                  <div className={`px-4 py-3 font-medium flex items-center justify-between ${
                    darkMode ? 'bg-gray-800 border-b border-gray-700' : 'bg-gray-50 border-b border-gray-200'
                  }`}>
                    <div className="flex items-center">
                      <Milestone size={18} className={`mr-2 ${
                        darkMode ? 'text-yellow-400' : 'text-yellow-500'
                      }`} />
                      <span>{milestone.title}</span>
                    </div>
                    <div className={`px-2 py-0.5 rounded text-xs font-medium ${
                      darkMode ? 'bg-gray-700 text-gray-300' : 'bg-gray-200 text-gray-700'
                    }`}>
                      Milestone {idx + 1}
                    </div>
                  </div>
                  <div className={`p-4 space-y-3 ${darkMode ? 'bg-gray-900' : 'bg-white'}`}>
                    <p className={`text-sm ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                      {milestone.description}
                    </p>
                    <div>
                      <div className={`text-xs uppercase font-semibold mb-1 ${
                        darkMode ? 'text-gray-500' : 'text-gray-500'
                      }`}>
                        Completion Criteria
                      </div>
                      <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                        {milestone.criteria}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
          
          {activeTab === 'resources' && (
            <div className="space-y-3">
              {project.resources.map((resource, idx) => (
                <a 
                  key={idx}
                  href={resource.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={`block border rounded-lg p-3 transition-colors ${
                    darkMode 
                      ? 'border-gray-700 hover:bg-gray-800'
                      : 'border-gray-200 hover:bg-gray-50'
                  }`}
                >
                  <div className="flex items-start">
                    <ExternalLink size={18} className={`flex-shrink-0 mt-0.5 mr-3 ${
                      darkMode ? 'text-blue-400' : 'text-blue-500'
                    }`} />
                    <div>
                      <h4 className={`text-sm font-medium ${
                        darkMode ? 'text-blue-300' : 'text-blue-600'
                      }`}>
                        {resource.title}
                      </h4>
                      <p className={`text-xs mt-1 ${
                        darkMode ? 'text-gray-400' : 'text-gray-600'
                      }`}>
                        {resource.description}
                      </p>
                      <div className={`text-xs mt-1 truncate ${
                        darkMode ? 'text-gray-500' : 'text-gray-500'
                      }`}>
                        {resource.url}
                      </div>
                    </div>
                  </div>
                </a>
              ))}
            </div>
          )}
        </div>
      </div>
      
      <div className={`px-5 py-4 border-t ${darkMode ? 'border-gray-700' : 'border-gray-200'}`}>
        <div className="flex items-center text-xs">
          <Calendar size={14} className={`mr-1.5 ${darkMode ? 'text-gray-400' : 'text-gray-500'}`} />
          <span className={darkMode ? 'text-gray-400' : 'text-gray-500'}>
            Created on {new Date(project.createdAt).toLocaleDateString()}
          </span>
        </div>
      </div>
    </div>
  );
}
