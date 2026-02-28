// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

/**
 * @title CollaborationManager
 * @dev Smart contract for managing secure, decentralized collaborations
 * Enables teams to work together with transparent contracts and enforceable agreements
 */
contract CollaborationManager {
    
    // Collaboration status enum
    enum CollaborationStatus { PENDING, ACTIVE, SUSPENDED, COMPLETED, CANCELLED }
    
    // Member role enum
    enum MemberRole { VIEWER, CONTRIBUTOR, MODERATOR, OWNER }
    
    // Collaboration structure
    struct Collaboration {
        string collaborationId;
        string title;
        string description;
        address owner;
        uint256 createdAt;
        uint256 deadline;
        CollaborationStatus status;
        bytes32 agreementHash;
        string metadata;
        uint256 memberCount;
    }
    
    // Member structure
    struct Member {
        address memberAddress;
        string memberId;
        MemberRole role;
        uint256 joinedAt;
        bool isActive;
        uint256 contributionScore;
    }
    
    // Collaboration agreement structure
    struct Agreement {
        string collaborationId;
        bytes32 agreementHash;
        address[] signers;
        mapping(address => bool) hasSigned;
        mapping(address => uint256) signedAt;
        bool isExecuted;
        uint256 createdAt;
    }
    
    // Owner of the contract
    address public owner;
    
    // Mappings
    mapping(string => Collaboration) public collaborations;
    mapping(string => Member[]) public collaborationMembers;
    mapping(string => mapping(address => bool)) public isMember;
    mapping(string => Agreement) public agreements;
    mapping(string => string[]) public collaborationTasks;
    
    // Arrays to track all collaborations
    string[] public allCollaborations;
    mapping(address => string[]) public userCollaborations;
    
    // Events
    event CollaborationCreated(
        string indexed collaborationId,
        address indexed owner,
        string title,
        uint256 deadline
    );
    event MemberAdded(
        string indexed collaborationId,
        address indexed memberAddress,
        MemberRole role
    );
    event MemberRemoved(
        string indexed collaborationId,
        address indexed memberAddress
    );
    event MemberRoleChanged(
        string indexed collaborationId,
        address indexed memberAddress,
        MemberRole newRole
    );
    event CollaborationStatusChanged(
        string indexed collaborationId,
        CollaborationStatus newStatus
    );
    event AgreementCreated(
        string indexed collaborationId,
        bytes32 agreementHash
    );
    event AgreementSigned(
        string indexed collaborationId,
        address indexed signer
    );
    event TaskAdded(
        string indexed collaborationId,
        string taskId
    );
    event ContributionRecorded(
        string indexed collaborationId,
        address indexed contributor,
        uint256 score
    );
    
    // Modifiers
    modifier onlyOwner() {
        require(msg.sender == owner, "Only owner can call this function");
        _;
    }
    
    modifier onlyCollaborationOwner(string memory collaborationId) {
        require(
            msg.sender == collaborations[collaborationId].owner,
            "Only collaboration owner can call this"
        );
        _;
    }
    
    modifier onlyMember(string memory collaborationId) {
        require(
            isMember[collaborationId][msg.sender],
            "Only collaboration members can call this"
        );
        _;
    }
    
    modifier collaborationExists(string memory collaborationId) {
        require(
            bytes(collaborations[collaborationId].collaborationId).length > 0,
            "Collaboration does not exist"
        );
        _;
    }
    
    constructor() {
        owner = msg.sender;
    }
    
    /**
     * @dev Create a new collaboration
     */
    function createCollaboration(
        string memory collaborationId,
        string memory title,
        string memory description,
        uint256 deadline,
        string memory metadata
    ) public {
        require(bytes(collaborationId).length > 0, "Collaboration ID cannot be empty");
        require(bytes(title).length > 0, "Title cannot be empty");
        require(
            bytes(collaborations[collaborationId].collaborationId).length == 0,
            "Collaboration already exists"
        );
        require(deadline > block.timestamp, "Deadline must be in the future");
        
        Collaboration storage collab = collaborations[collaborationId];
        collab.collaborationId = collaborationId;
        collab.title = title;
        collab.description = description;
        collab.owner = msg.sender;
        collab.createdAt = block.timestamp;
        collab.deadline = deadline;
        collab.status = CollaborationStatus.PENDING;
        collab.agreementHash = bytes32(0);
        collab.metadata = metadata;
        collab.memberCount = 1;
        
        // Add owner as member automatically
        addMemberInternal(collaborationId, msg.sender, "owner", MemberRole.OWNER);
        
        allCollaborations.push(collaborationId);
        userCollaborations[msg.sender].push(collaborationId);
        
        emit CollaborationCreated(collaborationId, msg.sender, title, deadline);
    }
    
    /**
     * @dev Invite a member to collaboration
     */
    function inviteMember(
        string memory collaborationId,
        address memberAddress,
        string memory memberId,
        MemberRole role
    ) public onlyCollaborationOwner(collaborationId) collaborationExists(collaborationId) {
        require(memberAddress != address(0), "Invalid member address");
        require(!isMember[collaborationId][memberAddress], "Member already in collaboration");
        
        addMemberInternal(collaborationId, memberAddress, memberId, role);
        collaborations[collaborationId].memberCount++;
        
        emit MemberAdded(collaborationId, memberAddress, role);
    }
    
    /**
     * @dev Internal function to add member
     */
    function addMemberInternal(
        string memory collaborationId,
        address memberAddress,
        string memory memberId,
        MemberRole role
    ) internal {
        Member memory member = Member({
            memberAddress: memberAddress,
            memberId: memberId,
            role: role,
            joinedAt: block.timestamp,
            isActive: true,
            contributionScore: 0
        });
        
        collaborationMembers[collaborationId].push(member);
        isMember[collaborationId][memberAddress] = true;
        
        if (bytes(memberId).length > 0) {
            userCollaborations[memberAddress].push(collaborationId);
        }
    }
    
    /**
     * @dev Remove member from collaboration
     */
    function removeMember(
        string memory collaborationId,
        address memberAddress
    ) public onlyCollaborationOwner(collaborationId) collaborationExists(collaborationId) {
        require(isMember[collaborationId][memberAddress], "Member not in collaboration");
        require(memberAddress != collaborations[collaborationId].owner, "Cannot remove owner");
        
        isMember[collaborationId][memberAddress] = false;
        collaborations[collaborationId].memberCount--;
        
        // Mark member as inactive
        Member[] storage members = collaborationMembers[collaborationId];
        for (uint256 i = 0; i < members.length; i++) {
            if (members[i].memberAddress == memberAddress) {
                members[i].isActive = false;
                break;
            }
        }
        
        emit MemberRemoved(collaborationId, memberAddress);
    }
    
    /**
     * @dev Change member role
     */
    function changeMemberRole(
        string memory collaborationId,
        address memberAddress,
        MemberRole newRole
    ) public onlyCollaborationOwner(collaborationId) collaborationExists(collaborationId) {
        require(isMember[collaborationId][memberAddress], "Member not in collaboration");
        require(memberAddress != collaborations[collaborationId].owner, "Cannot change owner role");
        
        Member[] storage members = collaborationMembers[collaborationId];
        for (uint256 i = 0; i < members.length; i++) {
            if (members[i].memberAddress == memberAddress) {
                members[i].role = newRole;
                break;
            }
        }
        
        emit MemberRoleChanged(collaborationId, memberAddress, newRole);
    }
    
    /**
     * @dev Create collaboration agreement
     */
    function createAgreement(
        string memory collaborationId,
        bytes32 agreementHash
    ) public onlyCollaborationOwner(collaborationId) collaborationExists(collaborationId) {
        require(agreementHash != bytes32(0), "Agreement hash cannot be zero");
        
        Agreement storage agreement = agreements[collaborationId];
        agreement.collaborationId = collaborationId;
        agreement.agreementHash = agreementHash;
        agreement.createdAt = block.timestamp;
        agreement.isExecuted = false;
        
        collaborations[collaborationId].agreementHash = agreementHash;
        
        emit AgreementCreated(collaborationId, agreementHash);
    }
    
    /**
     * @dev Sign collaboration agreement
     */
    function signAgreement(
        string memory collaborationId
    ) public onlyMember(collaborationId) collaborationExists(collaborationId) {
        Agreement storage agreement = agreements[collaborationId];
        require(agreement.agreementHash != bytes32(0), "No agreement exists for this collaboration");
        require(!agreement.hasSigned[msg.sender], "Already signed this agreement");
        
        agreement.hasSigned[msg.sender] = true;
        agreement.signedAt[msg.sender] = block.timestamp;
        agreement.signers.push(msg.sender);
        
        emit AgreementSigned(collaborationId, msg.sender);
    }
    
    /**
     * @dev Add task to collaboration
     */
    function addTask(
        string memory collaborationId,
        string memory taskId
    ) public onlyMember(collaborationId) collaborationExists(collaborationId) {
        require(bytes(taskId).length > 0, "Task ID cannot be empty");
        
        collaborationTasks[collaborationId].push(taskId);
        
        emit TaskAdded(collaborationId, taskId);
    }
    
    /**
     * @dev Record contribution to collaboration
     */
    function recordContribution(
        string memory collaborationId,
        address contributor,
        uint256 score
    ) public onlyCollaborationOwner(collaborationId) collaborationExists(collaborationId) {
        require(isMember[collaborationId][contributor], "Contributor not in collaboration");
        
        Member[] storage members = collaborationMembers[collaborationId];
        for (uint256 i = 0; i < members.length; i++) {
            if (members[i].memberAddress == contributor) {
                members[i].contributionScore += score;
                break;
            }
        }
        
        emit ContributionRecorded(collaborationId, contributor, score);
    }
    
    /**
     * @dev Update collaboration status
     */
    function updateStatus(
        string memory collaborationId,
        CollaborationStatus newStatus
    ) public onlyCollaborationOwner(collaborationId) collaborationExists(collaborationId) {
        require(
            uint256(newStatus) <= uint256(CollaborationStatus.CANCELLED),
            "Invalid status"
        );
        
        collaborations[collaborationId].status = newStatus;
        
        emit CollaborationStatusChanged(collaborationId, newStatus);
    }
    
    /**
     * @dev Get collaboration details
     */
    function getCollaboration(
        string memory collaborationId
    ) public view collaborationExists(collaborationId) returns (Collaboration memory) {
        return collaborations[collaborationId];
    }
    
    /**
     * @dev Get collaboration members
     */
    function getCollaborationMembers(
        string memory collaborationId
    ) public view returns (Member[] memory) {
        return collaborationMembers[collaborationId];
    }
    
    /**
     * @dev Get member role in collaboration
     */
    function getMemberRole(
        string memory collaborationId,
        address memberAddress
    ) public view returns (MemberRole) {
        Member[] memory members = collaborationMembers[collaborationId];
        for (uint256 i = 0; i < members.length; i++) {
            if (members[i].memberAddress == memberAddress && members[i].isActive) {
                return members[i].role;
            }
        }
        revert("Member not found");
    }
    
    /**
     * @dev Get all collaborations for a user
     */
    function getUserCollaborations(
        address userAddress
    ) public view returns (string[] memory) {
        return userCollaborations[userAddress];
    }
    
    /**
     * @dev Get all collaborations count
     */
    function getCollaborationsCount() public view returns (uint256) {
        return allCollaborations.length;
    }
    
    /**
     * @dev Check if agreement is signed by member
     */
    function hasSignedAgreement(
        string memory collaborationId,
        address signer
    ) public view returns (bool) {
        return agreements[collaborationId].hasSigned[signer];
    }
    
    /**
     * @dev Get tasks in collaboration
     */
    function getCollaborationTasks(
        string memory collaborationId
    ) public view returns (string[] memory) {
        return collaborationTasks[collaborationId];
    }
    
    /**
     * @dev Get member contribution score
     */
    function getMemberContributionScore(
        string memory collaborationId,
        address memberAddress
    ) public view returns (uint256) {
        Member[] memory members = collaborationMembers[collaborationId];
        for (uint256 i = 0; i < members.length; i++) {
            if (members[i].memberAddress == memberAddress && members[i].isActive) {
                return members[i].contributionScore;
            }
        }
        return 0;
    }
}
