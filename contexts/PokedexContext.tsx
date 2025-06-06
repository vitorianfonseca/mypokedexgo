"use client"

import type React from "react"
import { createContext, useContext, useEffect, useState } from "react"
import { isDemoMode } from "@/lib/firebase"
import { useAuth } from "./AuthContext"

// Só importar Firestore se não estivermos em modo demo
let db: any = null
let doc: any = null
let setDoc: any = null
let onSnapshot: any = null

if (!isDemoMode) {
  try {
    const firestore = require("firebase/firestore")
    const firebaseConfig = require("@/lib/firebase")

    db = firebaseConfig.db
    doc = firestore.doc
    setDoc = firestore.setDoc
    onSnapshot = firestore.onSnapshot
  } catch (error) {
    console.warn("⚠️ Erro ao importar Firestore:", error)
  }
}

export interface PokemonStatus {
  caught: boolean
  shiny: boolean
  lucky: boolean
  shadow: boolean
  purified: boolean
  notes?: string
  dateAdded?: string
}

interface PokedexContextType {
  pokemonStatus: Record<number, PokemonStatus>
  updatePokemonStatus: (pokemonId: number, status: Partial<PokemonStatus>) => void
  getStats: () => {
    totalCaught: number
    totalShiny: number
    totalLucky: number
    totalShadow: number
    totalPurified: number
    completionPercentage: number
  }
}

const PokedexContext = createContext<PokedexContextType>({} as PokedexContextType)

export const usePokedex = () => useContext(PokedexContext)

export function PokedexProvider({ children }: { children: React.ReactNode }) {
  const { user } = useAuth()
  const [pokemonStatus, setPokemonStatus] = useState<Record<number, PokemonStatus>>({})

  useEffect(() => {
    if (!user) {
      setPokemonStatus({})
      return
    }

    console.log("📊 PokedexProvider - user:", user.displayName, "isDemoMode:", isDemoMode)

    if (isDemoMode || !db || !doc || !onSnapshot) {
      // Modo demo - usar localStorage
      console.log("💾 Usando localStorage para dados demo")
      const savedData = localStorage.getItem("mypokedex-demo-data")
      if (savedData) {
        try {
          const parsedData = JSON.parse(savedData)
          setPokemonStatus(parsedData)
          console.log("✅ Dados demo carregados:", Object.keys(parsedData).length, "Pokémons")
        } catch (error) {
          console.error("❌ Erro ao carregar dados demo:", error)
        }
      }
      return
    }

    // Modo Firebase
    console.log("🔥 Usando Firebase para dados")
    const userDocRef = doc(db, "users", user.uid)

    const unsubscribe = onSnapshot(userDocRef, (docSnapshot: any) => {
      if (docSnapshot.exists()) {
        const data = docSnapshot.data()
        setPokemonStatus(data.pokedex || {})
        console.log("✅ Dados Firebase carregados")
      }
    })

    return unsubscribe
  }, [user])

  const updatePokemonStatus = async (pokemonId: number, status: Partial<PokemonStatus>) => {
    if (!user) {
      console.warn("⚠️ Tentativa de atualizar sem utilizador")
      return
    }

    const currentStatus = pokemonStatus[pokemonId] || {
      caught: false,
      shiny: false,
      lucky: false,
      shadow: false,
      purified: false,
    }

    const newStatus = { ...currentStatus, ...status }

    // Se marcar como apanhado, adicionar data
    if (status.caught && !currentStatus.caught) {
      newStatus.dateAdded = new Date().toISOString()
    }

    const updatedPokedex = {
      ...pokemonStatus,
      [pokemonId]: newStatus,
    }

    setPokemonStatus(updatedPokedex)
    console.log("📝 Pokémon atualizado:", pokemonId, newStatus)

    if (isDemoMode || !db || !doc || !setDoc) {
      // Modo demo - salvar no localStorage
      localStorage.setItem("mypokedex-demo-data", JSON.stringify(updatedPokedex))
      console.log("💾 Dados salvos no localStorage")
      return
    }

    // Modo Firebase
    try {
      const userDocRef = doc(db, "users", user.uid)
      await setDoc(userDocRef, { pokedex: updatedPokedex }, { merge: true })
      console.log("🔥 Dados salvos no Firebase")
    } catch (error) {
      console.error("❌ Erro ao salvar no Firebase:", error)
      // Fallback para localStorage se Firebase falhar
      localStorage.setItem("mypokedex-demo-data", JSON.stringify(updatedPokedex))
      console.log("💾 Fallback: dados salvos no localStorage")
    }
  }

  const getStats = () => {
    const statuses = Object.values(pokemonStatus)
    const totalPokemon = 1025 // CORRIGIDO: Total correto de Pokémons

    return {
      totalCaught: statuses.filter((s) => s.caught).length,
      totalShiny: statuses.filter((s) => s.shiny).length,
      totalLucky: statuses.filter((s) => s.lucky).length,
      totalShadow: statuses.filter((s) => s.shadow).length,
      totalPurified: statuses.filter((s) => s.purified).length,
      completionPercentage: Math.round((statuses.filter((s) => s.caught).length / totalPokemon) * 100),
    }
  }

  const value = {
    pokemonStatus,
    updatePokemonStatus,
    getStats,
  }

  return <PokedexContext.Provider value={value}>{children}</PokedexContext.Provider>
}
