import React, { useState } from 'react';
import { Outlet, NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import {
  LayoutDashboard, FileText, Users, Tag, Megaphone, BarChart3,
  MessageSquare, LogOut, Menu, X, ChevronRight, Shield, Settings, Star
} from 'lucide-react';

const navItems = [
  { to: '/admin', icon: LayoutDashboard, label: 'Dashboard', end: true },
  { to: '/admin/complaints', icon: FileText, label: 'Complaints' },
  { to: '/admin/users', icon: Users, label: 'Users' },
  { to: '/admin/categories', icon: Tag, label: 'Categories' },
  { to: '/admin/announcements', icon: Megaphone, label: 'Announcements' },
  { to: '/admin/reports', icon: BarChart3, label: 'Reports' },
  { to: '/admin/feedback', icon: Star, label: 'Feedback' },
  { to: '/admin/profile', icon: Settings, label: 'Settings' },
];

export default function AdminLayout() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const handleLogout = () => { logout(); navigate('/login'); };

  const Sidebar = ({ mobile }) => (
    <div className="flex flex-col h-full">
      {/* Logo */}
      <div className="p-6 border-b border-white/5">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-purple-600 to-pink-500 flex items-center justify-center shadow-lg">
            <Shield className="w-5 h-5 text-white" />
          </div>
          <div>
            <h1 className="text-white font-bold text-lg leading-none">CitizenConnect</h1>
            <p className="text-purple-400 text-xs mt-0.5 font-medium">Admin Panel</p>
          </div>
        </div>
      </div>

      {/* Admin info */}
      <div className="p-4 mx-3 mt-4 rounded-xl bg-gradient-to-r from-purple-900/50 to-pink-900/30 border border-purple-500/20">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center text-white font-bold text-sm flex-shrink-0">
            {user?.name?.charAt(0)?.toUpperCase()}
          </div>
          <div className="min-w-0">
            <p className="text-white font-medium text-sm truncate">{user?.name}</p>
            <div className="flex items-center gap-1 mt-0.5">
              <Shield className="w-3 h-3 text-purple-400" />
              <p className="text-purple-400 text-xs font-medium">Administrator</p>
            </div>
          </div>
        </div>
      </div>

      {/* Nav */}
      <nav className="flex-1 px-3 py-4 space-y-1 overflow-y-auto">
        <p className="text-gray-600 text-xs font-semibold uppercase tracking-wider px-4 mb-2">Management</p>
        {navItems.slice(0, 5).map(({ to, icon: Icon, label, end }) => (
          <NavLink key={to} to={to} end={end}
            className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}
            onClick={() => mobile && setSidebarOpen(false)}
          >
            <Icon className="w-5 h-5 flex-shrink-0" />
            <span className="flex-1 font-medium">{label}</span>
            <ChevronRight className="w-4 h-4 opacity-40" />
          </NavLink>
        ))}
        <p className="text-gray-600 text-xs font-semibold uppercase tracking-wider px-4 mb-2 mt-4">Analytics</p>
        {navItems.slice(5).map(({ to, icon: Icon, label, end }) => (
          <NavLink key={to} to={to} end={end}
            className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}
            onClick={() => mobile && setSidebarOpen(false)}
          >
            <Icon className="w-5 h-5 flex-shrink-0" />
            <span className="flex-1 font-medium">{label}</span>
            <ChevronRight className="w-4 h-4 opacity-40" />
          </NavLink>
        ))}
      </nav>

      {/* Logout */}
      <div className="p-3 border-t border-white/5">
        <button onClick={handleLogout} className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-gray-400 hover:text-red-400 hover:bg-red-500/10 transition-all duration-200">
          <LogOut className="w-5 h-5" />
          <span className="font-medium">Logout</span>
        </button>
      </div>
    </div>
  );

  return (
    <div className="flex h-screen overflow-hidden" style={{ background: '#0a0f1e' }}>
      {/* Desktop Sidebar */}
      <aside className="hidden lg:flex flex-col w-72 glass border-r border-white/5 flex-shrink-0">
        <Sidebar />
      </aside>

      {/* Mobile Sidebar */}
      {sidebarOpen && (
        <div className="lg:hidden fixed inset-0 z-50 flex">
          <div className="fixed inset-0 bg-black/60 backdrop-blur-sm" onClick={() => setSidebarOpen(false)} />
          <aside className="relative z-10 w-72 glass flex flex-col">
            <button onClick={() => setSidebarOpen(false)} className="absolute top-4 right-4 text-gray-400 hover:text-white">
              <X className="w-6 h-6" />
            </button>
            <Sidebar mobile />
          </aside>
        </div>
      )}

      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        <header className="glass border-b border-white/5 px-4 lg:px-6 py-4 flex items-center justify-between flex-shrink-0">
          <button onClick={() => setSidebarOpen(true)} className="lg:hidden text-gray-400 hover:text-white">
            <Menu className="w-6 h-6" />
          </button>
          <div className="hidden lg:block">
            <h2 className="text-white font-semibold">Admin Control Panel</h2>
            <p className="text-gray-400 text-sm">Manage complaints, users and settings</p>
          </div>
          <div className="ml-auto flex items-center gap-3">
            <div className="px-3 py-1 rounded-full bg-purple-500/20 border border-purple-500/30 text-purple-400 text-xs font-semibold">
              🛡️ Super Admin
            </div>
          </div>
        </header>

        <main className="flex-1 overflow-y-auto p-4 lg:p-6">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
