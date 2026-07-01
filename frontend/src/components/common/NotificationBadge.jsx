import React, { useEffect, useState } from 'react';
import { notificationAPI } from '../../services/api';

export default function NotificationBadge() {
  const [count, setCount] = useState(0);

  useEffect(() => {
    const fetch = async () => {
      try {
        const { data } = await notificationAPI.getAll();
        setCount(data.unreadCount || 0);
      } catch {}
    };
    fetch();
    const interval = setInterval(fetch, 30000);
    return () => clearInterval(interval);
  }, []);

  if (!count) return null;
  return (
    <span className="bg-red-500 text-white text-xs font-bold rounded-full min-w-[18px] h-[18px] flex items-center justify-center px-1">
      {count > 99 ? '99+' : count}
    </span>
  );
}
