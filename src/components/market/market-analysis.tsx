"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Button } from "@/components/ui/button"
import { ArrowUp, ArrowDown, TrendingUp, TrendingDown, Activity } from "lucide-react"
import MarketDepthChart from "./market-depth-chart"

interface MarketData {
  symbol: string
  price: number
  change24h: number
  volume24h: number
  marketCap: number
  trend: "up" | "down" | "neutral"
  indicators: {
    rsi: number
    macd: number
    volume: number
  }
}

interface Trade {
  id: string
  price: number
  amount: number
  type: "buy" | "sell"
  timestamp: number
}

export function MarketAnalysis() {
  const [marketData, setMarketData] = useState<MarketData[]>([])
  const [recentTrades, setRecentTrades] = useState<Trade[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchMarketData = async () => {
      try {
        // TODO: Replace with actual API call
        const mockData: MarketData[] = [
          {
            symbol: "BTC/USD",
            price: 50000,
            change24h: 2.5,
            volume24h: 1000000000,
            marketCap: 1000000000000,
            trend: "up",
            indicators: {
              rsi: 65,
              macd: 0.5,
              volume: 1200000000
            }
          },
          {
            symbol: "ETH/USD",
            price: 3000,
            change24h: -1.2,
            volume24h: 500000000,
            marketCap: 300000000000,
            trend: "down",
            indicators: {
              rsi: 45,
              macd: -0.2,
              volume: 600000000
            }
          }
        ]
        setMarketData(mockData)
        setIsLoading(false)
      } catch (err) {
        setError("Failed to fetch market data")
        setIsLoading(false)
      }
    }

    fetchMarketData()
  }, [])

  if (isLoading) {
    return <div>Loading market data...</div>
  }

  if (error) {
    return <div className="text-red-500">{error}</div>
  }

  return (
    <div className="space-y-6">
      <Tabs defaultValue="overview">
        <TabsList>
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="technical">Technical Analysis</TabsTrigger>
          <TabsTrigger value="fundamental">Fundamental Analysis</TabsTrigger>
        </TabsList>
        
        <TabsContent value="overview" className="space-y-4">
          {marketData.map((data) => (
            <Card key={data.symbol}>
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  <span>{data.symbol}</span>
                  <Badge variant={data.trend === "up" ? "success" : "destructive"}>
                    {data.change24h > 0 ? <ArrowUp className="w-4 h-4 mr-1" /> : <ArrowDown className="w-4 h-4 mr-1" />}
                    {Math.abs(data.change24h)}%
                  </Badge>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm text-muted-foreground">Price</p>
                    <p className="text-2xl font-bold">${data.price.toLocaleString()}</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">24h Volume</p>
                    <p className="text-2xl font-bold">${data.volume24h.toLocaleString()}</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Market Cap</p>
                    <p className="text-2xl font-bold">${data.marketCap.toLocaleString()}</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Trend</p>
                    <div className="flex items-center">
                      {data.trend === "up" ? (
                        <TrendingUp className="w-5 h-5 text-green-500 mr-2" />
                      ) : (
                        <TrendingDown className="w-5 h-5 text-red-500 mr-2" />
                      )}
                      <span className="text-lg font-semibold capitalize">{data.trend}</span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </TabsContent>

        <TabsContent value="technical" className="space-y-4">
          {marketData.map((data) => (
            <Card key={data.symbol}>
              <CardHeader>
                <CardTitle>{data.symbol} Technical Indicators</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-3 gap-4">
                  <div>
                    <p className="text-sm text-muted-foreground">RSI</p>
                    <p className="text-2xl font-bold">{data.indicators.rsi}</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">MACD</p>
                    <p className="text-2xl font-bold">{data.indicators.macd}</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Volume</p>
                    <p className="text-2xl font-bold">${data.indicators.volume.toLocaleString()}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </TabsContent>

        <TabsContent value="fundamental" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Market Overview</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <Activity className="w-5 h-5 mr-2" />
                    <span>Total Market Cap</span>
                  </div>
                  <span className="font-bold">
                    ${marketData.reduce((acc, curr) => acc + curr.marketCap, 0).toLocaleString()}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <Activity className="w-5 h-5 mr-2" />
                    <span>24h Volume</span>
                  </div>
                  <span className="font-bold">
                    ${marketData.reduce((acc, curr) => acc + curr.volume24h, 0).toLocaleString()}
                  </span>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="font-display text-2xl">Market Overview</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <span className="font-medium">24h Volume</span>
                <span className="font-mono">$1.2B</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="font-medium">24h Change</span>
                <span className="font-mono text-green-500">+5.2%</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="font-medium">Market Cap</span>
                <span className="font-mono">$45.8B</span>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="font-display text-2xl">Trading Activity</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <span className="font-medium">24h Trades</span>
                <span className="font-mono">12,458</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="font-medium">Avg. Trade Size</span>
                <span className="font-mono">$25,000</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="font-medium">Liquidity Score</span>
                <span className="font-mono">85/100</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card className="mt-6">
        <CardHeader>
          <CardTitle className="font-display text-2xl">Market Depth</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-[400px]">
            <MarketDepthChart symbol="ETH/USD" />
          </div>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
        <Card>
          <CardHeader>
            <CardTitle className="font-display text-2xl">Recent Trades</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {recentTrades.map((trade: Trade, index: number) => (
                <div key={trade.id} className="flex justify-between items-center">
                  <span className={trade.type === "buy" ? "text-green-500" : "text-red-500"}>
                    {trade.type === "buy" ? "Buy" : "Sell"}
                  </span>
                  <span className="font-mono">${trade.price.toLocaleString()}</span>
                  <span className="font-mono">{trade.amount.toFixed(4)}</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="font-display text-2xl">Market Sentiment</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <span className="font-medium">Bullish</span>
                <span className="font-mono text-green-500">65%</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="font-medium">Bearish</span>
                <span className="font-mono text-red-500">35%</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="font-medium">Volatility</span>
                <span className="font-mono">Medium</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
} 