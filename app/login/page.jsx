"use client";

import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useState } from "react";
import { useAuth } from "../../context/AuthContext.jsx";
import { useToast } from "../../components/Toast.jsx";

export default function LoginPage() {
  const router = useRouter();
  const params = useSearchParams();
  const { login, googleLogin } = useAuth();
  const { showToast } = useToast();
  const [form, setForm] = useState({ email: "", password: "" });

  const redirectTo = params.get("redirect") || "/";

  const handleSubmit = (event) => {
    event.preventDefault();
    try {
      login(form.email, form.password);
      showToast("Login successful. Welcome back to IdeaVault.");
      router.push(redirectTo);
    } catch (error) {
      showToast(error.message, "error");
    }
  };

  const handleGoogle = () => {
    googleLogin();
    showToast("Google login successful.");
    router.push(redirectTo);
  };

  return (
    <div className="page-shell">
      <div className="content-shell max-w-md">
        <section className="section-card p-8">
          <h1 className="text-center text-2xl font-extrabold text-slate-950 dark-text">Login</h1>
          <p className="mb-8 mt-1 text-center text-sm text-slate-500">Welcome back!</p>
          <form className="space-y-4" onSubmit={handleSubmit}>
            <input className="field" type="email" placeholder="Enter your email" value={form.email} onChange={(event) => setForm({ ...form, email: event.target.value })} />
            <input className="field" type="password" placeholder="Enter your password" value={form.password} onChange={(event) => setForm({ ...form, password: event.target.value })} />
            <button type="button" className="block w-full text-right text-xs font-bold text-[#6366F1]">Forgot Password?</button>
            <button className="btn-primary w-full py-3 text-sm" type="submit">Login</button>
          </form>
          <div className="my-6 flex items-center gap-3 text-xs font-bold text-slate-400">
            <span className="h-px flex-1 bg-slate-200" /> OR <span className="h-px flex-1 bg-slate-200" />
          </div>
          <button className="btn-soft w-full py-3 text-sm" onClick={handleGoogle}>Login with Google</button>
          <p className="mt-6 text-center text-sm text-slate-500">
            Don't have an account? <Link className="font-bold text-[#6366F1]" href="/register">Register</Link>
          </p>
        </section>
      </div>
    </div>
  );
}
