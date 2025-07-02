"use client"

import { useState, useEffect, useMemo } from "react"
import { useAuth } from "@/contexts/AuthContext"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { LiveEventCard } from "@/components/LiveEventCardSimple"
import { getUpdatedEvents, getUserRegion } from "@/services/eventApi"
import type { LiveEvent, UserNotificationPreferences } from "@/types/events"
import { Radar, RefreshCw, Bell, Settings, MapPin, Clock, Zap, Info } from "lucide-react"

export function EventsView() {
  const { user, loading, isDemoMode } = useAuth()
  const [events, setEvents] = useState<LiveEvent[]>([])
  const [isRefreshing, setIsRefreshing] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
  const [lastUpdate, setLastUpdate] = useState(new Date())
  const [userRegion, setUserRegion] = useState<string>("Global")
  const [notifications, setNotifications] = useState<UserNotificationPreferences>({
    enabledTypes: [],
    favoritePokemon: [],
    regions: [],
    notifyBefore: 30,
    enabledEvents: [],
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

  const filteredEvents = events
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
    <div className="min-h-screen">
      <div className="container mx-auto px-6 py-2">
        {/* Simple Tab Navigation with Update Button */}
        <div className="flex items-center justify-between mb-2">
          <div className="bg-white dark:bg-gray-800 backdrop-blur-sm rounded-xl p-1 shadow-md border border-gray-200 dark:border-gray-700">
            <nav className="flex space-x-1">
              {[
                { id: 'all', label: 'Todos', count: filteredEvents.length },
                { id: 'active', label: 'Ao Vivo', count: activeEvents.length },
                { id: 'upcoming', label: 'Em Breve', count: upcomingEvents.length },
                { id: 'ended', label: 'Terminados', count: endedEvents.length }
              ].map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`relative px-4 py-2 rounded-lg font-medium text-sm transition-all duration-200 ${
                    activeTab === tab.id
                      ? 'bg-slate-600 dark:bg-slate-700 text-white shadow-md'
                      : 'text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-gray-100 hover:bg-white dark:hover:bg-gray-800'
                  }`}
                >
                  {tab.label}
                  <span className={`ml-1 px-1.5 py-0.5 rounded-full text-xs ${
                    activeTab === tab.id 
                      ? 'bg-white/20 text-white' 
                      : 'bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300'
                  }`}>
                    {tab.count}
                  </span>
                </button>
              ))}
            </nav>
          </div>
          
          <div className="flex items-center gap-4">
            <Badge variant="outline" className="bg-white dark:bg-gray-800 backdrop-blur-sm border-gray-200 dark:border-gray-700">
              <Clock className="w-3 h-3 mr-1" />
              {lastUpdate.toLocaleTimeString("pt-PT")}
            </Badge>
            <Button 
              onClick={refreshEvents} 
              disabled={isRefreshing}
              className="bg-slate-600 dark:bg-slate-700 hover:bg-slate-700 dark:hover:bg-slate-600 text-white shadow-lg hover:shadow-xl transition-all duration-200"
            >
              <RefreshCw className={`w-4 h-4 mr-2 ${isRefreshing ? "animate-spin" : ""}`} />
              {isRefreshing ? "Atualizando..." : "Atualizar"}
            </Button>
          </div>
        </div>
        {/* Event Content */}
        {isLoading && events.length === 0 ? (
          <div className="text-center py-20">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full mb-6 animate-pulse">
              <Radar className="w-8 h-8 text-white" />
            </div>
            <h3 className="text-xl font-semibold text-white mb-2">Carregando eventos...</h3>
            <p className="text-gray-300">Aguarde enquanto buscamos os eventos mais recentes</p>
          </div>
        ) : (
          <div className="space-y-6">
            {activeTab === "all" && (
              <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-1">
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
                  <div className="text-center py-16 px-6 bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm rounded-2xl border border-slate-200 dark:border-slate-700 shadow-lg">
                    <div className="inline-flex items-center justify-center w-16 h-16 bg-slate-100 dark:bg-slate-700 rounded-full mb-4">
                      <Radar className="w-8 h-8 text-slate-600 dark:text-slate-400" />
                    </div>
                    <h3 className="text-xl font-semibold text-slate-800 dark:text-white mb-2">Nenhum evento encontrado</h3>
                    <p className="text-slate-600 dark:text-slate-300">Tente ajustar os filtros ou atualizar a página</p>
                  </div>
                )}
              </div>
            )}

            {activeTab === "active" && (
              <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-1">
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
                  <div className="text-center py-16 px-6 bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm rounded-2xl border border-slate-200 dark:border-slate-700 shadow-lg">
                    <div className="inline-flex items-center justify-center w-16 h-16 bg-green-100 dark:bg-green-900/20 rounded-full mb-4">
                      <Zap className="w-8 h-8 text-green-600" />
                    </div>
                    <h3 className="text-xl font-semibold text-slate-800 dark:text-white mb-2">Nenhum evento ativo</h3>
                    <p className="text-slate-600 dark:text-slate-300">Verifique os eventos em breve!</p>
                  </div>
                )}
              </div>
            )}

            {activeTab === "upcoming" && (
              <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-1">
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
                  <div className="text-center py-16 px-6 bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm rounded-2xl border border-slate-200 dark:border-slate-700 shadow-lg">
                    <div className="inline-flex items-center justify-center w-16 h-16 bg-blue-100 dark:bg-blue-900/20 rounded-full mb-4">
                      <Clock className="w-8 h-8 text-blue-600" />
                    </div>
                    <h3 className="text-xl font-semibold text-slate-800 dark:text-white mb-2">Nenhum evento programado</h3>
                    <p className="text-slate-600 dark:text-slate-300">Novos eventos serão anunciados em breve!</p>
                  </div>
                )}
              </div>
            )}

            {activeTab === "ended" && (
              <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-1">
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
                  <div className="text-center py-16 px-6 bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm rounded-2xl border border-slate-200 dark:border-slate-700 shadow-lg">
                    <div className="inline-flex items-center justify-center w-16 h-16 bg-slate-100 dark:bg-slate-700 rounded-full mb-4">
                      <Settings className="w-8 h-8 text-slate-600 dark:text-slate-400" />
                    </div>
                    <h3 className="text-xl font-semibold text-slate-800 dark:text-white mb-2">Nenhum evento terminado</h3>
                    <p className="text-slate-600 dark:text-slate-300">Eventos passados aparecerão aqui</p>
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
