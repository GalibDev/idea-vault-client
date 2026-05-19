"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { useToast } from "./Toast.jsx";

const bookmarksKey = "ideavault-bookmarks";

export default function IdeaCard({ idea, compact = false }) {
  const ideaId = String(idea._id || idea.id);
  const { showToast } = useToast() || {};
  const [bookmarked, setBookmarked] = useState(false);

  useEffect(() => {
    const saved = JSON.parse(localStorage.getItem(bookmarksKey) || "[]");
    setBookmarked(saved.some((item) => String(item._id || item.id) === ideaId));
  }, [ideaId]);

  const toggleBookmark = () => {
    const saved = JSON.parse(localStorage.getItem(bookmarksKey) || "[]");
    const exists = saved.some((item) => String(item._id || item.id) === ideaId);
    const next = exists ? saved.filter((item) => String(item._id || item.id) !== ideaId) : [{ ...idea, id: ideaId }, ...saved];

    localStorage.setItem(bookmarksKey, JSON.stringify(next));
    setBookmarked(!exists);
    showToast?.(exists ? "Bookmark removed." : "Idea bookmarked successfully.");
  };

  return (
    <article className="idea-card group">
      <img src={idea.image} alt={idea.title} className={compact ? "h-28 w-full object-cover" : "h-40 w-full object-cover"} />
      <div className="space-y-2 p-4">
        <div className="flex items-start justify-between gap-3">
          <h3 className="line-clamp-2 text-base font-extrabold leading-snug text-slate-950 dark-text">{idea.title}</h3>
          {idea.badge ? <span className="tag shrink-0">{idea.badge}</span> : null}
        </div>
        <p className="text-xs font-medium text-slate-500">{idea.category}</p>
        {!compact ? <p className="line-clamp-2 text-sm text-slate-600">{idea.summary}</p> : null}
        <div className="flex items-center gap-5 pt-2 text-xs font-medium text-slate-500">
          <span>Likes {idea.likes || 0}</span>
          <span>Comments {idea.comments || 0}</span>
        </div>
        <div className="flex flex-wrap gap-2 pt-2">
          <Link href={`/ideas/${ideaId}`} className="btn-primary inline-flex px-4 py-2 text-xs">
            View Details
          </Link>
          <button type="button" className="btn-soft px-4 py-2 text-xs" onClick={toggleBookmark}>
            {bookmarked ? "Bookmarked" : "Bookmark"}
          </button>
        </div>
      </div>
    </article>
  );
}
