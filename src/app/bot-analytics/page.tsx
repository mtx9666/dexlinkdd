"use client"

import { useState } from "react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { BotGrid } from "@/components/bots/bot-grid"
import { BotFilters } from "@/components/bots/bot-filters"
import { BotAnalytics } from "@/components/bots/bot-analytics"

export default function BotAnalyticsPage() {
  const [selectedBot, setSelectedBot] = useState<string | null>(null)
  const [timeframe, setTimeframe] = useState("7d")

  return (
    <div className="container py-8 space-y-8">
      <div className="flex flex-col space-y-4">
        <h1 className="text-4xl font-display font-bold tracking-tight">Bot Analytics</h1>
        <p className="text-xl text-muted-foreground">
          Track and analyze the performance of your trading bots
        </p>
      </div>

      <div className="flex flex-col md:flex-row gap-4 items-start">
        <div className="w-full md:w-64">
          <Card>
            <CardHeader>
              <CardTitle>Your Bots</CardTitle>
              <CardDescription>Select a bot to view analytics</CardDescription>
            </CardHeader>
            <CardContent>
              <BotGrid 
                searchQuery=""
                category="all"
                sortBy="performance"
                status="active"
                isUserBots={true}
                onBotSelect={setSelectedBot}
                compact={true}
              />
            </CardContent>
          </Card>
        </div>
        
        <div className="flex-1 space-y-6">
          <div className="flex justify-between items-center">
            <h2 className="text-2xl font-bold">
              {selectedBot ? "Bot Performance" : "Select a bot to view analytics"}
            </h2>
            <Select value={timeframe} onValueChange={setTimeframe}>
              <SelectTrigger className="w-32">
                <SelectValue placeholder="Timeframe" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="24h">24 Hours</SelectItem>
                <SelectItem value="7d">7 Days</SelectItem>
                <SelectItem value="30d">30 Days</SelectItem>
                <SelectItem value="90d">90 Days</SelectItem>
                <SelectItem value="all">All Time</SelectItem>
              </SelectContent>
            </Select>
          </div>
          
          {selectedBot ? (
            <BotAnalytics botId={selectedBot} timeframe={timeframe} />
          ) : (
            <Card className="h-96 flex items-center justify-center">
              <CardContent className="text-center">
                <p className="text-muted-foreground">Select a bot from the list to view its analytics</p>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  )
} 