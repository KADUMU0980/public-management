import { DashboardShell } from "@/components/dashboard-shell";

const users = [
  { name: "Asha Menon", role: "Citizen", status: "Active" },
  { name: "Ravi Kumar", role: "Citizen", status: "Active" },
  { name: "Nina Shah", role: "Admin", status: "Active" },
];

export default function AdminUsersPage() {
  return (
    <DashboardShell role="admin">
      <div className="space-y-6">
        <div>
          <p className="text-sm uppercase tracking-[0.3em] text-cyan-300">User management</p>
          <h1 className="text-3xl font-semibold text-white">Maintain citizen and admin accounts</h1>
        </div>

        <div className="space-y-3">
          {users.map((user) => (
            <div key={user.name} className="flex items-center justify-between rounded-3xl border border-white/10 bg-slate-900/80 px-5 py-4">
              <div>
                <p className="font-semibold text-white">{user.name}</p>
                <p className="text-sm text-slate-400">{user.role}</p>
              </div>
              <span className="rounded-full bg-emerald-500/20 px-3 py-1 text-sm text-emerald-300">{user.status}</span>
            </div>
          ))}
        </div>
      </div>
    </DashboardShell>
  );
}
