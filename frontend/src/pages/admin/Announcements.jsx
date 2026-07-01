import React, { useEffect, useState } from 'react';
import { announcementAPI } from '../../services/api';
import { Megaphone, Plus, Edit2, Trash2, Pin, X, Check } from 'lucide-react';
import toast from 'react-hot-toast';
import LoadingSpinner from '../../components/common/Loading';
import { useForm } from 'react-hook-form';
import { format } from 'date-fns';

const TYPE_CONFIG = {
  info: { label: 'Info', color: 'bg-blue-500/20 text-blue-400 border-blue-500/30', icon: 'ℹ️' },
  warning: { label: 'Warning', color: 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30', icon: '⚠️' },
  success: { label: 'Success', color: 'bg-green-500/20 text-green-400 border-green-500/30', icon: '✅' },
  urgent: { label: 'Urgent', color: 'bg-red-500/20 text-red-400 border-red-500/30', icon: '🚨' },
};

export default function AdminAnnouncements() {
  const [announcements, setAnnouncements] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editing, setEditing] = useState(null);
  const { register, handleSubmit, reset, setValue } = useForm({ defaultValues: { type: 'info', isPinned: false, isActive: true } });

  const load = async () => {
    try {
      const { data } = await announcementAPI.getAll();
      setAnnouncements(data.announcements);
    } catch { toast.error('Failed to load'); }
    finally { setLoading(false); }
  };

  useEffect(() => { load(); }, []);

  const onSubmit = async (data) => {
    try {
      if (editing) {
        await announcementAPI.update(editing._id, data);
        toast.success('Announcement updated');
      } else {
        await announcementAPI.create(data);
        toast.success('Announcement created');
      }
      setShowForm(false); setEditing(null); reset(); load();
    } catch (err) { toast.error(err.response?.data?.message || 'Failed'); }
  };

  const deleteAnn = async (id) => {
    if (!confirm('Delete this announcement?')) return;
    try { await announcementAPI.delete(id); toast.success('Deleted'); load(); }
    catch { toast.error('Failed'); }
  };

  const startEdit = (ann) => {
    setEditing(ann);
    Object.keys(ann).forEach(k => setValue(k, ann[k]));
    setShowForm(true);
  };

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white flex items-center gap-2">
            <Megaphone className="w-6 h-6 text-yellow-400" /> Announcements
          </h1>
          <p className="text-gray-400 text-sm mt-1">Manage public announcements for citizens</p>
        </div>
        <button onClick={() => { setEditing(null); reset(); setShowForm(true); }} className="btn-primary flex items-center gap-2">
          <Plus className="w-4 h-4" /> New Announcement
        </button>
      </div>

      {/* Form */}
      {showForm && (
        <div className="glass-card rounded-2xl p-6 border border-yellow-500/20 animate-slide-up">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-white font-bold text-lg">{editing ? 'Edit Announcement' : 'Create Announcement'}</h3>
            <button onClick={() => { setShowForm(false); setEditing(null); reset(); }}><X className="w-5 h-5 text-gray-400 hover:text-white" /></button>
          </div>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <div>
              <label className="text-gray-400 text-sm mb-1 block">Title *</label>
              <input {...register('title', { required: true })} placeholder="Announcement title" className="input-dark" />
            </div>
            <div>
              <label className="text-gray-400 text-sm mb-1 block">Content *</label>
              <textarea {...register('content', { required: true })} rows={4} placeholder="Announcement content..." className="input-dark resize-none" />
            </div>
            <div className="grid sm:grid-cols-3 gap-4">
              <div>
                <label className="text-gray-400 text-sm mb-1 block">Type</label>
                <select {...register('type')} className="input-dark">
                  {Object.entries(TYPE_CONFIG).map(([k, v]) => <option key={k} value={k}>{v.icon} {v.label}</option>)}
                </select>
              </div>
              <div className="flex items-center gap-3 mt-6">
                <input {...register('isPinned')} type="checkbox" id="pinned" className="w-4 h-4 rounded accent-primary-500" />
                <label htmlFor="pinned" className="text-gray-300 text-sm cursor-pointer">📌 Pin to top</label>
              </div>
              <div>
                <label className="text-gray-400 text-sm mb-1 block">Expires At (optional)</label>
                <input {...register('expiresAt')} type="datetime-local" className="input-dark" />
              </div>
            </div>
            <div className="flex gap-3">
              <button type="submit" className="btn-primary flex items-center gap-2"><Check className="w-4 h-4" />{editing ? 'Update' : 'Publish'}</button>
              <button type="button" onClick={() => { setShowForm(false); setEditing(null); reset(); }} className="btn-secondary">Cancel</button>
            </div>
          </form>
        </div>
      )}

      {/* Announcements List */}
      {loading ? <LoadingSpinner /> : (
        <div className="space-y-4">
          {announcements.length === 0 && (
            <div className="text-center py-16"><div className="text-5xl mb-4">📢</div><p className="text-gray-400">No announcements yet. Create one!</p></div>
          )}
          {announcements.map(ann => {
            const cfg = TYPE_CONFIG[ann.type] || TYPE_CONFIG.info;
            return (
              <div key={ann._id} className={`glass-card rounded-2xl p-6 border ${cfg.color.includes('border') ? cfg.color : ''} ${ann.isPinned ? 'border-yellow-500/30' : ''}`}>
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2 flex-wrap">
                      {ann.isPinned && <span className="text-xs bg-yellow-500/20 text-yellow-400 border border-yellow-500/30 px-2 py-0.5 rounded-full">📌 Pinned</span>}
                      <span className={`text-xs border px-2 py-0.5 rounded-full ${cfg.color}`}>{cfg.icon} {cfg.label}</span>
                      {!ann.isActive && <span className="text-xs bg-gray-500/20 text-gray-400 px-2 py-0.5 rounded-full">Inactive</span>}
                    </div>
                    <h3 className="text-white font-bold text-lg mb-1">{ann.title}</h3>
                    <p className="text-gray-300 text-sm leading-relaxed">{ann.content}</p>
                    <p className="text-gray-500 text-xs mt-3">Published: {format(new Date(ann.createdAt), 'dd MMM yyyy, hh:mm a')}</p>
                  </div>
                  <div className="flex gap-2 flex-shrink-0">
                    <button onClick={() => startEdit(ann)} className="p-2 rounded-lg text-primary-400 hover:bg-primary-500/20 transition-colors">
                      <Edit2 className="w-4 h-4" />
                    </button>
                    <button onClick={() => deleteAnn(ann._id)} className="p-2 rounded-lg text-red-400 hover:bg-red-500/20 transition-colors">
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
