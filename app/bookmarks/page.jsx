"use client";

import { useEffect, useState } from "react";
import IdeaCard from "../../components/IdeaCard.jsx";
import ProtectedRoute from "../../components/ProtectedRoute.jsx";

export default function BookmarksPage() {
  const [bookmarks, setBookmarks] = useState([]);

  useEffect(() => {
    setBookmarks(JSON.parse(localStorage.getItem("ideavault-bookmarks") || "[]"));
  }, []);

  return (
    <ProtectedRoute>
      <div className="page-shell">
        <div className="content-shell space-y-6">
          <div>
            <h1 className="text-3xl font-extrabold text-slate-950 dark-text">My Bookmarks</h1>
            <p className="mt-2 text-slate-500">Ideas you saved for later review and discussion.</p>
          </div>

          {bookmarks.length ? (
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {bookmarks.map((idea) => (
                <IdeaCard key={idea._id || idea.id} idea={idea} />
              ))}
            </div>
          ) : (
            <section className="section-card p-8 text-center">
              <h2 className="text-xl font-extrabold text-slate-950 dark-text">No bookmarks yet</h2>
              <p className="mt-2 text-slate-500">Go to the Ideas page and bookmark ideas you want to revisit.</p>
            </section>
          )}
        </div>
      </div>
    </ProtectedRoute>
  );
}
