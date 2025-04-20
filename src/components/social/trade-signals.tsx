'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  TrendingUp,
  TrendingDown,
  Share2,
  Copy,
  AlertTriangle,
  CheckCircle2,
  Clock,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { useCopyTrading } from '@/contexts/copy-trading-context';
import { toast } from '@/components/ui/use-toast';

export interface TradeSignal {
  id: string;
  trader: {
    id: string;
    name: string;
    avatar: string;
  };
  symbol: string;
  side: 'long' | 'short';
  entryPrice: number;
  stopLoss: number;
  takeProfit: number;
  leverage: number;
  riskLevel: 'low' | 'medium' | 'high';
  status: 'active' | 'completed' | 'cancelled';
  pnl?: number;
  description: string;
  timestamp: number;
}

interface TradeSignalsProps {
  signals: TradeSignal[];
}

export default function TradeSignals({ signals }: TradeSignalsProps) {
  const [filter, setFilter] = useState<'all' | 'active' | 'completed'>('all');
  const { copyTrade } = useCopyTrading();

  const filteredSignals = signals.filter(signal => {
    if (filter === 'all') return true;
    if (filter === 'active') return signal.status === 'active';
    return signal.status === 'completed';
  });

  const getRiskColor = (risk: TradeSignal['riskLevel']) => {
    switch (risk) {
      case 'low':
        return 'bg-green-500/10 text-green-500';
      case 'medium':
        return 'bg-yellow-500/10 text-yellow-500';
      case 'high':
        return 'bg-red-500/10 text-red-500';
    }
  };

  const getStatusIcon = (status: TradeSignal['status']) => {
    switch (status) {
      case 'active':
        return <Clock className="h-4 w-4 text-blue-500" />;
      case 'completed':
        return <CheckCircle2 className="h-4 w-4 text-green-500" />;
      case 'cancelled':
        return <AlertTriangle className="h-4 w-4 text-yellow-500" />;
    }
  };

  const handleCopyTrade = async (signal: TradeSignal) => {
    try {
      const success = await copyTrade({
        id: signal.id,
        trader: signal.trader.id,
        symbol: signal.symbol,
        side: signal.side,
        entryPrice: signal.entryPrice,
        stopLoss: signal.stopLoss,
        takeProfit: signal.takeProfit,
        leverage: signal.leverage,
        size: 0, // This will be calculated based on settings
        timestamp: signal.timestamp,
      });

      if (success) {
        toast({
          title: "Trade Copied",
          description: `Successfully copied ${signal.side} ${signal.symbol} trade`,
        });
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to copy trade. Please try again.",
        variant: "destructive",
      });
    }
  };

  const handleShare = (signal: TradeSignal) => {
    // Implement share functionality
    toast({
      title: "Share",
      description: "Sharing functionality coming soon!",
    });
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-semibold">Trade Signals</h2>
        <div className="flex items-center space-x-2">
          <Button
            variant={filter === 'all' ? 'default' : 'outline'}
            size="sm"
            onClick={() => setFilter('all')}
          >
            All
          </Button>
          <Button
            variant={filter === 'active' ? 'default' : 'outline'}
            size="sm"
            onClick={() => setFilter('active')}
          >
            Active
          </Button>
          <Button
            variant={filter === 'completed' ? 'default' : 'outline'}
            size="sm"
            onClick={() => setFilter('completed')}
          >
            Completed
          </Button>
        </div>
      </div>

      <div className="grid gap-4">
        {filteredSignals.map((signal) => (
          <motion.div
            key={signal.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
          >
            <Card className="p-4">
              <div className="flex items-start justify-between">
                <div className="flex items-center space-x-3">
                  <Avatar className="h-10 w-10">
                    <AvatarImage src={signal.trader.avatar} alt={signal.trader.name} />
                    <AvatarFallback>{signal.trader.name.slice(0, 2).toUpperCase()}</AvatarFallback>
                  </Avatar>
                  <div>
                    <h3 className="text-sm font-medium">{signal.trader.name}</h3>
                    <p className="text-sm text-gray-500">
                      {new Date(signal.timestamp).toLocaleString()}
                    </p>
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={() => handleShare(signal)}
                  >
                    <Share2 className="h-4 w-4" />
                  </Button>
                  {signal.status === 'active' && (
                    <Button
                      variant="default"
                      size="sm"
                      onClick={() => handleCopyTrade(signal)}
                    >
                      <Copy className="h-4 w-4 mr-2" />
                      Copy Trade
                    </Button>
                  )}
                </div>
              </div>

              <div className="mt-4 grid gap-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <span className="text-lg font-semibold">{signal.symbol}</span>
                    <Badge variant="outline" className={signal.side === 'long' ? 'text-green-500' : 'text-red-500'}>
                      {signal.side.toUpperCase()}
                    </Badge>
                    <Badge className={getRiskColor(signal.riskLevel)}>
                      {signal.riskLevel.toUpperCase()} RISK
                    </Badge>
                  </div>
                  <div className="flex items-center space-x-2">
                    {getStatusIcon(signal.status)}
                    <span className="text-sm font-medium capitalize">{signal.status}</span>
                    {signal.pnl !== undefined && (
                      <span className={signal.pnl >= 0 ? 'text-green-500' : 'text-red-500'}>
                        {signal.pnl >= 0 ? '+' : ''}{signal.pnl}%
                      </span>
                    )}
                  </div>
                </div>

                <div className="grid grid-cols-3 gap-4 text-sm">
                  <div>
                    <span className="text-gray-500">Entry</span>
                    <p className="font-medium">${signal.entryPrice.toFixed(2)}</p>
                  </div>
                  {signal.stopLoss && (
                    <div>
                      <span className="text-gray-500">Stop Loss</span>
                      <p className="font-medium text-red-500">${signal.stopLoss.toFixed(2)}</p>
                    </div>
                  )}
                  {signal.takeProfit && (
                    <div>
                      <span className="text-gray-500">Take Profit</span>
                      <p className="font-medium text-green-500">${signal.takeProfit.toFixed(2)}</p>
                    </div>
                  )}
                </div>

                <div className="mt-2">
                  <p className="text-sm text-gray-600">{signal.description}</p>
                </div>
              </div>
            </Card>
          </motion.div>
        ))}

        {filteredSignals.length === 0 && (
          <div className="text-center py-8 text-gray-500">
            <TrendingUp className="h-12 w-12 mx-auto mb-2" />
            <p>No {filter} trade signals available</p>
          </div>
        )}
      </div>
    </div>
  );
} 