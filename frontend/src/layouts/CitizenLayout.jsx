import React, { useState } from 'react';
import { Outlet, NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import {
  LayoutDashboard, Plus, FileText, Bell, User, LogOut, Menu, X,
  ChevronRight, Shield, Building2
} from 'lucide-react';
import NotificationBadge from '../components/common/NotificationBadge';

const navItems = [
  { to: '/citizen', icon: LayoutDashboard, label: 'Dashboard', end: true },
  { to: '/citizen/raise-complaint', icon: Plus, label: 'Raise Complaint' },
  { to: '/citizen/my-complaints', icon: FileText, label: 'My Complaints' },
  { to: '/citizen/notifications', icon: Bell, label: 'Notifications', badge: true },
  { to: '/citizen/profile', icon: User, label: 'Profile' },
];

export default function CitizenLayout() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const handleLogout = () => { logout(); navigate('/login'); };

  const Sidebar = ({ mobile }) => (
    <div className={`flex flex-col h-full ${mobile ? '' : 'w-72'}`}>
      {/* Logo */}
      <div className="p-6 border-b border-white/5">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary-600 to-primary-400 flex items-center justify-center shadow-glow-blue">
            <Building2 className="w-5 h-5 text-white" />
          </div>
          <div>
            <h1 className="text-white font-bold text-lg leading-none">CitizenConnect</h1>
            <p className="text-gray-500 text-xs mt-0.5">Citizen Portal</p>
          </div>
        </div>
      </div>

      {/* User info */}
      <div className="p-4 mx-3 mt-4 rounded-xl bg-gradient-to-r from-primary-900/50 to-primary-800/30 border border-primary-500/20">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-gradient-to-br from-primary-500 to-primary-700 flex items-center justify-center text-white font-bold text-sm flex-shrink-0">
            {user?.name?.charAt(0)?.toUpperCase()}
          </div>
          <div className="min-w-0">
            <p className="text-white font-medium text-sm truncate">{user?.name}</p>
            <p className="text-gray-400 text-xs truncate">{user?.email}</p>
          </div>
        </div>
      </div>

      {/* Nav */}
      <nav className="flex-1 px-3 py-4 space-y-1 overflow-y-auto">
        {navItems.map(({ to, icon: Icon, label, end, badge }) => (
          <NavLink key={to} to={to} end={end}
            className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}
            onClick={() => mobile && setSidebarOpen(false)}
          >
            <Icon className="w-5 h-5 flex-shrink-0" />
            <span className="flex-1 font-medium">{label}</span>
            {badge && <NotificationBadge />}
            <ChevronRight className="w-4 h-4 opacity-40" />
          </NavLink>
        ))}
      </nav>

      {/* Logout */}
      <div className="p-3 border-t border-white/5">
        <button onClick={handleLogout}
          className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-gray-400 hover:text-red-400 hover:bg-red-500/10 transition-all duration-200"
        >
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
          <aside className="relative z-10 w-72 glass flex flex-col animate-slide-in-right">
            <button onClick={() => setSidebarOpen(false)} className="absolute top-4 right-4 text-gray-400 hover:text-white">
              <X className="w-6 h-6" />
            </button>
            <Sidebar mobile />
          </aside>
        </div>
      )}

      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Topbar */}
        <header className="glass border-b border-white/5 px-4 lg:px-6 py-4 flex items-center justify-between flex-shrink-0">
          <button onClick={() => setSidebarOpen(true)} className="lg:hidden text-gray-400 hover:text-white">
            <Menu className="w-6 h-6" />
          </button>
          <div className="hidden lg:block">
            <h2 className="text-white font-semibold">Welcome back, {user?.name?.split(' ')[0]}! 👋</h2>
            <p className="text-gray-400 text-sm">Citizen Dashboard</p>
          </div>
          <div className="flex items-center gap-3 ml-auto lg:ml-0">
            <div className="text-right hidden sm:block">
              <p className="text-xs text-gray-500">{new Date().toLocaleDateString('en-IN', { weekday: 'long', day: 'numeric', month: 'long' })}</p>
            </div>
          </div>
        </header>

        {/* Page Content */}
        <main className="flex-1 overflow-y-auto p-4 lg:p-6">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
