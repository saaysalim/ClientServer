import { BarChart, Bar, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';

const dataUsage = [
  { name: 'Jan', uploads: 45, downloads: 78 },
  { name: 'Feb', uploads: 52, downloads: 85 },
  { name: 'Mar', uploads: 61, downloads: 92 },
  { name: 'Apr', uploads: 58, downloads: 88 },
  { name: 'May', uploads: 73, downloads: 105 },
  { name: 'Jun', uploads: 68, downloads: 98 }
];

const regionalData = [
  { name: 'Americas', value: 35 },
  { name: 'Europe', value: 28 },
  { name: 'Asia Pacific', value: 22 },
  { name: 'Middle East', value: 10 },
  { name: 'Africa', value: 5 }
];

const collaborationTrends = [
  { month: 'Jan', projects: 12 },
  { month: 'Feb', projects: 15 },
  { month: 'Mar', projects: 18 },
  { month: 'Apr', projects: 16 },
  { month: 'May', projects: 22 },
  { month: 'Jun', projects: 25 }
];

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884D8'];

export default function AnalyticsPage() {
  return (
    <div className="min-h-screen bg-[#f5f5f5] py-8">
      <div className="container mx-auto px-6">
        <h1 className="text-4xl mb-8 text-[#0d3b66]">Analytics Dashboard</h1>

        {/* Key Metrics */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-gradient-to-br from-blue-500 to-blue-600 text-white rounded-lg shadow-lg p-6">
            <p className="text-sm mb-2 opacity-90">Total Uploads</p>
            <p className="text-4xl mb-1">2,847</p>
            <p className="text-sm opacity-75">+12% from last month</p>
          </div>
          
          <div className="bg-gradient-to-br from-green-500 to-green-600 text-white rounded-lg shadow-lg p-6">
            <p className="text-sm mb-2 opacity-90">Active Users</p>
            <p className="text-4xl mb-1">1,134</p>
            <p className="text-sm opacity-75">+8% from last month</p>
          </div>
          
          <div className="bg-gradient-to-br from-purple-500 to-purple-600 text-white rounded-lg shadow-lg p-6">
            <p className="text-sm mb-2 opacity-90">Storage Used</p>
            <p className="text-4xl mb-1">72.6 TB</p>
            <p className="text-sm opacity-75">68% of capacity</p>
          </div>
          
          <div className="bg-gradient-to-br from-orange-500 to-orange-600 text-white rounded-lg shadow-lg p-6">
            <p className="text-sm mb-2 opacity-90">Collaborations</p>
            <p className="text-4xl mb-1">25</p>
            <p className="text-sm opacity-75">+15% from last month</p>
          </div>
        </div>

        {/* Charts Row 1 */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
          {/* Upload/Download Trends */}
          <div className="bg-white rounded-lg shadow-lg p-6">
            <h2 className="text-2xl mb-4 text-[#0d3b66]">Upload & Download Trends</h2>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={dataUsage}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Bar dataKey="uploads" fill="#0d3b66" name="Uploads (TB)" />
                <Bar dataKey="downloads" fill="#2196F3" name="Downloads (TB)" />
              </BarChart>
            </ResponsiveContainer>
          </div>

          {/* Regional Distribution */}
          <div className="bg-white rounded-lg shadow-lg p-6">
            <h2 className="text-2xl mb-4 text-[#0d3b66]">Regional Distribution</h2>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={regionalData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                  outerRadius={100}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {regionalData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Charts Row 2 */}
        <div className="bg-white rounded-lg shadow-lg p-6 mb-6">
          <h2 className="text-2xl mb-4 text-[#0d3b66]">Collaboration Growth</h2>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={collaborationTrends}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="month" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Line 
                type="monotone" 
                dataKey="projects" 
                stroke="#2196F3" 
                strokeWidth={3}
                name="Active Projects"
              />
            </LineChart>
          </ResponsiveContainer>
        </div>

        {/* Performance Metrics */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white rounded-lg shadow-lg p-6">
            <h3 className="text-lg mb-4 text-[#0d3b66]">System Performance</h3>
            <div className="space-y-4">
              <div>
                <div className="flex justify-between mb-1">
                  <span className="text-sm text-gray-600">CPU Usage</span>
                  <span className="text-sm text-[#2196F3]">45%</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div className="bg-[#2196F3] h-2 rounded-full" style={{width: '45%'}}></div>
                </div>
              </div>
              <div>
                <div className="flex justify-between mb-1">
                  <span className="text-sm text-gray-600">Memory</span>
                  <span className="text-sm text-green-600">62%</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div className="bg-green-500 h-2 rounded-full" style={{width: '62%'}}></div>
                </div>
              </div>
              <div>
                <div className="flex justify-between mb-1">
                  <span className="text-sm text-gray-600">Network</span>
                  <span className="text-sm text-purple-600">38%</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div className="bg-purple-500 h-2 rounded-full" style={{width: '38%'}}></div>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-lg p-6">
            <h3 className="text-lg mb-4 text-[#0d3b66]">Top Media Centers</h3>
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-sm">Tokyo Network</span>
                <span className="bg-blue-100 text-blue-700 px-2 py-1 rounded text-xs">312 users</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm">New York Hub</span>
                <span className="bg-blue-100 text-blue-700 px-2 py-1 rounded text-xs">245 users</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm">London Center</span>
                <span className="bg-blue-100 text-blue-700 px-2 py-1 rounded text-xs">189 users</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm">Dubai Station</span>
                <span className="bg-blue-100 text-blue-700 px-2 py-1 rounded text-xs">156 users</span>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-lg p-6">
            <h3 className="text-lg mb-4 text-[#0d3b66]">Recent Activity</h3>
            <div className="space-y-3 text-sm">
              <div className="border-l-4 border-green-500 pl-3 py-1">
                <p className="text-gray-800">New collaboration started</p>
                <p className="text-gray-500 text-xs">5 minutes ago</p>
              </div>
              <div className="border-l-4 border-blue-500 pl-3 py-1">
                <p className="text-gray-800">156 files uploaded</p>
                <p className="text-gray-500 text-xs">1 hour ago</p>
              </div>
              <div className="border-l-4 border-purple-500 pl-3 py-1">
                <p className="text-gray-800">System maintenance completed</p>
                <p className="text-gray-500 text-xs">3 hours ago</p>
              </div>
              <div className="border-l-4 border-orange-500 pl-3 py-1">
                <p className="text-gray-800">New user registrations: 23</p>
                <p className="text-gray-500 text-xs">6 hours ago</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
