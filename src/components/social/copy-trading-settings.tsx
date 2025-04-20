'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  Settings, 
  DollarSign, 
  Percent, 
  AlertCircle,
  Save,
  X
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Switch } from '@/components/ui/switch';
import { Slider } from '@/components/ui/slider';

interface CopyTradingSettings {
  maxTradeSize: number;
  riskPercentage: number;
  stopLossPercentage: number;
  takeProfitPercentage: number;
  autoCopy: boolean;
  notifications: boolean;
  maxOpenTrades: number;
}

interface CopyTradingSettingsProps {
  initialSettings: CopyTradingSettings;
  onSave: (settings: CopyTradingSettings) => void;
  onCancel: () => void;
}

export default function CopyTradingSettings({
  initialSettings,
  onSave,
  onCancel
}: CopyTradingSettingsProps) {
  const [settings, setSettings] = useState<CopyTradingSettings>(initialSettings);

  const handleChange = (key: keyof CopyTradingSettings, value: number | boolean) => {
    setSettings(prev => ({
      ...prev,
      [key]: value
    }));
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    onSave(settings);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="rounded-lg bg-card p-6"
    >
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-semibold">Copy Trading Settings</h2>
        <Button
          variant="ghost"
          size="icon"
          onClick={onCancel}
        >
          <X className="h-4 w-4" />
        </Button>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Trade Size Settings */}
        <div className="space-y-4">
          <h3 className="text-sm font-medium">Trade Size Limits</h3>
          <div className="grid gap-4">
            <div className="space-y-2">
              <label className="text-sm text-gray-400">
                Maximum Trade Size (USD)
              </label>
              <div className="flex items-center space-x-2">
                <DollarSign className="h-4 w-4 text-gray-400" />
                <Input
                  type="number"
                  value={settings.maxTradeSize}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) => handleChange('maxTradeSize', Number(e.target.value))}
                  min={0}
                  step={100}
                />
              </div>
            </div>
            <div className="space-y-2">
              <label className="text-sm text-gray-400">
                Maximum Open Trades
              </label>
              <Input
                type="number"
                value={settings.maxOpenTrades}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => handleChange('maxOpenTrades', Number(e.target.value))}
                min={1}
                max={10}
              />
            </div>
          </div>
        </div>

        {/* Risk Management */}
        <div className="space-y-4">
          <h3 className="text-sm font-medium">Risk Management</h3>
          <div className="grid gap-4">
            <div className="space-y-2">
              <label className="text-sm text-gray-400">
                Risk Percentage per Trade
              </label>
              <div className="flex items-center space-x-4">
                <Slider
                  value={[settings.riskPercentage]}
                  onValueChange={(value: number[]) => handleChange('riskPercentage', value[0])}
                  min={0.1}
                  max={5}
                  step={0.1}
                  className="flex-1"
                />
                <span className="text-sm font-medium">{settings.riskPercentage}%</span>
              </div>
            </div>
            <div className="space-y-2">
              <label className="text-sm text-gray-400">
                Stop Loss Percentage
              </label>
              <div className="flex items-center space-x-4">
                <Slider
                  value={[settings.stopLossPercentage]}
                  onValueChange={(value: number[]) => handleChange('stopLossPercentage', value[0])}
                  min={1}
                  max={20}
                  step={1}
                  className="flex-1"
                />
                <span className="text-sm font-medium">{settings.stopLossPercentage}%</span>
              </div>
            </div>
            <div className="space-y-2">
              <label className="text-sm text-gray-400">
                Take Profit Percentage
              </label>
              <div className="flex items-center space-x-4">
                <Slider
                  value={[settings.takeProfitPercentage]}
                  onValueChange={(value: number[]) => handleChange('takeProfitPercentage', value[0])}
                  min={1}
                  max={50}
                  step={1}
                  className="flex-1"
                />
                <span className="text-sm font-medium">{settings.takeProfitPercentage}%</span>
              </div>
            </div>
          </div>
        </div>

        {/* Automation Settings */}
        <div className="space-y-4">
          <h3 className="text-sm font-medium">Automation</h3>
          <div className="grid gap-4">
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <label className="text-sm font-medium">Auto-Copy Trades</label>
                <p className="text-sm text-gray-400">
                  Automatically copy new trades from followed traders
                </p>
              </div>
              <Switch
                checked={settings.autoCopy}
                onCheckedChange={(checked: boolean) => handleChange('autoCopy', checked)}
              />
            </div>
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <label className="text-sm font-medium">Trade Notifications</label>
                <p className="text-sm text-gray-400">
                  Receive notifications for new trades and updates
                </p>
              </div>
              <Switch
                checked={settings.notifications}
                onCheckedChange={(checked: boolean) => handleChange('notifications', checked)}
              />
            </div>
          </div>
        </div>

        {/* Warning Message */}
        <div className="rounded-lg bg-warning/10 p-4 text-warning">
          <div className="flex items-start space-x-2">
            <AlertCircle className="h-5 w-5 mt-0.5" />
            <p className="text-sm">
              Please review your risk settings carefully. Copy trading involves significant risks,
              and you should only invest what you can afford to lose.
            </p>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex justify-end space-x-2">
          <Button
            variant="outline"
            onClick={onCancel}
            type="button"
          >
            Cancel
          </Button>
          <Button
            type="submit"
            className="bg-primary"
          >
            <Save className="mr-2 h-4 w-4" />
            Save Settings
          </Button>
        </div>
      </form>
    </motion.div>
  );
} 