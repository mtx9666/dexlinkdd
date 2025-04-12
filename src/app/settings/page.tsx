'use client';

import { useState } from 'react';
import { useAccount } from 'wagmi';
import { Button } from '@/components/ui/button';
import { Moon, Sun, Bell, Shield, Sliders, Wallet } from 'lucide-react';
import { WalletFallback } from '@/components/ui/wallet-fallback';

export default function SettingsPage() {
  const { isConnected, address } = useAccount();
  const [theme, setTheme] = useState<'light' | 'dark' | 'system'>('dark');
  const [notifications, setNotifications] = useState({
    tradeAlerts: true,
    priceAlerts: true,
    socialUpdates: false,
  });
  const [slippage, setSlippage] = useState('0.5');
  const [gasLimit, setGasLimit] = useState('300000');

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="mb-8 text-3xl font-bold">Settings</h1>
      
      {!isConnected ? (
        <WalletFallback message="Connect your wallet to access settings and customize your experience." />
      ) : (
        <div className="grid gap-6 lg:grid-cols-12">
          {/* Main Content */}
          <div className="lg:col-span-8">
            {/* Appearance */}
            <div className="mb-6 rounded-lg bg-card p-6">
              <div className="mb-4 flex items-center">
                <Sun className="mr-2 h-5 w-5" />
                <h2 className="text-xl font-semibold">Appearance</h2>
              </div>
              <div className="space-y-4">
                <div>
                  <label className="mb-2 block text-sm font-medium">Theme</label>
                  <div className="flex space-x-2">
                    <Button
                      variant={theme === 'light' ? 'default' : 'outline'}
                      onClick={() => setTheme('light')}
                    >
                      Light
                    </Button>
                    <Button
                      variant={theme === 'dark' ? 'default' : 'outline'}
                      onClick={() => setTheme('dark')}
                    >
                      Dark
                    </Button>
                    <Button
                      variant={theme === 'system' ? 'default' : 'outline'}
                      onClick={() => setTheme('system')}
                    >
                      System
                    </Button>
                  </div>
                </div>
              </div>
            </div>

            {/* Notifications */}
            <div className="mb-6 rounded-lg bg-card p-6">
              <div className="mb-4 flex items-center">
                <Bell className="mr-2 h-5 w-5" />
                <h2 className="text-xl font-semibold">Notifications</h2>
              </div>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium">Trade Alerts</p>
                    <p className="text-sm text-gray-400">Get notified when your trades are executed</p>
                  </div>
                  <label className="relative inline-flex cursor-pointer items-center">
                    <input
                      type="checkbox"
                      className="peer sr-only"
                      checked={notifications.tradeAlerts}
                      onChange={() =>
                        setNotifications({ ...notifications, tradeAlerts: !notifications.tradeAlerts })
                      }
                    />
                    <div className="peer h-6 w-11 rounded-full bg-gray-700 after:absolute after:left-[2px] after:top-[2px] after:h-5 after:w-5 after:rounded-full after:border after:border-gray-300 after:bg-white after:transition-all after:content-[''] peer-checked:bg-primary peer-checked:after:translate-x-full peer-checked:after:border-white peer-focus:outline-none"></div>
                  </label>
                </div>
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium">Price Alerts</p>
                    <p className="text-sm text-gray-400">Get notified when prices reach your targets</p>
                  </div>
                  <label className="relative inline-flex cursor-pointer items-center">
                    <input
                      type="checkbox"
                      className="peer sr-only"
                      checked={notifications.priceAlerts}
                      onChange={() =>
                        setNotifications({ ...notifications, priceAlerts: !notifications.priceAlerts })
                      }
                    />
                    <div className="peer h-6 w-11 rounded-full bg-gray-700 after:absolute after:left-[2px] after:top-[2px] after:h-5 after:w-5 after:rounded-full after:border after:border-gray-300 after:bg-white after:transition-all after:content-[''] peer-checked:bg-primary peer-checked:after:translate-x-full peer-checked:after:border-white peer-focus:outline-none"></div>
                  </label>
                </div>
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium">Social Updates</p>
                    <p className="text-sm text-gray-400">Get notified about activity from traders you follow</p>
                  </div>
                  <label className="relative inline-flex cursor-pointer items-center">
                    <input
                      type="checkbox"
                      className="peer sr-only"
                      checked={notifications.socialUpdates}
                      onChange={() =>
                        setNotifications({ ...notifications, socialUpdates: !notifications.socialUpdates })
                      }
                    />
                    <div className="peer h-6 w-11 rounded-full bg-gray-700 after:absolute after:left-[2px] after:top-[2px] after:h-5 after:w-5 after:rounded-full after:border after:border-gray-300 after:bg-white after:transition-all after:content-[''] peer-checked:bg-primary peer-checked:after:translate-x-full peer-checked:after:border-white peer-focus:outline-none"></div>
                  </label>
                </div>
              </div>
            </div>

            {/* Trading Preferences */}
            <div className="mb-6 rounded-lg bg-card p-6">
              <div className="mb-4 flex items-center">
                <Sliders className="mr-2 h-5 w-5" />
                <h2 className="text-xl font-semibold">Trading Preferences</h2>
              </div>
              <div className="space-y-4">
                <div>
                  <label className="mb-2 block text-sm font-medium">Slippage Tolerance (%)</label>
                  <input
                    type="text"
                    className="w-full rounded-md border border-gray-700 bg-background px-3 py-2"
                    value={slippage}
                    onChange={(e) => setSlippage(e.target.value)}
                  />
                </div>
                <div>
                  <label className="mb-2 block text-sm font-medium">Gas Limit</label>
                  <input
                    type="text"
                    className="w-full rounded-md border border-gray-700 bg-background px-3 py-2"
                    value={gasLimit}
                    onChange={(e) => setGasLimit(e.target.value)}
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className="lg:col-span-4">
            {/* Wallet Security */}
            <div className="rounded-lg bg-card p-6">
              <div className="mb-4 flex items-center">
                <Shield className="mr-2 h-5 w-5" />
                <h2 className="text-xl font-semibold">Wallet Security</h2>
              </div>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium">Connected Wallet</p>
                    <p className="text-sm text-gray-400">
                      {address?.slice(0, 6)}...{address?.slice(-4)}
                    </p>
                  </div>
                  <Button variant="outline" size="sm">
                    Disconnect
                  </Button>
                </div>
                <div className="rounded-lg bg-background p-4">
                  <p className="text-sm text-gray-400">
                    Your wallet is securely connected. Make sure to keep your private keys safe and never
                    share them with anyone.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
} 