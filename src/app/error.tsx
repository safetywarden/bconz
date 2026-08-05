"use client";

import Link from "next/link";

type ErrorPageProps = {
  error: Error;
};

export default function Error({ error }: ErrorPageProps) {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-slate-50 px-6 text-center text-slate-900">
      <p className="text-sm font-semibold uppercase tracking-[0.3em] text-teal-600">Application error</p>
      <h1 className="mt-6 text-4xl font-semibold tracking-tight">Something went wrong</h1>
      <p className="mt-4 max-w-xl text-sm leading-7 text-slate-600">{error?.message ?? "An unexpected error occurred."}</p>
      <Link href="/" className="mt-8 inline-flex rounded-full bg-slate-950 px-6 py-3 text-sm font-semibold text-white transition hover:bg-slate-800">
        Back to home
      </Link>
    </div>
  );
}
