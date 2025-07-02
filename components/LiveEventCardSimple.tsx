"use client"

import { useState } from "react"
import Image from "next/image"
import { Card, CardContent } from "@/components/ui/card"
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
      if (days > 0) {
        return `Em ${days}d ${hours}h`
      }
      return `Em ${hours}h`
    }

    return "Encerrado"
  }

  const getProgress = () => {
    if (!event.isActive) return event.isUpcoming ? 0 : 100

    const now = new Date()
    const start = new Date(event.startDate)
    const end = new Date(event.endDate)
    const total = end.getTime() - start.getTime()
    const elapsed = now.getTime() - start.getTime()
    return Math.min(Math.max((elapsed / total) * 100, 0), 100)
  }

  const getStatusIcon = () => {
    if (event.isActive) return <Zap className="w-4 h-4 text-green-500" />
    if (event.isUpcoming) return <Clock className="w-4 h-4 text-blue-500" />
    return <Calendar className="w-4 h-4 text-gray-500" />
  }

  const getStatusBadge = () => {
    if (event.isActive) {
      return <Badge className="bg-green-500 text-white">Ativo</Badge>
    }
    if (event.isUpcoming) {
      return <Badge className="bg-blue-500 text-white">Em Breve</Badge>
    }
    return <Badge variant="secondary">Encerrado</Badge>
  }

  const getPriorityIcon = () => {
    switch (event.priority) {
      case "high":
        return <Crown className="w-4 h-4 text-yellow-500" />
      case "medium":
        return <Star className="w-4 h-4 text-orange-500" />
      default:
        return <Sparkles className="w-4 h-4 text-gray-500" />
    }
  }

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return date.toLocaleDateString("pt-PT", {
      day: "2-digit",
      month: "short",
      hour: "2-digit",
      minute: "2-digit",
    })
  }

  return (
    <Card className="overflow-hidden border-0 shadow-lg hover:shadow-xl transition-all duration-300 bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm">
      <div className="relative">
        {/* Header with Image */}
        <div className="relative h-48 bg-gradient-to-br from-blue-500 via-purple-500 to-pink-500">
          {event.imageUrl && !imageError ? (
            <Image
              src={event.imageUrl}
              alt={event.name}
              fill
              className="object-cover"
              onError={() => setImageError(true)}
            />
          ) : (
            <div className="flex items-center justify-center h-full">
              <Gift className="w-16 h-16 text-white/80" />
            </div>
          )}
          
          {/* Status Badge */}
          <div className="absolute top-4 left-4">
            {getStatusBadge()}
          </div>

          {/* Priority & Type */}
          <div className="absolute top-4 right-4 flex gap-2">
            <div className="p-2 bg-white/20 backdrop-blur-sm rounded-lg">
              {getPriorityIcon()}
            </div>
          </div>

          {/* Progress Bar for Active Events */}
          {event.isActive && (
            <div className="absolute bottom-0 left-0 right-0 h-1 bg-white/30">
              <Progress value={getProgress()} className="h-full" />
            </div>
          )}
        </div>

        {/* Content */}
        <CardContent className="p-6 space-y-4">
          {/* Title & Description */}
          <div>
            <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">
              {event.name}
            </h3>
            <p className="text-muted-foreground text-sm line-clamp-2">
              {event.description}
            </p>
          </div>

          {/* Time Info */}
          <div className="flex items-center gap-2 text-sm">
            {getStatusIcon()}
            <span className="font-medium">{getTimeRemaining()}</span>
          </div>

          {/* Event Details */}
          <div className="space-y-2 text-sm text-muted-foreground">
            <div className="flex items-center gap-2">
              <Calendar className="w-4 h-4" />
              <span>
                {formatDate(event.startDate)} - {formatDate(event.endDate)}
              </span>
            </div>
            
            <div className="flex items-center gap-2">
              <MapPin className="w-4 h-4" />
              <span>{event.activeRegions.length} regiões ativas</span>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex gap-2 pt-4">
            <Button
              variant="outline"
              size="sm"
              onClick={() => onShare?.(event)}
              className="flex-1"
            >
              <Share2 className="w-4 h-4 mr-2" />
              Partilhar
            </Button>
            
            <Button
              variant={isNotificationEnabled ? "default" : "outline"}
              size="sm"
              onClick={() => onToggleNotification?.(event.id)}
              className="flex-1"
            >
              {isNotificationEnabled ? (
                <Bell className="w-4 h-4 mr-2" />
              ) : (
                <BellOff className="w-4 h-4 mr-2" />
              )}
              {isNotificationEnabled ? "Notificando" : "Notificar"}
            </Button>
          </div>
        </CardContent>
      </div>
    </Card>
  )
}
