"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { 
  TrendingUp, 
  TrendingDown, 
  DollarSign, 
  Percent, 
  BarChart, 
  LineChart, 
  PieChart, 
  Activity,
  Clock,
  AlertTriangle
} from "lucide-react"

interface BotAnalyticsProps {
  botId: string
  timeframe: string
}

interface BotPerformance {
  totalTrades: number
  winRate: number
  profitLoss: number
  profitLossPercentage: number
  averageTradeDuration: string
  bestTrade: number
  worstTrade: number
  sharpeRatio: number
  maxDrawdown: number
  tradesPerDay: number
  riskRewardRatio: number
}

export function BotAnalytics({ botId, timeframe }: BotAnalyticsProps) {
  const [performance, setPerformance] = useState<BotPerformance | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchBotAnalytics = async () => {
      try {
        setIsLoading(true)
        // In a real app, this would be an API call
        // For now, we'll use mock data
        const mockPerformance: BotPerformance = {
          totalTrades: 124,
          winRate: 68.5,
          profitLoss: 1245.67,
          profitLossPercentage: 12.45,
          averageTradeDuration: "2h 15m",
          bestTrade: 245.32,
          worstTrade: -98.45,
          sharpeRatio: 1.8,
          maxDrawdown: 8.2,
          tradesPerDay: 4.2,
          riskRewardRatio: 2.5
        }
        
        // Simulate API delay
        setTimeout(() => {
          setPerformance(mockPerformance)
          setIsLoading(false)
        }, 1000)
      } catch (err) {
        setError("Failed to fetch bot analytics")
        setIsLoading(false)
      }
    }
    
    fetchBotAnalytics()
  }, [botId, timeframe])

  if (isLoading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {[1, 2, 3, 4, 5, 6].map((i) => (
          <Card key={i} className="animate-pulse">
            <CardHeader>
              <div className="h-6 bg-muted rounded w-3/4"></div>
            </CardHeader>
            <CardContent>
              <div className="h-8 bg-muted rounded w-1/2"></div>
            </CardContent>
          </Card>
        ))}
      </div>
    )
  }

  if (error) {
    return (
      <Card className="border-red-200 bg-red-50">
        <CardContent className="pt-6">
          <div className="flex items-center text-red-600">
            <AlertTriangle className="h-5 w-5 mr-2" />
            <p>{error}</p>
          </div>
        </CardContent>
      </Card>
    )
  }

  if (!performance) {
    return null
  }

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Total Trades</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{performance.totalTrades}</div>
            <div className="flex items-center text-xs text-muted-foreground mt-1">
              <Activity className="h-3 w-3 mr-1" />
              <span>{performance.tradesPerDay} trades/day</span>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Win Rate</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{performance.winRate}%</div>
            <div className="flex items-center text-xs text-muted-foreground mt-1">
              <Percent className="h-3 w-3 mr-1" />
              <span>of trades profitable</span>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Profit/Loss</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold flex items-center">
              <DollarSign className="h-5 w-5 mr-1" />
              {performance.profitLoss.toFixed(2)}
              <Badge 
                variant={performance.profitLoss >= 0 ? "default" : "destructive"} 
                className="ml-2"
              >
                {performance.profitLoss >= 0 ? (
                  <TrendingUp className="h-3 w-3 mr-1" />
                ) : (
                  <TrendingDown className="h-3 w-3 mr-1" />
                )}
                {performance.profitLossPercentage}%
              </Badge>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Best Trade</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">
              +${performance.bestTrade.toFixed(2)}
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Worst Trade</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-600">
              -${Math.abs(performance.worstTrade).toFixed(2)}
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Risk/Reward</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{performance.riskRewardRatio.toFixed(2)}</div>
            <div className="text-xs text-muted-foreground mt-1">
              Average ratio of profit to loss
            </div>
          </CardContent>
        </Card>
      </div>
      
      <Tabs defaultValue="overview" className="w-full">
        <TabsList className="grid grid-cols-4 w-full md:w-auto">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="performance">Performance</TabsTrigger>
          <TabsTrigger value="trades">Trades</TabsTrigger>
          <TabsTrigger value="settings">Settings</TabsTrigger>
        </TabsList>
        
        <TabsContent value="overview" className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle>Bot Overview</CardTitle>
              <CardDescription>Summary of your bot's performance</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h3 className="text-lg font-medium mb-4">Performance Metrics</h3>
                  <div className="space-y-4">
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Sharpe Ratio</span>
                      <span className="font-medium">{performance.sharpeRatio.toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Max Drawdown</span>
                      <span className="font-medium">{performance.maxDrawdown}%</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Average Trade Duration</span>
                      <span className="font-medium">{performance.averageTradeDuration}</span>
                    </div>
                  </div>
                </div>
                <div>
                  <h3 className="text-lg font-medium mb-4">Recommendations</h3>
                  <div className="space-y-2">
                    <div className="flex items-start">
                      <div className="h-2 w-2 rounded-full bg-green-500 mt-2 mr-2"></div>
                      <p className="text-sm">Your bot is performing well above average with a positive win rate.</p>
                    </div>
                    <div className="flex items-start">
                      <div className="h-2 w-2 rounded-full bg-yellow-500 mt-2 mr-2"></div>
                      <p className="text-sm">Consider increasing position sizes to maximize returns.</p>
                    </div>
                    <div className="flex items-start">
                      <div className="h-2 w-2 rounded-full bg-blue-500 mt-2 mr-2"></div>
                      <p className="text-sm">Monitor market conditions for potential strategy adjustments.</p>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="performance" className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle>Performance Charts</CardTitle>
              <CardDescription>Visual representation of your bot's performance</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-80 flex items-center justify-center border rounded-md bg-muted/20">
                <div className="text-center">
                  <BarChart className="h-12 w-12 mx-auto text-muted-foreground" />
                  <p className="mt-2 text-muted-foreground">Performance charts will be displayed here</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="trades" className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle>Recent Trades</CardTitle>
              <CardDescription>List of your bot's recent trading activity</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-80 flex items-center justify-center border rounded-md bg-muted/20">
                <div className="text-center">
                  <LineChart className="h-12 w-12 mx-auto text-muted-foreground" />
                  <p className="mt-2 text-muted-foreground">Trade history will be displayed here</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="settings" className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle>Bot Settings</CardTitle>
              <CardDescription>Configure your bot's parameters</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-80 flex items-center justify-center border rounded-md bg-muted/20">
                <div className="text-center">
                  <PieChart className="h-12 w-12 mx-auto text-muted-foreground" />
                  <p className="mt-2 text-muted-foreground">Bot settings will be displayed here</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
} 