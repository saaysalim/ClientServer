import React, { useState, useEffect } from 'react';
import { Video, FileText, Image, Music, Users, Clock, CheckCircle, Plus, X, AlertCircle } from 'lucide-react';
import { Button } from '@/app/components/ui/button';
import { Card } from '@/app/components/ui/card';
import { Alert, AlertDescription } from '@/app/components/ui/alert';
import { blockchainService } from '@/services/blockchain';

export default function CollaborationPage() {
  const [collaborations, setCollaborations] = useState<any[]>([]);
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    deadline: '',
    members: ''
  });
  const [blockchainEnabled, setBlockchainEnabled] = useState(false);

  // Load collaborations on mount
  useEffect(() => {
    loadCollaborations();
    checkBlockchainStatus();
  }, []);

  const checkBlockchainStatus = async () => {
    const result = await blockchainService.initializeBlockchain();
    setBlockchainEnabled(result.success);
  };

  const loadCollaborations = async () => {
    try {
      const response = await fetch('http://localhost:5000/api/collaborations');
      const data = await response.json();
      setCollaborations(data);
    } catch (error) {
      console.error('Failed to load collaborations:', error);
      // Use default collaborations
      setCollaborations([
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
      ]);
    }
  };

  const handleCreateCollaboration = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    
    try {
      if (!formData.title || !formData.description) {
        setMessage('Please fill in all required fields');
        setLoading(false);
        return;
      }

      let collaborationData: any = {
        title: formData.title,
        description: formData.description,
        deadline: formData.deadline || new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),
        members: formData.members ? formData.members.split(',').map(m => m.trim()) : [],
        owner: blockchainEnabled ? blockchainService.getUserAddress() : 'anonymous'
      };

      // Create collaboration with blockchain if enabled
      if (blockchainEnabled && blockchainService.getSignerAddress()) {
        try {
          // Create credential for collaboration
          const credential = await blockchainService.createCredential(collaborationData);
          if (credential.success) {
            collaborationData.blockchainVerified = true;
            collaborationData.blockchainHash = credential.credential.hash;
            setMessage('Collaboration created with blockchain verification!');
          }
        } catch (blockchainError) {
          console.warn('Blockchain verification failed:', blockchainError);
          setMessage('Collaboration created (blockchain verification failed but collaboration is stored)');
        }
      }

      // Send to server
      const response = await fetch('http://localhost:5000/api/collaborations', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(collaborationData)
      });

      if (response.ok) {
        const newCollaboration = await response.json();
        setCollaborations([...collaborations, newCollaboration]);
        
        // Reset form
        setFormData({ title: '', description: '', deadline: '', members: '' });
        setShowCreateForm(false);
        
        if (!message) {
          setMessage('Collaboration created successfully!');
        }
        
        // Clear message after 3 seconds
        setTimeout(() => setMessage(''), 3000);
      } else {
        setMessage('Failed to create collaboration');
      }
    } catch (error) {
      setMessage(`Error: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
    setLoading(false);
  };

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

  const activeCount = collaborations.filter(c => c.status === 'ACTIVE' || c.status === 'active').length;
  const totalFiles = collaborations.reduce((sum, c) => sum + (c.files || 0), 0);
  const completedCount = collaborations.filter(c => c.status === 'COMPLETED' || c.status === 'completed').length;

  return (
    <div className="min-h-screen bg-[#f5f5f5] py-8">
      <div className="container mx-auto px-6">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-4xl text-[#0d3b66]">Active Collaborations</h1>
          <Button
            onClick={() => setShowCreateForm(true)}
            className="bg-[#0d3b66] text-white px-6 py-3"
          >
            <Plus size={20} className="mr-2" />
            Create New Collaboration
          </Button>
        </div>

        {/* Blockchain Status */}
        {blockchainEnabled && (
          <Alert className="mb-6 bg-green-50 border-green-200">
            <AlertDescription className="text-green-800">
              ✅ Blockchain enabled - Collaborations will be verified and recorded on blockchain
            </AlertDescription>
          </Alert>
        )}

        {message && (
          <Alert className="mb-6">
            <AlertDescription>{message}</AlertDescription>
          </Alert>
        )}

        {/* Create Collaboration Form Modal */}
        {showCreateForm && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <Card className="w-full max-w-2xl p-6">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold text-[#0d3b66]">Create New Collaboration</h2>
                <button
                  onClick={() => setShowCreateForm(false)}
                  className="text-gray-500 hover:text-gray-700"
                >
                  <X size={24} />
                </button>
              </div>

              <form onSubmit={handleCreateCollaboration} className="space-y-4">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Collaboration Title *
                  </label>
                  <input
                    type="text"
                    placeholder="e.g., International News Coverage"
                    value={formData.title}
                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#2196F3] outline-none"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Description *
                  </label>
                  <textarea
                    placeholder="Describe the collaboration objectives and scope"
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#2196F3] outline-none"
                    rows={4}
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Deadline (Optional)
                  </label>
                  <input
                    type="datetime-local"
                    value={formData.deadline}
                    onChange={(e) => setFormData({ ...formData, deadline: e.target.value })}
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#2196F3] outline-none"
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Team Members (Comma-separated emails/IDs)
                  </label>
                  <textarea
                    placeholder="e.g., john@example.com, jane@example.com, alex@example.com"
                    value={formData.members}
                    onChange={(e) => setFormData({ ...formData, members: e.target.value })}
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#2196F3] outline-none"
                    rows={3}
                  />
                </div>

                {blockchainEnabled && (
                  <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                    <div className="flex items-start gap-2">
                      <AlertCircle size={20} className="text-blue-600 mt-0.5" />
                      <div className="text-sm text-blue-800">
                        <p className="font-semibold">Blockchain Security Enabled</p>
                        <p className="text-xs mt-1">This collaboration will be recorded on the blockchain with cryptographic verification and immutable audit trails.</p>
                      </div>
                    </div>
                  </div>
                )}

                <div className="flex gap-3 justify-end pt-4">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => setShowCreateForm(false)}
                  >
                    Cancel
                  </Button>
                  <Button
                    type="submit"
                    disabled={loading}
                    className="bg-[#0d3b66] text-white"
                  >
                    {loading ? 'Creating...' : 'Create Collaboration'}
                  </Button>
                </div>
              </form>
            </Card>
          </div>
        )}

        {/* Statistics */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <Card className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-sm mb-1">Active Projects</p>
                <p className="text-3xl text-[#2196F3]">{activeCount}</p>
              </div>
              <div className="bg-blue-100 p-3 rounded-full">
                <Users size={32} className="text-[#2196F3]" />
              </div>
            </div>
          </Card>

          <Card className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-sm mb-1">Total Files</p>
                <p className="text-3xl text-green-600">{totalFiles}</p>
              </div>
              <div className="bg-green-100 p-3 rounded-full">
                <FileText size={32} className="text-green-600" />
              </div>
            </div>
          </Card>

          <Card className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-sm mb-1">Completed</p>
                <p className="text-3xl text-purple-600">{completedCount}</p>
              </div>
              <div className="bg-purple-100 p-3 rounded-full">
                <CheckCircle size={32} className="text-purple-600" />
              </div>
            </div>
          </Card>
        </div>

        {/* Collaboration Cards */}
        <div className="space-y-4">
          {collaborations.length === 0 ? (
            <Card className="p-8 text-center">
              <p className="text-gray-600 text-lg">No collaborations yet. Create one to get started!</p>
            </Card>
          ) : (
            collaborations.map((collab: any) => (
              <Card
                key={collab.id}
                className="p-6 hover:shadow-xl transition-shadow"
              >
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-start gap-4">
                    <div className="mt-1">
                      {getTypeIcon(collab.type || 'default')}
                    </div>
                    <div>
                      <h3 className="text-xl text-[#0d3b66] mb-2 flex items-center gap-2">
                        {collab.title}
                        {collab.blockchainVerified && (
                          <span className="text-xs bg-green-100 text-green-700 px-2 py-1 rounded flex items-center gap-1">
                            <CheckCircle size={14} /> Verified
                          </span>
                        )}
                      </h3>
                      <p className="text-gray-600 text-sm mb-3">{collab.description || 'No description'}</p>
                      {collab.members && collab.members.length > 0 && (
                        <div className="flex flex-wrap gap-2 mb-3">
                          {(Array.isArray(collab.members) ? collab.members : collab.participants || []).slice(0, 3).map((member: any, index: number) => (
                            <span
                              key={index}
                              className="bg-gray-100 text-gray-700 px-3 py-1 rounded-full text-sm"
                            >
                              {typeof member === 'string' ? member : member.memberName || 'Member'}
                            </span>
                          ))}
                          {(Array.isArray(collab.members) ? collab.members : collab.participants || []).length > 3 && (
                            <span className="bg-gray-100 text-gray-700 px-3 py-1 rounded-full text-sm">
                              +{(Array.isArray(collab.members) ? collab.members : collab.participants || []).length - 3} more
                            </span>
                          )}
                        </div>
                      )}
                    </div>
                  </div>

                  <span
                    className={`px-3 py-1 rounded-full text-xs whitespace-nowrap ${
                      (collab.status === 'active' || collab.status === 'ACTIVE')
                        ? 'bg-green-100 text-green-700'
                        : collab.status === 'COMPLETED' || collab.status === 'completed'
                        ? 'bg-blue-100 text-blue-700'
                        : 'bg-gray-100 text-gray-700'
                    }`}
                  >
                    {collab.status}
                  </span>
                </div>

                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-6 text-sm text-gray-600">
                    {collab.files && (
                      <div className="flex items-center gap-2">
                        <FileText size={16} />
                        <span>{collab.files} files</span>
                      </div>
                    )}
                    <div className="flex items-center gap-2">
                      <Clock size={16} />
                      <span>{collab.lastUpdate || 'Just now'}</span>
                    </div>
                  </div>

                  <Button className="bg-[#0d3b66] text-white">
                    View Details
                  </Button>
                </div>
              </Card>
            ))
          )}
        </div>
      </div>
    </div>
  );
}

