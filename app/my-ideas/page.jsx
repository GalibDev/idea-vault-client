"use client";

import { useEffect, useState } from "react";
import ProtectedRoute from "../../components/ProtectedRoute.jsx";
import { useToast } from "../../components/Toast.jsx";
import { useAuth } from "../../context/AuthContext.jsx";
import { ideas } from "../../data/ideas.js";

const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";

export default function MyIdeasPage() {
  const { showToast } = useToast();
  const { token } = useAuth();
  const [myIdeas, setMyIdeas] = useState([]);
  const [editing, setEditing] = useState(null);
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [activeTab, setActiveTab] = useState("All Ideas");

  useEffect(() => {
    const saved = JSON.parse(localStorage.getItem("ideavault-my-ideas") || "[]");
    setMyIdeas(saved.length ? saved : ideas.slice(0, 3).map((idea) => ({ ...idea, status: idea.status || "Published" })));

    if (!token) {
      return;
    }

    fetch(`${apiUrl}/my-ideas`, {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((response) => response.json())
      .then((data) => {
        if (Array.isArray(data) && data.length) {
          setMyIdeas(data);
          localStorage.setItem("ideavault-my-ideas", JSON.stringify(data));
        }
      })
      .catch(() => null);
  }, [token]);

  const tabs = ["All Ideas", "Published", "Drafts"];
  const visibleIdeas = myIdeas.filter((idea) => {
    if (activeTab === "Published") {
      return idea.status === "Published";
    }
    if (activeTab === "Drafts") {
      return idea.status === "Draft";
    }
    return true;
  });

  const persist = (items) => {
    setMyIdeas(items);
    localStorage.setItem("ideavault-my-ideas", JSON.stringify(items));
  };

  const deleteIdea = async () => {
    const id = deleteTarget?._id || deleteTarget?.id;
    if (!id) {
      return;
    }

    try {
      if (token && deleteTarget?._id) {
        const response = await fetch(`${apiUrl}/ideas/${id}`, {
          method: "DELETE",
          headers: { Authorization: `Bearer ${token}` },
        });

        if (!response.ok) {
          throw new Error("Could not delete idea from database.");
        }
      }

      persist(myIdeas.filter((idea) => (idea._id || idea.id) !== id));
      setDeleteTarget(null);
      showToast("Idea deleted successfully.");
    } catch (error) {
      showToast(error.message, "error");
    }
  };

  const saveEdit = async () => {
    const editingId = editing._id || editing.id;

    try {
      if (token && editing._id) {
        const response = await fetch(`${apiUrl}/ideas/${editingId}`, {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(editing),
        });

        if (!response.ok) {
          throw new Error("Could not update idea in database.");
        }
      }

      persist(myIdeas.map((idea) => (idea._id || idea.id) === editingId ? editing : idea));
      setEditing(null);
      showToast("Idea updated successfully.");
    } catch (error) {
      showToast(error.message, "error");
    }
  };

  return (
    <ProtectedRoute>
      <div className="page-shell">
        <div className="content-shell max-w-3xl">
          <div className="mb-5 flex gap-7 border-b border-slate-200 text-sm font-bold text-slate-500">
            {tabs.map((tab) => (
              <button
                key={tab}
                className={activeTab === tab ? "border-b-2 border-[#6366F1] pb-3 text-[#6366F1]" : "pb-3 hover:text-[#6366F1]"}
                onClick={() => setActiveTab(tab)}
              >
                {tab}
              </button>
            ))}
          </div>
          <p className="mb-4 text-sm font-semibold text-slate-500">
            Showing {visibleIdeas.length} {activeTab.toLowerCase()}
          </p>
          <div className="space-y-4">
            {visibleIdeas.map((idea) => (
              <article key={idea._id || idea.id} className="section-card flex gap-4 p-4">
                <img src={idea.image} alt={idea.title} className="h-20 w-28 rounded-md object-cover" />
                <div className="min-w-0 flex-1">
                  <div className="flex items-start justify-between gap-3">
                    <h2 className="font-extrabold text-slate-950 dark-text">{idea.title}</h2>
                    <span className={idea.status === "Draft" ? "tag bg-amber-100 text-amber-700" : "tag bg-emerald-100 text-emerald-700"}>{idea.status}</span>
                  </div>
                  <p className="line-clamp-2 text-sm text-slate-500">{idea.summary}</p>
                  <div className="mt-3 flex gap-3">
                    <button className="btn-soft px-3 py-2 text-xs" onClick={() => setEditing(idea)}>Update</button>
                    <button
                      className="btn-soft px-3 py-2 text-xs"
                      onClick={() => {
                        const nextStatus = idea.status === "Draft" ? "Published" : "Draft";
                        const ideaId = idea._id || idea.id;
                        persist(myIdeas.map((item) => (item._id || item.id) === ideaId ? { ...item, status: nextStatus } : item));
                        showToast(`Idea moved to ${nextStatus}.`);
                      }}
                    >
                      Move to {idea.status === "Draft" ? "Published" : "Draft"}
                    </button>
                    <button className="rounded-md bg-rose-50 px-3 py-2 text-xs font-bold text-rose-600" onClick={() => setDeleteTarget(idea)}>Delete</button>
                  </div>
                </div>
              </article>
            ))}
            {!visibleIdeas.length ? (
              <section className="section-card p-8 text-center">
                <h2 className="text-xl font-extrabold text-slate-950 dark-text">No ideas found</h2>
                <p className="mt-2 text-slate-500">There are no ideas in this tab yet.</p>
              </section>
            ) : null}
          </div>
          {editing ? (
            <div className="modal-backdrop">
              <div className="section-card w-full max-w-lg p-6">
                <h2 className="text-xl font-extrabold text-slate-950">Update Idea</h2>
                <div className="mt-4 grid max-h-[65vh] gap-3 overflow-y-auto pr-1">
                  <input className="field" placeholder="Idea title" value={editing.title || ""} onChange={(event) => setEditing({ ...editing, title: event.target.value })} />
                  <textarea className="field min-h-20" placeholder="Short description" value={editing.summary || ""} onChange={(event) => setEditing({ ...editing, summary: event.target.value })} />
                  <textarea className="field min-h-24" placeholder="Detailed description" value={editing.description || ""} onChange={(event) => setEditing({ ...editing, description: event.target.value })} />
                  <div className="grid gap-3 sm:grid-cols-2">
                    <select className="field" value={editing.category || "AI"} onChange={(event) => setEditing({ ...editing, category: event.target.value, badge: event.target.value })}>
                      {["Tech", "Health", "AI", "Education", "Environment", "Fintech", "Travel", "AgriTech", "CivicTech", "SaaS"].map((item) => <option key={item}>{item}</option>)}
                    </select>
                    <select className="field" value={editing.status || "Published"} onChange={(event) => setEditing({ ...editing, status: event.target.value })}>
                      <option>Published</option>
                      <option>Draft</option>
                    </select>
                  </div>
                  <input className="field" placeholder="Tags" value={Array.isArray(editing.tags) ? editing.tags.join(", ") : editing.tags || ""} onChange={(event) => setEditing({ ...editing, tags: event.target.value })} />
                  <input className="field" placeholder="Image URL" value={editing.image || ""} onChange={(event) => setEditing({ ...editing, image: event.target.value })} />
                  <input className="field" placeholder="Estimated budget" value={editing.budget || ""} onChange={(event) => setEditing({ ...editing, budget: event.target.value })} />
                  <input className="field" placeholder="Target audience" value={editing.targetAudience || ""} onChange={(event) => setEditing({ ...editing, targetAudience: event.target.value })} />
                  <input className="field" placeholder="Problem statement" value={editing.problem || ""} onChange={(event) => setEditing({ ...editing, problem: event.target.value })} />
                  <input className="field" placeholder="Proposed solution" value={editing.solution || ""} onChange={(event) => setEditing({ ...editing, solution: event.target.value })} />
                </div>
                <div className="mt-4 flex justify-end gap-3">
                  <button className="btn-soft px-4 py-2 text-sm" onClick={() => setEditing(null)}>Cancel</button>
                  <button className="btn-primary px-4 py-2 text-sm" onClick={saveEdit}>Save</button>
                </div>
              </div>
            </div>
          ) : null}
          {deleteTarget ? (
            <div className="modal-backdrop">
              <div className="section-card w-full max-w-md p-6">
                <h2 className="text-xl font-extrabold text-slate-950">Delete Idea?</h2>
                <p className="mt-2 text-sm text-slate-500">
                  This will remove "{deleteTarget.title}" from your ideas. This action cannot be undone.
                </p>
                <div className="mt-5 flex justify-end gap-3">
                  <button className="btn-soft px-4 py-2 text-sm" onClick={() => setDeleteTarget(null)}>Cancel</button>
                  <button className="rounded-md bg-rose-600 px-4 py-2 text-sm font-bold text-white" onClick={deleteIdea}>Confirm Delete</button>
                </div>
              </div>
            </div>
          ) : null}
        </div>
      </div>
    </ProtectedRoute>
  );
}
