import { DashboardShell } from "@/components/dashboard-shell";

export default function CitizenProfilePage() {
  return (
    <DashboardShell role="citizen">
      <div className="space-y-6">
        <div>
          <p className="text-sm uppercase tracking-[0.3em] text-cyan-300">Profile</p>
          <h1 className="text-3xl font-semibold text-white">Manage account preferences</h1>
        </div>

        <div className="grid gap-6 lg:grid-cols-[1fr_0.9fr]">
          <div className="rounded-3xl border border-white/10 bg-slate-900/80 p-6">
            <h2 className="text-xl font-semibold text-white">Personal details</h2>
            <div className="mt-4 space-y-3 text-sm text-slate-300">
              <p>Name: Asha Menon</p>
              <p>Email: asha@example.com</p>
              <p>Phone: +91 98765 43210</p>
              <p>Area: Downtown Sector 4</p>
            </div>
          </div>

          <div className="rounded-3xl border border-white/10 bg-slate-900/80 p-6">
            <h2 className="text-xl font-semibold text-white">Notification settings</h2>
            <div className="mt-4 space-y-3 text-sm text-slate-300">
              <p>• SMS updates enabled</p>
              <p>• Email alerts enabled</p>
              <p>• Weekly digest monthly</p>
            </div>
          </div>
        </div>
      </div>
    </DashboardShell>
  );
}
