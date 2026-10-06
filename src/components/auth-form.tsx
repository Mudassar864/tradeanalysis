"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { FieldError, Input, Label } from "@/components/ui/field";
import { authClient } from "@/lib/auth-client";
import { credentialsSchema } from "@/lib/validators";

export function AuthForm({ mode }: { mode: "sign-in" | "sign-up" }) {
  const router = useRouter();
  const [pending, setPending] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  const [fieldErrors, setFieldErrors] = useState<Record<string, string[] | undefined>>({});
  const signUp = mode === "sign-up";

  async function onSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setMessage(null);
    const form = new FormData(event.currentTarget);
    const payload = {
      name: String(form.get("name") ?? "Trader"),
      email: String(form.get("email") ?? ""),
      password: String(form.get("password") ?? ""),
    };
    const parsed = credentialsSchema.safeParse(payload);
    if (!parsed.success) {
      const errors = parsed.error.flatten().fieldErrors;
      if (!signUp) delete errors.name;
      setFieldErrors(errors);
      setMessage("Check the highlighted fields.");
      return;
    }

    setPending(true);
    setFieldErrors({});
    const result = signUp
      ? await authClient.signUp.email({
          name: parsed.data.name,
          email: parsed.data.email,
          password: parsed.data.password,
          callbackURL: "/dashboard",
        })
      : await authClient.signIn.email({
          email: parsed.data.email,
          password: parsed.data.password,
          callbackURL: "/dashboard",
        });
    setPending(false);

    if (result.error) {
      const status = result.error.status;
      setMessage(
        status != null && status >= 500
          ? "The database did not respond. Confirm MongoDB is running and MONGODB_URI is set."
          : result.error.message || "That did not work. Try again.",
      );
      return;
    }

    router.push("/dashboard");
    router.refresh();
  }

  return (
    <form onSubmit={onSubmit} className="space-y-4" noValidate>
      {signUp ? (
        <div className="space-y-1.5">
          <Label htmlFor="name">Name</Label>
          <Input id="name" name="name" autoComplete="name" required minLength={2} />
          <FieldError messages={fieldErrors.name} />
        </div>
      ) : null}
      <div className="space-y-1.5">
        <Label htmlFor="email">Email</Label>
        <Input id="email" name="email" type="email" autoComplete="email" required />
        <FieldError messages={fieldErrors.email} />
      </div>
      <div className="space-y-1.5">
        <Label htmlFor="password">Password</Label>
        <div className="relative">
          <Input
            id="password"
            name="password"
            type={showPassword ? "text" : "password"}
            autoComplete={signUp ? "new-password" : "current-password"}
            required
            minLength={8}
            className="pr-16"
          />
          <button
            type="button"
            onClick={() => setShowPassword((current) => !current)}
            aria-pressed={showPassword}
            className="absolute inset-y-0 right-2 flex items-center text-xs text-muted-foreground hover:text-foreground"
          >
            {showPassword ? "Hide" : "Show"}
          </button>
        </div>
        <FieldError messages={fieldErrors.password} />
        {signUp ? (
          <p className="text-xs leading-5 text-muted-foreground">At least 8 characters, with a letter and a number.</p>
        ) : null}
      </div>
      {message ? (
        <p role="alert" className="text-sm text-loss">
          {message}
        </p>
      ) : null}
      <Button type="submit" className="w-full" disabled={pending}>
        {pending ? "Please wait…" : signUp ? "Create account" : "Sign in"}
      </Button>
      <p className="text-sm text-muted-foreground">
        {signUp ? "Already have a desk?" : "New to Tradebook?"}{" "}
        <Link href={signUp ? "/sign-in" : "/sign-up"} className="text-primary">
          {signUp ? "Sign in" : "Create an account"}
        </Link>
      </p>
    </form>
  );
}
