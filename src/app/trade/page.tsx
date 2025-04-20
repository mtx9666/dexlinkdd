'use client';

import { useState, useEffect } from 'react';
import dynamic from 'next/dynamic';
import { TokenSelector } from '@/components/trade/token-selector';
import { SwapInterface } from '@/components/trade/swap-interface';
import AIInsights from '@/components/trade/ai-insights';
import HFTBot from '@/components/trade/hft-bot';
import OrderBook from '@/components/trade/order-book';

const TradingViewChart = dynamic(() => import('@/components/trade/chart'), {
  ssr: false,
  loading: () => (
    <div className="h-[500px] w-full flex items-center justify-center bg-card rounded-lg">
      <div className="text-muted-foreground">Loading chart...</div>
    </div>
  ),
});

export default function TradePage() {
  const [selectedToken, setSelectedToken] = useState<string>('ETH');
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return (
      <div className="h-screen w-full flex items-center justify-center">
        <div className="text-muted-foreground">Loading...</div>
      </div>
    );
  }

  return (
    <div className="py-8">
      <h1 className="text-2xl font-bold mb-6">Trading Dashboard</h1>
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-12">
        {/* Left sidebar - Token selector and AI insights */}
        <div className="lg:col-span-3 space-y-6">
          <div className="rounded-lg bg-card p-4 shadow-sm">
            <TokenSelector
              selectedToken={selectedToken}
              onSelectToken={setSelectedToken}
            />
          </div>
          <div className="rounded-lg bg-card p-4 shadow-sm">
            <AIInsights symbol={selectedToken} />
          </div>
        </div>

        {/* Main content - Chart and Order Book */}
        <div className="lg:col-span-6 space-y-6">
          <div className="rounded-lg bg-card shadow-sm">
            <TradingViewChart symbol={selectedToken} />
          </div>
          <div className="rounded-lg bg-card p-4 shadow-sm">
            <OrderBook symbol={selectedToken} />
          </div>
        </div>

        {/* Right sidebar - Swap interface and HFT bot */}
        <div className="lg:col-span-3 space-y-6">
          <div className="rounded-lg bg-card p-4 shadow-sm">
            <SwapInterface selectedToken={selectedToken} />
          </div>
          <div className="rounded-lg bg-card p-4 shadow-sm">
            <HFTBot symbol={selectedToken} />
          </div>
        </div>
      </div>
    </div>
  );
} 