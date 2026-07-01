import React from 'react';

export default function LoadingSpinner({ size = 'md', text = 'Loading...' }) {
  const sizes = { sm: 'w-6 h-6', md: 'w-10 h-10', lg: 'w-16 h-16' };
  return (
    <div className="flex flex-col items-center justify-center py-12 gap-4">
      <div className={`${sizes[size]} border-4 border-primary-500/30 border-t-primary-500 rounded-full animate-spin`}></div>
      {text && <p className="text-gray-400 text-sm animate-pulse">{text}</p>}
    </div>
  );
}

export function SkeletonCard() {
  return (
    <div className="glass-card rounded-2xl p-6 animate-pulse">
      <div className="h-4 shimmer-loading rounded mb-3 w-1/3"></div>
      <div className="h-8 shimmer-loading rounded mb-2 w-2/3"></div>
      <div className="h-3 shimmer-loading rounded w-1/2"></div>
    </div>
  );
}

export function EmptyState({ icon, title, description, action }) {
  return (
    <div className="flex flex-col items-center justify-center py-20 text-center">
      <div className="text-6xl mb-4">{icon || '📭'}</div>
      <h3 className="text-white text-xl font-semibold mb-2">{title || 'No Data Found'}</h3>
      <p className="text-gray-400 max-w-md mb-6">{description}</p>
      {action && action}
    </div>
  );
}
