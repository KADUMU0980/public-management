import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { complaintAPI, feedbackAPI } from '../../services/api';
import { StatusBadge, PriorityBadge } from '../../components/common/Badges';
import LoadingSpinner from '../../components/common/Loading';
import { useAuth } from '../../context/AuthContext';
import { ArrowLeft, MapPin, Clock, MessageSquare, Star, Send } from 'lucide-react';
import { format } from 'date-fns';
import toast from 'react-hot-toast';

const TimelineStep = ({ history }) => {
  const statusColors = {
    pending: 'bg-yellow-400', verified: 'bg-blue-400', assigned: 'bg-purple-400',
    in_progress: 'bg-orange-400', resolved: 'bg-green-400', rejected: 'bg-red-400', closed: 'bg-gray-400'
  };

  return (
    <div className="space-y-0">
      {history.map((h, i) => (
        <div key={i} className="relative flex gap-4 pb-6 last:pb-0">
          {i !== history.length - 1 && <div className="absolute left-[7px] top-4 bottom-0 w-0.5 bg-white/10"></div>}
          <div className={`w-3.5 h-3.5 rounded-full mt-1.5 flex-shrink-0 ring-4 ring-dark-800 ${statusColors[h.status] || 'bg-gray-400'}`}></div>
          <div>
            <div className="flex items-center gap-2 flex-wrap">
              <span className="text-white font-semibold capitalize">{h.status?.replace('_', ' ')}</span>
              <span className="text-gray-500 text-xs">{h.updatedByName || 'System'}</span>
            </div>
            {h.remark && <p className="text-gray-400 text-sm mt-1 bg-white/3 px-3 py-2 rounded-lg">{h.remark}</p>}
            <p className="text-gray-600 text-xs mt-1">{format(new Date(h.timestamp), 'dd MMM yyyy, hh:mm a')}</p>
          </div>
        </div>
      ))}
    </div>
  );
};

export default function ComplaintDetails() {
  const { id } = useParams();
  const { user } = useAuth();
  const [complaint, setComplaint] = useState(null);
  const [loading, setLoading] = useState(true);
  const [comment, setComment] = useState('');
  const [submittingComment, setSubmittingComment] = useState(false);
  const [showFeedback, setShowFeedback] = useState(false);
  const [rating, setRating] = useState(5);
  const [feedbackText, setFeedbackText] = useState('');

  useEffect(() => {
    const load = async () => {
      try {
        const { data } = await complaintAPI.getComplaint(id);
        setComplaint(data.complaint);
      } catch (err) { toast.error('Failed to load complaint'); }
      finally { setLoading(false); }
    };
    load();
  }, [id]);

  const addComment = async () => {
    if (!comment.trim()) return;
    setSubmittingComment(true);
    try {
      const { data } = await complaintAPI.addComment(id, comment);
      setComplaint(data.complaint);
      setComment('');
      toast.success('Comment added');
    } catch { toast.error('Failed to add comment'); }
    finally { setSubmittingComment(false); }
  };

  const submitFeedback = async () => {
    try {
      await feedbackAPI.submit(id, { rating, comment: feedbackText });
      toast.success('Thank you for your feedback! ⭐');
      setShowFeedback(false);
      setComplaint(c => ({ ...c, feedbackGiven: true }));
    } catch { toast.error('Failed to submit feedback'); }
  };

  if (loading) return <LoadingSpinner />;
  if (!complaint) return <div className="text-center text-gray-400 py-20">Complaint not found</div>;

  return (
    <div className="max-w-4xl mx-auto space-y-6 animate-fade-in">
      {/* Back */}
      <Link to="/citizen/my-complaints" className="flex items-center gap-2 text-gray-400 hover:text-white transition-colors w-fit">
        <ArrowLeft className="w-4 h-4" /> Back to My Complaints
      </Link>

      {/* Header */}
      <div className="glass-card rounded-2xl p-6">
        <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-2 flex-wrap">
              <span className="text-primary-400 font-mono font-bold">{complaint.complaintId}</span>
              <StatusBadge status={complaint.status} />
              <PriorityBadge priority={complaint.priority} />
            </div>
            <h1 className="text-2xl font-bold text-white">{complaint.title}</h1>
            <div className="flex items-center gap-2 mt-2 text-gray-400 text-sm flex-wrap">
              <Clock className="w-4 h-4" />
              <span>Submitted on {format(new Date(complaint.createdAt), 'dd MMMM yyyy, hh:mm a')}</span>
            </div>
          </div>
          {complaint.status === 'resolved' && !complaint.feedbackGiven && (
            <button onClick={() => setShowFeedback(true)} className="btn-primary flex items-center gap-2 text-sm self-start">
              <Star className="w-4 h-4" /> Give Feedback
            </button>
          )}
        </div>

        {/* Progress */}
        <div className="mt-6">
          <div className="flex justify-between text-xs text-gray-400 mb-2">
            <span>Resolution Progress</span><span>{complaint.resolutionProgress}%</span>
          </div>
          <div className="progress-bar h-3">
            <div className="progress-fill bg-gradient-to-r from-primary-700 to-primary-400" style={{ width: `${complaint.resolutionProgress}%` }}></div>
          </div>
        </div>
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        {/* Main info */}
        <div className="lg:col-span-2 space-y-6">
          {/* Details */}
          <div className="glass-card rounded-2xl p-6">
            <h2 className="text-white font-semibold mb-4 text-lg">Complaint Details</h2>
            <div className="space-y-4">
              <div>
                <p className="text-gray-500 text-xs font-medium uppercase tracking-wider mb-1">Description</p>
                <p className="text-gray-300">{complaint.description}</p>
              </div>
              <div className="grid sm:grid-cols-2 gap-4">
                <div>
                  <p className="text-gray-500 text-xs font-medium uppercase tracking-wider mb-1">Category</p>
                  <p className="text-white">{complaint.category}</p>
                </div>
                {complaint.assignedDepartment && (
                  <div>
                    <p className="text-gray-500 text-xs font-medium uppercase tracking-wider mb-1">Assigned Department</p>
                    <p className="text-white">{complaint.assignedDepartment}</p>
                  </div>
                )}
                <div>
                  <p className="text-gray-500 text-xs font-medium uppercase tracking-wider mb-1">Location</p>
                  <p className="text-gray-300 flex items-center gap-1">
                    <MapPin className="w-4 h-4 text-primary-400" /> {complaint.address?.fullAddress || 'Not specified'}
                  </p>
                </div>
              </div>
              {complaint.rejectionReason && (
                <div className="p-3 rounded-xl bg-red-500/10 border border-red-500/20">
                  <p className="text-red-400 text-sm font-semibold">Rejection Reason:</p>
                  <p className="text-red-300 text-sm mt-1">{complaint.rejectionReason}</p>
                </div>
              )}
            </div>
          </div>

          {/* Images */}
          {complaint.images?.length > 0 && (
            <div className="glass-card rounded-2xl p-6">
              <h2 className="text-white font-semibold mb-4 text-lg">Evidence Images</h2>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                {complaint.images.map((img, i) => (
                  <a href={img.url} target="_blank" rel="noopener noreferrer" key={i}>
                    <img src={img.url} alt={`Evidence ${i + 1}`} className="w-full h-40 object-cover rounded-xl hover:scale-105 transition-transform duration-200" />
                  </a>
                ))}
              </div>
            </div>
          )}

          {/* Comments */}
          <div className="glass-card rounded-2xl p-6">
            <h2 className="text-white font-semibold mb-4 text-lg flex items-center gap-2">
              <MessageSquare className="w-5 h-5 text-primary-400" /> Comments ({complaint.comments?.length || 0})
            </h2>
            <div className="space-y-3 mb-4">
              {complaint.comments?.length === 0 && <p className="text-gray-500 text-sm">No comments yet.</p>}
              {complaint.comments?.map((c, i) => (
                <div key={i} className={`p-4 rounded-xl ${c.userRole === 'admin' ? 'bg-purple-500/10 border border-purple-500/20' : 'bg-white/3'}`}>
                  <div className="flex items-center gap-2 mb-1">
                    <span className={`text-sm font-semibold ${c.userRole === 'admin' ? 'text-purple-400' : 'text-primary-400'}`}>{c.userName}</span>
                    {c.userRole === 'admin' && <span className="text-xs bg-purple-500/20 text-purple-300 px-2 py-0.5 rounded-full">Admin</span>}
                    <span className="text-gray-600 text-xs ml-auto">{format(new Date(c.createdAt), 'dd MMM, hh:mm a')}</span>
                  </div>
                  <p className="text-gray-300 text-sm">{c.text}</p>
                </div>
              ))}
            </div>
            <div className="flex gap-2">
              <input value={comment} onChange={e => setComment(e.target.value)} placeholder="Add a comment..."
                className="input-dark flex-1" onKeyDown={e => e.key === 'Enter' && addComment()} />
              <button onClick={addComment} disabled={submittingComment || !comment.trim()} className="btn-primary !px-4 !py-3">
                <Send className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>

        {/* Timeline */}
        <div className="glass-card rounded-2xl p-6 h-fit">
          <h2 className="text-white font-semibold mb-6 text-lg flex items-center gap-2">
            <Clock className="w-5 h-5 text-primary-400" /> Status Timeline
          </h2>
          {complaint.statusHistory?.length > 0 ? (
            <TimelineStep history={complaint.statusHistory} />
          ) : (
            <p className="text-gray-500 text-sm">No history yet</p>
          )}
        </div>
      </div>

      {/* Feedback Modal */}
      {showFeedback && (
        <div className="modal-overlay" onClick={() => setShowFeedback(false)}>
          <div className="glass-card rounded-2xl p-8 max-w-md w-full" onClick={e => e.stopPropagation()}>
            <h3 className="text-white text-xl font-bold mb-2">Rate the Service</h3>
            <p className="text-gray-400 text-sm mb-6">How satisfied are you with the resolution?</p>
            <div className="flex gap-2 justify-center mb-6">
              {[1, 2, 3, 4, 5].map(r => (
                <button key={r} onClick={() => setRating(r)}
                  className={`text-3xl transition-transform hover:scale-125 ${r <= rating ? 'text-yellow-400' : 'text-gray-600'}`}>
                  ⭐
                </button>
              ))}
            </div>
            <textarea value={feedbackText} onChange={e => setFeedbackText(e.target.value)}
              placeholder="Share your experience..." rows={3} className="input-dark resize-none mb-4" />
            <div className="flex gap-3">
              <button onClick={submitFeedback} className="btn-primary flex-1">Submit Feedback</button>
              <button onClick={() => setShowFeedback(false)} className="btn-secondary flex-1">Cancel</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
