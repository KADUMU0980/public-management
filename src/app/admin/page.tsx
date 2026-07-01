import { DashboardShell } from "@/components/dashboard-shell";

const overview = [
  { label: "Total Complaints", value: "186" },
  { label: "Pending", value: "34" },
  { label: "Resolved", value: "126" },
  { label: "Rejected", value: "26" },
];

export default function AdminDashboardPage() {
  return (
    <DashboardShell role="admin">
      <div className="space-y-6">
        <div className="rounded-3xl border border-cyan-400/20 bg-gradient-to-br from-cyan-500/20 to-slate-900 p-6 shadow-2xl">
          <p className="text-sm uppercase tracking-[0.3em] text-cyan-300">Admin dashboard</p>
          <h1 className="mt-2 text-3xl font-semibold text-white">Public service operations at a glance</h1>
          <p className="mt-3 max-w-2xl text-sm text-slate-300">
            Review incoming complaints, prioritize urgent issues, and coordinate district-level response.
          </p>
        </div>

        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
          {overview.map((item) => (
            <div key={item.label} className="rounded-2xl border border-white/10 bg-slate-900/80 p-4">
              <p className="text-sm text-slate-400">{item.label}</p>
              <p className="mt-2 text-3xl font-semibold text-white">{item.value}</p>
            </div>
          ))}
        </div>

        <div className="grid gap-6 xl:grid-cols-[1.2fr_0.8fr]">
          <div className="rounded-3xl border border-white/10 bg-slate-900/80 p-6">
            <h2 className="text-xl font-semibold text-white">Recent activity</h2>
            <div className="mt-4 space-y-3 text-sm text-slate-300">
              <p>• 12 new complaints submitted today</p>
              <p>• 4 complaints escalated as emergency cases</p>
              <p>• 6 issue categories updated by field teams</p>
            </div>
          </div>
          <div className="rounded-3xl border border-white/10 bg-slate-900/80 p-6">
            <h2 className="text-xl font-semibold text-white">Priority areas</h2>
            <div className="mt-4 space-y-3 text-sm text-slate-300">
              <p>• Water leakage in North Ward</p>
              <p>• Road repairs near Market Road</p>
              <p>• Streetlight replacements in Old Town</p>
            </div>
          </div>
        </div>
      </div>
    </DashboardShell>
  );
}
