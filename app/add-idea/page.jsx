"use client";

import { useState } from "react";
import ProtectedRoute from "../../components/ProtectedRoute.jsx";
import { useToast } from "../../components/Toast.jsx";
import { useAuth } from "../../context/AuthContext.jsx";

const initialForm = {
  title: "",
  summary: "",
  description: "",
  category: "AI",
  tags: "",
  image: "",
  budget: "",
  targetAudience: "",
  problem: "",
  solution: "",
};

export default function AddIdeaPage() {
  const [form, setForm] = useState(initialForm);
  const { showToast } = useToast();
  const { token, user } = useAuth();

  const update = (key, value) => setForm((current) => ({ ...current, [key]: value }));

  const handleImageUpload = (event) => {
    const file = event.target.files?.[0];
    if (!file) {
      return;
    }

    if (!file.type.startsWith("image/")) {
      showToast("Please select a valid image file.", "error");
      return;
    }

    if (file.size > 2 * 1024 * 1024) {
      showToast("Image size must be under 2MB.", "error");
      return;
    }

    const reader = new FileReader();
    reader.onload = () => {
      update("image", reader.result);
      showToast("Image uploaded and preview is ready.");
    };
    reader.onerror = () => showToast("Could not read this image file.", "error");
    reader.readAsDataURL(file);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (!form.title || !form.summary || !form.description || !form.image || !form.targetAudience || !form.problem || !form.solution) {
      showToast("Please complete all required idea fields.", "error");
      return;
    }

    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000"}/ideas`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ ...form, status: "Published", badge: form.category }),
      });

      if (!response.ok) {
        throw new Error("Could not save idea to MongoDB.");
      }

      const savedIdeas = JSON.parse(localStorage.getItem("ideavault-my-ideas") || "[]");
      const nextIdea = await response.json();
      localStorage.setItem("ideavault-my-ideas", JSON.stringify([nextIdea, ...savedIdeas]));
      setForm(initialForm);
      showToast("Idea saved to MongoDB successfully.");
    } catch (error) {
      showToast(error.message, "error");
    }
  };

  return (
    <ProtectedRoute>
      <div className="page-shell">
        <div className="content-shell max-w-4xl">
          <form className="section-card space-y-5 p-6" onSubmit={handleSubmit}>
            <h1 className="text-2xl font-extrabold text-slate-950 dark-text">Add New Idea</h1>
            <label className="block">
              <span className="mb-2 block text-sm font-bold text-slate-700">Idea Title</span>
              <input className="field" placeholder="Enter idea title" value={form.title} onChange={(event) => update("title", event.target.value)} />
            </label>
            <label className="block">
              <span className="mb-2 block text-sm font-bold text-slate-700">Short Description</span>
              <input className="field" placeholder="Write a short description" value={form.summary} onChange={(event) => update("summary", event.target.value)} />
            </label>
            <label className="block">
              <span className="mb-2 block text-sm font-bold text-slate-700">Detailed Description</span>
              <textarea className="field min-h-28" placeholder="Describe your idea in detail" value={form.description} onChange={(event) => update("description", event.target.value)} />
            </label>
            <div className="grid gap-4 md:grid-cols-2">
              <label className="block">
                <span className="mb-2 block text-sm font-bold text-slate-700">Category</span>
                <select className="field" value={form.category} onChange={(event) => update("category", event.target.value)}>
                  {["Tech", "Health", "AI", "Education", "Environment", "Fintech", "Travel"].map((item) => <option key={item}>{item}</option>)}
                </select>
              </label>
              <label className="block">
                <span className="mb-2 block text-sm font-bold text-slate-700">Tags</span>
                <input className="field" placeholder="AI, Career, Education" value={form.tags} onChange={(event) => update("tags", event.target.value)} />
              </label>
            </div>
            <div className="grid gap-4 md:grid-cols-2">
              <div>
                <span className="mb-2 block text-sm font-bold text-slate-700">Idea Image</span>
                <label className="upload-box">
                  <input className="sr-only" type="file" accept="image/*" onChange={handleImageUpload} />
                  <span className="text-sm font-extrabold text-[#6366F1]">Click to upload image</span>
                  <span className="mt-1 text-xs text-slate-500">PNG, JPG, WEBP under 2MB</span>
                </label>
                {form.image ? (
                  <img src={form.image} alt="Idea preview" className="mt-3 h-36 w-full rounded-md object-cover" />
                ) : null}
              </div>
              <label className="block">
                <span className="mb-2 block text-sm font-bold text-slate-700">Estimated Budget</span>
                <input className="field" placeholder="$10,000 - $20,000" value={form.budget} onChange={(event) => update("budget", event.target.value)} />
              </label>
            </div>
            <label className="block">
              <span className="mb-2 block text-sm font-bold text-slate-700">Target Audience</span>
              <input className="field" placeholder="Who is your target audience?" value={form.targetAudience} onChange={(event) => update("targetAudience", event.target.value)} />
            </label>
            <label className="block">
              <span className="mb-2 block text-sm font-bold text-slate-700">Problem Statement</span>
              <input className="field" placeholder="What problem does this idea solve?" value={form.problem} onChange={(event) => update("problem", event.target.value)} />
            </label>
            <label className="block">
              <span className="mb-2 block text-sm font-bold text-slate-700">Proposed Solution</span>
              <input className="field" placeholder="How will your idea solve the problem?" value={form.solution} onChange={(event) => update("solution", event.target.value)} />
            </label>
            <div className="flex justify-end gap-3 pt-2">
              <button type="button" className="btn-soft px-5 py-3 text-sm" onClick={() => setForm(initialForm)}>Cancel</button>
              <button type="submit" className="btn-primary px-5 py-3 text-sm">Submit Idea</button>
            </div>
          </form>
        </div>
      </div>
    </ProtectedRoute>
  );
}
