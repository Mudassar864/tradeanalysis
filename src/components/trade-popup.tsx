"use client";

import { useRouter } from "next/navigation";
import { useActionState, useEffect, useRef, useState } from "react";
import { saveTrade, type ActionState } from "@/app/actions/trades";
import { PairField } from "@/components/pair-field";
import { Button } from "@/components/ui/button";
import { FieldError, Input, Label } from "@/components/ui/field";
import { formatTradeDate, type Outcome, type Side, type TradeView } from "@/lib/types";
import { cn } from "@/lib/utils";

const initialState: ActionState = { ok: false };

export function TradePopup({
  open,
  date,
  trade = null,
  onClose,
}: {
  open: boolean;
  date: string;
  trade?: TradeView | null;
  onClose: () => void;
}) {
  const dialogRef = useRef<HTMLDialogElement>(null);
  const onCloseRef = useRef(onClose);

  useEffect(() => {
    onCloseRef.current = onClose;
  }, [onClose]);

  useEffect(() => {
    const dialog = dialogRef.current;
    if (!dialog || !open) return;
    dialog.showModal();
    const handleClose = () => onCloseRef.current();
    dialog.addEventListener("close", handleClose);
    return () => {
      dialog.removeEventListener("close", handleClose);
      if (dialog.open) dialog.close();
    };
  }, [open]);

  if (!open) return null;

  return (
    <dialog ref={dialogRef} className="desk-dialog" aria-labelledby="trade-popup-title">
      <TradeForm key={trade?.id ?? date} date={date} trade={trade} onClose={onClose} />
    </dialog>
  );
}

function TradeForm({
  date,
  trade,
  onClose,
}: {
  date: string;
  trade: TradeView | null;
  onClose: () => void;
}) {
  const router = useRouter();
  const [state, action, pending] = useActionState(saveTrade, initialState);
  const [side, setSide] = useState<Side>(trade?.side ?? "buy");
  const [outcome, setOutcome] = useState<Outcome>(trade && (trade.netPnl ?? 0) < 0 ? "loss" : "profit");
  const onCloseRef = useRef(onClose);

  useEffect(() => {
    onCloseRef.current = onClose;
  }, [onClose]);

  useEffect(() => {
    if (!state.ok) return;
    router.refresh();
    onCloseRef.current();
  }, [state.ok, router]);

  const amount = trade?.netPnl == null ? "" : Math.abs(trade.netPnl);

  return (
    <form action={action} className="p-5 sm:p-6">
      <div className="flex items-start justify-between gap-4">
        <div>
          <h2 id="trade-popup-title" className="text-lg">
            {trade ? `Update ${trade.symbol}` : "Add trade"}
          </h2>
          <p className="mt-1 text-sm text-muted-foreground">{formatTradeDate(trade?.tradedOn ?? date)}</p>
        </div>
        <Button variant="ghost" size="sm" onClick={onClose}>
          Close
        </Button>
      </div>
      {trade ? <input type="hidden" name="id" value={trade.id} /> : null}
      <input type="hidden" name="tradedOn" value={trade?.tradedOn ?? date} />

      <div className="mt-4 space-y-4">
        <PairField defaultValue={trade?.symbol ?? ""} error={state.fieldErrors?.symbol} />
        <fieldset className="space-y-1.5">
          <legend className="text-sm text-muted-foreground">Buy or sell</legend>
          <div className="grid grid-cols-2 gap-2">
            <Choice name="side" value="buy" current={side} onSelect={setSide} label="Buy" />
            <Choice name="side" value="sell" current={side} onSelect={setSide} label="Sell" />
          </div>
        </fieldset>
        <fieldset className="space-y-1.5">
          <legend className="text-sm text-muted-foreground">Result</legend>
          <div className="grid grid-cols-2 gap-2">
            <Choice name="outcome" value="profit" current={outcome} onSelect={setOutcome} label="Profit" tone="profit" />
            <Choice name="outcome" value="loss" current={outcome} onSelect={setOutcome} label="Loss" tone="loss" />
          </div>
        </fieldset>
        <div className="space-y-1.5">
          <Label htmlFor="amount">Amount</Label>
          <Input id="amount" name="amount" type="number" min="0" step="0.01" defaultValue={amount} required placeholder="50" />
          <FieldError messages={state.fieldErrors?.amount} />
        </div>
      </div>

      {state.message && !state.ok ? (
        <p role="alert" className="mt-4 text-sm text-loss">
          {state.message}
        </p>
      ) : null}

      <div className="mt-5 flex justify-end gap-2">
        <Button variant="outline" onClick={onClose}>
          Cancel
        </Button>
        <Button type="submit" disabled={pending}>
          {pending ? "Saving…" : trade ? "Update trade" : "Save trade"}
        </Button>
      </div>
    </form>
  );
}

function Choice<T extends string>({
  name,
  value,
  current,
  onSelect,
  label,
  tone,
}: {
  name: string;
  value: T;
  current: T;
  onSelect: (value: T) => void;
  label: string;
  tone?: "profit" | "loss";
}) {
  const selected = current === value;
  return (
    <label
      className={cn(
        "flex h-10 cursor-pointer items-center justify-center rounded-full border text-sm",
        selected && !tone && "border-primary bg-primary text-primary-foreground",
        selected && tone === "profit" && "border-profit bg-profit/15 text-profit",
        selected && tone === "loss" && "border-loss bg-loss/15 text-loss",
        !selected && "border-border",
      )}
    >
      <input className="sr-only" type="radio" name={name} value={value} checked={selected} onChange={() => onSelect(value)} />
      {label}
    </label>
  );
}
