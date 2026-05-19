import Link from "next/link";
import ProtectedRoute from "../../components/ProtectedRoute.jsx";
import { ideas } from "../../data/ideas.js";

export default function MyInteractionsPage() {
  return (
    <ProtectedRoute>
      <div className="page-shell">
        <div className="content-shell max-w-3xl">
          <div className="mb-5 flex gap-7 border-b border-slate-200 text-sm font-bold text-slate-500">
            <span className="border-b-2 border-[#6366F1] pb-3 text-[#6366F1]">Commented Ideas</span>
            <Link href="/bookmarks" className="pb-3 hover:text-[#6366F1]">Bookmarks</Link>
            <span className="pb-3">Likes</span>
          </div>
          <div className="space-y-4">
            {ideas.slice(0, 3).map((idea, index) => (
              <article key={idea.id} className="section-card flex gap-4 p-4">
                <img src={idea.image} alt={idea.title} className="h-20 w-28 rounded-md object-cover" />
                <div>
                  <h2 className="font-extrabold text-slate-950 dark-text">{idea.title}</h2>
                  <p className="text-xs text-slate-400">You commented on May {12 - index}, 2024</p>
                  <p className="mt-2 text-sm text-slate-600">
                    {index === 0 ? "Great idea! This can really help students." : "How will the data be secured?"}
                  </p>
                </div>
              </article>
            ))}
          </div>
        </div>
      </div>
    </ProtectedRoute>
  );
}
