import { clsx } from "clsx";
import type { ButtonHTMLAttributes, ReactNode } from "react";

type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: "primary" | "ghost" | "danger";
  children: ReactNode;
};

export function Button({ className, variant = "ghost", children, ...props }: ButtonProps) {
  return (
    <button
      className={clsx(
        "inline-flex h-10 items-center justify-center gap-2 rounded-md border px-3 text-sm font-medium transition disabled:cursor-not-allowed disabled:opacity-50",
        variant === "primary" && "border-amber-400/50 bg-amber-400/15 text-amber-50 hover:bg-amber-400/25",
        variant === "ghost" && "border-slate-700/80 bg-slate-950/45 text-slate-200 hover:border-slate-500 hover:bg-slate-900",
        variant === "danger" && "border-red-500/40 bg-red-500/15 text-red-100 hover:bg-red-500/25",
        className
      )}
      {...props}
    >
      {children}
    </button>
  );
}
