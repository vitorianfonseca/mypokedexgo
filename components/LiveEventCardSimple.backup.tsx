"use client"

import { useState } from "react"
import Image from "next/image"
import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
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
  Users,
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
        return <Users className="w-4 h-4" />
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
      <Card className="
        border-0 shadow-lg bg-white dark:bg-slate-800
        transition-all duration-300 ease-in-out
        hover:shadow-xl hover:shadow-gray-200/50 hover:scale-[1.01]
        animate-in fade-in-0 zoom-in-95 duration-300
        overflow-hidden rounded-2xl
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
              <div className="w-16 h-16 bg-gradient-to-br from-red-600 to-red-700 rounded-xl shadow-lg flex items-center justify-center">
                <div className="w-12 h-12 bg-white rounded-lg flex items-center justify-center">
                  <div className="w-6 h-6 bg-gradient-to-br from-red-500 to-red-600 rounded-full relative">
                    <div className="absolute w-2 h-2 bg-white rounded-full top-1 left-1"></div>
                  </div>
                </div>
              </div>
            </div>
                  onError={() => setImageError(true)}
                />
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
                <Badge className={`bg-gradient-to-r ${getEventTypeGradient()} text-white border-0`}>
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

        {/* Content Section - Simplified */}
        <div className="px-6 pb-6 space-y-4">
          {/* Event Type Info */}
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <MapPin className="w-4 h-4" />
            <span>{event.activeRegions.length} regiões ativas</span>
          </div>
        </div>

        {/* Action Footer */}
        <div className="px-6 pb-6">
          <div className="flex items-center justify-between p-4 bg-gray-50 dark:bg-slate-800/50 rounded-xl">
            <div className="flex gap-2">
              {event.sourceUrl && (
                <Button variant="outline" size="sm" asChild className="hover:bg-blue-50 dark:hover:bg-blue-900/20">
                  <a href={event.sourceUrl} target="_blank" rel="noopener noreferrer">
                    <ExternalLink className="w-4 h-4 mr-1" />
                    Ver Detalhes
                  </a>
                </Button>
              )}
              {onShare && (
                <Button variant="outline" size="sm" onClick={() => onShare(event)} className="hover:bg-green-50 dark:hover:bg-green-900/20">
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
                className={`${
                  isNotificationEnabled 
                    ? "bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white" 
                    : "hover:bg-orange-50 dark:hover:bg-orange-900/20"
                }`}
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
