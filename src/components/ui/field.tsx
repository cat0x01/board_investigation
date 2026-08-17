import { clsx } from "clsx";
import type { InputHTMLAttributes, ReactNode, SelectHTMLAttributes, TextareaHTMLAttributes } from "react";

export function Field({ label, children }: { label: string; children: ReactNode }) {
  return (
<<<<<<< HEAD
    <label className="grid min-w-0 content-start gap-2 text-[11px] font-medium uppercase tracking-[0.16em] text-slate-400">
=======
    <label className="grid gap-1.5 text-xs font-medium uppercase tracking-[0.16em] text-slate-400">
>>>>>>> b94b362dc1c9ae54477d93b700bfac957ca2f756
      <span>{label}</span>
      {children}
    </label>
  );
}

export function Input({ className, ...props }: InputHTMLAttributes<HTMLInputElement>) {
<<<<<<< HEAD
  return <input className={clsx("h-11 w-full min-w-0 rounded-lg border border-slate-700/80 bg-slate-950/70 px-3 text-sm text-slate-100 outline-none transition placeholder:text-slate-600 focus:border-amber-400/70 focus:ring-2 focus:ring-amber-400/10", className)} {...props} />;
}

export function Textarea({ className, ...props }: TextareaHTMLAttributes<HTMLTextAreaElement>) {
  return <textarea className={clsx("min-h-24 w-full min-w-0 rounded-lg border border-slate-700/80 bg-slate-950/70 px-3 py-2.5 text-sm text-slate-100 outline-none transition placeholder:text-slate-600 focus:border-amber-400/70 focus:ring-2 focus:ring-amber-400/10", className)} {...props} />;
}

export function Select({ className, ...props }: SelectHTMLAttributes<HTMLSelectElement>) {
  return <select className={clsx("h-11 w-full min-w-0 rounded-lg border border-slate-700/80 bg-slate-950/70 px-3 text-sm text-slate-100 outline-none transition focus:border-amber-400/70 focus:ring-2 focus:ring-amber-400/10", className)} {...props} />;
=======
  return <input className={clsx("h-10 rounded-md border border-slate-700/80 bg-slate-950/70 px-3 text-sm text-slate-100 outline-none transition placeholder:text-slate-500 focus:border-cyan-400/70", className)} {...props} />;
}

export function Textarea({ className, ...props }: TextareaHTMLAttributes<HTMLTextAreaElement>) {
  return <textarea className={clsx("min-h-24 rounded-md border border-slate-700/80 bg-slate-950/70 px-3 py-2 text-sm text-slate-100 outline-none transition placeholder:text-slate-500 focus:border-cyan-400/70", className)} {...props} />;
}

export function Select({ className, ...props }: SelectHTMLAttributes<HTMLSelectElement>) {
  return <select className={clsx("h-10 rounded-md border border-slate-700/80 bg-slate-950/70 px-3 text-sm text-slate-100 outline-none transition focus:border-cyan-400/70", className)} {...props} />;
>>>>>>> b94b362dc1c9ae54477d93b700bfac957ca2f756
}
