
import React, { useState } from 'react';
import { Eye, EyeOff } from 'lucide-react';

interface PortfolioCardProps {
  title: string;
  value: number;
  icon: React.ReactNode;
  gradientColors: string;
}

const PortfolioCard: React.FC<PortfolioCardProps> = ({ title, value, icon, gradientColors }) => {
  const [isVisible, setIsVisible] = useState(true);

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(amount);
  };

  // Override gradientColors to use purple theme
  const purpleGradient = gradientColors.includes('blue') 
    ? 'from-purple-600 to-purple-800' 
    : gradientColors.includes('green') 
    ? 'from-purple-500 to-purple-700'
    : gradientColors.includes('yellow')
    ? 'from-purple-400 to-purple-600'
    : 'from-purple-700 to-purple-900';

  return (
    <div className={`relative overflow-hidden rounded-xl bg-gradient-to-br ${purpleGradient} p-4 sm:p-6 text-white shadow-lg hover:shadow-xl transition-shadow duration-300`}>
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <div className="p-2 bg-white/20 rounded-lg backdrop-blur-sm">
            {icon}
          </div>
          <div className="min-w-0 flex-1">
            <p className="text-sm font-medium opacity-90">{title}</p>
            <div className="flex items-center space-x-2">
              <p className="text-xl sm:text-2xl font-bold truncate">
                {isVisible ? formatCurrency(value) : '••••••'}
              </p>
              <button
                onClick={() => setIsVisible(!isVisible)}
                className="p-1 hover:bg-white/20 rounded-full transition-colors flex-shrink-0"
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
      
      {/* Decorative elements */}
      <div className="absolute top-0 right-0 -mt-4 -mr-4 w-16 h-16 bg-white/10 rounded-full"></div>
      <div className="absolute bottom-0 left-0 -mb-2 -ml-2 w-8 h-8 bg-white/10 rounded-full"></div>
    </div>
  );
};

export default PortfolioCard;
