import React, { useEffect, useState } from 'react';
import { feedbackAPI } from '../../services/api';
import { Star, MessageSquare } from 'lucide-react';
import { format } from 'date-fns';
import toast from 'react-hot-toast';
import LoadingSpinner, { EmptyState } from '../../components/common/Loading';

const StarRating = ({ rating }) => (
  <div className="flex gap-0.5">
    {[1, 2, 3, 4, 5].map(i => (
      <span key={i} className={`text-lg ${i <= rating ? 'text-yellow-400' : 'text-gray-600'}`}>⭐</span>
    ))}
  </div>
);

export default function AdminFeedback() {
  const [feedbacks, setFeedbacks] = useState([]);
  const [avgRating, setAvgRating] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    feedbackAPI.getAll()
      .then(({ data }) => { setFeedbacks(data.feedbacks); setAvgRating(data.avgRating); })
      .catch(() => toast.error('Failed to load feedback'))
      .finally(() => setLoading(false));
  }, []);

  const ratingDist = [5, 4, 3, 2, 1].map(r => ({
    r, count: feedbacks.filter(f => f.rating === r).length,
    pct: feedbacks.length ? Math.round(feedbacks.filter(f => f.rating === r).length / feedbacks.length * 100) : 0
  }));

  return (
    <div className="space-y-6 animate-fade-in">
      <div>
        <h1 className="text-2xl font-bold text-white flex items-center gap-2">
          <Star className="w-6 h-6 text-yellow-400" /> Citizen Feedback
        </h1>
        <p className="text-gray-400 text-sm mt-1">Service satisfaction ratings from citizens</p>
      </div>

      {loading ? <LoadingSpinner /> : (
        <>
          {/* Summary */}
          <div className="grid sm:grid-cols-3 gap-4">
            <div className="glass-card rounded-2xl p-6 text-center">
              <p className="text-6xl font-black text-white mb-1">{avgRating}</p>
              <StarRating rating={Math.round(Number(avgRating))} />
              <p className="text-gray-400 text-sm mt-2">Average Rating</p>
            </div>
            <div className="glass-card rounded-2xl p-6">
              <p className="text-gray-400 text-sm font-medium mb-4">Rating Distribution</p>
              <div className="space-y-2">
                {ratingDist.map(({ r, count, pct }) => (
                  <div key={r} className="flex items-center gap-2">
                    <span className="text-yellow-400 text-xs w-4">{r}⭐</span>
                    <div className="flex-1 h-2 bg-dark-600 rounded-full overflow-hidden">
                      <div className="h-full bg-yellow-400 rounded-full transition-all duration-500" style={{ width: `${pct}%` }}></div>
                    </div>
                    <span className="text-gray-500 text-xs w-8">{count}</span>
                  </div>
                ))}
              </div>
            </div>
            <div className="glass-card rounded-2xl p-6 flex flex-col justify-center items-center">
              <p className="text-5xl font-black text-white">{feedbacks.length}</p>
              <p className="text-gray-400 text-sm mt-2">Total Ratings</p>
              <p className="text-gray-500 text-xs mt-1">{feedbacks.filter(f => f.issueStillExists).length} reported issue still exists</p>
            </div>
          </div>

          {/* Feedback List */}
          {feedbacks.length === 0 ? (
            <EmptyState icon="⭐" title="No feedback yet" description="Feedback will appear here once citizens rate resolved complaints." />
          ) : (
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {feedbacks.map(f => (
                <div key={f._id} className="glass-card rounded-2xl p-5 hover:border-yellow-500/20 transition-all duration-200">
                  <div className="flex items-center justify-between mb-3">
                    <StarRating rating={f.rating} />
                    {f.issueStillExists && <span className="text-xs bg-red-500/20 text-red-400 border border-red-500/30 px-2 py-0.5 rounded-full">Issue Exists</span>}
                  </div>
                  {f.comment && (
                    <div className="flex items-start gap-2 mb-3">
                      <MessageSquare className="w-4 h-4 text-gray-500 flex-shrink-0 mt-0.5" />
                      <p className="text-gray-300 text-sm italic">"{f.comment}"</p>
                    </div>
                  )}
                  <div className="border-t border-white/5 pt-3 mt-2">
                    <p className="text-white text-sm font-medium">{f.citizen?.name}</p>
                    <p className="text-gray-500 text-xs">{f.citizen?.email}</p>
                    {f.complaint && <p className="text-primary-400 text-xs mt-1 font-mono">{f.complaint?.complaintId}</p>}
                    <p className="text-gray-600 text-xs mt-1">{format(new Date(f.createdAt), 'dd MMM yyyy')}</p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </>
      )}
    </div>
  );
}
