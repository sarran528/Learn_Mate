import React, { useState } from 'react';
import { File, FolderPlus, Terminal, Package, ArrowRight, Check, X } from 'lucide-react';

/**
 * Project Generator component that creates custom learning project structures
 * based on user input and selected technologies
 */
export default function ProjectGenerator({ onCreateProject, darkMode = false }) {
  const [projectName, setProjectName] = useState('');
  const [projectType, setProjectType] = useState('');
  const [technologies, setTechnologies] = useState([]);
  const [features, setFeatures] = useState([]);
  const [difficulty, setDifficulty] = useState('beginner');
  const [isGenerating, setIsGenerating] = useState(false);
  const [step, setStep] = useState(1);
  const [customTech, setCustomTech] = useState('');
  const [customFeature, setCustomFeature] = useState('');

  // Project types with descriptions
  const projectTypes = [
    { id: 'web', name: 'Web Application', icon: <File size={18} />, description: 'Create a browser-based application with frontend and optional backend components.' },
    { id: 'mobile', name: 'Mobile App', icon: <Terminal size={18} />, description: 'Build a mobile application using React Native, Flutter, or native technologies.' },
    { id: 'api', name: 'API / Backend', icon: <Package size={18} />, description: 'Develop a backend service or API to handle data processing and storage.' },
    { id: 'library', name: 'Library / Package', icon: <FolderPlus size={18} />, description: 'Create a reusable code library or package that others can incorporate into their projects.' }
  ];

  // Technology options by project type
  const technologyOptions = {
    web: [
      'React', 'Angular', 'Vue.js', 'Next.js', 'Svelte', 'HTML/CSS/JS', 
      'TypeScript', 'Tailwind CSS', 'Bootstrap', 'Material UI'
    ],
    mobile: [
      'React Native', 'Flutter', 'Swift', 'Kotlin', 'Ionic', 
      'Expo', 'NativeScript'
    ],
    api: [
      'Node.js/Express', 'Python/Flask', 'Python/FastAPI', 'Python/Django',
      'Java/Spring Boot', 'Ruby on Rails', 'ASP.NET Core', 'Go'
    ],
    library: [
      'JavaScript', 'TypeScript', 'Python', 'Java', 'C#', 'Go', 'Rust'
    ]
  };

  // Feature options by project type
  const featureOptions = {
    web: [
      'User Authentication', 'Database Integration', 'API Integration', 
      'Form Validation', 'Responsive Design', 'Dark Mode', 
      'Search Functionality', 'Internationalization'
    ],
    mobile: [
      'User Authentication', 'Local Storage', 'Push Notifications', 
      'Camera Access', 'Geolocation', 'Offline Mode', 
      'Social Media Integration', 'In-App Purchases'
    ],
    api: [
      'Authentication/Authorization', 'Database Integration', 'Caching', 
      'Rate Limiting', 'Data Validation', 'Error Handling', 
      'Logging', 'API Documentation', 'Testing'
    ],
    library: [
      'Documentation', 'Unit Tests', 'CI/CD Integration', 
      'Versioning', 'Examples', 'TypeScript Definitions',
      'Cross-platform Support'
    ]
  };

  const handleTechnologyToggle = (tech) => {
    if (technologies.includes(tech)) {
      setTechnologies(technologies.filter(t => t !== tech));
    } else {
      setTechnologies([...technologies, tech]);
    }
  };

  const handleFeatureToggle = (feature) => {
    if (features.includes(feature)) {
      setFeatures(features.filter(f => f !== feature));
    } else {
      setFeatures([...features, feature]);
    }
  };

  const addCustomTechnology = () => {
    if (customTech && !technologies.includes(customTech)) {
      setTechnologies([...technologies, customTech]);
      setCustomTech('');
    }
  };

  const addCustomFeature = () => {
    if (customFeature && !features.includes(customFeature)) {
      setFeatures([...features, customFeature]);
      setCustomFeature('');
    }
  };

  const handleProjectGeneration = () => {
    setIsGenerating(true);
    
    // Create project structure based on selected options
    const projectStructure = generateProjectStructure();
    
    // Generate learning resources based on technologies and features
    const learningResources = generateLearningResources();
    
    // Generate step-by-step guide
    const implementationSteps = generateImplementationSteps();
    
    // Create milestones based on difficulty
    const projectMilestones = generateProjectMilestones();
    
    setTimeout(() => {
      setIsGenerating(false);
      
      // Pass the generated project plan to the parent component
      onCreateProject({
        name: projectName,
        type: projectTypes.find(t => t.id === projectType)?.name || projectType,
        technologies,
        features,
        difficulty,
        structure: projectStructure,
        resources: learningResources,
        steps: implementationSteps,
        milestones: projectMilestones,
        createdAt: new Date().toISOString()
      });
      
      // Reset form
      resetForm();
    }, 1500);
  };
  
  const resetForm = () => {
    setProjectName('');
    setProjectType('');
    setTechnologies([]);
    setFeatures([]);
    setDifficulty('beginner');
    setStep(1);
    setCustomTech('');
    setCustomFeature('');
  };

  const generateProjectStructure = () => {
    const structure = [];
    
    // Base structure depends on project type
    if (projectType === 'web') {
      structure.push(
        { type: 'folder', name: 'public', children: [
            { type: 'file', name: 'index.html' },
            { type: 'file', name: 'favicon.ico' }
          ]
        },
        { type: 'folder', name: 'src', children: [
            { type: 'file', name: 'index.js' },
            { type: 'file', name: 'App.js' },
            { type: 'folder', name: 'components', children: [] },
            { type: 'folder', name: 'styles', children: [] },
            { type: 'folder', name: 'assets', children: [] }
          ]
        }
      );
      
      // Add React-specific files if React is selected
      if (technologies.includes('React')) {
        structure[1].children.push(
          { type: 'folder', name: 'hooks', children: [
              { type: 'file', name: 'useAuth.js' }
            ]
          },
          { type: 'folder', name: 'context', children: [
              { type: 'file', name: 'AuthContext.js' }
            ]
          }
        );
      }
      
      // Add TypeScript support if selected
      if (technologies.includes('TypeScript')) {
        structure.push({ type: 'file', name: 'tsconfig.json' });
        // Convert js files to ts/tsx
        structure[1].children = structure[1].children.map(item => {
          if (item.type === 'file' && item.name.endsWith('.js')) {
            return { ...item, name: item.name.replace('.js', technologies.includes('React') ? '.tsx' : '.ts') };
          }
          if (item.type === 'folder' && (item.name === 'hooks' || item.name === 'context') && item.children) {
            return {
              ...item, 
              children: item.children.map(child => 
                child.type === 'file' ? 
                { ...child, name: child.name.replace('.js', '.ts') } : 
                child
              )
            };
          }
          return item;
        });
      }
      
      // Add feature-specific folders
      if (features.includes('API Integration')) {
        structure[1].children.push({ type: 'folder', name: 'api', children: [
            { type: 'file', name: technologies.includes('TypeScript') ? 'apiClient.ts' : 'apiClient.js' }
          ]
        });
      }
      
      if (features.includes('Database Integration')) {
        structure.push({ type: 'folder', name: 'database', children: [
            { type: 'file', name: technologies.includes('TypeScript') ? 'schema.ts' : 'schema.js' },
            { type: 'file', name: technologies.includes('TypeScript') ? 'models.ts' : 'models.js' }
          ]
        });
      }
    }
    
    else if (projectType === 'api') {
      structure.push(
        { type: 'folder', name: 'src', children: [
            { type: 'file', name: 'index.js' },
            { type: 'folder', name: 'routes', children: [
                { type: 'file', name: 'index.js' }
              ]
            },
            { type: 'folder', name: 'controllers', children: [] },
            { type: 'folder', name: 'models', children: [] },
            { type: 'folder', name: 'middleware', children: [
                { type: 'file', name: 'errorHandler.js' }
              ]
            },
            { type: 'folder', name: 'config', children: [
                { type: 'file', name: 'db.js' }
              ]
            }
          ]
        },
        { type: 'file', name: '.env.example' },
        { type: 'file', name: 'package.json' }
      );
      
      // Add TypeScript support if selected
      if (technologies.includes('TypeScript')) {
        structure.push({ type: 'file', name: 'tsconfig.json' });
        // Convert js files to ts
        const convertToTs = (items) => {
          return items.map(item => {
            if (item.type === 'file' && item.name.endsWith('.js')) {
              return { ...item, name: item.name.replace('.js', '.ts') };
            }
            if (item.type === 'folder' && item.children) {
              return { ...item, children: convertToTs(item.children) };
            }
            return item;
          });
        };
        
        structure = convertToTs(structure);
      }
      
      // Add feature-specific files
      if (features.includes('Authentication/Authorization')) {
        structure[0].children[4].children.push(
          { type: 'file', name: technologies.includes('TypeScript') ? 'auth.ts' : 'auth.js' }
        );
        structure[0].children[1].children.push(
          { type: 'file', name: technologies.includes('TypeScript') ? 'auth.ts' : 'auth.js' }
        );
      }
    }
    
    else if (projectType === 'mobile') {
      structure.push(
        { type: 'folder', name: 'src', children: [
            { type: 'file', name: 'App.js' },
            { type: 'folder', name: 'screens', children: [
                { type: 'file', name: 'HomeScreen.js' },
                { type: 'file', name: 'ProfileScreen.js' }
              ]
            },
            { type: 'folder', name: 'components', children: [] },
            { type: 'folder', name: 'navigation', children: [
                { type: 'file', name: 'AppNavigator.js' }
              ]
            },
            { type: 'folder', name: 'assets', children: [] }
          ]
        },
        { type: 'file', name: 'package.json' }
      );
      
      // Add TypeScript support if selected
      if (technologies.includes('TypeScript')) {
        structure.push({ type: 'file', name: 'tsconfig.json' });
        // Convert js files to ts/tsx
        const convertToTsx = (items) => {
          return items.map(item => {
            if (item.type === 'file' && item.name.endsWith('.js')) {
              return { ...item, name: item.name.replace('.js', '.tsx') };
            }
            if (item.type === 'folder' && item.children) {
              return { ...item, children: convertToTsx(item.children) };
            }
            return item;
          });
        };
        
        structure = convertToTsx(structure);
      }
      
      // Add feature-specific folders
      if (features.includes('Local Storage')) {
        structure[0].children.push({ 
          type: 'folder', 
          name: 'storage', 
          children: [
            { type: 'file', name: technologies.includes('TypeScript') ? 'asyncStorage.ts' : 'asyncStorage.js' }
          ]
        });
      }
      
      if (features.includes('Push Notifications')) {
        structure[0].children.push({ 
          type: 'folder', 
          name: 'notifications', 
          children: [
            { type: 'file', name: technologies.includes('TypeScript') ? 'pushNotifications.ts' : 'pushNotifications.js' }
          ]
        });
      }
    }
    
    else if (projectType === 'library') {
      structure.push(
        { type: 'folder', name: 'src', children: [
            { type: 'file', name: 'index.js' },
            { type: 'folder', name: 'lib', children: [] }
          ]
        },
        { type: 'folder', name: 'tests', children: [
            { type: 'file', name: 'index.test.js' }
          ]
        },
        { type: 'folder', name: 'examples', children: [] },
        { type: 'file', name: 'package.json' },
        { type: 'file', name: 'README.md' }
      );
      
      // Add TypeScript support if selected
      if (technologies.includes('TypeScript')) {
        structure.push({ type: 'file', name: 'tsconfig.json' });
        // Convert js files to ts
        const convertToTs = (items) => {
          return items.map(item => {
            if (item.type === 'file' && item.name.endsWith('.js')) {
              return { ...item, name: item.name.replace('.js', '.ts') };
            }
            if (item.type === 'file' && item.name.endsWith('.test.js')) {
              return { ...item, name: item.name.replace('.test.js', '.test.ts') };
            }
            if (item.type === 'folder' && item.children) {
              return { ...item, children: convertToTs(item.children) };
            }
            return item;
          });
        };
        
        structure = convertToTs(structure);
      }
      
      // Add feature-specific files
      if (features.includes('Documentation')) {
        structure.push({ type: 'folder', name: 'docs', children: [
            { type: 'file', name: 'getting-started.md' },
            { type: 'file', name: 'api-reference.md' }
          ]
        });
      }
    }
    
    // Common files for all project types
    structure.push(
      { type: 'file', name: '.gitignore' },
      { type: 'file', name: 'README.md' }
    );
    
    // Add testing setup if unit tests feature is selected
    if (features.includes('Unit Tests') || features.includes('Testing')) {
      structure.push(
        { type: 'folder', name: 'tests', children: [
            { type: 'file', name: technologies.includes('TypeScript') ? 'setup.ts' : 'setup.js' }
          ]
        }
      );
    }
    
    return structure;
  };

  const generateLearningResources = () => {
    const resources = [];
    
    // Base resources by project type
    if (projectType === 'web') {
      resources.push({
        title: 'Web Development Fundamentals',
        url: 'https://developer.mozilla.org/en-US/docs/Learn',
        description: 'Mozilla Developer Network (MDN) comprehensive web development learning resources'
      });
    } else if (projectType === 'mobile') {
      resources.push({
        title: 'Mobile App Development Guide',
        url: 'https://www.codecademy.com/learn/paths/build-ios-apps-with-swiftui',
        description: 'Learn the fundamentals of mobile app development'
      });
    } else if (projectType === 'api') {
      resources.push({
        title: 'RESTful API Design',
        url: 'https://restfulapi.net/',
        description: 'Guide to designing RESTful APIs and best practices'
      });
    } else if (projectType === 'library') {
      resources.push({
        title: 'Creating and Publishing Libraries',
        url: 'https://docs.npmjs.com/packages-and-modules/contributing-packages-to-the-registry',
        description: 'Guide to creating and publishing packages to npm'
      });
    }
    
    // Add technology-specific resources
    technologies.forEach(tech => {
      switch(tech) {
        case 'React':
          resources.push({
            title: 'React Official Documentation',
            url: 'https://react.dev',
            description: 'Official React documentation with tutorials and API reference'
          });
          break;
        case 'Angular':
          resources.push({
            title: 'Angular Documentation',
            url: 'https://angular.io/docs',
            description: 'Official Angular documentation and tutorials'
          });
          break;
        case 'Vue.js':
          resources.push({
            title: 'Vue.js Guide',
            url: 'https://vuejs.org/guide/introduction.html',
            description: 'Official Vue.js documentation with tutorials and examples'
          });
          break;
        case 'TypeScript':
          resources.push({
            title: 'TypeScript Handbook',
            url: 'https://www.typescriptlang.org/docs/',
            description: 'Official TypeScript documentation and guides'
          });
          break;
        case 'Next.js':
          resources.push({
            title: 'Next.js Documentation',
            url: 'https://nextjs.org/docs',
            description: 'Learn Next.js features and API'
          });
          break;
        case 'Node.js/Express':
          resources.push({
            title: 'Express.js Documentation',
            url: 'https://expressjs.com/',
            description: 'Official Express.js web framework documentation'
          });
          break;
        case 'Python/Flask':
          resources.push({
            title: 'Flask Documentation',
            url: 'https://flask.palletsprojects.com/',
            description: 'Official Flask web framework documentation'
          });
          break;
        case 'React Native':
          resources.push({
            title: 'React Native Documentation',
            url: 'https://reactnative.dev/docs/getting-started',
            description: 'Official React Native documentation and tutorials'
          });
          break;
        case 'Flutter':
          resources.push({
            title: 'Flutter Documentation',
            url: 'https://docs.flutter.dev/',
            description: 'Official Flutter documentation and tutorials'
          });
          break;
        default:
          // For any other technology, add a generic resource
          resources.push({
            title: `${tech} Learning Resources`,
            url: `https://www.google.com/search?q=${encodeURIComponent(tech)}+tutorial`,
            description: `Find tutorials and documentation for ${tech}`
          });
      }
    });
    
    // Add feature-specific resources
    features.forEach(feature => {
      switch(feature) {
        case 'User Authentication':
          resources.push({
            title: 'Authentication Best Practices',
            url: 'https://cheatsheetseries.owasp.org/cheatsheets/Authentication_Cheat_Sheet.html',
            description: 'OWASP Authentication best practices and security guidelines'
          });
          break;
        case 'Database Integration':
          resources.push({
            title: 'Database Integration Guide',
            url: 'https://www.prisma.io/docs/',
            description: 'Modern database access for TypeScript & Node.js (Prisma)'
          });
          break;
        case 'API Integration':
          resources.push({
            title: 'Working with APIs',
            url: 'https://developer.mozilla.org/en-US/docs/Learn/JavaScript/Client-side_web_APIs/Introduction',
            description: 'Introduction to APIs and how to use them'
          });
          break;
        case 'Push Notifications':
          resources.push({
            title: 'Push Notifications Guide',
            url: 'https://developer.mozilla.org/en-US/docs/Web/API/Push_API',
            description: 'Implementing push notifications in web applications'
          });
          break;
        default:
          // For any other feature, add a generic resource
          resources.push({
            title: `${feature} Implementation Guide`,
            url: `https://www.google.com/search?q=how+to+implement+${encodeURIComponent(feature.toLowerCase())}`,
            description: `Learn how to implement ${feature} in your project`
          });
      }
    });
    
    // Add difficulty-specific resources
    if (difficulty === 'beginner') {
      resources.push({
        title: 'Programming Fundamentals',
        url: 'https://www.freecodecamp.org/',
        description: 'Free interactive coding lessons for beginners'
      });
    } else if (difficulty === 'intermediate') {
      resources.push({
        title: 'Design Patterns',
        url: 'https://refactoring.guru/design-patterns',
        description: 'Learn software design patterns and principles'
      });
    } else if (difficulty === 'advanced') {
      resources.push({
        title: 'Advanced Software Architecture',
        url: 'https://github.com/donnemartin/system-design-primer',
        description: 'Learn how to design large-scale systems'
      });
    }
    
    return resources;
  };

  const generateImplementationSteps = () => {
    const steps = [];
    
    // Base setup steps
    steps.push({
      title: 'Project Setup',
      tasks: [
        'Create project directory',
        'Initialize version control (git)',
        'Create basic project structure',
        'Set up development environment',
        'Install core dependencies'
      ]
    });
    
    // Technology-specific setup steps
    if (projectType === 'web') {
      steps.push({
        title: 'Frontend Setup',
        tasks: [
          'Set up HTML structure',
          'Create basic CSS/styling',
          'Implement responsive layout',
          'Set up JavaScript/TypeScript configuration'
        ]
      });
      
      if (technologies.includes('React') || technologies.includes('Angular') || technologies.includes('Vue.js')) {
        steps.push({
          title: 'Component Structure',
          tasks: [
            'Design component hierarchy',
            'Implement core components',
            'Set up routing/navigation',
            'Implement state management'
          ]
        });
      }
    } else if (projectType === 'api') {
      steps.push({
        title: 'API Design',
        tasks: [
          'Define API endpoints',
          'Create data models',
          'Implement controllers/handlers',
          'Set up database connection',
          'Implement validation logic'
        ]
      });
    } else if (projectType === 'mobile') {
      steps.push({
        title: 'Mobile App Structure',
        tasks: [
          'Set up navigation flow',
          'Design screen layouts',
          'Implement core screens',
          'Handle device permissions'
        ]
      });
    } else if (projectType === 'library') {
      steps.push({
        title: 'Library Design',
        tasks: [
          'Define public API',
          'Implement core functionality',
          'Create documentation',
          'Write usage examples',
          'Set up build configuration'
        ]
      });
    }
    
    // Feature-specific implementation steps
    features.forEach(feature => {
      switch(feature) {
        case 'User Authentication':
          steps.push({
            title: 'Authentication System',
            tasks: [
              'Create login/registration forms',
              'Implement authentication logic',
              'Set up secure token storage',
              'Create protected routes',
              'Implement user profile management'
            ]
          });
          break;
        case 'Database Integration':
          steps.push({
            title: 'Database Setup',
            tasks: [
              'Choose database system',
              'Design database schema',
              'Set up database connection',
              'Create data models',
              'Implement CRUD operations'
            ]
          });
          break;
        case 'API Integration':
          steps.push({
            title: 'External API Integration',
            tasks: [
              'Research API documentation',
              'Set up API client',
              'Implement data fetching',
              'Handle API responses',
              'Implement error handling'
            ]
          });
          break;
        case 'Testing':
          steps.push({
            title: 'Testing Setup',
            tasks: [
              'Choose testing framework',
              'Write unit tests',
              'Create integration tests',
              'Set up test automation',
              'Implement test coverage reporting'
            ]
          });
          break;
      }
    });
    
    // Final steps
    steps.push({
      title: 'Finalization',
      tasks: [
        'Perform code review',
        'Optimize performance',
        'Handle edge cases',
        'Write documentation',
        'Prepare for deployment'
      ]
    });
    
    return steps;
  };

  const generateProjectMilestones = () => {
    const milestones = [];
    
    // Base milestones by difficulty
    if (difficulty === 'beginner') {
      milestones.push(
        {
          title: 'Project Setup Complete',
          description: 'Basic project structure and environment setup completed',
          criteria: 'Repository created, dependencies installed, project structure established'
        },
        {
          title: 'Core Functionality Working',
          description: 'Basic features implemented and working',
          criteria: 'Main functionality works without errors'
        },
        {
          title: 'Project Completion',
          description: 'All planned features implemented',
          criteria: 'Project meets all basic requirements and is ready for review'
        }
      );
    } else if (difficulty === 'intermediate') {
      milestones.push(
        {
          title: 'Architecture Design Complete',
          description: 'Project architecture designed and documented',
          criteria: 'Component diagram, data flow, and API design documents completed'
        },
        {
          title: 'Core System Implementation',
          description: 'Key system components implemented',
          criteria: 'Main functionality working with proper error handling'
        },
        {
          title: 'Feature Integration Complete',
          description: 'All planned features integrated and working together',
          criteria: 'Features work correctly and interact properly with each other'
        },
        {
          title: 'Testing & Refinement',
          description: 'Testing completed and issues addressed',
          criteria: 'All tests passing, code quality issues fixed'
        },
        {
          title: 'Project Completion',
          description: 'Project complete and ready for deployment',
          criteria: 'All requirements met, documentation complete, ready for production'
        }
      );
    } else if (difficulty === 'advanced') {
      milestones.push(
        {
          title: 'System Architecture Design',
          description: 'Comprehensive system architecture designed and documented',
          criteria: 'Architecture diagrams, data models, API specifications completed'
        },
        {
          title: 'Infrastructure Setup',
          description: 'Development and deployment infrastructure configured',
          criteria: 'CI/CD pipelines, environments, and monitoring tools set up'
        },
        {
          title: 'Core System Implementation',
          description: 'Core system components built and integrated',
          criteria: 'Key functionality working with proper error handling and logging'
        },
        {
          title: 'Feature Implementation Complete',
          description: 'All planned features fully implemented',
          criteria: 'Features working correctly with proper test coverage'
        },
        {
          title: 'Performance Optimization',
          description: 'System optimized for performance and scale',
          criteria: 'Performance benchmarks met, bottlenecks addressed'
        },
        {
          title: 'Security Audit',
          description: 'Security review completed',
          criteria: 'Security vulnerabilities addressed, authentication/authorization working properly'
        },
        {
          title: 'Final Testing & Documentation',
          description: 'Comprehensive testing and documentation completed',
          criteria: 'Test coverage targets met, documentation complete and accurate'
        },
        {
          title: 'Project Completion',
          description: 'Project ready for production deployment',
          criteria: 'All requirements met, code quality standards achieved, production-ready'
        }
      );
    }
    
    return milestones;
  };

  const renderFormStep = () => {
    switch(step) {
      case 1:
        return (
          <>
            <h3 className={`text-xl font-semibold mb-4 ${darkMode ? 'text-white' : 'text-gray-800'}`}>
              Project Basics
            </h3>
            <div className="space-y-4">
              <div>
                <label className={`block text-sm font-medium mb-1 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                  Project Name
                </label>
                <input
                  type="text"
                  value={projectName}
                  onChange={(e) => setProjectName(e.target.value)}
                  placeholder="My Learning Project"
                  className={`w-full px-4 py-2 rounded-md border ${
                    darkMode 
                      ? 'bg-gray-800 border-gray-700 text-white placeholder-gray-500' 
                      : 'bg-white border-gray-300 text-gray-900 placeholder-gray-400'
                  } focus:outline-none focus:ring-2 focus:ring-blue-500`}
                />
              </div>
              
              <div>
                <label className={`block text-sm font-medium mb-2 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                  Project Type
                </label>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {projectTypes.map((type) => (
                    <button
                      key={type.id}
                      onClick={() => setProjectType(type.id)}
                      className={`flex items-start p-3 rounded-lg border transition-all ${
                        projectType === type.id
                          ? (darkMode 
                              ? 'bg-blue-900/50 border-blue-500 ring-1 ring-blue-500' 
                              : 'bg-blue-50 border-blue-500 ring-1 ring-blue-500'
                            )
                          : (darkMode 
                              ? 'border-gray-700 hover:bg-gray-800' 
                              : 'border-gray-300 hover:bg-gray-50'
                            )
                      }`}
                    >
                      <div className={`p-2 rounded-md mr-3 flex-shrink-0 ${
                        projectType === type.id
                          ? 'bg-blue-500 text-white'
                          : (darkMode ? 'bg-gray-700 text-gray-300' : 'bg-gray-200 text-gray-600')
                      }`}>
                        {type.icon}
                      </div>
                      <div className="flex-1">
                        <h4 className={`font-medium ${darkMode ? 'text-white' : 'text-gray-900'}`}>{type.name}</h4>
                        <p className={`text-xs mt-1 ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>{type.description}</p>
                      </div>
                    </button>
                  ))}
                </div>
              </div>
              
              <div>
                <label className={`block text-sm font-medium mb-2 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                  Difficulty Level
                </label>
                <div className="grid grid-cols-3 gap-3">
                  {['beginner', 'intermediate', 'advanced'].map((level) => (
                    <button
                      key={level}
                      onClick={() => setDifficulty(level)}
                      className={`px-4 py-2 rounded-md border transition-all text-sm font-medium ${
                        difficulty === level
                          ? (darkMode 
                              ? 'bg-blue-900/50 border-blue-500 text-blue-400' 
                              : 'bg-blue-50 border-blue-500 text-blue-700'
                            )
                          : (darkMode 
                              ? 'border-gray-700 text-gray-300 hover:bg-gray-800' 
                              : 'border-gray-300 text-gray-700 hover:bg-gray-50'
                            )
                      }`}
                    >
                      {level.charAt(0).toUpperCase() + level.slice(1)}
                    </button>
                  ))}
                </div>
              </div>
              
              <div className="flex justify-end pt-2">
                <button
                  onClick={() => setStep(2)}
                  disabled={!projectName || !projectType}
                  className={`flex items-center gap-2 px-4 py-2 rounded-md font-medium ${
                    !projectName || !projectType
                      ? (darkMode ? 'bg-gray-700 text-gray-500' : 'bg-gray-200 text-gray-500') + ' cursor-not-allowed'
                      : (darkMode ? 'bg-blue-600 hover:bg-blue-700' : 'bg-blue-500 hover:bg-blue-600') + ' text-white'
                  }`}
                >
                  <span>Continue</span>
                  <ArrowRight size={16} />
                </button>
              </div>
            </div>
          </>
        );
      
      case 2:
        return (
          <>
            <h3 className={`text-xl font-semibold mb-4 ${darkMode ? 'text-white' : 'text-gray-800'}`}>
              Select Technologies
            </h3>
            
            {projectType && technologyOptions[projectType] && (
              <div className="mb-5">
                <div className="flex flex-wrap gap-2 mb-4">
                  {technologyOptions[projectType].map((tech) => (
                    <button
                      key={tech}
                      onClick={() => handleTechnologyToggle(tech)}
                      className={`px-3 py-1.5 rounded-md text-sm font-medium transition-all ${
                        technologies.includes(tech)
                          ? (darkMode 
                              ? 'bg-blue-600 text-white' 
                              : 'bg-blue-500 text-white'
                            )
                          : (darkMode 
                              ? 'bg-gray-800 text-gray-300 border border-gray-700' 
                              : 'bg-gray-100 text-gray-700 border border-gray-300'
                            )
                      }`}
                    >
                      {tech}
                    </button>
                  ))}
                </div>
                
                <div className="mt-3">
                  <label className={`block text-sm font-medium mb-1 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                    Add Custom Technology
                  </label>
                  <div className="flex gap-2">
                    <input
                      type="text"
                      value={customTech}
                      onChange={(e) => setCustomTech(e.target.value)}
                      placeholder="Enter technology name"
                      className={`flex-1 px-3 py-2 rounded-md border text-sm ${
                        darkMode 
                          ? 'bg-gray-800 border-gray-700 text-white placeholder-gray-500' 
                          : 'bg-white border-gray-300 text-gray-900 placeholder-gray-400'
                      } focus:outline-none focus:ring-2 focus:ring-blue-500`}
                    />
                    <button
                      onClick={addCustomTechnology}
                      disabled={!customTech}
                      className={`px-3 py-1 rounded-md text-sm ${
                        !customTech
                          ? (darkMode ? 'bg-gray-700 text-gray-500' : 'bg-gray-200 text-gray-500') + ' cursor-not-allowed'
                          : (darkMode ? 'bg-blue-600 hover:bg-blue-700' : 'bg-blue-500 hover:bg-blue-600') + ' text-white'
                      }`}
                    >
                      Add
                    </button>
                  </div>
                </div>
              </div>
            )}
            
            <div className="flex justify-between pt-4">
              <button
                onClick={() => setStep(1)}
                className={`flex items-center gap-2 px-4 py-2 rounded-md font-medium ${
                  darkMode 
                    ? 'bg-gray-800 text-gray-300 hover:bg-gray-700' 
                    : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                }`}
              >
                Back
              </button>
              <button
                onClick={() => setStep(3)}
                disabled={technologies.length === 0}
                className={`flex items-center gap-2 px-4 py-2 rounded-md font-medium ${
                  technologies.length === 0
                    ? (darkMode ? 'bg-gray-700 text-gray-500' : 'bg-gray-200 text-gray-500') + ' cursor-not-allowed'
                    : (darkMode ? 'bg-blue-600 hover:bg-blue-700' : 'bg-blue-500 hover:bg-blue-600') + ' text-white'
                }`}
              >
                <span>Continue</span>
                <ArrowRight size={16} />
              </button>
            </div>
          </>
        );
        
      case 3:
        return (
          <>
            <h3 className={`text-xl font-semibold mb-4 ${darkMode ? 'text-white' : 'text-gray-800'}`}>
              Select Features
            </h3>
            
            {projectType && featureOptions[projectType] && (
              <div className="mb-5">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 mb-4">
                  {featureOptions[projectType].map((feature) => (
                    <button
                      key={feature}
                      onClick={() => handleFeatureToggle(feature)}
                      className={`flex items-center px-3 py-2 rounded-md text-sm transition-all ${
                        features.includes(feature)
                          ? (darkMode 
                              ? 'bg-green-900/50 border border-green-700 text-green-400' 
                              : 'bg-green-50 border border-green-500 text-green-700'
                            )
                          : (darkMode 
                              ? 'bg-gray-800 border border-gray-700 text-gray-300' 
                              : 'bg-gray-50 border border-gray-300 text-gray-700'
                            )
                      }`}
                    >
                      <span className="flex-1 text-left">{feature}</span>
                      {features.includes(feature) ? (
                        <Check size={16} className={darkMode ? 'text-green-400' : 'text-green-600'} />
                      ) : null}
                    </button>
                  ))}
                </div>
                
                <div className="mt-3">
                  <label className={`block text-sm font-medium mb-1 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                    Add Custom Feature
                  </label>
                  <div className="flex gap-2">
                    <input
                      type="text"
                      value={customFeature}
                      onChange={(e) => setCustomFeature(e.target.value)}
                      placeholder="Enter feature name"
                      className={`flex-1 px-3 py-2 rounded-md border text-sm ${
                        darkMode 
                          ? 'bg-gray-800 border-gray-700 text-white placeholder-gray-500' 
                          : 'bg-white border-gray-300 text-gray-900 placeholder-gray-400'
                      } focus:outline-none focus:ring-2 focus:ring-blue-500`}
                    />
                    <button
                      onClick={addCustomFeature}
                      disabled={!customFeature}
                      className={`px-3 py-1 rounded-md text-sm ${
                        !customFeature
                          ? (darkMode ? 'bg-gray-700 text-gray-500' : 'bg-gray-200 text-gray-500') + ' cursor-not-allowed'
                          : (darkMode ? 'bg-blue-600 hover:bg-blue-700' : 'bg-blue-500 hover:bg-blue-600') + ' text-white'
                      }`}
                    >
                      Add
                    </button>
                  </div>
                </div>
              </div>
            )}
            
            <div className="flex justify-between pt-4">
              <button
                onClick={() => setStep(2)}
                className={`flex items-center gap-2 px-4 py-2 rounded-md font-medium ${
                  darkMode 
                    ? 'bg-gray-800 text-gray-300 hover:bg-gray-700' 
                    : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                }`}
              >
                Back
              </button>
              <button
                onClick={handleProjectGeneration}
                disabled={isGenerating}
                className={`flex items-center gap-2 px-4 py-2 rounded-md font-medium ${
                  isGenerating
                    ? (darkMode ? 'bg-gray-700 text-gray-500' : 'bg-gray-200 text-gray-500') + ' cursor-not-allowed'
                    : (darkMode ? 'bg-blue-600 hover:bg-blue-700' : 'bg-blue-500 hover:bg-blue-600') + ' text-white'
                }`}
              >
                {isGenerating ? (
                  <>
                    <div className="animate-spin h-4 w-4 border-2 border-white border-opacity-20 border-t-white rounded-full"></div>
                    <span>Generating...</span>
                  </>
                ) : (
                  <>
                    <span>Generate Project</span>
                  </>
                )}
              </button>
            </div>
          </>
        );
        
      default:
        return null;
    }
  };

  return (
    <div className={`p-6 rounded-lg shadow-lg ${
      darkMode 
        ? 'bg-gray-900 text-gray-100' 
        : 'bg-white text-gray-900'
    }`}>
      <div className="flex items-center justify-between mb-6">
        <h2 className={`text-2xl font-bold ${darkMode ? 'text-white' : 'text-gray-900'}`}>
          Project Generator
        </h2>
        <div className={`px-3 py-1.5 rounded-full text-xs font-medium ${
          darkMode ? 'bg-blue-900/50 text-blue-300' : 'bg-blue-100 text-blue-700'
        }`}>
          AI-Powered
        </div>
      </div>
      
      {renderFormStep()}
    </div>
  );
}
