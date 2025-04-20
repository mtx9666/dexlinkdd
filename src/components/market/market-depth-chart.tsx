'use client';

import { useEffect, useRef, useState } from 'react';
import { createChart, IChartApi, ColorType, SingleValueData, UTCTimestamp } from 'lightweight-charts';
import { marketApi, MarketDepth } from '@/lib/api';
import { Loader2 } from 'lucide-react';

interface MarketDepthChartProps {
  symbol?: string;
}

const COLORS = {
  background: 'transparent',
  text: 'rgba(255, 255, 255, 0.9)',
  grid: 'rgba(255, 255, 255, 0.1)',
  border: 'rgba(255, 255, 255, 0.2)',
  buy: 'rgba(0, 255, 0, 0.5)',
  sell: 'rgba(255, 0, 0, 0.5)',
};

export default function MarketDepthChart({ symbol = 'ETH/USD' }: MarketDepthChartProps) {
  const chartContainerRef = useRef<HTMLDivElement>(null);
  const chartRef = useRef<IChartApi | null>(null);
  const [mounted, setMounted] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [marketDepth, setMarketDepth] = useState<MarketDepth | null>(null);

  // Initialize chart
  useEffect(() => {
    setMounted(true);
    
    if (!chartContainerRef.current) return;

    const container = chartContainerRef.current;
    const width = container.clientWidth;
    const height = container.clientHeight || 400;

    try {
      const chart = createChart(container, {
        width,
        height,
        layout: {
          background: { color: COLORS.background },
          textColor: COLORS.text,
        },
        grid: {
          vertLines: { color: COLORS.grid },
          horzLines: { color: COLORS.grid },
        },
        rightPriceScale: {
          borderColor: COLORS.border,
        },
        leftPriceScale: {
          borderColor: COLORS.border,
        },
      });

      // Store chart reference
      chartRef.current = chart;

      // Handle window resize
      const handleResize = () => {
        if (chartRef.current) {
          chartRef.current.applyOptions({
            width: container.clientWidth,
            height: container.clientHeight || 400,
          });
        }
      };

      window.addEventListener('resize', handleResize);

      return () => {
        window.removeEventListener('resize', handleResize);
        chart.remove();
        chartRef.current = null;
      };
    } catch (err) {
      console.error('Error initializing chart:', err);
      setError('Failed to initialize chart');
    }
  }, []);

  // Fetch and update data
  useEffect(() => {
    if (!chartRef.current || !mounted) return;

    const fetchAndUpdateData = async () => {
      try {
        setIsLoading(true);
        setError(null);

        // Fetch market depth data
        const depth = await marketApi.getMarketDepth(symbol);
        setMarketDepth(depth);
        
        const chart = chartRef.current;
        if (!chart) return;

        // Create series for bids and asks
        const bidsSeries = chart.addAreaSeries({
          lineColor: COLORS.buy,
          topColor: COLORS.buy,
          bottomColor: 'rgba(0, 0, 0, 0)',
          lineWidth: 1,
        });
        
        const asksSeries = chart.addAreaSeries({
          lineColor: COLORS.sell,
          topColor: COLORS.sell,
          bottomColor: 'rgba(0, 0, 0, 0)',
          lineWidth: 1,
        });

        // Transform data for the chart
        const now = Math.floor(Date.now() / 1000) as UTCTimestamp;
        const bidsData: SingleValueData[] = depth.bids.map(([price, size]) => ({
          time: now,
          value: size,
        }));
        
        const asksData: SingleValueData[] = depth.asks.map(([price, size]) => ({
          time: now,
          value: size,
        }));

        // Set data
        bidsSeries.setData(bidsData);
        asksSeries.setData(asksData);

        // Fit content to view
        chart.timeScale().fitContent();

      } catch (err) {
        console.error('Error loading market depth data:', err);
        setError('Failed to load market depth data');
      } finally {
        setIsLoading(false);
      }
    };

    fetchAndUpdateData();
  }, [symbol, mounted]);

  if (!mounted) return null;

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-full">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center h-full text-destructive">
        {error}
      </div>
    );
  }

  return (
    <div ref={chartContainerRef} className="w-full h-full" />
  );
} 