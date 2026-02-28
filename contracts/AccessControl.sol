// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

/**
 * @title AccessControl
 * @dev Role-based access control smart contract for the federated network
 * Manages user roles and permissions across the distributed system
 */
contract AccessControl {
    
    // Role definitions
    bytes32 public constant ADMIN_ROLE = keccak256("ADMIN_ROLE");
    bytes32 public constant INSTRUCTOR_ROLE = keccak256("INSTRUCTOR_ROLE");
    bytes32 public constant STUDENT_ROLE = keccak256("STUDENT_ROLE");
    bytes32 public constant NODE_ROLE = keccak256("NODE_ROLE");
    
    // Owner of the contract
    address public owner;
    
    // Mapping of user roles
    mapping(address => mapping(bytes32 => bool)) public roles;
    mapping(address => bool) public isActive;
    
    // Events
    event RoleGranted(address indexed user, bytes32 indexed role, address indexed grantor);
    event RoleRevoked(address indexed user, bytes32 indexed role, address indexed revoker);
    event UserActivated(address indexed user);
    event UserDeactivated(address indexed user);
    
    // Modifiers
    modifier onlyOwner() {
        require(msg.sender == owner, "Only owner can call this function");
        _;
    }
    
    modifier onlyAdmin() {
        require(roles[msg.sender][ADMIN_ROLE], "Only admin can call this function");
        _;
    }
    
    modifier onlyActive(address user) {
        require(isActive[user], "User is not active");
        _;
    }
    
    constructor() {
        owner = msg.sender;
        roles[msg.sender][ADMIN_ROLE] = true;
        isActive[msg.sender] = true;
    }
    
    /**
     * @dev Grant a role to a user
     */
    function grantRole(address user, bytes32 role) public onlyAdmin {
        require(user != address(0), "Invalid address");
        roles[user][role] = true;
        isActive[user] = true;
        emit RoleGranted(user, role, msg.sender);
    }
    
    /**
     * @dev Revoke a role from a user
     */
    function revokeRole(address user, bytes32 role) public onlyAdmin {
        require(user != address(0), "Invalid address");
        roles[user][role] = false;
        emit RoleRevoked(user, role, msg.sender);
    }
    
    /**
     * @dev Check if a user has a specific role
     */
    function hasRole(address user, bytes32 role) public view returns (bool) {
        return roles[user][role];
    }
    
    /**
     * @dev Deactivate a user
     */
    function deactivateUser(address user) public onlyAdmin {
        isActive[user] = false;
        emit UserDeactivated(user);
    }
    
    /**
     * @dev Activate a user
     */
    function activateUser(address user) public onlyAdmin {
        isActive[user] = true;
        emit UserActivated(user);
    }
    
    /**
     * @dev Check if user has permission for an action
     */
    function hasPermission(address user, bytes32 role) public view onlyActive(user) returns (bool) {
        return roles[user][role];
    }
}
