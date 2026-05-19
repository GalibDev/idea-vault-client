"use client";

import Link from "next/link";
import { useAuth } from "../context/AuthContext.jsx";

export default function ProtectedRoute({ children }) {
  const { user, authReady } = useAuth();

  if (!authReady) {
    return (
      <div className="page-shell">
        <div className="loading-spinner" />
      </div>
    );
  }

  if (!user) {
    return (
      <div className="page-shell">
        <section className="section-card mx-auto max-w-lg p-8 text-center">
          <h1 className="text-2xl font-extrabold text-slate-950">Login required</h1>
          <p className="mt-2 text-slate-500">Please login to access this private IdeaVault page.</p>
          <Link href="/login" className="btn-primary mt-6 inline-flex px-5 py-3 text-sm">Go to Login</Link>
        </section>
      </div>
    );
  }

  return children;
}
