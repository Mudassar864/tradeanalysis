import { redirect, unstable_rethrow } from "next/navigation";
import { AuthForm } from "@/components/auth-form";
import { DatabaseNotice } from "@/components/database-notice";
import { getSession } from "@/lib/session";

export const dynamic = "force-dynamic";

export const metadata = {
  title: "Create account",
};

export default async function SignUpPage() {
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
      <h2 className="text-2xl tracking-tight">Create your desk</h2>
      <p className="mt-2 mb-6 text-sm text-muted-foreground">
        This creates a user in your MongoDB database. Password hashing and sessions are handled by the auth system.
      </p>
      <AuthForm mode="sign-up" />
    </>
  );
}
