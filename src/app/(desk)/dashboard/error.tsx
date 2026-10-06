"use client";

import { useEffect } from "react";
import { Button } from "@/components/ui/button";
import { databaseMessage } from "@/lib/format";

export default function DashboardError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <div className="max-w-lg py-10">
      <p className="text-xs uppercase tracking-[0.18em] text-primary">Database</p>
      <h1 className="mt-3 text-3xl tracking-tight">The desk could not load</h1>
      <p className="mt-3 text-sm leading-6 text-muted-foreground">{databaseMessage()}</p>
      <Button className="mt-6" onClick={reset}>
        Try again
      </Button>
    </div>
  );
}
