import { BrowserRouter as Router, Route, Routes, Link } from 'react-router-dom';
import { Header } from "./components/header/Header";
import { Main } from "./components/main/main";
import { Profile } from './Profile';
import { useAccount } from 'wagmi';

export function App() {
  /**
   * Wagmi hook for getting account information
   * @see https://wagmi.sh/docs/hooks/useAccount
   */

  const { isConnected } = useAccount();

  return (
    <Router>
      <div className="flex flex-col gap-12">
        <Header />
        <Routes>
          <Route path="/profile" element={<Profile />} />
          <Route path="/" element={isConnected && <Main />} />
        </Routes>
      </div>
    </Router>
  );
}
