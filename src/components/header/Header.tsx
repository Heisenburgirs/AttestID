import { ConnectButton } from "@rainbow-me/rainbowkit";
import { useAccount } from "wagmi";

export const Header = () => {
  /**
   * Wagmi hook for getting account information
   * @see https://wagmi.sh/docs/hooks/useAccount
   */
  const { isConnected } = useAccount();

  return (
    <>
      <div className="w-full flex justify-between items-center">
        <div className="w-[62px] h-[62px]" >
          <img src="attest.png" alt="Description" />
        </div>
        <ConnectButton />
      </div>
    </>
  );
}
