import { MapPin, Users, HardDrive, Activity } from 'lucide-react';

const mediaCenters = [
  {
    id: 1,
    name: 'North America Media Hub',
    location: 'New York, USA',
    status: 'online',
    users: 245,
    storage: '15.2 TB',
    region: 'Americas'
  },
  {
    id: 2,
    name: 'European Broadcasting Center',
    location: 'London, UK',
    status: 'online',
    users: 189,
    storage: '12.8 TB',
    region: 'Europe'
  },
  {
    id: 3,
    name: 'Asia Pacific Media Network',
    location: 'Tokyo, Japan',
    status: 'online',
    users: 312,
    storage: '18.5 TB',
    region: 'Asia Pacific'
  },
  {
    id: 4,
    name: 'Middle East Media Station',
    location: 'Dubai, UAE',
    status: 'online',
    users: 156,
    storage: '9.3 TB',
    region: 'Middle East'
  },
  {
    id: 5,
    name: 'African Content Hub',
    location: 'Cape Town, South Africa',
    status: 'maintenance',
    users: 98,
    storage: '6.7 TB',
    region: 'Africa'
  },
  {
    id: 6,
    name: 'South America Broadcasting',
    location: 'São Paulo, Brazil',
    status: 'online',
    users: 134,
    storage: '10.1 TB',
    region: 'Americas'
  }
];

export default function MediaCentersPage() {
  return (
    <div className="min-h-screen bg-[#f5f5f5] py-8">
      <div className="container mx-auto px-6">
        <h1 className="text-4xl mb-8 text-[#0d3b66]">Global Media Centers</h1>
        
        <div className="bg-white rounded-lg shadow-lg p-6 mb-8">
          <h2 className="text-2xl mb-4 text-[#0d3b66]">Network Status</h2>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="bg-green-50 p-4 rounded-lg border-l-4 border-green-500">
              <p className="text-sm text-gray-600">Active Centers</p>
              <p className="text-3xl text-green-600">5</p>
            </div>
            <div className="bg-yellow-50 p-4 rounded-lg border-l-4 border-yellow-500">
              <p className="text-sm text-gray-600">Maintenance</p>
              <p className="text-3xl text-yellow-600">1</p>
            </div>
            <div className="bg-blue-50 p-4 rounded-lg border-l-4 border-blue-500">
              <p className="text-sm text-gray-600">Total Users</p>
              <p className="text-3xl text-blue-600">1,134</p>
            </div>
            <div className="bg-purple-50 p-4 rounded-lg border-l-4 border-purple-500">
              <p className="text-sm text-gray-600">Total Storage</p>
              <p className="text-3xl text-purple-600">72.6 TB</p>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {mediaCenters.map((center) => (
            <div 
              key={center.id}
              className="bg-white rounded-lg shadow-lg p-6 hover:shadow-xl transition-shadow"
            >
              <div className="flex items-start justify-between mb-4">
                <div>
                  <h3 className="text-xl text-[#0d3b66] mb-2">{center.name}</h3>
                  <div className="flex items-center text-gray-600 text-sm">
                    <MapPin size={16} className="mr-1" />
                    {center.location}
                  </div>
                </div>
                <span 
                  className={`px-3 py-1 rounded-full text-xs ${
                    center.status === 'online' 
                      ? 'bg-green-100 text-green-700' 
                      : 'bg-yellow-100 text-yellow-700'
                  }`}
                >
                  {center.status}
                </span>
              </div>

              <div className="space-y-3 mb-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center text-gray-600">
                    <Users size={18} className="mr-2" />
                    <span className="text-sm">Active Users</span>
                  </div>
                  <span className="text-[#2196F3]">{center.users}</span>
                </div>

                <div className="flex items-center justify-between">
                  <div className="flex items-center text-gray-600">
                    <HardDrive size={18} className="mr-2" />
                    <span className="text-sm">Storage Used</span>
                  </div>
                  <span className="text-[#2196F3]">{center.storage}</span>
                </div>

                <div className="flex items-center justify-between">
                  <div className="flex items-center text-gray-600">
                    <Activity size={18} className="mr-2" />
                    <span className="text-sm">Region</span>
                  </div>
                  <span className="text-[#2196F3]">{center.region}</span>
                </div>
              </div>

              <button className="w-full bg-[#0d3b66] text-white py-2 rounded hover:bg-[#1a5080] transition-colors">
                Connect to Center
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
