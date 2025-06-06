"use client"

import { useState, useEffect } from "react"
import { Dialog, DialogContent, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent } from "@/components/ui/card"
import { pokemonData } from "@/data/pokemon"
import { Settings, Search, Star } from "lucide-react"
import Image from "next/image"

interface FeaturedPokemonManagerProps {
  featuredIds: number[]
  onFeaturedChange: (ids: number[]) => void
}

export function FeaturedPokemonManager({ featuredIds, onFeaturedChange }: FeaturedPokemonManagerProps) {
  const [isOpen, setIsOpen] = useState(false)
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedIds, setSelectedIds] = useState<number[]>(featuredIds)

  useEffect(() => {
    setSelectedIds(featuredIds)
  }, [featuredIds])

  const filteredPokemon = pokemonData
    .filter(
      (pokemon) =>
        pokemon.name.toLowerCase().includes(searchTerm.toLowerCase()) || pokemon.id.toString().includes(searchTerm),
    )
    .slice(0, 20)

  const togglePokemon = (pokemonId: number) => {
    if (selectedIds.includes(pokemonId)) {
      setSelectedIds(selectedIds.filter((id) => id !== pokemonId))
    } else if (selectedIds.length < 6) {
      setSelectedIds([...selectedIds, pokemonId])
    }
  }

  const handleSave = () => {
    onFeaturedChange(selectedIds)
    setIsOpen(false)
  }

  const handleReset = () => {
    const defaultIds = [25, 150, 144, 4, 7, 1] // Pokémons padrão
    setSelectedIds(defaultIds)
  }

  const selectedPokemon = selectedIds.map((id) => pokemonData.find((p) => p.id === id)).filter(Boolean)

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm">
          <Settings className="w-4 h-4 mr-2" />
          Personalizar Destaques
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogTitle className="flex items-center gap-2">
          <Star className="w-5 h-5" />
          Personalizar Pokémons em Destaque
        </DialogTitle>

        <div className="space-y-6">
          {/* Selected Pokemon */}
          <div>
            <h3 className="font-semibold mb-3">Pokémons Selecionados ({selectedIds.length}/6)</h3>
            <div className="grid grid-cols-3 md:grid-cols-6 gap-3">
              {selectedPokemon.map((pokemon) => (
                <Card key={pokemon.id} className="relative">
                  <CardContent className="p-3 text-center">
                    <Image
                      src={pokemon.imageUrl || "/placeholder.svg"}
                      alt={pokemon.name}
                      width={48}
                      height={48}
                      className="mx-auto mb-1"
                    />
                    <p className="text-xs font-medium">#{pokemon.id}</p>
                    <p className="text-xs text-muted-foreground">{pokemon.name}</p>
                  </CardContent>
                </Card>
              ))}

              {/* Empty slots */}
              {Array.from({ length: 6 - selectedIds.length }).map((_, index) => (
                <Card key={`empty-${index}`} className="border-dashed">
                  <CardContent className="p-3 text-center">
                    <div className="w-12 h-12 bg-muted rounded mx-auto mb-1 flex items-center justify-center">
                      <Star className="w-6 h-6 text-muted-foreground" />
                    </div>
                    <p className="text-xs text-muted-foreground">Vazio</p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>

          {/* Search */}
          <div>
            <h3 className="font-semibold mb-3">Procurar Pokémons</h3>
            <div className="relative mb-4">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input
                placeholder="Procurar por nome ou número..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>

            <div className="grid grid-cols-4 md:grid-cols-8 gap-2 max-h-64 overflow-y-auto">
              {filteredPokemon.map((pokemon) => {
                const isSelected = selectedIds.includes(pokemon.id)
                const canSelect = selectedIds.length < 6 || isSelected

                return (
                  <Button
                    key={pokemon.id}
                    variant={isSelected ? "default" : "outline"}
                    size="sm"
                    className="h-auto p-2 flex flex-col gap-1"
                    onClick={() => togglePokemon(pokemon.id)}
                    disabled={!canSelect}
                  >
                    <Image src={pokemon.imageUrl || "/placeholder.svg"} alt={pokemon.name} width={32} height={32} />
                    <span className="text-xs">#{pokemon.id}</span>
                    {isSelected && (
                      <Badge variant="secondary" className="text-xs">
                        ✓
                      </Badge>
                    )}
                  </Button>
                )
              })}
            </div>
          </div>

          {/* Actions */}
          <div className="flex justify-between">
            <Button variant="outline" onClick={handleReset}>
              Restaurar Padrão
            </Button>
            <div className="flex gap-2">
              <Button variant="outline" onClick={() => setIsOpen(false)}>
                Cancelar
              </Button>
              <Button onClick={handleSave}>Salvar Alterações</Button>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
