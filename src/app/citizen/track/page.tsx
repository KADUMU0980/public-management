import { DashboardShell } from "@/components/dashboard-shell";

const timeline = [
  { stage: "Complaint Submitted", date: "2026-06-21", time: "09:12", updatedBy: "Citizen", remarks: "Issue reported successfully" },
  { stage: "Under Review", date: "2026-06-22", time: "11:00", updatedBy: "Civic Desk", remarks: "Complaint verified and accepted" },
  { stage: "Assigned", date: "2026-06-23", time: "08:40", updatedBy: "Public Works", remarks: "Maintenance team assigned" },
  { stage: "In Progress", date: "2026-06-24", time: "14:20", updatedBy: "Field Team", remarks: "Repair work underway" },
];

export default function CitizenTrackPage() {
  return (
    <DashboardShell role="citizen">
      <div className="space-y-6">
        <div>
          <p className="text-sm uppercase tracking-[0.3em] text-cyan-300">Complaint tracking</p>
          <h1 className="text-3xl font-semibold text-white">Track the real-world status of your request</h1>
        </div>

        <div className="space-y-4">
          {timeline.map((item, index) => (
            <div key={item.stage} className="rounded-3xl border border-white/10 bg-slate-900/80 p-6">
              <div className="flex items-center gap-3">
                <div className="flex h-9 w-9 items-center justify-center rounded-full bg-cyan-500/20 text-sm font-semibold text-cyan-300">
                  {index + 1}
                </div>
                <div>
                  <p className="text-lg font-semibold text-white">{item.stage}</p>
                  <p className="text-sm text-slate-400">{item.date} • {item.time}</p>
                </div>
              </div>
              <div className="mt-3 rounded-2xl border border-white/10 bg-slate-950/60 p-4 text-sm text-slate-300">
                <p>Updated by: {item.updatedBy}</p>
                <p className="mt-1">Remarks: {item.remarks}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </DashboardShell>
  );
}
