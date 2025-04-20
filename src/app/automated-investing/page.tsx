'use client';

import { useState, useEffect } from 'react';
import { useAccount } from 'wagmi';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Slider } from '@/components/ui/slider';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from '@/components/ui/use-toast';
import { Loader2 } from 'lucide-react';

interface CryptoAllocation {
  symbol: string;
  name: string;
  percentage: number;
  price: number;
  marketCap: number;
}

const TOP_CRYPTOS = [
  { symbol: 'BTC', name: 'Bitcoin', marketCap: 1200000000000 },
  { symbol: 'ETH', name: 'Ethereum', marketCap: 400000000000 },
  { symbol: 'BNB', name: 'Binance Coin', marketCap: 80000000000 },
  { symbol: 'SOL', name: 'Solana', marketCap: 40000000000 },
  { symbol: 'XRP', name: 'Ripple', marketCap: 30000000000 },
  { symbol: 'ADA', name: 'Cardano', marketCap: 15000000000 },
  { symbol: 'AVAX', name: 'Avalanche', marketCap: 12000000000 },
  { symbol: 'DOT', name: 'Polkadot', marketCap: 10000000000 },
];

export default function AutomatedInvesting() {
  const { address, isConnected } = useAccount();
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const [totalInvestment, setTotalInvestment] = useState<number>(0);
  const [allocations, setAllocations] = useState<CryptoAllocation[]>(
    TOP_CRYPTOS.map(crypto => ({
      ...crypto,
      percentage: 100 / TOP_CRYPTOS.length,
      price: 0,
    }))
  );

  // Fetch current prices
  useEffect(() => {
    const fetchPrices = async () => {
      try {
        const response = await fetch(
          `https://api.coingecko.com/api/v3/simple/price?ids=${TOP_CRYPTOS.map(c => c.symbol.toLowerCase()).join(',')}&vs_currencies=usd`
        );
        const data = await response.json();
        
        setAllocations(prev => 
          prev.map(allocation => ({
            ...allocation,
            price: data[allocation.symbol.toLowerCase()]?.usd || 0
          }))
        );
      } catch (error) {
        console.error('Error fetching prices:', error);
        toast({
          title: 'Error',
          description: 'Failed to fetch current prices',
          variant: 'destructive',
        });
      }
    };

    fetchPrices();
    const interval = setInterval(fetchPrices, 60000); // Update every minute
    return () => clearInterval(interval);
  }, []);

  const handlePercentageChange = (index: number, value: number) => {
    const newAllocations = [...allocations];
    newAllocations[index] = { ...newAllocations[index], percentage: value };
    
    // Normalize percentages to ensure they sum to 100%
    const total = newAllocations.reduce((sum, alloc) => sum + alloc.percentage, 0);
    if (total !== 100) {
      const factor = 100 / total;
      newAllocations.forEach(alloc => {
        alloc.percentage = Math.round(alloc.percentage * factor * 100) / 100;
      });
    }
    
    setAllocations(newAllocations);
  };

  const handleInvestmentChange = (value: string) => {
    setTotalInvestment(Number(value) || 0);
  };

  const calculateAllocationAmount = (percentage: number) => {
    return (totalInvestment * percentage) / 100;
  };

  const handleStartAutomation = async () => {
    if (!isConnected) {
      toast({
        title: 'Wallet Not Connected',
        description: 'Please connect your wallet to start automated investing',
        variant: 'destructive',
      });
      return;
    }

    setIsLoading(true);
    try {
      // Here you would implement the actual investment logic
      // This is a placeholder for the actual implementation
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      toast({
        title: 'Success',
        description: 'Automated investing strategy has been activated',
      });
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to start automated investing',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="container mx-auto py-8">
      <h1 className="text-3xl font-bold mb-8">Automated Conservative Investing</h1>
      
      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Investment Amount</CardTitle>
            <CardDescription>Enter the total amount you want to invest</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center space-x-4">
                <Label htmlFor="investment">Total Investment (USD)</Label>
                <Input
                  id="investment"
                  type="number"
                  value={totalInvestment || ''}
                  onChange={(e) => handleInvestmentChange(e.target.value)}
                  placeholder="Enter amount"
                  className="w-48"
                />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Portfolio Allocation</CardTitle>
            <CardDescription>Adjust the percentage allocation for each cryptocurrency</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-6">
              {allocations.map((allocation, index) => (
                <div key={allocation.symbol} className="space-y-2">
                  <div className="flex justify-between">
                    <Label>{allocation.name} ({allocation.symbol})</Label>
                    <span className="text-sm text-muted-foreground">
                      {allocation.percentage.toFixed(1)}% (${calculateAllocationAmount(allocation.percentage).toFixed(2)})
                    </span>
                  </div>
                  <Slider
                    value={[allocation.percentage]}
                    onValueChange={([value]) => handlePercentageChange(index, value)}
                    min={0}
                    max={100}
                    step={0.1}
                  />
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="mt-8">
        <Card>
          <CardHeader>
            <CardTitle>Investment Summary</CardTitle>
            <CardDescription>Review your investment strategy before starting</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                {allocations.map((allocation) => (
                  <div key={allocation.symbol} className="p-4 border rounded-lg">
                    <h3 className="font-semibold">{allocation.name}</h3>
                    <p className="text-sm text-muted-foreground">{allocation.symbol}</p>
                    <p className="mt-2">
                      <span className="font-medium">Allocation:</span> {allocation.percentage.toFixed(1)}%
                    </p>
                    <p>
                      <span className="font-medium">Amount:</span> ${calculateAllocationAmount(allocation.percentage).toFixed(2)}
                    </p>
                    <p>
                      <span className="font-medium">Current Price:</span> ${allocation.price.toFixed(2)}
                    </p>
                  </div>
                ))}
              </div>
              
              <div className="flex justify-end mt-6">
                <Button
                  onClick={handleStartAutomation}
                  disabled={!isConnected || isLoading || totalInvestment <= 0}
                  className="w-full md:w-auto"
                >
                  {isLoading ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Starting Automation...
                    </>
                  ) : (
                    'Start Automated Investing'
                  )}
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
} 