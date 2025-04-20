import { toast } from "@/components/ui/use-toast"

export interface TradePosition {
  id: string;
  trader: string;
  symbol: string;
  side: 'long' | 'short';
  entryPrice: number;
  leverage: number;
  size: number;
  stopLoss?: number;
  takeProfit?: number;
  timestamp: number;
}

export interface CopyTradeSettings {
  maxTradeSize: number;
  riskPercentage: number;
  stopLossPercentage: number;
  takeProfitPercentage: number;
  autoCopy: boolean;
  notifications: boolean;
  maxOpenTrades: number;
}

export interface Trader {
  id: string;
  name: string;
  avatar: string;
  winRate: number;
  totalTrades: number;
  pnl: number;
  followers: number;
  isFollowing: boolean;
}

export class CopyTradeManager {
  private settings: CopyTradeSettings;
  private openPositions: Map<string, TradePosition>;
  private followedTraders: Set<string>;

  constructor(settings: CopyTradeSettings) {
    this.settings = settings;
    this.openPositions = new Map();
    this.followedTraders = new Set();
  }

  public updateSettings(newSettings: CopyTradeSettings) {
    this.settings = newSettings;
  }

  public followTrader(traderId: string) {
    this.followedTraders.add(traderId);
  }

  public unfollowTrader(traderId: string) {
    this.followedTraders.delete(traderId);
  }

  public isFollowingTrader(traderId: string): boolean {
    return this.followedTraders.has(traderId);
  }

  public async copyTrade(trade: TradePosition): Promise<boolean> {
    try {
      // Check if we can copy this trade
      if (!this.canCopyTrade(trade)) {
        return false;
      }

      // Calculate position size based on settings
      const adjustedSize = this.calculatePositionSize(trade);

      // Add stop loss and take profit if enabled
      const adjustedTrade = this.addRiskManagement(trade, adjustedSize);

      // Place the trade
      await this.placeTrade(adjustedTrade);

      // Store the position
      this.openPositions.set(adjustedTrade.id, adjustedTrade);

      // Show notification if enabled
      if (this.settings.notifications) {
        this.notifyTradeCopied(adjustedTrade);
      }

      return true;
    } catch (error) {
      console.error('Failed to copy trade:', error);
      this.notifyError('Failed to copy trade');
      return false;
    }
  }

  private canCopyTrade(trade: TradePosition): boolean {
    // Check if we're following the trader
    if (!this.followedTraders.has(trade.trader)) {
      return false;
    }

    // Check if auto-copy is enabled
    if (!this.settings.autoCopy) {
      return false;
    }

    // Check if we've reached max open trades
    if (this.openPositions.size >= this.settings.maxOpenTrades) {
      this.notifyError('Maximum number of open trades reached');
      return false;
    }

    // Check if trade size is within limits
    if (trade.size > this.settings.maxTradeSize) {
      this.notifyError('Trade size exceeds maximum limit');
      return false;
    }

    return true;
  }

  private calculatePositionSize(trade: TradePosition): number {
    const riskAmount = (this.settings.maxTradeSize * this.settings.riskPercentage) / 100;
    return Math.min(trade.size, riskAmount);
  }

  private addRiskManagement(trade: TradePosition, size: number): TradePosition {
    const adjustedTrade = { ...trade, size };

    if (this.settings.stopLossPercentage > 0) {
      const slPrice = trade.side === 'long'
        ? trade.entryPrice * (1 - this.settings.stopLossPercentage / 100)
        : trade.entryPrice * (1 + this.settings.stopLossPercentage / 100);
      adjustedTrade.stopLoss = slPrice;
    }

    if (this.settings.takeProfitPercentage > 0) {
      const tpPrice = trade.side === 'long'
        ? trade.entryPrice * (1 + this.settings.takeProfitPercentage / 100)
        : trade.entryPrice * (1 - this.settings.takeProfitPercentage / 100);
      adjustedTrade.takeProfit = tpPrice;
    }

    return adjustedTrade;
  }

  private async placeTrade(trade: TradePosition): Promise<void> {
    // TODO: Implement actual trade execution logic
    // This would integrate with your trading platform's API
    console.log('Placing trade:', trade);
  }

  private notifyTradeCopied(trade: TradePosition) {
    toast({
      title: "Trade Copied",
      description: `Copied ${trade.side} ${trade.symbol} trade from ${trade.trader}`,
    });
  }

  private notifyError(message: string) {
    toast({
      title: "Error",
      description: message,
      variant: "destructive",
    });
  }
} 