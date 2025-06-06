"use client"

import { useState, useEffect } from "react"
import { useAuth } from "@/contexts/AuthContext"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Logo } from "@/components/Logo"
import { Loader2, AlertCircle, CheckCircle2, ChevronRight, ExternalLink, Copy, Settings } from "lucide-react"
import Image from "next/image"
import { useRouter } from "next/navigation"

export default function HomePage() {
  const { user, loading, signInWithGoogle, logout, isDemoMode, error } = useAuth()
  const [isLoggingIn, setIsLoggingIn] = useState(false)
  const [showFirebaseSetup, setShowFirebaseSetup] = useState(false)
  const router = useRouter()

  // Redirecionar para o dashboard se já estiver logado
  useEffect(() => {
    if (user && !loading) {
      console.log("🔄 Utilizador já logado, redirecionando para dashboard")
      router.push("/dashboard")
    }
  }, [user, loading, router])

  const handleLogin = async () => {
    setIsLoggingIn(true)
    try {
      console.log("🔑 Iniciando login...")
      await signInWithGoogle()
      console.log("✅ Login bem-sucedido, redirecionando...")
      router.push("/dashboard")
    } catch (error: any) {
      console.error("❌ Erro no login:", error)
    } finally {
      setIsLoggingIn(false)
    }
  }

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text)
  }

  const currentDomain = typeof window !== "undefined" ? window.location.origin : "localhost:3000"

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-600">
        <div className="text-center">
          <div className="relative w-16 h-16 mx-auto mb-4">
            <div className="absolute inset-0 rounded-full border-4 border-slate-300 opacity-25"></div>
            <div className="absolute inset-0 rounded-full border-4 border-t-blue-500 animate-spin"></div>
            <div className="absolute inset-0 flex items-center justify-center">
              <Logo size="sm" variant="icon" />
            </div>
          </div>
          <p className="text-slate-300">Carregando...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-slate-600 flex flex-col relative">
      {/* Background Pattern - usando CSS simples */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute top-10 left-10 w-4 h-4 bg-white rounded-full"></div>
        <div className="absolute top-20 right-20 w-2 h-2 bg-white rounded-full"></div>
        <div className="absolute top-40 left-1/4 w-3 h-3 bg-white rounded-full"></div>
        <div className="absolute top-60 right-1/3 w-2 h-2 bg-white rounded-full"></div>
        <div className="absolute bottom-40 left-20 w-4 h-4 bg-white rounded-full"></div>
        <div className="absolute bottom-20 right-10 w-3 h-3 bg-white rounded-full"></div>
        <div className="absolute bottom-60 left-1/3 w-2 h-2 bg-white rounded-full"></div>
        <div className="absolute top-32 left-1/2 w-3 h-3 bg-white rounded-full"></div>
        <div className="absolute bottom-32 right-1/4 w-4 h-4 bg-white rounded-full"></div>
        <div className="absolute top-80 right-1/2 w-2 h-2 bg-white rounded-full"></div>
      </div>

      {/* Content */}
      <div className="relative z-10 flex flex-col min-h-screen">
        {/* Header */}
        <header className="container mx-auto px-4 py-6">
          <Logo size="lg" className="text-white" />
        </header>

        {/* Main content */}
        <main className="flex-1 container mx-auto px-4 py-8 flex items-center justify-center">
          <div className="w-full max-w-md">
            <Tabs defaultValue={isDemoMode ? "demo" : "login"} className="w-full">
              <TabsList className="grid w-full grid-cols-2 mb-8 bg-white/10 border-0">
                <TabsTrigger
                  value="login"
                  disabled={isDemoMode}
                  className="data-[state=active]:bg-white data-[state=active]:text-slate-900 text-white"
                >
                  Login Google
                </TabsTrigger>
                <TabsTrigger
                  value="demo"
                  className="data-[state=active]:bg-white data-[state=active]:text-slate-900 text-white"
                >
                  Modo Demo
                </TabsTrigger>
              </TabsList>

              <TabsContent value="login">
                <Card className="border-0 shadow-2xl bg-white">
                  <CardHeader className="pb-2 text-center">
                    <div className="w-20 h-20 mx-auto mb-4 relative">
                      <Image
                        src="https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/25.png"
                        alt="Pikachu"
                        width={100}
                        height={100}
                        className="drop-shadow-md"
                      />
                    </div>
                    <h1 className="text-2xl font-bold text-slate-900">Bem-vindo, Treinador!</h1>
                    <p className="text-sm text-slate-600">Faça login para acessar sua Pokédex pessoal</p>
                  </CardHeader>

                  <CardContent className="space-y-4">
                    {error && (
                      <Alert variant="destructive">
                        <AlertCircle className="h-4 w-4" />
                        <AlertTitle>Erro de Autenticação</AlertTitle>
                        <AlertDescription className="mt-2">
                          {error}
                          {error.includes("unauthorized-domain") && (
                            <div className="mt-3">
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => setShowFirebaseSetup(!showFirebaseSetup)}
                                className="w-full"
                              >
                                <Settings className="h-4 w-4 mr-2" />
                                Ver instruções de configuração
                              </Button>
                            </div>
                          )}
                        </AlertDescription>
                      </Alert>
                    )}

                    {showFirebaseSetup && (
                      <Alert>
                        <Settings className="h-4 w-4" />
                        <AlertTitle>Configuração do Firebase</AlertTitle>
                        <AlertDescription className="mt-2 space-y-3">
                          <p className="text-sm">Para corrigir o erro de domínio não autorizado:</p>
                          <ol className="text-sm space-y-2 list-decimal list-inside">
                            <li>
                              Acesse o{" "}
                              <a
                                href="https://console.firebase.google.com"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-blue-600 hover:underline inline-flex items-center"
                              >
                                Firebase Console <ExternalLink className="h-3 w-3 ml-1" />
                              </a>
                            </li>
                            <li>
                              Selecione seu projeto:{" "}
                              <code className="bg-slate-100 px-1 rounded">mypokedexgo-356ab</code>
                            </li>
                            <li>
                              Vá para <strong>Authentication</strong> → <strong>Settings</strong> →{" "}
                              <strong>Authorized domains</strong>
                            </li>
                            <li>
                              Adicione este domínio:
                              <div className="flex items-center gap-2 mt-1">
                                <code className="bg-slate-100 px-2 py-1 rounded text-xs flex-1">{currentDomain}</code>
                                <Button
                                  variant="outline"
                                  size="sm"
                                  onClick={() => copyToClipboard(currentDomain)}
                                  className="h-8 w-8 p-0"
                                >
                                  <Copy className="h-3 w-3" />
                                </Button>
                              </div>
                            </li>
                            <li>Salve as alterações e tente fazer login novamente</li>
                          </ol>
                        </AlertDescription>
                      </Alert>
                    )}

                    {!isDemoMode && !error && (
                      <Alert variant="success" className="bg-green-50 text-green-800 border-green-200">
                        <CheckCircle2 className="h-4 w-4 text-green-600" />
                        <AlertDescription>Firebase configurado e pronto para uso!</AlertDescription>
                      </Alert>
                    )}

                    {isDemoMode && (
                      <Alert>
                        <AlertCircle className="h-4 w-4" />
                        <AlertDescription>
                          Firebase não configurado. Configure as variáveis de ambiente ou use o modo demo.
                        </AlertDescription>
                      </Alert>
                    )}

                    <Button
                      onClick={handleLogin}
                      className="w-full h-12 gap-2 bg-slate-900 hover:bg-slate-800 text-white"
                      disabled={isLoggingIn || isDemoMode}
                    >
                      {isLoggingIn ? (
                        <Loader2 className="h-4 w-4 animate-spin" />
                      ) : (
                        <svg className="w-5 h-5" viewBox="0 0 24 24">
                          <path
                            fill="currentColor"
                            d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                          />
                          <path
                            fill="currentColor"
                            d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                          />
                          <path
                            fill="currentColor"
                            d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                          />
                          <path
                            fill="currentColor"
                            d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                          />
                        </svg>
                      )}
                      {isLoggingIn ? "Entrando..." : "Entrar com Google"}
                    </Button>

                    {isDemoMode && (
                      <p className="text-xs text-center text-slate-600">
                        O login com Google está desabilitado no modo demo.
                      </p>
                    )}
                  </CardContent>

                  <CardFooter className="text-xs text-center text-slate-600 flex flex-col">
                    <p>Ao fazer login, você aceita nossos termos de serviço e política de privacidade.</p>
                  </CardFooter>
                </Card>
              </TabsContent>

              <TabsContent value="demo">
                <Card className="border-0 shadow-2xl bg-white">
                  <CardHeader className="pb-2 text-center">
                    <div className="w-20 h-20 mx-auto mb-4 relative">
                      <Image
                        src="https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/133.png"
                        alt="Eevee"
                        width={100}
                        height={100}
                        className="drop-shadow-md"
                      />
                    </div>
                    <h1 className="text-2xl font-bold text-slate-900">Modo Demonstração</h1>
                    <p className="text-sm text-slate-600">Experimente todas as funcionalidades sem criar uma conta</p>
                  </CardHeader>

                  <CardContent className="space-y-4">
                    <div className="space-y-2">
                      <div className="flex items-center gap-2">
                        <CheckCircle2 className="h-4 w-4 text-green-600" />
                        <p className="text-sm text-slate-700">Explore a Pokédex completa</p>
                      </div>
                      <div className="flex items-center gap-2">
                        <CheckCircle2 className="h-4 w-4 text-green-600" />
                        <p className="text-sm text-slate-700">Marque Pokémons como capturados</p>
                      </div>
                      <div className="flex items-center gap-2">
                        <CheckCircle2 className="h-4 w-4 text-green-600" />
                        <p className="text-sm text-slate-700">Veja estatísticas e comparações</p>
                      </div>
                      <div className="flex items-center gap-2">
                        <CheckCircle2 className="h-4 w-4 text-green-600" />
                        <p className="text-sm text-slate-700">Teste todas as funcionalidades</p>
                      </div>
                    </div>

                    <Alert variant="warning" className="bg-amber-50 text-amber-800 border-amber-200">
                      <AlertCircle className="h-4 w-4 text-amber-600" />
                      <AlertDescription>
                        Seus dados serão salvos apenas localmente neste dispositivo e podem ser perdidos ao limpar o
                        navegador.
                      </AlertDescription>
                    </Alert>

                    <Button
                      onClick={handleLogin}
                      className="w-full h-12 bg-amber-500 hover:bg-amber-600 text-white"
                      disabled={isLoggingIn}
                    >
                      {isLoggingIn ? (
                        <>
                          <Loader2 className="h-4 w-4 animate-spin mr-2" />
                          Iniciando...
                        </>
                      ) : (
                        <>
                          Iniciar Modo Demo
                          <ChevronRight className="h-4 w-4 ml-2" />
                        </>
                      )}
                    </Button>
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          </div>
        </main>

        {/* Footer */}
        <footer className="relative z-10 container mx-auto px-4 py-6 text-center text-white/60 text-sm">
          <p>© 2025 MyPokédex GO. Não afiliado à Nintendo ou The Pokémon Company.</p>
        </footer>
      </div>

      {/* Floating Pokémon */}
      <div className="absolute bottom-0 right-0 opacity-10 pointer-events-none">
        <Image
          src="https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/6.png"
          alt="Charizard"
          width={300}
          height={300}
        />
      </div>
      <div className="absolute top-20 left-10 opacity-5 pointer-events-none">
        <Image
          src="https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/9.png"
          alt="Blastoise"
          width={200}
          height={200}
        />
      </div>
    </div>
  )
}
