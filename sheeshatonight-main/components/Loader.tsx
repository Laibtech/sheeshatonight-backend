'use client';

import React from 'react';

interface LoaderProps {
  size?: number;
}

export const Loader: React.FC<LoaderProps> = ({ size = 24 }) => {
  const dimension = `${size}px`;

  return (
    <div className="flex items-center justify-center py-12">
      <div
        className="animate-spin rounded-full border-4 border-amber-500 border-t-transparent"
        style={{ width: dimension, height: dimension }}
      />
    </div>
  );
};
