import { DashboardShell } from "@/components/dashboard-shell";

const stats = [
  { label: "Total Complaints", value: "24", hint: "+4 this month" },
  { label: "Pending", value: "8", hint: "Awaiting review" },
  { label: "Resolved", value: "14", hint: "Completed" },
  { label: "Rejected", value: "2", hint: "Needs clarification" },
];

const recentComplaints = [
  { id: "CC-1024", title: "Water leakage near park", status: "In Progress", date: "2h ago" },
  { id: "CC-1019", title: "Pothole on Main Street", status: "Assigned", date: "Today" },
  { id: "CC-1012", title: "Broken streetlight", status: "Resolved", date: "Yesterday" },
];

export default function CitizenDashboardPage() {
  return (
    <DashboardShell role="citizen">
      <div className="space-y-6">
        <div className="rounded-3xl border border-white/10 bg-gradient-to-br from-cyan-500/20 to-slate-900 p-6 shadow-2xl">
          <p className="text-sm uppercase tracking-[0.3em] text-cyan-300">Citizen dashboard</p>
          <h1 className="mt-2 text-3xl font-semibold text-white">Track civic issues with confidence</h1>
          <p className="mt-3 max-w-2xl text-sm text-slate-300">
            Report public infrastructure concerns, monitor progress, and stay informed with real-time updates.
          </p>
        </div>

        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
          {stats.map((stat) => (
            <div key={stat.label} className="rounded-2xl border border-white/10 bg-slate-900/80 p-4">
              <p className="text-sm text-slate-400">{stat.label}</p>
              <p className="mt-2 text-3xl font-semibold text-white">{stat.value}</p>
              <p className="mt-1 text-sm text-cyan-300">{stat.hint}</p>
            </div>
          ))}
        </div>

        <div className="grid gap-6 xl:grid-cols-[1.5fr_0.9fr]">
          <div className="rounded-3xl border border-white/10 bg-slate-900/80 p-6">
            <div className="mb-4 flex items-center justify-between">
              <h2 className="text-xl font-semibold text-white">Recent complaints</h2>
              <a href="/citizen/complaints" className="text-sm text-cyan-300">View all</a>
            </div>
            <div className="space-y-3">
              {recentComplaints.map((item) => (
                <div key={item.id} className="flex items-center justify-between rounded-2xl border border-white/10 bg-slate-950/60 px-4 py-3">
                  <div>
                    <p className="font-medium text-white">{item.title}</p>
                    <p className="text-sm text-slate-400">{item.id} • {item.date}</p>
                  </div>
                  <span className="rounded-full bg-cyan-500/20 px-3 py-1 text-sm text-cyan-300">{item.status}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="rounded-3xl border border-white/10 bg-slate-900/80 p-6">
            <h2 className="text-xl font-semibold text-white">Latest updates</h2>
            <div className="mt-4 space-y-4 text-sm text-slate-300">
              <div className="rounded-2xl border border-emerald-500/20 bg-emerald-500/10 p-3">
                <p className="font-semibold text-emerald-300">Complaint accepted</p>
                <p className="mt-1">Your request for drainage clearance has moved to review.</p>
              </div>
              <div className="rounded-2xl border border-amber-500/20 bg-amber-500/10 p-3">
                <p className="font-semibold text-amber-300">Work assigned</p>
                <p className="mt-1">The sanitation crew has been scheduled for the next morning.</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </DashboardShell>
  );
}
