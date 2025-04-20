"use client"

import { useState } from "react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { BotGrid } from "@/components/bots/bot-grid"
import { BotFilters } from "@/components/bots/bot-filters"

export default function BotsMarketplacePage() {
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedCategory, setSelectedCategory] = useState("all")
  const [sortBy, setSortBy] = useState("popular")

  return (
    <div className="container py-8 space-y-8">
      <div className="flex flex-col space-y-4">
        <h1 className="text-4xl font-display font-bold tracking-tight">Bots Marketplace</h1>
        <p className="text-xl text-muted-foreground">
          Discover and deploy powerful trading bots to automate your crypto trading strategies
        </p>
      </div>

      <div className="flex flex-col md:flex-row gap-4 items-start">
        <div className="w-full md:w-64">
          <BotFilters 
            selectedCategory={selectedCategory} 
            onCategoryChange={setSelectedCategory} 
          />
        </div>
        
        <div className="flex-1 space-y-6">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex-1">
              <Input
                placeholder="Search bots..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full"
              />
            </div>
            <Select value={sortBy} onValueChange={setSortBy}>
              <SelectTrigger className="w-full sm:w-40">
                <SelectValue placeholder="Sort by" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="popular">Most Popular</SelectItem>
                <SelectItem value="newest">Newest</SelectItem>
                <SelectItem value="rating">Highest Rated</SelectItem>
                <SelectItem value="performance">Best Performance</SelectItem>
              </SelectContent>
            </Select>
          </div>
          
          <Tabs defaultValue="all" className="w-full">
            <TabsList className="grid grid-cols-3 w-full md:w-auto">
              <TabsTrigger value="all">All Bots</TabsTrigger>
              <TabsTrigger value="featured">Featured</TabsTrigger>
              <TabsTrigger value="new">New Releases</TabsTrigger>
            </TabsList>
            
            <TabsContent value="all" className="mt-6">
              <BotGrid 
                searchQuery={searchQuery}
                category={selectedCategory}
                sortBy={sortBy}
              />
            </TabsContent>
            
            <TabsContent value="featured" className="mt-6">
              <BotGrid 
                searchQuery={searchQuery}
                category={selectedCategory}
                sortBy={sortBy}
                featured={true}
              />
            </TabsContent>
            
            <TabsContent value="new" className="mt-6">
              <BotGrid 
                searchQuery={searchQuery}
                category={selectedCategory}
                sortBy={sortBy}
                newReleases={true}
              />
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  )
} 