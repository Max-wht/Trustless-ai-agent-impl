// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import {Test} from "forge-std/Test.sol";
import {HealthCheck} from "../src/HealthCheck.sol";

contract HealthCheckTest is Test {
  HealthCheck public healthCheck;

  function setUp() public {
    healthCheck = new HealthCheck();
  }

  function testGetMessage() public view {
    string memory message = healthCheck.getMessage();
    assertEq(message, "Trustless SocialFi");
  }

  function testIsAlive() public view {
    bool alive = healthCheck.isAlive();
    assertTrue(alive);
  }
}
