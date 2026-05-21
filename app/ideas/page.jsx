"use client";

import { useEffect, useMemo, useState } from "react";
import IdeaCard from "../../components/IdeaCard.jsx";
import { ideas } from "../../data/ideas.js";

const ideasPerPage = 6;

export default function IdeasPage() {
  const [draftSearch, setDraftSearch] = useState("");
  const [draftCategory, setDraftCategory] = useState("All Categories");
  const [draftSort, setDraftSort] = useState("Latest");
  const [filters, setFilters] = useState({ search: "", category: "All Categories", sort: "Latest" });
  const [remoteIdeas, setRemoteIdeas] = useState([]);
  const [loadingIdeas, setLoadingIdeas] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);

  useEffect(() => {
    setLoadingIdeas(true);
    fetch(`${process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000"}/ideas`)
      .then((response) => response.json())
      .then((data) => setRemoteIdeas(Array.isArray(data) ? data : []))
      .catch(() => setRemoteIdeas([]))
      .finally(() => setLoadingIdeas(false));
  }, []);

  const allIdeas = [...remoteIdeas, ...ideas];
  const categories = ["All Categories", ...Array.from(new Set(allIdeas.map((idea) => idea.category).filter(Boolean)))];
  const filteredIdeas = useMemo(() => {
    const filtered = allIdeas.filter((idea) => {
      const matchesSearch = idea.title.toLowerCase().includes(filters.search.toLowerCase());
      const matchesCategory = filters.category === "All Categories" || idea.category === filters.category;
      return matchesSearch && matchesCategory;
    });

    if (filters.sort === "Most Liked") {
      return filtered.sort((a, b) => Number(b.likes || 0) - Number(a.likes || 0));
    }

    if (filters.sort === "Most Discussed") {
      return filtered.sort((a, b) => Number(b.comments || 0) - Number(a.comments || 0));
    }

    return filtered.sort((a, b) => {
      const aDate = new Date(a.createdAt || a.date || 0).getTime();
      const bDate = new Date(b.createdAt || b.date || 0).getTime();
      return bDate - aDate;
    });
  }, [allIdeas, filters]);
  const totalPages = Math.max(1, Math.ceil(filteredIdeas.length / ideasPerPage));
  const currentIdeas = filteredIdeas.slice((currentPage - 1) * ideasPerPage, currentPage * ideasPerPage);
  const visiblePages = Array.from({ length: totalPages }, (_, index) => index + 1);

  const applyFilters = () => {
    setFilters({
      search: draftSearch.trim(),
      category: draftCategory,
      sort: draftSort,
    });
    setCurrentPage(1);
  };

  const clearFilters = () => {
    setDraftSearch("");
    setDraftCategory("All Categories");
    setDraftSort("Latest");
    setFilters({ search: "", category: "All Categories", sort: "Latest" });
    setCurrentPage(1);
  };

  return (
    <div className="page-shell">
      <div className="content-shell space-y-6">
        <div className="grid gap-3 md:grid-cols-[1fr_220px_180px_90px_90px]">
          <input
            className="field"
            placeholder="Search ideas by title..."
            value={draftSearch}
            onChange={(event) => setDraftSearch(event.target.value)}
            onKeyDown={(event) => {
              if (event.key === "Enter") {
                applyFilters();
              }
            }}
          />
          <select className="field" value={draftCategory} onChange={(event) => setDraftCategory(event.target.value)}>
            {categories.map((item) => (
              <option key={item}>{item}</option>
            ))}
          </select>
          <select className="field" value={draftSort} onChange={(event) => setDraftSort(event.target.value)}>
            <option>Latest</option>
            <option>Most Liked</option>
            <option>Most Discussed</option>
          </select>
          <button className="btn-primary px-4 py-3 text-sm" onClick={applyFilters}>Filter</button>
          <button className="btn-soft px-4 py-3 text-sm" onClick={clearFilters}>Clear</button>
        </div>

        <p className="text-sm font-semibold text-slate-500">
          Showing {filteredIdeas.length} ideas
          {filters.search ? ` for "${filters.search}"` : ""}
          {filters.category !== "All Categories" ? ` in ${filters.category}` : ""}
        </p>

        {loadingIdeas ? (
          <section className="section-card p-10 text-center">
            <div className="loading-spinner" />
            <p className="text-sm font-semibold text-slate-500">Loading ideas from database...</p>
          </section>
        ) : (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {currentIdeas.map((idea) => (
              <IdeaCard key={idea._id || idea.id} idea={idea} />
            ))}
          </div>
        )}

        <div className="flex flex-wrap justify-center gap-3 pt-4">
          {visiblePages.map((page) => (
            <button
              key={page}
              type="button"
              onClick={() => setCurrentPage(page)}
              className={page === currentPage ? "btn-primary h-9 w-9 text-sm" : "h-9 w-9 rounded-md border border-slate-200 bg-white text-sm font-bold text-slate-600"}
            >
              {page}
            </button>
          ))}
          <button
            type="button"
            className="h-9 w-9 rounded-md border border-slate-200 bg-white text-sm font-bold text-slate-600 disabled:cursor-not-allowed disabled:opacity-40"
            disabled={currentPage >= totalPages}
            onClick={() => setCurrentPage((page) => Math.min(totalPages, page + 1))}
          >
            {">"}
          </button>
        </div>
      </div>
    </div>
  );
}
