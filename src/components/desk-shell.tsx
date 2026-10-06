"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useState } from "react";
import { BookOpen, ChartColumn, LayoutDashboard, LogOut, Menu, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { authClient } from "@/lib/auth-client";
import type { SessionUser } from "@/lib/types";
import { cn } from "@/lib/utils";

const links = [
  { href: "/dashboard", label: "Overview", icon: LayoutDashboard },
  { href: "/dashboard/journal", label: "Journal", icon: BookOpen },
  { href: "/dashboard/analytics", label: "Analytics", icon: ChartColumn },
];

function NavLinks({ pathname, onNavigate }: { pathname: string; onNavigate?: () => void }) {
  return (
    <nav className="space-y-1" aria-label="Desk">
      {links.map((link) => {
        const active = link.href === "/dashboard" ? pathname === link.href : pathname.startsWith(link.href);
        const Icon = link.icon;
        return (
          <Link
            key={link.href}
            href={link.href}
            aria-current={active ? "page" : undefined}
            onClick={onNavigate}
            className={cn(
              "flex items-center gap-3 rounded-xl px-3 py-2 text-sm",
              active ? "bg-muted text-foreground" : "text-muted-foreground hover:bg-muted/70 hover:text-foreground",
            )}
          >
            <Icon className="size-4" aria-hidden="true" />
            {link.label}
          </Link>
        );
      })}
    </nav>
  );
}

export function DeskShell({ user, children }: { user: SessionUser; children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [pending, setPending] = useState(false);

  async function signOut() {
    setPending(true);
    await authClient.signOut();
    router.push("/");
    router.refresh();
  }

  return (
    <div className="min-h-full bg-background text-foreground">
      <aside className="fixed inset-y-0 left-0 z-30 hidden w-60 flex-col border-r border-border bg-card px-4 py-5 lg:flex">
        <Link href="/dashboard" className="px-2">
          <span className="text-xs uppercase tracking-[0.2em] text-primary">Tradebook</span>
          <span className="mt-1 block text-sm text-muted-foreground">Private desk</span>
        </Link>
        <div className="mt-8 flex-1">
          <NavLinks pathname={pathname} />
        </div>
        <div className="border-t border-border pt-4">
          <p className="truncate px-2 text-sm">{user.name}</p>
          <p className="truncate px-2 text-xs text-muted-foreground">{user.email}</p>
          <Button variant="ghost" size="sm" className="mt-3 w-full justify-start" onClick={signOut} disabled={pending}>
            <LogOut className="size-4" aria-hidden="true" />
            Sign out
          </Button>
        </div>
      </aside>

      <header className="sticky top-0 z-20 flex items-center justify-between border-b border-border bg-background/90 px-4 py-3 backdrop-blur lg:hidden">
        <Link href="/dashboard" className="text-xs uppercase tracking-[0.2em] text-primary">
          Tradebook
        </Link>
        <Button variant="ghost" size="sm" aria-expanded={open} aria-label={open ? "Close menu" : "Open menu"} onClick={() => setOpen((value) => !value)}>
          {open ? <X className="size-4" /> : <Menu className="size-4" />}
        </Button>
      </header>
      {open ? (
        <div className="border-b border-border bg-card px-4 py-4 lg:hidden">
          <NavLinks pathname={pathname} onNavigate={() => setOpen(false)} />
          <Button variant="ghost" size="sm" className="mt-3" onClick={signOut} disabled={pending}>
            <LogOut className="size-4" aria-hidden="true" />
            Sign out
          </Button>
        </div>
      ) : null}

      <div className="lg:pl-60">
        <div className="mx-auto w-full max-w-6xl px-4 py-6 sm:px-6 lg:px-8 lg:py-8">{children}</div>
      </div>
    </div>
  );
}
