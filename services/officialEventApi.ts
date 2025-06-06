// Sistema legal para buscar eventos do blog oficial do Pokémon GO
export interface OfficialEvent {
  id: string
  title: string
  description: string
  publishDate: string
  url: string
  category: string
  isActive: boolean
  extractedInfo?: {
    eventType?: string
    startDate?: string
    endDate?: string
    featuredPokemon?: string[]
  }
}

// Função para buscar eventos do feed RSS oficial
export async function fetchOfficialEvents(): Promise<OfficialEvent[]> {
  try {
    // Em produção, isso seria uma chamada para um proxy server que lê o RSS
    // Por agora, vamos simular com dados que seriam extraídos do feed oficial
    const events = await simulateOfficialRSSFeed()
    return events
  } catch (error) {
    console.error("Error fetching official events:", error)
    return []
  }
}

// Simula dados que viriam do feed RSS oficial do Pokémon GO
async function simulateOfficialRSSFeed(): Promise<OfficialEvent[]> {
  // Em produção, isso seria substituído por uma chamada real ao RSS
  // https://pokemongolive.com/rss.xml

  const mockRSSData: OfficialEvent[] = [
    {
      id: "official-announcement-1",
      title: "Pokémon GO Community Day",
      description: "Join us for the next Community Day featuring a special Pokémon with exclusive moves!",
      publishDate: new Date().toISOString(),
      url: "https://pokemongolive.com/post/community-day-announcement",
      category: "Community Day",
      isActive: true,
      extractedInfo: {
        eventType: "community_day",
        startDate: getNextSaturday().toISOString(),
        endDate: new Date(getNextSaturday().getTime() + 3 * 60 * 60 * 1000).toISOString(),
        featuredPokemon: ["Charmander"],
      },
    },
    {
      id: "official-announcement-2",
      title: "Raid Hour Event",
      description: "Special Raid Hour featuring legendary Pokémon with increased spawn rates.",
      publishDate: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString(),
      url: "https://pokemongolive.com/post/raid-hour-announcement",
      category: "Raid Hour",
      isActive: false,
      extractedInfo: {
        eventType: "raid_hour",
        startDate: getNextWednesday().toISOString(),
        endDate: new Date(getNextWednesday().getTime() + 60 * 60 * 1000).toISOString(),
        featuredPokemon: ["Mewtwo"],
      },
    },
  ]

  return mockRSSData
}

function getNextSaturday(): Date {
  const now = new Date()
  const daysUntilSaturday = (6 - now.getDay() + 7) % 7
  const nextSaturday = new Date(now)

  if (daysUntilSaturday === 0 && now.getHours() >= 17) {
    nextSaturday.setDate(nextSaturday.getDate() + 7)
  } else {
    nextSaturday.setDate(nextSaturday.getDate() + daysUntilSaturday)
  }

  nextSaturday.setHours(14, 0, 0, 0)
  return nextSaturday
}

function getNextWednesday(): Date {
  const now = new Date()
  const daysUntilWednesday = (3 - now.getDay() + 7) % 7
  const nextWednesday = new Date(now)

  if (daysUntilWednesday === 0 && now.getHours() >= 19) {
    nextWednesday.setDate(nextWednesday.getDate() + 7)
  } else {
    nextWednesday.setDate(nextWednesday.getDate() + daysUntilWednesday)
  }

  nextWednesday.setHours(18, 0, 0, 0)
  return nextWednesday
}

// Função para converter eventos oficiais para o formato da aplicação
export function convertOfficialToAppEvent(officialEvent: OfficialEvent): any {
  return {
    id: officialEvent.id,
    name: officialEvent.title,
    description: officialEvent.description,
    type: officialEvent.extractedInfo?.eventType || "special",
    startDate: officialEvent.extractedInfo?.startDate || officialEvent.publishDate,
    endDate: officialEvent.extractedInfo?.endDate || officialEvent.publishDate,
    isActive: officialEvent.isActive,
    isUpcoming: !officialEvent.isActive,
    sourceUrl: officialEvent.url,
    priority: "medium",
    tags: [officialEvent.category.toLowerCase().replace(" ", "_")],
    // Dados mínimos para conformidade legal
    featuredPokemon: [],
    bonuses: [],
    activeRegions: [
      {
        name: "Global",
        country: "Worldwide",
        timezone: "UTC",
        isHighActivity: true,
        coordinates: { lat: 0, lng: 0 },
        specialSpawns: [],
      },
    ],
    imageUrl: "/placeholder.svg?height=200&width=200&text=Official+Event",
  }
}
