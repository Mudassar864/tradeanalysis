import { cn } from "@/lib/utils";

export function Badge({
  className,
  tone = "neutral",
  children,
}: {
  className?: string;
  tone?: "neutral" | "long" | "short" | "open";
  children: React.ReactNode;
}) {
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full px-2 py-0.5 text-xs uppercase tracking-wide",
        tone === "neutral" && "bg-muted text-muted-foreground",
        tone === "long" && "bg-profit/15 text-profit",
        tone === "short" && "bg-loss/15 text-loss",
        tone === "open" && "bg-primary/15 text-primary",
        className,
      )}
    >
      {children}
    </span>
  );
}
