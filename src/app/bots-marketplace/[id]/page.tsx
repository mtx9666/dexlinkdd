"use client"

import { useState, useEffect } from "react"
import { useParams } from "next/navigation"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Star, TrendingUp, Users, Zap, Clock, BarChart, ArrowLeftRight, DollarSign, MessageSquare, Bot, Settings, Code, BookOpen, Shield, ZapIcon } from "lucide-react"
import Link from "next/link"
import { Bot as BotType } from "@/components/bots/bot-grid"

export default function BotDetailPage() {
  const params = useParams()
  const botId = params.id as string
  
  const [bot, setBot] = useState<BotType | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  
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
  
  if (isLoading) {
    return (
      <div className="container py-8">
        <div className="animate-pulse space-y-8">
          <div className="h-8 bg-muted rounded w-1/3"></div>
          <div className="h-4 bg-muted rounded w-1/4"></div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="md:col-span-2 h-96 bg-muted rounded"></div>
            <div className="h-96 bg-muted rounded"></div>
          </div>
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
  
  const getCategoryIcon = (category: string) => {
    switch (category) {
      case "trend":
        return TrendingUp
      case "arbitrage":
        return ArrowLeftRight
      case "grid":
        return BarChart
      case "dca":
        return DollarSign
      case "sentiment":
        return MessageSquare
      case "momentum":
        return Zap
      default:
        return Bot
    }
  }
  
  const CategoryIcon = getCategoryIcon(bot.category)
  
  return (
    <div className="container py-8 space-y-8">
      <div className="flex flex-col space-y-2">
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <Link href="/bots-marketplace" className="hover:underline">Bots Marketplace</Link>
          <span>/</span>
          <span>{bot.name}</span>
        </div>
        <h1 className="text-4xl font-display font-bold tracking-tight">{bot.name}</h1>
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-1">
            <Star className="h-4 w-4 text-yellow-500" />
            <span>{bot.rating.toFixed(1)} ({bot.reviews} reviews)</span>
          </div>
          <div className="flex items-center gap-1">
            <Users className="h-4 w-4 text-blue-500" />
            <span>{bot.users.toLocaleString()} users</span>
          </div>
          <div className="flex items-center gap-1">
            <TrendingUp className="h-4 w-4 text-green-500" />
            <span>{bot.performance.toFixed(1)}% performance</span>
          </div>
          <div className="flex items-center gap-1">
            <CategoryIcon className="h-4 w-4" />
            <span className="capitalize">{bot.category}</span>
          </div>
        </div>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="md:col-span-2 space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Overview</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="aspect-video bg-muted rounded-md mb-6 flex items-center justify-center">
                {/* In a real app, this would be an actual image */}
                <div className="text-muted-foreground text-sm">Bot Image</div>
              </div>
              <p className="text-muted-foreground mb-4">{bot.description}</p>
              <div className="flex flex-wrap gap-2">
                {bot.tags.map((tag) => (
                  <Badge key={tag} variant="secondary">
                    {tag}
                  </Badge>
                ))}
              </div>
            </CardContent>
          </Card>
          
          <Tabs defaultValue="features" className="w-full">
            <TabsList>
              <TabsTrigger value="features">Features</TabsTrigger>
              <TabsTrigger value="how-it-works">How It Works</TabsTrigger>
              <TabsTrigger value="reviews">Reviews</TabsTrigger>
            </TabsList>
            
            <TabsContent value="features" className="mt-6">
              <Card>
                <CardContent className="pt-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-4">
                      <div className="flex items-start gap-3">
                        <div className="bg-primary/10 p-2 rounded-full">
                          <Settings className="h-5 w-5 text-primary" />
                        </div>
                        <div>
                          <h3 className="font-medium">Customizable Parameters</h3>
                          <p className="text-sm text-muted-foreground">
                            Adjust the bot's settings to match your trading style and risk tolerance.
                          </p>
                        </div>
                      </div>
                      <div className="flex items-start gap-3">
                        <div className="bg-primary/10 p-2 rounded-full">
                          <Code className="h-5 w-5 text-primary" />
                        </div>
                        <div>
                          <h3 className="font-medium">Advanced Algorithms</h3>
                          <p className="text-sm text-muted-foreground">
                            Powered by sophisticated trading algorithms developed by expert traders.
                          </p>
                        </div>
                      </div>
                      <div className="flex items-start gap-3">
                        <div className="bg-primary/10 p-2 rounded-full">
                          <BookOpen className="h-5 w-5 text-primary" />
                        </div>
                        <div>
                          <h3 className="font-medium">Comprehensive Documentation</h3>
                          <p className="text-sm text-muted-foreground">
                            Detailed guides and tutorials to help you get the most out of the bot.
                          </p>
                        </div>
                      </div>
                    </div>
                    <div className="space-y-4">
                      <div className="flex items-start gap-3">
                        <div className="bg-primary/10 p-2 rounded-full">
                          <Shield className="h-5 w-5 text-primary" />
                        </div>
                        <div>
                          <h3 className="font-medium">Risk Management</h3>
                          <p className="text-sm text-muted-foreground">
                            Built-in risk management features to protect your investment.
                          </p>
                        </div>
                      </div>
                      <div className="flex items-start gap-3">
                        <div className="bg-primary/10 p-2 rounded-full">
                          <ZapIcon className="h-5 w-5 text-primary" />
                        </div>
                        <div>
                          <h3 className="font-medium">24/7 Operation</h3>
                          <p className="text-sm text-muted-foreground">
                            Runs continuously to capture opportunities around the clock.
                          </p>
                        </div>
                      </div>
                      <div className="flex items-start gap-3">
                        <div className="bg-primary/10 p-2 rounded-full">
                          <BarChart className="h-5 w-5 text-primary" />
                        </div>
                        <div>
                          <h3 className="font-medium">Performance Analytics</h3>
                          <p className="text-sm text-muted-foreground">
                            Detailed reports and analytics to track your bot's performance.
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
            
            <TabsContent value="how-it-works" className="mt-6">
              <Card>
                <CardContent className="pt-6">
                  <div className="space-y-6">
                    <div>
                      <h3 className="text-lg font-medium mb-2">How It Works</h3>
                      <p className="text-muted-foreground">
                        This bot uses advanced technical analysis to identify market trends and execute trades automatically.
                        It monitors multiple timeframes and indicators to determine the best entry and exit points.
                      </p>
                    </div>
                    
                    <div>
                      <h3 className="text-lg font-medium mb-2">Setup Process</h3>
                      <ol className="list-decimal list-inside space-y-2 text-muted-foreground">
                        <li>Connect your exchange API keys</li>
                        <li>Configure your trading parameters</li>
                        <li>Set your risk management rules</li>
                        <li>Start the bot and monitor its performance</li>
                      </ol>
                    </div>
                    
                    <div>
                      <h3 className="text-lg font-medium mb-2">Supported Exchanges</h3>
                      <div className="flex flex-wrap gap-2">
                        <Badge>Binance</Badge>
                        <Badge>Coinbase</Badge>
                        <Badge>Kraken</Badge>
                        <Badge>KuCoin</Badge>
                        <Badge>FTX</Badge>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
            
            <TabsContent value="reviews" className="mt-6">
              <Card>
                <CardContent className="pt-6">
                  <div className="space-y-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <h3 className="text-lg font-medium">User Reviews</h3>
                        <p className="text-sm text-muted-foreground">
                          {bot.reviews} reviews • {bot.rating.toFixed(1)} average rating
                        </p>
                      </div>
                      <Button>Write a Review</Button>
                    </div>
                    
                    <div className="space-y-4">
                      {/* Mock reviews */}
                      {[1, 2, 3].map((i) => (
                        <div key={i} className="border-b pb-4 last:border-b-0">
                          <div className="flex items-center justify-between mb-2">
                            <div className="flex items-center gap-2">
                              <div className="h-8 w-8 rounded-full bg-muted"></div>
                              <div>
                                <p className="font-medium">User {i}</p>
                                <div className="flex items-center gap-1 text-sm text-muted-foreground">
                                  <Star className="h-3 w-3 fill-yellow-500 text-yellow-500" />
                                  <Star className="h-3 w-3 fill-yellow-500 text-yellow-500" />
                                  <Star className="h-3 w-3 fill-yellow-500 text-yellow-500" />
                                  <Star className="h-3 w-3 fill-yellow-500 text-yellow-500" />
                                  <Star className="h-3 w-3 fill-yellow-500 text-yellow-500" />
                                  <span className="ml-1">5.0</span>
                                </div>
                              </div>
                            </div>
                            <span className="text-sm text-muted-foreground">2 weeks ago</span>
                          </div>
                          <p className="text-sm">
                            This bot has significantly improved my trading results. The automated trend following strategy works great, and I've seen consistent profits since I started using it.
                          </p>
                        </div>
                      ))}
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
        
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Pricing</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold mb-2">${bot.price.toFixed(2)}</div>
              <p className="text-muted-foreground mb-4">One-time payment</p>
              <ul className="space-y-2 text-sm">
                <li className="flex items-center gap-2">
                  <div className="h-1.5 w-1.5 rounded-full bg-primary"></div>
                  <span>Lifetime access</span>
                </li>
                <li className="flex items-center gap-2">
                  <div className="h-1.5 w-1.5 rounded-full bg-primary"></div>
                  <span>Free updates</span>
                </li>
                <li className="flex items-center gap-2">
                  <div className="h-1.5 w-1.5 rounded-full bg-primary"></div>
                  <span>Community support</span>
                </li>
                <li className="flex items-center gap-2">
                  <div className="h-1.5 w-1.5 rounded-full bg-primary"></div>
                  <span>30-day money-back guarantee</span>
                </li>
              </ul>
            </CardContent>
            <CardFooter className="flex flex-col gap-2">
              <Button className="w-full" size="lg" asChild>
                <Link href={`/bots-marketplace/${bot.id}/deploy`}>Deploy Now</Link>
              </Button>
              <Button variant="outline" className="w-full" asChild>
                <Link href={`/bots-marketplace/${bot.id}/demo`}>Try Demo</Link>
              </Button>
            </CardFooter>
          </Card>
          
          <Card>
            <CardHeader>
              <CardTitle>Performance</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div>
                  <div className="flex justify-between items-center mb-1">
                    <span className="text-sm font-medium">Monthly Return</span>
                    <span className="text-sm font-medium text-green-500">+{bot.performance.toFixed(1)}%</span>
                  </div>
                  <div className="h-2 bg-muted rounded-full overflow-hidden">
                    <div 
                      className="h-full bg-green-500 rounded-full" 
                      style={{ width: `${Math.min(bot.performance * 5, 100)}%` }}
                    ></div>
                  </div>
                </div>
                
                <div>
                  <div className="flex justify-between items-center mb-1">
                    <span className="text-sm font-medium">Win Rate</span>
                    <span className="text-sm font-medium">78%</span>
                  </div>
                  <div className="h-2 bg-muted rounded-full overflow-hidden">
                    <div className="h-full bg-blue-500 rounded-full" style={{ width: "78%" }}></div>
                  </div>
                </div>
                
                <div>
                  <div className="flex justify-between items-center mb-1">
                    <span className="text-sm font-medium">Risk Score</span>
                    <span className="text-sm font-medium">Medium</span>
                  </div>
                  <div className="h-2 bg-muted rounded-full overflow-hidden">
                    <div className="h-full bg-yellow-500 rounded-full" style={{ width: "50%" }}></div>
                  </div>
                </div>
              </div>
              
              <div className="mt-4 p-3 bg-muted rounded-md text-sm">
                <p className="font-medium mb-1">Performance Disclaimer</p>
                <p className="text-muted-foreground">
                  Past performance is not indicative of future results. Cryptocurrency trading involves significant risk.
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
} 