"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import ProtectedRoute from "../../components/ProtectedRoute.jsx";
import { ideas } from "../../data/ideas.js";

const likedIdeasKey = "ideavault-liked-ideas";
const likedIdeaItemsKey = "ideavault-liked-idea-items";
const bookmarksKey = "ideavault-bookmarks";
const commentActivityKey = "ideavault-commented-ideas";

export default function MyInteractionsPage() {
  const [activeTab, setActiveTab] = useState("Comments");
  const [bookmarks, setBookmarks] = useState([]);
  const [likedIdeas, setLikedIdeas] = useState([]);
  const [commentedIdeas, setCommentedIdeas] = useState([]);

  useEffect(() => {
    const savedBookmarks = JSON.parse(localStorage.getItem(bookmarksKey) || "[]");
    const savedLikedMap = JSON.parse(localStorage.getItem(likedIdeasKey) || "{}");
    const savedLikedItems = JSON.parse(localStorage.getItem(likedIdeaItemsKey) || "[]");
    const savedCommentedIdeas = JSON.parse(localStorage.getItem(commentActivityKey) || "[]");
    const likedIds = Object.keys(savedLikedMap).filter((id) => savedLikedMap[id]?.liked);
    const fallbackLikedIdeas = ideas.filter((idea) => likedIds.includes(String(idea.id)));
    const mergedLikedIdeas = [
      ...savedLikedItems.filter((idea) => likedIds.includes(String(idea._id || idea.id))),
      ...fallbackLikedIdeas,
    ];
    const uniqueLikedIdeas = mergedLikedIdeas.filter((idea, index, list) => {
      const ideaId = String(idea._id || idea.id);
      return list.findIndex((item) => String(item._id || item.id) === ideaId) === index;
    });

    setBookmarks(savedBookmarks);
    setLikedIdeas(uniqueLikedIdeas);
    setCommentedIdeas(savedCommentedIdeas);
  }, []);

  const tabs = [
    { id: "Comments", label: "Commented Ideas" },
    { id: "Bookmarks", label: "Bookmarks" },
    { id: "Likes", label: "Likes" },
  ];

  const ideaHref = (idea) => `/ideas/${idea._id || idea.id}`;

  const renderIdeaRow = (idea, meta) => (
    <Link key={idea._id || idea.id} href={ideaHref(idea)} className="section-card flex gap-4 p-4 transition hover:-translate-y-0.5 hover:border-[#6366F1] hover:shadow-xl">
      <img src={idea.image} alt={idea.title} className="h-20 w-28 rounded-md object-cover" />
      <div>
        <h2 className="font-extrabold text-slate-950 transition hover:text-[#6366F1] dark-text">{idea.title}</h2>
        <p className="text-xs text-slate-400">{meta}</p>
        <p className="mt-2 text-sm text-slate-600">{idea.summary}</p>
      </div>
    </Link>
  );

  return (
    <ProtectedRoute>
      <div className="page-shell">
        <div className="content-shell max-w-3xl">
          <div className="mb-5 flex gap-7 border-b border-slate-200 text-sm font-bold text-slate-500">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                className={activeTab === tab.id ? "border-b-2 border-[#6366F1] pb-3 text-[#6366F1]" : "pb-3 hover:text-[#6366F1]"}
                onClick={() => setActiveTab(tab.id)}
              >
                {tab.label}
              </button>
            ))}
          </div>

          <div className="space-y-4">
            {activeTab === "Comments" ? (
              commentedIdeas.length ? commentedIdeas.map((idea) => (
                <Link key={idea._id || idea.id} href={ideaHref(idea)} className="section-card flex gap-4 p-4 transition hover:-translate-y-0.5 hover:border-[#6366F1] hover:shadow-xl">
                  <img src={idea.image} alt={idea.title} className="h-20 w-28 rounded-md object-cover" />
                  <div>
                    <h2 className="font-extrabold text-slate-950 transition hover:text-[#6366F1] dark-text">{idea.title}</h2>
                    <p className="text-xs text-slate-400">You commented on {idea.commentDate}</p>
                    <p className="mt-2 text-sm text-slate-600">{idea.commentText}</p>
                  </div>
                </Link>
              )) : (
                <section className="section-card p-8 text-center">
                  <h2 className="text-xl font-extrabold text-slate-950 dark-text">No commented ideas yet</h2>
                  <p className="mt-2 text-slate-500">Add comments from an idea details page to see them here.</p>
                </section>
              )
            ) : null}

            {activeTab === "Bookmarks" ? (
              bookmarks.length ? bookmarks.map((idea) => renderIdeaRow(idea, "Bookmarked for later review")) : (
                <section className="section-card p-8 text-center">
                  <h2 className="text-xl font-extrabold text-slate-950 dark-text">No bookmarked ideas</h2>
                  <p className="mt-2 text-slate-500">Bookmark ideas from the Ideas page to see them here.</p>
                </section>
              )
            ) : null}

            {activeTab === "Likes" ? (
              likedIdeas.length ? likedIdeas.map((idea) => renderIdeaRow(idea, "You liked this idea")) : (
                <section className="section-card p-8 text-center">
                  <h2 className="text-xl font-extrabold text-slate-950 dark-text">No liked ideas yet</h2>
                  <p className="mt-2 text-slate-500">Click Like on any idea card to track it here.</p>
                </section>
              )
            ) : null}
          </div>
        </div>
      </div>
    </ProtectedRoute>
  );
}
