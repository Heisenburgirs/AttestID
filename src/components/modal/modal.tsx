import loading from '../../../public/loading.gif'
import success from '../../../public/success.png'
import fail from '../../../public/fail.png'

interface ModalProps {
  visible: boolean;
  onClose: () => void;
  verifyingProof: boolean;
  attesting: boolean;
  minting: boolean;
  flowSuccess: boolean;
  flowFailed: boolean;
  flowError: string;
}

function Modal({ visible, onClose, verifyingProof, attesting, minting, flowSuccess, flowFailed, flowError }: ModalProps) {
    if (!visible) return null;

    return (
        <div className="fixed top-0 left-0 w-full h-full flex justify-center items-center bg-black bg-opacity-50">
            <div className="bg-white p-8 rounded-[25px] shadow-md w-[500px] h-[400px] flex flex-col h-full gap-8 justify-center items-center">
              <div className="flex flex-col gap-4 items-center">
                {!flowSuccess && !flowFailed && <img src={loading} alt="Loading..." className="w-[75px]" /> }
                {flowSuccess && <img src={success} alt="Loading..." className="w-[75px]" /> }
                {flowFailed && <img src={fail} alt="Loading..." className="w-[75px]" /> }
                <div className="text-xl font-bold flex justify-center items-center">
                  {verifyingProof && !flowFailed && <div className="text-xl font-bold flex justify-center items-center">Verifying Proof</div>}
                  {attesting && <div className="text-xl font-bold flex justify-center items-center">Attesting</div>}
                  {minting && <div className="text-xl font-bold flex justify-center items-center">Minting NFT</div>}
                  {flowSuccess && <div className="text-xl font-bold flex justify-center items-center">Success</div>}
                  {flowFailed && <div className="text-xl font-bold flex justify-center items-center w-[300px] overflow-auto">{flowError}</div>}
                </div>
              </div>
              {flowFailed && flowSuccess && <button onClick={onClose} className="py-2 px-8 bg-red-500 text-white rounded-[20px]">Close</button>}
            </div>
        </div>
    );
}

export default Modal;
