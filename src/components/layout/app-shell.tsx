import type { ReactNode } from "react";
import { Sidebar } from "@/components/layout/sidebar";
import { Topbar } from "@/components/layout/topbar";

export function AppShell({ children }: { children: ReactNode }) {
  return (
    <>
      <Sidebar />
      <Topbar />
      <main className="min-h-screen pt-20 lg:pl-64">
        {children}
      </main>
    </>
  );
}
