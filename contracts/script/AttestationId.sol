// SPDX-License-Identifier: MIT
pragma solidity ^0.8.13;

import {AttestId} from "../src/AttestId.sol";   // Import your AttestId contract

import {Script} from "forge-std/Script.sol";

/**
 * @title AttestIdScript
 * @notice Script for deploying AttestId.
 * @dev https://book.getfoundry.sh/reference/forge/forge-script
 *
 * @dev This script is used to deploy AttestId with forge script
 * example start anvil with `anvil` command and then run
 * forge script contracts/script/AttestIdScript.s.sol:Deploy --rpc-url http://localhost:8545 --broadcast -vvv
 * @dev Scripts can be used for any scripting not just deployment
 */
contract AttestIdScript is Script {
    function setUp() public {}

    function run() public {
        // read DEPLOYER_PRIVATE_KEY from environment variables
        uint256 deployerPrivateKey = vm.envUint("fee6372319eeaf7a8f8c7d2670974fb64c7bc0dc6454eeaaec9cdd803e65cfdb");

        // It's unclear from the provided script what arguments need to be passed to the AttestId constructor.
        // You would have to dynamically fetch or define the required arguments for deployment.
        // For the sake of this example, I'm using placeholders.
        address _worldId = /* fetch or define _worldId */;
        string memory _appId = /* fetch or define _appId */;
        string memory _actionId = /* fetch or define _actionId */;

        // start broadcast: any transaction after this point will be submitted to the chain
        vm.startBroadcast(deployerPrivateKey);

        // deploy AttestId
        AttestId attestIdInstance = new AttestId(_worldId, _appId, _actionId);

        // stop broadcasting transactions
        vm.stopBroadcast();
    }
}
