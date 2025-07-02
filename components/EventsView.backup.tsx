"use client"

import { useState, useEffect, useMemo } from "react"
import { useAuth } from "@/contexts/AuthContext"
// useRouter não é mais necessário aqui se for totalmente embutido e não houver navegação interna na view
// import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Alert, AlertDescription } from "@/components/ui/alert"
// Logo pode ser removido se o header do dashboard já o tiver
// import { Logo } from "@/components/Logo"
import { LiveEventCard } from "@/components/LiveEventCardSimple"
import { EventFilters, type EventFilterState } from "@/components/EventFilters"
// UserProfile e LogOut são gerenciados pelo header do dashboard
// import { UserProfile } from "@/components/UserProfile"
import { getUpdatedEvents, getUserRegion } from "@/services/eventApi"
import type { LiveEvent, UserNotificationPreferences } from "@/types/events"
import { Radar, RefreshCw, Bell, Settings, MapPin, Clock, Zap, Info } from "lucide-react"
// Link pode não ser necessário se não houver links para fora desta view
// import Link from "next/link"

// Renomear a função para evitar conflito se este arquivo for importado em outro lugar
export function EventsView() {
  const { user, loading, isDemoMode } = useAuth() // logout removido, será do dashboard
  // const router = useRouter() // Removido
  const [events, setEvents] = useState<LiveEvent[]>([])
  const [filters, setFilters] = useState<EventFilterState>({
    search: "",
    type: "all",
    status: "all",
    priority: "all",
    region: "all",
  })
  const [isRefreshing, setIsRefreshing] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
  const [lastUpdate, setLastUpdate] = useState(new Date())
  const [userRegion, setUserRegion] = useState<string>("Global")
  const [notifications, setNotifications] = useState<UserNotificationPreferences>({
    enabledTypes: [],
    favoritePokemon: [],
    regions: [],
    notifyBefore: 30,
    enabledEvents: [], // Adicionado para consistência com o uso
  })
  const [enabledNotifications, setEnabledNotifications] = useState<Set<string>>(new Set())
  const [activeTab, setActiveTab] = useState("all")

  // useEffect para redirecionar se não houver usuário não é mais necessário aqui,
  // pois o dashboard pai já cuida disso.

  useEffect(() => {
    setUserRegion(getUserRegion())
    const savedNotifications = localStorage.getItem("event-notifications")
    if (savedNotifications) {
      try {
        const parsed = JSON.parse(savedNotifications)
        setNotifications(parsed)
        setEnabledNotifications(new Set(parsed.enabledEvents || []))
      } catch (error) {
        console.warn("Error loading notification preferences:", error)
      }
    }
    refreshEvents()
    const interval = setInterval(refreshEvents, 5 * 60 * 1000)
    return () => clearInterval(interval)
  }, [])

  const refreshEvents = async () => {
    setIsRefreshing(true)
    try {
      const updatedEvents = await getUpdatedEvents()
      setEvents(updatedEvents)
      setLastUpdate(new Date())
    } catch (error) {
      console.error("Error refreshing events:", error)
    } finally {
      setIsRefreshing(false)
      setIsLoading(false)
    }
  }

  const filteredEvents = useMemo(() => {
    return events.filter((event) => {
      if (filters.search && !event.name.toLowerCase().includes(filters.search.toLowerCase())) {
        return false
      }
      if (filters.type !== "all" && event.type !== filters.type) {
        return false
      }
      if (filters.status !== "all") {
        switch (filters.status) {
          case "active":
            if (!event.isActive) return false
            break
          case "upcoming":
            if (!event.isUpcoming) return false
            break
          case "ended":
            if (event.isActive || event.isUpcoming) return false
            break
        }
      }
      if (filters.priority !== "all" && event.priority !== filters.priority) {
        return false
      }
      if (filters.region !== "all" && filters.region !== "global") {
        const hasRegion = event.activeRegions.some((region) => {
          const regionName = region.country.toLowerCase()
          switch (filters.region) {
            case "americas":
              return regionName.includes("usa") || regionName.includes("canada") || regionName.includes("brazil")
            case "europe":
              return regionName.includes("uk") || regionName.includes("germany") || regionName.includes("france")
            case "asia":
              return regionName.includes("japan") || regionName.includes("korea") || regionName.includes("china")
            case "oceania":
              return regionName.includes("australia") || regionName.includes("new zealand")
            default:
              return true
          }
        })
        if (!hasRegion) return false
      }
      return true
    })
  }, [events, filters])

  const activeEvents = filteredEvents.filter((e) => e.isActive)
  const upcomingEvents = filteredEvents.filter((e) => e.isUpcoming)
  const endedEvents = filteredEvents.filter((e) => !e.isActive && !e.isUpcoming)

  const handleToggleNotification = (eventId: string) => {
    const newEnabledNotifications = new Set(enabledNotifications)
    if (newEnabledNotifications.has(eventId)) {
      newEnabledNotifications.delete(eventId)
    } else {
      newEnabledNotifications.add(eventId)
    }
    setEnabledNotifications(newEnabledNotifications)
    const updatedNotifications = {
      ...notifications,
      enabledEvents: Array.from(newEnabledNotifications),
    }
    setNotifications(updatedNotifications)
    localStorage.setItem("event-notifications", JSON.stringify(updatedNotifications))
  }

  const handleShareEvent = async (event: LiveEvent) => {
    const shareData = {
      title: `${event.name} - MyPokédex GO`,
      text: event.description,
      url: window.location.href, // Pode precisar ser ajustado se a URL do dashboard for diferente
    }
    if (navigator.share) {
      try {
        await navigator.share(shareData)
      } catch (error) {
        console.log("Error sharing:", error)
      }
    } else {
      // Fallback clipboard implementation
      const textToShare = `${shareData.title}\n${shareData.text}\n${shareData.url}`
      try {
        // Try to use the Clipboard API if available and allowed
        if (navigator.clipboard && window.isSecureContext) {
          await navigator.clipboard.writeText(textToShare)
          console.log("Event shared via Clipboard API")
        } else {
          // Fallback method for older browsers or non-HTTPS contexts
          const textArea = document.createElement('textarea')
          textArea.value = textToShare
          textArea.style.position = 'fixed'
          textArea.style.left = '-999999px'
          textArea.style.top = '-999999px'
          document.body.appendChild(textArea)
          textArea.focus()
          textArea.select()
          document.execCommand('copy')
          textArea.remove()
          console.log("Event shared via fallback method")
        }
      } catch (error) {
        console.warn("Failed to copy event to clipboard:", error)
      }
    }
  }

  // handleLogout não é mais necessário aqui

  if (loading && isLoading) {
    // Verifica ambos os loadings
    return (
      <div className="min-h-[calc(100vh-200px)] flex items-center justify-center">
        <div className="text-center space-y-4">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="text-muted-foreground">A carregar eventos...</p>
        </div>
      </div>
    )
  }

  // Verificação de usuário não é mais necessária aqui

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50 dark:from-slate-900 dark:via-slate-800 dark:to-slate-900">
      <div className="container mx-auto px-6 py-8">
        {/* Hero Header Section */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full mb-6 shadow-lg">
            <Radar className="w-10 h-10 text-white" />
          </div>
          <h1 className="text-5xl font-bold bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 bg-clip-text text-transparent mb-4">
            Eventos ao Vivo
          </h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Descubra eventos exclusivos do Pokémon GO em tempo real
          </p>
          <div className="flex items-center justify-center gap-4 mt-6">
            <Button 
              onClick={refreshEvents} 
              disabled={isRefreshing}
              className="bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white shadow-lg hover:shadow-xl transition-all duration-200"
            >
              <RefreshCw className={`w-4 h-4 mr-2 ${isRefreshing ? "animate-spin" : ""}`} />
              {isRefreshing ? "Atualizando..." : "Atualizar Eventos"}
            </Button>
            <Badge variant="outline" className="bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm border-blue-200 dark:border-slate-700">
              <Clock className="w-3 h-3 mr-1" />
              {lastUpdate.toLocaleTimeString("pt-PT")}
            </Badge>
          </div>
        </div>

        {/* Floating Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
          <div className="bg-white/70 dark:bg-slate-800/70 backdrop-blur-sm rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all duration-300 border border-white/20 dark:border-slate-700/50">
            <div className="flex items-center justify-between mb-4">
              <div className="p-3 bg-gradient-to-r from-green-400 to-emerald-500 rounded-xl">
                <Zap className="w-6 h-6 text-white" />
              </div>
              <span className="text-3xl font-bold text-green-600">{activeEvents.length}</span>
            </div>
            <h3 className="font-semibold text-gray-900 dark:text-white">Eventos Ativos</h3>
            <p className="text-sm text-muted-foreground">Acontecendo agora</p>
          </div>

          <div className="bg-white/70 dark:bg-slate-800/70 backdrop-blur-sm rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all duration-300 border border-white/20 dark:border-slate-700/50">
            <div className="flex items-center justify-between mb-4">
              <div className="p-3 bg-gradient-to-r from-blue-400 to-cyan-500 rounded-xl">
                <Clock className="w-6 h-6 text-white" />
              </div>
              <span className="text-3xl font-bold text-blue-600">{upcomingEvents.length}</span>
            </div>
            <h3 className="font-semibold text-gray-900 dark:text-white">Em Breve</h3>
            <p className="text-sm text-muted-foreground">Próximos eventos</p>
          </div>

          <div className="bg-white/70 dark:bg-slate-800/70 backdrop-blur-sm rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all duration-300 border border-white/20 dark:border-slate-700/50">
            <div className="flex items-center justify-between mb-4">
              <div className="p-3 bg-gradient-to-r from-orange-400 to-red-500 rounded-xl">
                <Bell className="w-6 h-6 text-white" />
              </div>
              <span className="text-3xl font-bold text-orange-600">{enabledNotifications.size}</span>
            </div>
            <h3 className="font-semibold text-gray-900 dark:text-white">Notificações</h3>
            <p className="text-sm text-muted-foreground">Eventos seguidos</p>
          </div>

          <div className="bg-white/70 dark:bg-slate-800/70 backdrop-blur-sm rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all duration-300 border border-white/20 dark:border-slate-700/50">
            <div className="flex items-center justify-between mb-4">
              <div className="p-3 bg-gradient-to-r from-purple-400 to-pink-500 rounded-xl">
                <MapPin className="w-6 h-6 text-white" />
              </div>
              <span className="text-2xl font-bold text-purple-600">{userRegion}</span>
            </div>
            <h3 className="font-semibold text-gray-900 dark:text-white">Sua Região</h3>
            <p className="text-sm text-muted-foreground">Localização atual</p>
          </div>
        </div>

        {isDemoMode && (
          <div className="bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-900/20 dark:to-purple-900/20 rounded-2xl p-6 mb-8 border border-blue-200 dark:border-blue-800">
            <div className="flex items-start gap-4">
              <div className="p-2 bg-blue-100 dark:bg-blue-900 rounded-lg">
                <Info className="h-5 w-5 text-blue-600" />
              </div>
              <div>
                <h3 className="font-semibold text-blue-900 dark:text-blue-100 mb-1">Modo Demonstração</h3>
                <p className="text-blue-700 dark:text-blue-200">
                  Os eventos apresentados são simulados para fins de demonstração.
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Enhanced Filters */}
        <div className="bg-white/70 dark:bg-slate-800/70 backdrop-blur-sm rounded-2xl p-6 mb-8 shadow-lg border border-white/20 dark:border-slate-700/50">
          <EventFilters onFilterChange={setFilters} />
        </div>

        {/* Modern Tab Navigation */}
        <div className="flex justify-center mb-10">
          <div className="bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm rounded-2xl p-2 shadow-lg border border-white/20 dark:border-slate-700/50">
            <nav className="flex space-x-2">
              {[
                { id: 'all', label: 'Todos', count: filteredEvents.length, color: 'from-gray-500 to-gray-600' },
                { id: 'active', label: 'Ao Vivo', count: activeEvents.length, color: 'from-green-500 to-emerald-600' },
                { id: 'upcoming', label: 'Em Breve', count: upcomingEvents.length, color: 'from-blue-500 to-cyan-600' },
                { id: 'ended', label: 'Terminados', count: endedEvents.length, color: 'from-gray-400 to-gray-500' }
              ].map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`relative px-6 py-3 rounded-xl font-medium text-sm transition-all duration-200 ${
                    activeTab === tab.id
                      ? `bg-gradient-to-r ${tab.color} text-white shadow-lg scale-105`
                      : 'text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-gray-100 hover:bg-gray-100 dark:hover:bg-slate-700/50'
                  }`}
                >
                  {tab.label}
                  <span className={`ml-2 px-2 py-1 rounded-full text-xs ${
                    activeTab === tab.id 
                      ? 'bg-white/20 text-white' 
                      : 'bg-gray-200 dark:bg-slate-600 text-gray-700 dark:text-gray-300'
                  }`}>
                    {tab.count}
                  </span>
                </button>
              ))}
            </nav>
          </div>
        </div>
        {/* Event Content */}
        {isLoading && events.length === 0 ? (
          <div className="text-center py-20">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full mb-6 animate-pulse">
              <Radar className="w-8 h-8 text-white" />
            </div>
            <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">Carregando eventos...</h3>
            <p className="text-muted-foreground">Aguarde enquanto buscamos os eventos mais recentes</p>
          </div>
        ) : (
          <div className="space-y-8">
            {activeTab === "all" && (
              <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-1">
                {filteredEvents.length > 0 ? (
                  filteredEvents.map((event) => (
                    <LiveEventCard
                      key={event.id}
                      event={event}
                      isNotificationEnabled={enabledNotifications.has(event.id)}
                      onToggleNotification={handleToggleNotification}
                      onShare={handleShareEvent}
                    />
                  ))
                ) : (
                  <div className="text-center py-20">
                    <div className="inline-flex items-center justify-center w-16 h-16 bg-gray-100 dark:bg-slate-800 rounded-full mb-6">
                      <Radar className="w-8 h-8 text-muted-foreground" />
                    </div>
                    <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">Nenhum evento encontrado</h3>
                    <p className="text-muted-foreground">Tente ajustar os filtros ou atualizar a página</p>
                  </div>
                )}
              </div>
            )}

            {activeTab === "active" && (
              <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-1">
                {activeEvents.length > 0 ? (
                  activeEvents.map((event) => (
                    <LiveEventCard
                      key={event.id}
                      event={event}
                      isNotificationEnabled={enabledNotifications.has(event.id)}
                      onToggleNotification={handleToggleNotification}
                      onShare={handleShareEvent}
                    />
                  ))
                ) : (
                  <div className="text-center py-20">
                    <div className="inline-flex items-center justify-center w-16 h-16 bg-green-100 dark:bg-green-900/20 rounded-full mb-6">
                      <Zap className="w-8 h-8 text-green-600" />
                    </div>
                    <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">Nenhum evento ativo</h3>
                    <p className="text-muted-foreground">Verifique os eventos em breve!</p>
                  </div>
                )}
              </div>
            )}

            {activeTab === "upcoming" && (
              <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-1">
                {upcomingEvents.length > 0 ? (
                  upcomingEvents.map((event) => (
                    <LiveEventCard
                      key={event.id}
                      event={event}
                      isNotificationEnabled={enabledNotifications.has(event.id)}
                      onToggleNotification={handleToggleNotification}
                      onShare={handleShareEvent}
                    />
                  ))
                ) : (
                  <div className="text-center py-20">
                    <div className="inline-flex items-center justify-center w-16 h-16 bg-blue-100 dark:bg-blue-900/20 rounded-full mb-6">
                      <Clock className="w-8 h-8 text-blue-600" />
                    </div>
                    <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">Nenhum evento programado</h3>
                    <p className="text-muted-foreground">Novos eventos serão anunciados em breve!</p>
                  </div>
                )}
              </div>
            )}

            {activeTab === "ended" && (
              <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-1">
                {endedEvents.length > 0 ? (
                  endedEvents.map((event) => (
                    <LiveEventCard
                      key={event.id}
                      event={event}
                      isNotificationEnabled={enabledNotifications.has(event.id)}
                      onToggleNotification={handleToggleNotification}
                      onShare={handleShareEvent}
                    />
                  ))
                ) : (
                  <div className="text-center py-20">
                    <div className="inline-flex items-center justify-center w-16 h-16 bg-gray-100 dark:bg-slate-800 rounded-full mb-6">
                      <Settings className="w-8 h-8 text-muted-foreground" />
                    </div>
                    <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">Nenhum evento terminado</h3>
                    <p className="text-muted-foreground">Eventos passados aparecerão aqui</p>
                  </div>
                )}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  )
}
