"use client";

import { WagmiProvider, createConfig, http } from "wagmi";
import { optimism, sepolia } from "wagmi/chains";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ConnectKitProvider, getDefaultConfig } from "connectkit";
import type { ReactNode } from "react";

const config = createConfig(
  getDefaultConfig({
    // Your dApps chains
    chains: [optimism, sepolia],
    transports: {
      [sepolia.id]: http(process.env.NEXT_PUBLIC_SEPOLIA_RPC_URL ?? ""),
      [optimism.id]: http(process.env.NEXT_PUBLIC_OPTIMISM_RPC_URL ?? ""),
    },

    // Required API Keys
    walletConnectProjectId:
      process.env.NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID ?? "",

    // Required App Info
    appName: "Candide Account Recovery",
    // Optional App Info
    appDescription: "App to recover Safe Wallets",
    appUrl: "http://localhost:3000",
    appIcon: "https://cdn-icons-png.flaticon.com/128/4064/4064205.png",
  })
);

const queryClient = new QueryClient();

export const Web3Provider = ({ children }: { children: ReactNode }) => {
  return (
    <WagmiProvider config={config}>
      <QueryClientProvider client={queryClient}>
        <ConnectKitProvider>{children}</ConnectKitProvider>
      </QueryClientProvider>
    </WagmiProvider>
  );
};
