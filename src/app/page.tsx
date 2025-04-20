'use client';

import { motion } from 'framer-motion';
import { ArrowRight, Bot, LineChart, Users, Wallet, ChevronRight, Star, Shield, Zap } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useConnectModal } from '@rainbow-me/rainbowkit';
import Link from 'next/link';
import Image from 'next/image';
import { useState, useEffect } from 'react';
import { IntroAnimation } from '@/components/intro-animation';

// Animation variants for sections
const sectionVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.6,
      ease: "easeOut"
    }
  }
};

// Animation variants for cards with stagger effect
const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
      delayChildren: 0.2
    }
  }
};

const cardVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.5,
      ease: "easeOut"
    }
  }
};

export default function Home() {
  const { openConnectModal } = useConnectModal();
  const [showIntro, setShowIntro] = useState(true);
  const [showContent, setShowContent] = useState(false);

  // Handle animation complete
  const handleIntroComplete = () => {
    setShowIntro(false);
    setTimeout(() => setShowContent(true), 500);
  };

  // Prevent content flash before intro
  useEffect(() => {
    document.body.style.overflow = showIntro ? 'hidden' : 'auto';
    return () => {
      document.body.style.overflow = 'auto';
    };
  }, [showIntro]);

  if (!showContent && showIntro) {
    return <IntroAnimation onComplete={handleIntroComplete} />;
  }

  return (
    <motion.main
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="flex min-h-screen flex-col items-center bg-background text-foreground"
    >
      {/* Hero Section */}
      <motion.section
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: "-100px" }}
        variants={sectionVariants}
        className="relative w-full min-h-screen flex items-center justify-center overflow-hidden bg-gradient-to-b from-background to-background/80"
      >
        <div className="absolute inset-0 w-full h-full bg-grid-white/[0.02] bg-[size:60px_60px]" />
        <div className="absolute pointer-events-none inset-0 flex items-center justify-center bg-background [mask-image:radial-gradient(ellipse_at_center,transparent_20%,black)]" />
        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 text-center lg:text-left">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={sectionVariants}
            className="lg:grid lg:grid-cols-2 lg:gap-8 items-center"
          >
            <div>
              <h1 className="text-4xl font-bold tracking-tight text-foreground sm:text-6xl lg:text-7xl">
                <span className="block">Trade Smarter.</span>
                <span className="block text-primary">Together.</span>
              </h1>
              <p className="mt-6 text-lg leading-8 text-muted-foreground max-w-3xl">
                Experience the future of decentralized trading with AI-powered insights, 
                real-time social collaboration, and advanced portfolio management.
              </p>
              <div className="mt-10 flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
                <Link href="/trade">
                  <Button size="lg" className="bg-primary text-primary-foreground text-lg px-8 h-12">
                    Start Trading <ArrowRight className="ml-2" />
                  </Button>
                </Link>
                <Link href="/discover">
                  <Button size="lg" variant="outline" className="text-lg px-8 h-12">
                    Explore Features <ChevronRight className="ml-2" />
                  </Button>
                </Link>
              </div>
            </div>
            <div className="mt-16 lg:mt-0">
              <div className="relative h-[400px] w-full rounded-lg overflow-hidden bg-card border border-border">
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="relative w-full h-full">
                    <Image
                      src="/trading-preview.png"
                      alt="Trading Interface Preview"
                      fill
                      className="object-cover"
                      priority
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-background/80 to-transparent" />
                  </div>
                </div>
                <div className="absolute -bottom-6 -right-6 w-64 h-48">
                  <Image
                    src="/trading-preview-2.png"
                    alt="Chart Preview"
                    width={256}
                    height={192}
                    className="rounded-lg shadow-xl transform rotate-6"
                  />
                </div>
                <div className="absolute -top-4 -left-4 w-48 h-32">
                  <Image
                    src="/trading-preview-3.png"
                    alt="Analytics Preview"
                    width={192}
                    height={128}
                    className="rounded-lg shadow-xl transform -rotate-6"
                  />
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </motion.section>

      {/* Features Section */}
      <motion.section
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: "-100px" }}
        variants={sectionVariants}
        className="w-full py-24 bg-card"
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            variants={sectionVariants}
            className="text-center mb-16"
          >
            <h2 className="text-3xl font-bold text-foreground sm:text-4xl">
              Powered by Advanced Technology
            </h2>
            <p className="mt-4 text-lg text-muted-foreground">
              Cutting-edge features designed for modern traders
            </p>
          </motion.div>

          <motion.div
            variants={containerVariants}
            className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3"
          >
            <motion.div
              variants={cardVariants}
              whileHover={{ scale: 1.02, transition: { duration: 0.2 } }}
              className="group relative flex flex-col gap-6 rounded-2xl bg-card p-8 hover:bg-accent transition-colors duration-300 border border-border/50"
            >
              <div className="flex h-16 w-16 items-center justify-center rounded-full bg-primary/20 group-hover:bg-primary/30 transition-colors duration-300">
                <Bot className="h-8 w-8 text-primary" />
              </div>
              <div>
                <h3 className="text-xl font-semibold text-foreground">AI-Powered HFT Bot</h3>
                <p className="mt-2 text-muted-foreground">
                  Lightning-fast trades powered by advanced algorithms and mempool analysis
                </p>
                <ul className="mt-4 space-y-2">
                  <li className="flex items-center text-sm text-muted-foreground">
                    <Zap className="h-4 w-4 text-primary mr-2" />
                    Real-time market analysis
                  </li>
                  <li className="flex items-center text-sm text-muted-foreground">
                    <Shield className="h-4 w-4 text-primary mr-2" />
                    Secure automated trading
                  </li>
                </ul>
              </div>
            </motion.div>

            <motion.div
              variants={cardVariants}
              whileHover={{ scale: 1.02, transition: { duration: 0.2 } }}
              className="group relative flex flex-col gap-6 rounded-2xl bg-card p-8 hover:bg-accent transition-colors duration-300 border border-border/50"
            >
              <div className="flex h-16 w-16 items-center justify-center rounded-full bg-primary/20 group-hover:bg-primary/30 transition-colors duration-300">
                <Users className="h-8 w-8 text-primary" />
              </div>
              <div>
                <h3 className="text-xl font-semibold text-foreground">Social Trading</h3>
                <p className="mt-2 text-muted-foreground">
                  Learn from top traders and share strategies with the community
                </p>
                <ul className="mt-4 space-y-2">
                  <li className="flex items-center text-sm text-muted-foreground">
                    <Star className="h-4 w-4 text-primary mr-2" />
                    Follow top performers
                  </li>
                  <li className="flex items-center text-sm text-muted-foreground">
                    <Users className="h-4 w-4 text-primary mr-2" />
                    Community insights
                  </li>
                </ul>
              </div>
            </motion.div>

            <motion.div
              variants={cardVariants}
              whileHover={{ scale: 1.02, transition: { duration: 0.2 } }}
              className="group relative flex flex-col gap-6 rounded-2xl bg-card p-8 hover:bg-accent transition-colors duration-300 border border-border/50"
            >
              <div className="flex h-16 w-16 items-center justify-center rounded-full bg-primary/20 group-hover:bg-primary/30 transition-colors duration-300">
                <LineChart className="h-8 w-8 text-primary" />
              </div>
              <div>
                <h3 className="text-xl font-semibold text-foreground">Portfolio Analytics</h3>
                <p className="mt-2 text-muted-foreground">
                  Advanced analytics and AI-driven insights for better decision making
                </p>
                <ul className="mt-4 space-y-2">
                  <li className="flex items-center text-sm text-muted-foreground">
                    <LineChart className="h-4 w-4 text-primary mr-2" />
                    Performance tracking
                  </li>
                  <li className="flex items-center text-sm text-muted-foreground">
                    <Bot className="h-4 w-4 text-primary mr-2" />
                    AI recommendations
                  </li>
                </ul>
              </div>
            </motion.div>
          </motion.div>
        </div>
      </motion.section>

      {/* How it Works Section */}
      <motion.section
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: "-100px" }}
        variants={sectionVariants}
        className="w-full py-24 bg-background relative overflow-hidden"
      >
        <motion.div
          className="absolute inset-0 opacity-30"
          animate={{
            backgroundPosition: ['0% 0%', '100% 100%'],
          }}
          transition={{
            duration: 20,
            repeat: Infinity,
            repeatType: 'reverse',
          }}
          style={{
            backgroundImage: 'radial-gradient(circle at center, var(--primary) 0%, transparent 70%)',
          }}
        />
        
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <motion.div
            variants={sectionVariants}
            className="text-center mb-16"
          >
            <h2 className="text-3xl font-bold text-foreground sm:text-4xl">
              How It Works
            </h2>
            <p className="mt-4 text-lg text-muted-foreground">
              Get started with Dexlink in three simple steps
            </p>
          </motion.div>

          <motion.div
            variants={containerVariants}
            className="grid grid-cols-1 gap-8 md:grid-cols-3"
          >
            <motion.div
              variants={cardVariants}
              whileHover={{ scale: 1.02, transition: { duration: 0.2 } }}
              className="relative flex flex-col items-center text-center p-6 rounded-2xl bg-card/50 backdrop-blur-sm border border-border/50"
            >
              <div className="flex h-16 w-16 items-center justify-center rounded-full bg-primary/20 mb-6">
                <Wallet className="h-8 w-8 text-primary" />
              </div>
              <h3 className="text-xl font-semibold text-foreground">1. Connect Wallet</h3>
              <p className="mt-2 text-muted-foreground">
                Securely connect your Web3 wallet to get started
              </p>
            </motion.div>

            <motion.div
              variants={cardVariants}
              whileHover={{ scale: 1.02, transition: { duration: 0.2 } }}
              className="relative flex flex-col items-center text-center p-6 rounded-2xl bg-card/50 backdrop-blur-sm border border-border/50"
            >
              <div className="flex h-16 w-16 items-center justify-center rounded-full bg-primary/20 mb-6">
                <Users className="h-8 w-8 text-primary" />
              </div>
              <h3 className="text-xl font-semibold text-foreground">2. Join Community</h3>
              <p className="mt-2 text-muted-foreground">
                Connect with traders and share strategies
              </p>
            </motion.div>

            <motion.div
              variants={cardVariants}
              whileHover={{ scale: 1.02, transition: { duration: 0.2 } }}
              className="relative flex flex-col items-center text-center p-6 rounded-2xl bg-card/50 backdrop-blur-sm border border-border/50"
            >
              <div className="flex h-16 w-16 items-center justify-center rounded-full bg-primary/20 mb-6">
                <Bot className="h-8 w-8 text-primary" />
              </div>
              <h3 className="text-xl font-semibold text-foreground">3. Start Trading</h3>
              <p className="mt-2 text-muted-foreground">
                Execute trades with AI-powered insights
              </p>
            </motion.div>
          </motion.div>
        </div>
      </motion.section>

      {/* CTA Section */}
      <motion.section
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: "-100px" }}
        variants={sectionVariants}
        className="w-full py-24 bg-card relative overflow-hidden"
      >
        <motion.div
          className="absolute inset-0 opacity-10"
          animate={{
            scale: [1, 1.1, 1],
            opacity: [0.1, 0.2, 0.1],
          }}
          transition={{
            duration: 8,
            repeat: Infinity,
            repeatType: 'reverse',
          }}
          style={{
            backgroundImage: 'radial-gradient(circle at center, var(--primary) 0%, transparent 60%)',
          }}
        />
        
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <motion.div
            variants={sectionVariants}
            className="text-center"
          >
            <h2 className="text-3xl font-bold text-foreground sm:text-4xl">
              Ready to Start Trading?
            </h2>
            <p className="mt-4 text-lg text-muted-foreground max-w-2xl mx-auto">
              Join thousands of traders already using Dexlink for smarter, more profitable trading
            </p>
            <motion.div
              className="mt-10"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              <Button
                size="lg"
                className="bg-primary text-primary-foreground text-lg px-8 h-12"
                onClick={openConnectModal}
              >
                Connect Wallet <Wallet className="ml-2" />
              </Button>
            </motion.div>
          </motion.div>
        </div>
      </motion.section>
    </motion.main>
  );
} 