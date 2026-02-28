# Blockchain Integration Documentation

## Overview

This document describes the blockchain integration in the ClientServer application. The blockchain layer provides security, decentralized trust, and immutable record-keeping through smart contracts and cryptographic verification.

## Architecture

```
┌─────────────────────────────────────────────────────────┐
│               Frontend (React)                           │
│  ┌─────────────────────────────────────────────────┐   │
│  │  BlockchainService (ethers.js)                   │   │
│  │  - Wallet Integration (MetaMask)                 │   │
│  │  - Data Signing & Verification                   │   │
│  │  - Credential Management                         │   │
│  └─────────────────────────────────────────────────┘   │
└─────────────────────────────────────────────────────────┘
                        │
                        │ HTTP/REST API
                        │
┌─────────────────────────────────────────────────────────┐
│               Backend (Node.js/Express)                  │
│  ┌─────────────────────────────────────────────────┐   │
│  │  ServerBlockchainService                         │   │
│  │  - Data Hashing & Integrity Verification         │   │
│  │  - Server-Side Signing                           │   │
│  │  - Blockchain State Management                   │   │
│  └─────────────────────────────────────────────────┘   │
└─────────────────────────────────────────────────────────┘
                        │
                        │ ethers.js
                        │
┌─────────────────────────────────────────────────────────┐
│            Ethereum/Blockchain Network                   │
│  ┌──────────────────────────────────────────────────┐  │
│  │  Smart Contracts:                                 │  │
│  │  • AccessControl - Role-based permissions        │  │
│  │  • DataIntegrity - Immutable audit trails        │  │
│  │  • FederatedNetwork - Node consensus             │  │
│  │  • CourseValidator - Digital credentials         │  │
│  └──────────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────────┘
```

## Smart Contracts

### 1. AccessControl.sol
**Purpose**: Manage role-based access control across the federated network

**Key Features**:
- Role assignment (ADMIN, INSTRUCTOR, STUDENT, NODE)
- User activation/deactivation
- Permission verification

**Functions**:
- `grantRole(address user, bytes32 role)` - Assign role to user
- `revokeRole(address user, bytes32 role)` - Remove role from user
- `hasRole(address user, bytes32 role)` - Check user role
- `deactivateUser(address user)` - Deactivate user account
- `activateUser(address user)` - Activate user account

### 2. DataIntegrity.sol
**Purpose**: Ensure data consistency and maintain immutable audit trails

**Key Features**:
- Record data with cryptographic hashes
- Verify data integrity without modification
- Maintain complete audit logs
- Track all data modifications

**Functions**:
- `recordData(string dataId, bytes32 dataHash, string contentType, string metadata)` - Store data hash
- `verifyData(string dataId, bytes32 expectedHash)` - Verify data hasn't been modified
- `updateData(string dataId, bytes32 newHash, string metadata)` - Update data with audit trail
- `getDataRecord(string dataId)` - Retrieve data record
- `getAuditLog(string recordId)` - Get modification history

### 3. FederatedNetwork.sol
**Purpose**: Enable decentralized network management with consensus

**Key Features**:
- Node registration and reputation system
- Consensus-based decision making
- Distributed governance
- Node health monitoring

**Functions**:
- `joinNetwork(string nodeId, string endpoint, string region)` - Register network node
- `leaveNetwork()` - Unregister from network
- `updateNodeReputation(address nodeAddress, int256 reputationChange)` - Update node score
- `createProposal(string description)` - Propose network changes
- `voteOnProposal(uint256 proposalId, bool voteFor)` - Vote on proposals
- `getActiveNodesCount()` - Get network size

### 4. CourseValidator.sol
**Purpose**: Validate educational credentials and issue certificates

**Key Features**:
- Course validation and registration
- Digital certificate issuance
- Credential verification
- Certificate revocation

**Functions**:
- `validateCourse(string courseId, string courseName, bytes32 contentHash, string credentialURI)` - Register course
- `issueCertificate(string courseId, address student, bytes32 certificateHash)` - Issue certificate
- `revokeCertificate(string courseId, address student)` - Revoke certificate
- `verifyCertificate(bytes32 certificateHash)` - Verify certificate authenticity
- `getCourseCertificate(string courseId)` - Get course details
- `getStudentAchievements(address student)` - Get student credentials

## Frontend Integration

### BlockchainService
Located in `src/services/blockchain.ts`

**Key Methods**:
```typescript
// Initialize blockchain
await blockchainService.initializeBlockchain();

// Sign data
const signature = await blockchainService.signData(data);

// Verify signature
const isValid = blockchainService.verifySignature(data, signature);

// Create credentials
const credential = await blockchainService.createCredential(credentialData);

// Verify credentials
const verified = blockchainService.verifyCredential(credential);

// Generate proof of ownership
const proof = await blockchainService.generateProofOfOwnership();
```

## Backend Integration

### ServerBlockchainService
Located in `server/src/blockchainService.js`

**Key Methods**:
```javascript
// Initialize provider and signer
await blockchainService.initializeProvider(rpcUrl);
blockchainService.initializeSigner(privateKey);

// Record data integrity
const result = await blockchainService.recordDataIntegrity(dataId, dataHash, metadata);

// Create network node
const node = await blockchainService.createNetworkNode(nodeId, endpoint, region);

// Create access control entry
const acl = await blockchainService.createAccessControlEntry(userId, role, permissions);

// Create audit log
const log = await blockchainService.createAuditLog(action, userId, resource, changes);

// Create certificate
const cert = await blockchainService.createCertificate(certificateData);

// Verify certificate
const verified = blockchainService.verifyCertificate(certificate);
```

## API Endpoints

### Blockchain Status
```
GET /api/blockchain/status
```
Returns blockchain initialization status and signer address.

### Record Data
```
POST /api/blockchain/record-data
Body:
{
  "dataId": "string",
  "data": "object",
  "metadata": "object"
}
```
Records data with cryptographic hash on blockchain.

### Verify Data
```
POST /api/blockchain/verify-data
Body:
{
  "data": "object",
  "hash": "string"
}
```
Verifies data hasn't been tampered with.

### Network Node
```
POST /api/blockchain/network/node
Body:
{
  "nodeId": "string",
  "endpoint": "string",
  "region": "string"
}
```
Registers a node in the federated network.

### Access Control List
```
POST /api/blockchain/acl
Body:
{
  "userId": "string",
  "role": "string",
  "permissions": ["string"]
}
```
Creates access control entry.

### Audit Log
```
POST /api/blockchain/audit-log
Body:
{
  "action": "string",
  "userId": "string",
  "resource": "string",
  "changes": "object"
}
```
Records audit log entry.

### Certificate
```
POST /api/blockchain/certificate
Body:
{
  "recipientId": "string",
  "courseId": "string",
  "certificateData": "object"
}
```
Creates digital certificate.

### Verify Certificate
```
POST /api/blockchain/verify-certificate
Body: certificate object
```
Verifies certificate authenticity.

### Balance
```
GET /api/blockchain/balance
```
Returns signer's account balance.

### Block Info
```
GET /api/blockchain/block/:blockNumber
```
Returns information about a specific block.

## Security Features

### 1. Cryptographic Hashing
- All data is hashed using SHA-256
- Hashes are immutable and tamper-evident
- Any modification changes the hash

### 2. Digital Signatures
- Data signed with private key
- Signature proves authenticity
- Only signer can create valid signatures

### 3. Access Control
- Role-based permissions (RBAC)
- User activation/deactivation
- Permission verification on every action

### 4. Audit Trails
- Every action is recorded
- Complete modification history
- Timestamp and actor tracking
- Cannot be deleted or modified

### 5. Certificate Verification
- Digital credentials on blockchain
- Revocation capability
- Verifiable without central authority
- Tamper-proof proof of achievement

### 6. Federated Network Security
- Node reputation system
- Consensus-based decisions
- Distributed governance
- No single point of failure

## Environment Variables

```env
# Blockchain Configuration
BLOCKCHAIN_RPC_URL=http://localhost:8545
BLOCKCHAIN_PRIVATE_KEY=your_private_key_here

# Network Configuration
CLIENT_URL=http://localhost:5173
```

## Setup Instructions

### 1. Install Dependencies
```bash
npm install
cd server && npm install && cd ..
```

### 2. Configure Blockchain
Set environment variables in `.env`:
```bash
BLOCKCHAIN_RPC_URL=http://localhost:8545
BLOCKCHAIN_PRIVATE_KEY=your_private_key
```

### 3. Deploy Smart Contracts
Use tools like Hardhat or Truffle to deploy contracts to your blockchain network.

### 4. Initialize Blockchain on Startup
The blockchain service initializes automatically when the server starts.

## Usage Examples

### Frontend - Sign and Verify Data
```typescript
import { blockchainService } from '@/services/blockchain';

// Initialize blockchain
await blockchainService.initializeBlockchain();

// Create and sign data
const data = { courseId: '123', studentId: 'xyz' };
const credential = await blockchainService.createCredential(data);

// Verify credential
const isValid = blockchainService.verifyCredential(credential);
console.log('Credential valid:', isValid.isValid);
```

### Backend - Record Course Validation
```javascript
import ServerBlockchainService from './blockchainService.js';

const blockchainService = new ServerBlockchainService();
await blockchainService.initializeProvider();
blockchainService.initializeSigner(privateKey);

// Record course validation
const courseData = {
  courseId: 'CS101',
  courseName: 'Introduction to Computer Science',
  instructor: 'Dr. Smith'
};

const result = await blockchainService.recordDataIntegrity(
  'CS101',
  courseData,
  { department: 'Computer Science' }
);

console.log('Course recorded on blockchain:', result.record);
```

### Handle Certificate Verification
```javascript
// Verify student certificate
app.post('/api/verify-credential', async (req, res) => {
  const { certificate } = req.body;
  const result = blockchainService.verifyCertificate(certificate);
  res.json(result);
});
```

## Performance Considerations

1. **Hash Calculation**: SHA-256 hashing is fast even for large data
2. **Signature Operations**: May take a few milliseconds for signing/verification
3. **Network Calls**: Blockchain operations are asynchronous and may have latency
4. **Storage**: Use IPFS for large files, store hash on blockchain

## Future Enhancements

1. **Smart Contract Deployment Helper**
   - Automated contract compilation and deployment
   - Network configuration management

2. **Advanced Consensus**
   - Implement Byzantine Fault Tolerance
   - Multi-signature requirements

3. **Privacy Features**
   - Zero-knowledge proofs
   - Encrypted data storage

4. **Integration with Layer 2**
   - Polygon/Arbitrum for scalability
   - Lower transaction costs

5. **DAO Governance**
   - Decentralized autonomous organization
   - Token-based voting

## References

- [Solidity Documentation](https://docs.soliditylang.org/)
- [Ethers.js Documentation](https://docs.ethers.org/)
- [Ethereum Security Best Practices](https://solidity.readthedocs.io/en/latest/security-considerations.html)
- [Smart Contract Audit Guide](https://www.openzeppelin.com/contracts/)

## Support

For issues or questions about blockchain integration, please refer to the project issues or documentation.
