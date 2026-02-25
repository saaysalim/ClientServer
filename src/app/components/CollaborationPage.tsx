import { Video, FileText, Image, Music, Users, Clock, CheckCircle } from 'lucide-react';

const collaborations = [
  {
    id: 1,
    title: 'International News Coverage',
    participants: ['New York Hub', 'London Center', 'Tokyo Network'],
    type: 'video',
    status: 'active',
    files: 23,
    lastUpdate: '2 hours ago'
  },
  {
    id: 2,
    title: 'Documentary Series Production',
    participants: ['Dubai Station', 'Cape Town Hub'],
    type: 'video',
    status: 'active',
    files: 45,
    lastUpdate: '1 hour ago'
  },
  {
    id: 3,
    title: 'Global Sports Broadcast',
    participants: ['New York Hub', 'São Paulo', 'London Center', 'Tokyo Network'],
    type: 'video',
    status: 'completed',
    files: 67,
    lastUpdate: '3 days ago'
  },
  {
    id: 4,
    title: 'Music Festival Streaming',
    participants: ['London Center', 'São Paulo'],
    type: 'audio',
    status: 'active',
    files: 34,
    lastUpdate: '30 minutes ago'
  }
];

export default function CollaborationPage() {
  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'video':
        return <Video size={24} className="text-[#2196F3]" />;
      case 'audio':
        return <Music size={24} className="text-[#2196F3]" />;
      case 'image':
        return <Image size={24} className="text-[#2196F3]" />;
      default:
        return <FileText size={24} className="text-[#2196F3]" />;
    }
  };

  return (
    <div className="min-h-screen bg-[#f5f5f5] py-8">
      <div className="container mx-auto px-6">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-4xl text-[#0d3b66]">Active Collaborations</h1>
          <button className="bg-[#0d3b66] text-white px-6 py-3 rounded-lg hover:bg-[#1a5080] transition-colors shadow-lg">
            Create New Collaboration
          </button>
        </div>

        {/* Statistics */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white rounded-lg shadow-lg p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-sm mb-1">Active Projects</p>
                <p className="text-3xl text-[#2196F3]">3</p>
              </div>
              <div className="bg-blue-100 p-3 rounded-full">
                <Users size={32} className="text-[#2196F3]" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-lg p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-sm mb-1">Total Files</p>
                <p className="text-3xl text-green-600">169</p>
              </div>
              <div className="bg-green-100 p-3 rounded-full">
                <FileText size={32} className="text-green-600" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-lg p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-sm mb-1">Completed</p>
                <p className="text-3xl text-purple-600">1</p>
              </div>
              <div className="bg-purple-100 p-3 rounded-full">
                <CheckCircle size={32} className="text-purple-600" />
              </div>
            </div>
          </div>
        </div>

        {/* Collaboration Cards */}
        <div className="space-y-4">
          {collaborations.map((collab) => (
            <div 
              key={collab.id}
              className="bg-white rounded-lg shadow-lg p-6 hover:shadow-xl transition-shadow"
            >
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-start gap-4">
                  <div className="mt-1">
                    {getTypeIcon(collab.type)}
                  </div>
                  <div>
                    <h3 className="text-xl text-[#0d3b66] mb-2">{collab.title}</h3>
                    <div className="flex flex-wrap gap-2 mb-3">
                      {collab.participants.map((participant, index) => (
                        <span 
                          key={index}
                          className="bg-gray-100 text-gray-700 px-3 py-1 rounded-full text-sm"
                        >
                          {participant}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
                
                <span 
                  className={`px-3 py-1 rounded-full text-xs ${
                    collab.status === 'active' 
                      ? 'bg-green-100 text-green-700' 
                      : 'bg-gray-100 text-gray-700'
                  }`}
                >
                  {collab.status}
                </span>
              </div>

              <div className="flex items-center justify-between">
                <div className="flex items-center gap-6 text-sm text-gray-600">
                  <div className="flex items-center gap-2">
                    <FileText size={16} />
                    <span>{collab.files} files</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Clock size={16} />
                    <span>Updated {collab.lastUpdate}</span>
                  </div>
                </div>

                <button className="bg-[#0d3b66] text-white px-6 py-2 rounded hover:bg-[#1a5080] transition-colors">
                  View Details
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
