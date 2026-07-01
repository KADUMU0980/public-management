import React, { useEffect, useState } from 'react';
import { adminAPI } from '../../services/api';
import { Users, Search, Shield, ShieldOff, Trash2, ChevronLeft, ChevronRight, Eye } from 'lucide-react';
import { format } from 'date-fns';
import toast from 'react-hot-toast';
import LoadingSpinner, { EmptyState } from '../../components/common/Loading';

export default function AdminUsers() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [page, setPage] = useState(1);
  const [total, setTotal] = useState(0);
  const [filterActive, setFilterActive] = useState('');

  const load = async () => {
    setLoading(true);
    try {
      const { data } = await adminAPI.getUsers({ page, limit: 15, search, isActive: filterActive });
      setUsers(data.users);
      setTotal(data.total);
    } catch { toast.error('Failed to load users'); }
    finally { setLoading(false); }
  };

  useEffect(() => { load(); }, [page, search, filterActive]);

  const toggleUser = async (id, name, isActive) => {
    if (!confirm(`${isActive ? 'Suspend' : 'Activate'} ${name}?`)) return;
    try {
      await adminAPI.toggleUser(id);
      toast.success(`User ${isActive ? 'suspended' : 'activated'}`);
      load();
    } catch { toast.error('Failed'); }
  };

  const deleteUser = async (id, name) => {
    if (!confirm(`Permanently delete ${name}? This cannot be undone.`)) return;
    try {
      await adminAPI.deleteUser(id);
      toast.success('User deleted');
      load();
    } catch { toast.error('Failed to delete'); }
  };

  const totalPages = Math.ceil(total / 15);

  return (
    <div className="space-y-6 animate-fade-in">
      <div>
        <h1 className="text-2xl font-bold text-white flex items-center gap-2">
          <Users className="w-6 h-6 text-primary-400" /> User Management
        </h1>
        <p className="text-gray-400 text-sm mt-1">{total} total citizens</p>
      </div>

      {/* Filters */}
      <div className="glass-card rounded-2xl p-4 flex flex-wrap gap-3 items-center">
        <div className="relative flex-1 min-w-[200px]">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
          <input value={search} onChange={e => { setSearch(e.target.value); setPage(1); }}
            placeholder="Search by name or email..." className="input-dark pl-10 !py-2 text-sm" />
        </div>
        <select value={filterActive} onChange={e => { setFilterActive(e.target.value); setPage(1); }}
          className="bg-dark-700 border border-white/10 text-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-primary-500">
          <option value="">All Users</option>
          <option value="true">Active</option>
          <option value="false">Suspended</option>
        </select>
      </div>

      {/* Users Table */}
      {loading ? <LoadingSpinner /> : users.length === 0 ? (
        <EmptyState icon="👥" title="No users found" description="No citizens match your search." />
      ) : (
        <>
          <div className="glass-card rounded-2xl overflow-hidden">
            <div className="overflow-x-auto">
              <table className="table-dark">
                <thead>
                  <tr>
                    <th>Citizen</th><th>Phone</th><th>Status</th><th>Verified</th><th>Last Login</th><th>Joined</th><th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {users.map(u => (
                    <tr key={u._id}>
                      <td>
                        <div className="flex items-center gap-3">
                          <div className="w-9 h-9 rounded-full bg-gradient-to-br from-primary-600 to-primary-400 flex items-center justify-center text-white font-bold text-sm flex-shrink-0">
                            {u.name?.charAt(0)?.toUpperCase()}
                          </div>
                          <div>
                            <p className="text-white font-medium text-sm">{u.name}</p>
                            <p className="text-gray-500 text-xs">{u.email}</p>
                          </div>
                        </div>
                      </td>
                      <td><span className="text-gray-400 text-sm">{u.phone || '—'}</span></td>
                      <td>
                        <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-semibold ${u.isActive ? 'bg-green-500/20 text-green-400' : 'bg-red-500/20 text-red-400'}`}>
                          {u.isActive ? '● Active' : '● Suspended'}
                        </span>
                      </td>
                      <td>
                        <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-semibold ${u.isVerified ? 'bg-blue-500/20 text-blue-400' : 'bg-gray-500/20 text-gray-400'}`}>
                          {u.isVerified ? '✓ Yes' : '✗ No'}
                        </span>
                      </td>
                      <td><span className="text-gray-400 text-xs">{u.lastLogin ? format(new Date(u.lastLogin), 'dd MMM yyyy') : 'Never'}</span></td>
                      <td><span className="text-gray-400 text-xs">{format(new Date(u.createdAt), 'dd MMM yyyy')}</span></td>
                      <td>
                        <div className="flex items-center gap-2">
                          <button onClick={() => toggleUser(u._id, u.name, u.isActive)}
                            className={`p-2 rounded-lg transition-colors ${u.isActive ? 'bg-yellow-500/20 text-yellow-400 hover:bg-yellow-500/30' : 'bg-green-500/20 text-green-400 hover:bg-green-500/30'}`}
                            title={u.isActive ? 'Suspend' : 'Activate'}>
                            {u.isActive ? <ShieldOff className="w-4 h-4" /> : <Shield className="w-4 h-4" />}
                          </button>
                          <button onClick={() => deleteUser(u._id, u.name)}
                            className="p-2 rounded-lg bg-red-500/20 text-red-400 hover:bg-red-500/30 transition-colors">
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
