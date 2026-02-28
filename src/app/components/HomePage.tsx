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

          {/* Architecture Layers */}
          <h3 className="text-2xl text-center mb-6 text-[#0d3b66]">N-Tier Architecture Layers</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
            {architectureLayers.map((item, index) => (
              <div key={index} className={`${item.color} rounded-lg p-6 border-2 border-gray-300 shadow-md`}>
                <div className={`${item.textColor} font-bold text-lg mb-3`}>
                  {index + 1}. {item.layer}
                </div>
                <ul className="text-sm text-gray-700 space-y-1">
                  {item.components.map((comp, i) => (
                    <li key={i} className="flex items-center">
                      <span className="mr-2">▪</span>
                      {comp}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
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
