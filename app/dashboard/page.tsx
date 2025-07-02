"use client"

import { useState, useEffect } from "react"
import { useAuth } from "@/contexts/AuthContext"
import { usePokedex } from "@/contexts/PokedexContext"
import { StatsChart } from "@/components/StatsChart"
import { GenerationStats } from "@/components/GenerationStats"
import { AdvancedStats } from "@/components/AdvancedStats"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { FeaturedPokemonManager } from "@/components/FeaturedPokemonManager"
import { UserProfile } from "@/components/UserProfile"
import { Logo } from "@/components/Logo"
import {
  Trophy,
  Sparkles,
  Star,
  Target,
  Calendar,
  Book,
  BarChart3,
  TrendingUp,
  Award,
  Zap,
  LogOut,
  Lightbulb,
  Flame,
  ShieldCheck,
  Activity,
} from "lucide-react"
import { pokemonData } from "@/data/pokemon"
import Link from "next/link"
// getUpdatedEvents não é mais necessário aqui, será usado em EventsView
// import { getUpdatedEvents } from "@/services/eventApi"
// import type { LiveEvent } from "@/types/events"
import { useRouter } from "next/navigation"
import Image from "next/image"
import { LegalFooter } from "@/components/LegalFooter"
import PokedexView from "@/components/PokedexView"
import { EventsView } from "@/components/EventsView"
import { AchievementsView } from "@/components/AchievementsView"

export default function DashboardPage() {
  const { user, logout, loading, isDemoMode } = useAuth()
  const { getStats, pokemonStatus } = usePokedex()
  const router = useRouter()
  const [featuredPokemon, setFeaturedPokemon] = useState<number[]>([1, 25, 150, 6, 9, 144])
  // events e isLoadingEvents não são mais gerenciados aqui
  // const [events, setEvents] = useState<LiveEvent[]>([])
  // const [isLoadingEvents, setIsLoadingEvents] = useState(true)
  const [activeTab, setActiveTab] = useState("overview")
  const [animateTabsContainer, setAnimateTabsContainer] = useState(false)

  useEffect(() => {
    if (!loading && !user) {
      router.push("/")
    }
  }, [user, loading, router])

  useEffect(() => {
    // Restaurar aba ativa do localStorage ao carregar
    const savedTab = localStorage.getItem("dashboard-active-tab")
    if (savedTab && ["overview", "pokedex", "events", "stats", "achievements"].includes(savedTab)) {
      setActiveTab(savedTab)
    }
    
    // Animação mais suave e gradual
    const timer = setTimeout(() => {
      setAnimateTabsContainer(true)
    }, 150)
    return () => clearTimeout(timer)
  }, [])

  // loadEvents foi removido

  const stats = getStats()
  const totalPokemon = pokemonData?.length || 0
  const capturedCount = stats.totalCaught
  const shinyCount = stats.totalShiny
  const luckyCount = stats.totalLucky
  const completionPercentage = stats.completionPercentage

  const featuredPokemonData = featuredPokemon.map((id) => pokemonData?.find((p) => p.id === id)).filter(Boolean)

  const pokemonOfTheDay = pokemonData[Math.floor(Date.now() / (1000 * 60 * 60 * 24)) % pokemonData.length]

  const currentStreak = Math.floor(Math.random() * 15) + 1
  const recordStreak = Math.max(currentStreak, Math.floor(Math.random() * 30) + 5)

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-50 to-slate-100">
        <div className="text-center space-y-4">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-slate-800 mx-auto"></div>
          <p className="text-slate-600 font-medium">A carregar...</p>
        </div>
      </div>
    )
  }

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-50 to-slate-100">
        <div className="text-center space-y-4 bg-white p-8 rounded-2xl shadow-xl border border-slate-200">
          <h2 className="text-2xl font-bold text-slate-800">Acesso Restrito</h2>
          <p className="text-slate-600">Faça login para aceder ao dashboard</p>
          <Link href="/">
            <Button className="bg-slate-800 hover:bg-slate-700">Voltar ao Início</Button>
          </Link>
        </div>
      </div>
    )
  }

  const handleLogout = async () => {
    try {
      await logout()
      router.push("/")
    } catch (error) {
      console.error("Erro ao fazer logout:", error)
    }
  }

  const handleTabNavigation = (value: string) => {
    setActiveTab(value)
    // Salvar aba ativa no localStorage para manter após refresh
    localStorage.setItem("dashboard-active-tab", value)
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100">
      <header className="bg-white/90 backdrop-blur-sm border-b border-slate-200 sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <Logo size="md" />
            <div className="flex items-center gap-4">
              <div className="text-right">
                <span className="text-sm text-slate-600">Bem-vindo, {user?.displayName || "Demo Trainer"}!</span>
                {isDemoMode && (
                  <Badge
                    variant="secondary"
                    className="text-xs ml-2 bg-gradient-to-r from-yellow-400 to-orange-500 text-white"
                  >
                    Demo
                  </Badge>
                )}
              </div>
              <div className="flex items-center gap-2">
                <UserProfile />
                <Button variant="ghost" size="sm" onClick={handleLogout} className="hover:bg-red-50 hover:text-red-600">
                  <LogOut className="w-4 h-4" />
                  Sair
                </Button>
              </div>
            </div>
          </div>
        </div>
      </header>

      <div className="bg-slate-600 dark:bg-slate-900">
        {/* Navigation Tabs */}
        <div
          className={`bg-slate-600/95 dark:bg-slate-900/95 backdrop-blur-md border-b border-slate-400/30 shadow-lg sticky top-[73px] z-40 
                    transition-all duration-700 ease-[cubic-bezier(0.4,0,0.2,1)] ${
                      animateTabsContainer ? "opacity-100 translate-y-0" : "opacity-0 -translate-y-8"
                    }`}
        >
          <div className="container mx-auto px-4 py-2">
            <Tabs value={activeTab} onValueChange={handleTabNavigation} className="w-full">
              <TabsList className="bg-white/90 backdrop-blur-sm border-0 rounded-2xl shadow-lg p-1 justify-between w-full grid grid-cols-5 h-auto gap-0 relative">
                <TabsTrigger
                  value="overview"
                  className="data-[state=active]:bg-white data-[state=active]:shadow-xl data-[state=active]:text-slate-800 data-[state=active]:scale-[1.02] data-[state=active]:z-10 data-[state=inactive]:bg-transparent data-[state=inactive]:text-slate-600 data-[state=inactive]:hover:text-slate-700 data-[state=inactive]:hover:scale-[1.01] data-[state=inactive]:hover:bg-white/30 rounded-xl px-3 py-2.5 text-sm font-medium transition-all duration-500 ease-[cubic-bezier(0.34,1.56,0.64,1)] flex-1 text-center relative overflow-hidden"
                >
                  <BarChart3 className="h-4 w-4 mr-1.5 inline-block transition-all duration-300" />
                  <span className="relative z-10">Dashboard</span>
                </TabsTrigger>
                <TabsTrigger
                  value="pokedex"
                  className="data-[state=active]:bg-white data-[state=active]:shadow-xl data-[state=active]:text-slate-800 data-[state=active]:scale-[1.02] data-[state=active]:z-10 data-[state=inactive]:bg-transparent data-[state=inactive]:text-slate-600 data-[state=inactive]:hover:text-slate-700 data-[state=inactive]:hover:scale-[1.01] data-[state=inactive]:hover:bg-white/30 rounded-xl px-3 py-2.5 text-sm font-medium transition-all duration-500 ease-[cubic-bezier(0.34,1.56,0.64,1)] flex-1 text-center relative overflow-hidden"
                >
                  <Book className="h-4 w-4 mr-1.5 inline-block transition-all duration-300" />
                  <span className="relative z-10">Pokédx</span>
                </TabsTrigger>
                <TabsTrigger
                  value="events"
                  className="data-[state=active]:bg-white data-[state=active]:shadow-xl data-[state=active]:text-slate-800 data-[state=active]:scale-[1.02] data-[state=active]:z-10 data-[state=inactive]:bg-transparent data-[state=inactive]:text-slate-600 data-[state=inactive]:hover:text-slate-700 data-[state=inactive]:hover:scale-[1.01] data-[state=inactive]:hover:bg-white/30 rounded-xl px-3 py-2.5 text-sm font-medium transition-all duration-500 ease-[cubic-bezier(0.34,1.56,0.64,1)] flex-1 text-center relative overflow-hidden"
                >
                  <Calendar className="h-4 w-4 mr-1.5 inline-block transition-all duration-300" />
                  <span className="relative z-10">Eventos</span>
                </TabsTrigger>
                <TabsTrigger
                  value="stats"
                  className="data-[state=active]:bg-white data-[state=active]:shadow-xl data-[state=active]:text-slate-800 data-[state=active]:scale-[1.02] data-[state=active]:z-10 data-[state=inactive]:bg-transparent data-[state=inactive]:text-slate-600 data-[state=inactive]:hover:text-slate-700 data-[state=inactive]:hover:scale-[1.01] data-[state=inactive]:hover:bg-white/30 rounded-xl px-3 py-2.5 text-sm font-medium transition-all duration-500 ease-[cubic-bezier(0.34,1.56,0.64,1)] flex-1 text-center relative overflow-hidden"
                >
                  <TrendingUp className="h-4 w-4 mr-1.5 inline-block transition-all duration-300" />
                  <span className="relative z-10">Estatísticas</span>
                </TabsTrigger>
                <TabsTrigger
                  value="achievements"
                  className="data-[state=active]:bg-white data-[state=active]:shadow-xl data-[state=active]:text-slate-800 data-[state=active]:scale-[1.02] data-[state=active]:z-10 data-[state=inactive]:bg-transparent data-[state=inactive]:text-slate-600 data-[state=inactive]:hover:text-slate-700 data-[state=inactive]:hover:scale-[1.01] data-[state=inactive]:hover:bg-white/30 rounded-xl px-3 py-2.5 text-sm font-medium transition-all duration-500 ease-[cubic-bezier(0.34,1.56,0.64,1)] flex-1 text-center relative overflow-hidden"
                >
                  <Activity className="h-4 w-4 mr-1.5 inline-block transition-all duration-300" />
                  <span className="relative z-10">Conquistas</span>
                </TabsTrigger>
              </TabsList>
            </Tabs>
          </div>
        </div>

        {/* Content Area */}
        <div className="container mx-auto px-4">
          <Tabs value={activeTab} onValueChange={handleTabNavigation} className="w-full">
            <TabsContent value="overview" className="pt-2">
            {/* Conteúdo do Overview ... (igual ao anterior) */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
              <Card className="hover:shadow-lg transition-all duration-300 hover:-translate-y-1 bg-white border-slate-200">
                <CardContent className="p-3">
                  <div className="flex items-center gap-4">
                    <div className="h-10 w-10 bg-green-100 rounded-full flex items-center justify-center flex-shrink-0">
                      <Trophy className="h-5 w-5 text-green-600" />
                    </div>
                    <div>
                      <p className="text-xs font-medium text-slate-600">Capturados</p>
                      <p className="text-xl font-bold text-slate-800">{capturedCount}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
              <Card className="hover:shadow-lg transition-all duration-300 hover:-translate-y-1 bg-white border-slate-200">
                <CardContent className="p-3">
                  <div className="flex items-center gap-4">
                    <div className="h-10 w-10 bg-yellow-100 rounded-full flex items-center justify-center flex-shrink-0">
                      <Sparkles className="h-5 w-5 text-yellow-600" />
                    </div>
                    <div>
                      <p className="text-xs font-medium text-slate-600">Shinys</p>
                      <p className="text-xl font-bold text-slate-800">{shinyCount}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
              <Card className="hover:shadow-lg transition-all duration-300 hover:-translate-y-1 bg-white border-slate-200">
                <CardContent className="p-3">
                  <div className="flex items-center gap-4">
                    <div className="h-10 w-10 bg-orange-100 rounded-full flex items-center justify-center flex-shrink-0">
                      <Star className="h-5 w-5 text-orange-600" />
                    </div>
                    <div>
                      <p className="text-xs font-medium text-slate-600">Lucky</p>
                      <p className="text-xl font-bold text-slate-800">{luckyCount}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
              <Card className="hover:shadow-lg transition-all duration-300 hover:-translate-y-1 bg-white border-slate-200">
                <CardContent className="p-3">
                  <div className="flex items-center gap-4">
                    <div className="h-10 w-10 bg-purple-100 rounded-full flex items-center justify-center flex-shrink-0">
                      <Target className="h-5 w-5 text-purple-600" />
                    </div>
                    <div>
                      <p className="text-xs font-medium text-slate-600">Completo</p>
                      <p className="text-xl font-bold text-slate-800">{completionPercentage}%</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6 items-center">
              <div className="md:col-span-1 flex items-center justify-center p-0">
                <Image
                  src={pokemonOfTheDay?.imageUrl || "/placeholder.svg"}
                  alt={pokemonOfTheDay?.name || "Pokémon"}
                  width={100}
                  height={100}
                  className="animate-bounce"
                  style={{ animationDuration: "3s" }}
                  crossOrigin="anonymous"
                />
              </div>
              <div className="md:col-span-3 grid grid-cols-1 sm:grid-cols-2 gap-4">
                <Card className="bg-white border-slate-200 hover:shadow-lg transition-all duration-300 h-full">
                  <CardContent className="p-4 flex flex-col justify-center">
                    <div className="flex items-center gap-3">
                      <div className="h-12 w-12 bg-slate-100 rounded-full flex items-center justify-center flex-shrink-0">
                        <Lightbulb className="h-6 w-6 text-slate-500" />
                      </div>
                      <div className="flex-1">
                        <h3 className="text-sm font-medium text-slate-800 mb-1">Dica do Treinador</h3>
                        <p className="text-xs text-slate-600 leading-relaxed">
                          💡 Use Pinap Berries em Pokémon que ainda não capturou para ganhar o dobro de doces!
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
                <Card className="bg-white border-slate-200 hover:shadow-lg transition-all duration-300 h-full">
                  <CardContent className="p-4 flex flex-col justify-center">
                    <div className="flex items-center gap-3">
                      <div className="h-12 w-12 bg-slate-100 rounded-full flex items-center justify-center flex-shrink-0">
                        <Flame className="h-6 w-6 text-slate-500" />
                      </div>
                      <div className="flex-1">
                        <h3 className="text-sm font-medium text-slate-800 mb-1">Streak Diário</h3>
                        <div className="flex items-baseline gap-4">
                          <div className="flex items-baseline gap-1.5">
                            <Flame className="h-5 w-5 text-orange-500 animate-pulse" />
                            <span className="text-2xl font-bold text-slate-800">{currentStreak}</span>
                            <span className="text-xs text-slate-600">dias</span>
                          </div>
                          <div className="flex items-baseline gap-1.5 text-slate-500">
                            <ShieldCheck className="h-4 w-4" />
                            <span className="text-sm font-medium">{recordStreak}</span>
                            <span className="text-xs">recorde</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>

            <Card className="mb-6 bg-white border-slate-200">
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <CardTitle className="flex items-center gap-2 text-slate-800">
                    <div className="h-6 w-6 bg-yellow-100 rounded-full flex items-center justify-center">
                      <Zap className="h-4 w-4 text-yellow-600" />
                    </div>
                    Pokémon em Destaque
                  </CardTitle>
                  <FeaturedPokemonManager featuredIds={featuredPokemon} onFeaturedChange={setFeaturedPokemon} />
                </div>
              </CardHeader>
              <CardContent className="pt-0">
                <div className="grid grid-cols-3 md:grid-cols-6 gap-3">
                  {featuredPokemonData.map((pokemon) => {
                    if (!pokemon) return null
                    const isCaught = pokemonStatus[pokemon.id]?.caught || false

                    return (
                      <Link key={pokemon.id} href="/pokedex">
                        <div className="text-center p-3 rounded-lg hover:bg-slate-50 transition-all duration-200 cursor-pointer group hover:scale-105">
                          <div className="relative">
                            <Image
                              src={pokemon.imageUrl || "/placeholder.svg"}
                              alt={pokemon.name}
                              width={50}
                              height={50}
                              className="mx-auto mb-2 group-hover:scale-110 transition-transform"
                              crossOrigin="anonymous"
                            />
                            {isCaught && (
                              <div className="absolute -top-1 -right-1 w-5 h-5 bg-green-100 rounded-full flex items-center justify-center border-2 border-white">
                                <Trophy className="w-2.5 h-2.5 text-green-600" />
                              </div>
                            )}
                          </div>
                          <p className="text-xs font-medium text-slate-800">
                            #{pokemon.id.toString().padStart(3, "0")}
                          </p>
                          <p className="text-xs text-slate-600 truncate">{pokemon.name}</p>
                        </div>
                      </Link>
                    )
                  })}
                </div>
              </CardContent>
            </Card>

            <div className="mb-6">
              <StatsChart />
            </div>

            <div className="mb-6">
              <GenerationStats />
            </div>
          </TabsContent>

          <TabsContent value="pokedex" className="pt-2">
            <PokedexView />
          </TabsContent>

          <TabsContent value="events" className="pt-2">
            <EventsView />
          </TabsContent>

          <TabsContent value="stats" className="pt-2">
            <div className="py-2">
              <h2 className="text-3xl font-bold mb-6 text-white">Estatísticas Detalhadas</h2>
              
              {/* Stats Overview Cards */}
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
                <Card className="bg-white/95 dark:bg-slate-800/95 backdrop-blur-sm border border-slate-200 dark:border-slate-700">
                  <CardContent className="p-4">
                    <div className="flex items-center gap-3">
                      <div className="p-2 bg-green-100 dark:bg-green-900/20 rounded-lg">
                        <Trophy className="w-5 h-5 text-green-600" />
                      </div>
                      <div>
                        <p className="text-sm text-slate-600 dark:text-slate-400">Total Capturados</p>
                        <p className="text-2xl font-bold text-slate-800 dark:text-white">{capturedCount}</p>
                        <p className="text-xs text-slate-500">de {totalPokemon}</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
                
                <Card className="bg-white/95 dark:bg-slate-800/95 backdrop-blur-sm border border-slate-200 dark:border-slate-700">
                  <CardContent className="p-4">
                    <div className="flex items-center gap-3">
                      <div className="p-2 bg-yellow-100 dark:bg-yellow-900/20 rounded-lg">
                        <Sparkles className="w-5 h-5 text-yellow-600" />
                      </div>
                      <div>
                        <p className="text-sm text-slate-600 dark:text-slate-400">Pokémons Shiny</p>
                        <p className="text-2xl font-bold text-slate-800 dark:text-white">{shinyCount}</p>
                        <p className="text-xs text-slate-500">{capturedCount > 0 ? ((shinyCount/capturedCount)*100).toFixed(1) : 0}% do total</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
                
                <Card className="bg-white/95 dark:bg-slate-800/95 backdrop-blur-sm border border-slate-200 dark:border-slate-700">
                  <CardContent className="p-4">
                    <div className="flex items-center gap-3">
                      <div className="p-2 bg-orange-100 dark:bg-orange-900/20 rounded-lg">
                        <Star className="w-5 h-5 text-orange-600" />
                      </div>
                      <div>
                        <p className="text-sm text-slate-600 dark:text-slate-400">Pokémons Lucky</p>
                        <p className="text-2xl font-bold text-slate-800 dark:text-white">{luckyCount}</p>
                        <p className="text-xs text-slate-500">{capturedCount > 0 ? ((luckyCount/capturedCount)*100).toFixed(1) : 0}% do total</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
                
                <Card className="bg-white/95 dark:bg-slate-800/95 backdrop-blur-sm border border-slate-200 dark:border-slate-700">
                  <CardContent className="p-4">
                    <div className="flex items-center gap-3">
                      <div className="p-2 bg-blue-100 dark:bg-blue-900/20 rounded-lg">
                        <Target className="w-5 h-5 text-blue-600" />
                      </div>
                      <div>
                        <p className="text-sm text-slate-600 dark:text-slate-400">Completude</p>
                        <p className="text-2xl font-bold text-slate-800 dark:text-white">{completionPercentage}%</p>
                        <p className="text-xs text-slate-500">da Pokédex</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* Enhanced Statistics Section */}
              <AdvancedStats />
              
              {/* Original Charts */}
              <div className="mt-8">
                <StatsChart />
              </div>
              
              {/* Generation Progress Section */}
              <div className="mt-8">
                <GenerationStats />
              </div>
            </div>
          </TabsContent>
          <TabsContent value="achievements" className="pt-2">
            <AchievementsView />
          </TabsContent>
        </Tabs>
        </div>
        <LegalFooter />
      </div>
    </div>
  )
}
