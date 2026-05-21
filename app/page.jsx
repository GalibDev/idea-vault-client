"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import IdeaCard from "../components/IdeaCard.jsx";
import { ideas } from "../data/ideas.js";

const slides = [
  {
    title: "Where Ideas Find Potential",
    text: "Share startup concepts, collect feedback, and refine your next launch with a curious community.",
    image: "https://images.unsplash.com/photo-1552664730-d307ca884978?auto=format&fit=crop&w=1000&q=80",
  },
  {
    title: "Validate Before You Build",
    text: "Discover what people need, test your assumptions, and improve your idea with real discussion.",
    image: "https://images.unsplash.com/photo-1559136555-9303baea8ebd?auto=format&fit=crop&w=1000&q=80",
  },
  {
    title: "Collaborate With Builders",
    text: "Meet founders, designers, engineers, and early adopters who can help ideas move forward.",
    image: "https://images.unsplash.com/photo-1517048676732-d65bc937f952?auto=format&fit=crop&w=1000&q=80",
  },
];

const features = [
  { title: "Share Ideas", text: "Publish structured startup ideas with audience, budget, and solution details." },
  { title: "Get Feedback", text: "Collect comments from people who understand product discovery." },
  { title: "Build Together", text: "Track interest, improve concepts, and find collaborators." },
];

const extraSections = [
  { title: "Validation Signals", text: "Trending scores combine likes, comments, and recent activity so strong ideas surface quickly." },
  { title: "Founder Friendly Flow", text: "Every form asks for useful startup details instead of noise, helping readers give better feedback." },
];

export default function Home() {
  const [activeSlide, setActiveSlide] = useState(0);
  const [trendingIdeas, setTrendingIdeas] = useState(ideas.slice(0, 6));
  const [loadingTrending, setLoadingTrending] = useState(true);

  useEffect(() => {
    const timer = window.setInterval(() => {
      setActiveSlide((current) => (current + 1) % slides.length);
    }, 4500);
    return () => window.clearInterval(timer);
  }, []);

  useEffect(() => {
    fetch(`${process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000"}/ideas?limit=6`)
      .then((response) => response.json())
      .then((data) => {
        setTrendingIdeas(Array.isArray(data) && data.length ? data : ideas.slice(0, 6));
      })
      .catch(() => setTrendingIdeas(ideas.slice(0, 6)))
      .finally(() => setLoadingTrending(false));
  }, []);

  const slide = slides[activeSlide];

  return (
    <div className="page-shell">
      <div className="content-shell space-y-8">
        <section className="hero-panel grid items-center md:grid-cols-[0.95fr_1.05fr]">
          <div className="px-8 py-10 text-white md:px-12">
            <h1 className="max-w-sm text-4xl font-extrabold leading-tight md:text-5xl">{slide.title}</h1>
            <p className="mt-4 max-w-md text-sm font-medium text-indigo-50 md:text-base">{slide.text}</p>
            <Link href="/ideas" className="btn-soft mt-7 inline-flex px-5 py-3 text-sm">Explore Ideas</Link>
            <div className="mt-8 flex gap-2">
              {slides.map((item, index) => (
                <button
                  key={item.title}
                  onClick={() => setActiveSlide(index)}
                  className={`h-2 rounded-full transition-all ${activeSlide === index ? "w-8 bg-white" : "w-2 bg-white/50"}`}
                  aria-label={`Show slide ${index + 1}`}
                />
              ))}
            </div>
          </div>
          <div className="hero-art" style={{ backgroundImage: `linear-gradient(90deg, rgba(49, 46, 129, 0.05), rgba(147, 51, 234, 0.2)), url(${slide.image})` }} aria-hidden="true" />
        </section>

        <section>
          <div className="mb-5 flex items-center justify-between">
            <h2 className="text-xl font-extrabold text-slate-950 dark-text">Trending Ideas</h2>
            <Link href="/ideas" className="text-sm font-bold text-[#6366F1]">View All</Link>
          </div>
          {loadingTrending ? (
            <section className="section-card p-8 text-center">
              <div className="loading-spinner" />
              <p className="text-sm font-semibold text-slate-500">Loading trending ideas...</p>
            </section>
          ) : (
            <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6">
              {trendingIdeas.slice(0, 6).map((idea) => (
                <IdeaCard key={idea._id || idea.id} idea={idea} compact />
              ))}
            </div>
          )}
        </section>

        <section className="section-card grid gap-4 p-6 md:grid-cols-3">
          <h2 className="text-xl font-extrabold text-slate-950 dark-text md:col-span-3">Why IdeaVault?</h2>
          {features.map((feature) => (
            <div key={feature.title} className="flex gap-4">
              <span className="grid h-11 w-11 shrink-0 place-items-center rounded-full bg-indigo-50 text-lg font-black text-[#6366F1]">+</span>
              <div>
                <h3 className="font-extrabold text-slate-950 dark-text">{feature.title}</h3>
                <p className="text-sm text-slate-500">{feature.text}</p>
              </div>
            </div>
          ))}
        </section>

        <section className="grid gap-5 md:grid-cols-2">
          {extraSections.map((section) => (
            <article key={section.title} className="section-card p-6">
              <h2 className="text-xl font-extrabold text-slate-950 dark-text">{section.title}</h2>
              <p className="mt-2 text-slate-500">{section.text}</p>
            </article>
          ))}
        </section>

        <section className="rounded-lg bg-gradient-to-r from-[#6366F1] to-[#8B5CF6] px-6 py-7 text-center text-white">
          <h2 className="text-2xl font-extrabold">Ready to share your idea?</h2>
          <p className="mt-1 text-sm text-indigo-50">Join thousands of innovators and entrepreneurs.</p>
          <Link href="/add-idea" className="btn-soft mt-5 inline-flex px-5 py-3 text-sm">Add Your Idea</Link>
        </section>
      </div>
    </div>
  );
}
