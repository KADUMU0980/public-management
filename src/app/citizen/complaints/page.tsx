import { DashboardShell } from "@/components/dashboard-shell";

const complaints = [
  {
    id: "CC-1024",
    title: "Water leakage near central park",
    category: "Water Leakage",
    status: "In Progress",
    priority: "High",
    assignedTo: "Public Works",
  },
  {
    id: "CC-1019",
    title: "Pothole on Main Street",
    category: "Potholes",
    status: "Assigned",
    priority: "Medium",
    assignedTo: "Roads Department",
  },
];

export default function CitizenComplaintsPage() {
  return (
    <DashboardShell role="citizen">
      <div className="space-y-6">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <p className="text-sm uppercase tracking-[0.3em] text-cyan-300">My complaints</p>
            <h1 className="text-3xl font-semibold text-white">Complaint history and updates</h1>
          </div>
          <button className="rounded-full bg-cyan-500 px-4 py-2 text-sm font-semibold text-slate-950 transition hover:bg-cyan-400">
            Raise complaint
          </button>
        </div>

        <div className="space-y-4">
          {complaints.map((item) => (
            <div key={item.id} className="rounded-3xl border border-white/10 bg-slate-900/80 p-6">
              <div className="flex flex-wrap items-center justify-between gap-2">
                <div>
                  <p className="text-sm text-cyan-300">{item.id}</p>
                  <h2 className="text-xl font-semibold text-white">{item.title}</h2>
                </div>
                <span className="rounded-full bg-cyan-500/20 px-3 py-1 text-sm text-cyan-300">{item.status}</span>
              </div>
              <div className="mt-4 grid gap-3 text-sm text-slate-300 md:grid-cols-3">
                <p>Category: {item.category}</p>
                <p>Priority: {item.priority}</p>
                <p>Assigned: {item.assignedTo}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </DashboardShell>
  );
}
