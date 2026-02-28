import React, { useState, useEffect } from 'react';
import { blockchainService } from '@/services/blockchain';
import { Button } from '@/app/components/ui/button';
import { Card } from '@/app/components/ui/card';
import { Alert, AlertDescription } from '@/app/components/ui/alert';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/app/components/ui/tabs';

const BlockchainPage = () => {
  const [blockchainStatus, setBlockchainStatus] = useState('disconnected');
  const [userAddress, setUserAddress] = useState(null);
  const [balance, setBalance] = useState(null);
  const [signature, setSignature] = useState(null);
  const [dataToSign, setDataToSign] = useState(JSON.stringify({ message: 'Test data' }));
  const [verificationResult, setVerificationResult] = useState(null);
  const [credential, setCredential] = useState(null);
  const [networkInfo, setNetworkInfo] = useState(null);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');

  // Initialize blockchain on component mount
  useEffect(() => {
    initBlockchain();
  }, []);

  const initBlockchain = async () => {
    setLoading(true);
    try {
      const result = await blockchainService.initializeBlockchain();
      if (result.success) {
        setBlockchainStatus('connected');
        setUserAddress(result.address);
        setMessage('Blockchain connected successfully!');
        
        // Get initial balance and network info
        const balanceResult = await blockchainService.getBalance();
        if (balanceResult.success) {
          setBalance(balanceResult.balance);
        }
        
        const netInfo = await blockchainService.getNetworkInfo();
        if (netInfo.success) {
          setNetworkInfo(netInfo.network);
        }
      } else {
        setBlockchainStatus('error');
        setMessage(result.message || 'Failed to connect blockchain');
      }
    } catch (error) {
      setBlockchainStatus('error');
      setMessage(error.message);
    }
    setLoading(false);
  };

  const handleSignData = async () => {
    setLoading(true);
    try {
      const data = JSON.parse(dataToSign);
      const result = await blockchainService.signData(data);
      
      if (result.success) {
        setSignature(result);
        setMessage('Data signed successfully!');
      } else {
        setMessage(result.error);
      }
    } catch (error) {
      setMessage(error.message);
    }
    setLoading(false);
  };

  const handleVerifySignature = () => {
    if (!signature) {
      setMessage('No signature to verify');
      return;
    }
    
    try {
      const data = JSON.parse(dataToSign);
      const result = blockchainService.verifySignature(data, signature.signature);
      
      setVerificationResult(result);
      if (result.isValid) {
        setMessage('Signature verified successfully!');
      } else {
        setMessage('Signature verification failed!');
      }
    } catch (error) {
      setMessage(error.message);
    }
  };

  const handleCreateCredential = async () => {
    setLoading(true);
    try {
      const credentialData = {
        studentId: 'student-123',
        courseId: 'CS101',
        courseName: 'Introduction to Computer Science',
        grade: 'A',
        issuedAt: new Date().toISOString()
      };
      
      const result = await blockchainService.createCredential(credentialData);
      
      if (result.success) {
        setCredential(result.credential);
        setMessage('Credential created successfully!');
      } else {
        setMessage(result.error);
      }
    } catch (error) {
      setMessage(error.message);
    }
    setLoading(false);
  };

  const handleVerifyCredential = () => {
    if (!credential) {
      setMessage('No credential to verify');
      return;
    }
    
    const result = blockchainService.verifyCredential(credential);
    
    if (result.isValid) {
      setMessage('Credential verified and authentic!');
    } else {
      setMessage('Credential verification failed!');
    }
  };

  const handleProofOfOwnership = async () => {
    setLoading(true);
    try {
      const proof = await blockchainService.generateProofOfOwnership();
      
      if (proof.success) {
        setMessage(`Proof of ownership generated for ${proof.address}`);
        console.log('Proof:', proof);
      } else {
        setMessage(proof.error);
      }
    } catch (error) {
      setMessage(error.message);
    }
    setLoading(false);
  };

  return (
    <div className="container mx-auto py-8 px-4">
      <div className="space-y-6">
        {/* Header */}
        <div>
          <h1 className="text-4xl font-bold mb-2">Blockchain Integration</h1>
          <p className="text-gray-600">
            Secure data verification, digital credentials, and federated network management
          </p>
        </div>

        {/* Status Card */}
        <Card className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <h3 className="font-semibold text-sm text-gray-600 mb-2">Status</h3>
              <div className={`text-lg font-bold ${blockchainStatus === 'connected' ? 'text-green-600' : 'text-red-600'}`}>
                {blockchainStatus === 'connected' ? '🟢 Connected' : '🔴 Disconnected'}
              </div>
            </div>
            <div>
              <h3 className="font-semibold text-sm text-gray-600 mb-2">Wallet Address</h3>
              <p className="text-sm font-mono break-all">
                {userAddress ? `${userAddress.substring(0, 6)}...${userAddress.substring(-4)}` : 'Not connected'}
              </p>
            </div>
            <div>
              <h3 className="font-semibold text-sm text-gray-600 mb-2">Balance</h3>
              <p className="text-lg font-bold">
                {balance ? `${parseFloat(balance).toFixed(4)} ETH` : '-'}
              </p>
            </div>
          </div>
        </Card>

        {/* Network Info */}
        {networkInfo && (
          <Card className="p-6">
            <h3 className="text-lg font-bold mb-4">Network Information</h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div>
                <p className="text-sm text-gray-600">Network Name</p>
                <p className="font-semibold">{networkInfo.name}</p>
              </div>
              <div>
                <p className="text-sm text-gray-600">Chain ID</p>
                <p className="font-semibold">{networkInfo.chainId}</p>
              </div>
              <div>
                <p className="text-sm text-gray-600">Block Number</p>
                <p className="font-semibold">{networkInfo.blockNumber}</p>
              </div>
              <div>
                <p className="text-sm text-gray-600">Gas Price</p>
                <p className="font-semibold">{networkInfo.gasPrice} Gwei</p>
              </div>
            </div>
          </Card>
        )}

        {/* Message/Alert */}
        {message && (
          <Alert>
            <AlertDescription>{message}</AlertDescription>
          </Alert>
        )}

        {/* Features */}
        <Tabs defaultValue="signing" className="w-full">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="signing">Data Signing</TabsTrigger>
            <TabsTrigger value="credentials">Credentials</TabsTrigger>
            <TabsTrigger value="proof">Proof</TabsTrigger>
            <TabsTrigger value="info">Info</TabsTrigger>
          </TabsList>

          {/* Data Signing Tab */}
          <TabsContent value="signing" className="space-y-4">
            <Card className="p-6">
              <h3 className="text-lg font-bold mb-4">Sign & Verify Data</h3>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium mb-2">Data to Sign (JSON)</label>
                  <textarea
                    className="w-full p-3 border rounded-lg font-mono text-sm"
                    rows={4}
                    value={dataToSign}
                    onChange={(e) => setDataToSign(e.target.value)}
                  />
                </div>
                <div className="flex gap-2">
                  <Button 
                    onClick={handleSignData} 
                    disabled={loading}
                    className="flex-1"
                  >
                    {loading ? 'Signing...' : 'Sign Data'}
                  </Button>
                  <Button 
                    onClick={handleVerifySignature}
                    disabled={!signature || loading}
                    variant="outline"
                    className="flex-1"
                  >
                    Verify Signature
                  </Button>
                </div>

                {signature && (
                  <div className="mt-4 p-4 bg-gray-50 rounded-lg">
                    <p className="text-sm font-semibold mb-2">Signature Details</p>
                    <div className="space-y-2 font-mono text-xs">
                      <div>
                        <p className="text-gray-600">Message Hash:</p>
                        <p className="break-all">{signature.messageHash}</p>
                      </div>
                      <div>
                        <p className="text-gray-600">Signature:</p>
                        <p className="break-all">{signature.signature}</p>
                      </div>
                    </div>
                  </div>
                )}

                {verificationResult && (
                  <div className={`mt-4 p-4 rounded-lg ${verificationResult.isValid ? 'bg-green-50' : 'bg-red-50'}`}>
                    <p className="font-semibold">
                      {verificationResult.isValid ? '✅ Signature Valid' : '❌ Signature Invalid'}
                    </p>
                    <p className="text-sm mt-2">Signer: {verificationResult.recoveredAddress}</p>
                  </div>
                )}
              </div>
            </Card>
          </TabsContent>

          {/* Credentials Tab */}
          <TabsContent value="credentials" className="space-y-4">
            <Card className="p-6">
              <h3 className="text-lg font-bold mb-4">Digital Credentials</h3>
              <div className="space-y-4">
                <p className="text-sm text-gray-600">
                  Create and manage blockchain-verified educational credentials
                </p>
                <Button 
                  onClick={handleCreateCredential}
                  disabled={loading}
                  className="w-full"
                >
                  {loading ? 'Creating...' : 'Create Sample Credential'}
                </Button>

                {credential && (
                  <div className="space-y-4">
                    <div className="p-4 bg-blue-50 rounded-lg">
                      <p className="text-sm font-semibold mb-2">Credential Created ✓</p>
                      <div className="space-y-2 text-sm">
                        <p><strong>Credential Hash:</strong> <code className="break-all">{credential.hash}</code></p>
                        <p><strong>Issued At:</strong> {credential.issuedAt}</p>
                        <p><strong>Verified:</strong> {credential.verified ? '✅ Yes' : '❌ No'}</p>
                      </div>
                    </div>
                    <Button 
                      onClick={handleVerifyCredential}
                      variant="outline"
                      className="w-full"
                    >
                      Verify Credential
                    </Button>
                  </div>
                )}
              </div>
            </Card>
          </TabsContent>

          {/* Proof Tab */}
          <TabsContent value="proof" className="space-y-4">
            <Card className="p-6">
              <h3 className="text-lg font-bold mb-4">Proof of Ownership</h3>
              <p className="text-sm text-gray-600 mb-4">
                Generate cryptographic proof of wallet ownership
              </p>
              <Button 
                onClick={handleProofOfOwnership}
                disabled={loading || blockchainStatus !== 'connected'}
                className="w-full"
              >
                {loading ? 'Generating...' : 'Generate Proof'}
              </Button>
            </Card>
          </TabsContent>

          {/* Info Tab */}
          <TabsContent value="info" className="space-y-4">
            <Card className="p-6">
              <h3 className="text-lg font-bold mb-4">Blockchain Features</h3>
              <div className="space-y-4">
                <div>
                  <h4 className="font-semibold mb-2">🔐 Security Features</h4>
                  <ul className="text-sm space-y-1 list-disc list-inside">
                    <li>Cryptographic data hashing (SHA-256)</li>
                    <li>Digital signatures for authentication</li>
                    <li>Immutable audit trails</li>
                    <li>Role-based access control</li>
                  </ul>
                </div>
                <div>
                  <h4 className="font-semibold mb-2">📜 Smart Contracts</h4>
                  <ul className="text-sm space-y-1 list-disc list-inside">
                    <li>AccessControl - Permission management</li>
                    <li>DataIntegrity - Audit logging</li>
                    <li>FederatedNetwork - Node consensus</li>
                    <li>CourseValidator - Credential issuance</li>
                  </ul>
                </div>
                <div>
                  <h4 className="font-semibold mb-2">🌐 Network Benefits</h4>
                  <ul className="text-sm space-y-1 list-disc list-inside">
                    <li>Decentralized trust</li>
                    <li>No single point of failure</li>
                    <li>Transparent governance</li>
                    <li>Tamper-proof records</li>
                  </ul>
                </div>
              </div>
            </Card>
          </TabsContent>
        </Tabs>

        {/* Reconnect Button */}
        {blockchainStatus !== 'connected' && (
          <Button 
            onClick={initBlockchain}
            disabled={loading}
            size="lg"
            className="w-full"
          >
            {loading ? 'Connecting...' : 'Connect Blockchain Wallet'}
          </Button>
        )}
      </div>
    </div>
  );
};

export default BlockchainPage;
