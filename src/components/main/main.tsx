import VerifyWidget from "../widget/widget";
import React, { useState, useEffect } from "react";
import { useAccount } from "wagmi";
import world from '../../../public/world.png'
import twitter from '../../../public/twitter.png'
import {
  CREDENTIAL_TYPE_ORB,
  CREDENTIAL_TYPE_PHONE,
  ACTION_ID_UNIQUENESS,
  ACTION_ID_TWITTER
} from '../constants/constants'

declare global {
  interface Window {
    ethereum: any;
  }
}

export const Main = () => {
  const [userAddress, setUserAddress] = useState<`0x${string}` | null>(null);

  const { address } = useAccount();

  // Update userAddress whenever the address changes
  useEffect(() => {
    setUserAddress(address ?? null);
  }, [address]);

  return (
    <div className="w-full px-8 py-4">
      <VerifyWidget src={world} action={ACTION_ID_UNIQUENESS} userAddress={userAddress ?? ""} />
      <VerifyWidget src={twitter} action={ACTION_ID_TWITTER} userAddress={userAddress ?? ""} />
    </div>
  );
}