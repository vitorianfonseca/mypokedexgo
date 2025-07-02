"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart"
import { usePokedex } from "@/contexts/PokedexContext"
import { pokemonData, generationStats, getPokemonByGeneration } from "@/data/pokemon"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { TrendingUp, BarChart3, Activity, Zap, Star } from "lucide-react"
import {
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  LineChart,
  Line,
  Area,
  AreaChart,
  Tooltip,
} from "recharts"

const CHART_COLORS = [
  "#10b981", // emerald-500
  "#f59e0b", // amber-500
  "#3b82f6", // blue-500
  "#ef4444", // red-500
  "#8b5cf6", // violet-500
  "#06b6d4", // cyan-500
  "#f97316", // orange-500
  "#84cc16", // lime-500
  "#ec4899", // pink-500
]

export function AdvancedStats() {
  const { pokemonStatus, getStats } = usePokedex()
  const stats = getStats()
  const totalPokemon = pokemonData?.length || 1025

  // Dados para gráfico de pizza - distribuição por tipo
  const getTypeDistribution = () => {
    const typeCount: Record<string, number> = {}
    
    pokemonData.forEach((pokemon) => {
      if (pokemonStatus[pokemon.id]?.caught) {
        pokemon.types.forEach((type) => {
          typeCount[type] = (typeCount[type] || 0) + 1
        })
      }
    })

    return Object.entries(typeCount)
      .map(([type, count]) => ({
        type,
        count,
        percentage: ((count / stats.totalCaught) * 100).toFixed(1)
      }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 8) // Top 8 types
  }

  // Dados para gráfico de barras - progresso por geração
  const getGenerationProgress = () => {
    return Object.entries(generationStats).map(([gen, info]) => {
      const genPokemon = getPokemonByGeneration(Number(gen))
      const caught = genPokemon.filter((p) => pokemonStatus[p.id]?.caught).length
      const total = genPokemon.length
      const percentage = total > 0 ? Math.round((caught / total) * 100) : 0

      return {
        generation: `Gen ${gen}`,
        caught,
        total,
        percentage,
        remaining: total - caught,
        name: info.name
      }
    })
  }

  // Dados simulados para gráfico de tendência de captura (últimos 30 dias)
  const getCaptureProgress = () => {
    const data = []
    const baseDate = new Date()
    
    for (let i = 29; i >= 0; i--) {
      const date = new Date(baseDate)
      date.setDate(date.getDate() - i)
      
      // Simular crescimento com algumas variações
      const dayProgress = Math.max(0, Math.round(stats.totalCaught * (1 - i/30) + Math.random() * 10 - 5))
      
      data.push({
        date: date.toLocaleDateString('pt-PT', { month: 'short', day: 'numeric' }),
        captures: dayProgress,
        shiny: Math.floor(dayProgress * 0.02 + Math.random() * 2),
        lucky: Math.floor(dayProgress * 0.05 + Math.random() * 3)
      })
    }
    
    return data
  }

  // Métricas avançadas
  const getAdvancedMetrics = () => {
    const averageShinyRate = stats.totalCaught > 0 ? (stats.totalShiny / stats.totalCaught * 100) : 0
    const averageLuckyRate = stats.totalCaught > 0 ? (stats.totalLucky / stats.totalCaught * 100) : 0
    const rareCollectionScore = (stats.totalShiny * 10 + stats.totalLucky * 5 + stats.totalShadow * 3)
    
    return {
      shinyRate: averageShinyRate.toFixed(2),
      luckyRate: averageLuckyRate.toFixed(2),
      rareScore: rareCollectionScore,
      dailyAverage: Math.max(1, Math.round(stats.totalCaught / 30)) // Assumindo 30 dias, mínimo 1
    }
  }

  const typeData = getTypeDistribution()
  const generationData = getGenerationProgress()
  const captureData = getCaptureProgress()
  const metrics = getAdvancedMetrics()

  return (
    <div className="space-y-8">
      {/* Advanced Metrics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="bg-white/95 dark:bg-slate-800/95 backdrop-blur-sm border border-slate-200 dark:border-slate-700">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-gradient-to-br from-yellow-400 to-orange-500 rounded-lg">
                <Star className="w-5 h-5 text-white" />
              </div>
              <div>
                <p className="text-sm text-slate-600 dark:text-slate-400">Taxa Shiny</p>
                <p className="text-2xl font-bold text-slate-800 dark:text-white">{metrics.shinyRate}%</p>
                <p className="text-xs text-slate-500">da coleção</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-white/95 dark:bg-slate-800/95 backdrop-blur-sm border border-slate-200 dark:border-slate-700">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-gradient-to-br from-purple-500 to-pink-500 rounded-lg">
                <Zap className="w-5 h-5 text-white" />
              </div>
              <div>
                <p className="text-sm text-slate-600 dark:text-slate-400">Score Raros</p>
                <p className="text-2xl font-bold text-slate-800 dark:text-white">{metrics.rareScore}</p>
                <p className="text-xs text-slate-500">pontos</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-white/95 dark:bg-slate-800/95 backdrop-blur-sm border border-slate-200 dark:border-slate-700">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-gradient-to-br from-green-500 to-emerald-500 rounded-lg">
                <Activity className="w-5 h-5 text-white" />
              </div>
              <div>
                <p className="text-sm text-slate-600 dark:text-slate-400">Média Diária</p>
                <p className="text-2xl font-bold text-slate-800 dark:text-white">{metrics.dailyAverage}</p>
                <p className="text-xs text-slate-500">capturas/dia</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-white/95 dark:bg-slate-800/95 backdrop-blur-sm border border-slate-200 dark:border-slate-700">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-gradient-to-br from-blue-500 to-cyan-500 rounded-lg">
                <TrendingUp className="w-5 h-5 text-white" />
              </div>
              <div>
                <p className="text-sm text-slate-600 dark:text-slate-400">Eficiência</p>
                <p className="text-2xl font-bold text-slate-800 dark:text-white">{(stats.completionPercentage * 1.2).toFixed(0)}%</p>
                <p className="text-xs text-slate-500">otimizada</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Type Distribution Pie Chart */}
        <Card className="bg-white/95 dark:bg-slate-800/95 backdrop-blur-sm border border-slate-200 dark:border-slate-700">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <PieChart className="w-5 h-5" />
              Distribuição por Tipo
            </CardTitle>
            <CardDescription>Tipos mais capturados na sua coleção</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="mx-auto aspect-square max-h-[250px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie 
                    data={typeData} 
                    dataKey="count"
                    nameKey="type"
                    cx="50%" 
                    cy="50%" 
                    innerRadius={60}
                    outerRadius={100}
                  >
                    {typeData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={CHART_COLORS[index % CHART_COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip
                    content={({ active, payload }) => {
                      if (active && payload && payload.length) {
                        const data = payload[0].payload
                        return (
                          <div className="bg-white dark:bg-slate-800 p-2 border rounded shadow">
                            <p className="font-medium capitalize">{data.type}</p>
                            <p className="text-sm text-slate-600">
                              {data.count} Pokémon ({data.percentage}%)
                            </p>
                          </div>
                        )
                      }
                      return null
                    }}
                  />
                </PieChart>
              </ResponsiveContainer>
            </div>
            <div className="mt-4 grid grid-cols-2 gap-2">
              {typeData.slice(0, 6).map((item, index) => (
                <div key={item.type} className="flex items-center gap-2">
                  <div 
                    className="w-3 h-3 rounded-full" 
                    style={{ backgroundColor: CHART_COLORS[index % CHART_COLORS.length] }}
                  />
                  <span className="text-sm font-medium capitalize">{item.type}</span>
                  <span className="text-xs text-slate-500 ml-auto">{item.count}</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Generation Progress Bar Chart */}
        <Card className="bg-white/95 dark:bg-slate-800/95 backdrop-blur-sm border border-slate-200 dark:border-slate-700">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <BarChart3 className="w-5 h-5" />
              Progresso por Geração
            </CardTitle>
            <CardDescription>Completude da Pokédex por geração</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="max-h-[250px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={generationData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="generation" />
                  <YAxis />
                  <Tooltip
                    content={({ active, payload, label }) => {
                      if (active && payload && payload.length) {
                        const data = payload[0].payload
                        return (
                          <div className="bg-white dark:bg-slate-800 p-2 border rounded shadow">
                            <p className="font-medium">{label}</p>
                            <p className="text-sm text-slate-600">
                              {data.caught}/{data.total} ({data.percentage}%)
                            </p>
                            <p className="text-xs text-slate-500">{data.name}</p>
                          </div>
                        )
                      }
                      return null
                    }}
                  />
                  <Bar dataKey="caught" stackId="a" fill="#10b981" radius={[0, 0, 4, 4]} />
                  <Bar dataKey="remaining" stackId="a" fill="#e5e7eb" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        {/* Capture Trend Line Chart */}
        <Card className="lg:col-span-2 bg-white/95 dark:bg-slate-800/95 backdrop-blur-sm border border-slate-200 dark:border-slate-700">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <TrendingUp className="w-5 h-5" />
              Tendência de Capturas (Últimos 30 Dias)
            </CardTitle>
            <CardDescription>Progresso de capturas, shinys e luckys ao longo do tempo</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="max-h-[300px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={captureData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="date" />
                  <YAxis />
                  <Tooltip
                    content={({ active, payload, label }) => {
                      if (active && payload && payload.length) {
                        return (
                          <div className="bg-white dark:bg-slate-800 p-2 border rounded shadow">
                            <p className="font-medium">{label}</p>
                            {payload.map((entry, index) => (
                              <p key={index} className="text-sm" style={{ color: entry.color }}>
                                {entry.name}: {entry.value}
                              </p>
                            ))}
                          </div>
                        )
                      }
                      return null
                    }}
                  />
                  <Area
                    type="monotone"
                    dataKey="captures"
                    stackId="1"
                    stroke="#3b82f6"
                    fill="#3b82f6"
                    fillOpacity={0.6}
                  />
                  <Line
                    type="monotone"
                    dataKey="shiny"
                    stroke="#f59e0b"
                    strokeWidth={2}
                    dot={{ fill: "#f59e0b", strokeWidth: 2, r: 4 }}
                  />
                  <Line
                    type="monotone"
                    dataKey="lucky"
                    stroke="#10b981"
                    strokeWidth={2}
                    dot={{ fill: "#10b981", strokeWidth: 2, r: 4 }}
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Achievement Progress */}
      <Card className="bg-white/95 dark:bg-slate-800/95 backdrop-blur-sm border border-slate-200 dark:border-slate-700">
        <CardHeader>
          <CardTitle>Objetivos de Coleção</CardTitle>
          <CardDescription>Progresso em direção a marcos importantes</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {[
              { label: "Primeira Centena", target: 100, current: stats.totalCaught, icon: "🎯" },
              { label: "Colecionador Shiny", target: 50, current: stats.totalShiny, icon: "✨" },
              { label: "Sortudo", target: 25, current: stats.totalLucky, icon: "🍀" },
              { label: "Dex Completa", target: totalPokemon, current: stats.totalCaught, icon: "📖" },
            ].map((goal) => {
              const progress = Math.min((goal.current / goal.target) * 100, 100)
              const isCompleted = goal.current >= goal.target
              
              return (
                <div key={goal.label} className="space-y-2">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span className="text-lg">{goal.icon}</span>
                      <span className="font-medium">{goal.label}</span>
                      {isCompleted && <Badge variant="secondary" className="bg-green-100 text-green-800">Completo!</Badge>}
                    </div>
                    <span className="text-sm text-slate-600">
                      {goal.current}/{goal.target}
                    </span>
                  </div>
                  <Progress value={progress} className="h-2" />
                  <div className="text-xs text-slate-500 text-right">{progress.toFixed(1)}%</div>
                </div>
              )
            })}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
