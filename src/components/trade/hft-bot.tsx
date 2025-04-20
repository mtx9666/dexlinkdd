'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
  Play,
  Pause,
  Settings,
  AlertCircle,
  TrendingUp,
  TrendingDown,
  RefreshCw,
  Terminal,
  Activity,
} from 'lucide-react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { cn } from '@/lib/utils';
import { botApi, BotStats } from '@/lib/api';

interface BotSettings {
  maxPositions: number;
  riskPerTrade: number;
  minSpread: number;
  maxSlippage: number;
  mode: 'aggressive' | 'balanced' | 'conservative';
}

interface HFTBotProps {
  symbol: string;
}

export default function HFTBot({ symbol }: HFTBotProps) {
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [stats, setStats] = useState<BotStats | null>(null);
  const [isRunning, setIsRunning] = useState(false);
  const [isConfiguring, setIsConfiguring] = useState(false);
  const [settings, setSettings] = useState<BotSettings>({
    maxPositions: 5,
    riskPerTrade: 1.5,
    minSpread: 0.05,
    maxSlippage: 0.1,
    mode: 'balanced'
  });
  const [logs, setLogs] = useState<string[]>([
    'Scanning mempool for opportunities...',
    'Found potential arbitrage: ETH/USDC on Uniswap V3',
    'Transaction reverted: insufficient liquidity',
  ]);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        setIsLoading(true);
        setError(null);
        const data = await botApi.getBotStats(symbol);
        setStats(data);
        setIsRunning(data.status === 'running');
      } catch (err) {
        console.error('Error fetching bot stats:', err);
        // Don't set error state, just use default values
        setStats({
          totalTrades: 0,
          winRate: 0,
          pnl: 0,
          avgTradeDuration: 0,
          status: 'stopped',
          settings: {
            strategy: 'Arbitrage',
            maxPositionSize: 1000,
            stopLoss: 1,
            takeProfit: 2
          }
        });
      } finally {
        setIsLoading(false);
      }
    };

    fetchStats();

    // Set up WebSocket connection for real-time updates
    let ws: WebSocket | null = null;
    try {
      ws = new WebSocket(`${process.env.NEXT_PUBLIC_WS_URL || 'ws://localhost:8000'}/bot`);
      
      ws.onmessage = (event) => {
        try {
          const data = JSON.parse(event.data);
          if (data.symbol === symbol) {
            setStats(data.stats);
            setIsRunning(data.stats.status === 'running');
          }
        } catch (err) {
          console.error('Error parsing WebSocket message:', err);
        }
      };

      ws.onerror = (error) => {
        console.error('WebSocket error:', error);
        // Don't set error state, just continue with default values
      };
    } catch (err) {
      console.error('Error setting up WebSocket:', err);
      // Don't set error state, just continue with default values
    }

    return () => {
      if (ws) {
        ws.close();
      }
    };
  }, [symbol]);

  const handleStart = async () => {
    try {
      await botApi.startBot(symbol);
      setIsRunning(true);
      // Add a log entry
      setLogs(prev => [...prev, 'Bot started successfully']);
    } catch (err) {
      console.error('Error starting bot:', err);
      setError('Failed to start bot. Please try again.');
      // Add a log entry
      setLogs(prev => [...prev, 'Failed to start bot']);
    }
  };

  const handleStop = async () => {
    try {
      await botApi.stopBot(symbol);
      setIsRunning(false);
      // Add a log entry
      setLogs(prev => [...prev, 'Bot stopped successfully']);
    } catch (err) {
      console.error('Error stopping bot:', err);
      setError('Failed to stop bot. Please try again.');
      // Add a log entry
      setLogs(prev => [...prev, 'Failed to stop bot']);
    }
  };

  const handleSettingsClick = () => {
    setIsConfiguring(!isConfiguring);
  };

  const handleModeChange = (mode: 'aggressive' | 'balanced' | 'conservative') => {
    setSettings(prev => ({
      ...prev,
      mode,
      // Adjust other settings based on mode
      maxPositions: mode === 'aggressive' ? 10 : mode === 'balanced' ? 5 : 3,
      riskPerTrade: mode === 'aggressive' ? 2.5 : mode === 'balanced' ? 1.5 : 0.8,
      minSpread: mode === 'aggressive' ? 0.03 : mode === 'balanced' ? 0.05 : 0.08,
      maxSlippage: mode === 'aggressive' ? 0.15 : mode === 'balanced' ? 0.1 : 0.05,
    }));
    setLogs(prev => [...prev, `Bot mode changed to ${mode}`]);
  };

  if (isLoading) {
    return (
      <div className="space-y-4">
        <div className="h-4 w-24 bg-muted rounded animate-pulse" />
        <div className="space-y-2">
          <div className="h-20 w-full bg-muted rounded animate-pulse" />
          <div className="h-20 w-full bg-muted rounded animate-pulse" />
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

  if (!stats) {
    return null;
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold">HFT Bot</h3>
        <Badge variant={isRunning ? "default" : "secondary"} className="flex items-center space-x-1">
          <Activity className="h-3 w-3" />
          <span>{isRunning ? 'Running' : 'Stopped'}</span>
        </Badge>
      </div>

      {error && (
        <div className="rounded-lg bg-destructive/10 p-3 text-destructive text-sm">
          <p>{error}</p>
        </div>
      )}

      <Card className="p-4">
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-1">
            <p className="text-sm text-muted-foreground">Total Trades</p>
            <p className="text-2xl font-semibold">{stats?.totalTrades || 0}</p>
          </div>
          <div className="space-y-1">
            <p className="text-sm text-muted-foreground">Win Rate</p>
            <p className="text-2xl font-semibold">{stats?.winRate || 0}%</p>
          </div>
          <div className="space-y-1">
            <p className="text-sm text-muted-foreground">Profit/Loss</p>
            <p className={`text-2xl font-semibold ${(stats?.pnl || 0) >= 0 ? 'text-green-500' : 'text-red-500'}`}>
              ${(stats?.pnl || 0).toLocaleString()}
            </p>
          </div>
          <div className="space-y-1">
            <p className="text-sm text-muted-foreground">Avg. Trade Duration</p>
            <p className="text-2xl font-semibold">{stats?.avgTradeDuration || 0}ms</p>
          </div>
        </div>
      </Card>

      <Card className="p-4">
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h4 className="text-sm font-medium">Bot Settings</h4>
            <Button 
              variant="ghost" 
              size="sm"
              onClick={handleSettingsClick}
            >
              <Settings className="h-4 w-4" />
            </Button>
          </div>

          {isConfiguring ? (
            <div className="space-y-4">
              <div className="space-y-2">
                <p className="text-sm font-medium">Trading Mode</p>
                <div className="grid grid-cols-3 gap-2">
                  <Button
                    variant={settings.mode === 'aggressive' ? "default" : "outline"}
                    size="sm"
                    onClick={() => handleModeChange('aggressive')}
                  >
                    Aggressive
                  </Button>
                  <Button
                    variant={settings.mode === 'balanced' ? "default" : "outline"}
                    size="sm"
                    onClick={() => handleModeChange('balanced')}
                  >
                    Balanced
                  </Button>
                  <Button
                    variant={settings.mode === 'conservative' ? "default" : "outline"}
                    size="sm"
                    onClick={() => handleModeChange('conservative')}
                  >
                    Conservative
                  </Button>
                </div>
              </div>

              <div className="space-y-2">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-muted-foreground">Max Positions</span>
                  <span className="font-medium">{settings.maxPositions}</span>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-muted-foreground">Risk Per Trade</span>
                  <span className="font-medium">{settings.riskPerTrade}%</span>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-muted-foreground">Min Spread</span>
                  <span className="font-medium">{settings.minSpread}%</span>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-muted-foreground">Max Slippage</span>
                  <span className="font-medium">{settings.maxSlippage}%</span>
                </div>
              </div>
            </div>
          ) : (
            <div className="space-y-2">
              <div className="flex items-center justify-between text-sm">
                <span className="text-muted-foreground">Strategy</span>
                <span className="font-medium">{stats?.settings?.strategy || 'Arbitrage'}</span>
              </div>
              <div className="flex items-center justify-between text-sm">
                <span className="text-muted-foreground">Mode</span>
                <Badge variant="outline" className="capitalize">{settings.mode}</Badge>
              </div>
              <div className="flex items-center justify-between text-sm">
                <span className="text-muted-foreground">Max Position Size</span>
                <span className="font-medium">${(stats?.settings?.maxPositionSize || 0).toLocaleString()}</span>
              </div>
              <div className="flex items-center justify-between text-sm">
                <span className="text-muted-foreground">Stop Loss</span>
                <span className="font-medium">{stats?.settings?.stopLoss || 0}%</span>
              </div>
              <div className="flex items-center justify-between text-sm">
                <span className="text-muted-foreground">Take Profit</span>
                <span className="font-medium">{stats?.settings?.takeProfit || 0}%</span>
              </div>
            </div>
          )}
        </div>
      </Card>

      <div className="flex items-center justify-between">
        <Button
          variant={isRunning ? "destructive" : "default"}
          onClick={isRunning ? handleStop : handleStart}
          className="w-full"
        >
          {isRunning ? 'Stop Bot' : 'Start Bot'}
        </Button>
      </div>

      <Card className="p-4">
        <div className="space-y-4">
          <div className="flex items-center justify-between mb-1">
            <div className="flex items-center space-x-1">
              <Terminal className="h-3 w-3 text-muted-foreground" />
              <span className="text-xs font-medium">Logs</span>
            </div>
            <RefreshCw className="h-3 w-3 text-muted-foreground" />
          </div>
          <div className="space-y-1">
            {logs.slice(-5).map((log, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 5 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className="text-xs font-mono"
              >
                <span className="text-muted-foreground">12:00:00</span>
                <span className="ml-1">{log}</span>
              </motion.div>
            ))}
          </div>
        </div>
      </Card>

      {/* Risk Warning */}
      <div className="text-[10px] text-yellow-500/70 flex items-start space-x-1 border-t border-border pt-2 mt-2">
        <AlertCircle className="h-3 w-3 mt-0.5 flex-shrink-0" />
        <p>High-frequency trading involves significant risks. Trade responsibly.</p>
      </div>
    </div>
  );
} 