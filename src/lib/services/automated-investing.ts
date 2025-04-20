import { ethers } from 'ethers';
import { marketApi } from '../api';

export interface InvestmentStrategy {
  totalAmount: number;
  allocations: {
    symbol: string;
    percentage: number;
    amount: number;
  }[];
}

export interface InvestmentResult {
  success: boolean;
  transactions: {
    symbol: string;
    amount: number;
    price: number;
    txHash: string;
  }[];
  error?: string;
}

export class AutomatedInvestingService {
  private static instance: AutomatedInvestingService;
  private provider: ethers.providers.Web3Provider | null = null;

  private constructor() {}

  static getInstance(): AutomatedInvestingService {
    if (!AutomatedInvestingService.instance) {
      AutomatedInvestingService.instance = new AutomatedInvestingService();
    }
    return AutomatedInvestingService.instance;
  }

  setProvider(provider: ethers.providers.Web3Provider) {
    this.provider = provider;
  }

  async executeStrategy(strategy: InvestmentStrategy): Promise<InvestmentResult> {
    if (!this.provider) {
      throw new Error('Provider not initialized');
    }

    const transactions = [];
    const errors = [];

    try {
      // Get current market prices
      const prices = await marketApi.getPrices(
        strategy.allocations.map(a => a.symbol)
      );

      // Execute trades for each allocation
      for (const allocation of strategy.allocations) {
        try {
          const price = prices[allocation.symbol];
          if (!price) {
            throw new Error(`Price not available for ${allocation.symbol}`);
          }

          // Calculate the amount to buy
          const amountToBuy = allocation.amount / price;

          // Execute the trade
          const tx = await this.executeTrade(
            allocation.symbol,
            amountToBuy,
            price
          );

          transactions.push({
            symbol: allocation.symbol,
            amount: amountToBuy,
            price,
            txHash: tx.hash,
          });
        } catch (error) {
          errors.push(`Failed to execute trade for ${allocation.symbol}: ${error.message}`);
        }
      }

      return {
        success: transactions.length > 0,
        transactions,
        error: errors.length > 0 ? errors.join('; ') : undefined,
      };
    } catch (error) {
      return {
        success: false,
        transactions: [],
        error: error.message,
      };
    }
  }

  private async executeTrade(
    symbol: string,
    amount: number,
    price: number
  ): Promise<ethers.providers.TransactionResponse> {
    // Here you would implement the actual trading logic
    // This is a placeholder that should be replaced with actual DEX integration
    throw new Error('Trading functionality not implemented');
  }

  async rebalancePortfolio(
    currentHoldings: { symbol: string; amount: number }[],
    targetAllocations: { symbol: string; percentage: number }[]
  ): Promise<InvestmentResult> {
    // Calculate current portfolio value
    const prices = await marketApi.getPrices(
      currentHoldings.map(h => h.symbol)
    );

    const currentValue = currentHoldings.reduce(
      (total, holding) => total + holding.amount * prices[holding.symbol],
      0
    );

    // Calculate target amounts
    const targetAmounts = targetAllocations.map(allocation => ({
      symbol: allocation.symbol,
      amount: (currentValue * allocation.percentage) / 100,
    }));

    // Calculate required trades
    const trades = currentHoldings.map(holding => {
      const target = targetAmounts.find(t => t.symbol === holding.symbol);
      const currentAmount = holding.amount * prices[holding.symbol];
      const targetAmount = target ? target.amount : 0;
      const difference = targetAmount - currentAmount;

      return {
        symbol: holding.symbol,
        amount: difference,
        isBuy: difference > 0,
      };
    });

    // Execute rebalancing trades
    return this.executeStrategy({
      totalAmount: currentValue,
      allocations: targetAllocations.map(allocation => ({
        symbol: allocation.symbol,
        percentage: allocation.percentage,
        amount: (currentValue * allocation.percentage) / 100,
      })),
    });
  }
} 