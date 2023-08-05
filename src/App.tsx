import { useAccount } from "wagmi";

import { Attestooooooor } from "./components";
import { Header } from "./components/header/Header";

export function App() {
  /**
   * Wagmi hook for getting account information
   * @see https://wagmi.sh/docs/hooks/useAccount
   */
  const { isConnected } = useAccount();

  return (
    <div className="flex flex-col px-8 py-4">
      <Header />
      {isConnected && (
        <>
          <hr />
          <Attestooooooor />
          <hr />
        </>
      )}
    </div>
  );
}
