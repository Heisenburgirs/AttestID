import React, { useState, useEffect } from "react";
import { IDKitWidget, CredentialType } from "@worldcoin/idkit"; // Update import path
import Modal from "../modal/modal"
import { createWalletClient } from "viem"
import { useAccount } from "wagmi";
import { decodeAbiParameters } from "viem"
import { Contract } from "@ethersproject/contracts";
import { ethers, utils } from "ethers";
import { ON_CHAIN_WORLD_ID_CONTRACT, ON_CHAIN_ATTEST_UID, CREDENTIAL_TYPE_ORB, CREDENTIAL_TYPE_PHONE, ACTION_ID_UNIQUENESS, ACTION_ID_TWITTER } from "../constants/constants"
import ABI from "../constants/abi.json"
import world from "../../../public/world.png"
import twitter from "../../../public/twitter.png"
import { EAS, SchemaEncoder } from "@ethereum-attestation-service/eas-sdk";
import { useQuery } from "@apollo/client";
import { FETCH_ATTESTATIONS } from "../queries/graph";
import { create } from 'ipfs-http-client';
import { convertToPNG } from '../nft/NFT';

const PROJECT_ID="2TtmxSEQ33b1QC1siveGwLej3Dd"
const PROJECT_SECRET="221f2611adc40c5a8c392d15322fb574"

const ipfs = create({
  host: 'ipfs.infura.io',
  port: 5001,
  protocol: 'https',
  headers: {
      Authorization: `Basic ${Buffer.from(`${PROJECT_ID}:${PROJECT_SECRET}`).toString('base64')}`
  }
});

const VerifyWorldId = () => {
  const { loading, error, data } = useQuery(FETCH_ATTESTATIONS);
  const test = () => {
    if (data && data.attestations) {
      // This is just the first attestation as per your request
      const attestation = data.attestations[0];

      // Define the ABI structure
      const abiSchema = "address attestId, string lastAttest, address user, uint8 credentialType, uint32 block, string hash, string action";

      // Initialize the SchemaEncoder
      const schemaEncoder = new SchemaEncoder(abiSchema);

      // Decode the data
      const decodedData = schemaEncoder.decodeData(attestation.data);
      console.log(decodedData);
    }
    console.log(data)
  }

  const [merkleRoot, setMerkleRoot] = useState("");
  const [nullifierHash, setNullifierHash] = useState("");
  const [proof, setProof] = useState<string[]>([]);
  const [credentialType, setCredentialType] = useState("");
  const [modalVisible, setModalVisible] = useState(false);

  const [verificationType, setVerificationType] = useState<string | null>(null);

  const [verifyingProof, setVerifyingProof] = useState(false);
  const [attesting, setAttesting] = useState(false);
  const [minting, setMinting] = useState(false);
  const [flowSuccess, setFlowSuccess] = useState(false);
  const [flowFailed, setFlowFailed] = useState(false);
  const [flowError, setFlowError] = useState("");
  const [closeButton, setCloseButton] = useState(false);
  const [userAddress, setUserAddress] = useState<`0x${string}` | null>(null);

  const { address } = useAccount();

  const [blockNumber, setBlockNumber] = useState<number>(0)
  const [proofTransactionHash, setProofTransactionHash] = useState<string>("")
  const [attestationTransactionHash, setAttestationTransactionHash] = useState("")
  const [previousAttestationHash, setPreviousAttestationHash] = useState("")
  const [ipfsHash, setIpfsHash] = useState("")
  const nftRef = React.useRef<HTMLDivElement>(null);

  // Update userAddress whenever the address changes
  useEffect(() => {
    setUserAddress(address ?? null);
  }, [address]);

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
      {/*const txResponse1 = await contract.verifyAndExecute(
          userAddress,
          response.merkle_root,
          response.nullifier_hash,
          unpackedProofStrings,
          ACTION_ID_UNIQUENESS
      );*/}

      // Mock function
      const txResponse1 = await contract.verifyAndExecuteMock();
      const receipt = await txResponse1.wait();
      console.log("Transaction successful:", receipt);
      const { blockNumber, transactionHash } = receipt;

      // Set global state for WorldId verification txhash and blocknumber
      setBlockNumber(blockNumber);
      setProofTransactionHash(transactionHash);

      // Proof verified
      setVerifyingProof(false)

      // If the above is successful, we proceed with attesting
      setAttesting(true)

      if (loading) {
        console.log("Data is still being fetched");
        return;
      }

      if (error) {
          console.error("Error fetching data:", error);
          return;
      }

      // Get last attestation to user from AttestID contract
      const lastAttestPlaceholder = data.attestations[0].id;
      setPreviousAttestationHash(lastAttestPlaceholder)

      // Attest onchain to WorldID onchain proof verification
      try {
        console.log(lastAttestPlaceholder)
          const txResponse2 = await contract.attestData(
            ON_CHAIN_ATTEST_UID,
            ON_CHAIN_WORLD_ID_CONTRACT,
            lastAttestPlaceholder ?? "",
            userAddress,
            CREDENTIAL_TYPE_ORB,
            blockNumber,
            transactionHash,
            verificationType === "world" ? ACTION_ID_UNIQUENESS : ACTION_ID_TWITTER
          );
          const receipt = await txResponse2.wait();
          console.log("Transaction successful:", receipt);
          // Get tx hash from attestData as to not confuse it with previous one
          const attestTransactionHash = receipt.transactionHash;
          // Set tx hash of attestData
          setAttestationTransactionHash(attestTransactionHash)
          setAttesting(false)

          // Start of minting logic
          setMinting(true)

          try {

            console.log("test", nftRef.current)

            // Convert component to PNG
            // @ts-ignore
            const pngDataUrl = await convertToPNG(nftRef.current);

            // Convert data URL to a buffer
            const pngBuffer = Buffer.from(pngDataUrl.replace('data:image/png;base64,', ''), 'base64');

            // Pin Component PNG to IPFS
            const result = await ipfs.add(pngBuffer);

            // Extract path
            const ipfsCid = result.path;
            console.log(ipfsCid)

            // Set hash
            setIpfsHash(ipfsCid)

            // Set tx hashes, block time, credential type, issuer as attributes
            const attributes = [
              { key: 'proofTransactionHash', value: proofTransactionHash },
              { key: 'attestationTransactionHash', value: attestationTransactionHash },
              { key: 'previousAttestationHash', value: previousAttestationHash ?? "" },
              { key: 'issuer', value: 'worldid' },
              { key: 'credentialType', value: 1 },
              { key: 'blocknumber', value: blockNumber }
            ]

            const tokenURI = {
              userAddress: userAddress,
              attributes: attributes,
              image: `ipfs://${ipfsCid}`,
            }

            // Upload tokenData to IPFS
            const metadataResult = await ipfs.add(Buffer.from(JSON.stringify(tokenURI)));
            const metadataCid = metadataResult.path;

            // TokenURI IPFS
            const finalTokenURI = `ipfs://${metadataCid}`;

            const txResponse3 = await contract.mintNFT(
              finalTokenURI
            );

            const receipt = await txResponse3.wait();
            console.log("Transaction successful:", receipt);

            setFlowSuccess(true)
            setCloseButton(true)

          } catch (err) {
            console.error("Error executing transaction for nft:", err);
            setFlowError(`Error executing transaction for nft: ${err}`);
            setFlowFailed(true)
            setVerifyingProof(false)
            setAttesting(false)
            setMinting(false)
            setFlowFailed(true)
            setCloseButton(true)
          }

      } catch (err) {
          console.error("Error executing transaction for attestData:", err);
          setFlowError(`Error executing transaction for attestData: ${err}`);
          setFlowFailed(true)
          setVerifyingProof(false)
          setAttesting(false)
          setMinting(false)
          setFlowFailed(true)
          setCloseButton(true)
      }

    } catch (err) {
      console.error("Error executing transaction for verifyAndExecute:", err);
      setFlowError(`Error executing transaction for verifyAndExecute:", ${err}`)
      setVerifyingProof(false)
      setAttesting(false)
      setMinting(false)
      setFlowFailed(true)
      setCloseButton(true)
    }
  }

  return (
    <>
      <div className="w-full flex justify-between items-center shadow-md rounded-[50px] py-4 px-8">
          <div className="w-[60px]">
              <img src={world} alt="Worldcoin" />
          </div>
          <div>
              <IDKitWidget
                  app_id="app_staging_0b0b08e01a86bb44b8b1014793304f6a"
                  action={ACTION_ID_UNIQUENESS}
                  //@ts-ignore
                  signal={userAddress}
                  onSuccess={onSuccess}
                  credential_types={[CredentialType.Orb]}
                  enableTelemetry
              >
                  {({ open }) =>
                      <button onClick={() => {
                        setVerificationType("world");
                        open();
                        }}  className="px-4 py-2 text-base rounded-[15px] shadow-md text-white bg-world hover:bg-blue-accent transition">
                          Verify
                      </button>}
              </IDKitWidget>
          </div>
      </div>
      <Modal
        onClose={() => {
          setModalVisible(false);
          setFlowSuccess(false);
          setFlowError("");
        }}
        visible={modalVisible}
        verifyingProof={verifyingProof}
        attesting={attesting}
        minting={minting}
        flowSuccess={flowSuccess}
        flowError={flowError}
        flowFailed={flowFailed}
        closeButton={closeButton}
        userAddress={userAddress}
        blockNumber={blockNumber}
        proofTransactionHash={proofTransactionHash}
        attestationTransactionHash={attestationTransactionHash}
        previousAttestationHash={previousAttestationHash}
        setNftRef={nftRef}
        />
    </>
  );
}

export default VerifyWorldId;