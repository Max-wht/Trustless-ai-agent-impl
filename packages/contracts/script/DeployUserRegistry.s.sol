// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "forge-std/Script.sol";
import "../src/UserRegistry.sol";

contract DeployUserRegistry is Script {
    function run() external returns (UserRegistry) {
        vm.startBroadcast();
        
        UserRegistry registry = new UserRegistry();
        
        console.log("UserRegistry deployed at:", address(registry));
        console.log("Initial total users:", registry.totalUsers());
        
        vm.stopBroadcast();
        
        return registry;
    }
}
