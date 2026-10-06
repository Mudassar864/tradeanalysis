import Link from "next/link";

export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="grid min-h-full lg:grid-cols-2">
      <section className="desk-grid hidden flex-col justify-between border-r border-border px-10 py-8 lg:flex">
        <Link href="/" className="text-xs uppercase tracking-[0.22em] text-primary">
          Tradebook
        </Link>
        <div>
          <h1 className="max-w-md text-4xl tracking-tight">A journal with the numbers attached.</h1>
          <p className="mt-4 max-w-md text-sm leading-6 text-muted-foreground">
            Sign in to the desk that holds your trades. Sessions are signed cookies. The records live in MongoDB, scoped to your account.
          </p>
        </div>
        <p className="text-xs text-muted-foreground">Not a broker. Not advice.</p>
      </section>
      <section className="flex items-center justify-center px-6 py-16">
        <div className="w-full max-w-sm">{children}</div>
      </section>
    </div>
  );
}
