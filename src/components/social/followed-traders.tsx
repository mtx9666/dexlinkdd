'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  User,
  TrendingUp,
  TrendingDown,
  Users,
  BarChart2,
  Settings2,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useCopyTrading } from '@/contexts/copy-trading-context';
import { Trader } from '@/lib/copy-trading';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { Card } from '@/components/ui/card';
import { 
  Tooltip, 
  TooltipContent, 
  TooltipProvider, 
  TooltipTrigger 
} from '@/components/ui/tooltip';

interface FollowedTradersProps {
  traders: Trader[];
  onSettingsClick: () => void;
}

export default function FollowedTraders({ traders, onSettingsClick }: FollowedTradersProps) {
  const { isFollowingTrader, unfollowTrader } = useCopyTrading();
  const [selectedTrader, setSelectedTrader] = useState<string | null>(null);

  const handleUnfollow = (traderId: string) => {
    unfollowTrader(traderId);
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-semibold">Followed Traders</h2>
        <Button
          variant="outline"
          size="icon"
          onClick={onSettingsClick}
        >
          <Settings2 className="h-4 w-4" />
        </Button>
      </div>

      <div className="grid gap-4">
        {traders.map((trader) => (
          <motion.div
            key={trader.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="relative"
          >
            <Card
              className={`p-4 cursor-pointer transition-all ${
                selectedTrader === trader.id ? 'ring-2 ring-primary' : ''
              }`}
              onClick={() => setSelectedTrader(trader.id)}
            >
              <div className="flex items-center space-x-4">
                <Avatar className="h-10 w-10">
                  <AvatarImage src={trader.avatar} alt={trader.name} />
                  <AvatarFallback>{trader.name.slice(0, 2).toUpperCase()}</AvatarFallback>
                </Avatar>

                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between">
                    <h3 className="text-sm font-medium truncate">{trader.name}</h3>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleUnfollow(trader.id);
                      }}
                    >
                      Unfollow
                    </Button>
                  </div>

                  <div className="grid grid-cols-3 gap-4 mt-2">
                    <TooltipProvider>
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <div className="flex items-center space-x-1 text-sm">
                            <BarChart2 className="h-4 w-4 text-gray-400" />
                            <span className={trader.winRate >= 50 ? 'text-green-500' : 'text-red-500'}>
                              {trader.winRate}%
                            </span>
                          </div>
                        </TooltipTrigger>
                        <TooltipContent>Win Rate</TooltipContent>
                      </Tooltip>
                    </TooltipProvider>

                    <TooltipProvider>
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <div className="flex items-center space-x-1 text-sm">
                            <TrendingUp className="h-4 w-4 text-gray-400" />
                            <span>{trader.totalTrades}</span>
                          </div>
                        </TooltipTrigger>
                        <TooltipContent>Total Trades</TooltipContent>
                      </Tooltip>
                    </TooltipProvider>

                    <TooltipProvider>
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <div className="flex items-center space-x-1 text-sm">
                            {trader.pnl >= 0 ? (
                              <TrendingUp className="h-4 w-4 text-green-500" />
                            ) : (
                              <TrendingDown className="h-4 w-4 text-red-500" />
                            )}
                            <span className={trader.pnl >= 0 ? 'text-green-500' : 'text-red-500'}>
                              {trader.pnl >= 0 ? '+' : ''}{trader.pnl}%
                            </span>
                          </div>
                        </TooltipTrigger>
                        <TooltipContent>PnL</TooltipContent>
                      </Tooltip>
                    </TooltipProvider>
                  </div>

                  <div className="flex items-center space-x-1 mt-2 text-sm text-gray-500">
                    <Users className="h-4 w-4" />
                    <span>{trader.followers} followers</span>
                  </div>
                </div>
              </div>
            </Card>
          </motion.div>
        ))}

        {traders.length === 0 && (
          <div className="text-center py-8 text-gray-500">
            <User className="h-12 w-12 mx-auto mb-2" />
            <p>You are not following any traders yet</p>
          </div>
        )}
      </div>
    </div>
  );
} 