import { AppShell } from "@/components/layout/app-shell";
import { ImportCaseForm } from "@/components/import-case-form";
import { getCurrentUserFromCookies } from "@/lib/current-user";

export default async function SettingsPage() {
  await getCurrentUserFromCookies();
  return (
    <AppShell>
      <div className="space-y-6 p-5 lg:p-8">
        <div>
          <div className="text-sm uppercase tracking-[0.22em] text-cyan-300">Workspace controls</div>
          <h1 className="mt-2 text-3xl font-bold text-white">Settings</h1>
        </div>
        <section className="glass-panel max-w-3xl rounded-md p-5">
          <h2 className="text-lg font-semibold text-white">Local-first configuration</h2>
          <div className="mt-4 grid gap-3 text-sm text-slate-300">
            <div className="rounded-md border border-slate-800 bg-slate-950/60 p-3">Database: <span className="font-mono text-cyan-200">./data/caselink.db</span></div>
            <div className="rounded-md border border-slate-800 bg-slate-950/60 p-3">Uploads: <span className="font-mono text-cyan-200">./uploads</span></div>
            <div className="rounded-md border border-slate-800 bg-slate-950/60 p-3">Markdown rendering avoids raw HTML execution and uploaded files are never executed by the app.</div>
            <ImportCaseForm />
          </div>
        </section>
      </div>
    </AppShell>
  );
}
