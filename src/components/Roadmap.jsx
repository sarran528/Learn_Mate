import React, { useState } from 'react';

export default function Roadmap({ steps = [], onRemove }) {
  const [activeStep, setActiveStep] = useState(null);

  return (
    <div className="p-4 bg-white rounded shadow">
      <h2 className="font-semibold mb-4">Learning Roadmap</h2>
      {steps.length === 0 ? (
        <p className="text-gray-400">No roadmap yet</p>
      ) : (
        <div className="relative">
          {/* Vertical line */}
          <div className="absolute left-2.5 top-0 bottom-0 w-0.5 bg-blue-200"></div>
          
          <ol className="space-y-6 relative">
            {steps.map((step, idx) => (
              <li key={idx} className="ml-6">
                {/* Step circle */}
                <div 
                  className={`absolute left-0 mt-1.5 w-5 h-5 rounded-full border-2 ${
                    idx === activeStep 
                      ? 'border-blue-600 bg-blue-100' 
                      : 'border-blue-300 bg-white'
                  }`}
                ></div>
                
                {/* Step content */}
                <div 
                  className={`p-3 rounded-lg border ${
                    idx === activeStep 
                      ? 'border-blue-300 bg-blue-50' 
                      : 'border-gray-200'
                  }`}
                >
                  <div className="flex justify-between items-start">
                    <h3 className="font-medium">{step}</h3>
                    <div className="flex gap-2">
                      <button 
                        onClick={() => setActiveStep(idx === activeStep ? null : idx)} 
                        className="text-xs px-2 py-1 bg-blue-100 text-blue-700 rounded hover:bg-blue-200"
                      >
                        {idx === activeStep ? 'Collapse' : 'Focus'}
                      </button>
                      <button 
                        onClick={() => onRemove(idx)} 
                        className="text-xs px-2 py-1 bg-red-100 text-red-700 rounded hover:bg-red-200"
                      >
                        Remove
                      </button>
                    </div>
                  </div>
                  
                  {idx === activeStep && (
                    <div className="mt-2 text-sm">
                      <p className="text-gray-600">
                        This is the {idx === 0 ? 'first' : idx === steps.length - 1 ? 'final' : `${idx + 1}${['st', 'nd', 'rd'][idx] || 'th'}`} step 
                        in your learning journey. {idx === 0 ? 'Start here to build your foundation.' : idx === steps.length - 1 ? 'Master this to complete your learning path.' : 'This builds on your previous knowledge.'}
                      </p>
                      <div className="mt-2 flex">
                        <button className="mr-2 text-xs px-2 py-1 border border-blue-200 rounded text-blue-700">
                          Mark as Complete
                        </button>
                        <button className="text-xs px-2 py-1 border border-blue-200 rounded text-blue-700">
                          Find Resources
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              </li>
            ))}
          </ol>
        </div>
      )}
    </div>
  );
}
