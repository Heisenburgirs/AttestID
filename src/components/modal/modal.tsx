import loading from '../../../public/loading.gif'
import success from '../../../public/success.png'
import fail from '../../../public/fail.png'
import NFT from "../nft/NFT";
import React, { useEffect } from 'react';

interface ModalProps {
  visible: boolean;
  onClose: () => void;
  verifyingProof: boolean;
  attesting: boolean;
  minting: boolean;
  flowSuccess: boolean;
  flowFailed: boolean;
  closeButton: boolean;
  flowError: string;
  userAddress: `0x${string}` | null;
  blockNumber: number;
  proofTransactionHash: string;
  attestationTransactionHash: string;
  previousAttestationHash: string;
  setNftRef: React.Ref<HTMLDivElement>;
}

function Modal({
  visible,
  onClose,
  verifyingProof,
  attesting,
  minting,
  flowSuccess,
  flowFailed,
  closeButton,
  flowError,
  userAddress,
  blockNumber,
  proofTransactionHash,
  attestationTransactionHash,
  previousAttestationHash,
  setNftRef
 }: ModalProps) {

    if (!visible) return null;

    const nftRef = React.useRef<HTMLDivElement>(null);

    useEffect(() => {
      if (nftRef.current) {
      }
      // Clean up, set the ref to null when the Modal unmounts
      return () => {
      };
    }, [nftRef, setNftRef]);

    return (
        <div className="fixed top-0 left-0 w-full h-full flex justify-center items-center bg-black bg-opacity-50">
            <div className="bg-white p-8 rounded-[25px] shadow-md w-[600px] h-[600px] flex flex-col h-full gap-8 justify-center items-center">
              <div className="flex flex-col gap-4 items-center">
                {!flowSuccess && !flowFailed && <img src={loading} alt="Loading..." className="w-[75px]" /> }
                {flowSuccess && <img src={success} alt="Loading..." className="w-[75px]" /> }
                {flowFailed && <img src={fail} alt="Loading..." className="w-[75px]" /> }
                <div className="text-xl font-bold flex justify-center items-center">
                  {verifyingProof && !flowFailed && <div className="text-xl font-bold flex justify-center items-center">Verifying Proof</div>}
                  {attesting && <div className="text-xl font-bold flex justify-center items-center">Attesting</div>}
                  {minting && !flowSuccess && <div className="flex flex-col gap-4">
                     <div className="text-xl font-bold flex justify-center items-center">Minting NFT</div>
                  </div>}
                  {flowSuccess && <div className="text-xl font-bold flex justify-center items-center">Success</div>}
                  {flowFailed && <div className="text-xl font-bold flex justify-center items-center w-[300px] overflow-auto">{flowError}</div>}
                </div>
              </div>
              <NFT
                    userAddress={userAddress}
                    blockNumber={blockNumber}
                    proofTransactionHash={proofTransactionHash}
                    attestationTransactionHash={attestationTransactionHash}
                    previousAttestationHash={previousAttestationHash}
                    credentialType="1" nftRef={setNftRef}  />
              {closeButton && <button onClick={onClose} className="py-2 px-8 bg-red-500 text-white rounded-[20px]">Close</button>}
            </div>
        </div>
    );
}

export default Modal;
