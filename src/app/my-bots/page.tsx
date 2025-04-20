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

export default function MyBotsPage() {
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedCategory, setSelectedCategory] = useState("all")
  const [sortBy, setSortBy] = useState("performance")

  return (
    <div className="container py-8 space-y-8">
      <div className="flex flex-col space-y-4">
        <h1 className="text-4xl font-display font-bold tracking-tight">My Bots</h1>
        <p className="text-xl text-muted-foreground">
          Manage your deployed trading bots and monitor their performance
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
                placeholder="Search my bots..."
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
                <SelectItem value="performance">Best Performance</SelectItem>
                <SelectItem value="newest">Newest</SelectItem>
                <SelectItem value="oldest">Oldest</SelectItem>
                <SelectItem value="name">Name</SelectItem>
              </SelectContent>
            </Select>
          </div>
          
          <Tabs defaultValue="active" className="w-full">
            <TabsList className="grid grid-cols-3 w-full md:w-auto">
              <TabsTrigger value="active">Active</TabsTrigger>
              <TabsTrigger value="paused">Paused</TabsTrigger>
              <TabsTrigger value="archived">Archived</TabsTrigger>
            </TabsList>
            
            <TabsContent value="active" className="mt-6">
              <BotGrid 
                searchQuery={searchQuery}
                category={selectedCategory}
                sortBy={sortBy}
                status="active"
                isUserBots={true}
              />
            </TabsContent>
            
            <TabsContent value="paused" className="mt-6">
              <BotGrid 
                searchQuery={searchQuery}
                category={selectedCategory}
                sortBy={sortBy}
                status="paused"
                isUserBots={true}
              />
            </TabsContent>
            
            <TabsContent value="archived" className="mt-6">
              <BotGrid 
                searchQuery={searchQuery}
                category={selectedCategory}
                sortBy={sortBy}
                status="archived"
                isUserBots={true}
              />
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  )
} 