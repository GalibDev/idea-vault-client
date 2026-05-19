import Link from "next/link";

export default function Footer() {
  return (
    <footer className="mt-12 bg-[#020617] text-white">
      <div className="mx-auto grid max-w-7xl gap-8 px-4 py-8 text-sm sm:px-6 md:grid-cols-4 lg:px-8">
        <div>
          <h2 className="text-lg font-extrabold">IdeaVault</h2>
          <p className="mt-2 text-slate-300">A community space for startup idea validation and feedback.</p>
        </div>
        <div>
          <h3 className="font-extrabold">Platform</h3>
          <div className="mt-3 grid gap-2 text-slate-300">
            <Link href="/ideas" className="hover:text-white">Ideas</Link>
            <Link href="/ideas" className="hover:text-white">Categories</Link>
            <Link href="/add-idea" className="hover:text-white">Add Idea</Link>
          </div>
        </div>
        <div>
          <h3 className="font-extrabold">Contact</h3>
          <div className="mt-3 grid gap-2 text-slate-300">
            <span>support@ideavault.com</span>
            <span>Dhaka, Bangladesh</span>
          </div>
        </div>
        <div>
          <h3 className="font-extrabold">Social</h3>
          <div className="mt-3 flex gap-3 text-slate-300">
            <a href="https://github.com" className="social-icon" aria-label="GitHub" title="GitHub">
              <svg viewBox="0 0 24 24" aria-hidden="true">
                <path
                  fill="currentColor"
                  d="M12 .5A12 12 0 0 0 8.2 23.9c.6.1.8-.2.8-.6v-2.1c-3.3.7-4-1.4-4-1.4-.5-1.3-1.2-1.7-1.2-1.7-1-.7.1-.7.1-.7 1.1.1 1.7 1.2 1.7 1.2 1 .1.7 2.1 3.4 1.5.1-.7.4-1.2.7-1.5-2.6-.3-5.4-1.3-5.4-5.9 0-1.3.5-2.4 1.2-3.2-.1-.3-.5-1.6.1-3.2 0 0 1-.3 3.3 1.2a11.3 11.3 0 0 1 6 0c2.3-1.5 3.3-1.2 3.3-1.2.6 1.6.2 2.9.1 3.2.8.8 1.2 1.9 1.2 3.2 0 4.6-2.8 5.6-5.4 5.9.4.4.8 1.1.8 2.2v3.3c0 .4.2.7.8.6A12 12 0 0 0 12 .5Z"
                />
              </svg>
            </a>
            <a href="https://x.com" className="social-icon" aria-label="X" title="X">
              <svg viewBox="0 0 24 24" aria-hidden="true">
                <path
                  fill="currentColor"
                  d="M18.9 2h3.4l-7.5 8.5L23.6 22h-6.9l-5.4-7.1L5.1 22H1.7l8-9.2L1.2 2h7.1l4.9 6.5L18.9 2Zm-1.2 18h1.9L7.3 3.9H5.2L17.7 20Z"
                />
              </svg>
            </a>
            <a href="https://linkedin.com" className="social-icon" aria-label="LinkedIn" title="LinkedIn">
              <svg viewBox="0 0 24 24" aria-hidden="true">
                <path
                  fill="currentColor"
                  d="M20.4 20.4h-3.6v-5.7c0-1.4 0-3.1-1.9-3.1s-2.2 1.5-2.2 3v5.8H9.1V8.8h3.5v1.6h.1c.5-.9 1.7-1.9 3.5-1.9 3.7 0 4.4 2.5 4.4 5.7v6.2h-.2ZM5 7.2a2.1 2.1 0 1 1 0-4.2 2.1 2.1 0 0 1 0 4.2Zm1.8 13.2H3.2V8.8h3.6v11.6ZM22.2 0H1.8C.8 0 0 .8 0 1.8v20.4C0 23.2.8 24 1.8 24h20.4c1 0 1.8-.8 1.8-1.8V1.8c0-1-.8-1.8-1.8-1.8Z"
                />
              </svg>
            </a>
          </div>
        </div>
      </div>
      <p className="border-t border-white/10 py-4 text-center text-xs text-slate-400">Copyright 2026 IdeaVault. All rights reserved.</p>
    </footer>
  );
}
