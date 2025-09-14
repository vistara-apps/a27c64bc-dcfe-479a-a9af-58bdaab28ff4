// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

import "forge-std/Script.sol";
import "../contracts/FairPlayLottery.sol";
import "../contracts/FairPlayTicket.sol";

contract Deploy is Script {
    function run() external {
        uint256 deployerPrivateKey = vm.envUint("PRIVATE_KEY");
        vm.startBroadcast(deployerPrivateKey);

        // Deploy NFT contract first
        FairPlayTicket ticketContract = new FairPlayTicket();
        console.log("FairPlayTicket deployed at:", address(ticketContract));

        // Deploy lottery contract
        FairPlayLottery lotteryContract = new FairPlayLottery();
        console.log("FairPlayLottery deployed at:", address(lotteryContract));

        // Create initial draw
        lotteryContract.createDraw();
        console.log("Initial draw created");

        vm.stopBroadcast();
    }
}

