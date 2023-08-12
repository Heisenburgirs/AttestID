import React, { useState, useEffect } from "react";
import { IDKitWidget, CredentialType } from '@worldcoin/idkit'; // Update import path
import Modal from '../modal/modal'
import { createWalletClient } from "viem"
import { decodeAbiParameters } from "viem"
import { Contract } from "@ethersproject/contracts";
import { ethers } from "ethers";
import { ON_CHAIN_WORLD_ID_CONTRACT } from "../constants/constants"
import ABI from "../constants/abi.json"
import { EAS, SchemaEncoder } from "@ethereum-attestation-service/eas-sdk";

type VerifyWidgetProps = {
  src: string;
  action: string;
  userAddress: string;
};

const VerifyWidget: React.FC<VerifyWidgetProps> = ({ src, action, userAddress }) => {
  const [merkleRoot, setMerkleRoot] = useState("");
  const [nullifierHash, setNullifierHash] = useState("");
  const [proof, setProof] = useState<string[]>([]);
  const [credentialType, setCredentialType] = useState("");
  const [modalVisible, setModalVisible] = useState(false);

  const [verifyingProof, setVerifyingProof] = useState(false);
  const [attesting, setAttesting] = useState(false);
  const [minting, setMinting] = useState(false);
  const [flowSuccess, setFlowSuccess] = useState(false);
  const [flowFailed, setFlowFailed] = useState(false);
  const [flowError, setFlowError] = useState("");

  const onSuccess = async (response: any) => {
    setMerkleRoot(response.merkle_root)
    setNullifierHash(response.nullifier_hash)
    const unpackedProof = decodeAbiParameters([{ type: "uint256[8]" }], response.proof)[0] as BigInt[]
    const unpackedProofStrings = unpackedProof.map(value => value.toString());
    setProof(unpackedProofStrings);
    setCredentialType(response.credential_type);

    const provider = new ethers.providers.Web3Provider(window.ethereum);
    const signer = provider.getSigner();
    const contract = new Contract(ON_CHAIN_WORLD_ID_CONTRACT, ABI, signer);
    console.log("provider", provider)

    console.log(merkleRoot, nullifierHash, proof, credentialType)

    // Make modal & display text visible
    setModalVisible(true)
    setVerifyingProof(true)

    // Call verifyAndExecute method to verify proof
    try {
      console.log(userAddress)
      console.log(response.merkle_root)
      console.log(response.nullifier_hash)
      console.log(unpackedProofStrings)
      console.log(action)
      const txResponse1 = await contract.verifyAndExecute(
          userAddress,
          response.merkle_root,
          response.nullifier_hash,
          unpackedProofStrings,
          action
      );
      const receipt = await txResponse1.wait();
      console.log("Transaction successful:", receipt);
      const { blockHash, transactionHash, from } = receipt;
      setVerifyingProof(false)

      // If the above is successful, we proceed with attesting
      setAttesting(true)

      try {
          const txResponse2 = await contract.attestData(

          );
          const receipt2 = await txResponse2.wait();
          console.log("Transaction successful:", receipt2);
          setAttesting(false)
      } catch (err) {
          console.error("Error executing transaction for attestData:", err);
          setFlowError(`Error executing transaction for attestData: ${err}`);
          setFlowFailed(true)
      }

    } catch (err) {
      console.error("Error executing transaction for verifyAndExecute:", err);
      setFlowError(`Error executing transaction for verifyAndExecute:", ${err}`)
      setFlowFailed(true)
    }
  }

  return (
    <>
      <div className="w-full flex justify-between items-center shadow-md rounded-[50px] py-4 px-8">
          <div className="w-[60px]">
              <img src={src} alt="Worldcoin" />
          </div>
          <div>
              <IDKitWidget
                  app_id="app_staging_0b0b08e01a86bb44b8b1014793304f6a"
                  action={action}
                  signal={userAddress}
                  onSuccess={onSuccess}
                  credential_types={[CredentialType.Orb]}
                  enableTelemetry
              >
                  {({ open }) =>
                      <button onClick={open} className="px-4 py-2 text-base rounded-[15px] shadow-md text-white bg-world hover:bg-blue-accent transition">
                          Verify
                      </button>}
              </IDKitWidget>
          </div>
      </div>
      <Modal
        onClose={() => setModalVisible(false)}
        visible={modalVisible}
        verifyingProof={verifyingProof}
        attesting={attesting}
        minting={minting}
        flowSuccess={flowSuccess}
        flowError={flowError}
        flowFailed={flowFailed}
        />
    </>
  );
}

export default VerifyWidget;
