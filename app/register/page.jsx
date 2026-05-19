"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useAuth } from "../../context/AuthContext.jsx";
import { useToast } from "../../components/Toast.jsx";

export default function RegisterPage() {
  const router = useRouter();
  const { register, googleLogin } = useAuth();
  const { showToast } = useToast();
  const [form, setForm] = useState({ name: "", email: "", photo: "", password: "" });

  const handlePhotoUpload = (event) => {
    const file = event.target.files?.[0];
    if (!file) {
      return;
    }

    if (!file.type.startsWith("image/")) {
      showToast("Please select a valid profile image.", "error");
      return;
    }

    if (file.size > 1024 * 1024) {
      showToast("Profile image must be under 1MB.", "error");
      return;
    }

    const reader = new FileReader();
    reader.onload = () => {
      setForm((current) => ({ ...current, photo: reader.result }));
      showToast("Profile image uploaded.");
    };
    reader.onerror = () => showToast("Could not read this profile image.", "error");
    reader.readAsDataURL(file);
  };

  const handleRegister = async (event) => {
    event.preventDefault();
    try {
      await register(form);
      showToast("Registration successful.");
      router.push("/");
    } catch (error) {
      showToast(error.message, "error");
    }
  };

  const handleGoogle = async () => {
    await googleLogin();
    showToast("Google registration successful.");
    router.push("/");
  };

  return (
    <div className="page-shell">
      <div className="content-shell max-w-md">
        <section className="section-card p-8">
          <h1 className="text-center text-2xl font-extrabold text-slate-950 dark-text">Register</h1>
          <p className="mb-8 mt-1 text-center text-sm text-slate-500">Create your account</p>
          <form className="space-y-4" onSubmit={handleRegister}>
            <input className="field" placeholder="Enter your name" value={form.name} onChange={(event) => setForm({ ...form, name: event.target.value })} />
            <input className="field" type="email" placeholder="Enter your email" value={form.email} onChange={(event) => setForm({ ...form, email: event.target.value })} />
            <label className="upload-box">
              <input className="sr-only" type="file" accept="image/*" onChange={handlePhotoUpload} />
              <span className="text-sm font-extrabold text-[#6366F1]">Click to upload profile image</span>
              <span className="mt-1 text-xs text-slate-500">PNG, JPG, WEBP under 1MB</span>
            </label>
            {form.photo ? (
              <img src={form.photo} alt="Profile preview" className="mx-auto h-24 w-24 rounded-full object-cover" />
            ) : null}
            <input className="field" type="password" placeholder="Enter your password" value={form.password} onChange={(event) => setForm({ ...form, password: event.target.value })} />
            <p className="text-xs text-slate-500">Password needs 6 characters, one uppercase, and one lowercase letter.</p>
            <button className="btn-primary w-full py-3 text-sm" type="submit">Register</button>
          </form>
          <div className="my-6 flex items-center gap-3 text-xs font-bold text-slate-400">
            <span className="h-px flex-1 bg-slate-200" /> OR <span className="h-px flex-1 bg-slate-200" />
          </div>
          <button className="btn-soft w-full py-3 text-sm" onClick={handleGoogle}>Register with Google</button>
          <p className="mt-6 text-center text-sm text-slate-500">
            Already have an account? <Link className="font-bold text-[#6366F1]" href="/login">Login</Link>
          </p>
        </section>
      </div>
    </div>
  );
}
