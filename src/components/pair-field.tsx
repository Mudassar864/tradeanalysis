"use client";

import { useEffect, useId, useMemo, useRef, useState } from "react";
import { FieldError, Input, Label } from "@/components/ui/field";
import { filterPairs } from "@/lib/pairs";
import { cn } from "@/lib/utils";

export function PairField({
  defaultValue = "",
  error,
}: {
  defaultValue?: string;
  error?: string[];
}) {
  const listId = useId();
  const rootRef = useRef<HTMLDivElement>(null);
  const [query, setQuery] = useState(defaultValue);
  const [open, setOpen] = useState(false);
  const [active, setActive] = useState(0);
  const matches = useMemo(() => filterPairs(query), [query]);

  useEffect(() => {
    function onPointerDown(event: PointerEvent) {
      if (!rootRef.current?.contains(event.target as Node)) setOpen(false);
    }
    document.addEventListener("pointerdown", onPointerDown);
    return () => document.removeEventListener("pointerdown", onPointerDown);
  }, []);

  function choose(pair: string) {
    setQuery(pair);
    setOpen(false);
  }

  return (
    <div ref={rootRef} className="relative space-y-1.5">
      <Label htmlFor="symbol">Pair</Label>
      <Input
        id="symbol"
        name="symbol"
        role="combobox"
        aria-expanded={open}
        aria-controls={listId}
        aria-autocomplete="list"
        autoComplete="off"
        placeholder="Search EURUSD, XAUUSD…"
        value={query}
        onChange={(event) => {
          setQuery(event.target.value.toUpperCase());
          setActive(0);
          setOpen(true);
        }}
        onFocus={() => setOpen(true)}
        onKeyDown={(event) => {
          if (event.key === "ArrowDown") {
            event.preventDefault();
            setOpen(true);
            setActive((current) => Math.min(current + 1, Math.max(matches.length - 1, 0)));
          }
          if (event.key === "ArrowUp") {
            event.preventDefault();
            setActive((current) => Math.max(current - 1, 0));
          }
          if (event.key === "Enter" && open && matches[active]) {
            event.preventDefault();
            choose(matches[active]);
          }
          if (event.key === "Escape") setOpen(false);
        }}
        required
      />
      {open && matches.length > 0 ? (
        <ul id={listId} role="listbox" className="absolute z-20 mt-1 max-h-56 w-full overflow-auto rounded-xl border border-border bg-card py-1 shadow-lg">
          {matches.map((pair, index) => (
            <li key={pair} role="presentation">
              <button
                type="button"
                role="option"
                aria-selected={index === active}
                className={cn(
                  "block w-full px-3 py-2 text-left font-mono text-sm",
                  index === active ? "bg-muted text-foreground" : "text-muted-foreground",
                )}
                onMouseEnter={() => setActive(index)}
                onClick={() => choose(pair)}
              >
                {pair}
              </button>
            </li>
          ))}
        </ul>
      ) : null}
      <FieldError messages={error} />
    </div>
  );
}
