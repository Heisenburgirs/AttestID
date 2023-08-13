// SPDX-License-Identifier: MIT
pragma solidity ^0.8.13;

import { ByteHasher } from './helpers/ByteHasher.sol';
import { IWorldID } from './interfaces/IWorldID.sol';
import { IEAS, AttestationRequest, AttestationRequestData } from "@ethereum-attestation-service/eas-contracts/contracts/IEAS.sol";
import { NO_EXPIRATION_TIME, EMPTY_UID } from "@ethereum-attestation-service/eas-contracts/contracts/Common.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721Enumerable.sol";
import "@openzeppelin/contracts/token/ERC721/IERC721.sol";
import "@openzeppelin/contracts/utils/Counters.sol";
import "https://github.com/LayerZero-Labs/solidity-examples/blob/main/contracts/lzApp/NonblockingLzApp.sol";

contract AttestId is ERC721Enumerable, NonblockingLzApp {
    using ByteHasher for bytes;
    using Counters for Counters.Counter;
    Counters.Counter private _tokenIdCounter;

    uint16 destChainId;

    // Mock function constant
    uint256 public number = 0;

    /// Errors
    error InvalidEAS();
    error InvalidNullifier();

    IWorldID internal immutable worldId;
    string internal _appId;
    uint256 internal immutable groupId = 1;
    mapping(uint256 => bool) internal nullifierHashes;

    // EAS related state variable
    IEAS private immutable _eas;
    error TransfersNotAllowed();
    mapping(uint256 => string) private _tokenURIs;

    constructor(IWorldID _worldId, string memory appId, IEAS eas, address _lzEndpoint)
        ERC721("AttestID", "AID")
        NonblockingLzApp(_lzEndpoint)
    {
        worldId = _worldId;
        _appId = appId;
        if (address(eas) == address(0)) {
            revert InvalidEAS();
        }
        _eas = eas;

        if (_lzEndpoint == 0xae92d5aD7583AD66E49A0c67BAd18F6ba52dDDc1) destChainId = 10160;
        if (_lzEndpoint == 0x6aB5Ae6822647046626e83ee6dB8187151E1d5ab) destChainId = 10132;
    }

	// Verify WorldID proof
    function verifyAndExecute(address signal, uint256 root, uint256 nullifierHash, uint256[8] calldata proof, string memory _actionId) public {
        uint256 externalNullifier = abi.encodePacked(abi.encodePacked(_appId).hashToField(), _actionId).hashToField();
        if (nullifierHashes[nullifierHash]) revert InvalidNullifier();
        worldId.verifyProof(
            root,
            groupId,
            abi.encodePacked(signal).hashToField(),
            nullifierHash,
            externalNullifier,
            proof
        );
        nullifierHashes[nullifierHash] = true;
    }

	// Mock WorldId proof verification
	function verifyAndExecuteMock() public {
        number += 1; // Increment the value of number by 1 every time this function is called
    }

    // EAS attestation
    function attestData(
    bytes32 schema, // schema address
    address attestId, // AttestId contract
    string memory lastAttest, // last attest by AttestId
    address user, // recipient of attestation
    uint8 credentialType, // credential type of worldId
    uint32 blockData, // blocktime for worldId proof
    string memory hash, // hash of worldId proof
    string memory action // action of worldId proof
	) external returns (bytes32) {
		bytes memory encodedData = abi.encode(attestId, lastAttest, user, credentialType, blockData, hash, action);

		return _eas.attest(
			AttestationRequest({
				schema: schema,
				data: AttestationRequestData({
					recipient: user,
					expirationTime: NO_EXPIRATION_TIME,
					revocable: true,
					refUID: EMPTY_UID,
					data: encodedData,
					value: 0
				})
			})
		);
	}

	// Mint NFT to msg.sender on multiple chains using LZ
	function mintNFT(string memory _uri) public payable {
        _tokenIdCounter.increment();
        uint256 newItemId = _tokenIdCounter.current();
        _mint(msg.sender, newItemId);
        _setTokenURI(newItemId, _uri);

        // Send cross-chain message after minting
        bytes memory payload = abi.encode(msg.sender, _uri);
        _lzSend(destChainId, payload, payable(msg.sender), address(0x0), bytes(""), msg.value);
    }

	function _nonblockingLzReceive(uint16, bytes memory, uint64, bytes memory _payload) internal override {
       // intentionally left empty
    }

    function trustAddress(address _otherContract) public onlyOwner {
        trustedRemoteLookup[destChainId] = abi.encodePacked(_otherContract, address(this));
    }

	// Custom tokenURI storage
	function _setTokenURI(uint256 tokenId, string memory uri) internal virtual {
    require(_exists(tokenId), "ERC721URI: URI set of nonexistent token");
    _tokenURIs[tokenId] = uri;
	}

	// Return appropriate URI
	function tokenURI(uint256 tokenId) public view virtual override returns (string memory) {
    require(_exists(tokenId), "ERC721URI: URI query for nonexistent token");
    return _tokenURIs[tokenId];
	}

	// Overriding functions to prevent transfers
    function transferFrom(address /* from */, address /* to */, uint256 /* tokenId */) public pure override(ERC721, IERC721) {
    revert TransfersNotAllowed();
	}
}
