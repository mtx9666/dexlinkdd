'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  User, 
  TrendingUp, 
  Users, 
  Star, 
  Calendar, 
  BarChart, 
  Copy, 
  MessageSquare,
  Shield,
  Award
} from 'lucide-react';
import { Button } from '@/components/ui/button';

interface TraderStats {
  totalTrades: number;
  winRate: number;
  avgReturn: number;
  followers: number;
  following: number;
  joinedDate: string;
  verified: boolean;
  badges: string[];
}

interface TraderProfileProps {
  trader: {
    id: string;
    name: string;
    avatar: string;
    bio: string;
    stats: TraderStats;
  };
  onFollow: (traderId: string) => void;
  onCopyTrade: (traderId: string) => void;
  isFollowing: boolean;
}

export default function TraderProfile({ 
  trader, 
  onFollow, 
  onCopyTrade, 
  isFollowing 
}: TraderProfileProps) {
  const [activeTab, setActiveTab] = useState<'overview' | 'performance' | 'trades'>('overview');

  return (
    <div className="rounded-lg bg-card overflow-hidden">
      {/* Profile Header */}
      <div className="relative h-32 bg-gradient-to-r from-primary/20 to-primary/5">
        <div className="absolute -bottom-12 left-6 flex items-end">
          <div className="flex h-24 w-24 items-center justify-center rounded-full border-4 border-background bg-background text-3xl">
            {trader.avatar}
          </div>
          {trader.stats.verified && (
            <div className="ml-2 rounded-full bg-primary p-1">
              <Shield className="h-4 w-4 text-white" />
            </div>
          )}
        </div>
      </div>

      {/* Profile Info */}
      <div className="mt-16 p-6">
        <div className="flex items-start justify-between">
          <div>
            <h2 className="text-xl font-bold">{trader.name}</h2>
            <p className="text-sm text-gray-400">{trader.bio}</p>
          </div>
          <div className="flex space-x-2">
            <Button 
              variant={isFollowing ? "outline" : "default"}
              size="sm"
              onClick={() => onFollow(trader.id)}
            >
              {isFollowing ? "Following" : "Follow"}
            </Button>
            <Button 
              variant="outline" 
              size="sm"
              onClick={() => onCopyTrade(trader.id)}
            >
              <Copy className="mr-2 h-4 w-4" />
              Copy
            </Button>
          </div>
        </div>

        {/* Stats */}
        <div className="mt-6 grid grid-cols-2 gap-4 sm:grid-cols-4">
          <div className="rounded-lg bg-background p-3">
            <p className="text-sm text-gray-400">Total Trades</p>
            <p className="text-lg font-medium">{trader.stats.totalTrades}</p>
          </div>
          <div className="rounded-lg bg-background p-3">
            <p className="text-sm text-gray-400">Win Rate</p>
            <p className="text-lg font-medium text-success">{trader.stats.winRate}%</p>
          </div>
          <div className="rounded-lg bg-background p-3">
            <p className="text-sm text-gray-400">Avg Return</p>
            <p className="text-lg font-medium text-success">+{trader.stats.avgReturn}%</p>
          </div>
          <div className="rounded-lg bg-background p-3">
            <p className="text-sm text-gray-400">Followers</p>
            <p className="text-lg font-medium">{trader.stats.followers}</p>
          </div>
        </div>

        {/* Badges */}
        {trader.stats.badges.length > 0 && (
          <div className="mt-6">
            <h3 className="mb-2 text-sm font-medium text-gray-400">Badges</h3>
            <div className="flex flex-wrap gap-2">
              {trader.stats.badges.map((badge, index) => (
                <div 
                  key={index} 
                  className="flex items-center rounded-full bg-primary/10 px-3 py-1 text-xs"
                >
                  <Award className="mr-1 h-3 w-3 text-primary" />
                  {badge}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Tabs */}
        <div className="mt-6 flex space-x-4 border-b border-gray-800">
          <button
            className={`flex items-center space-x-2 border-b-2 px-4 py-2 ${
              activeTab === 'overview'
                ? 'border-primary text-primary'
                : 'border-transparent text-gray-400 hover:text-white'
            }`}
            onClick={() => setActiveTab('overview')}
          >
            <User className="h-4 w-4" />
            <span>Overview</span>
          </button>
          <button
            className={`flex items-center space-x-2 border-b-2 px-4 py-2 ${
              activeTab === 'performance'
                ? 'border-primary text-primary'
                : 'border-transparent text-gray-400 hover:text-white'
            }`}
            onClick={() => setActiveTab('performance')}
          >
            <BarChart className="h-4 w-4" />
            <span>Performance</span>
          </button>
          <button
            className={`flex items-center space-x-2 border-b-2 px-4 py-2 ${
              activeTab === 'trades'
                ? 'border-primary text-primary'
                : 'border-transparent text-gray-400 hover:text-white'
            }`}
            onClick={() => setActiveTab('trades')}
          >
            <TrendingUp className="h-4 w-4" />
            <span>Recent Trades</span>
          </button>
        </div>

        {/* Tab Content */}
        <div className="mt-4">
          {activeTab === 'overview' && (
            <div className="space-y-4">
              <div className="flex items-center text-sm text-gray-400">
                <Calendar className="mr-2 h-4 w-4" />
                <span>Joined {trader.stats.joinedDate}</span>
              </div>
              <div className="flex items-center text-sm text-gray-400">
                <Users className="mr-2 h-4 w-4" />
                <span>Following {trader.stats.following} traders</span>
              </div>
              <div className="flex items-center text-sm text-gray-400">
                <Star className="mr-2 h-4 w-4" />
                <span>Top {Math.floor(trader.stats.followers / 100)}% trader</span>
              </div>
            </div>
          )}

          {activeTab === 'performance' && (
            <div className="h-64 rounded-lg bg-background p-4">
              <p className="text-center text-gray-400">Performance chart will be displayed here</p>
            </div>
          )}

          {activeTab === 'trades' && (
            <div className="space-y-2">
              <p className="text-center text-gray-400">Recent trades will be displayed here</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
} 