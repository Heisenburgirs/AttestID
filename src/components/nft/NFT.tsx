import React from 'react';
import QRCode from 'qrcode.react';
import * as htmlToImage from 'html-to-image';


interface NFTProps {
  userAddress: `0x${string}` | null;
  blockNumber: number;
  proofTransactionHash: string;
  attestationTransactionHash: string;
  previousAttestationHash: string;
  credentialType: string;
  nftRef: React.Ref<HTMLDivElement>;
}

export const convertToPNG = async (node: HTMLElement) => {
  try {
      const dataUrl = await htmlToImage.toPng(node);
      return dataUrl;
  } catch (error) {
      console.error("Failed to convert to PNG:", error);
      throw error;
  }
};

const NFT: React.FC<NFTProps> = ({ userAddress, blockNumber, proofTransactionHash, attestationTransactionHash, previousAttestationHash, credentialType, nftRef }) => {
  return (
    <>
    <div ref={nftRef} className="w-[500px] h-[300px] bg-white border shadow-md rounded-[25px] p-8">
      <div className="w-full justify-between flex gap-4">
        <div>
          {userAddress && <QRCode value={userAddress} />}
        </div>
        <div className="flex flex-col w-full gap-6 text-base">
          <div className="w-full flex justify-between px-4">
            <div className="flex flex-col gap-2">
              <p>AFFILIATION</p>
              <p>AttestId</p>
            </div>
            <div className="flex flex-col gap-2">
              <p>BLOCKTIME</p>
              <p>{blockNumber}</p>
            </div>
          </div>
          <div className="w-full flex justify-between items-center px-4">
            <div className="flex flex-col gap-2">
              <p>ISSUER</p>
              <p>WorldID</p>
            </div>
            <div className="flex flex-col gap-2">
              <p>CREDENTIAL</p>
              <p>{credentialType}</p>
            </div>
          </div>
        </div>
      </div>
      <div className="flex w-full flex-col justify-center items-center pt-6 text-sm gap-2">
        <div>{proofTransactionHash}</div>
        <div>{attestationTransactionHash}</div>
        <div>{previousAttestationHash}</div>
      </div>
    </div>
    </>
  );
}

export default NFT;
