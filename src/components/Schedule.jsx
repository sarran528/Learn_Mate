import React from 'react';

export default function Schedule({ items = [] }) {
  return (
    <div className="p-4 bg-white rounded shadow">
      <h2 className="font-semibold mb-3">📅 Learning Schedule</h2>
      {items.length === 0 ? (
        <div className="text-center py-6">
          <div className="text-gray-400 text-4xl mb-2">📅</div>
          <p className="text-gray-400 text-sm">No schedule set yet</p>
          <p className="text-gray-300 text-xs mt-1">Ask the Learning Assistant to create a weekly plan</p>
        </div>
      ) : (
        <div className="space-y-3">
          {items.map((item, idx) => {
            // Parse the schedule item to extract time period and content
            const periodMatch = item.match(/^([^:]+):/);
            const period = periodMatch ? periodMatch[1] : null;
            const content = periodMatch ? item.substring(periodMatch[0].length).trim() : item;
            
            // Determine the type of period for styling
            const isWeek = period && period.toLowerCase().includes('week');
            const isMonth = period && period.toLowerCase().includes('month');
            
            return (
              <div key={idx} className="border-l-4 border-blue-500 pl-3 py-2 bg-blue-50 rounded-r">
                {period && (
                  <div className="flex items-center mb-1">
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                      isWeek 
                        ? 'bg-green-100 text-green-800' 
                        : isMonth 
                        ? 'bg-purple-100 text-purple-800'
                        : 'bg-blue-100 text-blue-800'
                    }`}>
                      {isWeek ? '📅' : isMonth ? '📆' : '⏰'} {period}
                    </span>
                  </div>
                )}
                <p className="text-gray-700 text-sm leading-relaxed">{content}</p>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
