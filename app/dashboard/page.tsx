"use client"

import { useState, useEffect } from "react"
import { useAuth } from "@/contexts/AuthContext"
import { usePokedex } from "@/contexts/PokedexContext"
import { StatsChart } from "@/components/StatsChart"
import { GenerationStats } from "@/components/GenerationStats"
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
import { EventsView } from "@/components/EventsView" // Nova importação
import { AchievementsView } from "@/components/AchievementsView" // Nova importação

export default function DashboardPage() {
  const { user, logout, loading, isDemoMode } = useAuth()
  const { capturedPokemon, shinyCaptured, luckyCaptured, getStats } = usePokedex()
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
    // loadEvents não é mais chamado aqui
    const timer = setTimeout(() => {
      setAnimateTabsContainer(true)
    }, 100)
    return () => clearTimeout(timer)
  }, [])

  // loadEvents foi removido

  const stats = getStats()
  const totalPokemon = pokemonData?.length || 0
  const capturedCount = capturedPokemon?.length || 0
  const shinyCount = shinyCaptured?.length || 0
  const luckyCount = luckyCaptured?.length || 0
  const completionPercentage = totalPokemon > 0 ? Math.round((capturedCount / totalPokemon) * 100) : 0

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
    // Nenhuma navegação por router.push aqui, apenas muda a aba ativa
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

      <div
        className={`bg-white/80 backdrop-blur-sm border-b border-slate-300 shadow-sm sticky top-[73px] z-40 
                  transition-all duration-500 ease-out ${
                    animateTabsContainer ? "opacity-100 translate-y-0" : "opacity-0 -translate-y-full"
                  }`}
      >
        <div className="container mx-auto px-4">
          <Tabs value={activeTab} onValueChange={handleTabNavigation} className="w-full">
            <TabsList className="bg-transparent p-0 justify-between w-full grid grid-cols-5">
              <TabsTrigger
                value="overview"
                className="data-[state=active]:border-slate-800 data-[state=active]:text-slate-800 data-[state=inactive]:text-slate-500 data-[state=inactive]:border-transparent border-b-2 rounded-none px-2 py-3 text-sm font-medium transition-colors duration-200 hover:text-slate-700 flex-1 text-center"
              >
                <BarChart3 className="h-4 w-4 mr-1.5 inline-block" />
                Dashboard
              </TabsTrigger>
              <TabsTrigger
                value="pokedex"
                className="data-[state=active]:border-slate-800 data-[state=active]:text-slate-800 data-[state=inactive]:text-slate-500 data-[state=inactive]:border-transparent border-b-2 rounded-none px-2 py-3 text-sm font-medium transition-colors duration-200 hover:text-slate-700 flex-1 text-center"
              >
                <Book className="h-4 w-4 mr-1.5 inline-block" />
                Pokédex
              </TabsTrigger>
              <TabsTrigger
                value="events"
                className="data-[state=active]:border-slate-800 data-[state=active]:text-slate-800 data-[state=inactive]:text-slate-500 data-[state=inactive]:border-transparent border-b-2 rounded-none px-2 py-3 text-sm font-medium transition-colors duration-200 hover:text-slate-700 flex-1 text-center"
              >
                <Calendar className="h-4 w-4 mr-1.5 inline-block" />
                Eventos
              </TabsTrigger>
              <TabsTrigger
                value="stats"
                className="data-[state=active]:border-slate-800 data-[state=active]:text-slate-800 data-[state=inactive]:text-slate-500 data-[state=inactive]:border-transparent border-b-2 rounded-none px-2 py-3 text-sm font-medium transition-colors duration-200 hover:text-slate-700 flex-1 text-center"
              >
                <TrendingUp className="h-4 w-4 mr-1.5 inline-block" />
                Estatísticas
              </TabsTrigger>
              <TabsTrigger
                value="achievements"
                className="data-[state=active]:border-slate-800 data-[state=active]:text-slate-800 data-[state=inactive]:text-slate-500 data-[state=inactive]:border-transparent border-b-2 rounded-none px-2 py-3 text-sm font-medium transition-colors duration-200 hover:text-slate-700 flex-1 text-center"
              >
                <Activity className="h-4 w-4 mr-1.5 inline-block" />
                Conquistas
              </TabsTrigger>
            </TabsList>
          </Tabs>
        </div>
      </div>

      <div className="container mx-auto px-4">
        <Tabs value={activeTab} onValueChange={handleTabNavigation} className="w-full">
          <TabsContent value="overview" className="mt-6">
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
                    const isCaught = capturedPokemon?.some((p) => p.id === pokemon.id) || false

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

          <TabsContent value="pokedex" className="mt-6">
            <PokedexView />
          </TabsContent>

          <TabsContent value="events" className="mt-6">
            <EventsView />
          </TabsContent>

          <TabsContent value="stats" className="mt-6">
            {/* Conteúdo da aba Estatísticas permanece o mesmo por enquanto */}
            <div className="py-6">
              <h2 className="text-2xl font-bold mb-6 text-slate-800">Estatísticas Detalhadas</h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <Card className="bg-white border-slate-200">
                  <CardHeader className="pb-3">
                    <CardTitle className="text-lg text-slate-800">Progresso Geral</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      <div className="flex justify-between">
                        <span className="text-slate-600">Capturados:</span>
                        <span className="font-semibold text-slate-800">
                          {capturedCount}/{totalPokemon}
                        </span>
                      </div>
                      <div className="w-full bg-slate-200 rounded-full h-2">
                        <div
                          className="bg-slate-800 h-2 rounded-full transition-all duration-500"
                          style={{ width: `${completionPercentage}%` }}
                        />
                      </div>
                      <p className="text-sm text-slate-600">{completionPercentage}% completo</p>
                    </div>
                  </CardContent>
                </Card>
                <Card className="bg-white border-slate-200">
                  <CardHeader className="pb-3">
                    <CardTitle className="text-lg text-slate-800">Coleções Especiais</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <div className="h-6 w-6 bg-yellow-100 rounded-full flex items-center justify-center">
                            <Sparkles className="h-3 w-3 text-yellow-600" />
                          </div>
                          <span className="text-slate-700">Shinys</span>
                        </div>
                        <Badge className="bg-yellow-500 text-white">{shinyCount}</Badge>
                      </div>
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <div className="h-6 w-6 bg-orange-100 rounded-full flex items-center justify-center">
                            <Star className="h-3 w-3 text-orange-600" />
                          </div>
                          <span className="text-slate-700">Lucky</span>
                        </div>
                        <Badge className="bg-orange-500 text-white">{luckyCount}</Badge>
                      </div>
                    </div>
                  </CardContent>
                </Card>
                <Card className="bg-white border-slate-200">
                  <CardHeader className="pb-3">
                    <CardTitle className="text-lg text-slate-800">Conquistas Recentes (Exemplo)</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      <div className="flex items-center gap-2">
                        <div className="h-6 w-6 bg-slate-100 rounded-full flex items-center justify-center">
                          <Award className="h-3 w-3 text-slate-700" />
                        </div>
                        <span className="text-sm text-slate-700">Primeiro Pokémon</span>
                        {capturedCount > 0 ? (
                          <Badge className="bg-slate-700 text-white">✓</Badge>
                        ) : (
                          <Badge variant="outline">Pendente</Badge>
                        )}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          </TabsContent>
          <TabsContent value="achievements" className="mt-6">
            <AchievementsView />
          </TabsContent>
        </Tabs>
      </div>
      <LegalFooter />
    </div>
  )
}
