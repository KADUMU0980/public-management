import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { complaintAPI } from '../../services/api';
import { StatusBadge, PriorityBadge } from '../../components/common/Badges';
import LoadingSpinner, { EmptyState } from '../../components/common/Loading';
import { FileText, Search, Filter, Plus, ChevronLeft, ChevronRight } from 'lucide-react';
import { format } from 'date-fns';
import toast from 'react-hot-toast';

const STATUSES = ['', 'pending', 'verified', 'assigned', 'in_progress', 'resolved', 'rejected', 'closed'];
const CATEGORIES = ['', 'Potholes', 'Garbage', 'Water Leakage', 'Broken Streetlights', 'Sewage', 'Road Damage', 'Drainage', 'Illegal Dumping', 'Public Property Damage', 'Traffic Signal', 'Others'];

export default function MyComplaints() {
  const [complaints, setComplaints] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({ status: '', category: '' });
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [total, setTotal] = useState(0);

  const load = async () => {
    setLoading(true);
    try {
      const { data } = await complaintAPI.getMyComplaints({ page, limit: 10, ...filters });
      setComplaints(data.complaints);
      setTotalPages(data.pages);
      setTotal(data.total);
    } catch (err) {
      toast.error('Failed to load complaints');
    } finally { setLoading(false); }
  };

  useEffect(() => { load(); }, [page, filters]);

  const handleDelete = async (id) => {
    if (!confirm('Delete this complaint?')) return;
    try {
      await complaintAPI.deleteComplaint(id);
      toast.success('Complaint deleted');
      load();
    } catch (err) { toast.error(err.response?.data?.message || 'Cannot delete'); }
  };

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-white flex items-center gap-2"><FileText className="w-6 h-6 text-primary-400" /> My Complaints</h1>
          <p className="text-gray-400 text-sm mt-1">{total} total complaints</p>
        </div>
        <Link to="/citizen/raise-complaint" className="btn-primary flex items-center gap-2 self-start">
          <Plus className="w-4 h-4" /> New Complaint
        </Link>
      </div>

      {/* Filters */}
      <div className="glass-card rounded-2xl p-4 flex flex-wrap gap-3 items-center">
        <Filter className="w-5 h-5 text-gray-400 flex-shrink-0" />
        <select value={filters.status} onChange={e => { setFilters(f => ({ ...f, status: e.target.value })); setPage(1); }}
          className="bg-dark-700 border border-white/10 text-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-primary-500">
          {STATUSES.map(s => <option key={s} value={s}>{s ? s.replace('_', ' ').replace(/\b\w/g, l => l.toUpperCase()) : 'All Status'}</option>)}
        </select>
        <select value={filters.category} onChange={e => { setFilters(f => ({ ...f, category: e.target.value })); setPage(1); }}
          className="bg-dark-700 border border-white/10 text-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-primary-500">
          {CATEGORIES.map(c => <option key={c} value={c}>{c || 'All Categories'}</option>)}
        </select>
        {(filters.status || filters.category) && (
          <button onClick={() => { setFilters({ status: '', category: '' }); setPage(1); }}
            className="text-primary-400 hover:text-primary-300 text-sm transition-colors">Clear filters</button>
        )}
      </div>

      {/* Complaints List */}
      {loading ? <LoadingSpinner /> : complaints.length === 0 ? (
        <EmptyState icon="📭" title="No complaints found" description="You haven't raised any complaints yet."
          action={<Link to="/citizen/raise-complaint" className="btn-primary">Raise First Complaint</Link>} />
      ) : (
        <div className="space-y-3">
          {complaints.map((c) => (
            <div key={c._id} className="glass-card rounded-2xl p-5 hover:border-primary-500/20 transition-all duration-200">
              <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1 flex-wrap">
                    <span className="text-primary-400 text-xs font-mono font-semibold">{c.complaintId}</span>
                    <span className="text-gray-600 text-xs">•</span>
                    <span className="text-gray-500 text-xs">{format(new Date(c.createdAt), 'dd MMM yyyy')}</span>
                    <span className="text-gray-600 text-xs">•</span>
                    <span className="text-gray-400 text-xs">{c.category}</span>
                  </div>
                  <h3 className="text-white font-semibold text-lg mb-1 truncate">{c.title}</h3>
                  <p className="text-gray-400 text-sm line-clamp-2">{c.description}</p>
                  {c.assignedDepartment && (
                    <p className="text-gray-500 text-xs mt-2">🏢 Assigned to: <span className="text-gray-300">{c.assignedDepartment}</span></p>
                  )}
                </div>
                <div className="flex flex-col gap-2 items-start sm:items-end flex-shrink-0">
                  <StatusBadge status={c.status} />
                  <PriorityBadge priority={c.priority} />
                </div>
              </div>

              {/* Progress bar */}
              {c.resolutionProgress > 0 && (
                <div className="mt-4">
                  <div className="flex justify-between text-xs text-gray-400 mb-1">
                    <span>Resolution Progress</span><span>{c.resolutionProgress}%</span>
                  </div>
                  <div className="progress-bar">
                    <div className="progress-fill bg-gradient-to-r from-primary-600 to-primary-400" style={{ width: `${c.resolutionProgress}%` }}></div>
                  </div>
                </div>
              )}

              <div className="flex items-center gap-2 mt-4 pt-4 border-t border-white/5">
                <Link to={`/citizen/complaints/${c._id}`} className="btn-secondary !py-1.5 !px-4 text-sm">View Details</Link>
                {c.status === 'pending' && (<>
                  <button onClick={() => handleDelete(c._id)} className="btn-danger !py-1.5 !px-4 text-sm">Delete</button>
                </>)}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex items-center justify-center gap-2">
          <button onClick={() => setPage(p => Math.max(1, p - 1))} disabled={page === 1}
            className="p-2 rounded-lg bg-white/5 border border-white/10 text-gray-400 hover:text-white disabled:opacity-40 transition-all">
            <ChevronLeft className="w-5 h-5" />
          </button>
          <span className="text-gray-400 text-sm px-4">Page {page} of {totalPages}</span>
          <button onClick={() => setPage(p => Math.min(totalPages, p + 1))} disabled={page === totalPages}
            className="p-2 rounded-lg bg-white/5 border border-white/10 text-gray-400 hover:text-white disabled:opacity-40 transition-all">
            <ChevronRight className="w-5 h-5" />
          </button>
        </div>
      )}
    </div>
  );
}
