"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { LogOut, Search, X } from "lucide-react";

type SearchResults = Record<string, Array<{ id: string; title?: string; codename?: string; relationType?: string; caseId?: string }>>;
type UserOption = { id: string; name: string; email: string; role: string };

export function Topbar() {
  const router = useRouter();
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<SearchResults | null>(null);
  const [currentUser, setCurrentUser] = useState<UserOption | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const handler = (event: KeyboardEvent) => {
      if ((event.ctrlKey || event.metaKey) && event.key.toLowerCase() === "f") {
        event.preventDefault();
        inputRef.current?.focus();
      }
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, []);

  useEffect(() => {
    const run = setTimeout(async () => {
      if (query.trim().length < 2) {
        setResults(null);
        return;
      }
      const response = await fetch(`/api/search?q=${encodeURIComponent(query)}`);
      setResults(await response.json());
    }, 250);
    return () => clearTimeout(run);
  }, [query]);

  useEffect(() => {
    async function loadUser() {
      const response = await fetch("/api/current-user");
      if (response.ok) setCurrentUser(await response.json());
    }
    loadUser();
  }, []);

  async function logout() {
    await fetch("/api/auth/logout", { method: "POST" });
    router.push("/login");
    router.refresh();
  }

  const flatResults = useMemo(() => results ? Object.entries(results).flatMap(([kind, items]) => items.map((item) => ({ kind, item }))).slice(0, 9) : [], [results]);

  return (
    <header className="fixed left-0 right-0 top-0 z-20 border-b border-amber-400/10 bg-black/90 backdrop-blur-xl lg:left-64">
      <div className="flex h-20 items-center gap-4 px-5">
        <div className="relative flex-1">
          <Search className="pointer-events-none absolute left-4 top-1/2 size-4 -translate-y-1/2 text-slate-500" />
          <input ref={inputRef} value={query} onChange={(event) => setQuery(event.target.value)} className="h-12 w-full rounded-md border border-amber-400/10 bg-black/70 pl-11 pr-10 text-sm text-stone-200 outline-none transition focus:border-amber-400/50" placeholder="Search cases, board nodes and notes..." />
          {query && <button className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500" onClick={() => setQuery("")} aria-label="Clear search"><X className="size-4" /></button>}
          {flatResults.length > 0 && (
            <div className="glass-panel absolute left-0 right-0 top-14 z-50 max-h-96 overflow-auto rounded-md p-2">
              {flatResults.map(({ kind, item }) => (
                <Link key={`${kind}-${item.id}`} href={kind === "cases" ? `/cases/${item.id}` : item.caseId ? `/cases/${item.caseId}/board` : "/cases"} className="block rounded-md px-3 py-2 hover:bg-slate-800">
                  <div className="text-xs uppercase tracking-[0.16em] text-amber-300">{kind}</div>
                  <div className="text-sm font-medium text-white">{item.title || item.codename || item.relationType}</div>
                </Link>
              ))}
            </div>
          )}
        </div>
        <div className="flex items-center gap-3 rounded-md border border-amber-400/10 bg-black/60 px-3 py-2">
          <Image src="/logo.png" alt="CAT0X01 account" width={36} height={36} className="size-9 rounded-full object-cover" />
          <div className="hidden text-sm md:block">
            <div className="max-w-40 truncate font-medium text-white">{currentUser?.name ?? "Signed in"}</div>
            <div className="font-mono text-[9px] uppercase tracking-wider text-amber-400">{currentUser?.role ?? "Case Workspace"}</div>
          </div>
          <button onClick={logout} className="grid size-8 place-items-center rounded-md border border-slate-800 text-slate-300 hover:bg-slate-900" aria-label="Logout"><LogOut className="size-4" /></button>
        </div>
      </div>
    </header>
  );
}
