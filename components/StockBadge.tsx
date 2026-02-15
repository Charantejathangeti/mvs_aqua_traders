import React from 'react';

interface StockBadgeProps {
  count: number;
}

export const StockBadge: React.FC<StockBadgeProps> = ({ count }) => {
  if (count === 0) {
    return (
      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800">
        No Stock
      </span>
    );
  }

  if (count <= 10) {
    return (
      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
        Limited Stock ({count} left)
      </span>
    );
  }

  return (
    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
      In Stock
    </span>
  );
};
