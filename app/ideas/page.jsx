"use client";

import { useEffect, useMemo, useState } from "react";
import IdeaCard from "../../components/IdeaCard.jsx";
import { ideas } from "../../data/ideas.js";

export default function IdeasPage() {
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("All Categories");
  const [remoteIdeas, setRemoteIdeas] = useState([]);

  useEffect(() => {
    fetch(`${process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000"}/ideas`)
      .then((response) => response.json())
      .then((data) => setRemoteIdeas(Array.isArray(data) ? data : []))
      .catch(() => setRemoteIdeas([]));
  }, []);

  const allIdeas = [...remoteIdeas, ...ideas];
  const categories = ["All Categories", ...Array.from(new Set(allIdeas.map((idea) => idea.category).filter(Boolean)))];
  const filteredIdeas = useMemo(() => {
    return allIdeas.filter((idea) => {
      const matchesSearch = idea.title.toLowerCase().includes(search.toLowerCase());
      const matchesCategory = category === "All Categories" || idea.category === category;
      return matchesSearch && matchesCategory;
    });
  }, [allIdeas, category, search]);

  return (
    <div className="page-shell">
      <div className="content-shell space-y-6">
        <div className="grid gap-3 md:grid-cols-[1fr_220px_180px_90px]">
          <input
            className="field"
            placeholder="Search ideas by title..."
            value={search}
            onChange={(event) => setSearch(event.target.value)}
          />
          <select className="field" value={category} onChange={(event) => setCategory(event.target.value)}>
            {categories.map((item) => (
              <option key={item}>{item}</option>
            ))}
          </select>
          <select className="field" defaultValue="Latest">
            <option>Latest</option>
            <option>Most Liked</option>
            <option>Most Discussed</option>
          </select>
          <button className="btn-primary px-4 py-3 text-sm">Filter</button>
        </div>

        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {filteredIdeas.map((idea) => (
            <IdeaCard key={idea.id} idea={idea} />
          ))}
        </div>

        <div className="flex justify-center gap-3 pt-4">
          {["1", "2", "3", "...", "8", ">"].map((page) => (
            <button
              key={page}
              className={page === "1" ? "btn-primary h-9 w-9 text-sm" : "h-9 w-9 rounded-md border border-slate-200 bg-white text-sm font-bold text-slate-600"}
            >
              {page}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
