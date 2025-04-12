'use client';

import { useState } from 'react';
import dynamic from 'next/dynamic';
import { TokenSelector } from '@/components/trade/token-selector';
import { SwapInterface } from '@/components/trade/swap-interface';
import { BotLogs } from '@/components/trade/bot-logs';

const TradingViewChart = dynamic(() => import('@/components/trade/chart'), {
  ssr: false,
});

export default function TradePage() {
  const [selectedToken, setSelectedToken] = useState<string>('ETH');

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-12">
        {/* Left sidebar - Token selector and bot insights */}
        <div className="lg:col-span-3">
          <div className="rounded-lg bg-card p-4">
            <TokenSelector
              selectedToken={selectedToken}
              onSelectToken={setSelectedToken}
            />
          </div>
          <div className="mt-6 rounded-lg bg-card p-4">
            <h3 className="mb-4 text-lg font-semibold">AI Insights</h3>
            {/* Add AI insights component here */}
          </div>
        </div>

        {/* Main content - Chart */}
        <div className="lg:col-span-6">
          <div className="rounded-lg bg-card">
            <TradingViewChart symbol={selectedToken} />
          </div>
        </div>

        {/* Right sidebar - Swap interface */}
        <div className="lg:col-span-3">
          <div className="rounded-lg bg-card p-4">
            <SwapInterface selectedToken={selectedToken} />
          </div>
        </div>

        {/* Bottom drawer - Bot logs */}
        <div className="lg:col-span-12">
          <div className="rounded-lg bg-card p-4">
            <BotLogs />
          </div>
        </div>
      </div>
    </div>
  );
} 