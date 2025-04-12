'use client';

import { useEffect, useRef, useState } from 'react';
import { createChart, IChartApi } from 'lightweight-charts';
import { Loader2 } from 'lucide-react';

interface ChartProps {
  symbol: string;
}

interface CandleData {
  time: string;
  open: number;
  high: number;
  low: number;
  close: number;
}

interface VolumeData {
  time: string;
  value: number;
  color: string;
}

export default function Chart({ symbol }: ChartProps) {
  const chartContainerRef = useRef<HTMLDivElement>(null);
  const chartRef = useRef<IChartApi | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [timeframe, setTimeframe] = useState<'1D' | '1W' | '1M' | '1Y'>('1D');

  // Generate sample data for fallback
  const generateSampleData = (tf: string) => {
    const now = new Date();
    const data = [];
    let basePrice = 1800; // Base price for ETH
    
    // Determine number of candles based on timeframe
    let numCandles = 24; // Default for 1D
    if (tf === '1W') numCandles = 7 * 24;
    if (tf === '1M') numCandles = 30;
    if (tf === '1Y') numCandles = 365;
    
    for (let i = numCandles; i >= 0; i--) {
      const time = new Date(now);
      time.setHours(time.getHours() - i);
      
      const change = (Math.random() - 0.5) * 50;
      const open = basePrice + change;
      const high = open + Math.random() * 20;
      const low = open - Math.random() * 20;
      const close = (high + low) / 2;
      const volume = Math.random() * 1000 + 500;
      
      data.push({
        candleData: {
          time: time.toISOString().split('T')[0],
          open,
          high,
          low,
          close,
        },
        volumeData: {
          time: time.toISOString().split('T')[0],
          value: volume,
          color: close >= open ? '#22c55e44' : '#ef444444',
        }
      });
      
      basePrice = close;
    }
    
    return data;
  };

  // Initialize chart
  useEffect(() => {
    const container = chartContainerRef.current;
    if (!container) return;

    // Cleanup previous chart instance if it exists
    if (chartRef.current) {
      chartRef.current.remove();
      chartRef.current = null;
    }

    // Create new chart instance
    const chart = createChart(container, {
      width: container.clientWidth,
      height: 400,
      layout: {
        backgroundColor: 'transparent',
        textColor: '#d1d5db',
      },
      grid: {
        vertLines: { color: '#1f2937' },
        horzLines: { color: '#1f2937' },
      },
      crosshair: {
        mode: 1,
      },
      timeScale: {
        borderColor: '#1f2937',
        timeVisible: true,
      },
    });

    chartRef.current = chart;

    // Create candlestick series
    const candlestickSeries = chart.addCandlestickSeries({
      upColor: '#22c55e',
      downColor: '#ef4444',
      wickUpColor: '#22c55e',
      wickDownColor: '#ef4444',
      borderVisible: false,
    });

    // Create volume series
    const volumeSeries = chart.addHistogramSeries({
      color: '#64748b',
      priceFormat: {
        type: 'volume',
      },
      priceScaleId: '', // Set to empty string to overlay with price scale
      scaleMargins: {
        top: 0.8, // Position the volume series at the bottom 20% of the chart
        bottom: 0,
      },
    });

    // Handle window resize
    const handleResize = () => {
      if (container && chart) {
        chart.applyOptions({ width: container.clientWidth });
      }
    };

    window.addEventListener('resize', handleResize);

    // Fetch and update data
    const fetchData = async () => {
      if (!candlestickSeries || !volumeSeries) return;
      
      setIsLoading(true);
      setError(null);
      
      try {
        // Use sample data for now until we set up proper API keys
        const sampleData = generateSampleData(timeframe);
        
        const candleData = sampleData.map(d => d.candleData);
        const volumeData = sampleData.map(d => d.volumeData);

        candlestickSeries.setData(candleData);
        volumeSeries.setData(volumeData);
        
        // Fit content after data is loaded
        chart.timeScale().fitContent();
      } catch (err) {
        console.error('Error loading chart data:', err);
        setError('Failed to load chart data. Please try again.');
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();

    // Cleanup function
    return () => {
      window.removeEventListener('resize', handleResize);
      if (chartRef.current) {
        chartRef.current.remove();
        chartRef.current = null;
      }
    };
  }, [timeframe, symbol]); // Re-initialize when timeframe or symbol changes

  return (
    <div className="relative rounded-lg border border-border bg-card p-4">
      {/* Timeframe selector */}
      <div className="absolute right-4 top-4 z-10 flex space-x-1 rounded-lg bg-background/80 p-1 backdrop-blur">
        {(['1D', '1W', '1M', '1Y'] as const).map((tf) => (
          <button
            key={tf}
            className={`rounded-md px-2 py-1 text-xs ${
              timeframe === tf ? 'bg-primary text-white' : 'text-gray-400 hover:text-white'
            }`}
            onClick={() => setTimeframe(tf)}
          >
            {tf}
          </button>
        ))}
      </div>
      
      {/* Loading state */}
      {isLoading && (
        <div className="absolute inset-0 flex items-center justify-center bg-background/50 backdrop-blur">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      )}
      
      {/* Error state */}
      {error && (
        <div className="absolute inset-0 flex items-center justify-center bg-background/50 backdrop-blur">
          <div className="rounded-lg bg-card p-4 text-center">
            <p className="text-destructive">{error}</p>
            <button 
              className="mt-2 rounded-md bg-primary px-3 py-1 text-sm text-white"
              onClick={() => {
                setError(null);
                setIsLoading(true);
                // Trigger data fetch by changing timeframe
                setTimeframe(timeframe);
              }}
            >
              Retry
            </button>
          </div>
        </div>
      )}
      
      {/* Chart container */}
      <div ref={chartContainerRef} />
    </div>
  );
} 