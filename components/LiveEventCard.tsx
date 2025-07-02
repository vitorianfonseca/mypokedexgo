"use client"

import { useState } from "react"
import Image from "next/image"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { Separator } from "@/components/ui/separator"
import type { LiveEvent } from "@/types/events"
import {
  Clock,
  MapPin,
  Star,
  Sparkles,
  Crown,
  ExternalLink,
  Share2,
  Bell,
  BellOff,
  Calendar,
  User,
  Zap,
  Gift,
} from "lucide-react"

interface LiveEventCardProps {
  event: LiveEvent
  isNotificationEnabled?: boolean
  onToggleNotification?: (eventId: string) => void
  onShare?: (event: LiveEvent) => void
}

export function LiveEventCard({
  event,
  isNotificationEnabled = false,
  onToggleNotification,
  onShare,
}: LiveEventCardProps) {
  const [imageError, setImageError] = useState(false)

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return date.toLocaleDateString("pt-PT", {
      day: "2-digit",
      month: "short",
      hour: "2-digit",
      minute: "2-digit",
    })
  }

  const getTimeRemaining = () => {
    const now = new Date()
    const start = new Date(event.startDate)
    const end = new Date(event.endDate)

    if (event.isActive) {
      const remaining = end.getTime() - now.getTime()
      const hours = Math.floor(remaining / (1000 * 60 * 60))
      const minutes = Math.floor((remaining % (1000 * 60 * 60)) / (1000 * 60))
      return `${hours}h ${minutes}m restantes`
    }

    if (event.isUpcoming) {
      const timeToStart = start.getTime() - now.getTime()
      const days = Math.floor(timeToStart / (1000 * 60 * 60 * 24))
      const hours = Math.floor((timeToStart % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60))

      if (days > 0) return `Começa em ${days}d ${hours}h`
      return `Começa em ${hours}h`
    }

    return "Evento terminado"
  }

  const getEventProgress = () => {
    if (!event.isActive) return 0

    const now = new Date()
    const start = new Date(event.startDate)
    const end = new Date(event.endDate)
    const total = end.getTime() - start.getTime()
    const elapsed = now.getTime() - start.getTime()

    return Math.min(100, Math.max(0, (elapsed / total) * 100))
  }

  const getEventTypeIcon = () => {
    switch (event.type) {
      case "community_day":
        return <User className="w-4 h-4" />
      case "raid_hour":
        return <Zap className="w-4 h-4" />
      case "spotlight_hour":
        return <Star className="w-4 h-4" />
      case "go_fest":
        return <Crown className="w-4 h-4" />
      default:
        return <Calendar className="w-4 h-4" />
    }
  }

  const getEventTypeGradient = () => {
    switch (event.type) {
      case "community_day":
        return "from-green-500 to-emerald-600"
      case "raid_hour":
        return "from-red-500 to-rose-600"
      case "spotlight_hour":
        return "from-yellow-500 to-amber-600"
      case "go_fest":
        return "from-purple-500 to-violet-600"
      default:
        return "from-blue-500 to-cyan-600"
    }
  }

  const getStatusStyle = () => {
    if (event.isActive) {
      return {
        gradient: "from-green-400 to-emerald-500",
        badge: "bg-green-500 text-white",
        text: "AO VIVO",
        icon: <div className="w-2 h-2 bg-white rounded-full animate-pulse" />
      }
    }
    if (event.isUpcoming) {
      return {
        gradient: "from-blue-400 to-cyan-500",
        badge: "bg-blue-500 text-white",
        text: "EM BREVE",
        icon: <Clock className="w-3 h-3" />
      }
    }
    return {
      gradient: "from-gray-400 to-gray-500",
      badge: "bg-gray-500 text-white",
      text: "TERMINADO",
      icon: <Calendar className="w-3 h-3" />
    }
  }

  const formatDateRange = () => {
    const start = new Date(event.startDate)
    const end = new Date(event.endDate)
    
    const startStr = start.toLocaleDateString("pt-PT", {
      day: "2-digit",
      month: "short",
      hour: "2-digit",
      minute: "2-digit"
    })
    
    const endStr = end.toLocaleDateString("pt-PT", {
      day: "2-digit", 
      month: "short",
      hour: "2-digit",
      minute: "2-digit"
    })
    
    return `${startStr} → ${endStr}`
  }

  const statusStyle = getStatusStyle()

  return (
    <div className="group relative">
      {/* Gradient Background Card */}
      <div className={`absolute inset-0 bg-gradient-to-r ${getEventTypeGradient()} rounded-2xl opacity-10 group-hover:opacity-20 transition-opacity duration-300`} />
      
      <Card className="
        border-0 shadow-lg bg-white/95 dark:bg-slate-800/95 backdrop-blur-sm
        transition-all duration-300 ease-in-out
        hover:shadow-xl hover:shadow-slate-200/50 hover:scale-[1.01]
        animate-in fade-in-0 zoom-in-95
        rounded-2xl overflow-hidden border border-slate-200 dark:border-slate-700
      ">
        {/* Header Section */}
        <div className="relative p-6">
          {/* Status Badge - Floating */}
          <div className="absolute top-4 right-4 z-10">
            <Badge className={`${statusStyle.badge} shadow-lg`}>
              {statusStyle.icon}
              <span className="ml-1 font-semibold">{statusStyle.text}</span>
            </Badge>
          </div>

          {/* Event Image & Info */}
          <div className="flex items-start gap-4 mb-4">
            <div className="relative">
              {/* Poké Ball icon consistent with login page */}
              <div className="w-16 h-16 bg-gradient-to-br from-red-600 to-red-700 rounded-xl shadow-lg flex items-center justify-center relative">
                <div className="absolute inset-1 bg-white rounded-lg flex items-center justify-center">
                  <div className="w-6 h-6 bg-gradient-to-br from-red-500 to-red-600 rounded-full relative">
                    <div className="absolute w-2 h-2 bg-white rounded-full top-1 left-1"></div>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="flex-1 min-w-0">
              <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-1 line-clamp-1">
                {event.name}
              </h3>
              <p className="text-sm text-muted-foreground line-clamp-2 mb-3">
                {event.description}
              </p>
              
              {/* Event Type Badge */}
              <div className="flex items-center gap-2">
                <Badge className="bg-gradient-to-r from-red-500 to-red-600 text-white border-0">
                  {getEventTypeIcon()}
                  <span className="ml-1 capitalize font-medium">
                    {event.type.replace("_", " ")}
                  </span>
                </Badge>
                {event.priority === "critical" && (
                  <Badge className="bg-red-500 text-white animate-pulse">
                    <Star className="w-3 h-3 mr-1" />
                    CRÍTICO
                  </Badge>
                )}
              </div>
            </div>
          </div>

          {/* Time & Progress Section */}
          <div className="space-y-3">
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <Calendar className="w-4 h-4" />
              <span>{formatDateRange()}</span>
            </div>
            
            {event.isActive && (
              <div className="space-y-2">
                <div className="flex justify-between items-center text-sm">
                  <span className="font-medium text-gray-900 dark:text-white">Progresso</span>
                  <span className="text-muted-foreground">{getTimeRemaining()}</span>
                </div>
                <div className="relative">
                  <Progress value={getEventProgress()} className="h-2" />
                  <div className={`absolute top-0 left-0 h-2 bg-gradient-to-r ${statusStyle.gradient} rounded-full`} 
                       style={{ width: `${getEventProgress()}%` }} />
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Enhanced Content Section */}
        <div className="px-6 pb-6 space-y-4">
          {/* Featured Pokemon */}
          {event.featuredPokemon.length > 0 && (
            <div className="space-y-3">
              <h4 className="font-semibold text-sm flex items-center gap-2">
                <div className="p-1 bg-yellow-100 dark:bg-yellow-900/20 rounded-lg">
                  <Star className="w-4 h-4 text-yellow-600" />
                </div>
                Pokémons em Destaque
              </h4>
              <div className="flex gap-3 flex-wrap">
                {event.featuredPokemon.slice(0, 6).map((pokemon) => (
                  <div key={pokemon.id} className="relative group">
                    <div className="w-14 h-14 bg-gradient-to-br from-white to-gray-50 dark:from-slate-800 dark:to-slate-700 rounded-xl flex items-center justify-center border-2 border-gray-200 dark:border-slate-600 group-hover:border-blue-300 dark:group-hover:border-blue-500 transition-colors shadow-sm">
                      <Image
                        src={pokemon.imageUrl || "/placeholder.svg"}
                        alt={pokemon.name}
                        width={32}
                        height={32}
                        className="pixelated"
                      />
                    </div>
                    {pokemon.isShiny && (
                      <div className="absolute -top-1 -right-1 w-5 h-5 bg-gradient-to-r from-yellow-400 to-amber-500 rounded-full flex items-center justify-center shadow-lg">
                        <Sparkles className="w-3 h-3 text-white" />
                      </div>
                    )}
                    {pokemon.isLegendary && (
                      <div className="absolute -bottom-1 -right-1 w-5 h-5 bg-gradient-to-r from-purple-500 to-violet-600 rounded-full flex items-center justify-center shadow-lg">
                        <Crown className="w-3 h-3 text-white" />
                      </div>
                    )}
                  </div>
                ))}
                {event.featuredPokemon.length > 6 && (
                  <div className="w-14 h-14 bg-gradient-to-br from-gray-100 to-gray-200 dark:from-slate-700 dark:to-slate-600 rounded-xl flex items-center justify-center text-sm font-semibold text-gray-600 dark:text-gray-300">
                    +{event.featuredPokemon.length - 6}
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Event Bonuses */}
          {event.bonuses.length > 0 && (
            <div className="space-y-3">
              <h4 className="font-semibold text-sm flex items-center gap-2">
                <div className="p-1 bg-green-100 dark:bg-green-900/20 rounded-lg">
                  <Gift className="w-4 h-4 text-green-600" />
                </div>
                Bônus do Evento
              </h4>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                {event.bonuses.map((bonus, index) => (
                  <div key={index} className="flex items-center gap-2 p-3 bg-green-50 dark:bg-green-900/10 rounded-lg border border-green-200 dark:border-green-800">
                    <div className="w-8 h-8 bg-green-100 dark:bg-green-900/20 rounded-lg flex items-center justify-center">
                      <Gift className="w-4 h-4 text-green-600" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-gray-900 dark:text-white">
                        {bonus.multiplier > 1 && (
                          <span className="text-green-600 font-bold">{bonus.multiplier}x </span>
                        )}
                        {bonus.description}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Active Regions */}
          {event.activeRegions.length > 0 && (
            <div className="space-y-3">
              <h4 className="font-semibold text-sm flex items-center gap-2">
                <div className="p-1 bg-blue-100 dark:bg-blue-900/20 rounded-lg">
                  <MapPin className="w-4 h-4 text-blue-600" />
                </div>
                Regiões Ativas
              </h4>
              <div className="flex gap-2 flex-wrap">
                {event.activeRegions.slice(0, 4).map((region) => (
                  <Badge
                    key={region.name}
                    className={`${
                      region.isHighActivity 
                        ? "bg-gradient-to-r from-green-500 to-emerald-600 text-white hover:from-green-600 hover:to-emerald-700" 
                        : "bg-gray-100 dark:bg-slate-700 text-gray-700 dark:text-gray-300"
                    } px-3 py-2 rounded-lg font-medium`}
                  >
                    {region.name}
                    {region.isHighActivity && <Zap className="w-3 h-3 ml-1" />}
                  </Badge>
                ))}
                {event.activeRegions.length > 4 && (
                  <Badge className="bg-gray-100 dark:bg-slate-700 text-gray-700 dark:text-gray-300 px-3 py-2 rounded-lg font-medium">
                    +{event.activeRegions.length - 4} mais
                  </Badge>
                )}
              </div>
            </div>
          )}
        </div>

        {/* Action Footer */}
        <div className="px-6 pb-6">
          <div className="flex items-center justify-between p-4 bg-gray-50 dark:bg-slate-800/50 rounded-xl">
            <div className="flex gap-2">
              {event.sourceUrl && (
                <Button 
                  variant="outline" 
                  size="sm" 
                  asChild 
                  className="
                    group relative overflow-hidden
                    bg-white hover:bg-gray-50 text-gray-900 border border-gray-300
                    transition-all duration-300 ease-in-out
                    hover:shadow-md hover:scale-[1.02]
                    before:absolute before:inset-0 before:bg-gradient-to-r 
                    before:from-transparent before:via-gray-100/50 before:to-transparent
                    before:translate-x-[-100%] hover:before:translate-x-[100%]
                    before:transition-transform before:duration-700
                  "
                >
                  <a href={event.sourceUrl} target="_blank" rel="noopener noreferrer">
                    <ExternalLink className="w-4 h-4 mr-1" />
                    Ver Detalhes
                  </a>
                </Button>
              )}
              {onShare && (
                <Button 
                  variant="outline" 
                  size="sm" 
                  onClick={() => onShare(event)} 
                  className="
                    group relative overflow-hidden
                    bg-white hover:bg-gray-50 text-gray-900 border border-gray-300
                    transition-all duration-300 ease-in-out
                    hover:shadow-md hover:scale-[1.02]
                    before:absolute before:inset-0 before:bg-gradient-to-r 
                    before:from-transparent before:via-gray-100/50 before:to-transparent
                    before:translate-x-[-100%] hover:before:translate-x-[100%]
                    before:transition-transform before:duration-700
                  "
                >
                  <Share2 className="w-4 h-4 mr-1" />
                  Partilhar
                </Button>
              )}
            </div>
            
            {onToggleNotification && (
              <Button
                variant={isNotificationEnabled ? "default" : "outline"}
                size="sm"
                onClick={() => onToggleNotification(event.id)}
                className={`
                  group relative overflow-hidden transition-all duration-300 ease-in-out
                  ${isNotificationEnabled 
                    ? "bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 text-white shadow-lg hover:shadow-xl hover:scale-[1.02]" 
                    : "bg-white hover:bg-gray-50 text-gray-900 border border-gray-300 hover:shadow-md hover:scale-[1.02]"
                  }
                  before:absolute before:inset-0 before:bg-gradient-to-r 
                  before:from-transparent before:via-white/10 before:to-transparent
                  before:translate-x-[-100%] hover:before:translate-x-[100%]
                  before:transition-transform before:duration-700
                `}
              >
                {isNotificationEnabled ? (
                  <>
                    <Bell className="w-4 h-4 mr-1" />
                    Ativado
                  </>
                ) : (
                  <>
                    <BellOff className="w-4 h-4 mr-1" />
                    Notificar
                  </>
                )}
              </Button>
            )}
          </div>
        </div>
      </Card>
    </div>
  )
}
