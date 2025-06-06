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
import { LiveEventCard } from "@/components/LiveEventCard"
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
      navigator.clipboard.writeText(`${shareData.title}\n${shareData.text}\n${shareData.url}`)
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
    // Removido o div de fundo e header, pois o dashboard já os fornece
    <div className="container mx-auto px-4 py-8">
      {" "}
      {/* Adicionado container e padding */}
      {/* Page Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold flex items-center gap-3">
            <Radar className="w-8 h-8 text-blue-600" />
            Eventos ao Vivo
          </h1>
          <p className="text-muted-foreground mt-1">
            Acompanhe eventos do Pokémon GO em tempo real • Região: {userRegion}
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" onClick={refreshEvents} disabled={isRefreshing}>
            <RefreshCw className={`w-4 h-4 mr-2 ${isRefreshing ? "animate-spin" : ""}`} />
            {isRefreshing ? "Atualizando..." : "Atualizar"}
          </Button>
          <Badge variant="outline" className="text-xs">
            <Clock className="w-3 h-3 mr-1" />
            {lastUpdate.toLocaleTimeString("pt-PT")}
          </Badge>
        </div>
      </div>
      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
        <Card>
          <CardContent className="p-4 text-center">
            <Zap className="w-8 h-8 text-green-600 mx-auto mb-2" />
            <div className="text-2xl font-bold text-green-600">{activeEvents.length}</div>
            <div className="text-sm text-muted-foreground">Ao Vivo</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 text-center">
            <Clock className="w-8 h-8 text-blue-600 mx-auto mb-2" />
            <div className="text-2xl font-bold text-blue-600">{upcomingEvents.length}</div>
            <div className="text-sm text-muted-foreground">Em Breve</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 text-center">
            <Bell className="w-8 h-8 text-orange-600 mx-auto mb-2" />
            <div className="text-2xl font-bold text-orange-600">{enabledNotifications.size}</div>
            <div className="text-sm text-muted-foreground">Notificações</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 text-center">
            <MapPin className="w-8 h-8 text-purple-600 mx-auto mb-2" />
            <div className="text-2xl font-bold text-purple-600">{userRegion}</div>
            <div className="text-sm text-muted-foreground">Sua Região</div>
          </CardContent>
        </Card>
      </div>
      {isDemoMode && (
        <Alert className="mb-6">
          <Info className="h-4 w-4" />
          <AlertDescription>
            Modo demo ativo. Os eventos mostrados são simulados e/ou obtidos de APIs públicas.
          </AlertDescription>
        </Alert>
      )}
      <div className="mb-8">
        <EventFilters onFilterChange={setFilters} />
      </div>
      <div className="mb-6">
        <div className="bg-white dark:bg-slate-800 rounded-lg p-1 flex">
          <button
            className={`flex-1 py-2 px-4 rounded-md text-center font-medium ${
              activeTab === "all"
                ? "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-100"
                : "text-gray-600 dark:text-gray-300"
            }`}
            onClick={() => setActiveTab("all")}
          >
            Todos ({filteredEvents.length})
          </button>
          <button
            className={`flex-1 py-2 px-4 rounded-md text-center font-medium ${
              activeTab === "active"
                ? "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-100"
                : "text-gray-600 dark:text-gray-300"
            }`}
            onClick={() => setActiveTab("active")}
          >
            Ao Vivo ({activeEvents.length})
          </button>
          <button
            className={`flex-1 py-2 px-4 rounded-md text-center font-medium ${
              activeTab === "upcoming"
                ? "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-100"
                : "text-gray-600 dark:text-gray-300"
            }`}
            onClick={() => setActiveTab("upcoming")}
          >
            Em Breve ({upcomingEvents.length})
          </button>
          <button
            className={`flex-1 py-2 px-4 rounded-md text-center font-medium ${
              activeTab === "ended"
                ? "bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-100"
                : "text-gray-600 dark:text-gray-300"
            }`}
            onClick={() => setActiveTab("ended")}
          >
            Terminados ({endedEvents.length})
          </button>
        </div>
      </div>
      {isLoading && events.length === 0 ? ( // Mostrar loading apenas se não houver eventos ainda
        <div className="text-center py-16">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-muted-foreground">Carregando eventos...</p>
        </div>
      ) : (
        <div className="space-y-6">
          {activeTab === "all" && (
            <div className="grid gap-6">
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
                <div className="text-center py-16">
                  <Radar className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
                  <p className="text-xl text-muted-foreground">Nenhum evento encontrado</p>
                  <p className="text-muted-foreground">Tente ajustar os filtros ou atualizar a página</p>
                </div>
              )}
            </div>
          )}
          {activeTab === "active" && (
            <div className="grid gap-6">
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
                <div className="text-center py-16">
                  <Zap className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
                  <p className="text-xl text-muted-foreground">Nenhum evento ativo no momento</p>
                  <p className="text-muted-foreground">Verifique os eventos em breve!</p>
                </div>
              )}
            </div>
          )}
          {activeTab === "upcoming" && (
            <div className="grid gap-6">
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
                <div className="text-center py-16">
                  <Clock className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
                  <p className="text-xl text-muted-foreground">Nenhum evento programado</p>
                  <p className="text-muted-foreground">Novos eventos serão anunciados em breve!</p>
                </div>
              )}
            </div>
          )}
          {activeTab === "ended" && (
            <div className="grid gap-6">
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
                <div className="text-center py-16">
                  <Settings className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
                  <p className="text-xl text-muted-foreground">Nenhum evento terminado</p>
                  <p className="text-muted-foreground">Eventos passados aparecerão aqui</p>
                </div>
              )}
            </div>
          )}
        </div>
      )}
    </div>
  )
}
