import React from 'react';

export const StatusBadge = ({ status }) => {
  const map = {
    pending: 'status-pending',
    verified: 'status-verified',
    assigned: 'status-assigned',
    in_progress: 'status-in_progress',
    resolved: 'status-resolved',
    rejected: 'status-rejected',
    closed: 'status-closed',
  };
  const labels = {
    pending: '⏳ Pending', verified: '✅ Verified', assigned: '👤 Assigned',
    in_progress: '🔧 In Progress', resolved: '✔️ Resolved', rejected: '❌ Rejected', closed: '🔒 Closed'
  };
  return (
    <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold ${map[status] || 'bg-gray-500/20 text-gray-400'}`}>
      {labels[status] || status}
    </span>
  );
};

export const PriorityBadge = ({ priority }) => {
  const map = { low: 'priority-low', medium: 'priority-medium', high: 'priority-high', emergency: 'priority-emergency' };
  const icons = { low: '🟢', medium: '🟡', high: '🟠', emergency: '🔴' };
  return (
    <span className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold ${map[priority] || ''}`}>
      {icons[priority]} {priority?.charAt(0).toUpperCase() + priority?.slice(1)}
    </span>
  );
};
