import React, { useEffect, useState } from 'react';
import { notificationAPI } from '../../services/api';
import { Bell, CheckCheck, Trash2, BellOff } from 'lucide-react';
import { format } from 'date-fns';
import toast from 'react-hot-toast';
import LoadingSpinner, { EmptyState } from '../../components/common/Loading';

const notifIcons = {
  complaint_accepted: '✅', complaint_rejected: '❌', complaint_assigned: '👤',
  work_started: '🔧', work_completed: '✔️', complaint_closed: '🔒', general: '📣'
};

export default function CitizenNotifications() {
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);

  const load = async () => {
    try {
      const { data } = await notificationAPI.getAll();
      setNotifications(data.notifications);
    } catch { toast.error('Failed to load notifications'); }
    finally { setLoading(false); }
  };

  useEffect(() => { load(); }, []);

  const markRead = async (id) => {
    await notificationAPI.markRead(id);
    setNotifications(prev => prev.map(n => n._id === id ? { ...n, isRead: true } : n));
  };

  const markAllRead = async () => {
    await notificationAPI.markAllRead();
    setNotifications(prev => prev.map(n => ({ ...n, isRead: true })));
    toast.success('All marked as read');
  };

  const deleteNotif = async (id) => {
    await notificationAPI.delete(id);
    setNotifications(prev => prev.filter(n => n._id !== id));
    toast.success('Notification deleted');
  };

  const unread = notifications.filter(n => !n.isRead).length;

  return (
    <div className="max-w-3xl mx-auto space-y-6 animate-fade-in">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white flex items-center gap-2"><Bell className="w-6 h-6 text-yellow-400" /> Notifications</h1>
          <p className="text-gray-400 text-sm mt-1">{unread} unread notifications</p>
        </div>
        {unread > 0 && (
          <button onClick={markAllRead} className="btn-secondary flex items-center gap-2 text-sm">
            <CheckCheck className="w-4 h-4" /> Mark All Read
          </button>
        )}
      </div>

      {loading ? <LoadingSpinner /> : notifications.length === 0 ? (
        <EmptyState icon="🔔" title="No Notifications" description="You'll receive notifications about your complaint updates here." />
      ) : (
        <div className="space-y-3">
          {notifications.map((n) => (
            <div key={n._id} onClick={() => !n.isRead && markRead(n._id)}
              className={`glass-card rounded-xl p-4 flex items-start gap-4 cursor-pointer transition-all duration-200 hover:border-primary-500/20 ${!n.isRead ? 'border-primary-500/30 bg-primary-500/5' : ''}`}>
              <span className="text-2xl flex-shrink-0 mt-0.5">{notifIcons[n.type] || '📣'}</span>
              <div className="flex-1 min-w-0">
                <p className={`font-semibold text-sm ${!n.isRead ? 'text-white' : 'text-gray-300'}`}>{n.title}</p>
                <p className="text-gray-400 text-sm mt-0.5">{n.message}</p>
                <p className="text-gray-600 text-xs mt-1">{format(new Date(n.createdAt), 'dd MMM yyyy, hh:mm a')}</p>
              </div>
              <div className="flex items-center gap-2 flex-shrink-0">
                {!n.isRead && <div className="w-2 h-2 rounded-full bg-primary-500"></div>}
                <button onClick={(e) => { e.stopPropagation(); deleteNotif(n._id); }}
                  className="text-gray-600 hover:text-red-400 transition-colors p-1">
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
