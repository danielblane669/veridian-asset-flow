
import React from 'react';

interface PortfolioCardProps {
  title: string;
  value: number;
  icon: React.ReactNode;
  gradientColors: string;
}

const PortfolioCard: React.FC<PortfolioCardProps> = ({ title, value, icon, gradientColors }) => {
  const formatValue = (amount: number) => {
    if (amount >= 1000000) {
      return `$${(amount / 1000000).toFixed(1)}M`;
    } else if (amount >= 1000) {
      return `$${(amount / 1000).toFixed(1)}K`;
    } else {
      return `$${amount.toLocaleString()}`;
    }
  };

  return (
    <div className="bg-card rounded-xl shadow-sm border border-border p-4 sm:p-6 hover:shadow-md transition-shadow">
      <div className="flex items-start justify-between mb-3">
        <div className={`${gradientColors} text-primary-foreground p-2 sm:p-3 rounded-lg shadow-sm`}>
          {icon}
        </div>
      </div>
      
      <div className="space-y-1">
        <h3 className="text-xs sm:text-sm font-medium text-muted-foreground line-clamp-2 leading-tight">
          {title}
        </h3>
        <p className="text-lg sm:text-2xl font-bold text-foreground break-words">
          {formatValue(value)}
        </p>
      </div>
    </div>
  );
};

export default PortfolioCard;
