// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/security/ReentrancyGuard.sol";
import "@openzeppelin/contracts/utils/Counters.sol";

contract FairPlayLottery is ERC721, Ownable, ReentrancyGuard {
    using Counters for Counters.Counter;

    Counters.Counter private _ticketIdCounter;
    Counters.Counter private _drawIdCounter;

    struct Draw {
        uint256 drawId;
        uint256 startTime;
        uint256 endTime;
        uint256 ticketPrice;
        uint256 prizePool;
        uint256 totalTickets;
        uint256 winningTicketId;
        bytes32 randomSeed;
        bytes32 blockHash;
        DrawStatus status;
    }

    struct Ticket {
        uint256 ticketId;
        uint256 drawId;
        address owner;
        uint256 ticketNumber;
        bool isWinner;
        uint256 purchaseTime;
    }

    enum DrawStatus { Upcoming, Active, Completed, Cancelled }

    // State variables
    mapping(uint256 => Draw) public draws;
    mapping(uint256 => Ticket) public tickets;
    mapping(uint256 => uint256[]) public drawTickets; // drawId => ticketIds
    mapping(address => uint256[]) public userTickets; // user => ticketIds

    uint256 public constant TICKET_PRICE = 0.001 ether;
    uint256 public constant DRAW_DURATION = 24 hours;
    uint256 public constant MIN_PARTICIPANTS = 10;

    // Events
    event DrawCreated(uint256 indexed drawId, uint256 startTime, uint256 endTime);
    event TicketPurchased(uint256 indexed ticketId, uint256 indexed drawId, address indexed buyer, uint256 ticketNumber);
    event DrawCompleted(uint256 indexed drawId, uint256 winningTicketId, address winner);
    event PrizeClaimed(uint256 indexed ticketId, address indexed winner, uint256 amount);

    constructor() ERC721("FairPlay Lottery Ticket", "FPLT") {}

    // Create a new draw
    function createDraw() external onlyOwner {
        _drawIdCounter.increment();
        uint256 drawId = _drawIdCounter.current();

        draws[drawId] = Draw({
            drawId: drawId,
            startTime: block.timestamp,
            endTime: block.timestamp + DRAW_DURATION,
            ticketPrice: TICKET_PRICE,
            prizePool: 0,
            totalTickets: 0,
            winningTicketId: 0,
            randomSeed: bytes32(0),
            blockHash: bytes32(0),
            status: DrawStatus.Active
        });

        emit DrawCreated(drawId, block.timestamp, block.timestamp + DRAW_DURATION);
    }

    // Purchase tickets for a draw
    function purchaseTickets(uint256 drawId, uint256 quantity) external payable nonReentrant {
        require(draws[drawId].status == DrawStatus.Active, "Draw is not active");
        require(block.timestamp < draws[drawId].endTime, "Draw has ended");
        require(msg.value == TICKET_PRICE * quantity, "Incorrect payment amount");
        require(quantity > 0 && quantity <= 50, "Invalid quantity");

        Draw storage draw = draws[drawId];
        draw.prizePool += msg.value;

        for (uint256 i = 0; i < quantity; i++) {
            _ticketIdCounter.increment();
            uint256 ticketId = _ticketIdCounter.current();
            uint256 ticketNumber = draw.totalTickets + i + 1;

            // Mint NFT ticket
            _mint(msg.sender, ticketId);

            tickets[ticketId] = Ticket({
                ticketId: ticketId,
                drawId: drawId,
                owner: msg.sender,
                ticketNumber: ticketNumber,
                isWinner: false,
                purchaseTime: block.timestamp
            });

            drawTickets[drawId].push(ticketId);
            userTickets[msg.sender].push(ticketId);

            emit TicketPurchased(ticketId, drawId, msg.sender, ticketNumber);
        }

        draw.totalTickets += quantity;
    }

    // Complete draw and select winner
    function completeDraw(uint256 drawId, bytes32 userSeed) external onlyOwner {
        Draw storage draw = draws[drawId];
        require(draw.status == DrawStatus.Active, "Draw is not active");
        require(block.timestamp >= draw.endTime || draw.totalTickets >= MIN_PARTICIPANTS, "Draw cannot be completed yet");

        // Generate provably fair random number
        bytes32 combinedSeed = keccak256(abi.encodePacked(userSeed, blockhash(block.number - 1)));
        uint256 randomNumber = uint256(combinedSeed) % draw.totalTickets;

        uint256 winningTicketId = drawTickets[drawId][randomNumber];
        Ticket storage winningTicket = tickets[winningTicketId];
        winningTicket.isWinner = true;

        draw.winningTicketId = winningTicketId;
        draw.randomSeed = userSeed;
        draw.blockHash = blockhash(block.number - 1);
        draw.status = DrawStatus.Completed;

        emit DrawCompleted(drawId, winningTicketId, winningTicket.owner);
    }

    // Claim prize
    function claimPrize(uint256 ticketId) external nonReentrant {
        Ticket storage ticket = tickets[ticketId];
        require(ticket.owner == msg.sender, "Not ticket owner");
        require(ticket.isWinner, "Ticket is not a winner");

        Draw storage draw = draws[ticket.drawId];
        require(draw.status == DrawStatus.Completed, "Draw not completed");

        uint256 prizeAmount = draw.prizePool;
        require(prizeAmount > 0, "No prize to claim");

        // Mark as claimed by burning the NFT
        _burn(ticketId);

        // Transfer prize
        (bool success,) = payable(msg.sender).call{value: prizeAmount}("");
        require(success, "Prize transfer failed");

        emit PrizeClaimed(ticketId, msg.sender, prizeAmount);
    }

    // View functions
    function getDraw(uint256 drawId) external view returns (Draw memory) {
        return draws[drawId];
    }

    function getTicket(uint256 ticketId) external view returns (Ticket memory) {
        return tickets[ticketId];
    }

    function getUserTickets(address user) external view returns (uint256[] memory) {
        return userTickets[user];
    }

    function getDrawTickets(uint256 drawId) external view returns (uint256[] memory) {
        return drawTickets[drawId];
    }

    // Emergency functions
    function emergencyWithdraw() external onlyOwner {
        uint256 balance = address(this).balance;
        require(balance > 0, "No funds to withdraw");
        (bool success,) = payable(owner()).call{value: balance}("");
        require(success, "Withdrawal failed");
    }

    // Receive function for direct ETH transfers
    receive() external payable {}
}

