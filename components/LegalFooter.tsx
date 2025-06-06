"use client"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { LEGAL_CONFIG, getLegalDisclaimer } from "@/lib/legal"
import { ExternalLink, Shield, Info } from "lucide-react"

export function LegalFooter() {
  return (
    <footer className="bg-muted/30 border-t mt-16 w-full">
      <div className="max-w-6xl mx-auto px-4 py-8">
        <div className="grid md:grid-cols-3 gap-6">
          {/* Disclaimer */}
          <div>
            <h3 className="font-semibold mb-3 flex items-center gap-2">
              <Shield className="w-4 h-4" />
              Aviso Legal
            </h3>
            <p className="text-sm text-muted-foreground mb-3">{LEGAL_CONFIG.DISCLAIMERS.NOT_AFFILIATED}</p>
            <Dialog>
              <DialogTrigger asChild>
                <Button variant="outline" size="sm">
                  <Info className="w-4 h-4 mr-2" />
                  Ver Disclaimer Completo
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-2xl">
                <DialogHeader>
                  <DialogTitle>Disclaimer Legal</DialogTitle>
                </DialogHeader>
                <div className="space-y-4">
                  <pre className="text-sm whitespace-pre-wrap bg-muted p-4 rounded-lg">{getLegalDisclaimer()}</pre>
                </div>
              </DialogContent>
            </Dialog>
          </div>

          {/* Fontes de Dados */}
          <div>
            <h3 className="font-semibold mb-3">Fontes de Dados</h3>
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-sm">Dados Pokémon:</span>
                <Badge variant="outline" className="text-xs">
                  <a
                    href={LEGAL_CONFIG.OFFICIAL_URLS.POKEAPI}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-1"
                  >
                    PokeAPI
                    <ExternalLink className="w-3 h-3" />
                  </a>
                </Badge>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm">Eventos:</span>
                <Badge variant="outline" className="text-xs">
                  <a
                    href={LEGAL_CONFIG.OFFICIAL_URLS.POKEMON_GO_LIVE}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-1"
                  >
                    Oficial
                    <ExternalLink className="w-3 h-3" />
                  </a>
                </Badge>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm">Imagens:</span>
                <Badge variant="outline" className="text-xs">
                  Sprites Oficiais
                </Badge>
              </div>
            </div>
          </div>

          {/* Links Oficiais */}
          <div>
            <h3 className="font-semibold mb-3">Links Oficiais</h3>
            <div className="space-y-2">
              <a
                href={LEGAL_CONFIG.OFFICIAL_URLS.POKEMON_GO_LIVE}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors"
              >
                <ExternalLink className="w-4 h-4" />
                Pokémon GO Live
              </a>
              <a
                href={LEGAL_CONFIG.OFFICIAL_URLS.POKEMON_COMPANY}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors"
              >
                <ExternalLink className="w-4 h-4" />
                The Pokémon Company
              </a>
              <a
                href={LEGAL_CONFIG.OFFICIAL_URLS.NIANTIC}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors"
              >
                <ExternalLink className="w-4 h-4" />
                Niantic
              </a>
            </div>
          </div>
        </div>

        {/* Copyright */}
        <div className="border-t mt-6 pt-6 text-center">
          <p className="text-xs text-muted-foreground">© 2025 MyPokédex GO - Aplicação não oficial para uso pessoal</p>
          <p className="text-xs text-muted-foreground mt-1">{LEGAL_CONFIG.DISCLAIMERS.POKEMON_TRADEMARK}</p>
        </div>
      </div>
    </footer>
  )
}
