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
  const { user, loading, signInWithGoogle, signInWithDemo, logout, clearDemoUser, isDemoMode, error } = useAuth()
  const [isLoggingIn, setIsLoggingIn] = useState(false)
  const [isDemoLoggingIn, setIsDemoLoggingIn] = useState(false)
  const [showFirebaseSetup, setShowFirebaseSetup] = useState(false)
  const router = useRouter()

  // Redirect to dashboard if already logged in
  useEffect(() => {
    if (user && !loading) {
      console.log("🔄 User already logged in, redirecting to dashboard")
      router.push("/dashboard")
    }
  }, [user, loading, router])

  const handleLogin = async () => {
    setIsLoggingIn(true)
    try {
      console.log("🔑 Starting login...")
      await signInWithGoogle()
      console.log("✅ Login successful, redirecting...")
      router.push("/dashboard")
    } catch (error: any) {
      console.error("❌ Login error:", error)
      // Don't automatically redirect to demo mode
    } finally {
      setIsLoggingIn(false)
    }
  }

  const handleDemoLogin = async () => {
    setIsDemoLoggingIn(true)
    try {
      console.log("🎮 Starting demo login...")
      await signInWithDemo()
      console.log("✅ Demo login successful, redirecting...")
      router.push("/dashboard")
    } catch (error: any) {
      console.error("❌ Demo login error:", error)
    } finally {
      setIsDemoLoggingIn(false)
    }
  }

  const copyToClipboard = async (text: string) => {
    try {
      // Try to use the Clipboard API if available and allowed
      if (navigator.clipboard && window.isSecureContext) {
        await navigator.clipboard.writeText(text)
        console.log("Text copied to clipboard via Clipboard API")
      } else {
        // Fallback method for older browsers or non-HTTPS contexts
        const textArea = document.createElement('textarea')
        textArea.value = text
        textArea.style.position = 'fixed'
        textArea.style.left = '-999999px'
        textArea.style.top = '-999999px'
        document.body.appendChild(textArea)
        textArea.focus()
        textArea.select()
        document.execCommand('copy')
        textArea.remove()
        console.log("Text copied to clipboard via fallback method")
      }
    } catch (error) {
      console.warn("Failed to copy text to clipboard:", error)
      // You could show a toast notification here instead
    }
  }

  const handleClearAuth = () => {
    clearDemoUser()
    localStorage.clear() // Clear all localStorage data
    console.log("🧹 All authentication data cleared")
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
          <p className="text-slate-300">Loading...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-slate-600 flex flex-col relative">
      {/* Background Pattern - using simple CSS */}
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
              <TabsList className="grid w-full grid-cols-2 mb-8 bg-white/10 border-0 p-1 rounded-lg backdrop-blur-sm">
                <TabsTrigger
                  value="login"
                  disabled={isDemoMode}
                  className="
                    relative overflow-hidden rounded-md px-4 py-2.5 text-sm font-medium
                    transition-all duration-300 ease-in-out
                    text-white/80 hover:text-white hover:bg-white/5
                    data-[state=active]:bg-white data-[state=active]:text-slate-900 
                    data-[state=active]:shadow-lg data-[state=active]:shadow-white/10
                    data-[state=active]:scale-[0.98] data-[state=active]:font-semibold
                    disabled:opacity-50 disabled:cursor-not-allowed
                    before:absolute before:inset-0 before:bg-gradient-to-r 
                    before:from-transparent before:via-white/5 before:to-transparent
                    before:translate-x-[-100%] hover:before:translate-x-[100%]
                    before:transition-transform before:duration-700
                  "
                >
                  Google Login
                </TabsTrigger>
                <TabsTrigger
                  value="demo"
                  className="
                    relative overflow-hidden rounded-md px-4 py-2.5 text-sm font-medium
                    transition-all duration-300 ease-in-out
                    text-white/80 hover:text-white hover:bg-white/5
                    data-[state=active]:bg-white data-[state=active]:text-slate-900 
                    data-[state=active]:shadow-lg data-[state=active]:shadow-white/10
                    data-[state=active]:scale-[0.98] data-[state=active]:font-semibold
                    before:absolute before:inset-0 before:bg-gradient-to-r 
                    before:from-transparent before:via-white/5 before:to-transparent
                    before:translate-x-[-100%] hover:before:translate-x-[100%]
                    before:transition-transform before:duration-700
                  "
                >
                  Demo Mode
                </TabsTrigger>
              </TabsList>

              <TabsContent value="login">
                <Card className="
                  border-0 shadow-2xl bg-white
                  transition-all duration-300 ease-in-out
                  hover:shadow-3xl hover:shadow-white/20 hover:scale-[1.01]
                  animate-in fade-in-0 zoom-in-95 duration-300
                ">
                  <CardHeader className="pb-2 text-center">
                    <div className="w-20 h-20 mx-auto mb-4 relative transform transition-transform duration-300 hover:scale-110">
                      <Image
                        src="https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/25.png"
                        alt="Pikachu"
                        width={100}
                        height={100}
                        className="drop-shadow-md transition-all duration-300 hover:drop-shadow-lg"
                      />
                    </div>
                    <h1 className="text-2xl font-bold text-slate-900">Welcome, Trainer!</h1>
                    <p className="text-sm text-slate-600">Sign in to access your personal Pokédex</p>
                  </CardHeader>

                  <CardContent className="space-y-4">
                    {error && (
                      <Alert variant="destructive">
                        <AlertCircle className="h-4 w-4" />
                        <AlertTitle>Authentication Error</AlertTitle>
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
                                View configuration instructions
                              </Button>
                            </div>
                          )}
                        </AlertDescription>
                      </Alert>
                    )}

                    {showFirebaseSetup && (
                      <Alert>
                        <Settings className="h-4 w-4" />
                        <AlertTitle>Firebase Configuration</AlertTitle>
                        <AlertDescription className="mt-2 space-y-3">
                          <p className="text-sm">To fix the unauthorized domain error:</p>
                          <ol className="text-sm space-y-2 list-decimal list-inside">
                            <li>
                              Access the{" "}
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
                              Select your project:{" "}
                              <code className="bg-slate-100 px-1 rounded">mypokedexgo-356ab</code>
                            </li>
                            <li>
                              Go to <strong>Authentication</strong> → <strong>Settings</strong> →{" "}
                              <strong>Authorized domains</strong>
                            </li>
                            <li>
                              Add this domain:
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
                            <li>Save the changes and try signing in again</li>
                          </ol>
                        </AlertDescription>
                      </Alert>
                    )}

                    {!isDemoMode && !error && (
                      <Alert variant="default" className="bg-green-50 text-green-800 border-green-200">
                        <CheckCircle2 className="h-4 w-4 text-green-600" />
                        <AlertDescription>Firebase configured and ready to use!</AlertDescription>
                      </Alert>
                    )}

                    {isDemoMode && (
                      <Alert>
                        <AlertCircle className="h-4 w-4" />
                        <AlertDescription>
                          Firebase not configured. Set up environment variables or use demo mode.
                        </AlertDescription>
                      </Alert>
                    )}

                    <Button
                      onClick={handleLogin}
                      className="
                        group relative w-full h-12 gap-2 overflow-hidden
                        bg-white hover:bg-gray-50 text-gray-900 border border-gray-300
                        transition-all duration-300 ease-in-out
                        hover:shadow-lg hover:shadow-gray-200/50 hover:scale-[1.02]
                        active:scale-[0.98] active:duration-75
                        disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100
                        before:absolute before:inset-0 before:bg-gradient-to-r 
                        before:from-transparent before:via-gray-100/50 before:to-transparent
                        before:translate-x-[-100%] hover:before:translate-x-[100%]
                        before:transition-transform before:duration-700
                      "
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
                      {isLoggingIn ? "Signing in..." : "Sign in with Google"}
                    </Button>

                    {isDemoMode && (
                      <p className="text-xs text-center text-slate-600">
                        Google login is disabled in demo mode.
                      </p>
                    )}
                  </CardContent>

                  <CardFooter className="text-xs text-center text-slate-600 flex flex-col">
                    <p>By signing in, you accept our terms of service and privacy policy.</p>
                  </CardFooter>
                </Card>
              </TabsContent>

              <TabsContent value="demo">
                <Card className="
                  border-0 shadow-2xl bg-white
                  transition-all duration-300 ease-in-out
                  hover:shadow-3xl hover:shadow-amber-500/10 hover:scale-[1.01]
                  animate-in fade-in-0 zoom-in-95 duration-300
                ">
                  <CardHeader className="pb-2 text-center">
                    <div className="w-20 h-20 mx-auto mb-4 relative transform transition-transform duration-300 hover:scale-110">
                      <Image
                        src="https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/133.png"
                        alt="Eevee"
                        width={100}
                        height={100}
                        className="drop-shadow-md transition-all duration-300 hover:drop-shadow-lg"
                      />
                    </div>
                    <h1 className="text-2xl font-bold text-slate-900">Demo Mode</h1>
                    <p className="text-sm text-slate-600">Try all features without creating an account</p>
                  </CardHeader>

                  <CardContent className="space-y-4">
                    <div className="space-y-2">
                      <div className="flex items-center gap-2">
                        <CheckCircle2 className="h-4 w-4 text-green-600" />
                        <p className="text-sm text-slate-700">Explore the complete Pokédex</p>
                      </div>
                      <div className="flex items-center gap-2">
                        <CheckCircle2 className="h-4 w-4 text-green-600" />
                        <p className="text-sm text-slate-700">Mark Pokémon as caught</p>
                      </div>
                      <div className="flex items-center gap-2">
                        <CheckCircle2 className="h-4 w-4 text-green-600" />
                        <p className="text-sm text-slate-700">View statistics and comparisons</p>
                      </div>
                      <div className="flex items-center gap-2">
                        <CheckCircle2 className="h-4 w-4 text-green-600" />
                        <p className="text-sm text-slate-700">Test all features</p>
                      </div>
                    </div>

                    <Alert variant="default" className="bg-amber-50 text-amber-800 border-amber-200">
                      <AlertCircle className="h-4 w-4 text-amber-600" />
                      <AlertDescription>
                        Your data will be saved only locally on this device and may be lost when clearing the browser.
                      </AlertDescription>
                    </Alert>

                    <Button
                      onClick={handleDemoLogin}
                      className="
                        group relative w-full h-12 overflow-hidden
                        bg-amber-500 hover:bg-amber-600 text-white
                        transition-all duration-300 ease-in-out
                        hover:shadow-lg hover:shadow-amber-500/30 hover:scale-[1.02]
                        active:scale-[0.98] active:duration-75
                        disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100
                        before:absolute before:inset-0 before:bg-gradient-to-r 
                        before:from-transparent before:via-amber-300/30 before:to-transparent
                        before:translate-x-[-100%] hover:before:translate-x-[100%]
                        before:transition-transform before:duration-700
                      "
                      disabled={isDemoLoggingIn}
                    >
                      {isDemoLoggingIn ? (
                        <>
                          <Loader2 className="h-4 w-4 animate-spin mr-2" />
                          Starting...
                        </>
                      ) : (
                        <>
                          Start Demo Mode
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
        <footer className="relative z-10 container mx-auto px-4 py-6 text-center text-white/60 text-sm space-y-3">
          <p>© 2025 MyPokédex GO. Not affiliated with Nintendo or The Pokémon Company.</p>
          
          {/* Debug Button - Only show if there's a persistent user or error */}
          {(user || error) && (
            <Button
              onClick={handleClearAuth}
              variant="outline"
              size="sm"
              className="bg-white/10 border-white/20 text-white/80 hover:bg-white/20 text-xs"
            >
              Clear Authentication Data
            </Button>
          )}
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
