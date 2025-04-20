'use client';

import { ThemeProvider } from 'next-themes';
import { RainbowKitProvider, getDefaultWallets, darkTheme, connectorsForWallets } from '@rainbow-me/rainbowkit';
import { configureChains, createConfig, WagmiConfig } from 'wagmi';
import { mainnet, sepolia } from 'wagmi/chains';
import { publicProvider } from 'wagmi/providers/public';
import { phantomWallet } from '@rainbow-me/rainbowkit/wallets';
import '@rainbow-me/rainbowkit/styles.css';
import { useState, useEffect } from 'react';
import { WalletProvider } from "@/contexts/wallet-context"

// Configure chains and providers
const { chains, publicClient } = configureChains(
  [mainnet, sepolia],
  [publicProvider()]
);

// Configure wallet connectors
const { wallets } = getDefaultWallets({
  appName: 'Dexlink',
  projectId: process.env.NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID || 'development_test_project_id_123456789',
  chains,
});

// Add additional wallets
const connectors = connectorsForWallets([
  ...wallets,
  {
    groupName: 'Other',
    wallets: [
      phantomWallet({ chains }),
    ],
  },
]);

// Create wagmi config
const config = createConfig({
  autoConnect: true,
  publicClient,
  connectors,
});

export function Providers({ children }: { children: React.ReactNode }) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return (
      <div className="h-screen w-full flex items-center justify-center bg-background text-foreground">
        <div className="text-muted-foreground">Loading...</div>
      </div>
    );
  }

  return (
    <WagmiConfig config={config}>
      <ThemeProvider
        attribute="class"
        defaultTheme="system"
        enableSystem
        disableTransitionOnChange
      >
        <WalletProvider>
          <RainbowKitProvider
            chains={chains}
            coolMode
            showRecentTransactions={true}
            theme={darkTheme()}
          >
            {children}
          </RainbowKitProvider>
        </WalletProvider>
      </ThemeProvider>
    </WagmiConfig>
  );
} 