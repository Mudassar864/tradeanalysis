"use client";

import { deleteTrade } from "@/app/actions/trades";
import { Button } from "@/components/ui/button";

export function DeleteTradeButton({ id }: { id: string }) {
  return (
    <form
      action={deleteTrade}
      onSubmit={(event) => {
        if (!window.confirm("Delete this trade? This cannot be undone.")) {
          event.preventDefault();
        }
      }}
    >
      <input type="hidden" name="id" value={id} />
      <Button type="submit" variant="danger" size="sm">
        Delete
      </Button>
    </form>
  );
}
