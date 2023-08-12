import './globals.css';
import "@rainbow-me/rainbowkit/styles.css";
import { RainbowKitProvider } from "@rainbow-me/rainbowkit";
import * as React from "react";
import * as ReactDOM from "react-dom/client";
import { ApolloProvider } from "@apollo/client";
import client from "./components/apollo/apollo"
import { WagmiConfig } from "wagmi";

import { App } from "./App";
import { chains, config } from "./wagmi";

/**
 * Root providers and initialization of app
 * @see https://reactjs.org/docs/strict-mode.html
 * @see https://wagmi.sh/react/WagmiConfig
 * @see https://www.rainbowkit.com/docs/installation
 */
ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
      <WagmiConfig config={config}>
        <RainbowKitProvider chains={chains}>
          <ApolloProvider client={client}>
            <App />
          </ApolloProvider>
        </RainbowKitProvider>
      </WagmiConfig>
  </React.StrictMode>
);
