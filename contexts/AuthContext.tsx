"use client"

import type React from "react"
import { createContext, useContext, useEffect, useState } from "react"
import { isDemoMode } from "@/lib/firebase"

// Só importar Firebase se não estivermos em modo demo
let auth: any = null
let googleProvider: any = null
let onAuthStateChanged: any = null
let signInWithPopup: any = null
let signOut: any = null
let updateProfile: any = null

if (!isDemoMode) {
  try {
    const firebaseAuth = require("firebase/auth")
    const firebaseConfig = require("@/lib/firebase")

    auth = firebaseConfig.auth
    googleProvider = firebaseConfig.googleProvider
    onAuthStateChanged = firebaseAuth.onAuthStateChanged
    signInWithPopup = firebaseAuth.signInWithPopup
    signOut = firebaseAuth.signOut
    updateProfile = firebaseAuth.updateProfile
  } catch (error) {
    console.warn("⚠️ Erro ao importar Firebase auth:", error)
  }
}

interface User {
  uid: string
  displayName: string | null
  email: string | null
  photoURL: string | null
  metadata: {
    creationTime: string
  }
}

interface AuthContextType {
  user: User | null
  loading: boolean
  signInWithGoogle: () => Promise<void>
  signInWithDemo: () => Promise<void>
  logout: () => Promise<void>
  clearDemoUser: () => void
  updateProfile: (profile: { displayName?: string; photoURL?: string | null }) => Promise<void>
  isDemoMode: boolean
  error: string | null
}

const AuthContext = createContext<AuthContextType>({} as AuthContextType)

export const useAuth = () => useContext(AuthContext)

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    console.log("🔍 AuthProvider iniciado - isDemoMode:", isDemoMode)

    if (isDemoMode) {
      console.log("🎮 Modo demo ativo")

      // Verificar se há utilizador demo salvo
      const savedDemoUser = localStorage.getItem("demo-user")
      if (savedDemoUser) {
        try {
          const demoUser = JSON.parse(savedDemoUser)
          setUser(demoUser)
          console.log("🔄 Utilizador demo restaurado:", demoUser.displayName)
        } catch (error) {
          console.warn("⚠️ Erro ao restaurar utilizador demo:", error)
          localStorage.removeItem("demo-user")
        }
      }

      setLoading(false)
      return
    }

    if (!auth || !onAuthStateChanged) {
      console.warn("⚠️ Firebase auth não disponível")
      setLoading(false)
      return
    }

    console.log("🔥 Configurando listener do Firebase")
    const unsubscribe = onAuthStateChanged(auth, (firebaseUser: any) => {
      console.log("🔄 Auth state changed:", firebaseUser?.displayName || "No user")
      if (firebaseUser) {
        setUser({
          uid: firebaseUser.uid,
          displayName: firebaseUser.displayName,
          email: firebaseUser.email,
          photoURL: firebaseUser.photoURL,
          metadata: {
            creationTime: firebaseUser.metadata.creationTime,
          },
        })
      } else {
        setUser(null)
      }
      setLoading(false)
      setError(null)
    })

    return unsubscribe
  }, [])

  const signInWithGoogle = async () => {
    console.log("🚀 Iniciando login - isDemoMode:", isDemoMode)
    setError(null)
    setLoading(true)

    try {
      if (isDemoMode || !auth || !googleProvider || !signInWithPopup) {
        // Modo demo - criar utilizador fictício
        console.log("🎮 Criando utilizador demo...")

        const mockUser: User = {
          uid: "demo-user-" + Date.now(),
          displayName: "Demo Trainer",
          email: "demo@mypokedex.go",
          photoURL: "https://api.dicebear.com/7.x/avataaars/svg?seed=demo",
          metadata: {
            creationTime: new Date().toISOString(),
          },
        }

        setUser(mockUser)
        localStorage.setItem("demo-user", JSON.stringify(mockUser))
        console.log("✅ Utilizador demo criado e salvo:", mockUser.displayName)
        return
      }

      console.log("🔐 Tentando login com Google...")
      const result = await signInWithPopup(auth, googleProvider)
      console.log("✅ Login com Google bem-sucedido")
    } catch (error: any) {
      console.error("❌ Erro no login:", error)

      let errorMessage = "Erro desconhecido ao fazer login"

      if (error.code === "auth/unauthorized-domain") {
        errorMessage = "Domínio não autorizado. Configure o Firebase para permitir este domínio."
      } else if (error.code === "auth/popup-closed-by-user") {
        errorMessage = "Login cancelado pelo utilizador."
      } else if (error.code === "auth/network-request-failed") {
        errorMessage = "Erro de rede. Verifique sua conexão."
      } else if (error.code === "auth/configuration-not-found") {
        errorMessage = "Configuração do Firebase não encontrada."
      }

      setError(errorMessage)
      
      // NÃO criar demo user automaticamente em caso de erro
      // Deixar o usuário decidir o que fazer
      throw error
    } finally {
      setLoading(false)
    }
  }

  const signInWithDemo = async () => {
    console.log("🎮 Iniciando login demo...")
    setError(null)
    setLoading(true)

    try {
      const mockUser: User = {
        uid: "demo-user-" + Date.now(),
        displayName: "Demo Trainer",
        email: "demo@mypokedex.go",
        photoURL: "https://api.dicebear.com/7.x/avataaars/svg?seed=demo",
        metadata: {
          creationTime: new Date().toISOString(),
        },
      }

      setUser(mockUser)
      localStorage.setItem("demo-user", JSON.stringify(mockUser))
      console.log("✅ Utilizador demo criado e salvo:", mockUser.displayName)
    } catch (error: any) {
      console.error("❌ Erro ao criar usuário demo:", error)
      setError("Erro ao criar usuário demo")
    } finally {
      setLoading(false)
    }
  }

  const clearDemoUser = () => {
    console.log("🧹 Clearing demo user data...")
    setUser(null)
    localStorage.removeItem("demo-user")
    setError(null)
  }

  const logout = async () => {
    setError(null)
    setLoading(true)
    console.log("🚪 Fazendo logout...")

    try {
      // Limpar dados locais primeiro
      setUser(null)
      localStorage.removeItem("demo-user")
      
      if (!isDemoMode && auth && signOut) {
        // Tentar fazer logout do Firebase
        await signOut(auth)
        console.log("✅ Logout Firebase concluído")
      } else {
        console.log("✅ Logout demo concluído")
      }
    } catch (error: any) {
      console.error("❌ Erro no logout:", error)
      // Mesmo com erro, garantir que o estado local seja limpo
      setUser(null)
      localStorage.removeItem("demo-user")
    } finally {
      setLoading(false)
    }
  }

  const updateUserProfile = async (profile: { displayName?: string; photoURL?: string | null }) => {
    if (!user) {
      throw new Error("Nenhum utilizador logado")
    }

    console.log("📝 Atualizando perfil:", profile)

    if (isDemoMode || !auth || !updateProfile) {
      // Modo demo - atualizar localmente
      const updatedUser = {
        ...user,
        displayName: profile.displayName !== undefined ? profile.displayName : user.displayName,
        photoURL: profile.photoURL !== undefined ? profile.photoURL : user.photoURL,
      }

      setUser(updatedUser)
      localStorage.setItem("demo-user", JSON.stringify(updatedUser))
      console.log("✅ Perfil demo atualizado")
      return
    }

    try {
      // Firebase - atualizar perfil
      await updateProfile(auth.currentUser, {
        displayName: profile.displayName !== undefined ? profile.displayName : auth.currentUser.displayName,
        photoURL: profile.photoURL !== undefined ? profile.photoURL : auth.currentUser.photoURL,
      })

      // Atualizar estado local
      const updatedUser = {
        ...user,
        displayName: profile.displayName !== undefined ? profile.displayName : user.displayName,
        photoURL: profile.photoURL !== undefined ? profile.photoURL : user.photoURL,
      }
      setUser(updatedUser)

      console.log("✅ Perfil Firebase atualizado")
    } catch (error: any) {
      console.error("❌ Erro ao atualizar perfil:", error)
      throw new Error(error.message || "Erro ao atualizar perfil")
    }
  }

  const value = {
    user,
    loading,
    signInWithGoogle,
    signInWithDemo,
    logout,
    clearDemoUser,
    updateProfile: updateUserProfile,
    isDemoMode: isDemoMode || !auth,
    error,
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}
