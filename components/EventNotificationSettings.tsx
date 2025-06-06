"use client"

import { useState } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { Slider } from "@/components/ui/slider"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { pokemonData } from "@/data/pokemon"
import { Bell, Settings, MapPin, Search, X, Plus } from "lucide-react"
import type { UserNotificationPreferences } from "@/types/events"

interface EventNotificationSettingsProps {
  userPreferences: UserNotificationPreferences
  onSavePreferences: (preferences: UserNotificationPreferences) => void
}

export function EventNotificationSettings({ userPreferences, onSavePreferences }: EventNotificationSettingsProps) {
  const [isOpen, setIsOpen] = useState(false)
  const [preferences, setPreferences] = useState<UserNotificationPreferences>(userPreferences)
  const [searchTerm, setSearchTerm] = useState("")

  // Tipos de eventos disponíveis
  const eventTypes = [
    { id: "community_day", name: "Community Day" },
    { id: "raid_hour", name: "Raid Hour" },
    { id: "spotlight_hour", name: "Spotlight Hour" },
    { id: "go_fest", name: "GO Fest" },
    { id: "research_day", name: "Research Day" },
    { id: "season", name: "Temporada" },
    { id: "special", name: "Eventos Especiais" },
  ]

  // Regiões disponíveis
  const regions = [
    { id: "global", name: "Global" },
    { id: "americas", name: "Américas" },
    { id: "europe", name: "Europa" },
    { id: "asia", name: "Ásia" },
    { id: "oceania", name: "Oceania" },
  ]

  // Pokémon filtrados pela busca
  const filteredPokemon = pokemonData
    .filter(
      (pokemon) =>
        pokemon.name.toLowerCase().includes(searchTerm.toLowerCase()) || pokemon.id.toString().includes(searchTerm),
    )
    .slice(0, 20)

  const toggleEventType = (typeId: string) => {
    setPreferences((prev) => {
      const enabledTypes = [...prev.enabledTypes]
      const index = enabledTypes.indexOf(typeId)

      if (index === -1) {
        enabledTypes.push(typeId)
      } else {
        enabledTypes.splice(index, 1)
      }

      return { ...prev, enabledTypes }
    })
  }

  const toggleRegion = (regionId: string) => {
    setPreferences((prev) => {
      const regions = [...prev.regions]
      const index = regions.indexOf(regionId)

      if (index === -1) {
        regions.push(regionId)
      } else {
        regions.splice(index, 1)
      }

      return { ...prev, regions }
    })
  }

  const toggleFavoritePokemon = (pokemonId: number) => {
    setPreferences((prev) => {
      const favoritePokemon = [...prev.favoritePokemon]
      const index = favoritePokemon.indexOf(pokemonId)

      if (index === -1) {
        favoritePokemon.push(pokemonId)
      } else {
        favoritePokemon.splice(index, 1)
      }

      return { ...prev, favoritePokemon }
    })
  }

  const handleSave = () => {
    onSavePreferences(preferences)
    setIsOpen(false)
  }

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm">
          <Bell className="w-4 h-4 mr-2" />
          Configurar Notificações
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Bell className="w-5 h-5" />
            Configurações de Notificações
          </DialogTitle>
        </DialogHeader>

        <Tabs defaultValue="types" className="w-full">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="types">Tipos de Eventos</TabsTrigger>
            <TabsTrigger value="pokemon">Pokémon Favoritos</TabsTrigger>
            <TabsTrigger value="settings">Configurações</TabsTrigger>
          </TabsList>

          <TabsContent value="types" className="space-y-6 mt-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Card>
                <CardHeader>
                  <CardTitle className="text-base">Tipos de Eventos</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {eventTypes.map((type) => (
                    <div key={type.id} className="flex items-center justify-between">
                      <Label htmlFor={`event-type-${type.id}`} className="flex-1">
                        {type.name}
                      </Label>
                      <Switch
                        id={`event-type-${type.id}`}
                        checked={preferences.enabledTypes.includes(type.id)}
                        onCheckedChange={() => toggleEventType(type.id)}
                      />
                    </div>
                  ))}
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="text-base">Regiões</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {regions.map((region) => (
                    <div key={region.id} className="flex items-center justify-between">
                      <Label htmlFor={`region-${region.id}`} className="flex items-center gap-2">
                        <MapPin className="w-4 h-4" />
                        {region.name}
                      </Label>
                      <Switch
                        id={`region-${region.id}`}
                        checked={preferences.regions.includes(region.id)}
                        onCheckedChange={() => toggleRegion(region.id)}
                      />
                    </div>
                  ))}
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="pokemon" className="space-y-6 mt-6">
            <Card>
              <CardHeader>
                <CardTitle className="text-base">Pokémon Favoritos</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                  <Input
                    placeholder="Procurar Pokémon..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10"
                  />
                </div>

                <div className="flex flex-wrap gap-2 mb-4">
                  {preferences.favoritePokemon.map((id) => {
                    const pokemon = pokemonData.find((p) => p.id === id)
                    if (!pokemon) return null

                    return (
                      <Badge key={id} variant="secondary" className="flex items-center gap-1 pr-1">
                        <span className="text-xs">{pokemon.name}</span>
                        <Button
                          variant="ghost"
                          size="sm"
                          className="h-5 w-5 p-0 rounded-full"
                          onClick={() => toggleFavoritePokemon(id)}
                        >
                          <X className="h-3 w-3" />
                        </Button>
                      </Badge>
                    )
                  })}
                </div>

                <div className="grid grid-cols-2 md:grid-cols-4 gap-2 max-h-64 overflow-y-auto">
                  {filteredPokemon.map((pokemon) => {
                    const isSelected = preferences.favoritePokemon.includes(pokemon.id)

                    return (
                      <Button
                        key={pokemon.id}
                        variant={isSelected ? "default" : "outline"}
                        size="sm"
                        className="justify-start"
                        onClick={() => toggleFavoritePokemon(pokemon.id)}
                      >
                        {isSelected ? <X className="w-4 h-4 mr-2" /> : <Plus className="w-4 h-4 mr-2" />}
                        {pokemon.name}
                      </Button>
                    )
                  })}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="settings" className="space-y-6 mt-6">
            <Card>
              <CardHeader>
                <CardTitle className="text-base">Configurações Gerais</CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <Label htmlFor="notify-before">Notificar antes do evento (minutos)</Label>
                    <span className="text-sm font-medium">{preferences.notifyBefore} min</span>
                  </div>
                  <Slider
                    id="notify-before"
                    min={5}
                    max={120}
                    step={5}
                    value={[preferences.notifyBefore]}
                    onValueChange={(value) => setPreferences((prev) => ({ ...prev, notifyBefore: value[0] }))}
                  />
                </div>

                <div className="flex items-center justify-between">
                  <Label htmlFor="enable-browser-notifications" className="flex items-center gap-2">
                    <Bell className="w-4 h-4" />
                    Notificações do navegador
                  </Label>
                  <Switch id="enable-browser-notifications" />
                </div>

                <div className="flex items-center justify-between">
                  <Label htmlFor="enable-sound" className="flex items-center gap-2">
                    <Settings className="w-4 h-4" />
                    Som de notificação
                  </Label>
                  <Switch id="enable-sound" />
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        <div className="flex justify-end gap-2 mt-6">
          <Button variant="outline" onClick={() => setIsOpen(false)}>
            Cancelar
          </Button>
          <Button onClick={handleSave}>Salvar Configurações</Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}
