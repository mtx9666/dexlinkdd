"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Star, TrendingUp, Users, Zap, Clock, BarChart, Play, Pause, Archive } from "lucide-react"
import Link from "next/link"

export interface Bot {
  id: string
  name: string
  description: string
  category: string
  rating: number
  reviews: number
  users: number
  performance: number
  price: number
  isFeatured: boolean
  isNew: boolean
  image: string
  tags: string[]
  createdAt: string
  status?: "active" | "paused" | "archived"
  isUserBot?: boolean
}

interface BotGridProps {
  searchQuery: string
  category: string
  sortBy: string
  featured?: boolean
  newReleases?: boolean
  status?: "active" | "paused" | "archived"
  isUserBots?: boolean
  onBotSelect?: (botId: string) => void
  compact?: boolean
}

export function BotGrid({ 
  searchQuery, 
  category, 
  sortBy, 
  featured = false, 
  newReleases = false,
  status,
  isUserBots = false,
  onBotSelect,
  compact = false
}: BotGridProps) {
  const [bots, setBots] = useState<Bot[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchBots = async () => {
      try {
        setIsLoading(true)
        // In a real app, this would be an API call
        // For now, we'll use mock data
        const mockBots: Bot[] = [
          {
            id: "sniper1",
            name: "MEV Sniper Pro",
            description: "Advanced MEV bot for frontrunning opportunities and new token launches",
            category: "sniper",
            rating: 4.9,
            reviews: 245,
            users: 2100,
            performance: 25.8,
            price: 149.99,
            isFeatured: true,
            isNew: true,
            image: "/images/bots/sniper-bot.png",
            tags: ["sniper", "mev", "frontrun", "new-tokens"],
            createdAt: "2024-03-01",
            status: "active"
          },
          {
            id: "sniper2",
            name: "Memecoin Hunter",
            description: "Automatically detects and snipes promising new memecoins at launch",
            category: "sniper",
            rating: 4.7,
            reviews: 178,
            users: 1560,
            performance: 22.4,
            price: 99.99,
            isFeatured: true,
            isNew: false,
            image: "/images/bots/memecoin-bot.png",
            tags: ["sniper", "memecoin", "launch", "automated"],
            createdAt: "2024-02-15"
          },
          {
            id: "sniper3",
            name: "Presale Sniper",
            description: "Participates in presales and fair launches with custom gas strategies",
            category: "sniper",
            rating: 4.8,
            reviews: 156,
            users: 890,
            performance: 19.6,
            price: 79.99,
            isFeatured: false,
            isNew: true,
            image: "/images/bots/presale-bot.png",
            tags: ["sniper", "presale", "fair-launch", "gas-strategy"],
            createdAt: "2024-02-28"
          },
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
            createdAt: "2023-05-15",
            status: "active",
            isUserBot: true
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
        
        // Filter bots based on search query, category, featured, new releases, and status
        let filteredBots = mockBots
        
        if (searchQuery) {
          filteredBots = filteredBots.filter(bot => 
            bot.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
            bot.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
            bot.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()))
          )
        }
        
        if (category !== "all") {
          filteredBots = filteredBots.filter(bot => bot.category === category)
        }
        
        if (featured) {
          filteredBots = filteredBots.filter(bot => bot.isFeatured)
        }
        
        if (newReleases) {
          filteredBots = filteredBots.filter(bot => bot.isNew)
        }

        if (status) {
          filteredBots = filteredBots.filter(bot => bot.status === status)
        }

        if (isUserBots) {
          filteredBots = filteredBots.filter(bot => bot.isUserBot)
        }
        
        // Sort bots based on sortBy
        switch (sortBy) {
          case "popular":
            filteredBots.sort((a, b) => b.users - a.users)
            break
          case "newest":
            filteredBots.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
            break
          case "oldest":
            filteredBots.sort((a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime())
            break
          case "name":
            filteredBots.sort((a, b) => a.name.localeCompare(b.name))
            break
          case "rating":
            filteredBots.sort((a, b) => b.rating - a.rating)
            break
          case "performance":
            filteredBots.sort((a, b) => b.performance - a.performance)
            break
          default:
            break
        }
        
        setBots(filteredBots)
        setIsLoading(false)
      } catch (err) {
        setError("Failed to fetch bots")
        setIsLoading(false)
      }
    }
    
    fetchBots()
  }, [searchQuery, category, sortBy, featured, newReleases, status, isUserBots])

  if (isLoading) {
    return <div>Loading...</div>
  }

  if (error) {
    return <div>Error: {error}</div>
  }

  if (bots.length === 0) {
    return (
      <div className="text-center py-8">
        <p className="text-muted-foreground">No bots found</p>
      </div>
    )
  }

  if (compact) {
    return (
      <div className="space-y-2">
        {bots.map((bot) => (
          <div 
            key={bot.id} 
            className="flex items-center justify-between p-3 rounded-md border hover:bg-muted/50 cursor-pointer"
            onClick={() => onBotSelect?.(bot.id)}
          >
            <div className="flex items-center space-x-3">
              <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center">
                <span className="text-primary font-medium">{bot.name.charAt(0)}</span>
              </div>
              <div>
                <div className="font-medium">{bot.name}</div>
                <div className="text-xs text-muted-foreground">{bot.category}</div>
              </div>
            </div>
            <div className="flex items-center space-x-2">
              {bot.status && (
                <Badge variant={
                  bot.status === "active" ? "default" :
                  bot.status === "paused" ? "secondary" :
                  "outline"
                }>
                  {bot.status === "active" ? (
                    <Play className="w-3 h-3 mr-1" />
                  ) : bot.status === "paused" ? (
                    <Pause className="w-3 h-3 mr-1" />
                  ) : (
                    <Archive className="w-3 h-3 mr-1" />
                  )}
                </Badge>
              )}
              <div className="text-sm font-medium">
                {bot.performance}%
              </div>
            </div>
          </div>
        ))}
      </div>
    )
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {bots.map((bot) => (
        <Card key={bot.id} className="flex flex-col">
          <CardHeader>
            <div className="flex items-start justify-between">
              <div>
                <CardTitle className="text-xl">{bot.name}</CardTitle>
                <CardDescription className="mt-2">{bot.description}</CardDescription>
              </div>
              {bot.status && (
                <Badge variant={
                  bot.status === "active" ? "default" :
                  bot.status === "paused" ? "secondary" :
                  "outline"
                }>
                  {bot.status === "active" ? (
                    <Play className="w-3 h-3 mr-1" />
                  ) : bot.status === "paused" ? (
                    <Pause className="w-3 h-3 mr-1" />
                  ) : (
                    <Archive className="w-3 h-3 mr-1" />
                  )}
                  {bot.status.charAt(0).toUpperCase() + bot.status.slice(1)}
                </Badge>
              )}
            </div>
          </CardHeader>
          <CardContent className="flex-1">
            <div className="grid grid-cols-2 gap-4">
              <div className="flex items-center space-x-2">
                <Star className="w-4 h-4 text-yellow-500" />
                <span>{bot.rating} ({bot.reviews} reviews)</span>
              </div>
              <div className="flex items-center space-x-2">
                <Users className="w-4 h-4" />
                <span>{bot.users} users</span>
              </div>
              <div className="flex items-center space-x-2">
                <TrendingUp className="w-4 h-4 text-green-500" />
                <span>{bot.performance}% performance</span>
              </div>
              <div className="flex items-center space-x-2">
                <Clock className="w-4 h-4" />
                <span>Created {new Date(bot.createdAt).toLocaleDateString()}</span>
              </div>
            </div>
            <div className="mt-4 flex flex-wrap gap-2">
              {bot.tags.map((tag) => (
                <Badge key={tag} variant="secondary">
                  {tag}
                </Badge>
              ))}
            </div>
          </CardContent>
          <CardFooter className="flex justify-between items-center">
            <div className="text-2xl font-bold">${bot.price}</div>
            <div className="flex space-x-2">
              {isUserBots ? (
                <>
                  <Button variant="outline" size="sm">
                    Configure
                  </Button>
                  <Button variant="outline" size="sm">
                    Analytics
                  </Button>
                </>
              ) : (
                <Button asChild>
                  <Link href={`/bots-marketplace/${bot.id}`}>
                    View Details
                  </Link>
                </Button>
              )}
            </div>
          </CardFooter>
        </Card>
      ))}
    </div>
  )
} 