import Link from "next/link";

export default function NotFound() {
  return (
    <div className="page-shell">
      <div className="content-shell grid min-h-[520px] items-center gap-8 md:grid-cols-[0.7fr_1fr]">
        <div className="text-center md:text-left">
          <p className="text-7xl font-black text-[#6366F1]">404</p>
          <h1 className="mt-3 text-3xl font-extrabold text-slate-950">Page Not Found</h1>
          <p className="mt-2 text-slate-500">Oops! The page you're looking for doesn't exist.</p>
          <Link href="/" className="btn-primary mt-6 inline-flex px-5 py-3 text-sm">Go Home</Link>
        </div>
        <div className="hero-panel grid min-h-[310px] place-items-center p-8 text-center text-white">
          <div>
            <div className="mx-auto grid h-28 w-28 place-items-center rounded-full bg-white/20 text-4xl font-black">IV</div>
            <p className="mt-5 text-xl font-extrabold">Let's get you back to fresh ideas.</p>
          </div>
        </div>
      </div>
    </div>
  );
}
