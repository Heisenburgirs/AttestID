// SPDX-License-Identifier: MIT
pragma solidity ^0.8.11;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721Enumerable.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/Counters.sol";

import {ByteHasher} from "./helpers/ByteHasher.sol";
import {IWorldID} from "./interfaces/IWorldID.sol";

contract AttestId is ERC721, ERC721Enumerable, ERC721URIStorage, Ownable {
  using Counters for Counters.Counter;

  Counters.Counter private _tokenIdCounter;

  IWorldID public worldId;

  uint256 public externalNullifier;
  uint256 public groupId = 1;
  mapping(uint256 => bool) public nullifierHashes;

  // Adding the VerificationSuccess event
  event VerificationSuccess(
    address indexed user,
    uint256 proofTxHash,
    uint256 attestTxHash,
    string platformID
  );

  constructor(
    address _worldId,
    string memory _appId,
    string memory _actionId
  ) ERC721("AttestID", "ATID") {
    worldId = IWorldID(_worldId);
    externalNullifier = uint256(keccak256(abi.encodePacked(_appId, _actionId)));
  }

  function verifyAndExecute(
    address signal,
    uint256 root,
    uint256 nullifierHash,
    uint256[8] calldata proof
  ) public {
    require(!nullifierHashes[nullifierHash], "Nullifier has been used before");

    worldId.verifyProof(
      root,
      groupId,
      uint256(keccak256(abi.encodePacked(signal))),
      nullifierHash,
      externalNullifier,
      proof
    );

    nullifierHashes[nullifierHash] = true;

    // Emitting the VerificationSuccess event with relevant data
    emit VerificationSuccess(
      msg.sender,
      uint256(blockhash(block.number - 1)),
      uint256(blockhash(block.number)),
      "WorldID"
    );

    _mintNFT(msg.sender, "IPFS_LINK_HERE");
  }

  function _mintNFT(address recipient, string memory uri) internal {
    _tokenIdCounter.increment();
    uint256 tokenId = _tokenIdCounter.current();
    _safeMint(recipient, tokenId);
    _setTokenURI(tokenId, uri);
  }

  // Overriding to prevent transfers
  function _beforeTokenTransfer(
    address from,
    address to,
    uint256 tokenId
  ) internal override(ERC721, ERC721Enumerable) {
    super._beforeTokenTransfer(from, to, tokenId);
    require(from == address(0), "Transfers are disabled");
  }

  function _burn(uint256 tokenId) internal override(ERC721, ERC721URIStorage) {
    super._burn(tokenId);
  }

  function tokenURI(
    uint256 tokenId
  ) public view override(ERC721, ERC721URIStorage) returns (string memory) {
    return super.tokenURI(tokenId);
  }

  function supportsInterface(
    bytes4 interfaceId
  ) public view override(ERC721, ERC721Enumerable) returns (bool) {
    return super.supportsInterface(interfaceId);
  }
}
