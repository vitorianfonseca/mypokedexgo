"use client"

import { useState } from "react"
import Image from "next/image"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { type Pokemon, typeColors } from "@/data/pokemon"
import { usePokedex } from "@/contexts/PokedexContext"
import { PokemonDetails } from "./PokemonDetails"
import { Star, Sparkles, Moon, Sun, Check, Shield, Crown, Info } from "lucide-react"

interface PokemonCardProps {
  pokemon: Pokemon
  isComparisonMode?: boolean
  isSelectedForComparison?: boolean
  onComparisonSelect?: () => void
}

export function PokemonCard({
  pokemon,
  isComparisonMode = false,
  isSelectedForComparison = false,
  onComparisonSelect,
}: PokemonCardProps) {
  const { pokemonStatus, updatePokemonStatus } = usePokedex()
  const [showShiny, setShowShiny] = useState(false)
  const [showDetails, setShowDetails] = useState(false)

  const status = pokemonStatus[pokemon.id] || {
    caught: false,
    shiny: false,
    lucky: false,
    shadow: false,
    purified: false,
  }

  // Get the primary type color for the card background
  const primaryType = pokemon.types[0]
  const typeColor = typeColors[primaryType] || "bg-gray-100"

  // Extract just the color name without the bg- prefix
  const colorName = typeColor.replace("bg-", "")

  // Create gradient classes for caught Pokemon
  const gradientLight = `from-${colorName}-50 to-${colorName}-100`
  const gradientDark = `dark:from-${colorName}-950 dark:to-${colorName}-900`

  // Create border color
  const borderColor = `ring-${colorName}-500`

  const handleStatusChange = (field: keyof typeof status, value: boolean) => {
    updatePokemonStatus(pokemon.id, { [field]: value })
  }

  const toggleCaught = () => {
    const newCaughtStatus = !status.caught

    // If setting to uncaught, reset all other statuses
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
    <>
      <Card
        className={`relative overflow-hidden transition-all duration-300 hover:shadow-lg cursor-pointer ${
          status.caught
            ? `ring-2 ${borderColor} bg-gradient-to-br ${gradientLight} ${gradientDark}`
            : "hover:shadow-lg bg-white dark:bg-gray-800"
        } ${isComparisonMode && isSelectedForComparison ? "ring-4 ring-blue-500 bg-blue-50 dark:bg-blue-950" : ""}`}
        onClick={() => {
          if (isComparisonMode && onComparisonSelect) {
            onComparisonSelect()
          } else {
            setShowDetails(true)
          }
        }}
      >
        {/* Comparison Mode Indicator */}
        {isComparisonMode && (
          <div className="absolute top-2 left-2">
            <div
              className={`w-6 h-6 rounded-full flex items-center justify-center ${
                isSelectedForComparison
                  ? "bg-blue-500 text-white"
                  : "bg-white/80 text-gray-600 border-2 border-gray-300"
              }`}
            >
              {isSelectedForComparison ? <Check className="w-4 h-4" /> : <span className="text-xs font-bold">+</span>}
            </div>
          </div>
        )}
        <CardContent className="p-4">
          <div className="flex flex-col items-center space-y-3">
            {/* Pokemon Image */}
            <div className="relative">
              <div className="w-24 h-24 bg-white dark:bg-gray-700 rounded-full flex items-center justify-center shadow-inner">
                <Image
                  src={showShiny && status.shiny ? pokemon.shinyImageUrl : pokemon.imageUrl}
                  alt={pokemon.name}
                  width={80}
                  height={80}
                  className="pixelated"
                  crossOrigin="anonymous"
                  loading="lazy"
                  placeholder="blur"
                  blurDataURL="data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wBDAAYEBQYFBAYGBQYHBwYIChAKCgkJChQODwwQFxQYGBcUFhYaHSUfGhsjHBYWICwgIyYnKSopGR8tMC0oMCUoKSj/2wBDAQcHBwoIChMKChMoGhYaKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCj/wAARCAABAAEDASIAAhEBAxEB/8QAFQABAQAAAAAAAAAAAAAAAAAAAAv/xAAhEAACAQMDBQAAAAAAAAAAAAABAgMABAUGIWGRkqGx0f/EABUBAQEAAAAAAAAAAAAAAAAAAAMF/8QAGhEAAgIDAAAAAAAAAAAAAAAAAAECEgMRkf/aAAwDAQACEQMRAD8AltJagyeH0AthI5xdrLcNM91BF5pX2HaH9bcfaSXWGaRmknyJckliyjqTzSlT54b6bk+h0R+on//Z"
                />
              </div>

              {/* Status Badges - Top Right */}
              <div className="absolute -top-2 -right-2 flex flex-col gap-1">
                {pokemon.isLegendary && (
                  <div className="w-6 h-6 bg-yellow-500 rounded-full flex items-center justify-center shadow-md">
                    <Crown className="w-4 h-4 text-white" />
                  </div>
                )}
                {pokemon.isMythical && (
                  <div className="w-6 h-6 bg-purple-600 rounded-full flex items-center justify-center shadow-md">
                    <Star className="w-4 h-4 text-white" />
                  </div>
                )}
                {status.shiny && (
                  <div
                    className="w-6 h-6 bg-yellow-400 rounded-full flex items-center justify-center shadow-md"
                    onClick={(e) => {
                      e.stopPropagation()
                      setShowShiny(!showShiny)
                    }}
                  >
                    <Sparkles className="w-4 h-4 text-white" />
                  </div>
                )}
                {status.lucky && (
                  <div className="w-6 h-6 bg-orange-500 rounded-full flex items-center justify-center shadow-md">
                    <Star className="w-4 h-4 text-white" />
                  </div>
                )}
              </div>

              {/* Status Badges - Top Left */}
              <div className="absolute -top-2 -left-2 flex flex-col gap-1">
                {status.caught && (
                  <div className="w-6 h-6 bg-green-500 rounded-full flex items-center justify-center shadow-md">
                    <Check className="w-4 h-4 text-white" />
                  </div>
                )}
                {status.shadow && (
                  <div className="w-6 h-6 bg-purple-800 rounded-full flex items-center justify-center shadow-md">
                    <Moon className="w-4 h-4 text-white" />
                  </div>
                )}
                {status.purified && (
                  <div className="w-6 h-6 bg-blue-500 rounded-full flex items-center justify-center shadow-md">
                    <Shield className="w-4 h-4 text-white" />
                  </div>
                )}
              </div>

              {/* Info Button */}
              <div className="absolute -bottom-2 -right-2">
                <div className="w-6 h-6 bg-blue-600 rounded-full flex items-center justify-center shadow-md">
                  <Info className="w-3 h-3 text-white" />
                </div>
              </div>
            </div>

            {/* Pokemon Info */}
            <div className="text-center space-y-2 w-full">
              <h3 className="font-bold text-lg">{pokemon.name}</h3>
              <p className="text-sm text-muted-foreground">#{pokemon.id.toString().padStart(3, "0")}</p>

              {/* Types */}
              <div className="flex gap-1 justify-center flex-wrap">
                {pokemon.types.map((type) => (
                  <Badge key={type} className={`${typeColors[type]} text-white text-xs px-2 py-1 border-0`}>
                    {type}
                  </Badge>
                ))}
              </div>

              {/* Quick Stats */}
              <div className="text-xs text-muted-foreground">
                <div className="flex justify-between">
                  <span>Altura: {pokemon.height}m</span>
                  <span>Peso: {pokemon.weight}kg</span>
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="w-full space-y-2" onClick={(e) => e.stopPropagation()}>
              {/* Main Caught Toggle */}
              <Button
                variant={status.caught ? "default" : "outline"}
                size="sm"
                className={`w-full ${status.caught ? typeColor + " hover:" + typeColor : ""}`}
                onClick={toggleCaught}
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

              {/* Status Buttons - Only show if caught */}
              {status.caught && (
                <div className="grid grid-cols-4 gap-2">
                  <Button
                    variant={status.shiny ? "default" : "outline"}
                    size="icon"
                    className={`w-full h-8 ${status.shiny ? "bg-yellow-400 hover:bg-yellow-500" : ""}`}
                    onClick={() => handleStatusChange("shiny", !status.shiny)}
                  >
                    <Sparkles className="w-4 h-4" />
                  </Button>

                  <Button
                    variant={status.lucky ? "default" : "outline"}
                    size="icon"
                    className={`w-full h-8 ${status.lucky ? "bg-orange-500 hover:bg-orange-600" : ""}`}
                    onClick={() => handleStatusChange("lucky", !status.lucky)}
                  >
                    <Star className="w-4 h-4" />
                  </Button>

                  <Button
                    variant={status.shadow ? "default" : "outline"}
                    size="icon"
                    className={`w-full h-8 ${status.shadow ? "bg-purple-800 hover:bg-purple-900" : ""}`}
                    onClick={() => handleStatusChange("shadow", !status.shadow)}
                  >
                    <Moon className="w-4 h-4" />
                  </Button>

                  <Button
                    variant={status.purified ? "default" : "outline"}
                    size="icon"
                    className={`w-full h-8 ${status.purified ? "bg-blue-500 hover:bg-blue-600" : ""}`}
                    onClick={() => handleStatusChange("purified", !status.purified)}
                  >
                    <Shield className="w-4 h-4" />
                  </Button>
                </div>
              )}

              {/* Toggle Shiny View */}
              {status.caught && status.shiny && (
                <Button variant="ghost" size="sm" onClick={() => setShowShiny(!showShiny)} className="w-full mt-2">
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
          </div>
        </CardContent>
      </Card>

      {/* Pokemon Details Modal */}
      <PokemonDetails pokemon={pokemon} isOpen={showDetails} onClose={() => setShowDetails(false)} />
    </>
  )
}
