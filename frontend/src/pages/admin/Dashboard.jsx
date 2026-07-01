import React, { useEffect, useState } from 'react';
import { adminAPI } from '../../services/api';
import { FileText, Users, CheckCircle, XCircle, Clock, AlertTriangle, TrendingUp, Calendar, Activity } from 'lucide-react';
import LoadingSpinner from '../../components/common/Loading';
import { format } from 'date-fns';
import { StatusBadge, PriorityBadge } from '../../components/common/Badges';
import { Link } from 'react-router-dom';
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  PieChart, Pie, Cell, LineChart, Line, Legend
} from 'recharts';

const COLORS = ['#3b82f6', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6', '#06b6d4', '#ec4899', '#84cc16'];

const StatCard = ({ icon: Icon, label, value, color, change, sub }) => (
  <div className="stat-card">
    <div className="flex items-start justify-between">
      <div>
        <p className="text-gray-400 text-sm font-medium">{label}</p>
        <p className="text-4xl font-black text-white mt-2">{value}</p>
        {sub && <p className="text-gray-500 text-xs mt-1">{sub}</p>}
      </div>
      <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${color} flex items-center justify-center flex-shrink-0`}>
        <Icon className="w-6 h-6 text-white" />
      </div>
    </div>
  </div>
);

const CustomTooltip = ({ active, payload, label }) => {
  if (active && payload?.length) {
    return (
      <div className="glass-card rounded-xl p-3 text-sm">
        <p className="text-gray-300 mb-1">{label}</p>
        {payload.map(p => <p key={p.dataKey} style={{ color: p.color }}>{p.name}: {p.value}</p>)}
      </div>
    );
  }
  return null;
};

export default function AdminDashboard() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    adminAPI.getDashboard().then(r => setData(r.data)).catch(console.error).finally(() => setLoading(false));
  }, []);

  if (loading) return <LoadingSpinner />;
  if (!data) return <div className="text-gray-400">Failed to load dashboard</div>;

  const { stats, categoryData, monthlyTrend, statusData, recentComplaints, recentActivities } = data;

  const statCards = [
    { icon: FileText, label: 'Total Complaints', value: stats.total, color: 'from-blue-600 to-blue-400', sub: `${stats.monthCount} this month` },
    { icon: Clock, label: 'Pending Review', value: stats.pending, color: 'from-yellow-600 to-yellow-400' },
    { icon: CheckCircle, label: 'Resolved', value: stats.resolved, color: 'from-green-600 to-green-400' },
    { icon: XCircle, label: 'Rejected', value: stats.rejected, color: 'from-red-600 to-red-400' },
    { icon: AlertTriangle, label: 'Emergency', value: stats.emergency, color: 'from-orange-600 to-red-500' },
    { icon: Calendar, label: "Today's Complaints", value: stats.todayCount, color: 'from-purple-600 to-purple-400' },
    { icon: Users, label: 'Total Citizens', value: stats.totalUsers, color: 'from-cyan-600 to-cyan-400' },
    { icon: TrendingUp, label: 'Monthly', value: stats.monthCount, color: 'from-pink-600 to-pink-400' },
  ];

  const pieData = categoryData.map(c => ({ name: c._id, value: c.count }));
  const barData = monthlyTrend.map(m => ({ name: `${m._id.year}-${String(m._id.month).padStart(2, '0')}`, complaints: m.count }));

  return (
    <div className="space-y-6 animate-fade-in">
      <div>
        <h1 className="text-2xl font-bold text-white">Admin Dashboard</h1>
        <p className="text-gray-400 text-sm mt-1">Overview of all complaints and activities</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {statCards.map(s => <StatCard key={s.label} {...s} />)}
      </div>

      {/* Charts */}
      <div className="grid lg:grid-cols-2 gap-6">
        {/* Monthly Trend */}
        <div className="glass-card rounded-2xl p-6">
          <h2 className="text-white font-bold text-lg mb-6">Monthly Complaints Trend</h2>
          <ResponsiveContainer width="100%" height={220}>
            <BarChart data={barData}>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
              <XAxis dataKey="name" tick={{ fill: '#6b7280', fontSize: 11 }} />
              <YAxis tick={{ fill: '#6b7280', fontSize: 11 }} />
              <Tooltip content={<CustomTooltip />} />
              <Bar dataKey="complaints" fill="#3b82f6" radius={[6, 6, 0, 0]} name="Complaints" />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Category Pie */}
        <div className="glass-card rounded-2xl p-6">
          <h2 className="text-white font-bold text-lg mb-6">Complaints by Category</h2>
          <ResponsiveContainer width="100%" height={220}>
            <PieChart>
              <Pie data={pieData} cx="50%" cy="50%" outerRadius={80} dataKey="value" nameKey="name" label={({ name, percent }) => `${name.slice(0, 8)} ${(percent * 100).toFixed(0)}%`} labelLine={false}>
                {pieData.map((_, i) => <Cell key={i} fill={COLORS[i % COLORS.length]} />)}
              </Pie>
              <Tooltip content={<CustomTooltip />} />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        {/* Recent Complaints */}
        <div className="lg:col-span-2 glass-card rounded-2xl p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-white font-bold text-lg">Recent Complaints</h2>
            <Link to="/admin/complaints" className="text-primary-400 text-sm hover:text-primary-300">View All →</Link>
          </div>
          <div className="overflow-x-auto">
            <table className="table-dark">
              <thead>
                <tr><th>Complaint ID</th><th>Title</th><th>Citizen</th><th>Status</th><th>Priority</th></tr>
              </thead>
              <tbody>
                {recentComplaints?.slice(0, 8).map(c => (
                  <tr key={c._id}>
                    <td><Link to={`/admin/complaints/${c._id}`} className="text-primary-400 hover:text-primary-300 font-mono text-xs">{c.complaintId}</Link></td>
                    <td><span className="text-white max-w-[150px] truncate block">{c.title}</span></td>
                    <td><span className="text-gray-400 text-xs">{c.citizen?.name}</span></td>
                    <td><StatusBadge status={c.status} /></td>
                    <td><PriorityBadge priority={c.priority} /></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Recent Activity */}
        <div className="glass-card rounded-2xl p-6">
          <h2 className="text-white font-bold text-lg mb-4 flex items-center gap-2">
            <Activity className="w-5 h-5 text-primary-400" /> Recent Activity
          </h2>
          <div className="space-y-3">
            {recentActivities?.slice(0, 8).map((a, i) => (
              <div key={i} className="flex items-start gap-3 p-3 rounded-xl bg-white/3">
                <div className="w-8 h-8 rounded-lg bg-primary-600/20 flex items-center justify-center flex-shrink-0">
                  <Activity className="w-4 h-4 text-primary-400" />
                </div>
                <div>
                  <p className="text-white text-xs font-medium">{a.action}</p>
                  <p className="text-gray-500 text-xs">{a.adminName} • {format(new Date(a.createdAt), 'dd MMM, hh:mm a')}</p>
                </div>
              </div>
            ))}
            {(!recentActivities || recentActivities.length === 0) && (
              <p className="text-gray-500 text-sm text-center py-6">No recent activities</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
