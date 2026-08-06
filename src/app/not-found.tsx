import Link from "next/link";

export default function NotFound() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-slate-50 px-6 text-center">
      <p className="text-sm font-semibold uppercase tracking-[0.3em] text-teal-600">404</p>
      <h1 className="mt-6 text-4xl font-semibold tracking-tight text-slate-950 sm:text-5xl">Page not found</h1>
      <p className="mt-4 max-w-xl text-base leading-7 text-slate-600">
        The page you were looking for cannot be found. Return to the homepage to continue exploring BCONZ.
      </p>
      <div className="mt-8 flex flex-col gap-3 sm:flex-row">
        <Link
          href="/"
          className="inline-flex rounded-full bg-slate-950 px-6 py-3 text-sm font-semibold text-white transition hover:bg-slate-800 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-teal-400"
        >
          Back to Home
        </Link>
        <Link
          href="/contact"
          className="inline-flex rounded-full border border-slate-200 bg-white px-6 py-3 text-sm font-semibold text-slate-950 transition hover:bg-slate-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-teal-400"
        >
          Contact BCONZ
        </Link>
      </div>
    </div>
  );
}
