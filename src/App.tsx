import { Header } from "./components/header/Header";
import { Main } from "./components/main/main";

export function App() {
  /**
   * Wagmi hook for getting account information
   * @see https://wagmi.sh/docs/hooks/useAccount
   */

  return (
    <div className="flex flex-col gap-12">
      <Header />
      <Main />
    </div>
  );
}
