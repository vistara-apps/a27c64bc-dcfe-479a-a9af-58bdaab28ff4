// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/Counters.sol";

contract FairPlayTicket is ERC721, ERC721URIStorage, Ownable {
    using Counters for Counters.Counter;

    Counters.Counter private _tokenIdCounter;

    struct TicketMetadata {
        uint256 ticketId;
        uint256 drawId;
        uint256 ticketNumber;
        bool isWinner;
        uint256 purchaseTime;
        string drawName;
    }

    mapping(uint256 => TicketMetadata) public ticketMetadata;

    event TicketMinted(uint256 indexed tokenId, address indexed owner, uint256 drawId, uint256 ticketNumber);

    constructor() ERC721("FairPlay Lottery Ticket", "FPLT") {}

    function mintTicket(
        address to,
        uint256 drawId,
        uint256 ticketNumber,
        string memory drawName
    ) external onlyOwner returns (uint256) {
        _tokenIdCounter.increment();
        uint256 tokenId = _tokenIdCounter.current();

        _mint(to, tokenId);

        ticketMetadata[tokenId] = TicketMetadata({
            ticketId: tokenId,
            drawId: drawId,
            ticketNumber: ticketNumber,
            isWinner: false,
            purchaseTime: block.timestamp,
            drawName: drawName
        });

        // Set token URI for metadata
        string memory tokenURI = generateTokenURI(tokenId);
        _setTokenURI(tokenId, tokenURI);

        emit TicketMinted(tokenId, to, drawId, ticketNumber);

        return tokenId;
    }

    function markAsWinner(uint256 tokenId) external onlyOwner {
        require(_exists(tokenId), "Token does not exist");
        ticketMetadata[tokenId].isWinner = true;

        // Update token URI to reflect winner status
        string memory tokenURI = generateTokenURI(tokenId);
        _setTokenURI(tokenId, tokenURI);
    }

    function generateTokenURI(uint256 tokenId) internal view returns (string memory) {
        TicketMetadata memory metadata = ticketMetadata[tokenId];

        // Create JSON metadata
        string memory json = string(abi.encodePacked(
            '{"name": "FairPlay Lottery Ticket #',
            Strings.toString(metadata.ticketNumber),
            '", "description": "A lottery ticket for ',
            metadata.drawName,
            '", "image": "https://fairplay-draws.vercel.app/ticket-image/',
            Strings.toString(tokenId),
            '", "attributes": [',
            '{"trait_type": "Draw ID", "value": "',
            Strings.toString(metadata.drawId),
            '"},',
            '{"trait_type": "Ticket Number", "value": "',
            Strings.toString(metadata.ticketNumber),
            '"},',
            '{"trait_type": "Winner", "value": "',
            metadata.isWinner ? 'true' : 'false',
            '"},',
            '{"trait_type": "Purchase Time", "value": "',
            Strings.toString(metadata.purchaseTime),
            '"}',
            ']}'
        ));

        return string(abi.encodePacked(
            "data:application/json;base64,",
            Base64.encode(bytes(json))
        ));
    }

    // Override functions
    function tokenURI(uint256 tokenId) public view override(ERC721, ERC721URIStorage) returns (string memory) {
        return super.tokenURI(tokenId);
    }

    function supportsInterface(bytes4 interfaceId) public view override(ERC721, ERC721URIStorage) returns (bool) {
        return super.supportsInterface(interfaceId);
    }

    function _burn(uint256 tokenId) internal override(ERC721, ERC721URIStorage) {
        super._burn(tokenId);
    }
}

// Helper library for string conversion
library Strings {
    function toString(uint256 value) internal pure returns (string memory) {
        if (value == 0) {
            return "0";
        }
        uint256 temp = value;
        uint256 digits;
        while (temp != 0) {
            digits++;
            temp /= 10;
        }
        bytes memory buffer = new bytes(digits);
        while (value != 0) {
            digits -= 1;
            buffer[digits] = bytes1(uint8(48 + uint256(value % 10)));
            value /= 10;
        }
        return string(buffer);
    }
}

// Base64 encoding library
library Base64 {
    string internal constant TABLE = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/";

    function encode(bytes memory data) internal pure returns (string memory) {
        if (data.length == 0) return "";

        string memory table = TABLE;
        uint256 encodedLen = 4 * ((data.length + 2) / 3);
        string memory result = new string(encodedLen + 32);

        assembly {
            mstore(result, encodedLen)
            let tablePtr := add(table, 1)
            let dataPtr := data
            let endPtr := add(data, mload(data))
            let resultPtr := add(result, 32)

            for {} lt(dataPtr, endPtr) {}
            {
                dataPtr := add(dataPtr, 3)
                let input := mload(dataPtr)
                mstore(resultPtr, shl(248, mload(add(tablePtr, and(shr(18, input), 0x3F)))))
                resultPtr := add(resultPtr, 1)
                mstore(resultPtr, shl(248, mload(add(tablePtr, and(shr(12, input), 0x3F)))))
                resultPtr := add(resultPtr, 1)
                mstore(resultPtr, shl(248, mload(add(tablePtr, and(shr(6, input), 0x3F)))))
                resultPtr := add(resultPtr, 1)
                mstore(resultPtr, shl(248, mload(add(tablePtr, and(input, 0x3F)))))
                resultPtr := add(resultPtr, 1)
            }

            switch mod(mload(data), 3)
            case 1 {
                mstore(sub(resultPtr, 2), shl(240, 0x3d3d))
            }
            case 2 {
                mstore(sub(resultPtr, 1), shl(248, 0x3d))
            }
        }

        return result;
    }
}

