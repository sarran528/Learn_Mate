import React from 'react';

export default function Resources({ items = [] }) {
  // Function to get a nice display name from the URL
  const getDisplayName = (url) => {
    try {
      const hostname = new URL(url).hostname;
      // Remove www. and get the domain name
      return hostname.replace('www.', '').split('.')[0].charAt(0).toUpperCase() + 
             hostname.replace('www.', '').split('.')[0].slice(1);
    } catch (e) {
      // If URL parsing fails, just return the URL
      return url;
    }
  };

  // Function to categorize resources
  const categorizeResources = (urls) => {
    const sites = [];
    const videos = [];
    
    urls.forEach(url => {
      const lowerUrl = url.toLowerCase();
      if (lowerUrl.includes('youtube.com') || lowerUrl.includes('youtu.be') || 
          lowerUrl.includes('vimeo.com') || lowerUrl.includes('udemy.com') ||
          lowerUrl.includes('coursera.org') || lowerUrl.includes('edx.org')) {
        videos.push(url);
      } else {
        sites.push(url);
      }
    });
    
    return { sites, videos };
  };

  const { sites, videos } = categorizeResources(items);

  return (
    <div className="p-4 bg-white rounded shadow">
      <h2 className="font-semibold mb-3">📚 Learning Resources</h2>
      {items.length === 0 ? (
        <div className="text-center py-6">
          <div className="text-gray-400 text-4xl mb-2">📚</div>
          <p className="text-gray-400 text-sm">No resources yet</p>
          <p className="text-gray-300 text-xs mt-1">Ask the Learning Assistant for resources</p>
        </div>
      ) : (
        <div className="space-y-4">
          {/* Websites Section */}
          {sites.length > 0 && (
            <div>
              <h3 className="text-sm font-medium text-gray-700 mb-2 flex items-center">
                <span className="mr-1">🌐</span> Websites & Documentation
              </h3>
              <div className="space-y-2">
                {sites.map((url, idx) => (
                  <a 
                    key={`site-${idx}`}
                    href={url} 
                    target="_blank" 
                    rel="noreferrer"
                    className="flex items-center p-2 hover:bg-blue-50 rounded-md border border-transparent hover:border-blue-200 transition-colors"
                  >
                    <div className="w-8 h-8 flex items-center justify-center bg-blue-100 text-blue-700 rounded-full mr-2 font-bold text-sm">
                      {getDisplayName(url).charAt(0)}
                    </div>
                    <div className="flex-grow">
                      <div className="text-blue-600 font-medium text-sm">{getDisplayName(url)}</div>
                      <div className="text-xs text-gray-500 truncate">{url}</div>
                    </div>
                    <div className="text-gray-400">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                      </svg>
                    </div>
                  </a>
                ))}
              </div>
            </div>
          )}

          {/* Videos Section */}
          {videos.length > 0 && (
            <div>
              <h3 className="text-sm font-medium text-gray-700 mb-2 flex items-center">
                <span className="mr-1">🎥</span> Videos & Courses
              </h3>
              <div className="space-y-2">
                {videos.map((url, idx) => (
                  <a 
                    key={`video-${idx}`}
                    href={url} 
                    target="_blank" 
                    rel="noreferrer"
                    className="flex items-center p-2 hover:bg-red-50 rounded-md border border-transparent hover:border-red-200 transition-colors"
                  >
                    <div className="w-8 h-8 flex items-center justify-center bg-red-100 text-red-700 rounded-full mr-2 font-bold text-sm">
                      {getDisplayName(url).charAt(0)}
                    </div>
                    <div className="flex-grow">
                      <div className="text-red-600 font-medium text-sm">{getDisplayName(url)}</div>
                      <div className="text-xs text-gray-500 truncate">{url}</div>
                    </div>
                    <div className="text-gray-400">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                      </svg>
                    </div>
                  </a>
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
