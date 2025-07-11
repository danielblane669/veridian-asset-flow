
import React, { useState } from 'react';
import { Eye, EyeOff } from 'lucide-react';

interface PortfolioCardProps {
  title: string;
  value: number;
  icon: React.ReactNode;
  gradientColors: string;
}

const PortfolioCard: React.FC<PortfolioCardProps> = ({ title, value, icon }) => {
  const [isVisible, setIsVisible] = useState(true);

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(amount);
  };

  return (
    <div className="relative overflow-hidden rounded-xl bg-card border border-border p-4 sm:p-6 shadow-lg hover:shadow-xl transition-shadow duration-300">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <div className="p-2 bg-primary/10 rounded-lg">
            <div className="text-primary">
              {icon}
            </div>
          </div>
          <div className="min-w-0 flex-1">
            <p className="text-sm font-medium text-muted-foreground">{title}</p>
            <div className="flex items-center space-x-2">
              <p className="text-xl sm:text-2xl font-bold text-foreground truncate">
                {isVisible ? formatCurrency(value) : '••••••'}
              </p>
              <button
                onClick={() => setIsVisible(!isVisible)}
                className="p-1 hover:bg-accent rounded-full transition-colors flex-shrink-0 text-muted-foreground hover:text-foreground"
              >
                {isVisible ? (
                  <EyeOff className="w-4 h-4" />
                ) : (
                  <Eye className="w-4 h-4" />
                )}
              </button>
            </div>
          </div>
        </div>
      </div>
      
      {/* Subtle decorative elements */}
      <div className="absolute top-0 right-0 -mt-4 -mr-4 w-16 h-16 bg-primary/5 rounded-full"></div>
      <div className="absolute bottom-0 left-0 -mb-2 -ml-2 w-8 h-8 bg-primary/5 rounded-full"></div>
    </div>
  );
};

export default PortfolioCard;
