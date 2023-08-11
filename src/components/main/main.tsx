import { useState, useEffect } from "react";
import { IDKitWidget, CredentialType } from "@worldcoin/idkit"
import { createWalletClient } from "viem"
import { useAccount } from "wagmi";
import { decodeAbiParameters } from "viem"
import { Contract } from "@ethersproject/contracts";
import { ethers } from "ethers";
import { ON_CHAIN_WORLD_ID } from "../constants/constants"
import ABI from "../constants/abi.json"

declare global {
  interface Window {
    ethereum: any;
  }
}

export const Main = () => {
  const [userAddress, setUserAddress] = useState<`0x${string}` | null>(null);
  const [merkleRoot, setMerkleRoot] = useState("");
  const [nullifierHash, setNullifierHash] = useState("");
  const [proof, setProof] = useState<string[]>([]);
  const [credentialType, setCredentialType] = useState("");
  const [actionId, setActionId] = useState("");
  const [signal, setSignal] = useState("");

  const txHash = "0xccd33a28e623e64cad3c9be10d625206fdd291b4faa20e30b3596ab5cdddc09f";
  const block = "13168067";

  const { address } = useAccount();

  // Update userAddress whenever the address changes
  useEffect(() => {
    setUserAddress(address ?? null);
  }, [address]);

  const onSuccess = async (response: any) => {
    setMerkleRoot(response.merkle_root)
    console.log("Merkle Root:", merkleRoot);
    setNullifierHash(response.nullifier_hash)
    console.log("Nullifier Hash:", nullifierHash);
    const unpackedProof = decodeAbiParameters([{ type: "uint256[8]" }], response.proof)[0] as BigInt[]
    const unpackedProofStrings = unpackedProof.map(value => value.toString());
    setProof(unpackedProofStrings);
    console.log("Proof:", proof);
    setCredentialType(response.credential_type);
    console.log("Credential Type:", credentialType);
  }

  const test = async (response: any) => {
    console.log("Merkle Root:", merkleRoot);
    console.log("Nullifier Hash:", nullifierHash);
    console.log("Proof:", proof);
    console.log("Credential Type:", credentialType);

    const provider = new ethers.providers.Web3Provider(window.ethereum);
    const signer = provider.getSigner();
    const contract = new Contract(ON_CHAIN_WORLD_ID, ABI, signer);
    console.log("provider", provider)

    // Call contract method
    try {
        const txResponse = await contract.verifyAndExecute(
          merkleRoot,
          nullifierHash,
          proof,
          "attest-uniqueness"
          );
        const receipt = await txResponse.wait();
        console.log("Transaction successful:", receipt);
    } catch (err) {
        console.error("Error executing transaction:", err);
    }
  }

  const test2 = async (response: any) => {
    console.log("Merkle Root:", merkleRoot);
    console.log("Nullifier Hash:", nullifierHash);
    console.log("Proof:", proof);
    console.log("Credential Type:", credentialType);
  }

  return (
    <div className="w-full px-8 py-4">
      <div className="w-full flex justify-between items-center shadow-md rounded-[50px] py-4 px-8">
        <div>
          <img src="worldcoin.svg" alt="Wodlcoin" />
        </div>
        <div>
          <IDKitWidget
              app_id="app_staging_0b0b08e01a86bb44b8b1014793304f6a" // must be an app set to on-chain
              action="attest-uniqueness" // solidityEncode the action
              signal={address} // only for on-chain use cases, this is used to prevent tampering with a message
              onSuccess={onSuccess}
              // no use for handleVerify, so it is removed
              credential_types={[CredentialType.Orb]} // we recommend only allowing orb verification on-chain
              enableTelemetry
          >
            {({ open }) =>
            <button onClick={open} className="px-4 py-2 text-base rounded-[15px] shadow-md text-white bg-world hover:bg-blue-accent transition">
              Verify
            </button>}
          </IDKitWidget>
          <button className="hover:cursor-pointer" onClick={test}>test</button>
          <button className="hover:cursor-pointer" onClick={test2}>test2</button>
        </div>
      </div>
    </div>
  );
}