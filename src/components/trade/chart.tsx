'use client';

import { useEffect, useRef, useState } from 'react';
import { 
  createChart, 
  IChartApi, 
  CrosshairMode, 
  LineStyle,
  ISeriesApi,
  SeriesType,
  Time,
  HistogramData,
  CandlestickData,
  LineData,
  UTCTimestamp,
  ColorType
} from 'lightweight-charts';
import { 
  Loader2, 
  LineChart, 
  CandlestickChart, 
  BarChart, 
  Settings,
  Plus,
  Minus,
  MousePointer,
  Pencil,
  Type,
  Eye,
  EyeOff
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
  DropdownMenuCheckboxItem,
} from "@/components/ui/dropdown-menu";
import { marketApi, CandleData as APICandleData, VolumeData as APIVolumeData } from '@/lib/api';

interface ChartProps {
  symbol: string;
}

// Convert API types to chart-compatible types
type ChartCandleData = Omit<APICandleData, 'time'> & { time: UTCTimestamp };
type ChartVolumeData = Omit<APIVolumeData, 'time'> & { time: UTCTimestamp };

type ChartType = 'candles' | 'line' | 'area';
type Indicator = 'MA' | 'EMA' | 'RSI' | 'MACD' | 'BB';

interface CustomLineData {
  time: UTCTimestamp;
  value: number;
}

interface IndicatorData {
  [key: string]: CustomLineData[];
}

interface SeriesRefs {
  mainSeries?: ISeriesApi<SeriesType>;
  volumeSeries?: ISeriesApi<'Histogram'>;
  indicatorSeries: Map<Indicator, ISeriesApi<'Line'>>;
}

const COLORS = {
  background: 'transparent' as ColorType,
  text: '#d1d5db',
  grid: '#1f2937',
  border: '#374151',
  upColor: '#22c55e',
  downColor: '#ef4444',
  volume: '#64748b',
  ma: '#eab308',
  primary: '#60a5fa',
};

// Helper function to convert number to UTCTimestamp
const toUTCTimestamp = (time: number): UTCTimestamp => time as UTCTimestamp;

// Indicator calculation functions
const calculateMA = (data: ChartCandleData[], period: number): CustomLineData[] => {
  return data.map((_, index) => {
    if (index < period - 1) return { time: data[index].time, value: data[index].close };
    
    const sum = data
      .slice(index - period + 1, index + 1)
      .reduce((acc, curr) => acc + curr.close, 0);
    
    return {
      time: data[index].time,
      value: sum / period
    };
  });
};

const calculateEMA = (data: ChartCandleData[], period: number): CustomLineData[] => {
  const k = 2 / (period + 1);
  let ema = data[0].close;
  
  return data.map((candle) => {
    ema = (candle.close * k) + (ema * (1 - k));
    return { time: candle.time, value: ema };
  });
};

const calculateRSI = (data: ChartCandleData[], period: number = 14): CustomLineData[] => {
  const gains: number[] = [];
  const losses: number[] = [];
  const result: CustomLineData[] = [];
  
  // First point
  result.push({ time: data[0].time, value: 50 }); // Initial RSI value
  
  // Calculate price changes
  for (let i = 1; i < data.length; i++) {
    const change = data[i].close - data[i - 1].close;
    gains.push(change > 0 ? change : 0);
    losses.push(change < 0 ? Math.abs(change) : 0);
    
    if (i < period) {
      result.push({ time: data[i].time, value: 50 }); // Fill initial period with neutral RSI
      continue;
    }
    
    const avgGain = gains.slice(i - period, i).reduce((a, b) => a + b, 0) / period;
    const avgLoss = losses.slice(i - period, i).reduce((a, b) => a + b, 0) / period;
    const rs = avgLoss === 0 ? 100 : avgGain / avgLoss;
    const rsi = 100 - (100 / (1 + rs));
    
    result.push({ time: data[i].time, value: rsi });
  }
  
  return result;
};

const calculateIndicators = (
  candleData: ChartCandleData[],
  activeIndicators: Set<Indicator>
): IndicatorData => {
  const indicators: IndicatorData = {};
  
  if (activeIndicators.has('MA')) {
    indicators.MA = calculateMA(candleData, 20);
  }
  
  if (activeIndicators.has('EMA')) {
    indicators.EMA = calculateEMA(candleData, 20);
  }
  
  if (activeIndicators.has('RSI')) {
    indicators.RSI = calculateRSI(candleData);
  }
  
  return indicators;
};

export default function Chart({ symbol }: ChartProps) {
  const chartContainerRef = useRef<HTMLDivElement>(null);
  const chartRef = useRef<IChartApi | null>(null);
  const seriesRef = useRef<SeriesRefs>({
    indicatorSeries: new Map()
  });
  const [mounted, setMounted] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [timeframe, setTimeframe] = useState<'1m' | '5m' | '15m' | '1h' | '4h' | '1D' | '1W'>('1h');
  const [chartType, setChartType] = useState<ChartType>('candles');
  const [activeIndicators, setActiveIndicators] = useState<Set<Indicator>>(() => new Set(['MA'] as Indicator[]));
  const [showVolume, setShowVolume] = useState(true);

  // Initialize chart
  useEffect(() => {
    setMounted(true);
    
    if (!chartContainerRef.current) return;

    const container = chartContainerRef.current;
    const width = container.clientWidth;
    const height = container.clientHeight || 400; // Default height if not set by CSS

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
        crosshair: {
          mode: CrosshairMode.Normal,
          vertLine: {
            width: 1,
            color: COLORS.border,
            style: LineStyle.Dashed,
          },
          horzLine: {
            width: 1,
            color: COLORS.border,
            style: LineStyle.Dashed,
          },
        },
        timeScale: {
          borderColor: COLORS.border,
          timeVisible: true,
          secondsVisible: false,
        },
        rightPriceScale: {
          borderColor: COLORS.border,
        },
      });

      // Store chart reference
      chartRef.current = chart;

      // Handle window resize
      const handleResize = () => {
        chart.applyOptions({
          width: container.clientWidth,
          height: container.clientHeight || 400,
        });
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

  // Cleanup function for series
  const cleanupSeries = () => {
    if (!chartRef.current) return;
    
    // Remove main series
    if (seriesRef.current.mainSeries) {
      chartRef.current.removeSeries(seriesRef.current.mainSeries);
      seriesRef.current.mainSeries = undefined;
    }
    
    // Remove volume series
    if (seriesRef.current.volumeSeries) {
      chartRef.current.removeSeries(seriesRef.current.volumeSeries);
      seriesRef.current.volumeSeries = undefined;
    }
    
    // Remove indicator series
    seriesRef.current.indicatorSeries.forEach(series => {
      chartRef.current?.removeSeries(series);
    });
    seriesRef.current.indicatorSeries.clear();
  };

  // Fetch and update data
  useEffect(() => {
    if (!chartRef.current || !mounted) return;

    const fetchAndUpdateData = async () => {
      try {
        setIsLoading(true);
        setError(null);

        // Clean up existing series
        cleanupSeries();

        // Fetch candle data
        const apiData = await marketApi.getCandles(symbol, timeframe);
        
        // Convert API data to chart-compatible format
        const candleData = apiData.map(d => ({
          ...d,
          time: toUTCTimestamp(d.time),
        }));

        // Create main series
        if (chartRef.current) {
          const mainSeries = chartType === 'candles' 
            ? chartRef.current.addCandlestickSeries({
                upColor: COLORS.upColor,
                downColor: COLORS.downColor,
                borderVisible: false,
                wickUpColor: COLORS.upColor,
                wickDownColor: COLORS.downColor,
              })
            : chartRef.current.addLineSeries({
                color: COLORS.primary,
                lineWidth: 2,
              });

          seriesRef.current.mainSeries = mainSeries;

          // Set data based on chart type
          if (chartType === 'candles') {
            mainSeries.setData(candleData);
          } else {
            const lineData = candleData.map(d => ({
              time: d.time,
              value: d.close,
            }));
            mainSeries.setData(lineData);
          }

          // Add volume if enabled
          if (showVolume && chartRef.current) {
            const volumeSeries = chartRef.current.addHistogramSeries({
              color: COLORS.volume,
              priceFormat: {
                type: 'volume',
              },
              priceScaleId: '', // Create new scale
            });

            seriesRef.current.volumeSeries = volumeSeries;

            const volumeData = candleData.map(d => ({
              time: d.time,
              value: Math.abs(d.close - d.open) * 100, // Simulated volume
              color: d.close >= d.open ? `${COLORS.upColor}44` : `${COLORS.downColor}44`,
            }));

            volumeSeries.setData(volumeData);
          }

          // Calculate and add indicators
          const indicators = calculateIndicators(candleData, activeIndicators);
          
          Object.entries(indicators).forEach(([indicator, data]) => {
            if (data.length > 0 && chartRef.current) {
              const indicatorSeries = chartRef.current.addLineSeries({
                color: indicator === 'MA' ? COLORS.ma : COLORS.primary,
                lineWidth: 1,
                priceLineVisible: false,
              });
              
              seriesRef.current.indicatorSeries.set(indicator as Indicator, indicatorSeries);
              indicatorSeries.setData(data);
            }
          });

          // Fit content to view
          chartRef.current.timeScale().fitContent();
        }

      } catch (err) {
        console.error('Error loading chart data:', err);
        setError('Failed to load chart data');
      } finally {
        setIsLoading(false);
      }
    };

    fetchAndUpdateData();
  }, [symbol, timeframe, chartType, showVolume, activeIndicators, mounted]);

  if (!mounted) return null;

  return (
    <div className="relative w-full h-[500px] rounded-lg border border-border bg-card">
      {isLoading && (
        <div className="absolute inset-0 flex items-center justify-center bg-background/50 backdrop-blur-sm z-10">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      )}
      {error && (
        <div className="absolute inset-0 flex items-center justify-center bg-background/50 backdrop-blur-sm z-10">
          <div className="text-center">
            <p className="text-destructive mb-2">{error}</p>
            <Button onClick={() => window.location.reload()}>
              Retry
            </Button>
          </div>
        </div>
      )}
      <div className="p-4">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center space-x-2">
            <Tabs value={chartType} onValueChange={(value) => setChartType(value as ChartType)}>
              <TabsList>
                <TabsTrigger value="candles">
                  <CandlestickChart className="h-4 w-4" />
                </TabsTrigger>
                <TabsTrigger value="line">
                  <LineChart className="h-4 w-4" />
                </TabsTrigger>
              </TabsList>
            </Tabs>
            <select
              value={timeframe}
              onChange={(e) => setTimeframe(e.target.value as typeof timeframe)}
              className="bg-background border border-border rounded px-2 py-1 text-sm"
            >
              <option value="1m">1m</option>
              <option value="5m">5m</option>
              <option value="15m">15m</option>
              <option value="1h">1h</option>
              <option value="4h">4h</option>
              <option value="1D">1D</option>
              <option value="1W">1W</option>
            </select>
          </div>
          <div className="flex items-center space-x-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setShowVolume(!showVolume)}
            >
              {showVolume ? (
                <EyeOff className="h-4 w-4" />
              ) : (
                <Eye className="h-4 w-4" />
              )}
              <span className="ml-2">Volume</span>
            </Button>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" size="sm">
                  <Settings className="h-4 w-4" />
                  <span className="ml-2">Indicators</span>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent>
                {(['MA', 'EMA', 'RSI', 'MACD', 'BB'] as Indicator[]).map((indicator) => (
                  <DropdownMenuCheckboxItem
                    key={indicator}
                    checked={activeIndicators.has(indicator)}
                    onCheckedChange={(checked) => {
                      setActiveIndicators(prev => {
                        const next = new Set(prev);
                        if (checked) {
                          next.add(indicator);
                        } else {
                          next.delete(indicator);
                        }
                        return next;
                      });
                    }}
                  >
                    {indicator}
                  </DropdownMenuCheckboxItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </div>
      <div ref={chartContainerRef} className="w-full h-[calc(100%-80px)]" />
    </div>
  );
} 