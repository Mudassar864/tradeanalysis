import { databaseMessage } from "@/lib/format";

export function DatabaseNotice() {
  return (
    <div className="mx-auto flex min-h-full max-w-lg flex-col justify-center px-6 py-16">
      <p className="text-xs uppercase tracking-[0.18em] text-primary">Database</p>
      <h1 className="mt-3 text-3xl tracking-tight text-foreground">MongoDB did not respond</h1>
      <p className="mt-3 text-sm leading-6 text-muted-foreground">{databaseMessage()}</p>
      <p className="mt-6 text-sm leading-6 text-muted-foreground">
        Local default: <span className="font-mono text-foreground">mongodb://127.0.0.1:27017/tradeanalysis</span>
      </p>
    </div>
  );
}
