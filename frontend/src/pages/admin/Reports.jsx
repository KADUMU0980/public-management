import React, { useState } from 'react';
import { adminAPI } from '../../services/api';
import { BarChart3, Download, Calendar, FileSpreadsheet, TrendingUp, PieChart } from 'lucide-react';
import toast from 'react-hot-toast';
import LoadingSpinner from '../../components/common/Loading';
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  PieChart as RechartsPie, Pie, Cell, Legend
} from 'recharts';
import { format } from 'date-fns';

const COLORS = ['#3b82f6', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6', '#06b6d4'];
const PERIODS = [
  { v: 'daily', l: '📅 Daily', d: 'Last 24 hours' },
  { v: 'weekly', l: '📆 Weekly', d: 'Last 7 days' },
  { v: 'monthly', l: '🗓️ Monthly', d: 'Last 30 days' },
  { v: 'yearly', l: '📊 Yearly', d: 'Last 12 months' },
];

const CustomTooltip = ({ active, payload, label }) => {
  if (active && payload?.length) {
    return (
      <div className="glass-card rounded-xl p-3 text-sm border border-white/10">
        <p className="text-gray-300 mb-1">{label}</p>
        {payload.map(p => <p key={p.dataKey} style={{ color: p.fill || p.color }}>{p.name}: {p.value}</p>)}
      </div>
    );
  }
  return null;
};

export default function AdminReports() {
  const [period, setPeriod] = useState('monthly');
  const [report, setReport] = useState(null);
  const [loading, setLoading] = useState(false);

  const generateReport = async () => {
    setLoading(true);
    try {
      const { data } = await adminAPI.getReports({ period });
      setReport(data);
      toast.success('Report generated!');
    } catch { toast.error('Failed to generate report'); }
    finally { setLoading(false); }
  };

  const downloadCSV = () => {
    if (!report) return;
    const rows = [
      ['Complaint ID', 'Title', 'Category', 'Status', 'Priority', 'City', 'Date'],
      ...report.complaints.map(c => [c.complaintId, c.title, c.category, c.status, c.priority, c.address?.city || '', format(new Date(c.createdAt), 'dd/MM/yyyy')])
    ];
    const csv = rows.map(r => r.join(',')).join('\n');
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url; a.download = `report-${period}-${Date.now()}.csv`; a.click();
    URL.revokeObjectURL(url);
    toast.success('CSV downloaded!');
  };

  const statusChartData = report ? Object.entries(report.stats.byStatus).map(([name, value]) => ({ name: name.replace('_', ' '), value })) : [];
  const categoryChartData = report ? Object.entries(report.stats.byCategory).map(([name, value]) => ({ name, value })).slice(0, 8) : [];
  const priorityChartData = report ? Object.entries(report.stats.byPriority).map(([name, value]) => ({ name, value })) : [];

  return (
    <div className="space-y-6 animate-fade-in">
      <div>
        <h1 className="text-2xl font-bold text-white flex items-center gap-2">
          <BarChart3 className="w-6 h-6 text-primary-400" /> Reports & Analytics
        </h1>
        <p className="text-gray-400 text-sm mt-1">Generate and export complaint reports</p>
      </div>

      {/* Period Selection */}
      <div className="glass-card rounded-2xl p-6">
        <h2 className="text-white font-semibold mb-4">Select Report Period</h2>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-6">
          {PERIODS.map(p => (
            <button key={p.v} onClick={() => setPeriod(p.v)}
              className={`p-4 rounded-xl border text-left transition-all duration-200 ${period === p.v ? 'bg-primary-600/20 border-primary-500/50 text-white' : 'bg-white/3 border-white/10 text-gray-400 hover:bg-white/5'}`}>
              <p className="font-semibold text-sm">{p.l}</p>
              <p className="text-xs mt-1 opacity-70">{p.d}</p>
            </button>
          ))}
        </div>
        <div className="flex gap-3">
          <button onClick={generateReport} disabled={loading} className="btn-primary flex items-center gap-2">
            {loading ? <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" /> : <TrendingUp className="w-5 h-5" />}
            Generate Report
          </button>
          {report && (
            <button onClick={downloadCSV} className="btn-secondary flex items-center gap-2">
              <Download className="w-5 h-5" /> Download CSV
            </button>
          )}
        </div>
      </div>

      {loading && <LoadingSpinner text="Generating report..." />}

      {report && !loading && (
        <>
          {/* Summary Cards */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            {[
              { l: 'Total Complaints', v: report.stats.total, icon: '📋', color: 'from-blue-600 to-blue-400' },
              { l: 'Resolved', v: report.stats.byStatus?.resolved || 0, icon: '✅', color: 'from-green-600 to-green-400' },
              { l: 'Pending', v: report.stats.byStatus?.pending || 0, icon: '⏳', color: 'from-yellow-600 to-yellow-400' },
              { l: 'Rejected', v: report.stats.byStatus?.rejected || 0, icon: '❌', color: 'from-red-600 to-red-400' },
            ].map(s => (
              <div key={s.l} className={`stat-card relative overflow-hidden`}>
                <div className={`absolute inset-0 bg-gradient-to-br ${s.color} opacity-10`}></div>
                <div className="relative z-10">
                  <div className="text-3xl mb-2">{s.icon}</div>
                  <p className="text-3xl font-black text-white">{s.v}</p>
                  <p className="text-gray-400 text-sm mt-1">{s.l}</p>
                </div>
              </div>
            ))}
          </div>

          {/* Charts */}
          <div className="grid lg:grid-cols-2 gap-6">
            {/* Status Chart */}
            <div className="glass-card rounded-2xl p-6">
              <h2 className="text-white font-bold mb-4">By Status</h2>
              <ResponsiveContainer width="100%" height={220}>
                <BarChart data={statusChartData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
                  <XAxis dataKey="name" tick={{ fill: '#6b7280', fontSize: 10 }} />
                  <YAxis tick={{ fill: '#6b7280', fontSize: 11 }} />
                  <Tooltip content={<CustomTooltip />} />
                  <Bar dataKey="value" radius={[6, 6, 0, 0]} name="Count">
                    {statusChartData.map((_, i) => <Cell key={i} fill={COLORS[i % COLORS.length]} />)}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>

            {/* Category Pie */}
            <div className="glass-card rounded-2xl p-6">
              <h2 className="text-white font-bold mb-4">By Category</h2>
              <ResponsiveContainer width="100%" height={220}>
                <RechartsPie>
                  <Pie data={categoryChartData} cx="50%" cy="50%" outerRadius={80} dataKey="value" nameKey="name">
                    {categoryChartData.map((_, i) => <Cell key={i} fill={COLORS[i % COLORS.length]} />)}
                  </Pie>
                  <Legend formatter={v => <span style={{ color: '#9ca3af', fontSize: 11 }}>{v.slice(0, 12)}</span>} />
                  <Tooltip content={<CustomTooltip />} />
                </RechartsPie>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Data Table Preview */}
          <div className="glass-card rounded-2xl p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-white font-bold">Complaint Data ({report.complaints.length} records)</h2>
              <button onClick={downloadCSV} className="flex items-center gap-2 text-primary-400 hover:text-primary-300 text-sm transition-colors">
                <FileSpreadsheet className="w-4 h-4" /> Export CSV
              </button>
            </div>
            <div className="overflow-x-auto">
              <table className="table-dark">
                <thead>
                  <tr><th>ID</th><th>Title</th><th>Category</th><th>Status</th><th>Priority</th><th>City</th><th>Date</th></tr>
                </thead>
                <tbody>
                  {report.complaints.slice(0, 20).map(c => (
                    <tr key={c._id}>
                      <td><span className="text-primary-400 font-mono text-xs">{c.complaintId}</span></td>
                      <td><span className="text-white text-sm truncate max-w-[150px] block">{c.title}</span></td>
                      <td><span className="text-gray-400 text-xs">{c.category}</span></td>
                      <td><span className={`text-xs px-2 py-0.5 rounded-full ${c.status === 'resolved' ? 'bg-green-500/20 text-green-400' : c.status === 'pending' ? 'bg-yellow-500/20 text-yellow-400' : 'bg-gray-500/20 text-gray-400'}`}>{c.status}</span></td>
                      <td><span className="text-gray-400 text-xs capitalize">{c.priority}</span></td>
                      <td><span className="text-gray-400 text-xs">{c.address?.city || '—'}</span></td>
                      <td><span className="text-gray-400 text-xs">{format(new Date(c.createdAt), 'dd/MM/yyyy')}</span></td>
                    </tr>
                  ))}
                </tbody>
              </table>
              {report.complaints.length > 20 && <p className="text-gray-500 text-xs text-center mt-3">Showing 20 of {report.complaints.length} records. Export CSV for full data.</p>}
            </div>
          </div>
        </>
      )}
    </div>
  );
}
