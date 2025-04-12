'use client';

import { Button } from '@/components/ui/button';
import { ConnectButton } from '@rainbow-me/rainbowkit';
import { useState, useEffect } from 'react';

interface WalletFallbackProps {
  children?: React.ReactNode;
  message?: string;
}

export function WalletFallback({ 
  children, 
  message = "Connect your wallet to access this feature" 
}: WalletFallbackProps) {
  const [mounted, setMounted] = useState(false);

  // Only show the UI after mounting to avoid hydration errors
  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return <div className="min-h-[200px] flex items-center justify-center">
      <div className="animate-pulse text-gray-500">Loading...</div>
    </div>;
  }

  return (
    <div className="flex flex-col items-center justify-center p-8 text-center">
      <div className="mb-6 text-gray-400">
        <svg 
          xmlns="http://www.w3.org/2000/svg" 
          width="48" 
          height="48" 
          viewBox="0 0 24 24" 
          fill="none" 
          stroke="currentColor" 
          strokeWidth="2" 
          strokeLinecap="round" 
          strokeLinejoin="round"
        >
          <rect x="2" y="4" width="20" height="16" rx="2" />
          <path d="M12 8v8" />
          <path d="M8 12h8" />
        </svg>
      </div>
      <h3 className="mb-2 text-xl font-semibold">Wallet Connection Required</h3>
      <p className="mb-6 max-w-md text-gray-400">{message}</p>
      <ConnectButton />
    </div>
  );
} 