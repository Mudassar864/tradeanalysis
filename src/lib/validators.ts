import { z } from "zod";
import { OUTCOMES, SIDES } from "@/lib/types";

export const tradeFormSchema = z
  .object({
    id: z
      .string()
      .trim()
      .optional()
      .transform((value) => (value ? value : undefined)),
    symbol: z
      .string()
      .trim()
      .min(1, { error: "Choose a pair." })
      .max(16, { error: "Use 16 characters or fewer." })
      .transform((value) => value.toUpperCase().replace(/[^A-Z0-9]/g, ""))
      .refine((value) => value.length > 0, { error: "Choose a pair." }),
    side: z.enum(SIDES, { error: "Choose buy or sell." }),
    outcome: z.enum(OUTCOMES, { error: "Choose profit or loss." }),
    amount: z.coerce.number().positive({ error: "Enter how much you made or lost." }),
    tradedOn: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, { error: "Pick a date on the calendar." }),
  })
  .transform((value) => ({
    id: value.id,
    symbol: value.symbol,
    side: value.side,
    pnl: value.outcome === "loss" ? -value.amount : value.amount,
    tradedOn: value.tradedOn,
  }));

export const credentialsSchema = z.object({
  name: z.string().trim().min(2, { error: "Name must be at least 2 characters." }).max(80),
  email: z.email({ error: "Enter a valid email." }),
  password: z
    .string()
    .min(8, { error: "Use at least 8 characters." })
    .max(128)
    .regex(/[A-Za-z]/, { error: "Include at least one letter." })
    .regex(/[0-9]/, { error: "Include at least one number." }),
});
