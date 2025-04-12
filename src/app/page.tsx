'use client';

import { Button } from '@/components/ui/button';
import { useConnectModal } from '@rainbow-me/rainbowkit';
import { ArrowRight, Bot, LineChart, Users, Wallet, ChevronRight, Star, Shield, Zap } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import { motion, Variants } from 'framer-motion';

const fadeIn: Variants = {
  initial: { 
    opacity: 0, 
    y: 20 
  },
  animate: { 
    opacity: 1, 
    y: 0,
    transition: {
      duration: 0.6
    }
  }
};

export default function Home() {
  const { openConnectModal } = useConnectModal();

  return (
    <main className="flex min-h-screen flex-col items-center">
      {/* Hero Section */}
      <section className="relative w-full min-h-screen flex items-center justify-center overflow-hidden bg-gradient-to-b from-background to-background/80">
        <div className="absolute inset-0 w-full h-full bg-grid-white/[0.02] bg-[size:60px_60px]" />
        <div className="absolute pointer-events-none inset-0 flex items-center justify-center bg-background [mask-image:radial-gradient(ellipse_at_center,transparent_20%,black)]" />
        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 text-center lg:text-left">
          <motion.div
            initial="initial"
            animate="animate"
            variants={fadeIn}
            className="lg:grid lg:grid-cols-2 lg:gap-8 items-center"
          >
            <div>
              <h1 className="text-4xl font-bold tracking-tight text-white sm:text-6xl lg:text-7xl">
                <span className="block">Trade Smarter.</span>
                <span className="block text-primary">Together.</span>
              </h1>
              <p className="mt-6 text-lg leading-8 text-gray-300 max-w-3xl">
                Experience the future of decentralized trading with AI-powered insights, 
                real-time social collaboration, and advanced portfolio management.
              </p>
              <div className="mt-10 flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
                <Button size="lg" className="bg-primary text-white text-lg px-8 h-12">
                  Start Trading <ArrowRight className="ml-2" />
                </Button>
                <Button size="lg" variant="outline" className="text-lg px-8 h-12">
                  Explore Features <ChevronRight className="ml-2" />
                </Button>
              </div>
            </div>
            <div className="mt-16 lg:mt-0">
              <div className="relative h-[400px] w-full rounded-lg overflow-hidden bg-background/50 border border-white/10">
                {/* Add trading interface preview or animation here */}
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Features Section */}
      <section className="w-full py-24 bg-black/40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial="initial"
            whileInView="animate"
            viewport={{ once: true }}
            variants={fadeIn}
            className="text-center mb-16"
          >
            <h2 className="text-3xl font-bold text-white sm:text-4xl">
              Powered by Advanced Technology
            </h2>
            <p className="mt-4 text-lg text-gray-400">
              Cutting-edge features designed for modern traders
            </p>
          </motion.div>

          <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3">
            <motion.div
              initial="initial"
              whileInView="animate"
              viewport={{ once: true }}
              variants={fadeIn}
              className="group relative flex flex-col gap-6 rounded-2xl bg-white/5 p-8 hover:bg-white/10 transition-colors"
            >
              <div className="flex h-16 w-16 items-center justify-center rounded-full bg-primary/20 group-hover:bg-primary/30 transition-colors">
                <Bot className="h-8 w-8 text-primary" />
              </div>
              <div>
                <h3 className="text-xl font-semibold text-white">AI-Powered HFT Bot</h3>
                <p className="mt-2 text-gray-400">
                  Lightning-fast trades powered by advanced algorithms and mempool analysis
                </p>
                <ul className="mt-4 space-y-2">
                  <li className="flex items-center text-sm text-gray-400">
                    <Zap className="h-4 w-4 text-primary mr-2" />
                    Real-time market analysis
                  </li>
                  <li className="flex items-center text-sm text-gray-400">
                    <Shield className="h-4 w-4 text-primary mr-2" />
                    Secure automated trading
                  </li>
                </ul>
              </div>
            </motion.div>

            <motion.div
              initial="initial"
              whileInView="animate"
              viewport={{ once: true }}
              variants={fadeIn}
              className="group relative flex flex-col gap-6 rounded-2xl bg-white/5 p-8 hover:bg-white/10 transition-colors"
            >
              <div className="flex h-16 w-16 items-center justify-center rounded-full bg-primary/20 group-hover:bg-primary/30 transition-colors">
                <Users className="h-8 w-8 text-primary" />
              </div>
              <div>
                <h3 className="text-xl font-semibold text-white">Social Trading</h3>
                <p className="mt-2 text-gray-400">
                  Learn from top traders and share strategies with the community
                </p>
                <ul className="mt-4 space-y-2">
                  <li className="flex items-center text-sm text-gray-400">
                    <Star className="h-4 w-4 text-primary mr-2" />
                    Follow top performers
                  </li>
                  <li className="flex items-center text-sm text-gray-400">
                    <Users className="h-4 w-4 text-primary mr-2" />
                    Community insights
                  </li>
                </ul>
              </div>
            </motion.div>

            <motion.div
              initial="initial"
              whileInView="animate"
              viewport={{ once: true }}
              variants={fadeIn}
              className="group relative flex flex-col gap-6 rounded-2xl bg-white/5 p-8 hover:bg-white/10 transition-colors"
            >
              <div className="flex h-16 w-16 items-center justify-center rounded-full bg-primary/20 group-hover:bg-primary/30 transition-colors">
                <LineChart className="h-8 w-8 text-primary" />
              </div>
              <div>
                <h3 className="text-xl font-semibold text-white">Portfolio Analytics</h3>
                <p className="mt-2 text-gray-400">
                  Advanced analytics and AI-driven insights for better decision making
                </p>
                <ul className="mt-4 space-y-2">
                  <li className="flex items-center text-sm text-gray-400">
                    <LineChart className="h-4 w-4 text-primary mr-2" />
                    Performance tracking
                  </li>
                  <li className="flex items-center text-sm text-gray-400">
                    <Bot className="h-4 w-4 text-primary mr-2" />
                    AI recommendations
                  </li>
                </ul>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* How it Works Section */}
      <section className="w-full py-24 bg-black/20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial="initial"
            whileInView="animate"
            viewport={{ once: true }}
            variants={fadeIn}
            className="text-center mb-16"
          >
            <h2 className="text-3xl font-bold text-white sm:text-4xl">
              How It Works
            </h2>
            <p className="mt-4 text-lg text-gray-400">
              Get started with Dexlink in three simple steps
            </p>
          </motion.div>

          <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
            <motion.div
              initial="initial"
              whileInView="animate"
              viewport={{ once: true }}
              variants={fadeIn}
              className="relative flex flex-col items-center text-center"
            >
              <div className="flex h-16 w-16 items-center justify-center rounded-full bg-primary/20 mb-6">
                <Wallet className="h-8 w-8 text-primary" />
              </div>
              <h3 className="text-xl font-semibold text-white">1. Connect Wallet</h3>
              <p className="mt-2 text-gray-400">
                Securely connect your Web3 wallet to get started
              </p>
            </motion.div>

            <motion.div
              initial="initial"
              whileInView="animate"
              viewport={{ once: true }}
              variants={fadeIn}
              className="relative flex flex-col items-center text-center"
            >
              <div className="flex h-16 w-16 items-center justify-center rounded-full bg-primary/20 mb-6">
                <Users className="h-8 w-8 text-primary" />
              </div>
              <h3 className="text-xl font-semibold text-white">2. Join Community</h3>
              <p className="mt-2 text-gray-400">
                Connect with traders and share strategies
              </p>
            </motion.div>

            <motion.div
              initial="initial"
              whileInView="animate"
              viewport={{ once: true }}
              variants={fadeIn}
              className="relative flex flex-col items-center text-center"
            >
              <div className="flex h-16 w-16 items-center justify-center rounded-full bg-primary/20 mb-6">
                <Bot className="h-8 w-8 text-primary" />
              </div>
              <h3 className="text-xl font-semibold text-white">3. Start Trading</h3>
              <p className="mt-2 text-gray-400">
                Execute trades with AI-powered insights
              </p>
            </motion.div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="w-full py-24 bg-black/40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial="initial"
            whileInView="animate"
            viewport={{ once: true }}
            variants={fadeIn}
            className="text-center"
          >
            <h2 className="text-3xl font-bold text-white sm:text-4xl">
              Ready to Start Trading?
            </h2>
            <p className="mt-4 text-lg text-gray-400 max-w-2xl mx-auto">
              Join thousands of traders already using Dexlink for smarter, more profitable trading
            </p>
            <div className="mt-10">
              <Button size="lg" className="bg-primary text-white text-lg px-8 h-12" onClick={openConnectModal}>
                Connect Wallet <Wallet className="ml-2" />
              </Button>
            </div>
          </motion.div>
        </div>
      </section>
    </main>
  );
} 