// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "forge-std/Test.sol";
import "../src/UserRegistry.sol";

contract UserRegistryTest is Test {
    UserRegistry public registry;

    address public alice = address(0x1);
    address public bob = address(0x2);

    event UserRegistered(address indexed walletAddress, string username, uint256 timestamp);
    event ProfileUpdated(address indexed walletAddress, string username, string bio);

    function setUp() public {
        registry = new UserRegistry();
    }

    // ============ Registration Tests ============

    function test_RegisterUser_Success() public {
        vm.prank(alice);
        
        vm.expectEmit(true, false, false, true);
        emit UserRegistered(alice, "Alice", block.timestamp);
        
        registry.registerUser("Alice", "Hello, I'm Alice!");

        assertTrue(registry.isRegistered(alice));
        assertEq(registry.totalUsers(), 1);
    }

    function test_RegisterUser_WithEmptyUsernameAndBio() public {
        vm.prank(alice);
        registry.registerUser("", "");

        assertTrue(registry.isRegistered(alice));
        
        UserRegistry.UserProfile memory profile = registry.getUserProfile(alice);
        assertEq(profile.username, "");
        assertEq(profile.bio, "");
    }

    function test_RegisterUser_RevertIfAlreadyRegistered() public {
        vm.startPrank(alice);
        registry.registerUser("Alice", "Bio 1");

        vm.expectRevert(UserRegistry.AlreadyRegistered.selector);
        registry.registerUser("Alice Updated", "Bio 2");
        vm.stopPrank();
    }

    function test_RegisterUser_MultipleUsers() public {
        vm.prank(alice);
        registry.registerUser("Alice", "Alice's bio");

        vm.prank(bob);
        registry.registerUser("Bob", "Bob's bio");

        assertEq(registry.totalUsers(), 2);
        assertTrue(registry.isRegistered(alice));
        assertTrue(registry.isRegistered(bob));
    }

    // ============ Profile Query Tests ============

    function test_GetUserProfile_Success() public {
        vm.prank(alice);
        registry.registerUser("Alice", "My bio");

        UserRegistry.UserProfile memory profile = registry.getUserProfile(alice);
        
        assertEq(profile.walletAddress, alice);
        assertEq(profile.username, "Alice");
        assertEq(profile.bio, "My bio");
        assertEq(profile.registeredAt, block.timestamp);
        assertTrue(profile.isRegistered);
    }

    function test_GetUserProfile_RevertIfNotRegistered() public {
        vm.expectRevert(UserRegistry.NotRegistered.selector);
        registry.getUserProfile(alice);
    }

    function test_GetMyProfile_Success() public {
        vm.startPrank(alice);
        registry.registerUser("Alice", "My bio");

        UserRegistry.UserProfile memory profile = registry.getMyProfile();
        
        assertEq(profile.walletAddress, alice);
        assertEq(profile.username, "Alice");
        vm.stopPrank();
    }

    function test_GetMyProfile_RevertIfNotRegistered() public {
        vm.prank(alice);
        vm.expectRevert(UserRegistry.NotRegistered.selector);
        registry.getMyProfile();
    }

    // ============ IsRegistered Tests ============

    function test_IsRegistered_ReturnsFalseForUnregisteredUser() public {
        assertFalse(registry.isRegistered(alice));
    }

    function test_IsRegistered_ReturnsTrueForRegisteredUser() public {
        vm.prank(alice);
        registry.registerUser("Alice", "Bio");
        
        assertTrue(registry.isRegistered(alice));
    }

    // ============ Profile Update Tests ============

    function test_UpdateProfile_Success() public {
        vm.startPrank(alice);
        registry.registerUser("Alice", "Old bio");

        vm.expectEmit(true, false, false, true);
        emit ProfileUpdated(alice, "Alice Updated", "New bio");
        
        registry.updateProfile("Alice Updated", "New bio");

        UserRegistry.UserProfile memory profile = registry.getMyProfile();
        assertEq(profile.username, "Alice Updated");
        assertEq(profile.bio, "New bio");
        vm.stopPrank();
    }

    function test_UpdateProfile_RevertIfNotRegistered() public {
        vm.prank(alice);
        vm.expectRevert(UserRegistry.NotRegistered.selector);
        registry.updateProfile("Alice", "Bio");
    }

    function test_UpdateProfile_CanSetEmptyValues() public {
        vm.startPrank(alice);
        registry.registerUser("Alice", "Bio");
        registry.updateProfile("", "");

        UserRegistry.UserProfile memory profile = registry.getMyProfile();
        assertEq(profile.username, "");
        assertEq(profile.bio, "");
        vm.stopPrank();
    }

    // ============ Total Users Tests ============

    function test_TotalUsers_StartsAtZero() public {
        assertEq(registry.totalUsers(), 0);
    }

    function test_TotalUsers_IncrementsOnRegistration() public {
        vm.prank(alice);
        registry.registerUser("Alice", "Bio");
        assertEq(registry.totalUsers(), 1);

        vm.prank(bob);
        registry.registerUser("Bob", "Bio");
        assertEq(registry.totalUsers(), 2);
    }

    // ============ Timestamp Tests ============

    function test_RegisteredAt_RecordsBlockTimestamp() public {
        uint256 expectedTimestamp = block.timestamp;
        
        vm.prank(alice);
        registry.registerUser("Alice", "Bio");

        UserRegistry.UserProfile memory profile = registry.getUserProfile(alice);
        assertEq(profile.registeredAt, expectedTimestamp);
    }

    function test_RegisteredAt_DifferentTimestampsForDifferentUsers() public {
        vm.prank(alice);
        registry.registerUser("Alice", "Bio");
        uint256 aliceTimestamp = registry.getUserProfile(alice).registeredAt;

        vm.warp(block.timestamp + 1 days);

        vm.prank(bob);
        registry.registerUser("Bob", "Bio");
        uint256 bobTimestamp = registry.getUserProfile(bob).registeredAt;

        assertTrue(bobTimestamp > aliceTimestamp);
    }

    // ============ Edge Cases ============

    function test_RegisterUser_WithLongStrings() public {
        string memory longUsername = "ThisIsAVeryLongUsernameWithManyCharacters1234567890";
        string memory longBio = "This is a very long bio that contains multiple sentences and a lot of information about the user. It goes on and on and on...";

        vm.prank(alice);
        registry.registerUser(longUsername, longBio);

        UserRegistry.UserProfile memory profile = registry.getUserProfile(alice);
        assertEq(profile.username, longUsername);
        assertEq(profile.bio, longBio);
    }

    function test_RegisterUser_WithSpecialCharacters() public {
        string memory username = "Alice_123!@#";
        string memory bio = "Hello World - Special chars: !@#$%";

        vm.prank(alice);
        registry.registerUser(username, bio);

        UserRegistry.UserProfile memory profile = registry.getUserProfile(alice);
        assertEq(profile.username, username);
        assertEq(profile.bio, bio);
    }
}
