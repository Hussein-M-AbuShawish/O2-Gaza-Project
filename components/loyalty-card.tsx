import { Sparkles } from "lucide-react"
import { getLoyaltyProgress, LOYALTY_LEVELS } from "@/lib/loyalty"
import { cn } from "@/lib/utils"

export function LoyaltyCard({ points }: { points: number }) {
  const progress = getLoyaltyProgress(points)
  const CurrentIcon = progress.current.icon

  return (
    <section
      aria-labelledby="loyalty-heading"
      className="rounded-2xl bg-card border-2 border-border overflow-hidden"
    >
      {/* Header */}
      <div className="bg-primary/5 border-b-2 border-border p-6">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className={cn("rounded-xl bg-background border-2 border-border p-3", progress.current.color)}>
              <CurrentIcon className="w-7 h-7" />
            </div>
            <div>
              <span className="text-xs font-medium tracking-wider text-muted-foreground block">
                الرحلة المطعمية
              </span>
              <h2 id="loyalty-heading" className="text-xl md:text-2xl font-bold text-foreground">
                مستوى «{progress.current.name}»
              </h2>
              <span className="text-sm text-muted-foreground">{progress.current.subtitle}</span>
            </div>
          </div>
          <div className="text-center rounded-xl bg-background border-2 border-border px-5 py-3">
            <span className="block text-2xl font-bold text-primary">{points}</span>
            <span className="text-xs text-muted-foreground">نقطة</span>
          </div>
        </div>
      </div>

      {/* Progress */}
      <div className="p-6">
        <div className="flex items-center justify-between mb-2 text-sm">
          <span className="font-medium text-foreground">{progress.current.name}</span>
          {progress.next && <span className="font-medium text-muted-foreground">{progress.next.name}</span>}
        </div>
        <div
          className="h-4 rounded-full bg-muted overflow-hidden border border-border"
          role="progressbar"
          aria-valuenow={progress.percent}
          aria-valuemin={0}
          aria-valuemax={100}
          aria-label="التقدم نحو المستوى التالي"
        >
          <div
            className="h-full bg-primary rounded-full transition-all duration-700 ease-out"
            style={{ width: `${progress.percent}%` }}
          />
        </div>
        <p className="mt-3 flex items-center gap-2 text-sm font-medium text-foreground">
          <Sparkles className="w-4 h-4 text-primary shrink-0" />
          {progress.motivation}
        </p>
      </div>

      {/* Levels overview */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-px bg-border border-t-2 border-border">
        {LOYALTY_LEVELS.map((level) => {
          const Icon = level.icon
          const isCurrent = level.index === progress.current.index
          const isReached = points >= level.min
          return (
            <div
              key={level.key}
              className={cn(
                "bg-card p-4 flex flex-col gap-2",
                isCurrent && "bg-primary/5",
              )}
            >
              <div className="flex items-center gap-2">
                <Icon className={cn("w-5 h-5", isReached ? level.color : "text-muted-foreground/40")} />
                <span
                  className={cn(
                    "font-bold text-sm",
                    isReached ? "text-foreground" : "text-muted-foreground/60",
                  )}
                >
                  {level.name}
                </span>
                {isCurrent && (
                  <span className="ms-auto text-[10px] font-bold text-primary bg-primary/10 rounded-full px-2 py-0.5">
                    الحالي
                  </span>
                )}
              </div>
              <ul className="space-y-1">
                {level.perks.map((perk) => (
                  <li
                    key={perk}
                    className={cn(
                      "text-xs leading-relaxed flex items-start gap-1.5",
                      isReached ? "text-muted-foreground" : "text-muted-foreground/50",
                    )}
                  >
                    <span className="text-primary mt-0.5">•</span>
                    {perk}
                  </li>
                ))}
              </ul>
            </div>
          )
        })}
      </div>
    </section>
  )
}
