import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { complaintAPI, adminAPI } from '../../services/api';
import { StatusBadge, PriorityBadge } from '../../components/common/Badges';
import LoadingSpinner from '../../components/common/Loading';
import { ArrowLeft, MapPin, Clock, MessageSquare, User, Edit3, Send, Check } from 'lucide-react';
import { format } from 'date-fns';
import toast from 'react-hot-toast';
import { useForm } from 'react-hook-form';

const STATUSES = ['pending', 'verified', 'assigned', 'in_progress', 'resolved', 'rejected', 'closed'];
const DEPARTMENTS = ['Public Works', 'Sanitation', 'Water Board', 'Electricity Board', 'Traffic Police', 'Environment', 'Municipal', 'General'];

export default function AdminComplaintDetail() {
  const { id } = useParams();
  const [complaint, setComplaint] = useState(null);
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(false);
  const [showUpdate, setShowUpdate] = useState(false);
  const [comment, setComment] = useState('');
  const { register, handleSubmit, watch, reset } = useForm();

  const load = async () => {
    try {
      const { data } = await complaintAPI.getComplaint(id);
      setComplaint(data.complaint);
    } catch { toast.error('Failed to load'); }
    finally { setLoading(false); }
  };

  useEffect(() => { load(); }, [id]);

  const onUpdateStatus = async (data) => {
    setUpdating(true);
    try {
      await adminAPI.updateStatus(id, {
        status: data.status, remark: data.remark, assignedDepartment: data.assignedDepartment,
        resolutionProgress: Number(data.resolutionProgress), rejectionReason: data.rejectionReason,
        internalNotes: data.internalNotes
      });
      toast.success('Status updated successfully!');
      setShowUpdate(false);
      load();
    } catch { toast.error('Update failed'); }
    finally { setUpdating(false); }
  };

  const addComment = async () => {
    if (!comment.trim()) return;
    try {
      const { data } = await complaintAPI.addComment(id, comment);
      setComplaint(data.complaint);
      setComment('');
      toast.success('Comment added');
    } catch { toast.error('Failed'); }
  };

  if (loading) return <LoadingSpinner />;
  if (!complaint) return <div className="text-gray-400 text-center py-20">Complaint not found</div>;

  return (
    <div className="max-w-5xl mx-auto space-y-6 animate-fade-in">
      <div className="flex items-center justify-between">
        <Link to="/admin/complaints" className="flex items-center gap-2 text-gray-400 hover:text-white transition-colors">
          <ArrowLeft className="w-4 h-4" /> Back
        </Link>
        <button onClick={() => setShowUpdate(!showUpdate)} className="btn-primary flex items-center gap-2">
          <Edit3 className="w-4 h-4" /> Update Status
        </button>
      </div>

      {/* Status Update Panel */}
      {showUpdate && (
        <div className="glass-card rounded-2xl p-6 border border-primary-500/30 animate-slide-up">
          <h3 className="text-white font-bold text-lg mb-4">Update Complaint Status</h3>
          <form onSubmit={handleSubmit(onUpdateStatus)} className="space-y-4">
            <div className="grid sm:grid-cols-2 gap-4">
              <div>
                <label className="text-gray-400 text-sm mb-1 block">New Status *</label>
                <select {...register('status', { required: true })} className="input-dark">
                  {STATUSES.map(s => <option key={s} value={s}>{s.replace('_', ' ').toUpperCase()}</option>)}
                </select>
              </div>
              <div>
                <label className="text-gray-400 text-sm mb-1 block">Assigned Department</label>
                <select {...register('assignedDepartment')} className="input-dark">
                  <option value="">Select department</option>
                  {DEPARTMENTS.map(d => <option key={d} value={d}>{d}</option>)}
                </select>
              </div>
              <div>
                <label className="text-gray-400 text-sm mb-1 block">Resolution Progress (%)</label>
                <input {...register('resolutionProgress')} type="number" min="0" max="100" defaultValue={complaint.resolutionProgress} className="input-dark" />
              </div>
              <div>
                <label className="text-gray-400 text-sm mb-1 block">Remark for Citizen</label>
                <input {...register('remark')} placeholder="Status update remark..." className="input-dark" />
              </div>
            </div>
            {watch('status') === 'rejected' && (
              <div>
                <label className="text-gray-400 text-sm mb-1 block">Rejection Reason *</label>
                <input {...register('rejectionReason')} placeholder="Why is this being rejected?" className="input-dark" />
              </div>
            )}
            <div>
              <label className="text-gray-400 text-sm mb-1 block">Internal Notes (Admin only)</label>
              <textarea {...register('internalNotes')} rows={2} placeholder="Private notes..." className="input-dark resize-none" />
            </div>
            <div className="flex gap-3">
              <button type="submit" disabled={updating} className="btn-primary flex items-center gap-2">
                {updating ? <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" /> : <><Check className="w-4 h-4" /> Update</>}
              </button>
              <button type="button" onClick={() => setShowUpdate(false)} className="btn-secondary">Cancel</button>
            </div>
          </form>
        </div>
      )}

      {/* Header */}
      <div className="glass-card rounded-2xl p-6">
        <div className="flex flex-col sm:flex-row gap-4 justify-between">
          <div>
            <div className="flex items-center gap-2 mb-2 flex-wrap">
              <span className="text-primary-400 font-mono font-bold">{complaint.complaintId}</span>
              <StatusBadge status={complaint.status} />
              <PriorityBadge priority={complaint.priority} />
              {complaint.isEmergency && <span className="px-2 py-1 rounded-full bg-red-500/20 text-red-400 text-xs font-semibold border border-red-500/30 animate-pulse">🚨 EMERGENCY</span>}
            </div>
            <h1 className="text-2xl font-bold text-white">{complaint.title}</h1>
            <p className="text-gray-400 text-sm mt-1 flex items-center gap-2">
              <Clock className="w-4 h-4" /> {format(new Date(complaint.createdAt), 'dd MMMM yyyy, hh:mm a')}
            </p>
          </div>
        </div>
        <div className="mt-4 grid sm:grid-cols-3 gap-4">
          {complaint.resolutionProgress > 0 && (
            <div className="sm:col-span-3">
              <div className="flex justify-between text-xs text-gray-400 mb-1"><span>Resolution Progress</span><span>{complaint.resolutionProgress}%</span></div>
              <div className="progress-bar h-3"><div className="progress-fill bg-gradient-to-r from-primary-700 to-primary-400" style={{ width: `${complaint.resolutionProgress}%` }}></div></div>
            </div>
          )}
        </div>
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          {/* Citizen Info */}
          <div className="glass-card rounded-2xl p-6">
            <h2 className="text-white font-semibold text-lg mb-4 flex items-center gap-2"><User className="w-5 h-5 text-primary-400" /> Citizen Information</h2>
            <div className="grid sm:grid-cols-2 gap-4">
              {[{ l: 'Name', v: complaint.citizen?.name }, { l: 'Email', v: complaint.citizen?.email }, { l: 'Phone', v: complaint.citizen?.phone || 'N/A' }, { l: 'Category', v: complaint.category }].map(({ l, v }) => (
                <div key={l}><p className="text-gray-500 text-xs uppercase tracking-wider mb-1">{l}</p><p className="text-white font-medium">{v}</p></div>
              ))}
            </div>
          </div>

          {/* Description */}
          <div className="glass-card rounded-2xl p-6">
            <h2 className="text-white font-semibold text-lg mb-4">Complaint Description</h2>
            <p className="text-gray-300 leading-relaxed">{complaint.description}</p>
            {complaint.assignedDepartment && (
              <div className="mt-4 p-3 rounded-xl bg-primary-500/10 border border-primary-500/20">
                <p className="text-primary-300 text-sm">🏢 Assigned to: <strong>{complaint.assignedDepartment}</strong></p>
              </div>
            )}
            {complaint.internalNotes && (
              <div className="mt-4 p-3 rounded-xl bg-yellow-500/10 border border-yellow-500/20">
                <p className="text-yellow-300 text-xs font-semibold mb-1">🔒 INTERNAL NOTES</p>
                <p className="text-yellow-100 text-sm">{complaint.internalNotes}</p>
              </div>
            )}
            {complaint.rejectionReason && (
              <div className="mt-4 p-3 rounded-xl bg-red-500/10 border border-red-500/20">
                <p className="text-red-400 text-xs font-semibold mb-1">❌ REJECTION REASON</p>
                <p className="text-red-300 text-sm">{complaint.rejectionReason}</p>
              </div>
            )}
          </div>

          {/* Location */}
          <div className="glass-card rounded-2xl p-6">
            <h2 className="text-white font-semibold text-lg mb-4 flex items-center gap-2"><MapPin className="w-5 h-5 text-primary-400" /> Location</h2>
            <p className="text-gray-300">{complaint.address?.fullAddress || 'Location not specified'}</p>
          </div>

          {/* Images */}
          {complaint.images?.length > 0 && (
            <div className="glass-card rounded-2xl p-6">
              <h2 className="text-white font-semibold text-lg mb-4">Evidence Images</h2>
              <div className="grid grid-cols-3 gap-3">
                {complaint.images.map((img, i) => (
                  <a href={img.url} target="_blank" rel="noopener noreferrer" key={i}>
                    <img src={img.url} alt="Evidence" className="w-full h-32 object-cover rounded-xl hover:scale-105 transition-transform" />
                  </a>
                ))}
              </div>
            </div>
          )}

          {/* Comments */}
          <div className="glass-card rounded-2xl p-6">
            <h2 className="text-white font-semibold text-lg mb-4 flex items-center gap-2"><MessageSquare className="w-5 h-5 text-primary-400" /> Comments</h2>
            <div className="space-y-3 mb-4 max-h-60 overflow-y-auto">
              {complaint.comments?.map((c, i) => (
                <div key={i} className={`p-3 rounded-xl ${c.userRole === 'admin' ? 'bg-purple-500/10 border border-purple-500/20' : 'bg-white/3'}`}>
                  <div className="flex justify-between mb-1">
                    <span className={`text-sm font-semibold ${c.userRole === 'admin' ? 'text-purple-400' : 'text-primary-400'}`}>{c.userName} {c.userRole === 'admin' && '(Admin)'}</span>
                    <span className="text-gray-600 text-xs">{format(new Date(c.createdAt), 'dd MMM, hh:mm a')}</span>
                  </div>
                  <p className="text-gray-300 text-sm">{c.text}</p>
                </div>
              ))}
            </div>
            <div className="flex gap-2">
              <input value={comment} onChange={e => setComment(e.target.value)} placeholder="Add admin comment..."
                className="input-dark flex-1" onKeyDown={e => e.key === 'Enter' && addComment()} />
              <button onClick={addComment} className="btn-primary !px-4 !py-3"><Send className="w-4 h-4" /></button>
            </div>
          </div>
        </div>

        {/* Timeline */}
        <div className="glass-card rounded-2xl p-6 h-fit">
          <h2 className="text-white font-semibold text-lg mb-6 flex items-center gap-2"><Clock className="w-5 h-5 text-primary-400" /> Status History</h2>
          <div className="space-y-0">
            {complaint.statusHistory?.map((h, i) => (
              <div key={i} className="relative flex gap-3 pb-5 last:pb-0">
                {i !== complaint.statusHistory.length - 1 && <div className="absolute left-[6px] top-4 bottom-0 w-0.5 bg-white/10"></div>}
                <div className="w-3.5 h-3.5 rounded-full bg-primary-500 ring-4 ring-dark-800 flex-shrink-0 mt-1"></div>
                <div>
                  <p className="text-white text-sm font-semibold capitalize">{h.status?.replace('_', ' ')}</p>
                  <p className="text-gray-500 text-xs">{h.updatedByName || 'System'}</p>
                  {h.remark && <p className="text-gray-400 text-xs mt-1 bg-white/3 px-2 py-1 rounded">{h.remark}</p>}
                  <p className="text-gray-600 text-xs mt-1">{format(new Date(h.timestamp), 'dd MMM, hh:mm a')}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
