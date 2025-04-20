'use client';

import { useEffect, useState, useRef } from 'react';
import { Terminal, Wifi, WifiOff, AlertCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface LogEntry {
  id: string;
  timestamp: string;
  type: 'info' | 'success' | 'error';
  message: string;
}

export function BotLogs() {
  const [logs, setLogs] = useState<LogEntry[]>([]);
  const [isConnected, setIsConnected] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [mounted, setMounted] = useState(false);
  const socketRef = useRef<WebSocket | null>(null);
  const reconnectTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  // Connect to WebSocket server
  const connectWebSocket = () => {
    setIsLoading(true);
    setError(null);
    
    try {
      // Replace with your actual WebSocket server URL
      const wsUrl = process.env.NEXT_PUBLIC_WS_URL || 'wss://example.com/ws';
      const socket = new WebSocket(wsUrl);
      
      socket.onopen = () => {
        console.log('WebSocket connected');
        setIsConnected(true);
        setIsLoading(false);
        
        // Clear any reconnect timeout
        if (reconnectTimeoutRef.current) {
          clearTimeout(reconnectTimeoutRef.current);
          reconnectTimeoutRef.current = null;
        }
      };
      
      socket.onmessage = (event) => {
        try {
          const data = JSON.parse(event.data);
          
          // Handle different message types
          if (data.type === 'log') {
            const newLog: LogEntry = {
              id: Math.random().toString(),
              timestamp: new Date().toISOString(),
              type: data.logType || 'info',
              message: data.message,
            };
            
            setLogs((prev) => [...prev.slice(-19), newLog]);
          }
        } catch (err) {
          console.error('Error parsing WebSocket message:', err);
        }
      };
      
      socket.onerror = (err) => {
        console.error('WebSocket error:', err);
        setError('Connection error. Retrying...');
        setIsConnected(false);
        
        // Attempt to reconnect after a delay
        if (!reconnectTimeoutRef.current) {
          reconnectTimeoutRef.current = setTimeout(() => {
            reconnectTimeoutRef.current = null;
            connectWebSocket();
          }, 5000);
        }
      };
      
      socket.onclose = () => {
        console.log('WebSocket disconnected');
        setIsConnected(false);
        
        // Attempt to reconnect after a delay
        if (!reconnectTimeoutRef.current) {
          reconnectTimeoutRef.current = setTimeout(() => {
            reconnectTimeoutRef.current = null;
            connectWebSocket();
          }, 5000);
        }
      };
      
      socketRef.current = socket;
    } catch (err) {
      console.error('Error creating WebSocket:', err);
      setError('Failed to connect to server');
      setIsLoading(false);
    }
  };

  // Connect on mount
  useEffect(() => {
    connectWebSocket();
    
    // Clean up on unmount
    return () => {
      if (socketRef.current) {
        socketRef.current.close();
      }
      
      if (reconnectTimeoutRef.current) {
        clearTimeout(reconnectTimeoutRef.current);
      }
    };
  }, []);

  // Add sample logs for development
  useEffect(() => {
    if (process.env.NODE_ENV === 'development' && !isConnected) {
      const sampleLogs: LogEntry[] = [
        {
          id: '1',
          timestamp: new Date().toISOString(),
          type: 'info',
          message: 'Scanning mempool for opportunities...',
        },
        {
          id: '2',
          timestamp: new Date().toISOString(),
          type: 'success',
          message: 'Found potential arbitrage: ETH/USDC on Uniswap V3',
        },
        {
          id: '3',
          timestamp: new Date().toISOString(),
          type: 'error',
          message: 'Transaction reverted: insufficient liquidity',
        },
      ];

      setLogs(sampleLogs);
      setIsLoading(false);
    }
  }, [isConnected]);

  // Set mounted state after hydration
  useEffect(() => {
    setMounted(true);
  }, []);

  // Don't render until after hydration
  if (!mounted) {
    return null;
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Terminal className="h-5 w-5" />
          <h3 className="text-lg font-semibold">Bot Activity</h3>
        </div>
        
        <div className="flex items-center gap-2">
          {isLoading ? (
            <span className="text-sm text-gray-400">Connecting...</span>
          ) : isConnected ? (
            <div className="flex items-center gap-1 text-success">
              <Wifi className="h-4 w-4" />
              <span className="text-sm">Connected</span>
            </div>
          ) : (
            <div className="flex items-center gap-1 text-destructive">
              <WifiOff className="h-4 w-4" />
              <span className="text-sm">Disconnected</span>
            </div>
          )}
          
          {!isConnected && !isLoading && (
            <Button variant="outline" size="sm" onClick={connectWebSocket}>
              Reconnect
            </Button>
          )}
        </div>
      </div>

      {error && (
        <div className="flex items-center rounded-lg bg-destructive/10 p-3 text-destructive">
          <AlertCircle className="mr-2 h-4 w-4" />
          <span className="text-sm">{error}</span>
        </div>
      )}

      <div className="h-48 overflow-auto rounded-lg bg-gray-900 p-4 font-mono text-sm">
        {logs.length === 0 ? (
          <div className="flex h-full items-center justify-center text-gray-500">
            No activity yet
          </div>
        ) : (
          logs.map((log) => (
            <div
              key={log.id}
              className={`mb-2 ${
                log.type === 'error'
                  ? 'text-red-400'
                  : log.type === 'success'
                  ? 'text-green-400'
                  : 'text-gray-300'
              }`}
            >
              <span className="mr-2 text-gray-500">
                {mounted ? new Date(log.timestamp).toLocaleTimeString() : '12:00:00'}
              </span>
              <span>{log.message}</span>
            </div>
          ))
        )}
      </div>
    </div>
  );
} 