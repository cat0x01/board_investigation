"use client";

<<<<<<< HEAD
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { BadgeCheck, BriefcaseBusiness, Building2, Eye, EyeOff, LockKeyhole, Mail, ShieldCheck, UserRound, UserRoundPlus } from "lucide-react";
=======
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { LogIn, UserPlus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Field, Input } from "@/components/ui/field";
>>>>>>> b94b362dc1c9ae54477d93b700bfac957ca2f756

export function AuthForm({ mode }: { mode: "login" | "register" }) {
  const router = useRouter();
  const [error, setError] = useState("");
<<<<<<< HEAD
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
=======
>>>>>>> b94b362dc1c9ae54477d93b700bfac957ca2f756
  const isRegister = mode === "register";

  async function submit(formData: FormData) {
    setError("");
<<<<<<< HEAD
    if (isRegister && formData.get("password") !== formData.get("confirmPassword")) {
      setError("Passwords do not match.");
      return;
    }
    setLoading(true);
    const payload = Object.fromEntries(formData);
    delete payload.confirmPassword;
    delete payload.agency;
    delete payload.authorized;
    try {
      const response = await fetch(`/api/auth/${mode}`, {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify(payload)
      });
      if (!response.ok) {
        const body = await response.json().catch(() => ({}));
        setError(body.error ?? "Authentication failed.");
        return;
      }
      router.push("/cases");
      router.refresh();
    } finally {
      setLoading(false);
    }
  }

  const inputClass = "h-11 w-full border border-amber-400/20 bg-black/55 pl-12 pr-11 font-mono text-sm text-white outline-none transition placeholder:text-stone-600 focus:border-amber-300/70 focus:bg-black/75 focus:shadow-[0_0_20px_rgba(250,204,21,.08)]";
  const labelClass = "mb-2 block font-mono text-[10px] font-bold uppercase tracking-[0.12em] text-amber-300";

  return (
    <main className="auth-terminal relative min-h-screen overflow-x-hidden bg-black font-mono text-white">
      <div className="auth-map pointer-events-none absolute inset-0" />
      <div className="auth-scanlines pointer-events-none absolute inset-0 opacity-30" />

      <header className="relative z-10 flex items-start justify-between px-5 pt-6 sm:px-8">
        <div className="border-l-2 border-amber-400 pl-3">
          <div className="text-[10px] uppercase tracking-[0.2em] text-amber-300 sm:text-xs">CAT0X01 Investigation Bureau</div>
          <div className="mt-1 text-[8px] uppercase tracking-[0.24em] text-amber-500/60 sm:text-[10px]">Intelligence Analysis System</div>
        </div>
        <div className="flex items-center gap-2 text-[8px] uppercase tracking-[0.16em] text-amber-400/70 sm:text-[10px]">Secure access terminal <LockKeyhole className="size-4 text-amber-300" /></div>
      </header>

      <div className={`relative z-10 mx-auto flex min-h-[calc(100vh-105px)] w-full flex-col items-center px-4 pb-24 ${isRegister ? "pt-4 sm:pt-2" : "justify-center pt-7"}`}>
        <div className={`relative shrink-0 ${isRegister ? "size-28 sm:size-32" : "size-40 sm:size-48"}`}>
          <div className="absolute inset-1 rounded-full bg-amber-400/10 blur-2xl" />
          <Image src="/logo.png" alt="CAT0X01 Investigation Bureau" fill priority sizes="192px" className="relative rounded-full object-cover drop-shadow-[0_0_28px_rgba(250,204,21,.22)]" />
        </div>

        <div className={`${isRegister ? "mt-3" : "mt-5"} text-center`}>
          <h1 className="text-xl font-light uppercase tracking-[0.28em] text-white sm:text-2xl">{isRegister ? "Create Account" : "Secure Login"}</h1>
          <p className="mt-2 text-[10px] uppercase tracking-[0.22em] text-amber-300/70 sm:text-xs">Authorized personnel only</p>
        </div>

        <form onSubmit={(event) => { event.preventDefault(); void submit(new FormData(event.currentTarget)); }} className={`mt-6 w-full border border-amber-400/15 bg-black/70 p-5 shadow-[0_18px_70px_rgba(0,0,0,.8),0_0_35px_rgba(250,204,21,.035)] backdrop-blur-md ${isRegister ? "max-w-md" : "max-w-sm"}`}>
          <div className="grid gap-4">
            {isRegister && <>
              <label><span className={labelClass}>Full name</span><span className="relative block"><UserRound className="absolute left-4 top-1/2 size-4 -translate-y-1/2 text-amber-400/60" /><input name="name" required autoComplete="name" className={inputClass} placeholder="Enter your full name" /></span></label>
            </>}

            <label><span className={labelClass}>{isRegister ? "Email" : "Email / username"}</span><span className="relative block"><Mail className="absolute left-4 top-1/2 size-4 -translate-y-1/2 text-amber-400/60" /><input name="email" type="email" required autoComplete="email" className={inputClass} placeholder={isRegister ? "Enter your email address" : "Enter your email"} /></span></label>

            {isRegister && <label><span className={labelClass}>Role / position</span><span className="relative block"><BriefcaseBusiness className="absolute left-4 top-1/2 z-10 size-4 -translate-y-1/2 text-amber-400/60" /><select name="role" required defaultValue="Analyst" className={`${inputClass} appearance-none`}><option>Analyst</option><option>Senior Analyst</option><option>Case Manager</option><option>Investigator</option><option>Administrator</option></select></span></label>}

            <label><span className={labelClass}>Password</span><span className="relative block"><LockKeyhole className="absolute left-4 top-1/2 size-4 -translate-y-1/2 text-amber-400/60" /><input name="password" type={showPassword ? "text" : "password"} required minLength={isRegister ? 8 : 1} autoComplete={isRegister ? "new-password" : "current-password"} className={inputClass} placeholder={isRegister ? "Create a strong password" : "Enter your password"} /><button type="button" onClick={() => setShowPassword((current) => !current)} className="absolute right-4 top-1/2 -translate-y-1/2 text-amber-400/60 hover:text-amber-300" aria-label={showPassword ? "Hide password" : "Show password"}>{showPassword ? <EyeOff className="size-4" /> : <Eye className="size-4" />}</button></span></label>

            {isRegister && <>
              <label><span className={labelClass}>Confirm password</span><span className="relative block"><LockKeyhole className="absolute left-4 top-1/2 size-4 -translate-y-1/2 text-amber-400/60" /><input name="confirmPassword" type={showConfirm ? "text" : "password"} required minLength={8} autoComplete="new-password" className={inputClass} placeholder="Confirm your password" /><button type="button" onClick={() => setShowConfirm((current) => !current)} className="absolute right-4 top-1/2 -translate-y-1/2 text-amber-400/60 hover:text-amber-300" aria-label={showConfirm ? "Hide password" : "Show password"}>{showConfirm ? <EyeOff className="size-4" /> : <Eye className="size-4" />}</button></span></label>
              <label><span className={labelClass}>Agency / department</span><span className="relative block"><Building2 className="absolute left-4 top-1/2 z-10 size-4 -translate-y-1/2 text-amber-400/60" /><select name="agency" defaultValue="CAT0X01" className={`${inputClass} appearance-none`}><option value="CAT0X01">CAT0X01 Investigation Bureau</option><option value="Cyber Operations">Cyber Operations</option><option value="Financial Intelligence">Financial Intelligence</option><option value="Field Investigations">Field Investigations</option></select></span></label>
              <label className="flex items-start gap-3 text-xs leading-5 text-stone-400"><input name="authorized" type="checkbox" required className="mt-1 accent-amber-400" /><span>I confirm that I am an authorized user and agree to the <span className="text-amber-300">security policy and terms of use</span>.</span></label>
            </>}

            {error && <div role="alert" className="border border-red-500/40 bg-red-950/30 px-3 py-2 text-xs text-red-200">{error}</div>}

            <button type="submit" disabled={loading} className="mt-1 flex h-11 items-center justify-center gap-2 border border-amber-300/50 bg-gradient-to-b from-amber-300 to-amber-500 font-mono text-xs font-bold uppercase tracking-[0.16em] text-black shadow-[0_0_24px_rgba(250,204,21,.16)] transition hover:brightness-110 disabled:opacity-60">{isRegister ? <UserRoundPlus className="size-4" /> : <LockKeyhole className="size-4" />}{loading ? "Verifying..." : isRegister ? "Create Account" : "Login to System"}</button>

            <div className="flex items-center gap-3"><span className="h-px flex-1 bg-amber-400/20" /><span className="text-[10px] uppercase text-stone-500">or</span><span className="h-px flex-1 bg-amber-400/20" /></div>
            <div className="text-center text-xs text-stone-400">{isRegister ? "Already have an account?" : "No authorized account?"} <Link href={isRegister ? "/login" : "/register"} className="text-amber-300 hover:text-amber-200">{isRegister ? "Login" : "Request access"}</Link></div>
          </div>
        </form>

        <div className="mt-4 flex items-center gap-2 text-[9px] uppercase tracking-[0.18em] text-amber-500/45"><ShieldCheck className="size-3" /> Unauthorized access is strictly prohibited</div>
      </div>

      <footer className="absolute inset-x-5 bottom-4 z-10 flex items-end justify-between border-t border-amber-400/10 pt-3 sm:inset-x-8">
        <div className="text-[8px] uppercase tracking-[0.16em] text-stone-600">System status <span className="mt-1 flex items-center gap-2 text-amber-400"><span className="size-1.5 rounded-full bg-amber-300 shadow-[0_0_8px_#facc15]" /> Secure</span></div>
        <div className="text-right text-[8px] uppercase leading-4 tracking-[0.14em] text-stone-600">CAT0X01 Secure Terminal<br />Build 2026.08</div>
      </footer>
      <div className="pointer-events-none absolute bottom-20 left-8 hidden size-32 rounded-full border border-amber-400/10 md:block"><div className="absolute inset-4 rounded-full border border-amber-400/10" /><div className="absolute left-1/2 top-0 h-full w-px bg-amber-400/10" /><div className="absolute left-0 top-1/2 h-px w-full bg-amber-400/10" /></div>
      <BadgeCheck className="pointer-events-none absolute bottom-28 right-10 hidden size-5 text-amber-400/10 lg:block" />
    </main>
=======
    const payload = Object.fromEntries(formData);
    const response = await fetch(`/api/auth/${mode}`, {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify(payload)
    });
    if (!response.ok) {
      const body = await response.json().catch(() => ({}));
      setError(body.error ?? "Authentication failed.");
      return;
    }
    router.push("/dashboard");
    router.refresh();
  }

  return (
    <form action={submit} className="glass-panel grid w-full max-w-md gap-4 rounded-md p-6">
      <div>
        <div className="text-sm uppercase tracking-[0.22em] text-cyan-300">{isRegister ? "Create account" : "Secure login"}</div>
        <h1 className="mt-2 text-2xl font-bold text-white">{isRegister ? "Register" : "Login"}</h1>
      </div>
      {isRegister && (
        <>
          <Field label="Name"><Input name="name" required autoComplete="name" /></Field>
          <Field label="Role"><Input name="role" defaultValue="Analyst" required /></Field>
        </>
      )}
      <Field label="Email"><Input name="email" type="email" required autoComplete="email" /></Field>
      <Field label="Password"><Input name="password" type="password" required minLength={isRegister ? 8 : 1} autoComplete={isRegister ? "new-password" : "current-password"} /></Field>
      {error && <div className="rounded-md border border-red-400/30 bg-red-500/10 p-3 text-sm text-red-100">{error}</div>}
      <Button type="submit" variant="primary">
        {isRegister ? <UserPlus className="size-4" /> : <LogIn className="size-4" />}
        {isRegister ? "Create Account" : "Login"}
      </Button>
      <div className="text-sm text-slate-400">
        {isRegister ? "Already registered?" : "No account yet?"}{" "}
        <Link href={isRegister ? "/login" : "/register"} className="text-cyan-200 hover:text-cyan-100">
          {isRegister ? "Login" : "Register"}
        </Link>
      </div>
    </form>
>>>>>>> b94b362dc1c9ae54477d93b700bfac957ca2f756
  );
}
