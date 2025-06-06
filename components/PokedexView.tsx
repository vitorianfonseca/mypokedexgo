"use client"

import { useState, useMemo } from "react"
import { useAuth } from "@/contexts/AuthContext"
import { usePokedex } from "@/contexts/PokedexContext"
import { PokemonCard } from "@/components/PokemonCard"
import { FilterBar, type FilterState } from "@/components/FilterBar"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { pokemonData } from "@/data/pokemon"
import { Grid, List, BarChart3 } from "lucide-react"
import { PokemonComparison } from "@/components/PokemonComparison"

export default function PokedexView() {
  const { isDemoMode } = useAuth()
  const { pokemonStatus, getStats, user } = usePokedex()
  const [filters, setFilters] = useState<FilterState>({
    search: "",
    generation: "all",
    type: "all",
    status: "all",
  })
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid")
  const [isComparisonMode, setIsComparisonMode] = useState(false)
  const [selectedForComparison, setSelectedForComparison] = useState<number[]>([])

  const filteredPokemon = useMemo(() => {
    return pokemonData.filter((pokemon) => {
      // Search filter
      if (filters.search && !pokemon.name.toLowerCase().includes(filters.search.toLowerCase())) {
        return false
      }

      // Generation filter
      if (filters.generation !== "all" && pokemon.generation !== Number.parseInt(filters.generation)) {
        return false
      }

      // Type filter
      if (filters.type !== "all" && !pokemon.types.includes(filters.type)) {
        return false
      }

      // Status filter
      if (filters.status !== "all") {
        const status = pokemonStatus[pokemon.id]
        switch (filters.status) {
          case "caught":
            return status?.caught === true
          case "missing":
            return !status?.caught
          case "shiny":
            return status?.shiny === true
          case "lucky":
            return status?.lucky === true
          default:
            return true
        }
      }

      return true
    })
  }, [pokemonData, filters, pokemonStatus])

  // Calcular estatísticas corretas
  const stats = getStats()

  const handlePokemonSelect = (pokemonId: number) => {
    if (!isComparisonMode) return

    if (selectedForComparison.includes(pokemonId)) {
      setSelectedForComparison(selectedForComparison.filter((id) => id !== pokemonId))
    } else if (selectedForComparison.length < 4) {
      setSelectedForComparison([...selectedForComparison, pokemonId])
    }
  }

  return (
    <div>
      <div className="container mx-auto px-4 py-8">
        {/* Page Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold">Pokédex</h1>
            <p className="text-muted-foreground">
              {stats.totalCaught} de {pokemonData.length} Pokémons capturados • {filteredPokemon.length} mostrados
            </p>
          </div>

          <div className="flex items-center gap-2">
            <div className="flex items-center gap-2">
              <Button
                variant={isComparisonMode ? "default" : "outline"}
                size="sm"
                onClick={() => {
                  setIsComparisonMode(!isComparisonMode)
                  if (!isComparisonMode) {
                    setSelectedForComparison([])
                  }
                }}
              >
                <BarChart3 className="w-4 h-4 mr-2" />
                {isComparisonMode ? "Sair da Comparação" : "Modo Comparação"}
                {selectedForComparison.length > 0 && (
                  <Badge variant="secondary" className="ml-2">
                    {selectedForComparison.length}
                  </Badge>
                )}
              </Button>

              {isComparisonMode && selectedForComparison.length >= 2 && (
                <PokemonComparison
                  preSelectedIds={selectedForComparison}
                  onClose={() => {
                    setIsComparisonMode(false)
                    setSelectedForComparison([])
                  }}
                />
              )}
            </div>
            <Button variant={viewMode === "grid" ? "default" : "outline"} size="sm" onClick={() => setViewMode("grid")}>
              <Grid className="w-4 h-4" />
            </Button>
            <Button variant={viewMode === "list" ? "default" : "outline"} size="sm" onClick={() => setViewMode("list")}>
              <List className="w-4 h-4" />
            </Button>
          </div>
        </div>

        {/* Filters */}
        <div className="mb-8">
          <FilterBar onFilterChange={setFilters} />
        </div>

        {/* Pokemon Grid */}
        <div
          className={`grid gap-6 ${
            viewMode === "grid"
              ? "grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5"
              : "grid-cols-1 md:grid-cols-2 lg:grid-cols-3"
          }`}
        >
          {filteredPokemon.map((pokemon) => (
            <PokemonCard
              key={pokemon.id}
              pokemon={pokemon}
              isComparisonMode={isComparisonMode}
              isSelectedForComparison={selectedForComparison.includes(pokemon.id)}
              onComparisonSelect={() => handlePokemonSelect(pokemon.id)}
            />
          ))}
        </div>

        {filteredPokemon.length === 0 && (
          <div className="text-center py-16">
            <p className="text-xl text-muted-foreground">Nenhum Pokémon encontrado com os filtros aplicados</p>
          </div>
        )}
      </div>
    </div>
  )
}
