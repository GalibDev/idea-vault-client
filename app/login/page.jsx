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
  const [showPassword, setShowPassword] = useState(false);

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
            <div className="password-field">
              <input
                className="field pr-12"
                type={showPassword ? "text" : "password"}
                placeholder="Enter your password"
                value={form.password}
                onChange={(event) => setForm({ ...form, password: event.target.value })}
              />
              <button
                type="button"
                className="password-eye"
                onClick={() => setShowPassword((current) => !current)}
                aria-label={showPassword ? "Hide password" : "Show password"}
                title={showPassword ? "Hide password" : "Show password"}
              >
                {showPassword ? (
                  <svg viewBox="0 0 24 24" aria-hidden="true">
                    <path d="M4 4l16 16" />
                    <path d="M10.6 10.6a2 2 0 0 0 2.8 2.8" />
                    <path d="M8.1 5.7A10.4 10.4 0 0 1 12 5c5 0 8.5 4.1 10 7a13.4 13.4 0 0 1-3 3.8" />
                    <path d="M6.6 6.6A13.8 13.8 0 0 0 2 12c1.5 2.9 5 7 10 7 1.5 0 2.9-.4 4.1-1" />
                  </svg>
                ) : (
                  <svg viewBox="0 0 24 24" aria-hidden="true">
                    <path d="M2 12s3.5-7 10-7 10 7 10 7-3.5 7-10 7S2 12 2 12Z" />
                    <circle cx="12" cy="12" r="3" />
                  </svg>
                )}
              </button>
            </div>
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
