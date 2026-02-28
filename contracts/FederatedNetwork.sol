// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

/**
 * @title FederatedNetwork
 * @dev Smart contract for managing a federated secure network
 * Manages network nodes, consensus, and distributed governance
 */
contract FederatedNetwork {
    
    // Network node structure
    struct NetworkNode {
        address nodeAddress;
        string nodeId;
        string endpoint;
        uint256 reputation;
        uint256 joinedAt;
        bool isActive;
        string region;
    }
    
    // Consensus proposal structure
    struct Proposal {
        uint256 proposalId;
        address proposer;
        string description;
        uint256 createdAt;
        uint256 votesFor;
        uint256 votesAgainst;
        bool executed;
        mapping(address => bool) voters;
    }
    
    // Owner of the contract
    address public owner;
    
    // Network configuration
    uint256 public requiredNodesToConsensus;
    uint256 public proposalDuration = 7 days;
    uint256 public proposalCounter = 0;
    
    // Mappings
    mapping(address => NetworkNode) public networkNodes;
    mapping(uint256 => Proposal) public proposals;
    mapping(string => address) public nodeIdToAddress;
    
    // Arrays to track all nodes
    address[] public activeNodes;
    
    // Events
    event NodeJoined(address indexed nodeAddress, string nodeId, string endpoint);
    event NodeLeft(address indexed nodeAddress, string nodeId);
    event NodeReputationUpdated(address indexed nodeAddress, uint256 newReputation);
    event ProposalCreated(uint256 indexed proposalId, address indexed proposer, string description);
    event ProposalVoted(uint256 indexed proposalId, address indexed voter, bool voteFor);
    event ProposalExecuted(uint256 indexed proposalId);
    event ConsensusReached(uint256 indexed proposalId);
    
    // Modifiers
    modifier onlyOwner() {
        require(msg.sender == owner, "Only owner can call this function");
        _;
    }
    
    modifier onlyNetworkNode() {
        require(networkNodes[msg.sender].isActive, "Only active network nodes can call this");
        _;
    }
    
    constructor(uint256 minNodesToConsensus) {
        owner = msg.sender;
        requiredNodesToConsensus = minNodesToConsensus;
    }
    
    /**
     * @dev Register a new node in the federated network
     */
    function joinNetwork(
        string memory nodeId,
        string memory endpoint,
        string memory region
    ) public {
        require(bytes(nodeId).length > 0, "Node ID cannot be empty");
        require(bytes(endpoint).length > 0, "Endpoint cannot be empty");
        require(nodeIdToAddress[nodeId] == address(0), "Node ID already registered");
        
        NetworkNode storage node = networkNodes[msg.sender];
        node.nodeAddress = msg.sender;
        node.nodeId = nodeId;
        node.endpoint = endpoint;
        node.reputation = 100; // Initial reputation
        node.joinedAt = block.timestamp;
        node.isActive = true;
        node.region = region;
        
        nodeIdToAddress[nodeId] = msg.sender;
        activeNodes.push(msg.sender);
        
        emit NodeJoined(msg.sender, nodeId, endpoint);
    }
    
    /**
     * @dev Remove a node from the network
     */
    function leaveNetwork() public onlyNetworkNode {
        NetworkNode storage node = networkNodes[msg.sender];
        string memory nodeId = node.nodeId;
        
        node.isActive = false;
        nodeIdToAddress[nodeId] = address(0);
        
        // Remove from activeNodes array
        removeFromActiveNodes(msg.sender);
        
        emit NodeLeft(msg.sender, nodeId);
    }
    
    /**
     * @dev Update node reputation based on behavior
     */
    function updateNodeReputation(address nodeAddress, int256 reputationChange) public onlyOwner {
        require(networkNodes[nodeAddress].isActive, "Node is not active");
        
        int256 newReputation = int256(networkNodes[nodeAddress].reputation) + reputationChange;
        
        if (newReputation < 0) {
            networkNodes[nodeAddress].reputation = 0;
        } else {
            networkNodes[nodeAddress].reputation = uint256(newReputation);
        }
        
        // Deactivate node if reputation is too low
        if (networkNodes[nodeAddress].reputation < 10) {
            networkNodes[nodeAddress].isActive = false;
            removeFromActiveNodes(nodeAddress);
        }
        
        emit NodeReputationUpdated(nodeAddress, networkNodes[nodeAddress].reputation);
    }
    
    /**
     * @dev Create a consensus proposal
     */
    function createProposal(string memory description) public onlyNetworkNode returns (uint256) {
        proposalCounter++;
        uint256 proposalId = proposalCounter;
        
        Proposal storage proposal = proposals[proposalId];
        proposal.proposalId = proposalId;
        proposal.proposer = msg.sender;
        proposal.description = description;
        proposal.createdAt = block.timestamp;
        proposal.executed = false;
        
        emit ProposalCreated(proposalId, msg.sender, description);
        
        return proposalId;
    }
    
    /**
     * @dev Vote on a proposal
     */
    function voteOnProposal(uint256 proposalId, bool voteFor) public onlyNetworkNode {
        Proposal storage proposal = proposals[proposalId];
        
        require(!proposal.executed, "Proposal already executed");
        require(block.timestamp <= proposal.createdAt + proposalDuration, "Voting period ended");
        require(!proposal.voters[msg.sender], "Already voted on this proposal");
        
        proposal.voters[msg.sender] = true;
        
        if (voteFor) {
            proposal.votesFor++;
        } else {
            proposal.votesAgainst++;
        }
        
        // Check if consensus reached
        uint256 totalVotes = proposal.votesFor + proposal.votesAgainst;
        if (totalVotes >= requiredNodesToConsensus && proposal.votesFor > proposal.votesAgainst) {
            proposal.executed = true;
            emit ConsensusReached(proposalId);
            emit ProposalExecuted(proposalId);
        }
        
        emit ProposalVoted(proposalId, msg.sender, voteFor);
    }
    
    /**
     * @dev Get active nodes count
     */
    function getActiveNodesCount() public view returns (uint256) {
        return activeNodes.length;
    }
    
    /**
     * @dev Get network node info
     */
    function getNodeInfo(address nodeAddress) public view returns (NetworkNode memory) {
        return networkNodes[nodeAddress];
    }
    
    /**
     * @dev Check if consensus is reached for a proposal
     */
    function isConsensusReached(uint256 proposalId) public view returns (bool) {
        Proposal storage proposal = proposals[proposalId];
        uint256 totalVotes = proposal.votesFor + proposal.votesAgainst;
        return totalVotes >= requiredNodesToConsensus && proposal.votesFor > proposal.votesAgainst;
    }
    
    /**
     * @dev Remove node from active nodes array
     */
    function removeFromActiveNodes(address nodeAddress) internal {
        for (uint256 i = 0; i < activeNodes.length; i++) {
            if (activeNodes[i] == nodeAddress) {
                activeNodes[i] = activeNodes[activeNodes.length - 1];
                activeNodes.pop();
                break;
            }
        }
    }
}
