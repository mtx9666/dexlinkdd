'use client';

import { useState } from 'react';
import { Search } from 'lucide-react';
import { Button } from '@/components/ui/button';

const popularTokens = [
  { symbol: 'ETH', name: 'Ethereum', icon: '⟠' },
  { symbol: 'WBTC', name: 'Wrapped Bitcoin', icon: '₿' },
  { symbol: 'USDC', name: 'USD Coin', icon: '$' },
  { symbol: 'USDT', name: 'Tether', icon: '$' },
];

interface TokenSelectorProps {
  selectedToken: string;
  onSelectToken: (token: string) => void;
}

export function TokenSelector({ selectedToken, onSelectToken }: TokenSelectorProps) {
  const [searchQuery, setSearchQuery] = useState('');

  const filteredTokens = popularTokens.filter(
    (token) =>
      token.symbol.toLowerCase().includes(searchQuery.toLowerCase()) ||
      token.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="space-y-4">
      <h3 className="text-lg font-semibold">Select Token</h3>
      
      <div className="relative">
        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-500" />
        <input
          type="text"
          placeholder="Search tokens..."
          className="w-full rounded-md border border-gray-700 bg-background py-2 pl-10 pr-4 text-sm focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
      </div>

      <div className="space-y-2">
        {filteredTokens.map((token) => (
          <Button
            key={token.symbol}
            variant={selectedToken === token.symbol ? 'default' : 'outline'}
            className="w-full justify-start"
            onClick={() => onSelectToken(token.symbol)}
          >
            <span className="mr-2 text-lg">{token.icon}</span>
            <span className="mr-2 font-medium">{token.symbol}</span>
            <span className="text-sm text-gray-500">{token.name}</span>
          </Button>
        ))}
      </div>
    </div>
  );
} 