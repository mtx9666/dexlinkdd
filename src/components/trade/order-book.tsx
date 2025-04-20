'use client';

import { useState, useEffect, useCallback } from 'react';
import { motion } from 'framer-motion';
import {
  Clock,
  CheckCircle2,
  XCircle,
  TrendingUp,
  TrendingDown,
  DollarSign,
  Timer,
  BarChart2,
  ArrowUpCircle,
  ArrowDownCircle,
  Scale,
  Loader2,
} from 'lucide-react';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { marketApi, MarketDepth, Trade } from '@/lib/api';

interface Position {
  id: string;
  symbol: string;
  type: 'long' | 'short';
  size: number;
  leverage: number;
  entryPrice: number;
  currentPrice: number;
  pnl: number;
  timestamp: number;
}

interface OrderFlow {
  price: number;
  size: number;
  type: 'buy' | 'sell';
  premium: number;
  timestamp?: number;
}

interface OrderBookProps {
  symbol: string;
}

export default function OrderBook({ symbol }: OrderBookProps) {
  const [mounted, setMounted] = useState(false);
  const [positions, setPositions] = useState<Position[]>([]);
  const [trades, setTrades] = useState<Trade[]>([]);
  const [orderFlow, setOrderFlow] = useState<OrderFlow[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [wsConnected, setWsConnected] = useState(false);

  // Transform market depth into order flow
  const transformMarketDepth = useCallback((depth: MarketDepth): OrderFlow[] => {
    return [
      ...depth.asks.map(([price, size]) => ({
        price,
        size,
        type: 'sell' as const,
        premium: 0,
        timestamp: Date.now(),
      })),
      ...depth.bids.map(([price, size]) => ({
        price,
        size,
        type: 'buy' as const,
        premium: 0,
        timestamp: Date.now(),
      })),
    ].sort((a, b) => b.price - a.price);
  }, []);

  // Fetch market data
  const fetchMarketData = useCallback(async () => {
    try {
      setIsLoading(true);
      setError(null);

      // Fetch market depth
      const depth = await marketApi.getMarketDepth(symbol);
      setOrderFlow(transformMarketDepth(depth));

      // Fetch recent trades
      const recentTrades = await marketApi.getRecentTrades(symbol);
      setTrades(recentTrades);

    } catch (err) {
      console.error('Error fetching market data:', err);
      setError('Failed to load market data. Please try again.');
    } finally {
      setIsLoading(false);
    }
  }, [symbol, transformMarketDepth]);

  // Handle WebSocket connection
  useEffect(() => {
    const wsUrl = process.env.NEXT_PUBLIC_WS_URL;
    if (!wsUrl) {
      console.error('WebSocket URL not configured');
      return;
    }

    const ws = new WebSocket(`${wsUrl}/market`);
    
    ws.onopen = () => {
      setWsConnected(true);
      ws.send(JSON.stringify({ type: 'subscribe', symbol }));
    };

    ws.onclose = () => {
      setWsConnected(false);
    };
    
    ws.onmessage = (event) => {
      try {
        const data = JSON.parse(event.data);
        
        if (data.type === 'depth') {
          setOrderFlow(prev => {
            const newOrders = transformMarketDepth(data.depth);
            return newOrders.map(order => ({
              ...order,
              premium: calculatePremium(order.price, prev),
            }));
          });
        } else if (data.type === 'trade') {
          setTrades(prev => [data.trade, ...prev].slice(0, 50));
        }
      } catch (err) {
        console.error('Error processing WebSocket message:', err);
      }
    };

    ws.onerror = (error) => {
      console.error('WebSocket error:', error);
      setError('WebSocket connection error');
    };

    return () => {
      if (ws.readyState === WebSocket.OPEN) {
        ws.close();
      }
    };
  }, [symbol, transformMarketDepth]);

  // Calculate price premium (difference from market price)
  const calculatePremium = (price: number, orders: OrderFlow[]): number => {
    if (orders.length === 0) return 0;
    const marketPrice = orders[Math.floor(orders.length / 2)].price;
    return ((price - marketPrice) / marketPrice) * 100;
  };

  useEffect(() => {
    setMounted(true);
    fetchMarketData();
  }, [fetchMarketData]);

  // Don't render until after hydration
  if (!mounted) return null;

  if (isLoading) {
    return (
      <Card className="p-4">
        <div className="flex items-center justify-center h-48">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      </Card>
    );
  }

  if (error) {
    return (
      <Card className="p-4">
        <div className="flex flex-col items-center justify-center h-48 text-center">
          <p className="text-destructive mb-2">{error}</p>
          <Button onClick={fetchMarketData}>
            Retry
          </Button>
        </div>
      </Card>
    );
  }

  const maxSize = Math.max(...orderFlow.map(order => order.size));

  return (
    <Card className="p-4">
      <Tabs defaultValue="positions">
        <div className="flex items-center justify-between mb-4">
          <TabsList className="grid w-[300px] grid-cols-3">
            <TabsTrigger value="positions" className="text-xs">
              Active Positions
            </TabsTrigger>
            <TabsTrigger value="history" className="text-xs">
              Trade History
            </TabsTrigger>
            <TabsTrigger value="depth" className="text-xs">
              Market Depth
            </TabsTrigger>
          </TabsList>
          <div className="flex items-center space-x-2">
            <Badge variant="outline" className="text-xs">
              <DollarSign className="h-3 w-3 mr-1" />
              Balance: $25,000
            </Badge>
            <Badge variant="outline" className="text-xs">
              <BarChart2 className="h-3 w-3 mr-1" />
              PnL: +2.8%
            </Badge>
            {wsConnected && (
              <Badge variant="outline" className="text-xs text-green-500">
                <CheckCircle2 className="h-3 w-3 mr-1" />
                Live
              </Badge>
            )}
          </div>
        </div>

        <TabsContent value="positions" className="mt-0">
          <div className="space-y-2">
            {positions.map((position) => (
              <motion.div
                key={position.id}
                initial={{ opacity: 0, y: 5 }}
                animate={{ opacity: 1, y: 0 }}
                className="flex items-center justify-between py-2 border-b border-border last:border-0"
              >
                <div className="flex items-center space-x-3">
                  <Badge
                    variant={position.type === 'long' ? 'default' : 'destructive'}
                    className="capitalize"
                  >
                    {position.type === 'long' ? (
                      <TrendingUp className="h-3 w-3 mr-1" />
                    ) : (
                      <TrendingDown className="h-3 w-3 mr-1" />
                    )}
                    {position.type}
                  </Badge>
                  <div className="text-sm">
                    <p className="font-medium">{position.symbol}</p>
                    <p className="text-muted-foreground text-xs">
                      Size: {position.size} × {position.leverage}x
                    </p>
                  </div>
                </div>
                <div className="text-right">
                  <p className={`font-medium ${position.pnl >= 0 ? 'text-green-500' : 'text-red-500'}`}>
                    {position.pnl >= 0 ? '+' : ''}{position.pnl.toFixed(2)}%
                  </p>
                  <p className="text-muted-foreground text-xs">
                    Entry: ${position.entryPrice.toFixed(2)}
                  </p>
                </div>
              </motion.div>
            ))}
            {positions.length === 0 && (
              <div className="text-center py-8 text-muted-foreground">
                No active positions
              </div>
            )}
          </div>
        </TabsContent>

        <TabsContent value="history" className="mt-0">
          <div className="space-y-2">
            {trades.map((trade) => (
              <motion.div
                key={trade.id}
                initial={{ opacity: 0, y: 5 }}
                animate={{ opacity: 1, y: 0 }}
                className="flex items-center justify-between py-2 border-b border-border last:border-0"
              >
                <div className="flex items-center space-x-3">
                  <Badge
                    variant={trade.type === 'long' ? 'default' : 'destructive'}
                    className="capitalize"
                  >
                    {trade.type === 'long' ? (
                      <ArrowUpCircle className="h-3 w-3 mr-1" />
                    ) : (
                      <ArrowDownCircle className="h-3 w-3 mr-1" />
                    )}
                    {trade.type}
                  </Badge>
                  <div className="text-sm">
                    <p className="font-medium">{trade.symbol}</p>
                    <p className="text-muted-foreground text-xs">
                      Size: ${(trade.size * trade.price).toFixed(2)}
                    </p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="font-medium">
                    ${trade.price.toFixed(2)}
                  </p>
                  {trade.pnl !== undefined && (
                    <p className={`text-xs ${trade.pnl >= 0 ? 'text-green-500' : 'text-red-500'}`}>
                      {trade.pnl >= 0 ? '+' : ''}{trade.pnl.toFixed(2)}%
                    </p>
                  )}
                </div>
              </motion.div>
            ))}
            {trades.length === 0 && (
              <div className="text-center py-8 text-muted-foreground">
                No trade history
              </div>
            )}
          </div>
        </TabsContent>

        <TabsContent value="depth" className="mt-0">
          <div className="space-y-1">
            {orderFlow.map((order, index) => (
              <motion.div
                key={`${order.price}-${order.size}-${index}`}
                initial={{ opacity: 0, x: order.type === 'buy' ? -5 : 5 }}
                animate={{ opacity: 1, x: 0 }}
                className="flex items-center"
              >
                <div
                  className={`absolute h-6 opacity-10 ${
                    order.type === 'buy' ? 'bg-green-500' : 'bg-red-500'
                  }`}
                  style={{
                    width: `${(order.size / maxSize) * 100}%`,
                    left: order.type === 'buy' ? 0 : 'auto',
                    right: order.type === 'sell' ? 0 : 'auto',
                  }}
                />
                <div className="flex items-center justify-between w-full relative z-10 px-2">
                  <div className="flex items-center space-x-2">
                    <Badge
                      variant={order.type === 'buy' ? 'default' : 'destructive'}
                      className="w-16 justify-center"
                    >
                      {order.type === 'buy' ? 'BUY' : 'SELL'}
                    </Badge>
                    <span className="text-sm font-medium">
                      ${order.price.toFixed(2)}
                    </span>
                  </div>
                  <div className="text-right">
                    <span className="text-sm">
                      {order.size.toFixed(4)}
                    </span>
                    {order.premium !== 0 && (
                      <span className={`text-xs ml-2 ${
                        order.premium > 0 ? 'text-green-500' : 'text-red-500'
                      }`}>
                        {order.premium > 0 ? '+' : ''}{order.premium.toFixed(2)}%
                      </span>
                    )}
                  </div>
                </div>
              </motion.div>
            ))}
            {orderFlow.length === 0 && (
              <div className="text-center py-8 text-muted-foreground">
                No market depth data
              </div>
            )}
          </div>
        </TabsContent>
      </Tabs>
    </Card>
  );
} 