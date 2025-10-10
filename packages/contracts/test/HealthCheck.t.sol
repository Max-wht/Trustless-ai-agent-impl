// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import {Test} from 'forge-std/Test.sol';
import {HealthCheck} from '../src/HealthCheck.sol';

contract HealthCheckTest is Test {
  HealthCheck public healthCheck;

  function setUp() public {
    healthCheck = new HealthCheck();
  }

  function test_GetMessage() public view {
    string memory message = healthCheck.getMessage();
    assertEq(message, 'Trustless SocialFi');
  }

  function test_IsAlive() public view {
    bool alive = healthCheck.isAlive();
    assertTrue(alive);
  }
}
