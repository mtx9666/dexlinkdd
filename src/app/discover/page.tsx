'use client';

import { motion } from 'framer-motion';
import { Box, Crosshair, Zap, Shield, TrendingUp, Users, Wallet, ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import Link from 'next/link';

const features = [
  {
    title: 'Order Execution Engine',
    description: 'Trade with confidence.',
    details: 'Our limit order execution engine is the fastest in the market.',
    subtext: 'With our proprietary order execution engine and colocated nodes, our limit orders land in ≤ 1 block.',
    icon: Box,
    color: 'text-blue-500'
  },
  {
    title: 'Sniper Bot',
    description: 'Never miss a trading opportunity.',
    details: 'Lightning-fast automated token sniping with customizable strategies.',
    subtext: 'Instantly detect and execute trades on new listings, token launches, and price movements with our advanced sniping algorithm.',
    icon: Crosshair,
    color: 'text-green-500'
  },
  {
    title: 'No MEV Triggers',
    description: 'Trade without MEV interference.',
    details: 'Protected trading execution without MEV exploitation.',
    subtext: 'Advanced protection against sandwich attacks and frontrunning with real-time monitoring.',
    icon: Shield,
    color: 'text-purple-500'
  },
  {
    title: 'Auto-Strategies',
    description: 'Automated trading strategies.',
    details: 'Set up and run automated trading strategies with ease.',
    subtext: 'Configure custom trading strategies with our easy-to-use interface and advanced backtesting.',
    icon: Zap,
    color: 'text-yellow-500'
  }
];

const popularTokens = [
  { name: 'Bitcoin', symbol: 'BTC', price: '45,000', change: '+2.5%', volume: '28.5B' },
  { name: 'Ethereum', symbol: 'ETH', price: '2,800', change: '+1.8%', volume: '12.3B' },
  { name: 'Solana', symbol: 'SOL', price: '98', change: '+5.2%', volume: '2.1B' },
  { name: 'Binance Coin', symbol: 'BNB', price: '320', change: '-0.5%', volume: '1.8B' },
  { name: 'Cardano', symbol: 'ADA', price: '0.58', change: '+3.2%', volume: '890M' },
  { name: 'Polkadot', symbol: 'DOT', price: '7.25', change: '-1.2%', volume: '450M' },
  { name: 'Avalanche', symbol: 'AVAX', price: '35.80', change: '+4.1%', volume: '680M' },
  { name: 'Chainlink', symbol: 'LINK', price: '18.45', change: '+2.8%', volume: '520M' }
];

const marketTrends = [
  { name: 'DeFi Total Value Locked', value: '$48.2B', change: '+5.8%' },
  { name: 'NFT Trading Volume (24h)', value: '$142M', change: '-2.3%' },
  { name: 'Total Market Cap', value: '$2.1T', change: '+1.9%' },
  { name: 'BTC Dominance', value: '45.2%', change: '-0.5%' }
];

export default function DiscoverPage() {
  const scrollToSection = (sectionId: string) => {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <main className="min-h-screen bg-background pt-16">
      {/* Hero Section */}
      <section className="relative py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="text-4xl font-bold text-foreground sm:text-5xl">
              Discover Advanced Trading Features
            </h1>
            <p className="mt-4 text-xl text-muted-foreground">
              Explore our suite of powerful trading tools and market insights
            </p>
          </div>
        </div>
      </section>

      {/* Market Trends */}
      <section id="market-trends" className="py-12 bg-card/30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-2xl font-bold text-foreground mb-6">Market Trends</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {marketTrends.map((trend) => (
              <motion.div
                key={trend.name}
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="bg-card rounded-lg p-6 border border-border"
              >
                <h3 className="text-sm font-medium text-muted-foreground mb-2">{trend.name}</h3>
                <div className="flex justify-between items-baseline">
                  <span className="text-2xl font-bold text-foreground">{trend.value}</span>
                  <span className={`text-sm ${trend.change.startsWith('+') ? 'text-green-500' : 'text-red-500'}`}>
                    {trend.change}
                  </span>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Grid */}
      <section id="trading-features" className="py-16 bg-background">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {features.map((feature, index) => (
              <motion.div
                key={feature.title}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className="relative group rounded-2xl bg-card p-8 hover:bg-accent transition-colors border border-border"
              >
                <div className="flex items-start gap-4">
                  <div className={`p-3 rounded-lg bg-card/50 ${feature.color}`}>
                    <feature.icon className="w-6 h-6" />
                  </div>
                  <div className="flex-1">
                    <h3 className="text-xl font-semibold text-foreground">{feature.title}</h3>
                    <p className="mt-2 text-muted-foreground">{feature.description}</p>
                    <p className="mt-4 text-sm text-foreground font-medium">{feature.details}</p>
                    <p className="mt-2 text-sm text-muted-foreground">{feature.subtext}</p>
                    <Button 
                      variant="outline" 
                      className="mt-4 w-full"
                      onClick={() => scrollToSection(feature.title.toLowerCase().replace(' ', '-'))}
                    >
                      Learn More
                    </Button>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Social and Wallet Tracking */}
      <section id="tracking-features" className="py-16 bg-card/30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              id="social-tracker"
              className="bg-card rounded-2xl p-8 border border-border"
            >
              <div className="flex items-center gap-4 mb-6">
                <div className="p-3 rounded-lg bg-blue-500/10 text-blue-500">
                  <Users className="w-6 h-6" />
                </div>
                <h3 className="text-xl font-semibold text-foreground">Social Tracker</h3>
              </div>
              <p className="text-muted-foreground mb-4">
                Track influential traders and their positions in real-time. Get insights from the community and stay ahead of market movements.
              </p>
              <ul className="space-y-3 mb-6">
                <li className="flex items-center text-sm text-muted-foreground">
                  <ArrowRight className="w-4 h-4 mr-2 text-blue-500" />
                  Follow top traders and their strategies
                </li>
                <li className="flex items-center text-sm text-muted-foreground">
                  <ArrowRight className="w-4 h-4 mr-2 text-blue-500" />
                  Real-time position updates and notifications
                </li>
                <li className="flex items-center text-sm text-muted-foreground">
                  <ArrowRight className="w-4 h-4 mr-2 text-blue-500" />
                  Community sentiment analysis
                </li>
              </ul>
              <Button 
                variant="outline" 
                className="w-full"
                asChild
              >
                <Link href="/social">Explore Social Features</Link>
              </Button>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              id="wallet-tracker"
              className="bg-card rounded-2xl p-8 border border-border"
            >
              <div className="flex items-center gap-4 mb-6">
                <div className="p-3 rounded-lg bg-green-500/10 text-green-500">
                  <Wallet className="w-6 h-6" />
                </div>
                <h3 className="text-xl font-semibold text-foreground">Wallet Tracker</h3>
              </div>
              <p className="text-muted-foreground mb-4">
                Monitor whale wallets and smart money movements. Get alerts on significant transactions and token transfers.
              </p>
              <ul className="space-y-3 mb-6">
                <li className="flex items-center text-sm text-muted-foreground">
                  <ArrowRight className="w-4 h-4 mr-2 text-green-500" />
                  Track whale wallet movements
                </li>
                <li className="flex items-center text-sm text-muted-foreground">
                  <ArrowRight className="w-4 h-4 mr-2 text-green-500" />
                  Smart money flow analysis
                </li>
                <li className="flex items-center text-sm text-muted-foreground">
                  <ArrowRight className="w-4 h-4 mr-2 text-green-500" />
                  Custom wallet alerts and notifications
                </li>
              </ul>
              <Button 
                variant="outline" 
                className="w-full"
                asChild
              >
                <Link href="/portfolio">Start Tracking Wallets</Link>
              </Button>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Popular Tokens */}
      <section id="popular-tokens" className="py-16 bg-background">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center mb-8">
            <h2 className="text-2xl font-bold text-foreground">Popular Tokens</h2>
            <Button 
              variant="outline" 
              size="sm"
              asChild
            >
              <Link href="/trade">View All Tokens</Link>
            </Button>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {popularTokens.map((token) => (
              <motion.div
                key={token.symbol}
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="bg-card rounded-lg p-6 border border-border hover:border-primary transition-colors"
              >
                <div className="flex justify-between items-center mb-4">
                  <h3 className="text-lg font-semibold text-foreground">{token.name}</h3>
                  <span className="text-sm text-muted-foreground">{token.symbol}</span>
                </div>
                <div className="flex justify-between items-end">
                  <div>
                    <span className="text-2xl font-bold text-foreground">${token.price}</span>
                    <div className="text-xs text-muted-foreground mt-1">
                      Vol: ${token.volume}
                    </div>
                  </div>
                  <span className={`text-sm ${token.change.startsWith('+') ? 'text-green-500' : 'text-red-500'}`}>
                    {token.change}
                  </span>
                </div>
              </motion.div>
            ))}
          </div>
          <div className="mt-12 text-center">
            <Button asChild size="lg" className="bg-primary text-primary-foreground">
              <Link href="/trade">Start Trading</Link>
            </Button>
          </div>
        </div>
      </section>
    </main>
  );
} 