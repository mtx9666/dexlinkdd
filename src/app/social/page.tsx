'use client';

import { useState } from 'react';
import { useAccount } from 'wagmi';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { MessageSquare, TrendingUp, Users, Signal, Edit2, Save, User } from 'lucide-react';
import { WalletFallback } from '@/components/ui/wallet-fallback';
import TradeSignals, { TradeSignal } from '@/components/social/trade-signals';

interface UserProfile {
  name: string;
  bio: string;
  avatar: string;
  tradingStyle: string;
  experience: 'beginner' | 'intermediate' | 'advanced';
  preferredPairs: string[];
}

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

const sampleSignals: TradeSignal[] = [
  {
    id: '1',
    trader: {
      id: 'trader1',
      name: 'John Doe',
      avatar: '/avatars/trader1.jpg'
    },
    symbol: 'BTC/USDT',
    side: 'long',
    entryPrice: 45000,
    stopLoss: 44000,
    takeProfit: 48000,
    leverage: 10,
    riskLevel: 'medium',
    status: 'active',
    description: 'Strong bullish momentum after breakout from key resistance.',
    timestamp: Date.now()
  },
  {
    id: '2',
    trader: {
      id: 'trader2', 
      name: 'Jane Smith',
      avatar: '/avatars/trader2.jpg'
    },
    symbol: 'ETH/USDT',
    side: 'short',
    entryPrice: 3200,
    stopLoss: 3300,
    takeProfit: 3000,
    leverage: 5,
    riskLevel: 'low',
    status: 'completed',
    pnl: 250,
    description: 'Technical reversal at major resistance level.',
    timestamp: Date.now() - 86400000 // 24 hours ago
  }
];

export default function SocialPage() {
  const { isConnected, address } = useAccount();
  const [activeTab, setActiveTab] = useState<'feed' | 'leaderboard' | 'following' | 'signals' | 'profile'>('feed');
  const [isEditing, setIsEditing] = useState(false);
  const [profile, setProfile] = useState<UserProfile>({
    name: 'Trader',
    bio: 'Welcome to my trading profile!',
    avatar: '',
    tradingStyle: 'Swing Trading',
    experience: 'intermediate',
    preferredPairs: ['BTC/USDT', 'ETH/USDT']
  });
  
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

  const handleSave = () => {
    // TODO: Implement profile update logic
    setIsEditing(false);
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="mb-8 text-3xl font-bold">Social Trading</h1>
      
      {!isConnected ? (
        <WalletFallback message="Connect your wallet to access social trading features." />
      ) : (
        <>
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
            <button
              className={`flex items-center space-x-2 border-b-2 px-4 py-2 ${
                activeTab === 'signals'
                  ? 'border-primary text-primary'
                  : 'border-transparent text-gray-400 hover:text-white'
              }`}
              onClick={() => setActiveTab('signals')}
            >
              <Signal className="h-4 w-4" />
              <span>Signals</span>
            </button>
            <button
              className={`flex items-center space-x-2 border-b-2 px-4 py-2 ${
                activeTab === 'profile'
                  ? 'border-primary text-primary'
                  : 'border-transparent text-gray-400 hover:text-white'
              }`}
              onClick={() => setActiveTab('profile')}
            >
              <User className="h-4 w-4" />
              <span>Profile</span>
            </button>
          </div>

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
                    <div>
                      <p className="text-sm text-gray-400">Amount</p>
                      <p className="font-medium">{post.amount} {post.token}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-400">Price</p>
                      <p className="font-medium">{post.price}</p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-4 text-sm text-gray-400">
                    <button className="flex items-center space-x-1">
                      <MessageSquare className="h-4 w-4" />
                      <span>{post.comments}</span>
                    </button>
                    <button className="flex items-center space-x-1">
                      <TrendingUp className="h-4 w-4" />
                      <span>{post.likes}</span>
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}

          {activeTab === 'leaderboard' && (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr>
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
                </tbody>
              </table>
            </div>
          )}

          {activeTab === 'following' && (
            <div className="text-center py-8 text-gray-500">
              <Users className="h-12 w-12 mx-auto mb-2" />
              <p>You are not following any traders yet</p>
            </div>
          )}

          {activeTab === 'signals' && (
            <TradeSignals signals={sampleSignals} />
          )}

          {activeTab === 'profile' && (
            <div className="grid gap-6">
              {/* Profile Header */}
              <div className="rounded-lg bg-card p-6">
                <div className="flex items-start justify-between">
                  <div className="flex items-center space-x-4">
                    <Avatar className="h-20 w-20">
                      <AvatarImage src={profile.avatar} />
                      <AvatarFallback>
                        <User className="h-10 w-10" />
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      {isEditing ? (
                        <Input
                          value={profile.name}
                          onChange={(e) => setProfile({ ...profile, name: e.target.value })}
                          className="mb-2"
                        />
                      ) : (
                        <h2 className="text-2xl font-bold">{profile.name}</h2>
                      )}
                      <p className="text-sm text-gray-400">Wallet: {address}</p>
                    </div>
                  </div>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => isEditing ? handleSave() : setIsEditing(true)}
                  >
                    {isEditing ? (
                      <>
                        <Save className="mr-2 h-4 w-4" />
                        Save
                      </>
                    ) : (
                      <>
                        <Edit2 className="mr-2 h-4 w-4" />
                        Edit
                      </>
                    )}
                  </Button>
                </div>
              </div>

              {/* Profile Details */}
              <div className="grid gap-6 md:grid-cols-2">
                <div className="rounded-lg bg-card p-6">
                  <h3 className="mb-4 text-lg font-semibold">About Me</h3>
                  {isEditing ? (
                    <Textarea
                      value={profile.bio}
                      onChange={(e) => setProfile({ ...profile, bio: e.target.value })}
                      className="mb-4"
                      rows={4}
                    />
                  ) : (
                    <p className="mb-4 text-gray-400">{profile.bio}</p>
                  )}
                  
                  <h4 className="mb-2 font-medium">Trading Style</h4>
                  {isEditing ? (
                    <Input
                      value={profile.tradingStyle}
                      onChange={(e) => setProfile({ ...profile, tradingStyle: e.target.value })}
                      className="mb-4"
                    />
                  ) : (
                    <p className="mb-4 text-gray-400">{profile.tradingStyle}</p>
                  )}

                  <h4 className="mb-2 font-medium">Experience Level</h4>
                  {isEditing ? (
                    <select
                      value={profile.experience}
                      onChange={(e) => setProfile({ ...profile, experience: e.target.value as UserProfile['experience'] })}
                      className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                    >
                      <option value="beginner">Beginner</option>
                      <option value="intermediate">Intermediate</option>
                      <option value="advanced">Advanced</option>
                    </select>
                  ) : (
                    <p className="text-gray-400 capitalize">{profile.experience}</p>
                  )}
                </div>

                <div className="rounded-lg bg-card p-6">
                  <h3 className="mb-4 text-lg font-semibold">Trading Preferences</h3>
                  <h4 className="mb-2 font-medium">Preferred Trading Pairs</h4>
                  {isEditing ? (
                    <Input
                      value={profile.preferredPairs.join(', ')}
                      onChange={(e) => setProfile({ ...profile, preferredPairs: e.target.value.split(',').map(s => s.trim()) })}
                      placeholder="Enter trading pairs separated by commas"
                      className="mb-4"
                    />
                  ) : (
                    <div className="flex flex-wrap gap-2">
                      {profile.preferredPairs.map((pair) => (
                        <span
                          key={pair}
                          className="rounded-full bg-primary/10 px-3 py-1 text-sm text-primary"
                        >
                          {pair}
                        </span>
                      ))}
                    </div>
                  )}
                </div>
              </div>

              {/* Trading Statistics */}
              <div className="rounded-lg bg-card p-6">
                <h3 className="mb-4 text-lg font-semibold">Trading Statistics</h3>
                <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
                  <div className="rounded-lg bg-background p-4">
                    <p className="text-sm text-gray-400">Total Trades</p>
                    <p className="text-2xl font-bold">0</p>
                  </div>
                  <div className="rounded-lg bg-background p-4">
                    <p className="text-sm text-gray-400">Win Rate</p>
                    <p className="text-2xl font-bold text-success">0%</p>
                  </div>
                  <div className="rounded-lg bg-background p-4">
                    <p className="text-sm text-gray-400">Average ROI</p>
                    <p className="text-2xl font-bold text-success">0%</p>
                  </div>
                  <div className="rounded-lg bg-background p-4">
                    <p className="text-sm text-gray-400">Followers</p>
                    <p className="text-2xl font-bold">0</p>
                  </div>
                </div>
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
} 