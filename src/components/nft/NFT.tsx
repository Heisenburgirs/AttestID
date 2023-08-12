import React from 'react';
import QRCode from 'qrcode.react';

{/*interface NFTProps {
  lastAttestPlaceholder: string;
  userAddress: string;
  blockNumber: number;
  transactionHash: string;
  verificationType: string;
  // ... any other props you want
}*/}

const NFTComponent = () => {
  return (
    <div className="w-[500px] h-[300px] border shadow-md rounded-[25px] p-8">
      <div className="w-full justify-between flex gap-4">
        <div>
          <QRCode value={"Test"} />
        </div>
        <div className="flex flex-col w-full gap-6">
          <div className="w-full flex justify-between px-4">
            <div className="flex flex-col gap-2">
              <p>AFFILIATION</p>
              <p>AttestId</p>
            </div>
            <div className="flex flex-col gap-2">
              <p>BLOCKTIME</p>
              <p>123456</p>
            </div>
          </div>
          <div className="w-full flex justify-between items-center px-4">
            <div className="flex flex-col gap-2">
              <p>ISSUER</p>
              <p>WorldId</p>
            </div>
            <div className="flex flex-col gap-2">
              <p>CREDENTIAL</p>
              <p>agagagas</p>
            </div>
          </div>
        </div>
      </div>
      <div className="flex w-full flex-col justify-center items-center pt-6">
        <div>0x000000000000000000000000000000000000000000000000</div>
        <div>0x000000000000000000000000000000000000000000000000</div>
        <div>0x000000000000000000000000000000000000000000000000</div>
      </div>
    </div>
  );
}

export default NFTComponent;
