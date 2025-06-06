"use client"

import type React from "react"

import { useState } from "react"
import { Dialog, DialogContent, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { useAuth } from "@/contexts/AuthContext"
import { usePokedex } from "@/contexts/PokedexContext"
import {
  User,
  Trophy,
  Star,
  Sparkles,
  Moon,
  Sun,
  Calendar,
  Award,
  Crown,
  Edit,
  Save,
  X,
  Upload,
  Camera,
} from "lucide-react"
import { generationStats } from "@/data/pokemon"

export function UserProfile() {
  const { user, isDemoMode, updateProfile } = useAuth()
  const { getStats, pokemonStatus } = usePokedex()
  const [isOpen, setIsOpen] = useState(false)
  const [isEditing, setIsEditing] = useState(false)
  const [editForm, setEditForm] = useState({
    displayName: user?.displayName || "",
    photoURL: user?.photoURL || "",
  })
  const [isUpdating, setIsUpdating] = useState(false)
  const [updateError, setUpdateError] = useState<string | null>(null)

  if (!user) return null

  const stats = getStats()

  // Calcular estatísticas adicionais
  const totalPokemon = Object.keys(pokemonStatus).length
  const caughtPokemon = Object.values(pokemonStatus).filter((s) => s.caught)
  const memberSince = new Date(user.metadata.creationTime).toLocaleDateString("pt-PT")

  // Calcular progresso por geração
  const generationProgress = Object.entries(generationStats).map(([gen, info]) => {
    const genPokemon = Array.from({ length: info.count }, (_, i) => {
      const startId =
        gen === "1"
          ? 1
          : Object.entries(generationStats)
              .slice(0, Number(gen) - 1)
              .reduce((sum, [, g]) => sum + g.count, 1)
      return startId + i
    })

    const caughtInGen = genPokemon.filter((id) => pokemonStatus[id]?.caught).length
    const percentage = Math.round((caughtInGen / info.count) * 100)

    return {
      generation: gen,
      name: info.name,
      caught: caughtInGen,
      total: info.count,
      percentage,
    }
  })

  // Conquistas
  const achievements = [
    {
      id: "first_catch",
      name: "Primeiro Pokémon",
      description: "Capture seu primeiro Pokémon",
      icon: Trophy,
      unlocked: stats.totalCaught > 0,
      color: "text-green-600",
    },
    {
      id: "shiny_hunter",
      name: "Caçador Shiny",
      description: "Capture um Pokémon Shiny",
      icon: Sparkles,
      unlocked: stats.totalShiny > 0,
      color: "text-yellow-600",
    },
    {
      id: "lucky_trainer",
      name: "Treinador Sortudo",
      description: "Obtenha um Pokémon Lucky",
      icon: Star,
      unlocked: stats.totalLucky > 0,
      color: "text-orange-600",
    },
    {
      id: "shadow_master",
      name: "Mestre das Sombras",
      description: "Capture um Pokémon Shadow",
      icon: Moon,
      unlocked: stats.totalShadow > 0,
      color: "text-purple-600",
    },
    {
      id: "purifier",
      name: "Purificador",
      description: "Purifique um Pokémon",
      icon: Sun,
      unlocked: stats.totalPurified > 0,
      color: "text-blue-600",
    },
    {
      id: "collector",
      name: "Colecionador",
      description: "Capture 50 Pokémons",
      icon: Award,
      unlocked: stats.totalCaught >= 50,
      color: "text-indigo-600",
    },
    {
      id: "master",
      name: "Mestre Pokémon",
      description: "Capture 150 Pokémons",
      icon: Crown,
      unlocked: stats.totalCaught >= 150,
      color: "text-purple-600",
    },
  ]

  const unlockedAchievements = achievements.filter((a) => a.unlocked)

  const handleEditStart = () => {
    setEditForm({
      displayName: user.displayName || "",
      photoURL: user.photoURL || "",
    })
    setIsEditing(true)
    setUpdateError(null)
  }

  const handleEditCancel = () => {
    setIsEditing(false)
    setEditForm({
      displayName: user.displayName || "",
      photoURL: user.photoURL || "",
    })
    setUpdateError(null)
  }

  const handleSaveProfile = async () => {
    if (!editForm.displayName.trim()) {
      setUpdateError("O nome não pode estar vazio")
      return
    }

    setIsUpdating(true)
    setUpdateError(null)

    try {
      await updateProfile({
        displayName: editForm.displayName.trim(),
        photoURL: editForm.photoURL.trim() || null,
      })
      setIsEditing(false)
    } catch (error: any) {
      console.error("Erro ao atualizar perfil:", error)
      setUpdateError(error.message || "Erro ao atualizar perfil")
    } finally {
      setIsUpdating(false)
    }
  }

  const handlePhotoUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (file) {
      // Para demo, vamos usar um URL de placeholder baseado no nome
      const placeholderUrl = `https://api.dicebear.com/7.x/avataaars/svg?seed=${encodeURIComponent(editForm.displayName || "user")}&backgroundColor=b6e3f4`
      setEditForm({ ...editForm, photoURL: placeholderUrl })
    }
  }

  const generateRandomAvatar = () => {
    const seed = Math.random().toString(36).substring(7)
    const newPhotoURL = `https://api.dicebear.com/7.x/avataaars/svg?seed=${seed}&backgroundColor=b6e3f4`
    setEditForm({ ...editForm, photoURL: newPhotoURL })
  }

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button variant="ghost" size="sm">
          <User className="w-4 h-4" />
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogTitle className="flex items-center gap-2">
          <User className="w-5 h-5" />
          Perfil do Treinador
        </DialogTitle>

        <Tabs defaultValue="overview" className="w-full">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="overview">Visão Geral</TabsTrigger>
            <TabsTrigger value="stats">Estatísticas</TabsTrigger>
            <TabsTrigger value="achievements">Conquistas</TabsTrigger>
            <TabsTrigger value="progress">Progresso</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-6">
            {/* User Info */}
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center gap-6">
                  <div className="relative">
                    <img
                      src={user.photoURL || "/placeholder.svg?height=80&width=80&query=user+avatar"}
                      alt="Avatar"
                      className="w-20 h-20 rounded-full border-4 border-primary/20"
                    />
                    {!isDemoMode && (
                      <Button
                        variant="outline"
                        size="sm"
                        className="absolute -bottom-2 -right-2 h-8 w-8 p-0 rounded-full"
                        onClick={handleEditStart}
                      >
                        <Edit className="w-3 h-3" />
                      </Button>
                    )}
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <h2 className="text-2xl font-bold">{user.displayName}</h2>
                      {!isDemoMode && !isEditing && (
                        <Button variant="ghost" size="sm" onClick={handleEditStart}>
                          <Edit className="w-4 h-4" />
                        </Button>
                      )}
                    </div>
                    <p className="text-muted-foreground">{user.email}</p>
                    <div className="flex items-center gap-4 mt-2">
                      <div className="flex items-center gap-1 text-sm text-muted-foreground">
                        <Calendar className="w-4 h-4" />
                        Treinador desde {memberSince}
                      </div>
                      {isDemoMode && <Badge variant="secondary">Modo Demo</Badge>}
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-3xl font-bold text-primary">{stats.completionPercentage}%</div>
                    <div className="text-sm text-muted-foreground">Pokédex Completa</div>
                  </div>
                </div>

                {/* Edit Profile Form */}
                {isEditing && (
                  <div className="mt-6 p-4 border rounded-lg bg-muted/50">
                    <h3 className="font-semibold mb-4">Editar Perfil</h3>

                    {updateError && (
                      <Alert variant="destructive" className="mb-4">
                        <AlertDescription>{updateError}</AlertDescription>
                      </Alert>
                    )}

                    <div className="space-y-4">
                      {/* Photo Section */}
                      <div className="space-y-2">
                        <Label>Foto de Perfil</Label>
                        <div className="flex items-center gap-4">
                          <img
                            src={editForm.photoURL || "/placeholder.svg?height=60&width=60&query=user+avatar"}
                            alt="Preview"
                            className="w-16 h-16 rounded-full border-2 border-border"
                          />
                          <div className="space-y-2">
                            <div className="flex gap-2">
                              <Button type="button" variant="outline" size="sm" onClick={generateRandomAvatar}>
                                <Camera className="w-4 h-4 mr-2" />
                                Avatar Aleatório
                              </Button>
                              <div className="relative">
                                <input
                                  type="file"
                                  accept="image/*"
                                  onChange={handlePhotoUpload}
                                  className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                                />
                                <Button type="button" variant="outline" size="sm">
                                  <Upload className="w-4 h-4 mr-2" />
                                  Upload
                                </Button>
                              </div>
                            </div>
                            <Input
                              placeholder="URL da imagem"
                              value={editForm.photoURL}
                              onChange={(e) => setEditForm({ ...editForm, photoURL: e.target.value })}
                            />
                          </div>
                        </div>
                      </div>

                      {/* Name Section */}
                      <div className="space-y-2">
                        <Label htmlFor="displayName">Nome de Utilizador</Label>
                        <Input
                          id="displayName"
                          value={editForm.displayName}
                          onChange={(e) => setEditForm({ ...editForm, displayName: e.target.value })}
                          placeholder="Seu nome"
                        />
                      </div>

                      {/* Actions */}
                      <div className="flex gap-2 pt-2">
                        <Button onClick={handleSaveProfile} disabled={isUpdating}>
                          {isUpdating ? (
                            <>
                              <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2" />
                              Salvando...
                            </>
                          ) : (
                            <>
                              <Save className="w-4 h-4 mr-2" />
                              Salvar
                            </>
                          )}
                        </Button>
                        <Button variant="outline" onClick={handleEditCancel} disabled={isUpdating}>
                          <X className="w-4 h-4 mr-2" />
                          Cancelar
                        </Button>
                      </div>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Quick Stats */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <Card>
                <CardContent className="p-4 text-center">
                  <Trophy className="w-8 h-8 text-green-600 mx-auto mb-2" />
                  <div className="text-2xl font-bold">{stats.totalCaught}</div>
                  <div className="text-sm text-muted-foreground">Capturados</div>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-4 text-center">
                  <Sparkles className="w-8 h-8 text-yellow-600 mx-auto mb-2" />
                  <div className="text-2xl font-bold">{stats.totalShiny}</div>
                  <div className="text-sm text-muted-foreground">Shinys</div>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-4 text-center">
                  <Star className="w-8 h-8 text-orange-600 mx-auto mb-2" />
                  <div className="text-2xl font-bold">{stats.totalLucky}</div>
                  <div className="text-sm text-muted-foreground">Lucky</div>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-4 text-center">
                  <Award className="w-8 h-8 text-purple-600 mx-auto mb-2" />
                  <div className="text-2xl font-bold">{unlockedAchievements.length}</div>
                  <div className="text-sm text-muted-foreground">Conquistas</div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="stats" className="space-y-6">
            {/* Detailed Stats */}
            <div className="grid md:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>Estatísticas Gerais</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex justify-between">
                    <span>Total Capturados:</span>
                    <span className="font-bold">{stats.totalCaught}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Pokémons Shiny:</span>
                    <span className="font-bold text-yellow-600">{stats.totalShiny}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Pokémons Lucky:</span>
                    <span className="font-bold text-orange-600">{stats.totalLucky}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Pokémons Shadow:</span>
                    <span className="font-bold text-purple-600">{stats.totalShadow}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Pokémons Purificados:</span>
                    <span className="font-bold text-blue-600">{stats.totalPurified}</span>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Progresso da Pokédex</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="text-center">
                    <div className="text-4xl font-bold text-primary mb-2">{stats.completionPercentage}%</div>
                    <Progress value={stats.completionPercentage} className="h-3" />
                    <div className="text-sm text-muted-foreground mt-2">{stats.totalCaught} de 1025 Pokémons</div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="achievements" className="space-y-6">
            <div className="grid md:grid-cols-2 gap-4">
              {achievements.map((achievement) => {
                const Icon = achievement.icon
                return (
                  <Card
                    key={achievement.id}
                    className={achievement.unlocked ? "border-green-200 bg-green-50 dark:bg-green-950" : "opacity-60"}
                  >
                    <CardContent className="p-4">
                      <div className="flex items-center gap-3">
                        <div
                          className={`p-2 rounded-full ${achievement.unlocked ? "bg-green-100 dark:bg-green-900" : "bg-gray-100 dark:bg-gray-800"}`}
                        >
                          <Icon className={`w-6 h-6 ${achievement.unlocked ? achievement.color : "text-gray-400"}`} />
                        </div>
                        <div className="flex-1">
                          <h3 className="font-semibold">{achievement.name}</h3>
                          <p className="text-sm text-muted-foreground">{achievement.description}</p>
                        </div>
                        {achievement.unlocked && (
                          <Badge variant="default" className="bg-green-600">
                            ✓
                          </Badge>
                        )}
                      </div>
                    </CardContent>
                  </Card>
                )
              })}
            </div>
          </TabsContent>

          <TabsContent value="progress" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Progresso por Geração</CardTitle>
                <CardDescription>Veja seu progresso em cada região</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {generationProgress.map((gen) => (
                    <div key={gen.generation} className="space-y-2">
                      <div className="flex justify-between items-center">
                        <span className="font-medium">
                          Geração {gen.generation} - {gen.name}
                        </span>
                        <span className="text-sm text-muted-foreground">
                          {gen.caught}/{gen.total} ({gen.percentage}%)
                        </span>
                      </div>
                      <Progress value={gen.percentage} className="h-2" />
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  )
}
