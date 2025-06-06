"use client"

import { useState } from "react"
import Image from "next/image"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { type Pokemon, typeColors, getPokemonById } from "@/data/pokemon"
import { usePokedex } from "@/contexts/PokedexContext"
import {
  Star,
  Sparkles,
  Moon,
  Sun,
  Check,
  Shield,
  Crown,
  Ruler,
  Weight,
  Eye,
  Users,
  Baby,
  TrendingUp,
  ArrowRight,
  ArrowLeft,
} from "lucide-react"

interface PokemonDetailsProps {
  pokemon: Pokemon
  isOpen: boolean
  onClose: () => void
}

export function PokemonDetails({ pokemon, isOpen, onClose }: PokemonDetailsProps) {
  const { pokemonStatus, updatePokemonStatus } = usePokedex()
  const [showShiny, setShowShiny] = useState(false)
  const [activeTab, setActiveTab] = useState("overview")

  const status = pokemonStatus[pokemon.id] || {
    caught: false,
    shiny: false,
    lucky: false,
    shadow: false,
    purified: false,
  }

  const primaryType = pokemon.types[0]
  const typeColor = typeColors[primaryType] || "bg-gray-100"

  // Calcular total de stats
  const totalStats = Object.values(pokemon.stats).reduce((sum, stat) => sum + stat, 0)
  const maxStat = Math.max(...Object.values(pokemon.stats))

  // Funções para navegação entre Pokémons
  const goToPrevious = () => {
    const prevPokemon = getPokemonById(pokemon.id - 1)
    if (prevPokemon) {
      // Aqui poderíamos atualizar o Pokémon mostrado
      console.log("Previous:", prevPokemon.name)
    }
  }

  const goToNext = () => {
    const nextPokemon = getPokemonById(pokemon.id + 1)
    if (nextPokemon) {
      // Aqui poderíamos atualizar o Pokémon mostrado
      console.log("Next:", nextPokemon.name)
    }
  }

  const handleStatusChange = (field: keyof typeof status, value: boolean) => {
    updatePokemonStatus(pokemon.id, { [field]: value })
  }

  const toggleCaught = () => {
    const newCaughtStatus = !status.caught
    if (!newCaughtStatus) {
      updatePokemonStatus(pokemon.id, {
        caught: false,
        shiny: false,
        lucky: false,
        shadow: false,
        purified: false,
      })
    } else {
      updatePokemonStatus(pokemon.id, { caught: true })
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <DialogTitle className="text-2xl font-bold">
                #{pokemon.id.toString().padStart(3, "0")} {pokemon.name}
              </DialogTitle>

              {/* Status Badges */}
              <div className="flex gap-2">
                {pokemon.isLegendary && (
                  <Badge className="bg-yellow-500 text-white">
                    <Crown className="w-3 h-3 mr-1" />
                    Lendário
                  </Badge>
                )}
                {pokemon.isMythical && (
                  <Badge className="bg-purple-500 text-white">
                    <Star className="w-3 h-3 mr-1" />
                    Mítico
                  </Badge>
                )}
              </div>
            </div>

            {/* Navigation */}
            <div className="flex items-center gap-2">
              <Button variant="ghost" size="sm" onClick={goToPrevious} disabled={pokemon.id === 1}>
                <ArrowLeft className="w-4 h-4" />
              </Button>
              <Button variant="ghost" size="sm" onClick={goToNext} disabled={pokemon.id === 1025}>
                <ArrowRight className="w-4 h-4" />
              </Button>
            </div>
          </div>
        </DialogHeader>

        <div className="space-y-6">
          {/* Header Section */}
          <div
            className={`p-6 rounded-lg bg-gradient-to-r ${typeColor.replace("bg-", "from-")}-100 to-white dark:to-gray-800`}
          >
            <div className="grid md:grid-cols-2 gap-6">
              {/* Pokemon Image - Larger and without circle */}
              <div className="text-center">
                <div className="relative inline-block">
                  <Image
                    src={showShiny && status.shiny ? pokemon.shinyImageUrl : pokemon.imageUrl}
                    alt={pokemon.name}
                    width={200}
                    height={200}
                    className="pixelated"
                    crossOrigin="anonymous"
                  />

                  {/* Status Indicators */}
                  <div className="absolute -top-2 -right-2 flex flex-col gap-1">
                    {status.caught && (
                      <div className="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center shadow-md">
                        <Check className="w-5 h-5 text-white" />
                      </div>
                    )}
                    {status.shiny && (
                      <div className="w-8 h-8 bg-yellow-400 rounded-full flex items-center justify-center shadow-md">
                        <Sparkles className="w-5 h-5 text-white" />
                      </div>
                    )}
                  </div>
                </div>

                {/* Toggle Shiny */}
                {status.caught && status.shiny && (
                  <Button variant="outline" size="sm" onClick={() => setShowShiny(!showShiny)} className="mt-4">
                    {showShiny ? (
                      <>
                        <Sun className="w-4 h-4 mr-2" />
                        Ver Normal
                      </>
                    ) : (
                      <>
                        <Sparkles className="w-4 h-4 mr-2" />
                        Ver Shiny
                      </>
                    )}
                  </Button>
                )}
              </div>

              {/* Basic Info */}
              <div className="space-y-4">
                <div>
                  <h3 className="text-lg font-semibold mb-2">Informações Básicas</h3>
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div className="flex items-center gap-2">
                      <Ruler className="w-4 h-4 text-muted-foreground" />
                      <span>Altura: {pokemon.height}m</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Weight className="w-4 h-4 text-muted-foreground" />
                      <span>Peso: {pokemon.weight}kg</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Eye className="w-4 h-4 text-muted-foreground" />
                      <span>Categoria: {pokemon.category}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <TrendingUp className="w-4 h-4 text-muted-foreground" />
                      <span>Exp. Base: {pokemon.baseExperience}</span>
                    </div>
                  </div>
                </div>

                {/* Types */}
                <div>
                  <h4 className="font-medium mb-2">Tipos</h4>
                  <div className="flex gap-2">
                    {pokemon.types.map((type) => (
                      <Badge key={type} className={`${typeColors[type]} text-white border-0`}>
                        {type}
                      </Badge>
                    ))}
                  </div>
                </div>

                {/* Abilities */}
                <div>
                  <h4 className="font-medium mb-2">Habilidades</h4>
                  <div className="space-y-1">
                    {pokemon.abilities.map((ability) => (
                      <Badge key={ability} variant="outline">
                        {ability}
                      </Badge>
                    ))}
                    {pokemon.hiddenAbility && (
                      <Badge variant="secondary" className="ml-2">
                        {pokemon.hiddenAbility} (Oculta)
                      </Badge>
                    )}
                  </div>
                </div>

                {/* Capture Actions */}
                <div className="space-y-3 pt-4 border-t">
                  <Button
                    variant={status.caught ? "default" : "outline"}
                    onClick={(e) => {
                      e.stopPropagation()
                      toggleCaught()
                    }}
                    className="w-full"
                  >
                    {status.caught ? (
                      <>
                        <Check className="w-4 h-4 mr-2" />
                        Capturado
                      </>
                    ) : (
                      "Marcar como Capturado"
                    )}
                  </Button>

                  {status.caught && (
                    <div className="grid grid-cols-4 gap-2">
                      <Button
                        variant={status.shiny ? "default" : "outline"}
                        size="sm"
                        className={status.shiny ? "bg-yellow-400 hover:bg-yellow-500" : ""}
                        onClick={(e) => {
                          e.stopPropagation()
                          handleStatusChange("shiny", !status.shiny)
                        }}
                      >
                        <Sparkles className="w-4 h-4" />
                      </Button>
                      <Button
                        variant={status.lucky ? "default" : "outline"}
                        size="sm"
                        className={status.lucky ? "bg-orange-500 hover:bg-orange-600" : ""}
                        onClick={(e) => {
                          e.stopPropagation()
                          handleStatusChange("lucky", !status.lucky)
                        }}
                      >
                        <Star className="w-4 h-4" />
                      </Button>
                      <Button
                        variant={status.shadow ? "default" : "outline"}
                        size="sm"
                        className={status.shadow ? "bg-purple-800 hover:bg-purple-900" : ""}
                        onClick={(e) => {
                          e.stopPropagation()
                          handleStatusChange("shadow", !status.shadow)
                        }}
                      >
                        <Moon className="w-4 h-4" />
                      </Button>
                      <Button
                        variant={status.purified ? "default" : "outline"}
                        size="sm"
                        className={status.purified ? "bg-blue-500 hover:bg-blue-600" : ""}
                        onClick={(e) => {
                          e.stopPropagation()
                          handleStatusChange("purified", !status.purified)
                        }}
                      >
                        <Shield className="w-4 h-4" />
                      </Button>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Detailed Tabs */}
          <Tabs value={activeTab} onValueChange={setActiveTab}>
            <TabsList className="grid w-full grid-cols-4">
              <TabsTrigger value="overview">Visão Geral</TabsTrigger>
              <TabsTrigger value="stats">Estatísticas</TabsTrigger>
              <TabsTrigger value="evolution">Evolução</TabsTrigger>
              <TabsTrigger value="breeding">Reprodução</TabsTrigger>
            </TabsList>

            <TabsContent value="overview" className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle>Descrição</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground">{pokemon.description}</p>
                </CardContent>
              </Card>

              <div className="grid md:grid-cols-2 gap-4">
                <Card>
                  <CardHeader>
                    <CardTitle className="text-base">Localização</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-2">
                      <div className="flex justify-between">
                        <span>Região:</span>
                        <Badge variant="outline">{pokemon.region}</Badge>
                      </div>
                      <div className="flex justify-between">
                        <span>Habitat:</span>
                        <span className="text-muted-foreground">{pokemon.habitat}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Taxa de Captura:</span>
                        <span className="text-muted-foreground">{pokemon.captureRate}/255</span>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className="text-base">Características</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-2">
                      <div className="flex justify-between">
                        <span>Felicidade Base:</span>
                        <span className="text-muted-foreground">{pokemon.baseHappiness}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Taxa de Crescimento:</span>
                        <span className="text-muted-foreground">{pokemon.growthRate}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Geração:</span>
                        <Badge variant="outline">Gen {pokemon.generation}</Badge>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>

            <TabsContent value="stats" className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle>Estatísticas Base</CardTitle>
                  <CardDescription>Total: {totalStats} pontos</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {Object.entries(pokemon.stats).map(([statName, value]) => {
                      const percentage = (value / maxStat) * 100
                      const statLabels = {
                        hp: "HP",
                        attack: "Ataque",
                        defense: "Defesa",
                        specialAttack: "At. Especial",
                        specialDefense: "Def. Especial",
                        speed: "Velocidade",
                      }

                      return (
                        <div key={statName} className="space-y-2">
                          <div className="flex justify-between text-sm">
                            <span className="font-medium">{statLabels[statName as keyof typeof statLabels]}</span>
                            <span className="text-muted-foreground">{value}</span>
                          </div>
                          <Progress value={percentage} className="h-2" />
                        </div>
                      )
                    })}
                  </div>
                </CardContent>
              </Card>

              {/* Stat Comparison */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-base">Análise de Stats</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <span className="font-medium">Stat Mais Alto:</span>
                      <p className="text-muted-foreground">
                        {
                          Object.entries(pokemon.stats).reduce(
                            (max, [name, value]) => (value > max.value ? { name, value } : max),
                            { name: "", value: 0 },
                          ).name
                        }{" "}
                        ({maxStat})
                      </p>
                    </div>
                    <div>
                      <span className="font-medium">Classificação:</span>
                      <p className="text-muted-foreground">
                        {totalStats > 600
                          ? "Lendário"
                          : totalStats > 500
                            ? "Muito Forte"
                            : totalStats > 400
                              ? "Forte"
                              : "Normal"}
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="evolution" className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle>Cadeia Evolutiva</CardTitle>
                </CardHeader>
                <CardContent>
                  {pokemon.evolutionChain ? (
                    <div className="flex items-center justify-center space-x-4">
                      {pokemon.evolutionChain.prevEvolution && (
                        <>
                          <div className="text-center">
                            <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mb-2">
                              <Image
                                src={`https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/${pokemon.evolutionChain.prevEvolution.id}.png`}
                                alt={pokemon.evolutionChain.prevEvolution.name}
                                width={48}
                                height={48}
                              />
                            </div>
                            <p className="text-xs font-medium">{pokemon.evolutionChain.prevEvolution.name}</p>
                            <p className="text-xs text-muted-foreground">
                              {pokemon.evolutionChain.prevEvolution.method}
                            </p>
                          </div>
                          <ArrowRight className="w-4 h-4 text-muted-foreground" />
                        </>
                      )}

                      <div className="text-center">
                        <div className="w-20 h-20 bg-blue-100 rounded-full flex items-center justify-center mb-2 ring-2 ring-blue-500">
                          <Image
                            src={pokemon.imageUrl || "/placeholder.svg"}
                            alt={pokemon.name}
                            width={64}
                            height={64}
                          />
                        </div>
                        <p className="text-sm font-medium">{pokemon.name}</p>
                        <p className="text-xs text-muted-foreground">Atual</p>
                      </div>

                      {pokemon.evolutionChain.nextEvolution && (
                        <>
                          <ArrowRight className="w-4 h-4 text-muted-foreground" />
                          <div className="text-center">
                            <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mb-2">
                              <Image
                                src={`https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/${pokemon.evolutionChain.nextEvolution.id}.png`}
                                alt={pokemon.evolutionChain.nextEvolution.name}
                                width={48}
                                height={48}
                              />
                            </div>
                            <p className="text-xs font-medium">{pokemon.evolutionChain.nextEvolution.name}</p>
                            <p className="text-xs text-muted-foreground">
                              {pokemon.evolutionChain.nextEvolution.method}
                            </p>
                          </div>
                        </>
                      )}
                    </div>
                  ) : (
                    <div className="text-center py-8">
                      <p className="text-muted-foreground">Este Pokémon não evolui</p>
                    </div>
                  )}
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="breeding" className="space-y-4">
              <div className="grid md:grid-cols-2 gap-4">
                <Card>
                  <CardHeader>
                    <CardTitle className="text-base flex items-center gap-2">
                      <Users className="w-4 h-4" />
                      Grupos de Ovos
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="flex flex-wrap gap-2">
                      {pokemon.eggGroups.map((group) => (
                        <Badge key={group} variant="outline">
                          {group}
                        </Badge>
                      ))}
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className="text-base flex items-center gap-2">
                      <Baby className="w-4 h-4" />
                      Proporção de Género
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    {pokemon.genderRatio.genderless ? (
                      <p className="text-muted-foreground">Sem género</p>
                    ) : (
                      <div className="space-y-2">
                        <div className="flex justify-between text-sm">
                          <span>♂ Macho:</span>
                          <span>{pokemon.genderRatio.male}%</span>
                        </div>
                        <div className="flex justify-between text-sm">
                          <span>♀ Fêmea:</span>
                          <span>{pokemon.genderRatio.female}%</span>
                        </div>
                      </div>
                    )}
                  </CardContent>
                </Card>
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </DialogContent>
    </Dialog>
  )
}
