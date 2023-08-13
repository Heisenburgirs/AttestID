import { ConnectButton } from "@rainbow-me/rainbowkit";
import { useState } from "react";
import { Link } from "react-router-dom";
import { useAccount } from "wagmi";

export const Header = () => {
  /**
   * Wagmi hook for getting account information
   * @see https://wagmi.sh/docs/hooks/useAccount
   */
  const { isConnected } = useAccount();

  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <div className="w-full px-8 py-4">
      <div className="w-full flex justify-between items-center">
        <div className="flex gap-2 text-base items-center font-bold shadow-md px-4 py-2 rounded-[15px]" >
          <img src="attest.png" alt="Attest" className="w-[24px] h-[24px]"/>
          <div>AttestId</div>
        </div>

        <div className="flex gap-4">
          <div className="relative group sm:hidden md:block">
            {/* The Profile trigger */}
            <div className="flex gap-4 items-center">
              <div className="hover:underline cursor-pointer shadow-md px-4 py-2 rounded-[15px] font-bold text-base">Profile</div>
            </div>

            {/* Invisible bridge */}
            <div className="absolute left-0 w-full h-[10px] bg-transparent group-hover:block hidden"></div>

            {/* The dropdown menu */}
            <div className="absolute rounded-[15px] mt-2 left-0 w-48 bg-white border border-gray-200 divide-y divide-gray-100 rounded-md shadow-lg group-hover:block hidden">
              <div className="p-2">
                <Link to="/profile" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 rounded-[15px] font-bold">Profile </Link>
              </div>
            </div>
          </div>
          <div className="sm:hidden md:block">
            <ConnectButton  />
          </div>
        </div>

        <div className="relative group md:hidden">
          {/* The burger icon */}
          <button
            onClick={() => setMenuOpen(!menuOpen)}
            className="hamburger p-4 focus:outline-none"
          >
            <div className="h-1 w-6 bg-black mb-1 rounded"></div>
            <div className="h-1 w-6 bg-black mb-1 rounded"></div>
            <div className="h-1 w-6 bg-black rounded"></div>
          </button>

          {/* The sidebar menu */}
          <div
            style={{ transform: menuOpen ? 'translateX(0%)' : 'translateX(-100%)' }}
            className="fixed top-0 left-0 w-full h-full bg-white transform transition-transform duration-300 ease-in-out"
          >
            <div className="w-full h-full flex flex-col justify-between items-center py-8 px-4">
              <a href="#" className="w-full text-center text-base block px-4 py-2 text-gray-700 bg-gray-100 rounded-[15px] font-bold">Activity</a>
              <div className="flex flex-col gap-8">
                <ConnectButton />
                <button onClick={() => setMenuOpen(!menuOpen)} className="w-full text-center text-base block px-4 py-2 text-gray-700 bg-gray-100 rounded-[15px] font-bold">Close</button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
