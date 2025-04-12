'use client';

import { useState } from 'react';
import { useAccount } from 'wagmi';
import { Button } from '@/components/ui/button';
import { WalletFallback } from '@/components/ui/wallet-fallback';

export default function PortfolioPage() {
  const { isConnected, address } = useAccount();
  const [holdings, setHoldings] = useState([
    { symbol: 'ETH', balance: '0.0', value: '$0.00' },
    { symbol: 'USDC', balance: '0.0', value: '$0.00' },
  ]);

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="mb-8 text-3xl font-bold">Portfolio</h1>
      
      {!isConnected ? (
        <WalletFallback message="Connect your wallet to view your portfolio and track your performance." />
      ) : (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {/* Portfolio Summary Card */}
          <div className="col-span-full rounded-lg bg-card p-6">
            <h2 className="mb-4 text-xl font-semibold">Portfolio Summary</h2>
            <div className="grid gap-4 md:grid-cols-3">
              <div className="rounded-lg bg-background p-4">
                <p className="text-sm text-gray-400">Total Value</p>
                <p className="text-2xl font-bold">$0.00</p>
              </div>
              <div className="rounded-lg bg-background p-4">
                <p className="text-sm text-gray-400">24h Change</p>
                <p className="text-2xl font-bold text-success">+0.00%</p>
              </div>
              <div className="rounded-lg bg-background p-4">
                <p className="text-sm text-gray-400">Address</p>
                <p className="truncate text-sm font-mono">{address}</p>
              </div>
            </div>
          </div>

          {/* Holdings Table */}
          <div className="col-span-full rounded-lg bg-card p-6">
            <h2 className="mb-4 text-xl font-semibold">Holdings</h2>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-gray-800">
                    <th className="py-3 text-left text-sm font-medium text-gray-400">Asset</th>
                    <th className="py-3 text-right text-sm font-medium text-gray-400">Balance</th>
                    <th className="py-3 text-right text-sm font-medium text-gray-400">Value</th>
                    <th className="py-3 text-right text-sm font-medium text-gray-400">24h Change</th>
                  </tr>
                </thead>
                <tbody>
                  {holdings.map((token) => (
                    <tr key={token.symbol} className="border-b border-gray-800">
                      <td className="py-4">
                        <div className="flex items-center">
                          <span className="mr-2 text-lg">{token.symbol === 'ETH' ? '⟠' : '$'}</span>
                          <span className="font-medium">{token.symbol}</span>
                        </div>
                      </td>
                      <td className="py-4 text-right">{token.balance}</td>
                      <td className="py-4 text-right">{token.value}</td>
                      <td className="py-4 text-right text-success">+0.00%</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Recent Transactions */}
          <div className="col-span-full rounded-lg bg-card p-6">
            <h2 className="mb-4 text-xl font-semibold">Recent Transactions</h2>
            <div className="flex items-center justify-center rounded-lg bg-background p-8 text-center">
              <p className="text-gray-400">No recent transactions</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
} 