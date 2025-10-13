// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

/**
 * @title UserRegistry
 * @notice Manages user registration on-chain for Trustless SocialFi
 * @dev Stores basic user profiles with username and bio
 */
contract UserRegistry {
    /// @notice User profile structure
    struct UserProfile {
        address walletAddress;
        string username;
        string bio;
        uint256 registeredAt;
        bool isRegistered;
    }

    /// @notice Mapping from wallet address to user profile
    mapping(address => UserProfile) public userProfiles;

    /// @notice Total number of registered users
    uint256 public totalUsers;

    /// @notice Emitted when a new user registers
    event UserRegistered(
        address indexed walletAddress,
        string username,
        uint256 timestamp
    );

    /// @notice Emitted when a user updates their profile
    event ProfileUpdated(
        address indexed walletAddress,
        string username,
        string bio
    );

    /// @notice Error thrown when user is already registered
    error AlreadyRegistered();

    /// @notice Error thrown when user is not registered
    error NotRegistered();

    /// @notice Error thrown when username is empty
    error EmptyUsername();

    /**
     * @notice Register a new user with optional username and bio
     * @param _username Username for the user (optional, can be empty initially)
     * @param _bio Bio for the user (optional)
     */
    function registerUser(string calldata _username, string calldata _bio) external {
        if (userProfiles[msg.sender].isRegistered) {
            revert AlreadyRegistered();
        }

        userProfiles[msg.sender] = UserProfile({
            walletAddress: msg.sender,
            username: _username,
            bio: _bio,
            registeredAt: block.timestamp,
            isRegistered: true
        });

        totalUsers++;

        emit UserRegistered(msg.sender, _username, block.timestamp);
    }

    /**
     * @notice Update user profile (username and/or bio)
     * @param _username New username
     * @param _bio New bio
     */
    function updateProfile(string calldata _username, string calldata _bio) external {
        if (!userProfiles[msg.sender].isRegistered) {
            revert NotRegistered();
        }

        userProfiles[msg.sender].username = _username;
        userProfiles[msg.sender].bio = _bio;

        emit ProfileUpdated(msg.sender, _username, _bio);
    }

    /**
     * @notice Check if an address is registered
     * @param _user Address to check
     * @return bool True if user is registered
     */
    function isRegistered(address _user) external view returns (bool) {
        return userProfiles[_user].isRegistered;
    }

    /**
     * @notice Get user profile by address
     * @param _user Address to query
     * @return UserProfile struct containing user data
     */
    function getUserProfile(address _user) external view returns (UserProfile memory) {
        if (!userProfiles[_user].isRegistered) {
            revert NotRegistered();
        }
        return userProfiles[_user];
    }

    /**
     * @notice Get the caller's own profile
     * @return UserProfile struct containing caller's data
     */
    function getMyProfile() external view returns (UserProfile memory) {
        if (!userProfiles[msg.sender].isRegistered) {
            revert NotRegistered();
        }
        return userProfiles[msg.sender];
    }
}
