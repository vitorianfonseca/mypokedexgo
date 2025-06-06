"use client"

import { useState, useEffect } from "react"
import Image from "next/image"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { type Pokemon, pokemonData, typeColors } from "@/data/pokemon"
import { X, BarChart3, Crown, Star, TrendingUp, TrendingDown } from "lucide-react"

interface ComparisonPokemon extends Pokemon {
  totalStats: number
}

interface PokemonComparisonProps {
  preSelectedIds?: number[]
  onClose?: () => void
}

export function PokemonComparison({ preSelectedIds = [], onClose }: PokemonComparisonProps = {}) {
  const [selectedPokemon, setSelectedPokemon] = useState<ComparisonPokemon[]>([])
  const [isOpen, setIsOpen] = useState(false)

  useEffect(() => {
    if (preSelectedIds.length > 0) {
      const preSelected = preSelectedIds
        .map((id) => pokemonData.find((p) => p.id === id))
        .filter(Boolean)
        .map((pokemon) => ({
          ...pokemon,
          totalStats: Object.values(pokemon.stats).reduce((sum, stat) => sum + stat, 0),
        }))

      setSelectedPokemon(preSelected)
      setIsOpen(true)
    }
  }, [preSelectedIds])

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

  if (selectedPokemon.length === 0) {
    return (
      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogTrigger asChild>
          <Button variant="outline" className="gap-2">
            <BarChart3 className="w-4 h-4" />
            Comparar Pokémons
          </Button>
        </DialogTrigger>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Comparação de Pokémons</DialogTitle>
          </DialogHeader>
          <div className="text-center py-8">
            <BarChart3 className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
            <p className="text-muted-foreground">Selecione Pokémons no modo comparação para começar</p>
          </div>
        </DialogContent>
      </Dialog>
    )
  }

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogTrigger asChild>
        <Button variant="outline" className="gap-2">
          <BarChart3 className="w-4 h-4" />
          Ver Comparação ({selectedPokemon.length})
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-6xl max-h-[85vh] overflow-hidden">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <BarChart3 className="w-5 h-5" />
            Comparação de Estatísticas
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          {/* Pokemon Headers */}
          <div className="grid gap-6" style={{ gridTemplateColumns: `repeat(${selectedPokemon.length}, 1fr)` }}>
            {selectedPokemon.map((pokemon) => (
              <Card key={pokemon.id} className="relative">
                <Button
                  variant="ghost"
                  size="sm"
                  className="absolute -top-2 -right-2 h-6 w-6 p-0 rounded-full bg-red-500 hover:bg-red-600 text-white z-10"
                  onClick={() => removePokemon(pokemon.id)}
                >
                  <X className="w-3 h-3" />
                </Button>
                <CardContent className="p-4 text-center">
                  <Image
                    src={pokemon.imageUrl || "/placeholder.svg"}
                    alt={pokemon.name}
                    width={80}
                    height={80}
                    className="pixelated mx-auto mb-3"
                  />
                  <div className="space-y-2">
                    <h3 className="font-bold">{pokemon.name}</h3>
                    <p className="text-sm text-muted-foreground">#{pokemon.id}</p>
                    <div className="flex gap-1 justify-center flex-wrap">
                      {pokemon.types.map((type) => (
                        <Badge key={type} className={`${typeColors[type]} text-white text-xs px-2 py-1`}>
                          {type}
                        </Badge>
                      ))}
                    </div>
                    <div className="flex gap-1 justify-center">
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
            ))}
          </div>

          {/* Stats Comparison */}
          <div className="space-y-4">
            {Object.entries(statLabels).map(([statKey, statLabel]) => (
              <div key={statKey} className="space-y-2">
                <h4 className="font-medium text-center">{statLabel}</h4>
                <div className="grid gap-4" style={{ gridTemplateColumns: `repeat(${selectedPokemon.length}, 1fr)` }}>
                  {selectedPokemon.map((pokemon) => {
                    const value = pokemon.stats[statKey as keyof typeof pokemon.stats]
                    const comparison = getStatComparison(pokemon, statKey as keyof typeof pokemon.stats)
                    const percentage = maxStats ? (value / maxStats[statKey as keyof typeof maxStats]) * 100 : 0

                    return (
                      <div key={pokemon.id} className="space-y-2">
                        <div className="flex justify-between items-center">
                          <span
                            className={`font-bold ${
                              comparison === "highest"
                                ? "text-green-600"
                                : comparison === "lowest"
                                  ? "text-red-600"
                                  : "text-muted-foreground"
                            }`}
                          >
                            {value}
                          </span>
                          {comparison === "highest" && <TrendingUp className="w-4 h-4 text-green-600" />}
                          {comparison === "lowest" && <TrendingDown className="w-4 h-4 text-red-600" />}
                        </div>
                        <Progress
                          value={percentage}
                          className={`h-3 ${
                            comparison === "highest"
                              ? "[&>div]:bg-green-500"
                              : comparison === "lowest"
                                ? "[&>div]:bg-red-500"
                                : ""
                          }`}
                        />
                      </div>
                    )
                  })}
                </div>
              </div>
            ))}

            {/* Total Stats */}
            <div className="pt-4 border-t space-y-2">
              <h4 className="font-bold text-center">Total Base</h4>
              <div className="grid gap-4" style={{ gridTemplateColumns: `repeat(${selectedPokemon.length}, 1fr)` }}>
                {selectedPokemon.map((pokemon) => {
                  const percentage = maxStats ? (pokemon.totalStats / maxStats.total) * 100 : 0
                  const isHighest = pokemon.totalStats === maxStats?.total

                  return (
                    <div key={pokemon.id} className="space-y-2">
                      <div className="flex justify-between items-center">
                        <span className={`font-bold text-xl ${isHighest ? "text-green-600" : "text-muted-foreground"}`}>
                          {pokemon.totalStats}
                        </span>
                        {isHighest && <TrendingUp className="w-5 h-5 text-green-600" />}
                      </div>
                      <Progress value={percentage} className={`h-4 ${isHighest ? "[&>div]:bg-green-500" : ""}`} />
                    </div>
                  )
                })}
              </div>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
