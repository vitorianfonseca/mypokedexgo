"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Search, Filter, X } from "lucide-react"

interface FilterBarProps {
  onFilterChange: (filters: FilterState) => void
}

export interface FilterState {
  search: string
  generation: string
  type: string
  status: string
}

export function FilterBar({ onFilterChange }: FilterBarProps) {
  const [filters, setFilters] = useState<FilterState>({
    search: "",
    generation: "all",
    type: "all",
    status: "all",
  })

  const updateFilter = (key: keyof FilterState, value: string) => {
    const newFilters = { ...filters, [key]: value }
    setFilters(newFilters)
    onFilterChange(newFilters)
  }

  const clearFilters = () => {
    const clearedFilters = {
      search: "",
      generation: "all",
      type: "all",
      status: "all",
    }
    setFilters(clearedFilters)
    onFilterChange(clearedFilters)
  }

  const hasActiveFilters =
    filters.search || filters.generation !== "all" || filters.type !== "all" || filters.status !== "all"

  return (
    <div className="space-y-4 p-4 bg-card rounded-lg border">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Filter className="w-5 h-5" />
          <h3 className="font-semibold">Filtros</h3>
        </div>
        {hasActiveFilters && (
          <Button variant="ghost" size="sm" onClick={clearFilters}>
            <X className="w-4 h-4 mr-2" />
            Limpar
          </Button>
        )}
      </div>

      {/* Search */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
        <Input
          placeholder="Procurar Pokémon..."
          value={filters.search}
          onChange={(e) => updateFilter("search", e.target.value)}
          className="pl-10"
        />
      </div>

      {/* Filter Selects */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Select value={filters.generation} onValueChange={(value) => updateFilter("generation", value)}>
          <SelectTrigger>
            <SelectValue placeholder="Geração" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Todas as Gerações</SelectItem>
            <SelectItem value="1">Geração I (Kanto)</SelectItem>
            <SelectItem value="2">Geração II (Johto)</SelectItem>
            <SelectItem value="3">Geração III (Hoenn)</SelectItem>
            <SelectItem value="4">Geração IV (Sinnoh)</SelectItem>
            <SelectItem value="5">Geração V (Unova)</SelectItem>
            <SelectItem value="6">Geração VI (Kalos)</SelectItem>
            <SelectItem value="7">Geração VII (Alola)</SelectItem>
            <SelectItem value="8">Geração VIII (Galar)</SelectItem>
            <SelectItem value="9">Geração IX (Paldea)</SelectItem>
          </SelectContent>
        </Select>

        <Select value={filters.type} onValueChange={(value) => updateFilter("type", value)}>
          <SelectTrigger>
            <SelectValue placeholder="Tipo" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Todos os Tipos</SelectItem>
            <SelectItem value="Normal">Normal</SelectItem>
            <SelectItem value="Fire">Fogo</SelectItem>
            <SelectItem value="Water">Água</SelectItem>
            <SelectItem value="Electric">Elétrico</SelectItem>
            <SelectItem value="Grass">Planta</SelectItem>
            <SelectItem value="Ice">Gelo</SelectItem>
            <SelectItem value="Fighting">Lutador</SelectItem>
            <SelectItem value="Poison">Veneno</SelectItem>
            <SelectItem value="Ground">Terra</SelectItem>
            <SelectItem value="Flying">Voador</SelectItem>
            <SelectItem value="Psychic">Psíquico</SelectItem>
            <SelectItem value="Bug">Inseto</SelectItem>
            <SelectItem value="Rock">Pedra</SelectItem>
            <SelectItem value="Ghost">Fantasma</SelectItem>
            <SelectItem value="Dragon">Dragão</SelectItem>
            <SelectItem value="Dark">Sombrio</SelectItem>
            <SelectItem value="Steel">Aço</SelectItem>
            <SelectItem value="Fairy">Fada</SelectItem>
          </SelectContent>
        </Select>

        <Select value={filters.status} onValueChange={(value) => updateFilter("status", value)}>
          <SelectTrigger>
            <SelectValue placeholder="Estado" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Todos</SelectItem>
            <SelectItem value="caught">Apanhados</SelectItem>
            <SelectItem value="missing">Em Falta</SelectItem>
            <SelectItem value="shiny">Shiny</SelectItem>
            <SelectItem value="lucky">Lucky</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Active Filters */}
      {hasActiveFilters && (
        <div className="flex flex-wrap gap-2">
          {filters.search && <Badge variant="secondary">Busca: {filters.search}</Badge>}
          {filters.generation !== "all" && <Badge variant="secondary">Geração {filters.generation}</Badge>}
          {filters.type !== "all" && <Badge variant="secondary">Tipo: {filters.type}</Badge>}
          {filters.status !== "all" && (
            <Badge variant="secondary">
              {filters.status === "caught"
                ? "Apanhados"
                : filters.status === "missing"
                  ? "Em Falta"
                  : filters.status === "shiny"
                    ? "Shiny"
                    : "Lucky"}
            </Badge>
          )}
        </div>
      )}
    </div>
  )
}
