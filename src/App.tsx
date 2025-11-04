import { useEffect } from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import { useAccount } from "wagmi";
import { base } from "wagmi/chains";
import { sdk } from "@farcaster/miniapp-sdk";

import Layout from "./components/Layout";
import HomePage from "./pages/HomePage";
import GamePage from "./pages/GamePage";
import InfoPage from "./pages/InfoPage";
import { UserPage } from "./pages/UserPage";
import { ConnectWalletPage } from "./pages/ConnectWalletPage";
import { WrongNetworkPage } from "./pages/WrongNetworkPage";
import MintPage from "./pages/MintPage";
import MintPromptPage from "./pages/MintPromptPage";
import { useHasHammerNft } from "./hooks/useHasHammerNft";

import "./index.css";

function App() {
  const { isConnected, chain } = useAccount();
  const { hasNft, isLoading: isLoadingNft } = useHasHammerNft();

  // Initialize Farcaster MiniApp SDK
  useEffect(() => {
    sdk.actions
      .ready()
      .then(() => sdk.actions.addMiniApp())
      .catch((e) => console.warn("SDK ready error:", e));
  }, []);

  return (
    <Router>
      {/* Show loading state if NFT check is still in progress */}
      {isLoadingNft ? (
        <div className="h-screen w-full flex items-center justify-center bg-gray-900 text-white">
          <p className="text-2xl">Loading your hammers...</p>
        </div>
      ) : (
        <Routes>
          {/* Wallet not connected */}
          {!isConnected && (
            <Route path="*" element={<ConnectWalletPage />} />
          )}

          {/* Wrong network */}
          {isConnected && chain?.id !== base.id && (
            <Route path="*" element={<WrongNetworkPage />} />
          )}

          {/* Connected, correct network */}
          {isConnected && chain?.id === base.id && (
            <>
              {hasNft ? (
                <Route path="/" element={<Layout />}>
                  <Route index element={<HomePage />} />
                  <Route path="game" element={<GamePage />} />
                  <Route path="info" element={<InfoPage />} />
                  <Route path="user" element={<UserPage />} />
                  <Route path="mint" element={<Navigate to="/game" />} />
                </Route>
              ) : (
                <>
                  <Route path="/" element={<MintPromptPage />} />
                  <Route path="mint" element={<MintPage />} />
                </>
              )}
              <Route path="*" element={<Navigate to="/" />} />
            </>
          )}
        </Routes>
      )}
    </Router>
  );
}

export default App;
