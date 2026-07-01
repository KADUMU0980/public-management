import { DashboardShell } from "@/components/dashboard-shell";

const complaints = [
  { id: "CC-1024", citizen: "Asha Menon", category: "Water Leakage", priority: "High", status: "Pending" },
  { id: "CC-1019", citizen: "Ravi Kumar", category: "Potholes", priority: "Medium", status: "Assigned" },
  { id: "CC-1008", citizen: "Meera Rao", category: "Garbage", priority: "Low", status: "Resolved" },
];

export default function AdminComplaintsPage() {
  return (
    <DashboardShell role="admin">
      <div className="space-y-6">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <p className="text-sm uppercase tracking-[0.3em] text-cyan-300">Complaint management</p>
            <h1 className="text-3xl font-semibold text-white">Review, assign, and resolve cases</h1>
          </div>
          <button className="rounded-full bg-cyan-500 px-4 py-2 text-sm font-semibold text-slate-950 hover:bg-cyan-400">
            Export report
          </button>
        </div>

        <div className="overflow-hidden rounded-3xl border border-white/10 bg-slate-900/80">
          <div className="grid grid-cols-[1.1fr_0.8fr_0.7fr_0.6fr_0.6fr] border-b border-white/10 bg-slate-950/60 px-4 py-3 text-sm font-medium text-slate-300">
            <span>Complaint</span>
            <span>Citizen</span>
            <span>Category</span>
            <span>Priority</span>
            <span>Status</span>
          </div>
          {complaints.map((item) => (
            <div key={item.id} className="grid grid-cols-[1.1fr_0.8fr_0.7fr_0.6fr_0.6fr] border-b border-white/10 px-4 py-4 text-sm text-slate-300 last:border-b-0">
              <span className="font-medium text-white">{item.id}</span>
              <span>{item.citizen}</span>
              <span>{item.category}</span>
              <span>{item.priority}</span>
              <span>{item.status}</span>
            </div>
          ))}
        </div>
      </div>
    </DashboardShell>
  );
}
