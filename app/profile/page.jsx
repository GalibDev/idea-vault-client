"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import ProtectedRoute from "../../components/ProtectedRoute.jsx";
import { useToast } from "../../components/Toast.jsx";
import { useAuth } from "../../context/AuthContext.jsx";

export default function ProfilePage() {
  const { user, updateProfileData } = useAuth();
  const { showToast } = useToast();
  const [form, setForm] = useState({ name: "", email: "", photo: "" });

  useEffect(() => {
    if (user) {
      setForm({ name: user.name || "", email: user.email || "", photo: user.photo || "" });
    }
  }, [user]);

  const saveProfile = async (event) => {
    event.preventDefault();
    try {
      await updateProfileData(form);
      showToast("Profile updated successfully.");
    } catch (error) {
      showToast(error.message, "error");
    }
  };

  return (
    <ProtectedRoute>
      <div className="page-shell">
        <div className="content-shell max-w-4xl">
          <section className="section-card overflow-hidden">
            <div className="h-28 bg-gradient-to-r from-[#6366F1] to-[#8B5CF6]" />
            <div className="grid gap-8 p-6 md:grid-cols-[260px_1fr]">
              <aside className="-mt-16 space-y-5 border-slate-200 md:border-r md:pr-6">
                <div className="grid place-items-center text-center">
                  {form.photo ? (
                    <img src={form.photo} alt="Profile" className="h-24 w-24 rounded-full border-4 border-white object-cover" />
                  ) : (
                    <div className="grid h-24 w-24 place-items-center rounded-full border-4 border-white bg-slate-950 text-2xl font-extrabold text-white">
                      {(form.name || "User").slice(0, 2).toUpperCase()}
                    </div>
                  )}
                  <h1 className="mt-3 text-xl font-extrabold text-slate-950 dark-text">{form.name || "IdeaVault User"}</h1>
                  <p className="text-sm text-slate-500">Entrepreneur & Idea Enthusiast</p>
                </div>
                <nav className="space-y-2 text-sm font-bold text-slate-600">
                  <p className="rounded-md bg-indigo-50 px-3 py-2 text-[#6366F1]">Profile Information</p>
                  <p className="px-3 py-2">Change Password</p>
                  <Link href="/bookmarks" className="block px-3 py-2 hover:text-[#6366F1]">My Bookmarks</Link>
                  <p className="px-3 py-2">Account Settings</p>
                </nav>
              </aside>
              <form className="space-y-4" onSubmit={saveProfile}>
                <h2 className="text-xl font-extrabold text-slate-950 dark-text">Profile Information</h2>
                <label className="block">
                  <span className="mb-2 block text-sm font-bold text-slate-700">Name</span>
                  <input className="field" value={form.name} onChange={(event) => setForm({ ...form, name: event.target.value })} />
                </label>
                <label className="block">
                  <span className="mb-2 block text-sm font-bold text-slate-700">Email</span>
                  <input className="field" value={form.email} onChange={(event) => setForm({ ...form, email: event.target.value })} />
                </label>
                <div>
                  <label className="block">
                    <span className="mb-2 block text-sm font-bold text-slate-700">Photo URL</span>
                    <input
                      className="field"
                      type="text"
                      placeholder="https://example.com/profile.jpg or /images/profile.jpg"
                      value={form.photo}
                      onChange={(event) => setForm({ ...form, photo: event.target.value })}
                    />
                  </label>
                  {form.photo ? (
                    <img src={form.photo} alt="Profile preview" className="mt-3 h-28 w-28 rounded-full object-cover" />
                  ) : null}
                </div>
                <button className="btn-primary px-5 py-3 text-sm" type="submit">Update Profile</button>
              </form>
            </div>
          </section>
        </div>
      </div>
    </ProtectedRoute>
  );
}
