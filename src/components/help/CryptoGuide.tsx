'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronDown, ChevronUp, Book, Coins, Wallet, Zap, Network, Shield, Bot, Users, LineChart } from 'lucide-react';

interface GuideSection {
  title: string;
  icon: React.ReactNode;
  content: string[];
}

const guideSections: GuideSection[] = [
  {
    title: "What is Blockchain?",
    icon: <Network className="w-6 h-6" />,
    content: [
      "Blockchain is a decentralized digital ledger that records transactions across a network of computers.",
      "Each block contains transaction data and is linked to previous blocks, forming a chain.",
      "The network is maintained by nodes (computers) that validate and record transactions.",
      "Blockchain is immutable, meaning once data is recorded, it cannot be altered.",
    ]
  },
  {
    title: "Understanding Cryptocurrency",
    icon: <Coins className="w-6 h-6" />,
    content: [
      "Cryptocurrency is digital money that uses cryptography for security.",
      "Bitcoin was the first cryptocurrency, created in 2009.",
      "There are thousands of cryptocurrencies, each with different purposes and features.",
      "Cryptocurrencies can be used for payments, investments, or as utility tokens.",
    ]
  },
  {
    title: "Wallets and Security",
    icon: <Wallet className="w-6 h-6" />,
    content: [
      "A crypto wallet stores your private keys, which give access to your cryptocurrencies.",
      "Types of wallets: Hardware (most secure), Software, and Web wallets.",
      "Never share your private keys or seed phrase with anyone.",
      "Enable two-factor authentication when available.",
      "Keep backups of your wallet information in a secure location.",
    ]
  },
  {
    title: "Gas Fees and Transaction Costs",
    icon: <Zap className="w-6 h-6" />,
    content: [
      "Gas fees are payments made to network validators for processing transactions.",
      "Fees vary based on network congestion and transaction complexity.",
      "Higher gas fees can make transactions process faster.",
      "Different blockchains have different fee structures.",
      "Always check gas fees before making transactions.",
    ]
  },
  {
    title: "Trading Basics",
    icon: <LineChart className="w-6 h-6" />,
    content: [
      "Trading involves buying and selling cryptocurrencies for profit.",
      "Key terms: Market order, Limit order, Stop-loss, Take-profit.",
      "Always do your own research (DYOR) before trading.",
      "Start with small amounts while learning.",
      "Understand the risks involved in trading.",
    ]
  },
  {
    title: "Dexlink Features",
    icon: <Bot className="w-6 h-6" />,
    content: [
      "AI-Powered Trading: Our bot analyzes market data to suggest trades.",
      "Social Trading: Follow and learn from successful traders.",
      "Portfolio Analytics: Track your performance and get insights.",
      "Real-time Charts: Monitor price movements and trends.",
      "Secure Wallet Integration: Connect your wallet safely.",
    ]
  }
];

export default function CryptoGuide() {
  const [openSection, setOpenSection] = useState<number | null>(0);

  return (
    <div className="max-w-4xl mx-auto p-6">
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold mb-4">Crypto Trading Guide</h1>
        <p className="text-gray-400">Everything you need to know to get started with cryptocurrency trading</p>
      </div>

      <div className="space-y-4">
        {guideSections.map((section, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            className="bg-white/5 rounded-lg overflow-hidden"
          >
            <button
              onClick={() => setOpenSection(openSection === index ? null : index)}
              className="w-full p-6 flex items-center justify-between hover:bg-white/10 transition-colors"
            >
              <div className="flex items-center space-x-4">
                <div className="p-2 bg-primary/20 rounded-lg">
                  {section.icon}
                </div>
                <h2 className="text-xl font-semibold">{section.title}</h2>
              </div>
              {openSection === index ? <ChevronUp /> : <ChevronDown />}
            </button>

            <AnimatePresence>
              {openSection === index && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: "auto", opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  transition={{ duration: 0.3 }}
                  className="px-6 pb-6"
                >
                  <ul className="space-y-3">
                    {section.content.map((item, itemIndex) => (
                      <li key={itemIndex} className="flex items-start space-x-3">
                        <div className="w-1.5 h-1.5 rounded-full bg-primary mt-2" />
                        <p className="text-gray-300">{item}</p>
                      </li>
                    ))}
                  </ul>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        ))}
      </div>

      <div className="mt-12 p-6 bg-primary/10 rounded-lg">
        <h3 className="text-xl font-semibold mb-4">Ready to Start Trading?</h3>
        <p className="text-gray-300 mb-4">
          Now that you understand the basics, you're ready to start your trading journey with Dexlink.
          Remember to always trade responsibly and never invest more than you can afford to lose.
        </p>
        <button className="bg-primary text-white px-6 py-2 rounded-lg hover:bg-primary/90 transition-colors">
          Start Trading
        </button>
      </div>
    </div>
  );
} 