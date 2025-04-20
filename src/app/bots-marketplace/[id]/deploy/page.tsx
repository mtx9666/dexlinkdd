"use client"

import { useState, useEffect } from "react"
import { useParams, useRouter } from "next/navigation"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Slider } from "@/components/ui/slider"
import { Switch } from "@/components/ui/switch"
import { Bot as BotType } from "@/components/bots/bot-grid"
import { ArrowLeft, Bot, Settings, Shield, Zap, Wallet } from "lucide-react"
import Link from "next/link"

export default function BotDeployPage() {
  const params = useParams()
  const router = useRouter()
  const botId = params.id as string
  
  const [bot, setBot] = useState<BotType | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [step, setStep] = useState(1)
  const [formData, setFormData] = useState({
    exchange: "",
    apiKey: "",
    apiSecret: "",
    tradingPair: "BTC/USDT",
    investmentAmount: 1000,
    riskLevel: 50,
    stopLoss: 5,
    takeProfit: 10,
    enableNotifications: true,
    strategy: "default",
  })
  
  useEffect(() => {
    const fetchBotDetails = async () => {
      try {
        setIsLoading(true)
        // In a real app, this would be an API call
        // For now, we'll use mock data
        const mockBots: BotType[] = [
          {
            id: "1",
            name: "Trend Following Bot",
            description: "Automatically follows market trends using advanced technical analysis",
            category: "trend",
            rating: 4.8,
            reviews: 124,
            users: 1250,
            performance: 15.2,
            price: 49.99,
            isFeatured: true,
            isNew: false,
            image: "/images/bots/trend-bot.png",
            tags: ["trend", "technical", "automated"],
            createdAt: "2023-05-15"
          },
          {
            id: "2",
            name: "Arbitrage Bot",
            description: "Identifies and exploits price differences across exchanges",
            category: "arbitrage",
            rating: 4.6,
            reviews: 89,
            users: 780,
            performance: 12.5,
            price: 79.99,
            isFeatured: true,
            isNew: true,
            image: "/images/bots/arbitrage-bot.png",
            tags: ["arbitrage", "multi-exchange", "high-frequency"],
            createdAt: "2023-06-20"
          },
          {
            id: "3",
            name: "Grid Trading Bot",
            description: "Creates a grid of buy and sell orders to profit from volatility",
            category: "grid",
            rating: 4.5,
            reviews: 67,
            users: 520,
            performance: 8.7,
            price: 39.99,
            isFeatured: false,
            isNew: false,
            image: "/images/bots/grid-bot.png",
            tags: ["grid", "volatility", "range-bound"],
            createdAt: "2023-04-10"
          },
          {
            id: "4",
            name: "DCA Bot",
            description: "Automates dollar-cost averaging strategy for long-term investors",
            category: "dca",
            rating: 4.7,
            reviews: 92,
            users: 950,
            performance: 10.3,
            price: 29.99,
            isFeatured: false,
            isNew: true,
            image: "/images/bots/dca-bot.png",
            tags: ["dca", "long-term", "investment"],
            createdAt: "2023-06-05"
          },
          {
            id: "5",
            name: "Sentiment Analysis Bot",
            description: "Trades based on social media and news sentiment analysis",
            category: "sentiment",
            rating: 4.3,
            reviews: 45,
            users: 320,
            performance: 7.8,
            price: 59.99,
            isFeatured: false,
            isNew: false,
            image: "/images/bots/sentiment-bot.png",
            tags: ["sentiment", "social", "news"],
            createdAt: "2023-03-22"
          },
          {
            id: "6",
            name: "Momentum Bot",
            description: "Identifies and trades on momentum signals across multiple timeframes",
            category: "momentum",
            rating: 4.9,
            reviews: 156,
            users: 1800,
            performance: 18.5,
            price: 69.99,
            isFeatured: true,
            isNew: false,
            image: "/images/bots/momentum-bot.png",
            tags: ["momentum", "technical", "multi-timeframe"],
            createdAt: "2023-02-15"
          }
        ]
        
        const foundBot = mockBots.find(b => b.id === botId)
        
        if (foundBot) {
          setBot(foundBot)
        } else {
          setError("Bot not found")
        }
        
        setIsLoading(false)
      } catch (err) {
        setError("Failed to fetch bot details")
        setIsLoading(false)
      }
    }
    
    fetchBotDetails()
  }, [botId])
  
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFormData({
      ...formData,
      [name]: value
    })
  }
  
  const handleSelectChange = (name: string, value: string) => {
    setFormData({
      ...formData,
      [name]: value
    })
  }
  
  const handleSliderChange = (name: string, value: number[]) => {
    setFormData({
      ...formData,
      [name]: value[0]
    })
  }
  
  const handleSwitchChange = (name: string, checked: boolean) => {
    setFormData({
      ...formData,
      [name]: checked
    })
  }
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    // In a real app, this would submit the form data to the API
    console.log("Form submitted:", formData)
    // Navigate to success page or dashboard
    router.push("/dashboard")
  }
  
  if (isLoading) {
    return (
      <div className="container py-8">
        <div className="animate-pulse space-y-8">
          <div className="h-8 bg-muted rounded w-1/3"></div>
          <div className="h-4 bg-muted rounded w-1/4"></div>
          <div className="h-96 bg-muted rounded"></div>
        </div>
      </div>
    )
  }
  
  if (error || !bot) {
    return (
      <div className="container py-8">
        <div className="text-center py-12">
          <h2 className="text-2xl font-bold mb-2">Bot Not Found</h2>
          <p className="text-muted-foreground mb-4">{error || "The bot you're looking for doesn't exist."}</p>
          <Button asChild>
            <Link href="/bots-marketplace">Back to Marketplace</Link>
          </Button>
        </div>
      </div>
    )
  }
  
  return (
    <div className="container py-8 space-y-8">
      <div className="flex flex-col space-y-2">
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <Link href="/bots-marketplace" className="hover:underline">Bots Marketplace</Link>
          <span>/</span>
          <Link href={`/bots-marketplace/${bot.id}`} className="hover:underline">{bot.name}</Link>
          <span>/</span>
          <span>Deploy</span>
        </div>
        <h1 className="text-4xl font-display font-bold tracking-tight">Deploy {bot.name}</h1>
        <p className="text-xl text-muted-foreground">
          Configure your bot settings and connect your exchange to start trading
        </p>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="md:col-span-2">
          <Card>
            <CardHeader>
              <CardTitle>Configuration</CardTitle>
              <CardDescription>
                Set up your bot with the right parameters for optimal performance
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-6">
                <Tabs defaultValue="exchange" className="w-full">
                  <TabsList className="grid grid-cols-3 w-full">
                    <TabsTrigger value="exchange">Exchange</TabsTrigger>
                    <TabsTrigger value="strategy">Strategy</TabsTrigger>
                    <TabsTrigger value="risk">Risk Management</TabsTrigger>
                  </TabsList>
                  
                  <TabsContent value="exchange" className="space-y-4 pt-4">
                    <div className="space-y-2">
                      <Label htmlFor="exchange">Exchange</Label>
                      <Select 
                        value={formData.exchange} 
                        onValueChange={(value) => handleSelectChange("exchange", value)}
                      >
                        <SelectTrigger id="exchange">
                          <SelectValue placeholder="Select an exchange" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="binance">Binance</SelectItem>
                          <SelectItem value="coinbase">Coinbase</SelectItem>
                          <SelectItem value="kraken">Kraken</SelectItem>
                          <SelectItem value="kucoin">KuCoin</SelectItem>
                          <SelectItem value="ftx">FTX</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="apiKey">API Key</Label>
                      <Input 
                        id="apiKey" 
                        name="apiKey" 
                        value={formData.apiKey} 
                        onChange={handleInputChange}
                        placeholder="Enter your API key"
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="apiSecret">API Secret</Label>
                      <Input 
                        id="apiSecret" 
                        name="apiSecret" 
                        type="password"
                        value={formData.apiSecret} 
                        onChange={handleInputChange}
                        placeholder="Enter your API secret"
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="tradingPair">Trading Pair</Label>
                      <Select 
                        value={formData.tradingPair} 
                        onValueChange={(value) => handleSelectChange("tradingPair", value)}
                      >
                        <SelectTrigger id="tradingPair">
                          <SelectValue placeholder="Select a trading pair" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="BTC/USDT">BTC/USDT</SelectItem>
                          <SelectItem value="ETH/USDT">ETH/USDT</SelectItem>
                          <SelectItem value="BNB/USDT">BNB/USDT</SelectItem>
                          <SelectItem value="ADA/USDT">ADA/USDT</SelectItem>
                          <SelectItem value="SOL/USDT">SOL/USDT</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="investmentAmount">Investment Amount (USDT)</Label>
                      <Input 
                        id="investmentAmount" 
                        name="investmentAmount" 
                        type="number"
                        value={formData.investmentAmount} 
                        onChange={handleInputChange}
                        placeholder="Enter investment amount"
                      />
                    </div>
                  </TabsContent>
                  
                  <TabsContent value="strategy" className="space-y-4 pt-4">
                    <div className="space-y-2">
                      <Label htmlFor="strategy">Strategy</Label>
                      <Select 
                        value={formData.strategy} 
                        onValueChange={(value) => handleSelectChange("strategy", value)}
                      >
                        <SelectTrigger id="strategy">
                          <SelectValue placeholder="Select a strategy" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="default">Default</SelectItem>
                          <SelectItem value="aggressive">Aggressive</SelectItem>
                          <SelectItem value="conservative">Conservative</SelectItem>
                          <SelectItem value="custom">Custom</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    
                    <div className="space-y-2">
                      <Label>Timeframe</Label>
                      <div className="grid grid-cols-2 gap-2">
                        <div className="flex items-center space-x-2">
                          <input 
                            type="checkbox" 
                            id="timeframe1m" 
                            className="h-4 w-4 rounded border-gray-300 text-primary focus:ring-primary"
                          />
                          <Label htmlFor="timeframe1m">1m</Label>
                        </div>
                        <div className="flex items-center space-x-2">
                          <input 
                            type="checkbox" 
                            id="timeframe5m" 
                            className="h-4 w-4 rounded border-gray-300 text-primary focus:ring-primary"
                          />
                          <Label htmlFor="timeframe5m">5m</Label>
                        </div>
                        <div className="flex items-center space-x-2">
                          <input 
                            type="checkbox" 
                            id="timeframe15m" 
                            className="h-4 w-4 rounded border-gray-300 text-primary focus:ring-primary"
                          />
                          <Label htmlFor="timeframe15m">15m</Label>
                        </div>
                        <div className="flex items-center space-x-2">
                          <input 
                            type="checkbox" 
                            id="timeframe1h" 
                            className="h-4 w-4 rounded border-gray-300 text-primary focus:ring-primary"
                          />
                          <Label htmlFor="timeframe1h">1h</Label>
                        </div>
                        <div className="flex items-center space-x-2">
                          <input 
                            type="checkbox" 
                            id="timeframe4h" 
                            className="h-4 w-4 rounded border-gray-300 text-primary focus:ring-primary"
                          />
                          <Label htmlFor="timeframe4h">4h</Label>
                        </div>
                        <div className="flex items-center space-x-2">
                          <input 
                            type="checkbox" 
                            id="timeframe1d" 
                            className="h-4 w-4 rounded border-gray-300 text-primary focus:ring-primary"
                          />
                          <Label htmlFor="timeframe1d">1d</Label>
                        </div>
                      </div>
                    </div>
                    
                    <div className="space-y-2">
                      <Label>Indicators</Label>
                      <div className="grid grid-cols-2 gap-2">
                        <div className="flex items-center space-x-2">
                          <input 
                            type="checkbox" 
                            id="indicatorRSI" 
                            className="h-4 w-4 rounded border-gray-300 text-primary focus:ring-primary"
                          />
                          <Label htmlFor="indicatorRSI">RSI</Label>
                        </div>
                        <div className="flex items-center space-x-2">
                          <input 
                            type="checkbox" 
                            id="indicatorMACD" 
                            className="h-4 w-4 rounded border-gray-300 text-primary focus:ring-primary"
                          />
                          <Label htmlFor="indicatorMACD">MACD</Label>
                        </div>
                        <div className="flex items-center space-x-2">
                          <input 
                            type="checkbox" 
                            id="indicatorBB" 
                            className="h-4 w-4 rounded border-gray-300 text-primary focus:ring-primary"
                          />
                          <Label htmlFor="indicatorBB">Bollinger Bands</Label>
                        </div>
                        <div className="flex items-center space-x-2">
                          <input 
                            type="checkbox" 
                            id="indicatorMA" 
                            className="h-4 w-4 rounded border-gray-300 text-primary focus:ring-primary"
                          />
                          <Label htmlFor="indicatorMA">Moving Averages</Label>
                        </div>
                      </div>
                    </div>
                  </TabsContent>
                  
                  <TabsContent value="risk" className="space-y-4 pt-4">
                    <div className="space-y-2">
                      <div className="flex justify-between">
                        <Label htmlFor="riskLevel">Risk Level</Label>
                        <span className="text-sm font-medium">{formData.riskLevel}%</span>
                      </div>
                      <Slider 
                        id="riskLevel" 
                        min={1} 
                        max={100} 
                        step={1} 
                        value={[formData.riskLevel]} 
                        onValueChange={(value) => handleSliderChange("riskLevel", value)}
                      />
                      <div className="flex justify-between text-xs text-muted-foreground">
                        <span>Conservative</span>
                        <span>Aggressive</span>
                      </div>
                    </div>
                    
                    <div className="space-y-2">
                      <div className="flex justify-between">
                        <Label htmlFor="stopLoss">Stop Loss (%)</Label>
                        <span className="text-sm font-medium">{formData.stopLoss}%</span>
                      </div>
                      <Slider 
                        id="stopLoss" 
                        min={1} 
                        max={20} 
                        step={1} 
                        value={[formData.stopLoss]} 
                        onValueChange={(value) => handleSliderChange("stopLoss", value)}
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <div className="flex justify-between">
                        <Label htmlFor="takeProfit">Take Profit (%)</Label>
                        <span className="text-sm font-medium">{formData.takeProfit}%</span>
                      </div>
                      <Slider 
                        id="takeProfit" 
                        min={1} 
                        max={50} 
                        step={1} 
                        value={[formData.takeProfit]} 
                        onValueChange={(value) => handleSliderChange("takeProfit", value)}
                      />
                    </div>
                    
                    <div className="flex items-center justify-between pt-2">
                      <Label htmlFor="enableNotifications">Enable Notifications</Label>
                      <Switch 
                        id="enableNotifications" 
                        checked={formData.enableNotifications} 
                        onCheckedChange={(checked) => handleSwitchChange("enableNotifications", checked)}
                      />
                    </div>
                  </TabsContent>
                </Tabs>
                
                <div className="flex justify-end pt-4">
                  <Button type="submit" size="lg">
                    Deploy Bot
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>
        </div>
        
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Bot Summary</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center gap-3">
                  <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center">
                    <Bot className="h-6 w-6 text-primary" />
                  </div>
                  <div>
                    <h3 className="font-medium">{bot.name}</h3>
                    <p className="text-sm text-muted-foreground">{bot.category}</p>
                  </div>
                </div>
                
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Price</span>
                    <span className="font-medium">${bot.price.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Performance</span>
                    <span className="font-medium text-green-500">+{bot.performance.toFixed(1)}%</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Users</span>
                    <span className="font-medium">{bot.users.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Rating</span>
                    <span className="font-medium">{bot.rating.toFixed(1)} ({bot.reviews})</span>
                  </div>
                </div>
                
                <div className="pt-2">
                  <p className="text-sm text-muted-foreground">{bot.description}</p>
                </div>
              </div>
            </CardContent>
            <CardFooter>
              <Button variant="outline" className="w-full" asChild>
                <Link href={`/bots-marketplace/${bot.id}`}>
                  <ArrowLeft className="h-4 w-4 mr-2" />
                  Back to Details
                </Link>
              </Button>
            </CardFooter>
          </Card>
          
          <Card>
            <CardHeader>
              <CardTitle>Need Help?</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-start gap-3">
                  <div className="bg-primary/10 p-2 rounded-full">
                    <Settings className="h-5 w-5 text-primary" />
                  </div>
                  <div>
                    <h3 className="font-medium">Configuration Guide</h3>
                    <p className="text-sm text-muted-foreground">
                      Learn how to configure your bot for optimal performance
                    </p>
                  </div>
                </div>
                
                <div className="flex items-start gap-3">
                  <div className="bg-primary/10 p-2 rounded-full">
                    <Shield className="h-5 w-5 text-primary" />
                  </div>
                  <div>
                    <h3 className="font-medium">Security Tips</h3>
                    <p className="text-sm text-muted-foreground">
                      Best practices for securing your API keys
                    </p>
                  </div>
                </div>
                
                <div className="flex items-start gap-3">
                  <div className="bg-primary/10 p-2 rounded-full">
                    <Wallet className="h-5 w-5 text-primary" />
                  </div>
                  <div>
                    <h3 className="font-medium">Payment Options</h3>
                    <p className="text-sm text-muted-foreground">
                      Various payment methods accepted
                    </p>
                  </div>
                </div>
              </div>
            </CardContent>
            <CardFooter>
              <Button variant="outline" className="w-full">
                Contact Support
              </Button>
            </CardFooter>
          </Card>
        </div>
      </div>
    </div>
  )
} 