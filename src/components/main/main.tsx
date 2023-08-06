import { IDKitWidget, solidityEncode, CredentialType } from '@worldcoin/idkit'
import { useAccount } from "wagmi";
import { decodeAbiParameters } from 'viem'

export const Main = () => {

  const { address } = useAccount()

  const onSuccess = (response: any) => {
    console.log('Merkle Root:', response.merkle_root);
    console.log('Nullifier Hash:', response.nullifier_hash);
    console.log('Proof:', response.proof);
    console.log('Credential Type:', response.credential_type);
    const unpackedProof = decodeAbiParameters([{ type: 'uint256[8]' }], response.proof)[0] as BigInt[]
    const unpackedProofStrings = unpackedProof.map(value => value.toString());
    console.log(unpackedProofStrings);
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
        </div>
      </div>
    </div>
  );
}