import { fetchOfficialEvents, convertOfficialToAppEvent } from "./officialEventApi"
import type { LiveEvent } from "@/types/events"

// Simplificar o sistema de eventos para ser mais confiável
export async function fetchLiveEvents(): Promise<LiveEvent[]> {
  try {
    console.log("🔍 Fetching events from official sources...")

    // Buscar eventos do feed RSS oficial
    const officialEvents = await fetchOfficialEvents()

    // Converter para formato da aplicação
    const appEvents = officialEvents.map(convertOfficialToAppEvent)

    console.log(`✅ Loaded ${appEvents.length} official events`)
    return appEvents
  } catch (error) {
    console.error("❌ Error fetching official events:", error)
    return []
  }
}

// Função para buscar eventos reais do Pokémon GO
async function fetchRealEvents(): Promise<LiveEvent[]> {
  try {
    // Simular delay de API
    await new Promise((resolve) => setTimeout(resolve, 300))

    // Em um ambiente real, aqui faríamos uma chamada para uma API externa
    // que fornece dados reais de eventos do Pokémon GO
    // Por exemplo:
    // const response = await fetch('https://api.pokemongolive.com/events')
    // const data = await response.json()

    // Como não temos acesso a uma API oficial, vamos retornar um array vazio
    // para que o sistema use o fallback de eventos gerados localmente
    return []
  } catch (error) {
    console.error("Error fetching real events:", error)
    return []
  }
}

export async function getUpdatedEvents(): Promise<LiveEvent[]> {
  return await fetchLiveEvents()
}

// Gerar eventos simples e confiáveis com imagens
function generateSimpleEvents(): LiveEvent[] {
  const now = new Date()
  const events: LiveEvent[] = []

  // Community Day (sábados)
  const isWeekend = now.getDay() === 6 || now.getDay() === 0
  const isCommunityDayTime = now.getDay() === 6 && now.getHours() >= 14 && now.getHours() < 17

  if (isCommunityDayTime) {
    events.push({
      id: "community-day-active",
      name: "Community Day: Charmander",
      description: "Capture Charmander com movimentos exclusivos e taxa de shiny aumentada!",
      type: "community_day",
      startDate: new Date(now.getFullYear(), now.getMonth(), now.getDate(), 14, 0).toISOString(),
      endDate: new Date(now.getFullYear(), now.getMonth(), now.getDate(), 17, 0).toISOString(),
      isActive: true,
      isUpcoming: false,
      featuredPokemon: [
        {
          id: 4,
          name: "Charmander",
          isShiny: true,
          isLegendary: false,
          isMythical: false,
          spawnRate: "common",
          imageUrl: "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/4.png",
          shinyImageUrl: "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/shiny/4.png",
        },
      ],
      bonuses: [
        { type: "xp", multiplier: 3, description: "3x XP por captura" },
        { type: "candy", multiplier: 2, description: "2x Candy" },
      ],
      activeRegions: getDefaultRegions(),
      sourceUrl: "https://pokemongolive.com",
      imageUrl: "/placeholder.svg?height=200&width=200&text=Community+Day",
      priority: "high",
      tags: ["community_day", "charmander"],
    })
  }

  // Raid Hour (quartas-feiras às 18h)
  const isRaidHour = now.getDay() === 3 && now.getHours() === 18
  if (isRaidHour) {
    events.push({
      id: "raid-hour-active",
      name: "Raid Hour: Mewtwo",
      description: "Mewtwo lendário em raids 5 estrelas por uma hora!",
      type: "raid_hour",
      startDate: new Date(now.getFullYear(), now.getMonth(), now.getDate(), 18, 0).toISOString(),
      endDate: new Date(now.getFullYear(), now.getMonth(), now.getDate(), 19, 0).toISOString(),
      isActive: true,
      isUpcoming: false,
      featuredPokemon: [
        {
          id: 150,
          name: "Mewtwo",
          isShiny: true,
          isLegendary: true,
          isMythical: false,
          spawnRate: "rare",
          imageUrl: "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/150.png",
          shinyImageUrl: "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/shiny/150.png",
        },
      ],
      bonuses: [{ type: "raids", multiplier: 1, description: "Mais raids 5 estrelas" }],
      activeRegions: getDefaultRegions(),
      sourceUrl: "https://pokemongolive.com",
      imageUrl: "/placeholder.svg?height=200&width=200&text=Raid+Hour",
      priority: "medium",
      tags: ["raid_hour", "mewtwo"],
    })
  }

  // Eventos próximos
  const nextSaturday = new Date(now)
  const daysUntilSaturday = (6 - now.getDay() + 7) % 7
  if (daysUntilSaturday === 0 && now.getHours() >= 17) {
    nextSaturday.setDate(nextSaturday.getDate() + 7)
  } else {
    nextSaturday.setDate(nextSaturday.getDate() + daysUntilSaturday)
  }
  nextSaturday.setHours(14, 0, 0, 0)

  if (!isCommunityDayTime) {
    events.push({
      id: "community-day-upcoming",
      name: "Community Day: Squirtle",
      description: "Próximo Community Day com Squirtle e movimentos especiais!",
      type: "community_day",
      startDate: nextSaturday.toISOString(),
      endDate: new Date(nextSaturday.getTime() + 3 * 60 * 60 * 1000).toISOString(),
      isActive: false,
      isUpcoming: true,
      featuredPokemon: [
        {
          id: 7,
          name: "Squirtle",
          isShiny: true,
          isLegendary: false,
          isMythical: false,
          spawnRate: "common",
          imageUrl: "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/7.png",
          shinyImageUrl: "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/shiny/7.png",
        },
      ],
      bonuses: [
        { type: "xp", multiplier: 3, description: "3x XP por captura" },
        { type: "candy", multiplier: 2, description: "2x Candy" },
      ],
      activeRegions: getDefaultRegions(),
      sourceUrl: "https://pokemongolive.com",
      imageUrl: "/placeholder.svg?height=200&width=200&text=Community+Day",
      priority: "high",
      tags: ["community_day", "squirtle"],
    })
  }

  // Spotlight Hour (terças-feiras)
  const nextTuesday = new Date(now)
  const daysUntilTuesday = (2 - now.getDay() + 7) % 7
  if (daysUntilTuesday === 0 && now.getHours() >= 19) {
    nextTuesday.setDate(nextTuesday.getDate() + 7)
  } else {
    nextTuesday.setDate(nextTuesday.getDate() + daysUntilTuesday)
  }
  nextTuesday.setHours(18, 0, 0, 0)

  events.push({
    id: "spotlight-hour-upcoming",
    name: "Spotlight Hour: Pikachu",
    description: "Pikachu em destaque com bônus de candy!",
    type: "spotlight_hour",
    startDate: nextTuesday.toISOString(),
    endDate: new Date(nextTuesday.getTime() + 60 * 60 * 1000).toISOString(),
    isActive: false,
    isUpcoming: true,
    featuredPokemon: [
      {
        id: 25,
        name: "Pikachu",
        isShiny: true,
        isLegendary: false,
        isMythical: false,
        spawnRate: "common",
        imageUrl: "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/25.png",
        shinyImageUrl: "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/shiny/25.png",
      },
    ],
    bonuses: [{ type: "candy", multiplier: 2, description: "2x Candy por transferência" }],
    activeRegions: getDefaultRegions(),
    sourceUrl: "https://pokemongolive.com",
    imageUrl: "/placeholder.svg?height=200&width=200&text=Spotlight+Hour",
    priority: "low",
    tags: ["spotlight_hour", "pikachu"],
  })

  // Evento especial de fim de semana
  if (isWeekend && !isCommunityDayTime) {
    events.push({
      id: "weekend-bonus",
      name: "Bônus de Fim de Semana",
      description: "Bônus especiais durante o fim de semana!",
      type: "special",
      startDate: new Date(now.getFullYear(), now.getMonth(), now.getDate(), 0, 0).toISOString(),
      endDate: new Date(now.getFullYear(), now.getMonth(), now.getDate(), 23, 59).toISOString(),
      isActive: true,
      isUpcoming: false,
      featuredPokemon: [
        {
          id: 133,
          name: "Eevee",
          isShiny: true,
          isLegendary: false,
          isMythical: false,
          spawnRate: "common",
          imageUrl: "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/133.png",
          shinyImageUrl: "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/shiny/133.png",
        },
      ],
      bonuses: [
        { type: "xp", multiplier: 1.5, description: "1.5x XP" },
        { type: "stardust", multiplier: 1.5, description: "1.5x Stardust" },
      ],
      activeRegions: getDefaultRegions(),
      sourceUrl: "https://pokemongolive.com",
      imageUrl: "/placeholder.svg?height=200&width=200&text=Weekend+Bonus",
      priority: "medium",
      tags: ["special", "weekend"],
    })
  }

  // GO Fest (evento anual)
  const goFestDate = new Date(now.getFullYear(), 6, 15, 10, 0, 0) // 15 de julho
  if (goFestDate > now && goFestDate.getTime() - now.getTime() < 30 * 24 * 60 * 60 * 1000) {
    // Mostrar apenas se estiver a menos de 30 dias
    events.push({
      id: "go-fest-upcoming",
      name: "GO Fest 2025",
      description: "O maior evento do ano com Pokémon raros, lendários e míticos!",
      type: "go_fest",
      startDate: goFestDate.toISOString(),
      endDate: new Date(goFestDate.getTime() + 2 * 24 * 60 * 60 * 1000).toISOString(),
      isActive: false,
      isUpcoming: true,
      featuredPokemon: [
        {
          id: 151,
          name: "Mew",
          isShiny: true,
          isLegendary: false,
          isMythical: true,
          spawnRate: "ultra_rare",
          imageUrl: "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/151.png",
          shinyImageUrl: "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/shiny/151.png",
        },
      ],
      bonuses: [
        { type: "xp", multiplier: 2, description: "2x XP em todas as atividades" },
        { type: "stardust", multiplier: 2, description: "2x Stardust" },
      ],
      activeRegions: getDefaultRegions(),
      sourceUrl: "https://pokemongolive.com",
      imageUrl: "/placeholder.svg?height=200&width=200&text=GO+Fest+2025",
      priority: "critical",
      tags: ["go_fest", "mew", "legendary", "mythical"],
    })
  }

  return events
}

function getDefaultRegions() {
  return [
    {
      name: "Global",
      country: "Worldwide",
      timezone: "UTC",
      isHighActivity: true,
      coordinates: { lat: 0, lng: 0 },
      specialSpawns: [],
    },
  ]
}

export function getUserRegion(): string {
  // Detectar região do usuário de forma legal (sem APIs de terceiros)
  try {
    const timezone = Intl.DateTimeFormat().resolvedOptions().timeZone

    if (timezone.includes("America")) return "Américas"
    if (timezone.includes("Europe")) return "Europa"
    if (timezone.includes("Asia")) return "Ásia"
    if (timezone.includes("Australia") || timezone.includes("Pacific")) return "Oceania"

    return "Global"
  } catch {
    return "Global"
  }
}

export function getEventCounts(events: LiveEvent[]) {
  return {
    total: events.length,
    active: events.filter((e) => e.isActive).length,
    upcoming: events.filter((e) => e.isUpcoming).length,
    ended: events.filter((e) => !e.isActive && !e.isUpcoming).length,
  }
}
