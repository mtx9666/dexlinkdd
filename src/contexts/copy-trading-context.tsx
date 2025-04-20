'use client';

import React, { createContext, useContext, useEffect, useState } from 'react';
import { CopyTradeManager, CopyTradeSettings, TradePosition, Trader } from '@/lib/copy-trading';

interface CopyTradingContextType {
  manager: CopyTradeManager | null;
  settings: CopyTradeSettings;
  updateSettings: (settings: CopyTradeSettings) => void;
  followTrader: (traderId: string) => void;
  unfollowTrader: (traderId: string) => void;
  isFollowingTrader: (traderId: string) => boolean;
  copyTrade: (trade: TradePosition) => Promise<boolean>;
}

const defaultSettings: CopyTradeSettings = {
  maxTradeSize: 1000,
  riskPercentage: 1,
  stopLossPercentage: 5,
  takeProfitPercentage: 10,
  autoCopy: false,
  notifications: true,
  maxOpenTrades: 5,
};

const CopyTradingContext = createContext<CopyTradingContextType>({
  manager: null,
  settings: defaultSettings,
  updateSettings: () => {},
  followTrader: () => {},
  unfollowTrader: () => {},
  isFollowingTrader: () => false,
  copyTrade: async () => false,
});

export function CopyTradingProvider({ children }: { children: React.ReactNode }) {
  const [manager, setManager] = useState<CopyTradeManager | null>(null);
  const [settings, setSettings] = useState<CopyTradeSettings>(defaultSettings);

  useEffect(() => {
    // Initialize the manager with default settings
    const newManager = new CopyTradeManager(defaultSettings);
    setManager(newManager);
  }, []);

  const updateSettings = (newSettings: CopyTradeSettings) => {
    if (manager) {
      manager.updateSettings(newSettings);
      setSettings(newSettings);
    }
  };

  const followTrader = (traderId: string) => {
    if (manager) {
      manager.followTrader(traderId);
    }
  };

  const unfollowTrader = (traderId: string) => {
    if (manager) {
      manager.unfollowTrader(traderId);
    }
  };

  const isFollowingTrader = (traderId: string): boolean => {
    return manager ? manager.isFollowingTrader(traderId) : false;
  };

  const copyTrade = async (trade: TradePosition): Promise<boolean> => {
    if (manager) {
      return manager.copyTrade(trade);
    }
    return false;
  };

  return (
    <CopyTradingContext.Provider
      value={{
        manager,
        settings,
        updateSettings,
        followTrader,
        unfollowTrader,
        isFollowingTrader,
        copyTrade,
      }}
    >
      {children}
    </CopyTradingContext.Provider>
  );
}

export function useCopyTrading() {
  const context = useContext(CopyTradingContext);
  if (context === undefined) {
    throw new Error('useCopyTrading must be used within a CopyTradingProvider');
  }
  return context;
} 