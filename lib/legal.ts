// Configurações e verificações legais para a aplicação

export const LEGAL_CONFIG = {
  // Fontes oficiais e legais de dados
  POKEMON_DATA_SOURCE: "PokeAPI (Official Pokémon Data)",
  POKEMON_IMAGES_SOURCE: "PokeAPI Official Sprites",
  EVENTS_SOURCE: "Pokémon GO Live Official RSS Feed",

  // URLs oficiais
  OFFICIAL_URLS: {
    POKEMON_GO_LIVE: "https://pokemongolive.com",
    POKEMON_COMPANY: "https://www.pokemon.com",
    POKEAPI: "https://pokeapi.co",
    NIANTIC: "https://nianticlabs.com",
  },

  // Disclaimers legais
  DISCLAIMERS: {
    POKEMON_TRADEMARK: "Pokémon and Pokémon character names are trademarks of Nintendo.",
    POKEMON_GO_TRADEMARK: "Pokémon GO is a trademark of Niantic, Inc.",
    FAIR_USE: "This application uses publicly available data for personal, non-commercial use.",
    NOT_AFFILIATED:
      "This application is not affiliated with, endorsed by, or connected to Nintendo, The Pokémon Company, or Niantic.",
  },
}

// Verificar se uma URL de imagem é de fonte oficial/legal
export function isLegalImageSource(imageUrl: string): boolean {
  const legalSources = [
    "raw.githubusercontent.com/PokeAPI/sprites", // Sprites oficiais do PokeAPI
    "pokeapi.co",
    "api.dicebear.com", // Para avatares de usuário
    "/placeholder.svg", // Placeholders locais
    "/images/", // Imagens locais da aplicação
  ]

  return legalSources.some((source) => imageUrl.includes(source))
}

// Verificar conformidade legal dos dados de Pokémon
export function validatePokemonData(pokemon: any): boolean {
  // Verificar se usa apenas dados factuais (não protegidos por copyright)
  const requiredFields = ["id", "name", "types"]
  const hasRequiredFields = requiredFields.every((field) => pokemon[field])

  // Verificar se as imagens são de fonte legal
  const hasLegalImages = isLegalImageSource(pokemon.imageUrl || "")

  return hasRequiredFields && hasLegalImages
}

// Gerar disclaimer legal para a aplicação
export function getLegalDisclaimer(): string {
  return `
${LEGAL_CONFIG.DISCLAIMERS.NOT_AFFILIATED}

${LEGAL_CONFIG.DISCLAIMERS.POKEMON_TRADEMARK}
${LEGAL_CONFIG.DISCLAIMERS.POKEMON_GO_TRADEMARK}

Data Sources:
- Pokémon data: ${LEGAL_CONFIG.POKEMON_DATA_SOURCE}
- Pokémon images: ${LEGAL_CONFIG.POKEMON_IMAGES_SOURCE}
- Event information: ${LEGAL_CONFIG.EVENTS_SOURCE}

${LEGAL_CONFIG.DISCLAIMERS.FAIR_USE}
  `.trim()
}
