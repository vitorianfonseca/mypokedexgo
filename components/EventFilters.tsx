"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Search, Filter, X, Calendar, MapPin, Star } from "lucide-react"

interface EventFiltersProps {
  onFilterChange: (filters: EventFilterState) => void
}

export interface EventFilterState {
  search: string
  type: string
  status: string
  priority: string
  region: string
}

export function EventFilters({ onFilterChange }: EventFiltersProps) {
  const [filters, setFilters] = useState<EventFilterState>({
    search: "",
    type: "all",
    status: "all",
    priority: "all",
    region: "all",
  })

  const updateFilter = (key: keyof EventFilterState, value: string) => {
    const newFilters = { ...filters, [key]: value }
    setFilters(newFilters)
    onFilterChange(newFilters)
  }

  const clearFilters = () => {
    const clearedFilters = {
      search: "",
      type: "all",
      status: "all",
      priority: "all",
      region: "all",
    }
    setFilters(clearedFilters)
    onFilterChange(clearedFilters)
  }

  const hasActiveFilters =
    filters.search ||
    filters.type !== "all" ||
    filters.status !== "all" ||
    filters.priority !== "all" ||
    filters.region !== "all"

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2">
            <Filter className="w-5 h-5" />
            Filtros de Eventos
          </CardTitle>
          {hasActiveFilters && (
            <Button variant="ghost" size="sm" onClick={clearFilters}>
              <X className="w-4 h-4 mr-2" />
              Limpar
            </Button>
          )}
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Search */}
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input
            placeholder="Procurar eventos..."
            value={filters.search}
            onChange={(e) => updateFilter("search", e.target.value)}
            className="pl-10"
          />
        </div>

        {/* Filter Selects */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <Select value={filters.type} onValueChange={(value) => updateFilter("type", value)}>
            <SelectTrigger>
              <SelectValue placeholder="Tipo de Evento" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Todos os Tipos</SelectItem>
              <SelectItem value="community_day">Community Day</SelectItem>
              <SelectItem value="raid_hour">Raid Hour</SelectItem>
              <SelectItem value="spotlight_hour">Spotlight Hour</SelectItem>
              <SelectItem value="go_fest">GO Fest</SelectItem>
              <SelectItem value="research_day">Research Day</SelectItem>
              <SelectItem value="season">Temporada</SelectItem>
              <SelectItem value="special">Especial</SelectItem>
            </SelectContent>
          </Select>

          <Select value={filters.status} onValueChange={(value) => updateFilter("status", value)}>
            <SelectTrigger>
              <SelectValue placeholder="Estado" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Todos os Estados</SelectItem>
              <SelectItem value="active">Ao Vivo</SelectItem>
              <SelectItem value="upcoming">Em Breve</SelectItem>
              <SelectItem value="ended">Terminados</SelectItem>
            </SelectContent>
          </Select>

          <Select value={filters.priority} onValueChange={(value) => updateFilter("priority", value)}>
            <SelectTrigger>
              <SelectValue placeholder="Prioridade" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Todas as Prioridades</SelectItem>
              <SelectItem value="critical">Crítica</SelectItem>
              <SelectItem value="high">Alta</SelectItem>
              <SelectItem value="medium">Média</SelectItem>
              <SelectItem value="low">Baixa</SelectItem>
            </SelectContent>
          </Select>

          <Select value={filters.region} onValueChange={(value) => updateFilter("region", value)}>
            <SelectTrigger>
              <SelectValue placeholder="Região" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Todas as Regiões</SelectItem>
              <SelectItem value="global">Global</SelectItem>
              <SelectItem value="americas">Américas</SelectItem>
              <SelectItem value="europe">Europa</SelectItem>
              <SelectItem value="asia">Ásia</SelectItem>
              <SelectItem value="oceania">Oceania</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Active Filters */}
        {hasActiveFilters && (
          <div className="flex flex-wrap gap-2">
            {filters.search && <Badge variant="secondary">Busca: {filters.search}</Badge>}
            {filters.type !== "all" && (
              <Badge variant="secondary">
                <Calendar className="w-3 h-3 mr-1" />
                {filters.type.replace("_", " ")}
              </Badge>
            )}
            {filters.status !== "all" && (
              <Badge variant="secondary">
                <Star className="w-3 h-3 mr-1" />
                {filters.status === "active" ? "Ao Vivo" : filters.status === "upcoming" ? "Em Breve" : "Terminados"}
              </Badge>
            )}
            {filters.priority !== "all" && <Badge variant="secondary">Prioridade: {filters.priority}</Badge>}
            {filters.region !== "all" && (
              <Badge variant="secondary">
                <MapPin className="w-3 h-3 mr-1" />
                {filters.region}
              </Badge>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  )
}
