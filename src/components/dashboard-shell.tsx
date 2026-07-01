"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const citizenLinks = [
  { href: "/citizen", label: "Overview" },
  { href: "/citizen/complaints", label: "My Complaints" },
  { href: "/citizen/track", label: "Track Complaint" },
  { href: "/citizen/profile", label: "Profile" },
];

const adminLinks = [
  { href: "/admin", label: "Overview" },
  { href: "/admin/complaints", label: "Complaints" },
  { href: "/admin/users", label: "Users" },
  { href: "/admin/announcements", label: "Announcements" },
];

export function DashboardShell({
  role,
  children,
}: {
  role: "citizen" | "admin";
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const links = role === "admin" ? adminLinks : citizenLinks;

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100">
      <div className="mx-auto flex max-w-7xl flex-col lg:flex-row">
        <aside className="w-full border-b border-white/10 bg-slate-900/80 p-6 lg:min-h-screen lg:w-72 lg:border-b-0 lg:border-r">
          <div className="mb-8">
            <p className="text-sm font-semibold uppercase tracking-[0.3em] text-cyan-400">
              CitizenConnect
            </p>
            <h2 className="mt-2 text-2xl font-semibold text-white">
              {role === "admin" ? "Admin Portal" : "Citizen Portal"}
            </h2>
            <p className="mt-2 text-sm text-slate-400">
              {role === "admin"
                ? "Monitor public services and coordinate action."
                : "Submit and track civic service requests."}
            </p>
          </div>

          <nav className="space-y-2">
            {links.map((link) => {
              const isActive = pathname === link.href;
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className={`flex items-center rounded-xl px-4 py-3 text-sm font-medium transition ${
                    isActive
                      ? "bg-cyan-500/20 text-cyan-300"
                      : "text-slate-300 hover:bg-slate-800 hover:text-white"
                  }`}
                >
                  {link.label}
                </Link>
              );
            })}
          </nav>

          <div className="mt-10 rounded-2xl border border-cyan-500/20 bg-cyan-500/10 p-4 text-sm text-slate-300">
            <p className="font-semibold text-cyan-200">Need urgent help?</p>
            <p className="mt-1">Call the civic emergency line 24/7.</p>
          </div>
        </aside>

        <main className="flex-1 p-6 lg:p-8">{children}</main>
      </div>
    </div>
  );
}
