'use client';

import { useState } from 'react';
import { useAccount } from 'wagmi';
import { Button } from '@/components/ui/button';
import { MessageSquare, TrendingUp, Users } from 'lucide-react';
import { WalletFallback } from '@/components/ui/wallet-fallback';

interface TradePost {
  id: string;
  user: {
    name: string;
    avatar: string;
  };
  token: string;
  type: 'buy' | 'sell';
  amount: string;
  price: string;
  timestamp: string;
  likes: number;
  comments: number;
}

export default function SocialPage() {
  const { isConnected } = useAccount();
  const [activeTab, setActiveTab] = useState<'feed' | 'leaderboard' | 'following'>('feed');
  
  // Sample data - replace with real data from API
  const [posts, setPosts] = useState<TradePost[]>([
    {
      id: '1',
      user: {
        name: 'CryptoWhale',
        avatar: '🐋',
      },
      token: 'ETH',
      type: 'buy',
      amount: '2.5',
      price: '$1,850',
      timestamp: '2 hours ago',
      likes: 24,
      comments: 5,
    },
    {
      id: '2',
      user: {
        name: 'DeFiMaster',
        avatar: '🧙‍♂️',
      },
      token: 'USDC',
      type: 'sell',
      amount: '10,000',
      price: '$1.00',
      timestamp: '5 hours ago',
      likes: 18,
      comments: 3,
    },
  ]);

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="mb-8 text-3xl font-bold">Social Trading</h1>
      
      {!isConnected ? (
        <WalletFallback message="Connect your wallet to view the social feed and interact with other traders." />
      ) : (
        <div className="grid gap-6 lg:grid-cols-12">
          {/* Main Content */}
          <div className="lg:col-span-8">
            {/* Tabs */}
            <div className="mb-6 flex space-x-4 border-b border-gray-800">
              <button
                className={`flex items-center space-x-2 border-b-2 px-4 py-2 ${
                  activeTab === 'feed'
                    ? 'border-primary text-primary'
                    : 'border-transparent text-gray-400 hover:text-white'
                }`}
                onClick={() => setActiveTab('feed')}
              >
                <MessageSquare className="h-4 w-4" />
                <span>Feed</span>
              </button>
              <button
                className={`flex items-center space-x-2 border-b-2 px-4 py-2 ${
                  activeTab === 'leaderboard'
                    ? 'border-primary text-primary'
                    : 'border-transparent text-gray-400 hover:text-white'
                }`}
                onClick={() => setActiveTab('leaderboard')}
              >
                <TrendingUp className="h-4 w-4" />
                <span>Leaderboard</span>
              </button>
              <button
                className={`flex items-center space-x-2 border-b-2 px-4 py-2 ${
                  activeTab === 'following'
                    ? 'border-primary text-primary'
                    : 'border-transparent text-gray-400 hover:text-white'
                }`}
                onClick={() => setActiveTab('following')}
              >
                <Users className="h-4 w-4" />
                <span>Following</span>
              </button>
            </div>

            {/* Feed Content */}
            {activeTab === 'feed' && (
              <div className="space-y-4">
                {posts.map((post) => (
                  <div key={post.id} className="rounded-lg bg-card p-4">
                    <div className="mb-4 flex items-center justify-between">
                      <div className="flex items-center">
                        <span className="mr-2 text-2xl">{post.user.avatar}</span>
                        <div>
                          <p className="font-medium">{post.user.name}</p>
                          <p className="text-xs text-gray-400">{post.timestamp}</p>
                        </div>
                      </div>
                      <div
                        className={`rounded-full px-3 py-1 text-xs font-medium ${
                          post.type === 'buy'
                            ? 'bg-success/20 text-success'
                            : 'bg-destructive/20 text-destructive'
                        }`}
                      >
                        {post.type === 'buy' ? 'Bought' : 'Sold'} {post.token}
                      </div>
                    </div>
                    <div className="mb-4 grid grid-cols-2 gap-4">
                      <div className="rounded-lg bg-background p-3">
                        <p className="text-sm text-gray-400">Amount</p>
                        <p className="text-lg font-medium">{post.amount}</p>
                      </div>
                      <div className="rounded-lg bg-background p-3">
                        <p className="text-sm text-gray-400">Price</p>
                        <p className="text-lg font-medium">{post.price}</p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-4">
                      <button className="flex items-center space-x-1 text-gray-400 hover:text-white">
                        <span>👍</span>
                        <span className="text-sm">{post.likes}</span>
                      </button>
                      <button className="flex items-center space-x-1 text-gray-400 hover:text-white">
                        <span>💬</span>
                        <span className="text-sm">{post.comments}</span>
                      </button>
                      <button className="ml-auto rounded-md bg-primary px-3 py-1 text-sm text-white">
                        Copy Trade
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* Leaderboard Content */}
            {activeTab === 'leaderboard' && (
              <div className="rounded-lg bg-card p-4">
                <h2 className="mb-4 text-xl font-semibold">Top Traders</h2>
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b border-gray-800">
                        <th className="py-3 text-left text-sm font-medium text-gray-400">Rank</th>
                        <th className="py-3 text-left text-sm font-medium text-gray-400">Trader</th>
                        <th className="py-3 text-right text-sm font-medium text-gray-400">ROI</th>
                        <th className="py-3 text-right text-sm font-medium text-gray-400">Followers</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr className="border-b border-gray-800">
                        <td className="py-4">
                          <span className="flex h-6 w-6 items-center justify-center rounded-full bg-primary text-xs font-bold text-white">
                            1
                          </span>
                        </td>
                        <td className="py-4">
                          <div className="flex items-center">
                            <span className="mr-2 text-xl">👑</span>
                            <span className="font-medium">CryptoWhale</span>
                          </div>
                        </td>
                        <td className="py-4 text-right text-success">+125.4%</td>
                        <td className="py-4 text-right">1,234</td>
                      </tr>
                      <tr className="border-b border-gray-800">
                        <td className="py-4">
                          <span className="flex h-6 w-6 items-center justify-center rounded-full bg-gray-700 text-xs font-bold text-white">
                            2
                          </span>
                        </td>
                        <td className="py-4">
                          <div className="flex items-center">
                            <span className="mr-2 text-xl">🧙‍♂️</span>
                            <span className="font-medium">DeFiMaster</span>
                          </div>
                        </td>
                        <td className="py-4 text-right text-success">+98.7%</td>
                        <td className="py-4 text-right">987</td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {/* Following Content */}
            {activeTab === 'following' && (
              <div className="rounded-lg bg-card p-4">
                <h2 className="mb-4 text-xl font-semibold">Following</h2>
                <div className="flex items-center justify-center rounded-lg bg-background p-8 text-center">
                  <p className="text-gray-400">You are not following any traders yet</p>
                </div>
              </div>
            )}
          </div>

          {/* Sidebar */}
          <div className="lg:col-span-4">
            <div className="rounded-lg bg-card p-4">
              <h2 className="mb-4 text-xl font-semibold">Trending Tokens</h2>
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <span className="mr-2 text-lg">⟠</span>
                    <span className="font-medium">ETH</span>
                  </div>
                  <div className="text-right">
                    <p className="font-medium">$1,850.42</p>
                    <p className="text-xs text-success">+2.4%</p>
                  </div>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <span className="mr-2 text-lg">₿</span>
                    <span className="font-medium">WBTC</span>
                  </div>
                  <div className="text-right">
                    <p className="font-medium">$36,420.18</p>
                    <p className="text-xs text-success">+1.8%</p>
                  </div>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <span className="mr-2 text-lg">$</span>
                    <span className="font-medium">USDC</span>
                  </div>
                  <div className="text-right">
                    <p className="font-medium">$1.00</p>
                    <p className="text-xs text-gray-400">+0.0%</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
} 