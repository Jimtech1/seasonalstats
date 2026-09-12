import React from 'react';

interface SeasonIndexBadgeProps {
  index: number;
  size?: 'sm' | 'md' | 'lg';
  showLabel?: boolean;
}

export const SeasonIndexBadge: React.FC<SeasonIndexBadgeProps> = ({
  index,
  size = 'md',
  showLabel = false,
}) => {
  // Color classification based on prompt specification:
  // green >= 1.05x, amber 0.90–1.04x, red < 0.90x
  let colorStyles = '';
  let statusText = '';
  let dotColor = '';

  if (index >= 1.05) {
    colorStyles = 'bg-[#5A7A5A]/12 text-[#466346] border-[#5A7A5A]/30 font-medium';
    statusText = 'Ahead of pace';
    dotColor = 'bg-[#5A7A5A]';
  } else if (index >= 0.90) {
    colorStyles = 'bg-[#D97757]/12 text-[#BF5B38] border-[#D97757]/30 font-medium';
    statusText = 'Seasonal norm';
    dotColor = 'bg-[#D97757]';
  } else {
    colorStyles = 'bg-[#B85C4A]/12 text-[#A24837] border-[#B85C4A]/30 font-medium';
    statusText = 'Below pace';
    dotColor = 'bg-[#B85C4A]';
  }

  const sizeClasses = {
    sm: 'text-xs px-2 py-0.5 rounded-full border',
    md: 'text-xs md:text-sm px-2.5 py-1 rounded-full border',
    lg: 'text-sm md:text-base px-3 py-1.5 rounded-full border',
  }[size];

  const formatted = `${index.toFixed(2)}×`;

  return (
    <div
      id={`season-badge-${Math.round(index * 100)}`}
      className={`inline-flex items-center gap-1.5 whitespace-nowrap select-none transition-colors ${sizeClasses} ${colorStyles}`}
      title={`Seasonality Index: ${formatted} (${statusText}). 1.00× is exact historical baseline.`}
    >
      <span className={`w-1.5 h-1.5 rounded-full ${dotColor}`} />
      <span className="font-mono tracking-tight font-semibold">{formatted}</span>
      {showLabel && (
        <span className="text-[11px] opacity-80 hidden sm:inline ml-0.5">
          ({statusText})
        </span>
      )}
    </div>
  );
};
