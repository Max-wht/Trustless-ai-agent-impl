// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import {Script} from "forge-std/Script.sol";
import {HealthCheck} from "../src/HealthCheck.sol";

contract DeployHealthCheck is Script {
  function run() external returns (HealthCheck) {
    vm.startBroadcast();

    HealthCheck healthCheck = new HealthCheck();

    vm.stopBroadcast();

    return healthCheck;
  }
}
