import { redirect, unstable_rethrow } from "next/navigation";
import { AuthForm } from "@/components/auth-form";
import { DatabaseNotice } from "@/components/database-notice";
import { getSession } from "@/lib/session";

export const dynamic = "force-dynamic";

export const metadata = {
  title: "Sign in",
};

export default async function SignInPage() {
  let signedIn = false;
  let unavailable = false;

  try {
    signedIn = Boolean(await getSession());
  } catch (error) {
    unstable_rethrow(error);
    unavailable = true;
  }

  if (signedIn) redirect("/dashboard");
  if (unavailable) return <DatabaseNotice />;

  return (
    <>
      <h2 className="text-2xl tracking-tight">Sign in</h2>
      <p className="mt-2 mb-6 text-sm text-muted-foreground">Use the email and password for your desk.</p>
      <AuthForm mode="sign-in" />
    </>
  );
}
