import { cn } from "@/lib/utils"

interface LogoProps {
  className?: string
  size?: "sm" | "md" | "lg"
  variant?: "full" | "icon"
}

export function Logo({ className, size = "md", variant = "full" }: LogoProps) {
  const sizes = {
    sm: { container: "h-8", icon: 24, text: "text-lg" },
    md: { container: "h-10", icon: 32, text: "text-xl" },
    lg: { container: "h-14", icon: 48, text: "text-3xl" },
  }

  return (
    <div className={cn("flex items-center gap-2", sizes[size].container, className)}>
      <div className="relative">
        <div className="absolute inset-0 bg-red-500 rounded-full animate-pulse opacity-20"></div>
        <div className="relative flex items-center justify-center">
          <div className="w-full h-full bg-gradient-to-br from-red-600 to-red-700 rounded-full shadow-lg p-0.5">
            <div className="w-full h-full bg-white rounded-full flex items-center justify-center">
              <div className="w-1/2 h-1/2 bg-gradient-to-br from-red-500 to-red-600 rounded-full relative">
                <div className="absolute w-1/3 h-1/3 bg-white rounded-full top-1/4 left-1/4"></div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {variant === "full" && (
        <div className="flex flex-col">
          <span className={cn("font-bold tracking-tight leading-none", sizes[size].text)}>
            MyPokédex
            <span className="text-amber-500 ml-1">GO</span>
          </span>
          {size === "lg" && <span className="text-xs text-muted-foreground">Capture. Colecione. Compare.</span>}
        </div>
      )}
    </div>
  )
}
