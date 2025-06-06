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
      return `-${hours}h ${minutes}m restantes`
    }

    if (event.isUpcoming) {
      const timeToStart = start.getTime() - now.getTime()
      const days = Math.floor(timeToStart / (1000 * 60 * 60 * 24))
      const hours = Math.floor((timeToStart % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60))

      if (days > 0) return `Começa em -${days}d ${hours}h`
      return `Começa em -${hours}h`
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

  const getEventTypeColor = () => {
    switch (event.type) {
      case "community_day":
        return "bg-green-500"
      case "raid_hour":
        return "bg-red-500"
      case "spotlight_hour":
        return "bg-yellow-500"
      case "go_fest":
        return "bg-purple-500"
      default:
        return "bg-blue-500"
    }
  }

  const getPriorityColor = () => {
    switch (event.priority) {
      case "critical":
        return "border-red-500 bg-red-50 dark:bg-red-950"
      case "high":
        return "border-orange-500 bg-orange-50 dark:bg-orange-950"
      case "medium":
        return "border-yellow-500 bg-yellow-50 dark:bg-yellow-950"
      default:
        return "border-gray-200"
    }
  }

  // Formatação de data para o estilo do screenshot
  const formatDateRange = () => {
    const start = new Date(event.startDate)
    const end = new Date(event.endDate)

    return `${start.getDate()}/${start.getMonth() + 1}, ${start.getHours()}:00 - ${end.getDate()}/${end.getMonth() + 1}, ${end.getHours()}:00`
  }

  return (
    <Card className={`relative overflow-hidden transition-all hover:shadow-lg ${getPriorityColor()}`}>
      <div className="flex flex-col">
        {/* Header com badges de status */}
        <div className="flex justify-between items-start p-4">
          <div className="flex items-center gap-3">
            <div className="w-16 h-16 bg-white dark:bg-gray-800 rounded-lg overflow-hidden">
              <Image
                src={event.imageUrl || "/images/events/default-event.jpg"}
                alt={event.name}
                width={64}
                height={64}
                className="object-cover w-full h-full"
                onError={() => setImageError(true)}
              />
            </div>
            <div>
              <h3 className="text-lg font-bold">{event.name}</h3>
              <p className="text-sm text-muted-foreground">{event.description}</p>
              <div className="flex items-center gap-2 mt-1 text-sm text-muted-foreground">
                <Calendar className="w-4 h-4" />
                <span>{formatDateRange()}</span>
              </div>
            </div>
          </div>

          <div className="flex flex-col gap-1">
            {event.isActive && (
              <Badge className="bg-green-500 text-white">
                <div className="w-2 h-2 bg-white rounded-full mr-1" />
                AO VIVO
              </Badge>
            )}
            {event.isUpcoming && (
              <Badge variant="outline" className="border-blue-500 text-blue-600">
                <Clock className="w-3 h-3 mr-1" />
                EM BREVE
              </Badge>
            )}
            <Badge className={`${getEventTypeColor()} text-white`}>
              {getEventTypeIcon()}
              <span className="ml-1 capitalize">{event.type.replace("_", " ")}</span>
            </Badge>
          </div>
        </div>

        {/* Tempo restante e barra de progresso */}
        <div className="px-4 pb-2">
          <div className="flex justify-between text-xs text-muted-foreground mb-1">
            <span>Progresso do Evento</span>
            <span>{getTimeRemaining()}</span>
          </div>
          <Progress value={getEventProgress()} className="h-2" />
        </div>

        {/* Conteúdo principal */}
        <CardContent className="space-y-4 pt-4">
          {/* Pokémons em Destaque */}
          {event.featuredPokemon.length > 0 && (
            <div>
              <h4 className="font-semibold text-sm mb-2 flex items-center gap-2">
                <Star className="w-4 h-4" />
                Pokémons em Destaque
              </h4>
              <div className="flex gap-2 flex-wrap">
                {event.featuredPokemon.slice(0, 6).map((pokemon) => (
                  <div key={pokemon.id} className="relative">
                    <div className="w-12 h-12 bg-white dark:bg-gray-800 rounded-lg flex items-center justify-center border">
                      <Image
                        src={pokemon.imageUrl || "/placeholder.svg"}
                        alt={pokemon.name}
                        width={32}
                        height={32}
                        className="pixelated"
                      />
                    </div>
                    {pokemon.isShiny && (
                      <div className="absolute -top-1 -right-1 w-4 h-4 bg-yellow-400 rounded-full flex items-center justify-center">
                        <Sparkles className="w-2 h-2 text-white" />
                      </div>
                    )}
                    {pokemon.isLegendary && (
                      <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-purple-500 rounded-full flex items-center justify-center">
                        <Crown className="w-2 h-2 text-white" />
                      </div>
                    )}
                  </div>
                ))}
                {event.featuredPokemon.length > 6 && (
                  <div className="w-12 h-12 bg-muted rounded-lg flex items-center justify-center text-xs font-medium">
                    +{event.featuredPokemon.length - 6}
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Bônus do Evento */}
          {event.bonuses.length > 0 && (
            <div>
              <h4 className="font-semibold text-sm mb-2 flex items-center gap-2">
                <Gift className="w-4 h-4" />
                Bônus do Evento
              </h4>
              <div className="grid grid-cols-2 gap-2">
                {event.bonuses.map((bonus, index) => (
                  <Badge key={index} variant="secondary" className="justify-start">
                    {bonus.multiplier > 1 ? `${bonus.multiplier}x` : ""} {bonus.description}
                  </Badge>
                ))}
              </div>
            </div>
          )}

          {/* Regiões Ativas */}
          {event.activeRegions.length > 0 && (
            <div>
              <h4 className="font-semibold text-sm mb-2 flex items-center gap-2">
                <MapPin className="w-4 h-4" />
                Regiões Ativas
              </h4>
              <div className="flex gap-2 flex-wrap">
                {event.activeRegions.slice(0, 4).map((region) => (
                  <Badge
                    key={region.name}
                    variant={region.isHighActivity ? "default" : "outline"}
                    className={region.isHighActivity ? "bg-green-600" : ""}
                  >
                    {region.name}
                    {region.isHighActivity && <Zap className="w-3 h-3 ml-1" />}
                  </Badge>
                ))}
                {event.activeRegions.length > 4 && (
                  <Badge variant="outline">+{event.activeRegions.length - 4} mais</Badge>
                )}
              </div>
            </div>
          )}

          <Separator />

          {/* Ações */}
          <div className="flex items-center justify-between">
            <div className="flex gap-2">
              {event.sourceUrl && (
                <Button variant="outline" size="sm" asChild>
                  <a href={event.sourceUrl} target="_blank" rel="noopener noreferrer">
                    <ExternalLink className="w-4 h-4 mr-2" />
                    Fonte
                  </a>
                </Button>
              )}
              <Button variant="outline" size="sm" onClick={() => onShare?.(event)}>
                <Share2 className="w-4 h-4 mr-2" />
                Partilhar
              </Button>
            </div>

            <Button
              variant={isNotificationEnabled ? "default" : "outline"}
              size="sm"
              onClick={() => onToggleNotification?.(event.id)}
            >
              {isNotificationEnabled ? (
                <>
                  <BellOff className="w-4 h-4 mr-2" />
                  Desativar
                </>
              ) : (
                <>
                  <Bell className="w-4 h-4 mr-2" />
                  Notificar
                </>
              )}
            </Button>
          </div>
        </CardContent>
      </div>
    </Card>
  )
}
