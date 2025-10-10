// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

/// @title HealthCheck
/// @notice A simple contract to verify the Foundry development environment is working
/// @dev This is a "Hello World" contract for the Trustless SocialFi project
contract HealthCheck {
  string private constant MESSAGE = 'Trustless SocialFi';

  /// @notice Returns the project name
  /// @return The project name string
  function getMessage() public pure returns (string memory) {
    return MESSAGE;
  }

  /// @notice Checks if the contract is alive
  /// @return true if the contract is functioning
  function isAlive() public pure returns (bool) {
    return true;
  }
}
