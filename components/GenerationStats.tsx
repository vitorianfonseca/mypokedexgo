"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { Badge } from "@/components/ui/badge"
import { usePokedex } from "@/contexts/PokedexContext"
import { generationStats, getPokemonByGeneration } from "@/data/pokemon"

export function GenerationStats() {
  const { pokemonStatus } = usePokedex()

  const getGenerationProgress = (generation: number) => {
    const genPokemon = getPokemonByGeneration(generation)
    const caughtInGen = genPokemon.filter((p) => pokemonStatus[p.id]?.caught).length
    const totalInGen = genPokemon.length
    const percentage = totalInGen > 0 ? Math.round((caughtInGen / totalInGen) * 100) : 0

    return { caught: caughtInGen, total: totalInGen, percentage }
  }

  return (
    <div className="space-y-4">
      <h3 className="text-lg font-semibold">Progresso por Geração</h3>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {Object.entries(generationStats).map(([gen, info]) => {
          const progress = getGenerationProgress(Number(gen))

          return (
            <Card key={gen}>
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-base">Geração {gen}</CardTitle>
                  <Badge variant="outline" className="text-xs">
                    {info.range}
                  </Badge>
                </div>
                <CardDescription>{info.name}</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>Progresso</span>
                    <span>
                      {progress.caught}/{progress.total}
                    </span>
                  </div>
                  <Progress value={progress.percentage} className="h-2" />
                  <div className="text-center text-sm text-muted-foreground">{progress.percentage}% completo</div>
                </div>
              </CardContent>
            </Card>
          )
        })}
      </div>
    </div>
  )
}
