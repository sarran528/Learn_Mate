import React from 'react';

export default function Schedule({ items = [] }) {
  return (
    <div className="p-4 bg-white rounded shadow">
      <h2 className="font-semibold mb-2">Learning Schedule</h2>
      {items.length === 0 ? (
        <p className="text-gray-400">No schedule set</p>
      ) : (
        <ul className="space-y-2">
          {items.map((item, idx) => {
            // Parse the schedule item to extract time period
            const periodMatch = item.match(/^([^:]+):/);
            const period = periodMatch ? periodMatch[1] : null;
            const content = periodMatch ? item.substring(periodMatch[0].length).trim() : item;
            
            return (
              <li key={idx} className="flex items-start">
                {period && (
                  <span className="inline-block bg-blue-100 text-blue-800 text-xs font-medium px-2 py-1 rounded mr-2 whitespace-nowrap">
                    {period}
                  </span>
                )}
                <span className="text-gray-700">{content}</span>
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
}
