// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

/**
 * @title CourseValidator
 * @dev Smart contract for validating and certifying courses and educational content
 * Ensures authenticity and integrity of educational materials on the blockchain
 */
contract CourseValidator {
    
    // Course certification structure
    struct CourseCertificate {
        string courseId;
        string courseName;
        address instructor;
        bytes32 contentHash;
        uint256 issuedAt;
        bool isValid;
        string credentialURI;
    }
    
    // Student achievement structure
    struct StudentAchievement {
        address student;
        string courseId;
        uint256 completedAt;
        bytes32 certificateHash;
        bool verified;
    }
    
    // Owner of the contract
    address public owner;
    
    // Mappings
    mapping(string => CourseCertificate) public coursesCertifications;
    mapping(address => StudentAchievement[]) public studentAchievements;
    mapping(bytes32 => bool) public validCertificates;
    mapping(string => address[]) public courseStudents;
    
    // Counters
    uint256 public totalCoursesValidated = 0;
    uint256 public totalCertificatesIssued = 0;
    
    // Events
    event CourseValidated(string indexed courseId, address indexed instructor, bytes32 contentHash);
    event CertificateIssued(string indexed courseId, address indexed student, bytes32 certificateHash);
    event CertificateRevoked(string indexed courseId, address indexed student);
    event CourseUpdated(string indexed courseId, bytes32 newContentHash);
    event AchievementRecorded(address indexed student, string indexed courseId, uint256 timestamp);
    
    // Modifiers
    modifier onlyOwner() {
        require(msg.sender == owner, "Only owner can call this function");
        _;
    }
    
    constructor() {
        owner = msg.sender;
    }
    
    /**
     * @dev Validate a course and register it on the blockchain
     */
    function validateCourse(
        string memory courseId,
        string memory courseName,
        bytes32 contentHash,
        string memory credentialURI
    ) public {
        require(bytes(courseId).length > 0, "Course ID cannot be empty");
        require(bytes(courseName).length > 0, "Course name cannot be empty");
        require(contentHash != bytes32(0), "Content hash cannot be zero");
        
        CourseCertificate storage cert = coursesCertifications[courseId];
        cert.courseId = courseId;
        cert.courseName = courseName;
        cert.instructor = msg.sender;
        cert.contentHash = contentHash;
        cert.issuedAt = block.timestamp;
        cert.isValid = true;
        cert.credentialURI = credentialURI;
        
        totalCoursesValidated++;
        
        emit CourseValidated(courseId, msg.sender, contentHash);
    }
    
    /**
     * @dev Issue a certificate to a student for completing a course
     */
    function issueCertificate(
        string memory courseId,
        address student,
        bytes32 certificateHash
    ) public {
        require(msg.sender == coursesCertifications[courseId].instructor, "Only course instructor can issue certificates");
        require(coursesCertifications[courseId].isValid, "Course is not valid");
        require(student != address(0), "Invalid student address");
        
        StudentAchievement memory achievement = StudentAchievement({
            student: student,
            courseId: courseId,
            completedAt: block.timestamp,
            certificateHash: certificateHash,
            verified: true
        });
        
        studentAchievements[student].push(achievement);
        courseStudents[courseId].push(student);
        validCertificates[certificateHash] = true;
        totalCertificatesIssued++;
        
        emit CertificateIssued(courseId, student, certificateHash);
        emit AchievementRecorded(student, courseId, block.timestamp);
    }
    
    /**
     * @dev Revoke a certificate
     */
    function revokeCertificate(string memory courseId, address student) public {
        require(msg.sender == coursesCertifications[courseId].instructor, "Only course instructor can revoke certificates");
        
        StudentAchievement[] storage achievements = studentAchievements[student];
        
        for (uint256 i = 0; i < achievements.length; i++) {
            if (keccak256(abi.encodePacked(achievements[i].courseId)) == keccak256(abi.encodePacked(courseId))) {
                validCertificates[achievements[i].certificateHash] = false;
                achievements[i].verified = false;
                break;
            }
        }
        
        emit CertificateRevoked(courseId, student);
    }
    
    /**
     * @dev Update course content hash (only by instructor)
     */
    function updateCourseContent(string memory courseId, bytes32 newContentHash) public {
        require(msg.sender == coursesCertifications[courseId].instructor, "Only course instructor can update content");
        require(coursesCertifications[courseId].isValid, "Course is not valid");
        
        coursesCertifications[courseId].contentHash = newContentHash;
        
        emit CourseUpdated(courseId, newContentHash);
    }
    
    /**
     * @dev Invalidate a course
     */
    function invalidateCourse(string memory courseId) public onlyOwner {
        coursesCertifications[courseId].isValid = false;
    }
    
    /**
     * @dev Get course certification details
     */
    function getCourseCertificate(string memory courseId) public view returns (CourseCertificate memory) {
        return coursesCertifications[courseId];
    }
    
    /**
     * @dev Get student achievements
     */
    function getStudentAchievements(address student) public view returns (StudentAchievement[] memory) {
        return studentAchievements[student];
    }
    
    /**
     * @dev Get count of students in a course
     */
    function getCourseStudentsCount(string memory courseId) public view returns (uint256) {
        return courseStudents[courseId].length;
    }
    
    /**
     * @dev Verify if a certificate is valid
     */
    function verifyCertificate(bytes32 certificateHash) public view returns (bool) {
        return validCertificates[certificateHash];
    }
    
    /**
     * @dev Get student's high achievements count
     */
    function getStudentAchievementsCount(address student) public view returns (uint256) {
        return studentAchievements[student].length;
    }
}
