import { Upload, File, X, Check } from 'lucide-react';
import { useState } from 'react';

export default function UploadPage() {
  const [selectedFiles, setSelectedFiles] = useState<Array<{name: string, size: string, status: string}>>([]);
  const [selectedCenter, setSelectedCenter] = useState('');
  const [selectedCollaboration, setSelectedCollaboration] = useState('');

  const mediaCenters = [
    'North America Media Hub',
    'European Broadcasting Center',
    'Asia Pacific Media Network',
    'Middle East Media Station',
    'African Content Hub',
    'South America Broadcasting'
  ];

  const collaborations = [
    'International News Coverage',
    'Documentary Series Production',
    'Music Festival Streaming'
  ];

  const handleFileAdd = () => {
    // Simulating file addition
    const mockFile = {
      name: `media_file_${selectedFiles.length + 1}.mp4`,
      size: `${(Math.random() * 500 + 100).toFixed(1)} MB`,
      status: 'ready'
    };
    setSelectedFiles([...selectedFiles, mockFile]);
  };

  const handleFileRemove = (index: number) => {
    setSelectedFiles(selectedFiles.filter((_, i) => i !== index));
  };

  const handleUpload = () => {
    setSelectedFiles(selectedFiles.map(file => ({...file, status: 'uploaded'})));
  };

  return (
    <div className="min-h-screen bg-[#f5f5f5] py-8">
      <div className="container mx-auto px-6 max-w-4xl">
        <h1 className="text-4xl mb-8 text-[#0d3b66]">Upload Media Files</h1>

        <div className="bg-white rounded-lg shadow-lg p-8 mb-6">
          <h2 className="text-2xl mb-6 text-[#0d3b66]">Upload Configuration</h2>
          
          {/* Destination Selection */}
          <div className="mb-6">
            <label className="block text-gray-700 mb-2">Target Media Center</label>
            <select 
              className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-[#2196F3]"
              value={selectedCenter}
              onChange={(e) => setSelectedCenter(e.target.value)}
            >
              <option value="">Select a media center...</option>
              {mediaCenters.map((center, index) => (
                <option key={index} value={center}>{center}</option>
              ))}
            </select>
          </div>

          <div className="mb-6">
            <label className="block text-gray-700 mb-2">Link to Collaboration (Optional)</label>
            <select 
              className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-[#2196F3]"
              value={selectedCollaboration}
              onChange={(e) => setSelectedCollaboration(e.target.value)}
            >
              <option value="">None - Personal Upload</option>
              {collaborations.map((collab, index) => (
                <option key={index} value={collab}>{collab}</option>
              ))}
            </select>
          </div>

          {/* Upload Area */}
          <div className="border-2 border-dashed border-gray-300 rounded-lg p-12 mb-6 text-center hover:border-[#2196F3] transition-colors cursor-pointer">
            <Upload size={48} className="mx-auto mb-4 text-gray-400" />
            <p className="text-gray-600 mb-2">Drag and drop files here or click to browse</p>
            <p className="text-sm text-gray-400">Supports: MP4, AVI, MOV, MP3, WAV, JPG, PNG (Max 5GB per file)</p>
            <button 
              onClick={handleFileAdd}
              className="mt-4 bg-[#0d3b66] text-white px-6 py-2 rounded hover:bg-[#1a5080] transition-colors"
            >
              Select Files
            </button>
          </div>

          {/* File List */}
          {selectedFiles.length > 0 && (
            <div className="mb-6">
              <h3 className="text-lg mb-3 text-[#0d3b66]">Selected Files ({selectedFiles.length})</h3>
              <div className="space-y-2">
                {selectedFiles.map((file, index) => (
                  <div 
                    key={index}
                    className="flex items-center justify-between bg-gray-50 p-4 rounded-lg"
                  >
                    <div className="flex items-center gap-3">
                      <File size={24} className="text-[#2196F3]" />
                      <div>
                        <p className="text-gray-800">{file.name}</p>
                        <p className="text-sm text-gray-500">{file.size}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      {file.status === 'uploaded' && (
                        <span className="flex items-center gap-1 text-green-600 text-sm">
                          <Check size={16} />
                          Uploaded
                        </span>
                      )}
                      {file.status === 'ready' && (
                        <button
                          onClick={() => handleFileRemove(index)}
                          className="text-red-500 hover:text-red-700 transition-colors"
                        >
                          <X size={20} />
                        </button>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Upload Button */}
          {selectedFiles.length > 0 && selectedFiles.some(f => f.status === 'ready') && (
            <button 
              onClick={handleUpload}
              className="w-full bg-[#2196F3] text-white py-3 rounded-lg hover:bg-[#1976D2] transition-colors text-lg shadow-lg"
              disabled={!selectedCenter}
            >
              {!selectedCenter ? 'Please Select a Media Center' : 'Upload Files'}
            </button>
          )}
        </div>

        {/* Upload Statistics */}
        <div className="bg-white rounded-lg shadow-lg p-6">
          <h2 className="text-2xl mb-4 text-[#0d3b66]">Upload Statistics</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="text-center">
              <p className="text-3xl text-[#2196F3] mb-1">156</p>
              <p className="text-gray-600 text-sm">Files Uploaded Today</p>
            </div>
            <div className="text-center">
              <p className="text-3xl text-green-600 mb-1">3.2 TB</p>
              <p className="text-gray-600 text-sm">Total Data Transferred</p>
            </div>
            <div className="text-center">
              <p className="text-3xl text-purple-600 mb-1">98%</p>
              <p className="text-gray-600 text-sm">Success Rate</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
