import Link from "next/link";

const academy = [
  { label: "Traders trained", value: "1000+" },
  { label: "Expert modules", value: "16" },
  { label: "Month program", value: "1.5" },
  { label: "Rating", value: "4.8" },
];

export default function HomePage() {
  return (
    <div className="min-h-full bg-background text-foreground">
      <header className="mx-auto flex w-full max-w-6xl items-center justify-between px-6 py-5">
        <div>
          <p className="text-xs uppercase tracking-[0.22em] text-primary">Invisible Skills</p>
          <p className="mt-1 text-xs text-muted-foreground">Forex Trading Academy</p>
        </div>
        <nav className="flex items-center gap-4 text-sm">
          <a href="https://www.invisibleskillz.com/" className="text-muted-foreground hover:text-foreground">
            Academy
          </a>
          <Link href="/sign-in" className="text-muted-foreground hover:text-foreground">
            Sign in
          </Link>
          <Link href="/sign-up" className="rounded-full bg-primary px-4 py-2 text-primary-foreground">
            Create account
          </Link>
        </nav>
      </header>

      <main className="desk-grid mx-auto grid w-full max-w-6xl gap-12 px-6 py-16 lg:grid-cols-[1.15fr_0.85fr] lg:py-24">
        <section>
          <p className="text-xs uppercase tracking-[0.18em] text-primary">An Invisible Skills project</p>
          <h1 className="mt-4 max-w-xl text-4xl tracking-tight sm:text-5xl sm:leading-[1.1]">
            The journal behind the mentorship.
          </h1>
          <p className="mt-5 max-w-xl text-base leading-7 text-muted-foreground">
            Invisible Skills trains forex traders with Ahsan Maqsood (Ahxan FX): Smart Money Concepts, technical and
            fundamental analysis, risk management, and live market practice. This desk is where those trades get
            written down. Pick the day, the pair, buy or sell, and the profit or loss.
          </p>
          <div className="mt-8 flex flex-wrap gap-3">
            <Link href="/dashboard" className="rounded-full bg-primary px-5 py-3 text-sm text-primary-foreground">
              Open journal
            </Link>
            <a
              href="https://www.invisibleskillz.com/"
              className="rounded-full border border-border px-5 py-3 text-sm"
            >
              Visit the academy
            </a>
          </div>
          <p className="mt-8 max-w-xl text-xs leading-5 text-muted-foreground">
            The mentorship runs for 1.5 months across 16 modules. Enrollment is PKR 60,000, down from PKR 90,000.
            This journal records your own results. It does not place orders.
          </p>
        </section>

        <aside className="rounded-3xl border border-border bg-card p-5">
          <div className="flex items-center justify-between">
            <p className="text-sm">Invisible Skills</p>
            <p className="text-xs uppercase tracking-wide text-muted-foreground">Pakpattan</p>
          </div>
          <div className="mt-5 grid grid-cols-2 gap-3">
            {academy.map((item) => (
              <div key={item.label} className="rounded-2xl bg-background px-4 py-3">
                <p className="text-xs uppercase tracking-wide text-muted-foreground">{item.label}</p>
                <p className="mt-2 font-mono text-xl tabular-nums">{item.value}</p>
              </div>
            ))}
          </div>
          <div className="mt-4 space-y-2 rounded-2xl bg-background p-4 text-sm">
            <div className="flex justify-between gap-4">
              <span className="text-muted-foreground">Mentor</span>
              <span>Ahsan Maqsood</span>
            </div>
            <div className="flex justify-between gap-4">
              <span className="text-muted-foreground">Program</span>
              <span>16 modules</span>
            </div>
            <div className="flex justify-between gap-4">
              <span className="text-muted-foreground">Course</span>
              <span className="font-mono text-profit">PKR 60,000</span>
            </div>
          </div>
        </aside>
      </main>

      <section className="mx-auto grid w-full max-w-6xl gap-4 px-6 md:grid-cols-3">
        {[
          [
            "The academy",
            "A forex mentorship built around Smart Money Concepts, live trading sessions, and risk and money management.",
          ],
          [
            "The journal",
            "Click a day on the month. Profit shows in green and loss in red. Update the record later from the journal.",
          ],
          [
            "Your desk",
            "Each student signs in with email and password. Sessions and trades stay in your own database.",
          ],
        ].map(([title, copy]) => (
          <article key={title} className="rounded-2xl border border-border bg-card p-5">
            <h2 className="text-base">{title}</h2>
            <p className="mt-2 text-sm leading-6 text-muted-foreground">{copy}</p>
          </article>
        ))}
      </section>

      <footer className="mx-auto flex w-full max-w-6xl flex-col gap-3 px-6 py-16 text-sm text-muted-foreground sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="text-foreground">Invisible Skills</p>
          <p className="mt-1 max-w-md leading-6">Plaza #2 C2, Pak City Commercial Market, Pakpattan</p>
        </div>
        <div className="space-y-1 sm:text-right">
          <p>
            <a href="mailto:info.invisibleskillz@gmail.com" className="hover:text-foreground">
              info.invisibleskillz@gmail.com
            </a>
          </p>
          <p>
            <a href="tel:+923042470086" className="hover:text-foreground">
              +92 304 2470086
            </a>
            {" · "}
            <a href="tel:+923087819209" className="hover:text-foreground">
              +92 308 7819209
            </a>
          </p>
        </div>
      </footer>
    </div>
  );
}
