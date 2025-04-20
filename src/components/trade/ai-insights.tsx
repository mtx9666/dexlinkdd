'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  TrendingUp,
  TrendingDown,
  AlertTriangle,
  Brain,
  LineChart,
  Activity,
  Zap,
  Layers,
  Gauge,
  HelpCircle,
  Info
} from 'lucide-react';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { marketApi, MarketAnalysis } from '@/lib/api';
import { Button } from '@/components/ui/button';

interface MarketSentiment {
  score: number; // 0-100
  trend: 'bullish' | 'bearish' | 'neutral';
  confidence: number; // 0-100
}

interface TechnicalAnalysis {
  indicators: {
    name: string;
    value: string;
    signal: 'buy' | 'sell' | 'neutral' | 'bullish';
  }[];
  summary: string;
}

interface WyckoffAnalysis {
  phase: 'accumulation' | 'markup' | 'distribution' | 'markdown' | 'neutral';
  progress: number; // 0-100
  description: string;
  keyLevels: {
    support: number;
    resistance: number;
  };
}

interface FibonacciLevels {
  levels: {
    name: string;
    value: number;
    type: 'support' | 'resistance' | 'extension';
  }[];
  currentPrice: number;
}

interface AIInsightsProps {
  symbol: string;
}

export default function AIInsights({ symbol }: AIInsightsProps) {
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [analysis, setAnalysis] = useState<MarketAnalysis | null>(null);

  useEffect(() => {
    const fetchAnalysis = async () => {
      try {
        setIsLoading(true);
        setError(null);
        const data = await marketApi.getMarketAnalysis(symbol);
        setAnalysis(data);
      } catch (err) {
        console.error('Error fetching market analysis:', err);
        setError('Failed to load market analysis. Please try again.');
      } finally {
        setIsLoading(false);
      }
    };

    fetchAnalysis();

    // Set up WebSocket connection for real-time updates
    const wsUrl = process.env.NEXT_PUBLIC_WS_URL || 'ws://localhost:3001';
    let ws: WebSocket | null = null;
    let reconnectTimeout: NodeJS.Timeout;

    const connectWebSocket = () => {
      try {
        ws = new WebSocket(`${wsUrl}/analysis`);
        
        ws.onopen = () => {
          console.log('WebSocket connected');
          ws?.send(JSON.stringify({ type: 'subscribe', symbol }));
        };
        
        ws.onmessage = (event) => {
          try {
            const data = JSON.parse(event.data);
            if (data.symbol === symbol) {
              setAnalysis(data.analysis);
            }
          } catch (err) {
            console.error('Error processing WebSocket message:', err);
          }
        };

        ws.onclose = () => {
          console.log('WebSocket disconnected, attempting to reconnect...');
          ws = null;
          reconnectTimeout = setTimeout(connectWebSocket, 5000);
        };

        ws.onerror = (error) => {
          console.error('WebSocket error:', error);
          ws?.close();
        };
      } catch (err) {
        console.error('Error setting up WebSocket:', err);
        // Fall back to polling if WebSocket fails
        const pollInterval = setInterval(fetchAnalysis, 30000);
        return () => clearInterval(pollInterval);
      }
    };

    connectWebSocket();

    return () => {
      if (ws) {
        ws.close();
      }
      if (reconnectTimeout) {
        clearTimeout(reconnectTimeout);
      }
    };
  }, [symbol]);

  const getSentimentColor = (trend: MarketSentiment['trend']) => {
    switch (trend) {
      case 'bullish':
        return 'text-green-500';
      case 'bearish':
        return 'text-red-500';
      default:
        return 'text-yellow-500';
    }
  };

  const getSignalColor = (signal: string) => {
    switch (signal) {
      case 'buy':
      case 'bullish':
        return 'text-green-500';
      case 'sell':
      case 'bearish':
        return 'text-red-500';
      default:
        return 'text-yellow-500';
    }
  };

  const getWyckoffColor = (phase: WyckoffAnalysis['phase']) => {
    switch (phase) {
      case 'accumulation':
        return 'text-blue-500';
      case 'markup':
        return 'text-green-500';
      case 'distribution':
        return 'text-yellow-500';
      case 'markdown':
        return 'text-red-500';
      default:
        return 'text-gray-500';
    }
  };

  const getFibColor = (type: 'support' | 'resistance' | 'extension') => {
    switch (type) {
      case 'support':
        return 'text-green-500';
      case 'resistance':
        return 'text-red-500';
      case 'extension':
        return 'text-blue-500';
    }
  };

  if (isLoading) {
    return (
      <div className="space-y-4">
        <div className="h-4 w-24 bg-gray-800 rounded animate-pulse" />
        <div className="space-y-2">
          <div className="h-20 w-full bg-gray-800 rounded animate-pulse" />
          <div className="h-20 w-full bg-gray-800 rounded animate-pulse" />
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="space-y-4">
        <div className="rounded-lg bg-destructive/10 p-4 text-destructive">
          <p>{error}</p>
          <Button 
            className="mt-2"
            onClick={() => window.location.reload()}
          >
            Retry
          </Button>
        </div>
      </div>
    );
  }

  if (!analysis) {
    return null;
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold">AI Insights</h3>
        <Badge variant="outline" className="flex items-center space-x-1">
          <Brain className="h-3 w-3" />
          <span>AI Powered</span>
        </Badge>
      </div>

      {/* Market Sentiment */}
      <Card className="p-4">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center space-x-2">
            <h4 className="text-sm font-medium">Market Sentiment</h4>
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger>
                  <Info className="h-4 w-4 text-gray-400 hover:text-gray-300" />
                </TooltipTrigger>
                <TooltipContent>
                  <p className="text-sm max-w-xs">Analyzes overall market mood using social media, news sentiment, and trading activity to predict potential market direction.</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </div>
          <Brain className="h-4 w-4 text-gray-400" />
        </div>
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center space-x-1">
            {analysis.sentiment.trend === 'bullish' ? (
              <TrendingUp className="h-4 w-4 text-green-500" />
            ) : analysis.sentiment.trend === 'bearish' ? (
              <TrendingDown className="h-4 w-4 text-red-500" />
            ) : (
              <Activity className="h-4 w-4 text-yellow-500" />
            )}
            <span className={`text-sm font-medium ${getSentimentColor(analysis.sentiment.trend)}`}>
              {analysis.sentiment.trend.toUpperCase()}
            </span>
          </div>
        </div>
        <div className="space-y-2">
          <div className="flex items-center justify-between text-sm">
            <span className="text-gray-400">Sentiment Score</span>
            <span className="font-medium">{analysis.sentiment.score}/100</span>
          </div>
          <div className="flex items-center justify-between text-sm">
            <span className="text-gray-400">Confidence</span>
            <span className="font-medium">{analysis.sentiment.confidence}%</span>
          </div>
        </div>
      </Card>

      {/* Wyckoff Analysis */}
      <Card className="p-4">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center space-x-2">
            <h4 className="text-sm font-medium">Wyckoff Analysis</h4>
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger>
                  <Info className="h-4 w-4 text-gray-400 hover:text-gray-300" />
                </TooltipTrigger>
                <TooltipContent>
                  <p className="text-sm max-w-xs">Identifies market cycle phases (Accumulation, Markup, Distribution, Markdown) based on price and volume patterns.</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </div>
          <Layers className="h-4 w-4 text-gray-400" />
        </div>
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center space-x-1">
            <span className={`text-sm font-medium ${getWyckoffColor(analysis.wyckoff.phase)}`}>
              {analysis.wyckoff.phase.toUpperCase()}
            </span>
          </div>
        </div>
        <div className="space-y-2">
          <div className="space-y-1">
            <div className="flex items-center justify-between text-xs">
              <span className="text-gray-400">Phase Progress</span>
              <span className="font-medium">{analysis.wyckoff.progress}%</span>
            </div>
            <Progress value={analysis.wyckoff.progress} className="h-1" />
          </div>
          <div className="text-sm text-gray-400">
            {analysis.wyckoff.description}
          </div>
          <div className="grid grid-cols-2 gap-2 text-xs">
            <div>
              <span className="text-gray-400">Support: </span>
              <span className="font-medium text-green-500">${analysis.wyckoff.keyLevels.support.toLocaleString()}</span>
            </div>
            <div>
              <span className="text-gray-400">Resistance: </span>
              <span className="font-medium text-red-500">${analysis.wyckoff.keyLevels.resistance.toLocaleString()}</span>
            </div>
          </div>
        </div>
      </Card>

      {/* Fibonacci Levels */}
      <Card className="p-4">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center space-x-2">
            <h4 className="text-sm font-medium">Fibonacci Levels</h4>
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger>
                  <Info className="h-4 w-4 text-gray-400 hover:text-gray-300" />
                </TooltipTrigger>
                <TooltipContent>
                  <p className="text-sm max-w-xs">Shows key price levels based on Fibonacci ratios (0.236, 0.382, 0.618) to identify potential support and resistance zones.</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </div>
          <Gauge className="h-4 w-4 text-gray-400" />
        </div>
        <div className="space-y-3">
          <div className="text-sm text-gray-400 mb-2">
            Current Price: <span className="font-medium">${analysis.fibonacci.currentPrice.toLocaleString()}</span>
          </div>
          <div className="space-y-2">
            {analysis.fibonacci.levels.map((level, index) => (
              <motion.div
                key={level.name}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.1 }}
                className="flex items-center justify-between"
              >
                <span className="text-sm text-gray-400">Fib {level.name}</span>
                <span className={`text-sm font-medium ${getFibColor(level.type)}`}>
                  ${level.value.toLocaleString()}
                </span>
              </motion.div>
            ))}
          </div>
        </div>
      </Card>

      {/* Technical Analysis */}
      <Card className="p-4">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center space-x-2">
            <h4 className="text-sm font-medium">Technical Analysis</h4>
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger>
                  <Info className="h-4 w-4 text-gray-400 hover:text-gray-300" />
                </TooltipTrigger>
                <TooltipContent>
                  <p className="text-sm max-w-xs">Combines multiple technical indicators (RSI, MACD, Moving Averages) to provide an overall market analysis and trading signals.</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </div>
          <LineChart className="h-4 w-4 text-gray-400" />
        </div>
        <div className="grid grid-cols-2 gap-4 mb-4">
          <div className="flex items-center justify-between">
            <span className="text-sm text-gray-400">RSI</span>
            <span className={`text-sm font-medium ${getSignalColor(analysis.technical.rsi > 70 ? 'sell' : analysis.technical.rsi < 30 ? 'buy' : 'neutral')}`}>
              {analysis.technical.rsi.toFixed(2)}
            </span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-sm text-gray-400">MACD</span>
            <span className={`text-sm font-medium ${getSignalColor(analysis.technical.macd > 0 ? 'buy' : 'sell')}`}>
              {analysis.technical.macd.toFixed(2)}
            </span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-sm text-gray-400">MA</span>
            <span className={`text-sm font-medium ${getSignalColor(analysis.technical.ma > analysis.fibonacci.currentPrice ? 'sell' : 'buy')}`}>
              {analysis.technical.ma.toFixed(2)}
            </span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-sm text-gray-400">Volume</span>
            <span className={`text-sm font-medium ${getSignalColor(analysis.technical.volume.toLowerCase())}`}>
              {analysis.technical.volume}
            </span>
          </div>
        </div>
      </Card>

      {/* Risk Warning */}
      <Card className="p-4 bg-yellow-500/10 border-yellow-500/20">
        <div className="flex items-start space-x-2">
          <AlertTriangle className="h-4 w-4 text-yellow-500 mt-0.5" />
          <p className="text-sm text-yellow-500">
            AI insights are for informational purposes only. Always do your own research and trade responsibly.
          </p>
        </div>
      </Card>
    </div>
  );
} 