"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Bot, Zap, TrendingUp, BarChart, ArrowLeftRight, DollarSign, MessageSquare } from "lucide-react"

// Create simple versions of the missing UI components
const RadioGroup = ({ value, onValueChange, className, children }: { 
  value: string, 
  onValueChange: (value: string) => void, 
  className?: string,
  children: React.ReactNode 
}) => (
  <div className={className}>
    {children}
  </div>
)

const RadioGroupItem = ({ value, id }: { value: string, id: string }) => (
  <input 
    type="radio" 
    id={id} 
    name="category" 
    value={value} 
    className="h-4 w-4 rounded-full border-gray-300 text-primary focus:ring-primary"
  />
)

const Label = ({ htmlFor, className, children }: { 
  htmlFor: string, 
  className?: string,
  children: React.ReactNode 
}) => (
  <label htmlFor={htmlFor} className={className}>
    {children}
  </label>
)

const Separator = ({ className }: { className?: string }) => (
  <div className={`h-px bg-border ${className}`} />
)

interface BotFiltersProps {
  selectedCategory: string
  onCategoryChange: (category: string) => void
}

export function BotFilters({ selectedCategory, onCategoryChange }: BotFiltersProps) {
  const categories = [
    { id: "all", name: "All Categories", icon: Bot },
    { id: "sniper", name: "Token Snipers", icon: Zap },
    { id: "trend", name: "Trend Following", icon: TrendingUp },
    { id: "arbitrage", name: "Arbitrage", icon: ArrowLeftRight },
    { id: "grid", name: "Grid Trading", icon: BarChart },
    { id: "dca", name: "Dollar Cost Averaging", icon: DollarSign },
    { id: "sentiment", name: "Sentiment Analysis", icon: MessageSquare },
    { id: "momentum", name: "Momentum", icon: Zap },
  ]

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="text-lg">Categories</CardTitle>
      </CardHeader>
      <CardContent>
        <RadioGroup 
          value={selectedCategory} 
          onValueChange={onCategoryChange}
          className="space-y-3"
        >
          {categories.map((category) => {
            const Icon = category.icon
            return (
              <div key={category.id} className="flex items-center space-x-2">
                <RadioGroupItem value={category.id} id={category.id} />
                <Label 
                  htmlFor={category.id} 
                  className="flex items-center gap-2 cursor-pointer"
                >
                  <Icon className="h-4 w-4" />
                  <span>{category.name}</span>
                </Label>
              </div>
            )
          })}
        </RadioGroup>
        
        <Separator className="my-4" />
        
        <div className="space-y-2">
          <h3 className="font-medium text-sm">Price Range</h3>
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="free" id="free" />
            <Label htmlFor="free" className="cursor-pointer">Free</Label>
          </div>
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="paid" id="paid" />
            <Label htmlFor="paid" className="cursor-pointer">Paid</Label>
          </div>
        </div>
        
        <Separator className="my-4" />
        
        <div className="space-y-2">
          <h3 className="font-medium text-sm">Performance</h3>
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="high" id="high" />
            <Label htmlFor="high" className="cursor-pointer">High ({'>'}10%)</Label>
          </div>
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="medium" id="medium" />
            <Label htmlFor="medium" className="cursor-pointer">Medium (5-10%)</Label>
          </div>
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="low" id="low" />
            <Label htmlFor="low" className="cursor-pointer">Low ({'<'}5%)</Label>
          </div>
        </div>
      </CardContent>
    </Card>
  )
} 