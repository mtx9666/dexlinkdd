import axios from 'axios';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001/api';
const COINGECKO_API_URL = 'https://api.coingecko.com/api/v3';

// Types
export interface CandleData {
  time: number;
  open: number;
  high: number;
  low: number;
  close: number;
}

export interface VolumeData {
  time: number;
  value: number;
  color: string;
}

export interface MarketDepth {
  bids: [number, number][]; // [price, size]
  asks: [number, number][];
}

export interface Trade {
  id: string;
  symbol: string;
  type: 'long' | 'short';
  size: number;
  price: number;
  timestamp: number;
  status?: 'completed' | 'cancelled';
  entryPrice?: number;
  exitPrice?: number;
  pnl?: number;
}

export interface MarketAnalysis {
  sentiment: {
    score: number;
    trend: 'bullish' | 'bearish' | 'neutral';
    confidence: number;
  };
  technical: {
    rsi: number;
    macd: number;
    ma: number;
    volume: string;
  };
  wyckoff: {
    phase: 'accumulation' | 'markup' | 'distribution' | 'markdown' | 'neutral';
    progress: number;
    description: string;
    keyLevels: {
      support: number;
      resistance: number;
    };
  };
  fibonacci: {
    levels: Array<{
      name: string;
      value: number;
      type: 'support' | 'resistance' | 'extension';
    }>;
    currentPrice: number;
  };
}

export interface BotStats {
  totalTrades: number;
  winRate: number;
  pnl: number;
  avgTradeDuration: number;
  status: 'running' | 'stopped';
  settings: {
    strategy: string;
    maxPositionSize: number;
    stopLoss: number;
    takeProfit: number;
  };
}

// API Client
const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000,
});

// Add response interceptor for better error handling
api.interceptors.response.use(
  response => response,
  error => {
    console.error('API Error:', error?.response?.data || error.message);
    // If API fails, return mock data for development
    if (process.env.NODE_ENV === 'development') {
      return Promise.resolve({ data: generateMockData(error.config) });
    }
    return Promise.reject(error);
  }
);

// Generate mock data for development
function generateMockData(config: any) {
  const now = Date.now();
  const hour = 3600 * 1000;

  if (config.url.includes('/candles')) {
    return Array.from({ length: 100 }, (_, i) => ({
      time: Math.floor((now - (i * hour)) / 1000),
      open: 1800 + Math.random() * 100,
      high: 1850 + Math.random() * 100,
      low: 1750 + Math.random() * 100,
      close: 1800 + Math.random() * 100,
    }));
  }

  if (config.url.includes('/depth')) {
    return {
      bids: Array.from({ length: 10 }, (_, i) => [1800 - i, Math.random() * 10]),
      asks: Array.from({ length: 10 }, (_, i) => [1800 + i, Math.random() * 10]),
    };
  }

  if (config.url.includes('/trades')) {
    return Array.from({ length: 10 }, (_, i) => ({
      id: `trade-${i}`,
      symbol: 'ETH-USD',
      type: Math.random() > 0.5 ? 'long' : 'short',
      size: Math.random() * 10,
      price: 1800 + Math.random() * 100,
      timestamp: Math.floor((now - (i * hour)) / 1000),
      status: 'completed',
    }));
  }

  if (config.url.includes('/analysis')) {
    return {
      sentiment: {
        score: Math.floor(Math.random() * 100),
        trend: Math.random() > 0.5 ? 'bullish' : 'bearish',
        confidence: Math.floor(Math.random() * 100),
      },
      technical: {
        rsi: Math.random() * 100,
        macd: (Math.random() - 0.5) * 10,
        ma: 1800 + Math.random() * 100,
        volume: Math.random() > 0.5 ? 'HIGH' : 'LOW',
      },
      wyckoff: {
        phase: ['accumulation', 'markup', 'distribution', 'markdown', 'neutral'][Math.floor(Math.random() * 5)],
        progress: Math.floor(Math.random() * 100),
        description: 'Market is showing strong momentum with increasing volume.',
        keyLevels: {
          support: 1750 + Math.random() * 50,
          resistance: 1850 + Math.random() * 50,
        },
      },
      fibonacci: {
        levels: [
          { name: '0.236', value: 1850 + Math.random() * 50, type: 'resistance' },
          { name: '0.382', value: 1830 + Math.random() * 50, type: 'resistance' },
          { name: '0.5', value: 1810 + Math.random() * 50, type: 'resistance' },
          { name: '0.618', value: 1790 + Math.random() * 50, type: 'support' },
          { name: '0.786', value: 1770 + Math.random() * 50, type: 'support' },
        ],
        currentPrice: 1800 + Math.random() * 100,
      },
    };
  }

  return null;
}

// Market Data API
export const marketApi = {
  // Get historical candle data
  getCandles: async (symbol: string, timeframe: string): Promise<CandleData[]> => {
    try {
      const response = await api.get(`/api/v1/market/candles`, {
        params: { symbol, timeframe }
      });
      return response.data;
    } catch (error) {
      console.error('Error fetching candles:', error);
      throw error;
    }
  },

  // Get market depth
  getMarketDepth: async (symbol: string): Promise<MarketDepth> => {
    try {
      const response = await api.get(`/api/v1/market/depth`, {
        params: { symbol }
      });
      return response.data;
    } catch (error) {
      console.error('Error fetching market depth:', error);
      throw error;
    }
  },

  // Get recent trades
  getRecentTrades: async (symbol: string): Promise<Trade[]> => {
    try {
      const response = await api.get(`/api/v1/market/trades`, {
        params: { symbol }
      });
      return response.data;
    } catch (error) {
      console.error('Error fetching recent trades:', error);
      throw error;
    }
  },

  // Get market analysis
  getMarketAnalysis: async (symbol: string): Promise<MarketAnalysis> => {
    try {
      const response = await api.get(`/api/v1/market/analysis`, {
        params: { symbol }
      });
      return response.data;
    } catch (error) {
      console.error('Error fetching market analysis:', error);
      throw error;
    }
  },
};

// HFT Bot API
export const botApi = {
  // Get bot statistics
  getBotStats: async (symbol: string): Promise<BotStats> => {
    try {
      const response = await api.get(`/api/v1/hft/stats`, {
        params: { symbol }
      });
      return response.data;
    } catch (error) {
      console.error('Error fetching bot stats:', error);
      throw error;
    }
  },

  // Start bot
  startBot: async (symbol: string): Promise<void> => {
    try {
      await api.post(`/api/v1/hft/start`, { symbol });
    } catch (error) {
      console.error('Error starting bot:', error);
      throw error;
    }
  },

  // Stop bot
  stopBot: async (symbol: string): Promise<void> => {
    try {
      await api.post(`/api/v1/hft/stop`, { symbol });
    } catch (error) {
      console.error('Error stopping bot:', error);
      throw error;
    }
  },
};

// CoinGecko API for token data
export const coinGeckoApi = {
  // Get token price
  getTokenPrice: async (tokenId: string): Promise<number> => {
    try {
      const response = await axios.get(`${COINGECKO_API_URL}/simple/price`, {
        params: {
          ids: tokenId,
          vs_currencies: 'usd'
        }
      });
      return response.data[tokenId].usd;
    } catch (error) {
      console.error('Error fetching token price:', error);
      throw error;
    }
  },

  // Get token market data
  getTokenMarketData: async (tokenId: string): Promise<any> => {
    try {
      const response = await axios.get(`${COINGECKO_API_URL}/coins/${tokenId}`);
      return response.data;
    } catch (error) {
      console.error('Error fetching token market data:', error);
      throw error;
    }
  },
}; 