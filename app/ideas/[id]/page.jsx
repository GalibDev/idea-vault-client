"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import ProtectedRoute from "../../../components/ProtectedRoute.jsx";
import { useToast } from "../../../components/Toast.jsx";
import { useAuth } from "../../../context/AuthContext.jsx";
import { comments as seedComments, ideas } from "../../../data/ideas.js";

const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";
const commentActivityKey = "ideavault-commented-ideas";

export default function IdeaDetailsPage({ params }) {
  const seedIdea = ideas.find((item) => String(item.id) === String(params.id));
  const { token, user } = useAuth();
  const { showToast } = useToast();
  const [idea, setIdea] = useState(seedIdea || null);
  const [loadingIdea, setLoadingIdea] = useState(!seedIdea);
  const [commentText, setCommentText] = useState("");
  const [editing, setEditing] = useState(null);
  const [comments, setComments] = useState([]);
  const ideaId = String(params.id);
  const localCommentsKey = `ideavault-comments-${ideaId}`;

  useEffect(() => {
    if (seedIdea) {
      setIdea(seedIdea);
      setLoadingIdea(false);
      return;
    }

    setLoadingIdea(true);
    fetch(`${apiUrl}/ideas/${ideaId}`)
      .then((response) => {
        if (!response.ok) {
          throw new Error("Idea not found.");
        }
        return response.json();
      })
      .then((data) => setIdea(data))
      .catch(() => setIdea(null))
      .finally(() => setLoadingIdea(false));
  }, [ideaId, seedIdea]);

  useEffect(() => {
    if (!idea) {
      return;
    }

    const fallbackComments = seedIdea
      ? seedComments.map((comment, index) => ({ ...comment, id: index + 1, ownerEmail: index === 0 ? "google.user@ideavault.com" : "rahim@example.com" }))
      : [];
    const savedComments = JSON.parse(localStorage.getItem(localCommentsKey) || "[]");

    if (token && !seedIdea) {
      fetch(`${apiUrl}/comments/${ideaId}`, {
        headers: { Authorization: `Bearer ${token}` },
      })
        .then((response) => response.json())
        .then((data) => setComments(Array.isArray(data) ? data : savedComments))
        .catch(() => setComments(savedComments));
      return;
    }

    setComments(savedComments.length ? savedComments : fallbackComments);
  }, [idea, ideaId, localCommentsKey, seedIdea, token]);

  const ideaTags = useMemo(() => {
    if (!idea?.tags) {
      return [];
    }

    return Array.isArray(idea.tags)
      ? idea.tags
      : String(idea.tags).split(",").map((tag) => tag.trim()).filter(Boolean);
  }, [idea]);

  const saveCommentActivity = (nextComment) => {
    const saved = JSON.parse(localStorage.getItem(commentActivityKey) || "[]");
    const activity = {
      ...idea,
      commentText: nextComment.text,
      commentDate: nextComment.date || nextComment.createdAt || new Date().toLocaleString(),
      id: ideaId,
    };
    const next = [activity, ...saved.filter((item) => String(item._id || item.id) !== ideaId)];
    localStorage.setItem(commentActivityKey, JSON.stringify(next));
  };

  const persistLocalComments = (nextComments) => {
    localStorage.setItem(localCommentsKey, JSON.stringify(nextComments));
    setComments(nextComments);
  };

  const addComment = async () => {
    if (!commentText.trim()) {
      showToast("Please write a comment first.", "error");
      return;
    }

    const nextComment = {
      id: Date.now(),
      user: user.name,
      ownerEmail: user.email,
      userEmail: user.email,
      date: new Date().toLocaleString(),
      text: commentText,
    };

    try {
      if (token && !seedIdea) {
        const response = await fetch(`${apiUrl}/comments/${ideaId}`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ text: commentText }),
        });

        if (!response.ok) {
          throw new Error("Could not save comment.");
        }

        const savedComment = await response.json();
        setComments([savedComment, ...comments]);
        saveCommentActivity(savedComment);
      } else {
        const nextComments = [nextComment, ...comments];
        persistLocalComments(nextComments);
        saveCommentActivity(nextComment);
      }

      setCommentText("");
      showToast("Comment added successfully.");
    } catch (error) {
      showToast(error.message, "error");
    }
  };

  const saveComment = async () => {
    const commentId = editing._id || editing.id;

    try {
      if (token && editing._id) {
        const response = await fetch(`${apiUrl}/comments/${commentId}`, {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ text: editing.text }),
        });

        if (!response.ok) {
          throw new Error("Could not update comment.");
        }
      }

      const nextComments = comments.map((comment) => String(comment._id || comment.id) === String(commentId) ? editing : comment);
      persistLocalComments(nextComments);
      setEditing(null);
      showToast("Comment updated successfully.");
    } catch (error) {
      showToast(error.message, "error");
    }
  };

  const deleteComment = async (id) => {
    try {
      if (token && String(id).length > 15) {
        const response = await fetch(`${apiUrl}/comments/${id}`, {
          method: "DELETE",
          headers: { Authorization: `Bearer ${token}` },
        });

        if (!response.ok) {
          throw new Error("Could not delete comment.");
        }
      }

      const nextComments = comments.filter((comment) => String(comment._id || comment.id) !== String(id));
      persistLocalComments(nextComments);
      showToast("Comment deleted successfully.");
    } catch (error) {
      showToast(error.message, "error");
    }
  };

  if (loadingIdea) {
    return (
      <ProtectedRoute>
        <div className="page-shell">
          <div className="loading-spinner" />
        </div>
      </ProtectedRoute>
    );
  }

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
                  <span className="tag">{idea.badge || idea.category}</span>
                </div>
                <div className="mt-3 flex items-center gap-3 text-sm text-slate-500">
                  <span className="avatar h-8 w-8 text-[10px]">{(idea.author || user.name || "IV").slice(0, 2).toUpperCase()}</span>
                  <span><strong className="text-slate-800">{idea.author || idea.authorName || user.name}</strong> | {idea.date || new Date(idea.createdAt || Date.now()).toLocaleDateString()} | {idea.readTime || "5 min read"}</span>
                </div>
              </div>
              <div className="flex gap-4 text-sm font-bold text-slate-500">
                <span>Likes {idea.likes || 0}</span>
                <span>Comments {comments.length}</span>
              </div>
            </div>

            <img src={idea.image} alt={idea.title} className="h-64 w-full rounded-lg object-cover sm:h-80 lg:h-[420px]" />

            <div className="space-y-3 rounded-lg bg-slate-50 p-5">
              <p className="text-base font-semibold leading-7 text-slate-700">{idea.summary}</p>
              {idea.description ? (
                <p className="text-sm leading-7 text-slate-600">{idea.description}</p>
              ) : null}
            </div>

            <div className="grid gap-4 text-sm md:grid-cols-[190px_1fr]">
              <strong>Problem Statement</strong>
              <p className="text-slate-600">{idea.problem}</p>
              <strong>Proposed Solution</strong>
              <p className="text-slate-600">{idea.solution}</p>
              <strong>Target Audience</strong>
              <p className="text-slate-600">{idea.targetAudience}</p>
              <strong>Estimated Budget</strong>
              <p className="text-slate-600">{idea.budget || "Not specified"}</p>
              <strong>Tags</strong>
              <div className="flex flex-wrap gap-2">{ideaTags.map((tag) => <span key={tag} className="tag">{tag}</span>)}</div>
            </div>
          </article>

          <section className="space-y-4 border-t border-slate-200 pt-6">
            <h2 className="text-xl font-extrabold text-slate-950 dark-text">Comments ({comments.length})</h2>
            <div className="flex gap-3">
              <input className="field" placeholder="Write a comment..." value={commentText} onChange={(event) => setCommentText(event.target.value)} />
              <button className="btn-primary shrink-0 px-5 py-3 text-sm" onClick={addComment}>Add Comment</button>
            </div>
            {comments.map((comment) => {
              const commentId = comment._id || comment.id;
              const commentOwner = comment.ownerEmail || comment.userEmail;
              const commentDate = comment.date || new Date(comment.createdAt || Date.now()).toLocaleString();

              return (
                <article key={commentId} className="section-card p-4">
                  <div className="flex gap-3">
                    <span className="avatar h-9 w-9 text-[10px]">{(comment.user || user.name || "User").split(" ").map((part) => part[0]).join("")}</span>
                    <div className="flex-1">
                      <div className="flex flex-wrap items-center gap-3 text-sm">
                        <strong>{comment.user || user.name}</strong>
                        <span className="text-xs text-slate-400">{commentDate}</span>
                      </div>
                      {String(editing?._id || editing?.id) === String(commentId) ? (
                        <div className="mt-3 flex gap-3">
                          <input className="field" value={editing.text} onChange={(event) => setEditing({ ...editing, text: event.target.value })} />
                          <button className="btn-primary px-4 text-sm" onClick={saveComment}>Save</button>
                        </div>
                      ) : (
                        <p className="mt-2 text-sm text-slate-600">{comment.text}</p>
                      )}
                      {commentOwner === user.email ? (
                        <div className="mt-3 flex gap-4 text-xs font-bold text-slate-500">
                          <button onClick={() => setEditing(comment)}>Edit</button>
                          <button onClick={() => deleteComment(commentId)}>Delete</button>
                        </div>
                      ) : null}
                    </div>
                  </div>
                </article>
              );
            })}
          </section>
        </div>
      </div>
    </ProtectedRoute>
  );
}
