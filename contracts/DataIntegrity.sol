// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

/**
 * @title DataIntegrity
 * @dev Smart contract for verifying data integrity and maintaining audit trails
 * Ensures immutability and traceability of all data transactions
 */
contract DataIntegrity {
    
    // Data record structure
    struct DataRecord {
        string dataId;
        bytes32 dataHash;
        address creator;
        uint256 timestamp;
        string contentType;
        bool verified;
        string metadata;
    }
    
    // Audit log entry structure
    struct AuditLog {
        string recordId;
        address user;
        string action;
        uint256 timestamp;
        bytes32 previousHash;
        bytes32 newHash;
    }
    
    // Owner of the contract
    address public owner;
    
    // Mappings for data records and audit logs
    mapping(string => DataRecord) public dataRecords;
    mapping(string => AuditLog[]) public auditLogs;
    mapping(bytes32 => bool) public verifiedHashes;
    
    // Arrays to track all data and audit logs
    string[] public allDataIds;
    
    // Events
    event DataRecorded(string indexed dataId, bytes32 dataHash, address indexed creator);
    event DataVerified(string indexed dataId, bytes32 dataHash, address indexed verifier);
    event AuditLogCreated(string indexed recordId, address indexed user, string action);
    event DataModified(string indexed dataId, bytes32 previousHash, bytes32 newHash);
    
    // Modifiers
    modifier onlyOwner() {
        require(msg.sender == owner, "Only owner can call this function");
        _;
    }
    
    constructor() {
        owner = msg.sender;
    }
    
    /**
     * @dev Record data with its hash on the blockchain
     */
    function recordData(
        string memory dataId,
        bytes32 dataHash,
        string memory contentType,
        string memory metadata
    ) public {
        require(bytes(dataId).length > 0, "Data ID cannot be empty");
        require(dataHash != bytes32(0), "Data hash cannot be zero");
        
        DataRecord storage record = dataRecords[dataId];
        
        if (bytes(record.dataId).length == 0) {
            allDataIds.push(dataId);
        }
        
        record.dataId = dataId;
        record.dataHash = dataHash;
        record.creator = msg.sender;
        record.timestamp = block.timestamp;
        record.contentType = contentType;
        record.verified = false;
        record.metadata = metadata;
        
        // Create audit log
        createAuditLog(dataId, msg.sender, "DATA_RECORDED", bytes32(0), dataHash);
        
        emit DataRecorded(dataId, dataHash, msg.sender);
    }
    
    /**
     * @dev Verify data integrity by checking the hash
     */
    function verifyData(string memory dataId, bytes32 expectedHash) public {
        require(bytes(dataRecords[dataId].dataId).length > 0, "Data record not found");
        require(dataRecords[dataId].dataHash == expectedHash, "Data hash mismatch");
        
        dataRecords[dataId].verified = true;
        verifiedHashes[expectedHash] = true;
        
        createAuditLog(dataId, msg.sender, "DATA_VERIFIED", bytes32(0), expectedHash);
        
        emit DataVerified(dataId, expectedHash, msg.sender);
    }
    
    /**
     * @dev Update data and maintain audit trail
     */
    function updateData(
        string memory dataId,
        bytes32 newHash,
        string memory metadata
    ) public {
        require(bytes(dataRecords[dataId].dataId).length > 0, "Data record not found");
        
        bytes32 previousHash = dataRecords[dataId].dataHash;
        
        dataRecords[dataId].dataHash = newHash;
        dataRecords[dataId].timestamp = block.timestamp;
        dataRecords[dataId].verified = false;
        dataRecords[dataId].metadata = metadata;
        
        createAuditLog(dataId, msg.sender, "DATA_UPDATED", previousHash, newHash);
        
        emit DataModified(dataId, previousHash, newHash);
    }
    
    /**
     * @dev Create an audit log entry
     */
    function createAuditLog(
        string memory recordId,
        address user,
        string memory action,
        bytes32 previousHash,
        bytes32 newHash
    ) internal {
        AuditLog memory log = AuditLog({
            recordId: recordId,
            user: user,
            action: action,
            timestamp: block.timestamp,
            previousHash: previousHash,
            newHash: newHash
        });
        
        auditLogs[recordId].push(log);
        emit AuditLogCreated(recordId, user, action);
    }
    
    /**
     * @dev Get data record
     */
    function getDataRecord(string memory dataId) public view returns (DataRecord memory) {
        require(bytes(dataRecords[dataId].dataId).length > 0, "Data record not found");
        return dataRecords[dataId];
    }
    
    /**
     * @dev Get audit log for a record
     */
    function getAuditLog(string memory recordId) public view returns (AuditLog[] memory) {
        return auditLogs[recordId];
    }
    
    /**
     * @dev Get all data records count
     */
    function getDataRecordsCount() public view returns (uint256) {
        return allDataIds.length;
    }
    
    /**
     * @dev Verify if a hash has been verified
     */
    function isHashVerified(bytes32 hash) public view returns (bool) {
        return verifiedHashes[hash];
    }
}
