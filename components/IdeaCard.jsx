import Link from "next/link";

export default function IdeaCard({ idea, compact = false }) {
  const ideaId = idea._id || idea.id;

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
          <span>Likes {idea.likes}</span>
          <span>Comments {idea.comments}</span>
        </div>
        <Link href={`/ideas/${ideaId}`} className="btn-primary mt-3 inline-flex px-4 py-2 text-xs">
          View Details
        </Link>
      </div>
    </article>
  );
}
