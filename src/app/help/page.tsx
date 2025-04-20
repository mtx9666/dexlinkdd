'use client';

import CryptoGuide from '@/components/help/CryptoGuide';
import { motion } from 'framer-motion';

export default function HelpPage() {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="min-h-screen bg-background"
    >
      <CryptoGuide />
    </motion.div>
  );
} 