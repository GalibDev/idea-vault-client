"use client";

import { useEffect, useState } from "react";
import ProtectedRoute from "../../components/ProtectedRoute.jsx";
import { useToast } from "../../components/Toast.jsx";
import { ideas } from "../../data/ideas.js";

export default function MyIdeasPage() {
  const { showToast } = useToast();
  const [myIdeas, setMyIdeas] = useState([]);
  const [editing, setEditing] = useState(null);
  const [activeTab, setActiveTab] = useState("All Ideas");

  useEffect(() => {
    const saved = JSON.parse(localStorage.getItem("ideavault-my-ideas") || "[]");
    setMyIdeas(saved.length ? saved : ideas.slice(0, 3).map((idea) => ({ ...idea, status: idea.status || "Published" })));
  }, []);

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

  const deleteIdea = (id) => {
    persist(myIdeas.filter((idea) => (idea._id || idea.id) !== id));
    showToast("Idea deleted successfully.");
  };

  const saveEdit = () => {
    const editingId = editing._id || editing.id;
    persist(myIdeas.map((idea) => (idea._id || idea.id) === editingId ? editing : idea));
    setEditing(null);
    showToast("Idea updated successfully.");
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
                    <button className="rounded-md bg-rose-50 px-3 py-2 text-xs font-bold text-rose-600" onClick={() => deleteIdea(idea._id || idea.id)}>Delete</button>
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
                <input className="field mt-4" value={editing.title} onChange={(event) => setEditing({ ...editing, title: event.target.value })} />
                <textarea className="field mt-3 min-h-24" value={editing.summary} onChange={(event) => setEditing({ ...editing, summary: event.target.value })} />
                <select className="field mt-3" value={editing.status || "Published"} onChange={(event) => setEditing({ ...editing, status: event.target.value })}>
                  <option>Published</option>
                  <option>Draft</option>
                </select>
                <div className="mt-4 flex justify-end gap-3">
                  <button className="btn-soft px-4 py-2 text-sm" onClick={() => setEditing(null)}>Cancel</button>
                  <button className="btn-primary px-4 py-2 text-sm" onClick={saveEdit}>Save</button>
                </div>
              </div>
            </div>
          ) : null}
        </div>
      </div>
    </ProtectedRoute>
  );
}
