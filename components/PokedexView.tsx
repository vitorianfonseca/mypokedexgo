"use client"

import { useState, useMemo, useCallback, useEffect, useRef } from "react"
import { useAuth } from "@/contexts/AuthContext"
import { usePokedex } from "@/contexts/PokedexContext"
import { PokemonCard } from "@/components/PokemonCard"
import { FilterBar, type FilterState } from "@/components/FilterBar"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { pokemonData } from "@/data/pokemon"
import { Grid, List, BarChart3, ChevronDown, Loader2, ChevronLeft, ChevronRight, ChevronsLeft, ChevronsRight } from "lucide-react"
import { PokemonComparison } from "@/components/PokemonComparison"
import { useInfiniteScroll } from "@/hooks/useInfiniteScroll"

const ITEMS_PER_PAGE = 20
const INITIAL_LOAD = 40

export default function PokedexView() {
  const { isDemoMode } = useAuth()
  const { pokemonStatus, getStats } = usePokedex()
  const [filters, setFilters] = useState<FilterState>({
    search: "",
    generation: "all",
    type: "all",
    status: "all",
  })
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid")
  const [isComparisonMode, setIsComparisonMode] = useState(false)
  const [selectedForComparison, setSelectedForComparison] = useState<number[]>([])
  const [displayedCount, setDisplayedCount] = useState(INITIAL_LOAD)
  const [isLoading, setIsLoading] = useState(false)
  const [loadingMode, setLoadingMode] = useState<"infinite" | "pagination">("pagination")
  const [currentPage, setCurrentPage] = useState(1)
  const containerRef = useRef<HTMLDivElement>(null)

  // Simplified and smooth scroll to top function
  const scrollToTop = useCallback(() => {
    // Single smooth scroll method to avoid conflicts
    try {
      window.scrollTo({ 
        top: 0, 
        behavior: 'smooth' 
      })
    } catch (e) {
      // Simple fallback if smooth scroll is not supported
      window.scrollTo(0, 0)
    }
  }, [])

  // Simplified page navigation function
  const goToPage = useCallback(async (page: number) => {
    setIsLoading(true)
    setCurrentPage(page)
    
    // Single scroll call after a brief delay to let the state update
    setTimeout(() => {
      scrollToTop()
    }, 100)
    
    // Loading delay for better UX
    await new Promise(resolve => setTimeout(resolve, 300))
    setIsLoading(false)
  }, [scrollToTop])

  // Reset when filters change
  useEffect(() => {
    if (loadingMode === "infinite") {
      setDisplayedCount(INITIAL_LOAD)
    } else {
      setCurrentPage(1)
    }
    // Single scroll call with small delay
    setTimeout(scrollToTop, 50)
  }, [filters, loadingMode, scrollToTop])

  const loadMore = useCallback(async () => {
    setIsLoading(true)
    await new Promise(resolve => setTimeout(resolve, 500))
    setDisplayedCount(prev => prev + ITEMS_PER_PAGE)
    setIsLoading(false)
  }, [])

  const filteredPokemon = useMemo(() => {
    const filtered = pokemonData.filter((pokemon) => {
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

    // Return based on loading mode
    if (loadingMode === "infinite") {
      return filtered.slice(0, displayedCount)
    } else {
      // Pagination mode
      const startIndex = (currentPage - 1) * ITEMS_PER_PAGE
      const endIndex = startIndex + ITEMS_PER_PAGE
      return filtered.slice(startIndex, endIndex)
    }
  }, [pokemonData, filters, pokemonStatus, displayedCount, loadingMode, currentPage])

  const totalFilteredCount = useMemo(() => {
    return pokemonData.filter((pokemon) => {
      if (filters.search && !pokemon.name.toLowerCase().includes(filters.search.toLowerCase())) {
        return false
      }
      if (filters.generation !== "all" && pokemon.generation !== Number.parseInt(filters.generation)) {
        return false
      }
      if (filters.type !== "all" && !pokemon.types.includes(filters.type)) {
        return false
      }
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
    }).length
  }, [pokemonData, filters, pokemonStatus])

  // Pagination calculations
  const totalPages = Math.ceil(totalFilteredCount / ITEMS_PER_PAGE)
  const hasMore = displayedCount < totalFilteredCount
  const hasPrevPage = currentPage > 1
  const hasNextPage = currentPage < totalPages

  // Infinite scroll setup (only when not in pagination mode and search is not active)
  const enableInfiniteScroll = loadingMode === "infinite" && !filters.search
  const { isFetching } = useInfiniteScroll(
    hasMore && enableInfiniteScroll,
    isLoading,
    loadMore,
    100
  )

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
    <div ref={containerRef}>
      <div className="container mx-auto px-4 py-2">
        {/* Page Header */}
        <div className="flex items-center justify-between mb-4">
          <div>
            <h1 className="text-3xl font-bold text-white">Pokédex</h1>
            <p className="text-gray-300">
              {stats.totalCaught} de {pokemonData.length} Pokémons capturados • {totalFilteredCount} mostrados
            </p>
          </div>

          <div className="flex items-center gap-4">
            {/* Loading Mode Toggle */}
            <div className="flex items-center gap-1 mr-4">
              <Button
                variant={loadingMode === "pagination" ? "default" : "outline"}
                size="sm"
                onClick={() => setLoadingMode("pagination")}
                className="text-xs"
              >
                Páginas
              </Button>
              <Button
                variant={loadingMode === "infinite" ? "default" : "outline"}
                size="sm"
                onClick={() => setLoadingMode("infinite")}
                className="text-xs"
              >
                Scroll Infinito
              </Button>
            </div>

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
            <Button 
              variant={viewMode === "grid" ? "default" : "outline"} 
              size="sm" 
              onClick={() => setViewMode("grid")}
            >
              <Grid className="w-4 h-4" />
            </Button>
            <Button 
              variant={viewMode === "list" ? "default" : "outline"} 
              size="sm" 
              onClick={() => setViewMode("list")}
            >
              <List className="w-4 h-4" />
            </Button>
          </div>
        </div>

        {/* Filters */}
        <div className="mb-4">
          <FilterBar onFilterChange={setFilters} />
        </div>

        {/* Pokemon Grid */}
        <div
          className={`grid gap-4 ${
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

        {/* Load More Button (Infinite Scroll Mode) */}
        {loadingMode === "infinite" && hasMore && !enableInfiniteScroll && (
          <div className="flex justify-center mt-8">
            <Button
              onClick={loadMore}
              disabled={isLoading}
              size="lg"
              className="group hover:scale-105 transition-transform"
            >
              {isLoading ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Carregando...
                </>
              ) : (
                <>
                  <ChevronDown className="w-4 h-4 mr-2 group-hover:translate-y-0.5 transition-transform" />
                  Carregar Mais ({Math.min(ITEMS_PER_PAGE, totalFilteredCount - displayedCount)})
                </>
              )}
            </Button>
          </div>
        )}

        {/* Pagination Controls */}
        {loadingMode === "pagination" && totalPages > 1 && (
          <div className="flex flex-col items-center mt-8 space-y-3">
            {/* Page Info */}
            <div className="text-sm text-gray-300">
              Página {currentPage} de {totalPages} • {totalFilteredCount} Pokémon{totalFilteredCount !== 1 ? 's' : ''} no total
            </div>
            
            {/* Pagination Buttons */}
            <div className="flex items-center space-x-2">
              {/* First Page */}
              <Button
                variant="outline"
                size="sm"
                onClick={() => goToPage(1)}
                disabled={!hasPrevPage || isLoading}
                className="hover:scale-105 transition-transform"
              >
                <ChevronsLeft className="w-4 h-4" />
              </Button>
              
              {/* Previous Page */}
              <Button
                variant="outline"
                size="sm"
                onClick={() => goToPage(currentPage - 1)}
                disabled={!hasPrevPage || isLoading}
                className="hover:scale-105 transition-transform"
              >
                <ChevronLeft className="w-4 h-4" />
                Anterior
              </Button>
              
              {/* Page Numbers */}
              <div className="flex items-center space-x-1">
                {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                  let pageNum: number
                  if (totalPages <= 5) {
                    pageNum = i + 1
                  } else if (currentPage <= 3) {
                    pageNum = i + 1
                  } else if (currentPage >= totalPages - 2) {
                    pageNum = totalPages - 4 + i
                  } else {
                    pageNum = currentPage - 2 + i
                  }
                  
                  return (
                    <Button
                      key={pageNum}
                      variant={pageNum === currentPage ? "default" : "outline"}
                      size="sm"
                      onClick={() => goToPage(pageNum)}
                      disabled={isLoading}
                      className="w-10 h-10 hover:scale-105 transition-transform"
                    >
                      {pageNum}
                    </Button>
                  )
                })}
              </div>
              
              {/* Next Page */}
              <Button
                variant="outline"
                size="sm"
                onClick={() => goToPage(currentPage + 1)}
                disabled={!hasNextPage || isLoading}
                className="hover:scale-105 transition-transform"
              >
                Próxima
                <ChevronRight className="w-4 h-4" />
              </Button>
              
              {/* Last Page */}
              <Button
                variant="outline"
                size="sm"
                onClick={() => goToPage(totalPages)}
                disabled={!hasNextPage || isLoading}
                className="hover:scale-105 transition-transform"
              >
                <ChevronsRight className="w-4 h-4" />
              </Button>
            </div>
            
            {/* Loading indicator for pagination */}
            {isLoading && (
              <div className="flex items-center space-x-2 text-muted-foreground">
                <Loader2 className="w-4 h-4 animate-spin" />
                <span>Carregando página...</span>
              </div>
            )}
          </div>
        )}

        {/* Infinite Scroll Loading Indicator */}
        {(isLoading || isFetching) && enableInfiniteScroll && hasMore && (
          <div className="flex justify-center mt-6 mb-3">
            <div className="flex items-center space-x-2 text-muted-foreground">
              <Loader2 className="w-4 h-4 animate-spin" />
              <span>Carregando mais Pokémon...</span>
            </div>
          </div>
        )}

        {/* Infinite Scroll Info */}
        {enableInfiniteScroll && displayedCount < totalFilteredCount && !isLoading && !isFetching && (
          <div className="text-center mt-6 text-sm text-muted-foreground">
            <p>Role para baixo para carregar mais Pokémon automaticamente</p>
          </div>
        )}

        {totalFilteredCount === 0 && (
          <div className="text-center py-16">
            <p className="text-xl text-muted-foreground">Nenhum Pokémon encontrado com os filtros aplicados</p>
          </div>
        )}
      </div>
    </div>
  )
}
