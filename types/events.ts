export interface PokemonEventData {
  id: number
  name: string
  isShiny: boolean
  isLegendary: boolean
  isMythical: boolean
  spawnRate: "common" | "uncommon" | "rare" | "ultra_rare"
  imageUrl: string
  shinyImageUrl?: string
}

export interface EventBonus {
  type: string
  multiplier: number
  description: string
}

export interface EventRegion {
  name: string
  country: string
  timezone: string
  isHighActivity: boolean
  coordinates: {
    lat: number
    lng: number
  }
  specialSpawns: PokemonEventData[]
}

export interface LiveEvent {
  id: string
  name: string
  description: string
  type: "community_day" | "raid_hour" | "spotlight_hour" | "go_fest" | "special" | "season"
  startDate: string
  endDate: string
  isActive: boolean
  isUpcoming: boolean
  featuredPokemon: PokemonEventData[]
  bonuses: EventBonus[]
  activeRegions: EventRegion[]
  sourceUrl: string
  imageUrl: string
  priority: "critical" | "high" | "medium" | "low"
  tags: string[]
}
