import { Globe2, Share2, Database, Cloud } from 'lucide-react';
import ArchitectureDiagram from './ArchitectureDiagram';

interface HomePageProps {
  onNavigate: (page: string) => void;
}

export default function HomePage({ onNavigate }: HomePageProps) {
  const features = [
    {
      icon: <Globe2 size={48} />,
      title: 'Cross-Border Access',
      description: 'Connect media centers across different countries and regions seamlessly'
    },
    {
      icon: <Share2 size={48} />,
      title: 'Real-time Collaboration',
      description: 'Work together on media projects with teams worldwide in real-time'
    },
    {
      icon: <Database size={48} />,
      title: 'Distributed Storage',
      description: 'Secure distributed storage system for media files across multiple data centers'
    },
    {
      icon: <Cloud size={48} />,
      title: 'Cloud Integration',
      description: 'Seamless integration with cloud services for scalable media processing'
    }
  ];

  const architectureLayers = [
    {
      layer: 'Client Layer',
      components: ['React Frontend', 'User Interface', 'Navigation & Routing'],
      color: 'bg-blue-100',
      textColor: 'text-blue-900'
    },
    {
      layer: 'API Gateway',
      components: ['REST APIs', 'Request Validation', 'CORS Handling'],
      color: 'bg-purple-100',
      textColor: 'text-purple-900'
    },
    {
      layer: 'Business Logic',
      components: ['Course Management', 'Media Processing', 'Collaboration + Agreements'],
      color: 'bg-green-100',
      textColor: 'text-green-900'
    },
    {
      layer: 'Event Streaming',
      components: ['Kafka Broker', 'Collaboration Events Topic', 'Asynchronous Coordination'],
      color: 'bg-yellow-100',
      textColor: 'text-yellow-900'
    },
    {
      layer: 'Blockchain Trust',
      components: ['Smart Contracts', 'Data Integrity', 'Immutable Audit Trails'],
      color: 'bg-orange-100',
      textColor: 'text-orange-900'
    },
    {
      layer: 'Data Layer',
      components: ['In-Memory Store', 'File Upload Records', 'Collaboration State'],
      color: 'bg-red-100',
      textColor: 'text-red-900'
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#a8dadc] to-[#e0f4f5]">
      <div className="container mx-auto px-6 py-8">
        {/* Hero Section */}
        <div className="text-center mb-12">
          <h1 className="text-5xl mb-4 text-[#0d3b66]">
            Cross-Border Media Centers Collaboration
          </h1>
          <p className="text-xl text-gray-700 mb-8">
            Enterprise N-Tier Architecture for Global Media Collaboration
          </p>
          <div className="flex gap-4 justify-center">
            <button 
              onClick={() => onNavigate('media')}
              className="bg-[#0d3b66] text-white px-8 py-3 rounded-lg hover:bg-[#1a5080] transition-colors shadow-lg"
            >
              Explore Media Centers
            </button>
            <button 
              onClick={() => onNavigate('collaboration')}
              className="bg-white text-[#0d3b66] px-8 py-3 rounded-lg hover:bg-gray-100 transition-colors shadow-lg border-2 border-[#0d3b66]"
            >
              Start Collaboration
            </button>
          </div>
        </div>

        {/* Architecture Diagram */}
        <ArchitectureDiagram />

        {/* Client-Server Architecture */}
        <div className="bg-white rounded-lg shadow-lg p-8 mb-12">
          <h2 className="text-3xl text-center mb-8 text-[#0d3b66]">Client-Server Architecture</h2>
          
          {/* Architecture Diagram */}
          <div className="mb-12">
            <div className="flex flex-col lg:flex-row gap-8 items-center justify-center">
              {/* Left side - Client */}
              <div className="flex-1 bg-gradient-to-r from-blue-50 to-blue-100 rounded-lg p-6 border-2 border-blue-300 shadow-md">
                <div className="text-center">
                  <div className="text-2xl font-bold text-blue-900 mb-4">Frontend Client</div>
                  <div className="bg-white rounded p-4 mb-3">
                    <div className="font-semibold text-blue-700">React + Vite</div>
                    <div className="text-sm text-gray-600">Port: 5173</div>
                  </div>
                  <div className="text-sm text-blue-800 leading-relaxed">
                    • User Interface<br/>
                    • State Management<br/>
                    • API Calls<br/>
                    • Real-time Updates
                  </div>
                </div>
              </div>

              {/* Center - Connection */}
              <div className="flex flex-col items-center justify-center gap-3">
                <div className="text-3xl text-gray-400">↔</div>
                <div className="text-xs text-gray-600 text-center font-semibold">
                  HTTP/REST<br/>CORS<br/>Secure
                </div>
                <div className="text-3xl text-gray-400">↔</div>
              </div>

              {/* Right side - Server */}
              <div className="flex-1 bg-gradient-to-r from-purple-50 to-purple-100 rounded-lg p-6 border-2 border-purple-300 shadow-md">
                <div className="text-center">
                  <div className="text-2xl font-bold text-purple-900 mb-4">Backend Server</div>
                  <div className="bg-white rounded p-4 mb-3">
                    <div className="font-semibold text-purple-700">Express.js + Node.js</div>
                    <div className="text-sm text-gray-600">Port: 5000</div>
                  </div>
                  <div className="text-sm text-purple-800 leading-relaxed">
                    • REST APIs<br/>
                    • Business Logic<br/>
                    • Data Management<br/>
                    • Authentication
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Architecture Layers - Professional Flow Diagram */}
          <h3 className="text-2xl text-center mb-8 text-[#0d3b66]">N-Tier Architecture Flow</h3>
          <div className="max-w-4xl mx-auto">
            {architectureLayers.map((item, index) => (
              <div key={index} className="mb-6">
                {/* Layer Card */}
                <div className={`${item.color} rounded-xl p-6 border-3 border-gray-400 shadow-xl hover:shadow-2xl transition-all transform hover:scale-[1.02]`}>
                  <div className="flex items-start gap-4">
                    {/* Layer Number Badge */}
                    <div className={`${item.textColor} bg-white rounded-full w-12 h-12 flex items-center justify-center font-bold text-xl shadow-md flex-shrink-0`}>
                      {index + 1}
                    </div>
                    
                    {/* Layer Content */}
                    <div className="flex-1">
                      <div className={`${item.textColor} font-bold text-2xl mb-3`}>
                        {item.layer}
                      </div>
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-2">
                        {item.components.map((comp, i) => (
                          <div key={i} className="bg-white bg-opacity-70 rounded-lg px-3 py-2 text-sm text-gray-800 font-medium shadow-sm">
                            <span className="mr-2 text-gray-500">•</span>
                            {comp}
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Connection Arrow - Show relationships */}
                {index < architectureLayers.length - 1 && (
                  <div className="flex flex-col items-center py-3">
                    <div className="text-gray-400 text-4xl leading-none">↓</div>
                    <div className="text-xs text-gray-600 font-semibold mt-1 bg-white px-3 py-1 rounded-full shadow-sm">
                      {index === 0 && "Calls"}
                      {index === 1 && "Processes"}
                      {index === 2 && "Publishes / Verifies"}
                      {index === 3 && "Async Events"}
                      {index === 4 && "Stores & Audits"}
                    </div>
                  </div>
                )}

                {/* Parallel Processing Indicator for Event and Blockchain layers */}
                {index === 2 && (
                  <div className="flex items-center justify-center my-4">
                    <div className="text-gray-400 text-2xl">┌─────────┴─────────┐</div>
                  </div>
                )}
                {(index === 3 || index === 4) && index < architectureLayers.length - 1 && (
                  <div className="flex items-center justify-center">
                    <div className="text-gray-400 text-2xl">└─────────┬─────────┘</div>
                  </div>
                )}
              </div>
            ))}

            {/* Key Relationships Legend */}
            <div className="mt-8 bg-gradient-to-r from-gray-50 to-gray-100 rounded-xl p-6 border-2 border-gray-300">
              <h4 className="text-lg font-bold text-[#0d3b66] mb-4 text-center">Layer Relationships</h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                <div className="flex items-start gap-2">
                  <span className="text-blue-600 font-bold">↓</span>
                  <div>
                    <span className="font-semibold">Synchronous Flow:</span>
                    <span className="text-gray-700"> Client → API → Business Logic</span>
                  </div>
                </div>
                <div className="flex items-start gap-2">
                  <span className="text-yellow-600 font-bold">⚡</span>
                  <div>
                    <span className="font-semibold">Event Streaming:</span>
                    <span className="text-gray-700"> Kafka broadcasts collaboration events</span>
                  </div>
                </div>
                <div className="flex items-start gap-2">
                  <span className="text-orange-600 font-bold">🔒</span>
                  <div>
                    <span className="font-semibold">Blockchain Trust:</span>
                    <span className="text-gray-700"> Smart contracts verify & audit</span>
                  </div>
                </div>
                <div className="flex items-start gap-2">
                  <span className="text-red-600 font-bold">💾</span>
                  <div>
                    <span className="font-semibold">Data Persistence:</span>
                    <span className="text-gray-700"> In-memory store with collaboration state</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Features Grid */}
        <div className="mb-12">
          <h2 className="text-3xl text-center mb-8 text-[#0d3b66]">Platform Features</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {features.map((feature, index) => (
              <div 
                key={index}
                className="bg-white rounded-lg shadow-lg p-6 hover:shadow-xl transition-shadow"
              >
                <div className="text-[#2196F3] mb-4 flex justify-center">
                  {feature.icon}
                </div>
                <h3 className="text-xl mb-2 text-center text-[#0d3b66]">{feature.title}</h3>
                <p className="text-gray-600 text-center text-sm">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>

        {/* System Overview */}
        <div className="bg-white rounded-lg shadow-lg p-8">
          <h2 className="text-3xl text-center mb-6 text-[#0d3b66]">System Overview</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="text-center">
              <div className="text-4xl text-[#2196F3] mb-2">50+</div>
              <p className="text-gray-700">Media Centers Connected</p>
            </div>
            <div className="text-center">
              <div className="text-4xl text-[#2196F3] mb-2">25+</div>
              <p className="text-gray-700">Countries Supported</p>
            </div>
            <div className="text-center">
              <div className="text-4xl text-[#2196F3] mb-2">99.9%</div>
              <p className="text-gray-700">System Uptime</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
