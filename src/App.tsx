import { useAccount } from "wagmi";

import { Attestooooooor } from "./components";
import { Header } from "./components/header/Header";
import { Main } from "./components/main/main";

export function App() {
  /**
   * Wagmi hook for getting account information
   * @see https://wagmi.sh/docs/hooks/useAccount
   */
  const { isConnected } = useAccount();

  return (
    <div className="flex flex-col gap-12">
      <Header />
      <Main />
      {/*{isConnected && (
        <>
          <hr />
          <Attestooooooor />
          <hr />
        </>
      )}*/}
    </div>
  );
}
