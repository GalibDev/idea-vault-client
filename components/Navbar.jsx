"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { useAuth } from "../context/AuthContext.jsx";
import { useTheme } from "../context/ThemeContext.jsx";

const navItems = [
  { href: "/", label: "Home", private: false },
  { href: "/ideas", label: "Ideas", private: false },
  { href: "/add-idea", label: "Add Idea", private: true },
  { href: "/my-ideas", label: "My Ideas", private: true },
  { href: "/my-interactions", label: "My Interactions", private: true },
];

export default function Navbar() {
  const pathname = usePathname();
  const { user, logout } = useAuth();
  const { darkMode, toggleTheme } = useTheme();
  const [open, setOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 border-b border-slate-200/80 bg-white/95 backdrop-blur dark-surface">
      <nav className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-4 py-4 sm:px-6 lg:px-8">
        <Link href="/" className="flex items-center gap-2 text-xl font-extrabold tracking-tight text-slate-950 dark-text">
          <span className="grid h-8 w-8 place-items-center rounded-full bg-gradient-to-br from-[#6366F1] to-[#8B5CF6] text-base text-white">
            IV
          </span>
          <span>
            Idea<span className="text-[#6366F1]">Vault</span>
          </span>
        </Link>

        <div className="hidden items-center gap-7 text-sm font-semibold text-slate-700 md:flex">
          {navItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={pathname === item.href ? "text-[#6366F1]" : "transition hover:text-[#6366F1]"}
            >
              {item.label}
            </Link>
          ))}
        </div>

        <div className="flex items-center gap-2">
          <Link href="/ideas" className="icon-button" aria-label="Search ideas" title="Search ideas">
            <svg width="17" height="17" viewBox="0 0 24 24" fill="none" aria-hidden="true">
              <circle cx="11" cy="11" r="7" stroke="currentColor" strokeWidth="2" />
              <path d="M16.5 16.5L21 21" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
            </svg>
          </Link>
          <button className="icon-button" onClick={toggleTheme} aria-label="Toggle theme" title="Toggle theme">
            {darkMode ? (
              <svg width="17" height="17" viewBox="0 0 24 24" fill="none" aria-hidden="true">
                <path
                  d="M20 14.2A7.5 7.5 0 0 1 9.8 4a8.5 8.5 0 1 0 10.2 10.2Z"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinejoin="round"
                />
              </svg>
            ) : (
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden="true">
                <circle cx="12" cy="12" r="4" stroke="currentColor" strokeWidth="2" />
                <path
                  d="M12 2v2M12 20v2M4 12H2M22 12h-2M5 5l1.5 1.5M17.5 17.5 19 19M19 5l-1.5 1.5M6.5 17.5 5 19"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                />
              </svg>
            )}
          </button>
          {!user ? (
            <div className="hidden items-center gap-2 sm:flex">
              <Link href="/login" className="h-9 rounded-full bg-slate-950 px-4 py-2 text-xs font-bold text-white transition hover:bg-[#6366F1]">
                Login
              </Link>
              <Link href="/register" className="btn-soft px-4 py-2 text-xs">Register</Link>
            </div>
          ) : (
            <div className="relative">
              <button onClick={() => setOpen((current) => !current)} className="avatar" aria-label="User profile">
                {(user.name || user.email || "U").slice(0, 2).toUpperCase()}
              </button>
              {open ? (
                <div className="absolute right-0 mt-3 w-56 rounded-lg border border-slate-200 bg-white p-3 shadow-xl">
                  <p className="font-extrabold text-slate-950">{user.name}</p>
                  <p className="truncate text-xs text-slate-500">{user.email}</p>
                  <Link href="/profile" className="mt-3 block rounded-md px-3 py-2 text-sm font-bold text-slate-700 hover:bg-indigo-50">
                    Profile Management
                  </Link>
                  <button
                    onClick={() => {
                      logout();
                      setOpen(false);
                    }}
                    className="w-full rounded-md px-3 py-2 text-left text-sm font-bold text-rose-600 hover:bg-rose-50"
                  >
                    Logout
                  </button>
                </div>
              ) : null}
            </div>
          )}
        </div>
      </nav>
    </header>
  );
}
