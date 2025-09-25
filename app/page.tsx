// app/page.tsx
export default function LandingPage() {
  return (
    <section className="max-w-5xl mx-auto py-16">
      <h1 className="text-4xl font-bold tracking-tight">
        CoreVAI Social
      </h1>
      <p className="mt-3 text-slate-600 max-w-2xl">
        Plan, generate, schedule, and analyze your social posts with AI.
      </p>

      <div className="mt-8 flex gap-3">
        <a
          href="/signin"
          className="bg-teal-600 text-white px-5 py-2 rounded hover:bg-teal-700"
        >
          Sign in
        </a>
        <a
          href="/signup"
          className="border px-5 py-2 rounded hover:bg-slate-50"
        >
          Create account
        </a>
      </div>

      <ul className="mt-10 grid sm:grid-cols-2 gap-4 text-sm">
        <li className="p-4 rounded border bg-white">✅ AI captions tailored to your brand</li>
        <li className="p-4 rounded border bg-white">✅ Weekly/Monthly planner & scheduling</li>
        <li className="p-4 rounded border bg-white">✅ Approvals and lock/regenerate</li>
        <li className="p-4 rounded border bg-white">✅ Analytics & insights</li>
      </ul>
    </section>
  );
}