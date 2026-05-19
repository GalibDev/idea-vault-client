"use client";

import Link from "next/link";
import { useState } from "react";
import ProtectedRoute from "../../../components/ProtectedRoute.jsx";
import { useToast } from "../../../components/Toast.jsx";
import { useAuth } from "../../../context/AuthContext.jsx";
import { comments as seedComments, ideas } from "../../../data/ideas.js";

export default function IdeaDetailsPage({ params }) {
  const idea = ideas.find((item) => item.id === Number(params.id));
  const { user } = useAuth();
  const { showToast } = useToast();
  const [commentText, setCommentText] = useState("");
  const [editing, setEditing] = useState(null);
  const [comments, setComments] = useState(seedComments.map((comment, index) => ({ ...comment, id: index + 1, ownerEmail: index === 0 ? "google.user@ideavault.com" : "rahim@example.com" })));

  if (!idea) {
    return (
      <ProtectedRoute>
        <div className="page-shell">
          <div className="section-card mx-auto max-w-lg p-8 text-center">Idea not found.</div>
        </div>
      </ProtectedRoute>
    );
  }

  if (!user) {
    return <ProtectedRoute><div /></ProtectedRoute>;
  }

  const addComment = () => {
    if (!commentText.trim()) {
      showToast("Please write a comment first.", "error");
      return;
    }

    setComments([
      {
        id: Date.now(),
        user: user.name,
        ownerEmail: user.email,
        date: new Date().toLocaleString(),
        text: commentText,
      },
      ...comments,
    ]);
    setCommentText("");
    showToast("Comment added successfully.");
  };

  const saveComment = () => {
    setComments(comments.map((comment) => comment.id === editing.id ? editing : comment));
    setEditing(null);
    showToast("Comment updated successfully.");
  };

  const deleteComment = (id) => {
    setComments(comments.filter((comment) => comment.id !== id));
    showToast("Comment deleted successfully.");
  };

  return (
    <ProtectedRoute>
      <div className="page-shell">
        <div className="content-shell max-w-5xl space-y-6">
          <Link href="/ideas" className="text-sm font-bold text-slate-500 hover:text-[#6366F1]">{"<-"} Back to Ideas</Link>
          <article className="space-y-5">
            <div className="flex flex-wrap items-center justify-between gap-4">
              <div>
                <div className="flex items-center gap-3">
                  <h1 className="text-3xl font-extrabold text-slate-950 dark-text">{idea.title}</h1>
                  <span className="tag">{idea.badge}</span>
                </div>
                <div className="mt-3 flex items-center gap-3 text-sm text-slate-500">
                  <span className="avatar h-8 w-8 text-[10px]">RH</span>
                  <span><strong className="text-slate-800">{idea.author}</strong> | {idea.date} | {idea.readTime}</span>
                </div>
              </div>
              <div className="flex gap-4 text-sm font-bold text-slate-500">
                <span>Likes {idea.likes}</span>
                <span>Comments {comments.length}</span>
              </div>
            </div>

            <img src={idea.image} alt={idea.title} className="h-[420px] w-full rounded-lg object-cover" />

            <div className="grid gap-4 text-sm md:grid-cols-[190px_1fr]">
              <strong>Problem Statement</strong>
              <p className="text-slate-600">{idea.problem}</p>
              <strong>Proposed Solution</strong>
              <p className="text-slate-600">{idea.solution}</p>
              <strong>Target Audience</strong>
              <p className="text-slate-600">{idea.targetAudience}</p>
              <strong>Estimated Budget</strong>
              <p className="text-slate-600">{idea.budget}</p>
              <strong>Tags</strong>
              <div className="flex flex-wrap gap-2">{idea.tags.map((tag) => <span key={tag} className="tag">{tag}</span>)}</div>
            </div>
          </article>

          <section className="space-y-4 border-t border-slate-200 pt-6">
            <h2 className="text-xl font-extrabold text-slate-950 dark-text">Comments ({comments.length})</h2>
            <div className="flex gap-3">
              <input className="field" placeholder="Write a comment..." value={commentText} onChange={(event) => setCommentText(event.target.value)} />
              <button className="btn-primary shrink-0 px-5 py-3 text-sm" onClick={addComment}>Add Comment</button>
            </div>
            {comments.map((comment) => (
              <article key={comment.id} className="section-card p-4">
                <div className="flex gap-3">
                  <span className="avatar h-9 w-9 text-[10px]">{comment.user.split(" ").map((part) => part[0]).join("")}</span>
                  <div className="flex-1">
                    <div className="flex flex-wrap items-center gap-3 text-sm">
                      <strong>{comment.user}</strong>
                      <span className="text-xs text-slate-400">{comment.date}</span>
                    </div>
                    {editing?.id === comment.id ? (
                      <div className="mt-3 flex gap-3">
                        <input className="field" value={editing.text} onChange={(event) => setEditing({ ...editing, text: event.target.value })} />
                        <button className="btn-primary px-4 text-sm" onClick={saveComment}>Save</button>
                      </div>
                    ) : (
                      <p className="mt-2 text-sm text-slate-600">{comment.text}</p>
                    )}
                    {comment.ownerEmail === user.email ? (
                      <div className="mt-3 flex gap-4 text-xs font-bold text-slate-500">
                        <button onClick={() => setEditing(comment)}>Edit</button>
                        <button onClick={() => deleteComment(comment.id)}>Delete</button>
                      </div>
                    ) : null}
                  </div>
                </div>
              </article>
            ))}
          </section>
        </div>
      </div>
    </ProtectedRoute>
  );
}
