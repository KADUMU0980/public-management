import Link from "next/link";

const features = [
  "Secure citizen and admin authentication",
  "Complaint tracking with status history",
  "Real-time announcements and updates",
  "Responsive dashboards for operations teams",
];

export default function Home() {
  return (
    <main className="min-h-screen bg-transparent px-6 py-16 text-slate-100 lg:px-10">
      <div className="mx-auto flex max-w-7xl flex-col gap-10 rounded-[2rem] border border-white/10 bg-slate-900/80 p-8 shadow-2xl backdrop-blur lg:flex-row lg:items-center lg:justify-between lg:p-12 animate-fade-in-up">
        <div className="max-w-2xl">
          <p className="shimmer-text text-sm font-semibold uppercase tracking-[0.35em] animate-fade-in-left">
            CitizenConnect
          </p>
          <h1 className="mt-4 text-4xl font-semibold leading-tight sm:text-5xl animate-fade-in-up delay-1">
            Smart public complaint portal for faster civic action.
          </h1>
          <p className="mt-5 text-lg text-slate-300 animate-fade-in-up delay-2">
            Empower citizens to report infrastructure issues and give administrators a professional workspace to resolve them efficiently.
          </p>
          <div className="mt-8 flex flex-wrap gap-4 animate-fade-in-up delay-3">
            <Link
              href="/citizen"
              className="rounded-full bg-cyan-500 px-6 py-3 font-semibold text-slate-950 transition duration-300 hover:bg-cyan-400 hover:-translate-y-0.5 hover:shadow-[0_8px_24px_rgba(34,211,238,0.35)] active:translate-y-0 active:scale-95"
            >
              Open Citizen Dashboard
            </Link>
            <Link
              href="/admin"
              className="rounded-full border border-cyan-400/30 px-6 py-3 font-semibold text-cyan-200 transition duration-300 hover:bg-cyan-500/10 hover:-translate-y-0.5 hover:border-cyan-400/60 active:translate-y-0 active:scale-95"
            >
              Open Admin Dashboard
            </Link>
          </div>
        </div>

        <div className="w-full max-w-md rounded-3xl border border-white/10 bg-slate-950/70 p-6 animate-fade-in-up delay-2">
          <h2 className="text-xl font-semibold text-white">Built for modern civic services</h2>
          <ul className="mt-4 space-y-3 text-sm text-slate-300">
            {features.map((feature, i) => (
              <li
                key={feature}
                className={`lift-on-hover animate-fade-in-up rounded-2xl border border-white/10 bg-slate-900/80 px-4 py-3 delay-${Math.min(i + 1, 5)}`}
              >
                {feature}
              </li>
            ))}
          </ul>
        </div>
      </div>
    </main>
  );
}