"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { usePokedex } from "@/contexts/PokedexContext"
import { Trophy, Star, Sparkles, Moon, Sun } from "lucide-react"

export function StatsChart() {
  const { getStats } = usePokedex()
  const stats = getStats()

  const statItems = [
    {
      label: "Pokémons Apanhados",
      value: stats.totalCaught,
      icon: Trophy,
      color: "text-green-600",
      bgColor: "bg-green-100 dark:bg-green-900",
    },
    {
      label: "Pokémons Shiny",
      value: stats.totalShiny,
      icon: Sparkles,
      color: "text-yellow-600",
      bgColor: "bg-yellow-100 dark:bg-yellow-900",
    },
    {
      label: "Pokémons Lucky",
      value: stats.totalLucky,
      icon: Star,
      color: "text-orange-600",
      bgColor: "bg-orange-100 dark:bg-orange-900",
    },
    {
      label: "Pokémons Shadow",
      value: stats.totalShadow,
      icon: Moon,
      color: "text-purple-600",
      bgColor: "bg-purple-100 dark:bg-purple-900",
    },
    {
      label: "Pokémons Purificados",
      value: stats.totalPurified,
      icon: Sun,
      color: "text-blue-600",
      bgColor: "bg-blue-100 dark:bg-blue-900",
    },
  ]

  return (
    <div className="space-y-6">
      {/* Overall Progress */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Trophy className="w-5 h-5" />
            Progresso Geral
          </CardTitle>
          <CardDescription>{stats.totalCaught} de 1025 Pokémons apanhados</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span>Completado</span>
              <span>{stats.completionPercentage}%</span>
            </div>
            <Progress value={stats.completionPercentage} className="h-3" />
          </div>
        </CardContent>
      </Card>

      {/* Detailed Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {statItems.map((item) => {
          const Icon = item.icon
          return (
            <Card key={item.label}>
              <CardContent className="p-6">
                <div className="flex items-center space-x-4">
                  <div className={`p-3 rounded-full ${item.bgColor}`}>
                    <Icon className={`w-6 h-6 ${item.color}`} />
                  </div>
                  <div>
                    <p className="text-2xl font-bold">{item.value}</p>
                    <p className="text-sm text-muted-foreground">{item.label}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          )
        })}
      </div>
    </div>
  )
}
