'use client';

import { useState, useEffect } from 'react';
import { ArrowDownUp, AlertCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useAccount, useBalance } from 'wagmi';
import { TokenSelector } from './token-selector';

interface SwapInterfaceProps {
  selectedToken: string;
}

export function SwapInterface({ selectedToken }: SwapInterfaceProps) {
  const { isConnected, address } = useAccount();
  const [fromToken, setFromToken] = useState('ETH');
  const [fromAmount, setFromAmount] = useState('');
  const [toAmount, setToAmount] = useState('');
  const [slippage, setSlippage] = useState('0.5');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showFromTokenSelector, setShowFromTokenSelector] = useState(false);
  const [showToTokenSelector, setShowToTokenSelector] = useState(false);
  
  // Get ETH balance
  const { data: ethBalance } = useBalance({
    address,
    watch: true,
  });

  // Get token balance (placeholder - implement with actual token contract)
  const [tokenBalance, setTokenBalance] = useState('0.0');

  // Update "to" amount when "from" amount changes (placeholder - implement with actual price calculation)
  useEffect(() => {
    if (fromAmount && !isNaN(parseFloat(fromAmount))) {
      // This is a placeholder - replace with actual price calculation
      const mockPrice = fromToken === 'ETH' ? 1800 : 1;
      const calculatedAmount = (parseFloat(fromAmount) * mockPrice).toFixed(6);
      setToAmount(calculatedAmount);
    } else {
      setToAmount('');
    }
  }, [fromAmount, fromToken]);

  const handleSwap = async () => {
    if (!isConnected) {
      setError('Please connect your wallet first');
      return;
    }

    if (!fromAmount || parseFloat(fromAmount) <= 0) {
      setError('Please enter a valid amount');
      return;
    }

    if (fromToken === 'ETH' && ethBalance && parseFloat(fromAmount) > parseFloat(ethBalance.formatted)) {
      setError('Insufficient ETH balance');
      return;
    }

    try {
      setIsLoading(true);
      setError(null);
      
      // Implement actual swap logic here
      console.log('Swapping tokens...', {
        fromToken,
        fromAmount,
        toToken: selectedToken,
        toAmount,
        slippage,
      });
      
      // Simulate a delay
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Reset form after successful swap
      setFromAmount('');
      setToAmount('');
      
      // Show success message or notification
      alert('Swap executed successfully!');
    } catch (err) {
      console.error('Swap error:', err);
      setError('Failed to execute swap. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleFromAmountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    if (value === '' || /^\d*\.?\d*$/.test(value)) {
      setFromAmount(value);
    }
  };

  const handleToAmountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    if (value === '' || /^\d*\.?\d*$/.test(value)) {
      setToAmount(value);
      // This is a placeholder - implement with actual price calculation
      if (value && !isNaN(parseFloat(value))) {
        const mockPrice = fromToken === 'ETH' ? 1800 : 1;
        const calculatedAmount = (parseFloat(value) / mockPrice).toFixed(6);
        setFromAmount(calculatedAmount);
      } else {
        setFromAmount('');
      }
    }
  };

  const toggleTokens = () => {
    setFromToken(selectedToken);
    // This would need to be handled by the parent component
    // For now, we'll just log it
    console.log('Switching tokens');
  };

  return (
    <div className="space-y-4">
      <h3 className="text-lg font-semibold">Swap Tokens</h3>

      {error && (
        <div className="flex items-center rounded-lg bg-destructive/10 p-3 text-destructive">
          <AlertCircle className="mr-2 h-4 w-4" />
          <span className="text-sm">{error}</span>
        </div>
      )}

      {/* From token */}
      <div className="rounded-lg border border-gray-700 p-4">
        <div className="flex items-center justify-between">
          <span className="text-sm text-gray-500">From</span>
          <span className="text-sm text-gray-500">
            Balance: {fromToken === 'ETH' ? ethBalance?.formatted || '0.0' : tokenBalance}
          </span>
        </div>
        <div className="mt-2 flex items-center gap-2">
          <input
            type="text"
            className="w-full bg-transparent text-2xl outline-none"
            placeholder="0.0"
            value={fromAmount}
            onChange={handleFromAmountChange}
          />
          <Button 
            variant="outline" 
            className="min-w-[100px] justify-between"
            onClick={() => setShowFromTokenSelector(true)}
          >
            <span>{fromToken}</span>
            <span>▼</span>
          </Button>
        </div>
      </div>

      {/* Swap button */}
      <div className="flex justify-center">
        <Button 
          variant="ghost" 
          size="icon" 
          className="rounded-full"
          onClick={toggleTokens}
        >
          <ArrowDownUp className="h-4 w-4" />
        </Button>
      </div>

      {/* To token */}
      <div className="rounded-lg border border-gray-700 p-4">
        <div className="flex items-center justify-between">
          <span className="text-sm text-gray-500">To</span>
          <span className="text-sm text-gray-500">Balance: 0.00</span>
        </div>
        <div className="mt-2 flex items-center gap-2">
          <input
            type="text"
            className="w-full bg-transparent text-2xl outline-none"
            placeholder="0.0"
            value={toAmount}
            onChange={handleToAmountChange}
          />
          <Button 
            variant="outline" 
            className="min-w-[100px] justify-between"
            onClick={() => setShowToTokenSelector(true)}
          >
            <span>{selectedToken}</span>
            <span>▼</span>
          </Button>
        </div>
      </div>

      {/* Slippage settings */}
      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <span className="text-sm text-gray-500">Slippage Tolerance</span>
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              className={slippage === '0.5' ? 'bg-primary text-white' : ''}
              onClick={() => setSlippage('0.5')}
            >
              0.5%
            </Button>
            <Button
              variant="outline"
              size="sm"
              className={slippage === '1.0' ? 'bg-primary text-white' : ''}
              onClick={() => setSlippage('1.0')}
            >
              1.0%
            </Button>
            <input
              type="number"
              className="w-16 rounded-md border border-gray-700 bg-background px-2 py-1 text-sm"
              value={slippage}
              onChange={(e) => setSlippage(e.target.value)}
            />
            <span className="text-sm">%</span>
          </div>
        </div>
      </div>

      {/* Swap button */}
      <Button
        className="w-full"
        size="lg"
        disabled={!isConnected || !fromAmount || !toAmount || isLoading}
        onClick={handleSwap}
      >
        {isLoading ? 'Processing...' : !isConnected ? 'Connect Wallet' : 'Swap'}
      </Button>

      {/* Token selectors (modals) */}
      {showFromTokenSelector && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
          <div className="w-full max-w-md rounded-lg bg-card p-6">
            <div className="mb-4 flex items-center justify-between">
              <h3 className="text-lg font-semibold">Select Token</h3>
              <Button variant="ghost" size="sm" onClick={() => setShowFromTokenSelector(false)}>
                ✕
              </Button>
            </div>
            <TokenSelector
              selectedToken={fromToken}
              onSelectToken={(token) => {
                setFromToken(token);
                setShowFromTokenSelector(false);
              }}
            />
          </div>
        </div>
      )}

      {showToTokenSelector && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
          <div className="w-full max-w-md rounded-lg bg-card p-6">
            <div className="mb-4 flex items-center justify-between">
              <h3 className="text-lg font-semibold">Select Token</h3>
              <Button variant="ghost" size="sm" onClick={() => setShowToTokenSelector(false)}>
                ✕
              </Button>
            </div>
            <TokenSelector
              selectedToken={selectedToken}
              onSelectToken={(token) => {
                // This would need to be handled by the parent component
                console.log('Selected token:', token);
                setShowToTokenSelector(false);
              }}
            />
          </div>
        </div>
      )}
    </div>
  );
} 