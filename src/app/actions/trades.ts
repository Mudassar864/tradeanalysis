"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { buildSampleTrades } from "@/lib/sample-journal";
import { requireSession } from "@/lib/session";
import { deleteTrade as removeTrade, replaceSampleJournal, saveTrade as writeTrade } from "@/lib/trades";
import { tradeFormSchema } from "@/lib/validators";

export type ActionState = {
  ok: boolean;
  message?: string;
  fieldErrors?: Record<string, string[] | undefined>;
};

function refreshDesk() {
  revalidatePath("/dashboard");
  revalidatePath("/dashboard/journal");
  revalidatePath("/dashboard/analytics");
}

function field(formData: FormData, key: string) {
  const value = formData.get(key);
  return typeof value === "string" ? value : "";
}

export async function saveTrade(_prev: ActionState, formData: FormData): Promise<ActionState> {
  const session = await requireSession();
  const parsed = tradeFormSchema.safeParse({
    id: field(formData, "id"),
    symbol: field(formData, "symbol"),
    side: field(formData, "side"),
    outcome: field(formData, "outcome"),
    amount: field(formData, "amount"),
    tradedOn: field(formData, "tradedOn"),
  });

  if (!parsed.success) {
    return {
      ok: false,
      message: "Check the highlighted fields.",
      fieldErrors: parsed.error.flatten().fieldErrors,
    };
  }

  try {
    await writeTrade(session.user.id, parsed.data);
  } catch (error) {
    console.error(error);
    return {
      ok: false,
      message: error instanceof Error ? error.message : "The trade could not be saved.",
    };
  }

  refreshDesk();
  return { ok: true };
}

export async function deleteTrade(formData: FormData) {
  const session = await requireSession();
  const id = String(formData.get("id") ?? "");
  await removeTrade(session.user.id, id);
  refreshDesk();
}

export async function loadSampleJournal() {
  const session = await requireSession();
  await replaceSampleJournal(session.user.id, buildSampleTrades());
  refreshDesk();
  redirect("/dashboard/journal");
}

export async function clearSampleJournal() {
  const session = await requireSession();
  await replaceSampleJournal(session.user.id, []);
  refreshDesk();
  redirect("/dashboard/journal");
}
