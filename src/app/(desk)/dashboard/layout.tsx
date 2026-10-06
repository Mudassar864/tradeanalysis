import { unstable_rethrow } from "next/navigation";
import { DatabaseNotice } from "@/components/database-notice";
import { DeskShell } from "@/components/desk-shell";
import { requireSession } from "@/lib/session";

export const dynamic = "force-dynamic";

export default async function DashboardLayout({ children }: { children: React.ReactNode }) {
  let session: Awaited<ReturnType<typeof requireSession>> | null = null;
  let unavailable = false;

  try {
    session = await requireSession();
  } catch (error) {
    unstable_rethrow(error);
    unavailable = true;
  }

  if (unavailable || !session) {
    return <DatabaseNotice />;
  }

  return <DeskShell user={{ name: session.user.name, email: session.user.email }}>{children}</DeskShell>;
}
