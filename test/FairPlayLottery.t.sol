// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

import "forge-std/Test.sol";
import "../contracts/FairPlayLottery.sol";

contract FairPlayLotteryTest is Test {
    FairPlayLottery public lottery;
    address public owner;
    address public user1;
    address public user2;

    function setUp() public {
        owner = address(this);
        user1 = makeAddr("user1");
        user2 = makeAddr("user2");

        lottery = new FairPlayLottery();

        // Fund test accounts
        vm.deal(user1, 10 ether);
        vm.deal(user2, 10 ether);
    }

    function testCreateDraw() public {
        lottery.createDraw();

        (
            uint256 drawId,
            uint256 startTime,
            uint256 endTime,
            uint256 ticketPrice,
            uint256 prizePool,
            uint256 totalTickets,
            uint256 winningTicketId,
            bytes32 randomSeed,
            bytes32 blockHash,
            uint8 status
        ) = lottery.getDraw(1);

        assertEq(drawId, 1);
        assertEq(ticketPrice, 0.001 ether);
        assertEq(status, 1); // Active
    }

    function testPurchaseTickets() public {
        lottery.createDraw();

        vm.prank(user1);
        lottery.purchaseTickets{value: 0.002 ether}(1, 2);

        uint256[] memory userTickets = lottery.getUserTickets(user1);
        assertEq(userTickets.length, 2);

        (uint256 totalTickets,,,,,,,) = lottery.getDraw(1);
        assertEq(totalTickets, 2);
    }

    function testCompleteDraw() public {
        lottery.createDraw();

        // Purchase tickets
        vm.prank(user1);
        lottery.purchaseTickets{value: 0.001 ether}(1, 1);

        vm.prank(user2);
        lottery.purchaseTickets{value: 0.001 ether}(1, 1);

        // Fast forward time
        vm.warp(block.timestamp + 24 hours + 1);

        // Complete draw
        bytes32 userSeed = keccak256(abi.encodePacked("test-seed"));
        lottery.completeDraw(1, userSeed);

        (
            uint256 drawId,,,,,
            uint256 winningTicketId,,,,
            uint8 status
        ) = lottery.getDraw(1);

        assertEq(status, 2); // Completed
        assertGt(winningTicketId, 0);
    }

    function testClaimPrize() public {
        lottery.createDraw();

        // Purchase ticket
        vm.prank(user1);
        lottery.purchaseTickets{value: 0.001 ether}(1, 1);

        // Complete draw (user1 wins)
        vm.warp(block.timestamp + 24 hours + 1);
        bytes32 userSeed = keccak256(abi.encodePacked("test-seed"));
        lottery.completeDraw(1, userSeed);

        // Get winning ticket
        (,uint256 winningTicketId,,,,,,,) = lottery.getDraw(1);

        // Claim prize
        vm.prank(user1);
        lottery.claimPrize(winningTicketId);

        // Check balance increased
        assertGt(user1.balance, 9.999 ether); // Should have prize minus gas
    }

    function testFailPurchaseWithoutPayment() public {
        lottery.createDraw();

        vm.prank(user1);
        lottery.purchaseTickets{value: 0}(1, 1);
    }

    function testFailPurchaseAfterDrawEnd() public {
        lottery.createDraw();

        vm.warp(block.timestamp + 24 hours + 1);

        vm.prank(user1);
        lottery.purchaseTickets{value: 0.001 ether}(1, 1);
    }
}

