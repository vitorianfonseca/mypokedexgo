"use client"

import { useState, useEffect } from "react"
import Image from "next/image"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { type Pokemon, pokemonData, typeColors } from "@/data/pokemon"
import { usePokedex } from "@/contexts/PokedexContext"
import { 
  X, 
  BarChart3, 
  Crown, 
  Star, 
  TrendingUp, 
  TrendingDown, 
  Sparkles,
  Check,
  Moon,
  Shield,
  Search,
  Plus,
  Ruler,
  Weight,
  Target,
  Zap
} from "lucide-react"

interface ComparisonPokemon extends Pokemon {
  totalStats: number
}

interface PokemonComparisonProps {
  preSelectedIds?: number[]
  onClose?: () => void
}

export function PokemonComparison({ preSelectedIds = [], onClose }: PokemonComparisonProps = {}) {
  const { pokemonStatus } = usePokedex()
  const [selectedPokemon, setSelectedPokemon] = useState<ComparisonPokemon[]>([])
  const [isOpen, setIsOpen] = useState(false)
  const [searchTerm, setSearchTerm] = useState("")
  const [typeFilter, setTypeFilter] = useState("all")
  const [showAddDialog, setShowAddDialog] = useState(false)

  useEffect(() => {
    if (preSelectedIds.length > 0) {
      const preSelected = preSelectedIds
        .map((id) => pokemonData.find((p) => p.id === id))
        .filter((pokemon): pokemon is Pokemon => pokemon !== undefined)
        .map((pokemon) => ({
          ...pokemon,
          totalStats: Object.values(pokemon.stats).reduce((sum, stat) => sum + stat, 0),
        }))

      setSelectedPokemon(preSelected)
      setIsOpen(true)
    }
  }, [preSelectedIds])

  const addPokemon = (pokemon: Pokemon) => {
    if (selectedPokemon.length < 6 && !selectedPokemon.find(p => p.id === pokemon.id)) {
      const pokemonWithStats = {
        ...pokemon,
        totalStats: Object.values(pokemon.stats).reduce((sum, stat) => sum + stat, 0),
      }
      setSelectedPokemon([...selectedPokemon, pokemonWithStats])
    }
  }

  const filteredPokemon = pokemonData
    .filter(pokemon => {
      const matchesSearch = pokemon.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           pokemon.id.toString().includes(searchTerm)
      const matchesType = typeFilter === "all" || pokemon.types.includes(typeFilter)
      const notSelected = !selectedPokemon.find(p => p.id === pokemon.id)
      return matchesSearch && matchesType && notSelected
    })
    .slice(0, 20)

  // Get unique types for filter
  const availableTypes = Array.from(new Set(pokemonData.flatMap(p => p.types))).sort()

  const removePokemon = (pokemonId: number) => {
    setSelectedPokemon(selectedPokemon.filter((p) => p.id !== pokemonId))
  }

  const handleClose = () => {
    setIsOpen(false)
    if (onClose) onClose()
  }

  // Calcular máximos para as barras de progresso
  const maxStats =
    selectedPokemon.length > 0
      ? {
          hp: Math.max(...selectedPokemon.map((p) => p.stats.hp)),
          attack: Math.max(...selectedPokemon.map((p) => p.stats.attack)),
          defense: Math.max(...selectedPokemon.map((p) => p.stats.defense)),
          specialAttack: Math.max(...selectedPokemon.map((p) => p.stats.specialAttack)),
          specialDefense: Math.max(...selectedPokemon.map((p) => p.stats.specialDefense)),
          speed: Math.max(...selectedPokemon.map((p) => p.stats.speed)),
          total: Math.max(...selectedPokemon.map((p) => p.totalStats)),
        }
      : null

  const statLabels = {
    hp: "HP",
    attack: "Ataque",
    defense: "Defesa",
    specialAttack: "At. Especial",
    specialDefense: "Def. Especial",
    speed: "Velocidade",
  }

  const getStatComparison = (pokemon: ComparisonPokemon, statName: keyof typeof pokemon.stats) => {
    if (!maxStats) return "neutral"
    const value = pokemon.stats[statName]
    const max = maxStats[statName]

    if (value === max) return "highest"
    if (value < max * 0.7) return "lowest"
    return "neutral"
  }

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogTrigger asChild>
        <Button variant="outline" className="gap-2">
          <BarChart3 className="w-4 h-4" />
          {selectedPokemon.length > 0 ? `Ver Comparação (${selectedPokemon.length})` : "Comparar Pokémons"}
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-7xl max-h-[90vh] overflow-hidden">
        <DialogHeader className="flex flex-row items-center justify-between">
          <DialogTitle className="flex items-center gap-2">
            <BarChart3 className="w-5 h-5" />
            Comparação Avançada de Pokémon
          </DialogTitle>
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setShowAddDialog(true)}
              disabled={selectedPokemon.length >= 6}
            >
              <Plus className="w-4 h-4 mr-1" />
              Adicionar ({selectedPokemon.length}/6)
            </Button>
          </div>
        </DialogHeader>

        {selectedPokemon.length === 0 ? (
          <div className="text-center py-16">
            <BarChart3 className="w-24 h-24 text-muted-foreground mx-auto mb-6" />
            <h3 className="text-2xl font-semibold mb-2">Nenhum Pokémon Selecionado</h3>
            <p className="text-muted-foreground mb-6">
              Adicione Pokémons para começar a comparar suas estatísticas
            </p>
            <Button onClick={() => setShowAddDialog(true)}>
              <Plus className="w-4 h-4 mr-2" />
              Adicionar Primeiro Pokémon
            </Button>
          </div>
        ) : (
          <Tabs defaultValue="overview" className="space-y-6">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="overview">Visão Geral</TabsTrigger>
              <TabsTrigger value="stats">Estatísticas</TabsTrigger>
              <TabsTrigger value="details">Detalhes</TabsTrigger>
            </TabsList>

            <TabsContent value="overview" className="space-y-6">
              {/* Pokemon Cards Overview */}
              <div className="grid gap-4" style={{ gridTemplateColumns: `repeat(${Math.min(selectedPokemon.length, 3)}, 1fr)` }}>
                {selectedPokemon.map((pokemon) => {
                  const status = pokemonStatus[pokemon.id] || { caught: false, shiny: false, lucky: false, shadow: false, purified: false }
                  const primaryType = pokemon.types[0]
                  const typeColor = typeColors[primaryType] || "bg-gray-100"
                  
                  return (
                    <Card key={pokemon.id} className={`relative overflow-hidden border-2 ${status.caught ? `border-${primaryType.toLowerCase()}-400` : ''}`}>
                      <Button
                        variant="ghost"
                        size="sm"
                        className="absolute top-2 right-2 h-8 w-8 p-0 rounded-full bg-red-500 hover:bg-red-600 text-white z-10"
                        onClick={() => removePokemon(pokemon.id)}
                      >
                        <X className="w-4 h-4" />
                      </Button>

                      <CardHeader className={`pb-2 ${typeColor} text-white`}>
                        <div className="flex items-center justify-between">
                          <div>
                            <CardTitle className="text-xl">{pokemon.name}</CardTitle>
                            <p className="text-sm opacity-90">#{pokemon.id.toString().padStart(3, '0')}</p>
                          </div>
                          <div className="text-right">
                            <div className="text-2xl font-bold">{pokemon.totalStats}</div>
                            <div className="text-xs opacity-90">Total Base</div>
                          </div>
                        </div>
                      </CardHeader>

                      <CardContent className="p-4">
                        <div className="flex flex-col items-center space-y-4">
                          {/* Pokemon Image with Status Indicators */}
                          <div className="relative">
                            <div className="w-24 h-24 bg-white rounded-full flex items-center justify-center shadow-inner">
                              <Image
                                src={status.shiny ? pokemon.shinyImageUrl : pokemon.imageUrl}
                                alt={pokemon.name}
                                width={80}
                                height={80}
                                className="pixelated"
                              />
                            </div>
                            
                            {/* Status badges */}
                            <div className="absolute -top-1 -right-1 flex flex-col gap-1">
                              {status.caught && (
                                <div className="w-6 h-6 bg-green-500 rounded-full flex items-center justify-center">
                                  <Check className="w-3 h-3 text-white" />
                                </div>
                              )}
                              {status.shiny && (
                                <div className="w-6 h-6 bg-yellow-400 rounded-full flex items-center justify-center">
                                  <Sparkles className="w-3 h-3 text-white" />
                                </div>
                              )}
                              {status.lucky && (
                                <div className="w-6 h-6 bg-orange-500 rounded-full flex items-center justify-center">
                                  <Star className="w-3 h-3 text-white" />
                                </div>
                              )}
                            </div>
                          </div>

                          {/* Types */}
                          <div className="flex gap-1 flex-wrap justify-center">
                            {pokemon.types.map((type) => (
                              <Badge key={type} className={`${typeColors[type]} text-white text-xs px-3 py-1`}>
                                {type}
                              </Badge>
                            ))}
                          </div>

                          {/* Quick Stats */}
                          <div className="grid grid-cols-2 gap-4 w-full text-center">
                            <div className="flex items-center justify-center gap-1">
                              <Ruler className="w-4 h-4 text-muted-foreground" />
                              <span className="text-sm">{pokemon.height}m</span>
                            </div>
                            <div className="flex items-center justify-center gap-1">
                              <Weight className="w-4 h-4 text-muted-foreground" />
                              <span className="text-sm">{pokemon.weight}kg</span>
                            </div>
                          </div>

                          {/* Special Badges */}
                          <div className="flex gap-1 flex-wrap justify-center">
                            {pokemon.isLegendary && (
                              <Badge className="bg-yellow-500 text-white text-xs">
                                <Crown className="w-3 h-3 mr-1" />
                                Lendário
                              </Badge>
                            )}
                            {pokemon.isMythical && (
                              <Badge className="bg-purple-500 text-white text-xs">
                                <Star className="w-3 h-3 mr-1" />
                                Mítico
                              </Badge>
                            )}
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  )
                })}
              </div>
            </TabsContent>

            <TabsContent value="stats" className="space-y-6">
              {/* Stats Comparison */}
              <div className="space-y-4">
                {Object.entries(statLabels).map(([statKey, statLabel]) => (
                  <Card key={statKey}>
                    <CardHeader className="pb-3">
                      <CardTitle className="text-base flex items-center gap-2">
                        <Target className="w-4 h-4" />
                        {statLabel}
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="grid gap-4" style={{ gridTemplateColumns: `repeat(${selectedPokemon.length}, 1fr)` }}>
                        {selectedPokemon.map((pokemon) => {
                          const value = pokemon.stats[statKey as keyof typeof pokemon.stats]
                          const comparison = getStatComparison(pokemon, statKey as keyof typeof pokemon.stats)
                          const percentage = maxStats ? (value / maxStats[statKey as keyof typeof maxStats]) * 100 : 0

                          return (
                            <div key={pokemon.id} className="space-y-3">
                              <div className="flex items-center justify-between">
                                <span className="text-sm font-medium">{pokemon.name}</span>
                                <div className="flex items-center gap-2">
                                  <span
                                    className={`font-bold text-lg ${
                                      comparison === "highest"
                                        ? "text-green-600"
                                        : comparison === "lowest"
                                          ? "text-red-600"
                                          : "text-blue-600"
                                    }`}
                                  >
                                    {value}
                                  </span>
                                  {comparison === "highest" && <TrendingUp className="w-4 h-4 text-green-600" />}
                                  {comparison === "lowest" && <TrendingDown className="w-4 h-4 text-red-600" />}
                                </div>
                              </div>
                              <Progress
                                value={percentage}
                                className={`h-3 ${
                                  comparison === "highest"
                                    ? "[&>div]:bg-green-500"
                                    : comparison === "lowest"
                                      ? "[&>div]:bg-red-500"
                                      : "[&>div]:bg-blue-500"
                                }`}
                              />
                              <div className="text-xs text-muted-foreground text-center">
                                {percentage.toFixed(1)}% do máximo
                              </div>
                            </div>
                          )
                        })}
                      </div>
                    </CardContent>
                  </Card>
                ))}

                {/* Total Stats */}
                <Card>
                  <CardHeader className="pb-3">
                    <CardTitle className="text-base flex items-center gap-2">
                      <Zap className="w-4 h-4" />
                      Total de Estatísticas Base
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="grid gap-4" style={{ gridTemplateColumns: `repeat(${selectedPokemon.length}, 1fr)` }}>
                      {selectedPokemon.map((pokemon) => {
                        const percentage = maxStats ? (pokemon.totalStats / maxStats.total) * 100 : 0
                        const isHighest = pokemon.totalStats === maxStats?.total

                        return (
                          <div key={pokemon.id} className="space-y-3">
                            <div className="flex items-center justify-between">
                              <span className="text-sm font-medium">{pokemon.name}</span>
                              <div className="flex items-center gap-2">
                                <span className={`font-bold text-2xl ${isHighest ? "text-green-600" : "text-muted-foreground"}`}>
                                  {pokemon.totalStats}
                                </span>
                                {isHighest && <TrendingUp className="w-5 h-5 text-green-600" />}
                              </div>
                            </div>
                            <Progress value={percentage} className={`h-4 ${isHighest ? "[&>div]:bg-green-500" : "[&>div]:bg-blue-500"}`} />
                          </div>
                        )
                      })}
                    </div>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>

            <TabsContent value="details" className="space-y-6">
              {/* Detailed Information */}
              <div className="grid gap-6" style={{ gridTemplateColumns: `repeat(${Math.min(selectedPokemon.length, 2)}, 1fr)` }}>
                {selectedPokemon.map((pokemon) => (
                  <Card key={pokemon.id}>
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <Image src={pokemon.imageUrl} alt={pokemon.name} width={32} height={32} className="pixelated" />
                        {pokemon.name}
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="grid grid-cols-2 gap-4 text-sm">
                        <div>
                          <span className="font-medium">Categoria:</span>
                          <p className="text-muted-foreground">{pokemon.category}</p>
                        </div>
                        <div>
                          <span className="font-medium">Região:</span>
                          <p className="text-muted-foreground">{pokemon.region}</p>
                        </div>
                        <div>
                          <span className="font-medium">Geração:</span>
                          <p className="text-muted-foreground">{pokemon.generation}</p>
                        </div>
                        <div>
                          <span className="font-medium">Exp. Base:</span>
                          <p className="text-muted-foreground">{pokemon.baseExperience}</p>
                        </div>
                      </div>
                      
                      <div>
                        <span className="font-medium">Habilidades:</span>
                        <div className="flex flex-wrap gap-1 mt-1">
                          {pokemon.abilities.map((ability) => (
                            <Badge key={ability} variant="outline" className="text-xs">
                              {ability}
                            </Badge>
                          ))}
                          {pokemon.hiddenAbility && (
                            <Badge variant="secondary" className="text-xs">
                              {pokemon.hiddenAbility} (Oculta)
                            </Badge>
                          )}
                        </div>
                      </div>

                      <div>
                        <span className="font-medium">Descrição:</span>
                        <p className="text-sm text-muted-foreground mt-1">{pokemon.description}</p>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </TabsContent>
          </Tabs>
        )}

        {/* Add Pokemon Dialog */}
        <Dialog open={showAddDialog} onOpenChange={setShowAddDialog}>
          <DialogContent className="max-w-4xl max-h-[80vh] overflow-hidden">
            <DialogHeader>
              <DialogTitle>Adicionar Pokémon à Comparação</DialogTitle>
            </DialogHeader>
            
            <div className="space-y-4">
              {/* Search and Filters */}
              <div className="flex gap-4">
                <div className="flex-1 relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
                  <Input
                    placeholder="Buscar por nome ou número..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-9"
                  />
                </div>
                <Select value={typeFilter} onValueChange={setTypeFilter}>
                  <SelectTrigger className="w-48">
                    <SelectValue placeholder="Filtrar por tipo" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Todos os tipos</SelectItem>
                    {availableTypes.map((type) => (
                      <SelectItem key={type} value={type}>
                        {type}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Pokemon Grid */}
              <div className="grid grid-cols-6 gap-3 max-h-96 overflow-y-auto">
                {filteredPokemon.map((pokemon) => {
                  const status = pokemonStatus[pokemon.id] || { caught: false }
                  return (
                    <Card 
                      key={pokemon.id} 
                      className="cursor-pointer hover:shadow-md transition-shadow"
                      onClick={() => {
                        addPokemon(pokemon)
                        if (selectedPokemon.length >= 5) {
                          setShowAddDialog(false)
                        }
                      }}
                    >
                      <CardContent className="p-3 text-center">
                        <div className="relative">
                          <Image
                            src={pokemon.imageUrl}
                            alt={pokemon.name}
                            width={48}
                            height={48}
                            className="mx-auto mb-2"
                          />
                          {status.caught && (
                            <div className="absolute -top-1 -right-1 w-4 h-4 bg-green-500 rounded-full flex items-center justify-center">
                              <Check className="w-2 h-2 text-white" />
                            </div>
                          )}
                        </div>
                        <p className="text-xs font-medium">#{pokemon.id}</p>
                        <p className="text-xs text-muted-foreground truncate">{pokemon.name}</p>
                      </CardContent>
                    </Card>
                  )
                })}
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </DialogContent>
    </Dialog>
  )
}
