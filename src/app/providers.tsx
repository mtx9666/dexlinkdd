'use client';

import { getDefaultWallets, RainbowKitProvider } from '@rainbow-me/rainbowkit';
import { configureChains, createConfig, WagmiConfig } from 'wagmi';
import { mainnet, sepolia } from 'wagmi/chains';
import { publicProvider } from 'wagmi/providers/public';
import { ThemeProvider } from 'next-themes';

// Configure chains and providers
const { chains, publicClient } = configureChains(
  [mainnet, sepolia],
  [publicProvider()]
);

// Check if WalletConnect project ID is available
const projectId = process.env.NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID;
if (!projectId) {
  console.warn('WalletConnect project ID is not set. Some wallet connections may not work properly.');
}

// Configure wallet connectors
const { connectors } = getDefaultWallets({
  appName: 'Dexlink Social Trading',
  projectId: projectId || 'YOUR_PROJECT_ID', // Use a fallback for development
  chains,
});

// Create wagmi config
const wagmiConfig = createConfig({
  autoConnect: true,
  connectors,
  publicClient,
});

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <WagmiConfig config={wagmiConfig}>
      <RainbowKitProvider 
        chains={chains}
        coolMode
        showRecentTransactions={true}
        initialChain={sepolia} // Use testnet by default for development
      >
        <ThemeProvider attribute="class" defaultTheme="dark" enableSystem>
          {children}
        </ThemeProvider>
      </RainbowKitProvider>
    </WagmiConfig>
  );
} 