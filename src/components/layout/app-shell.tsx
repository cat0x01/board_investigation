import type { ReactNode } from "react";
import { Sidebar } from "@/components/layout/sidebar";
import { Topbar } from "@/components/layout/topbar";

export function AppShell({ children }: { children: ReactNode }) {
  return (
    <>
      <Sidebar />
      <Topbar />
<<<<<<< HEAD
      <main className="min-h-screen pt-20 lg:pl-64">
=======
      <main className="min-h-screen pt-20 lg:pl-72">
>>>>>>> b94b362dc1c9ae54477d93b700bfac957ca2f756
        {children}
      </main>
    </>
  );
}
