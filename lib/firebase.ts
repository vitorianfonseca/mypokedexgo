// Verificar se estamos em modo demo ANTES de tentar inicializar Firebase
export const isDemoMode =
  !process.env.NEXT_PUBLIC_FIREBASE_API_KEY ||
  process.env.NEXT_PUBLIC_FIREBASE_API_KEY === "" ||
  process.env.NEXT_PUBLIC_FIREBASE_API_KEY === "demo"

console.log("🔍 Firebase config check:", {
  hasApiKey: !!process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY?.substring(0, 10) + "...",
  isDemoMode,
})

// Só importar e inicializar Firebase se NÃO estivermos em modo demo
let app: any = null
let auth: any = null
let db: any = null
let googleProvider: any = null

if (!isDemoMode) {
  try {
    const { initializeApp, getApps } = require("firebase/app")
    const { getAuth, GoogleAuthProvider } = require("firebase/auth")
    const { getFirestore } = require("firebase/firestore")

    const firebaseConfig = {
      apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
      authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
      projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
      storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
      messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
      appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
    }

    app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApps()[0]
    auth = getAuth(app)
    db = getFirestore(app)
    googleProvider = new GoogleAuthProvider()
    
    // Configure Google provider with additional scopes if needed
    googleProvider.addScope('profile')
    googleProvider.addScope('email')

    console.log("✅ Firebase inicializado com sucesso")
  } catch (error) {
    console.warn("⚠️ Erro ao inicializar Firebase, ativando modo demo:", error)
  }
} else {
  console.log("🎮 Modo demo ativo - Firebase desabilitado")
}

export { auth, db, googleProvider }
