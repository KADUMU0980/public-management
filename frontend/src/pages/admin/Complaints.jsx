import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { adminAPI } from '../../services/api';
import { StatusBadge, PriorityBadge } from '../../components/common/Badges';
import LoadingSpinner, { EmptyState } from '../../components/common/Loading';
import { FileText, Search, Filter, ChevronLeft, ChevronRight, Eye, Trash2 } from 'lucide-react';
import { format } from 'date-fns';
import toast from 'react-hot-toast';

const STATUSES = ['', 'pending', 'verified', 'assigned', 'in_progress', 'resolved', 'rejected', 'closed'];
const CATEGORIES = ['', 'Potholes', 'Garbage', 'Water Leakage', 'Broken Streetlights', 'Sewage', 'Road Damage', 'Drainage', 'Illegal Dumping', 'Public Property Damage', 'Traffic Signal', 'Others'];
const PRIORITIES = ['', 'low', 'medium', 'high', 'emergency'];

export default function AdminComplaints() {
  const [complaints, setComplaints] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({ status: '', category: '', priority: '', search: '' });
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [total, setTotal] = useState(0);

  const load = async () => {
    setLoading(true);
    try {
      const { data } = await adminAPI.getComplaints({ page, limit: 15, ...filters });
      setComplaints(data.complaints);
      setTotalPages(data.pages);
      setTotal(data.total);
    } catch { toast.error('Failed to load'); }
    finally { setLoading(false); }
  };

  useEffect(() => { load(); }, [page, filters]);

  const handleDelete = async (id) => {
    if (!confirm('Delete this complaint permanently?')) return;
    try { await adminAPI.deleteComplaint(id); toast.success('Deleted'); load(); }
    catch { toast.error('Failed to delete'); }
  };

  return (
    <div className="space-y-6 animate-fade-in">
      <div>
        <h1 className="text-2xl font-bold text-white flex items-center gap-2"><FileText className="w-6 h-6 text-primary-400" /> Complaint Management</h1>
        <p className="text-gray-400 text-sm mt-1">{total} total complaints</p>
      </div>

      {/* Filters */}
      <div className="glass-card rounded-2xl p-4">
        <div className="flex flex-wrap gap-3 items-center">
          <div className="relative flex-1 min-w-[200px]">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
            <input value={filters.search} onChange={e => { setFilters(f => ({ ...f, search: e.target.value })); setPage(1); }}
              placeholder="Search by ID, title, area..." className="input-dark pl-10 !py-2 text-sm" />
          </div>
          <select value={filters.status} onChange={e => { setFilters(f => ({ ...f, status: e.target.value })); setPage(1); }}
            className="bg-dark-700 border border-white/10 text-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-primary-500">
            {STATUSES.map(s => <option key={s} value={s}>{s ? s.replace('_', ' ').toUpperCase() : 'All Status'}</option>)}
          </select>
          <select value={filters.category} onChange={e => { setFilters(f => ({ ...f, category: e.target.value })); setPage(1); }}
            className="bg-dark-700 border border-white/10 text-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-primary-500">
            {CATEGORIES.map(c => <option key={c} value={c}>{c || 'All Categories'}</option>)}
          </select>
          <select value={filters.priority} onChange={e => { setFilters(f => ({ ...f, priority: e.target.value })); setPage(1); }}
            className="bg-dark-700 border border-white/10 text-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-primary-500">
            {PRIORITIES.map(p => <option key={p} value={p}>{p ? p.toUpperCase() : 'All Priority'}</option>)}
          </select>
        </div>
      </div>

      {/* Table */}
      {loading ? <LoadingSpinner /> : complaints.length === 0 ? (
        <EmptyState icon="📭" title="No complaints found" description="No complaints match your filters." />
      ) : (
        <>
          <div className="glass-card rounded-2xl overflow-hidden">
            <div className="overflow-x-auto">
              <table className="table-dark">
                <thead>
                  <tr>
                    <th>Complaint ID</th><th>Title</th><th>Citizen</th><th>Category</th>
                    <th>Status</th><th>Priority</th><th>Date</th><th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {complaints.map(c => (
                    <tr key={c._id}>
                      <td><span className="text-primary-400 font-mono text-xs font-semibold">{c.complaintId}</span></td>
                      <td><span className="text-white font-medium max-w-[180px] truncate block">{c.title}</span></td>
                      <td>
                        <div>
                          <p className="text-white text-sm">{c.citizen?.name}</p>
                          <p className="text-gray-500 text-xs">{c.citizen?.email}</p>
                        </div>
                      </td>
                      <td><span className="text-gray-300 text-xs">{c.category}</span></td>
                      <td><StatusBadge status={c.status} /></td>
                      <td><PriorityBadge priority={c.priority} /></td>
                      <td><span className="text-gray-400 text-xs">{format(new Date(c.createdAt), 'dd/MM/yyyy')}</span></td>
                      <td>
                        <div className="flex items-center gap-2">
                          <Link to={`/admin/complaints/${c._id}`} className="p-2 rounded-lg bg-primary-600/20 text-primary-400 hover:bg-primary-600/30 transition-colors">
                            <Eye className="w-4 h-4" />
                          </Link>
                          <button onClick={() => handleDelete(c._id)} className="p-2 rounded-lg bg-red-600/20 text-red-400 hover:bg-red-600/30 transition-colors">
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {totalPages > 1 && (
            <div className="flex items-center justify-center gap-2">
              <button onClick={() => setPage(p => Math.max(1, p - 1))} disabled={page === 1}
                className="p-2 rounded-lg bg-white/5 border border-white/10 text-gray-400 hover:text-white disabled:opacity-40">
                <ChevronLeft className="w-5 h-5" />
              </button>
              <span className="text-gray-400 text-sm px-4">Page {page} of {totalPages}</span>
              <button onClick={() => setPage(p => Math.min(totalPages, p + 1))} disabled={page === totalPages}
                className="p-2 rounded-lg bg-white/5 border border-white/10 text-gray-400 hover:text-white disabled:opacity-40">
                <ChevronRight className="w-5 h-5" />
              </button>
            </div>
          )}
        </>
      )}
    </div>
  );
}
