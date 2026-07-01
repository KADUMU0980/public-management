import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { complaintAPI, announcementAPI } from '../../services/api';
import { useAuth } from '../../context/AuthContext';
import { FileText, Clock, CheckCircle, XCircle, Plus, TrendingUp, Bell, Megaphone } from 'lucide-react';
import { StatusBadge, PriorityBadge } from '../../components/common/Badges';
import LoadingSpinner from '../../components/common/Loading';
import { format } from 'date-fns';

const StatCard = ({ icon: Icon, label, value, color, gradient }) => (
  <div className={`stat-card relative overflow-hidden`}>
    <div className={`absolute inset-0 bg-gradient-to-br ${gradient} opacity-10`}></div>
    <div className="relative z-10">
      <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${gradient} flex items-center justify-center mb-4`}>
        <Icon className="w-6 h-6 text-white" />
      </div>
      <p className="text-4xl font-black text-white mb-1">{value}</p>
      <p className="text-gray-400 text-sm font-medium">{label}</p>
    </div>
  </div>
);

export default function CitizenDashboard() {
  const { user } = useAuth();
  const [stats, setStats] = useState(null);
  const [recentComplaints, setRecentComplaints] = useState([]);
  const [announcements, setAnnouncements] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      try {
        const [dashRes, annRes] = await Promise.all([
          complaintAPI.getDashboard(),
          announcementAPI.getAll()
        ]);
        setStats(dashRes.data.stats);
        setRecentComplaints(dashRes.data.recentComplaints || []);
        setAnnouncements(annRes.data.announcements || []);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  if (loading) return <LoadingSpinner />;

  const statCards = [
    { icon: FileText, label: 'Total Complaints', value: stats?.total || 0, gradient: 'from-blue-600 to-blue-400' },
    { icon: Clock, label: 'Pending', value: stats?.pending || 0, gradient: 'from-yellow-600 to-yellow-400' },
    { icon: TrendingUp, label: 'In Progress', value: stats?.inProgress || 0, gradient: 'from-orange-600 to-orange-400' },
    { icon: CheckCircle, label: 'Resolved', value: stats?.resolved || 0, gradient: 'from-green-600 to-green-400' },
    { icon: XCircle, label: 'Rejected', value: stats?.rejected || 0, gradient: 'from-red-600 to-red-400' },
  ];

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-white">Good {new Date().getHours() < 12 ? 'Morning' : new Date().getHours() < 17 ? 'Afternoon' : 'Evening'}, {user?.name?.split(' ')[0]}! 👋</h1>
          <p className="text-gray-400 text-sm mt-1">Here's an overview of your complaints</p>
        </div>
        <Link to="/citizen/raise-complaint" className="btn-primary flex items-center gap-2 self-start sm:self-auto">
          <Plus className="w-5 h-5" /> Raise Complaint
        </Link>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-5 gap-4">
        {statCards.map((card) => <StatCard key={card.label} {...card} />)}
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        {/* Recent Complaints */}
        <div className="lg:col-span-2 glass-card rounded-2xl p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-white font-bold text-lg flex items-center gap-2">
              <FileText className="w-5 h-5 text-primary-400" /> Recent Complaints
            </h2>
            <Link to="/citizen/my-complaints" className="text-primary-400 text-sm hover:text-primary-300 transition-colors">View All →</Link>
          </div>
          {recentComplaints.length === 0 ? (
            <div className="text-center py-10">
              <div className="text-5xl mb-3">📭</div>
              <p className="text-gray-400">No complaints yet</p>
              <Link to="/citizen/raise-complaint" className="btn-primary mt-4 inline-block text-sm">Raise your first complaint</Link>
            </div>
          ) : (
            <div className="space-y-3">
              {recentComplaints.map((c) => (
                <Link to={`/citizen/complaints/${c._id}`} key={c._id}
                  className="flex items-center gap-4 p-4 rounded-xl bg-white/3 hover:bg-white/5 border border-white/5 hover:border-primary-500/30 transition-all duration-200 group"
                >
                  <div className="w-10 h-10 rounded-lg bg-primary-600/20 flex items-center justify-center flex-shrink-0">
                    <FileText className="w-5 h-5 text-primary-400" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-white font-medium truncate group-hover:text-primary-300 transition-colors">{c.title}</p>
                    <div className="flex items-center gap-2 mt-1 flex-wrap">
                      <span className="text-gray-500 text-xs">{c.complaintId}</span>
                      <span className="text-gray-600 text-xs">•</span>
                      <span className="text-gray-500 text-xs">{format(new Date(c.createdAt), 'dd MMM yyyy')}</span>
                    </div>
                  </div>
                  <div className="flex flex-col items-end gap-1 flex-shrink-0">
                    <StatusBadge status={c.status} />
                    <PriorityBadge priority={c.priority} />
                  </div>
                </Link>
              ))}
            </div>
          )}
        </div>

        {/* Announcements */}
        <div className="glass-card rounded-2xl p-6">
          <h2 className="text-white font-bold text-lg flex items-center gap-2 mb-6">
            <Megaphone className="w-5 h-5 text-yellow-400" /> Announcements
          </h2>
          {announcements.length === 0 ? (
            <p className="text-gray-400 text-sm text-center py-8">No announcements</p>
          ) : (
            <div className="space-y-3">
              {announcements.slice(0, 5).map((a) => (
                <div key={a._id} className={`p-4 rounded-xl border ${
                  a.type === 'success' ? 'bg-green-500/10 border-green-500/20' :
                  a.type === 'warning' ? 'bg-yellow-500/10 border-yellow-500/20' :
                  a.type === 'urgent' ? 'bg-red-500/10 border-red-500/20' :
                  'bg-blue-500/10 border-blue-500/20'
                }`}>
                  {a.isPinned && <span className="text-xs text-yellow-400 font-semibold">📌 PINNED</span>}
                  <p className="text-white text-sm font-semibold mt-1">{a.title}</p>
                  <p className="text-gray-400 text-xs mt-1 line-clamp-2">{a.content}</p>
                  <p className="text-gray-600 text-xs mt-2">{format(new Date(a.createdAt), 'dd MMM yyyy')}</p>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Quick Actions */}
      <div className="glass-card rounded-2xl p-6">
        <h2 className="text-white font-bold text-lg mb-4">Quick Actions</h2>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          {[
            { to: '/citizen/raise-complaint', icon: '➕', label: 'New Complaint', color: 'from-primary-600 to-primary-400' },
            { to: '/citizen/my-complaints', icon: '📋', label: 'My Complaints', color: 'from-purple-600 to-purple-400' },
            { to: '/citizen/notifications', icon: '🔔', label: 'Notifications', color: 'from-yellow-600 to-yellow-400' },
            { to: '/citizen/profile', icon: '👤', label: 'Edit Profile', color: 'from-green-600 to-green-400' },
          ].map(({ to, icon, label, color }) => (
            <Link key={to} to={to} className={`flex flex-col items-center gap-3 p-5 rounded-xl bg-gradient-to-br ${color} bg-opacity-10 border border-white/10 hover:border-white/20 hover:scale-105 transition-all duration-200`}>
              <span className="text-3xl">{icon}</span>
              <span className="text-white text-sm font-medium">{label}</span>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
