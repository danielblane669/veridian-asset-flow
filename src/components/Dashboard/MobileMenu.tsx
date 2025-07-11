
import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { X, LayoutDashboard, Plus, Minus, History, Moon, Sun, LogOut } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import { useTheme } from '../../contexts/ThemeContext';

interface MobileMenuProps {
  isOpen: boolean;
  onClose: () => void;
}

const MobileMenu: React.FC<MobileMenuProps> = ({ isOpen, onClose }) => {
  const { user, logout } = useAuth();
  const { isDark, toggleTheme } = useTheme();
  const location = useLocation();

  const navigation = [
    { name: 'Dashboard', href: '/dashboard', icon: LayoutDashboard },
    { name: 'Deposit', href: '/deposit', icon: Plus },
    { name: 'Withdrawal', href: '/withdrawal', icon: Minus },
    { name: 'Transactions', href: '/transactions', icon: History },
  ];

  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map(word => word[0])
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

  if (!isOpen) return null;

  return (
    <>
      {/* Backdrop */}
      <div 
        className="fixed inset-0 bg-background/80 backdrop-blur-sm z-40 lg:hidden"
        onClick={onClose}
      />
      
      {/* Mobile Menu */}
      <div className="fixed left-0 top-0 h-full w-64 bg-card border-r border-border shadow-xl z-50 lg:hidden">
        <div className="flex flex-col h-full">
          {/* Header */}
          <div className="flex items-center justify-between h-16 px-4 border-b border-border">
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
                <span className="text-primary-foreground font-bold text-sm">V</span>
              </div>
              <span className="text-lg font-bold text-foreground">Veridian Assets</span>
            </div>
            <button
              onClick={onClose}
              className="p-2 text-muted-foreground hover:bg-accent hover:text-accent-foreground rounded-lg"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Navigation */}
          <nav className="flex-1 px-2 py-4 space-y-1">
            {navigation.map((item) => {
              const isActive = location.pathname === item.href;
              return (
                <Link
                  key={item.name}
                  to={item.href}
                  onClick={onClose}
                  className={`group flex items-center px-3 py-2 text-sm font-medium rounded-md transition-colors ${
                    isActive
                      ? 'bg-primary text-primary-foreground'
                      : 'text-muted-foreground hover:bg-accent hover:text-accent-foreground'
                  }`}
                >
                  <item.icon className="w-5 h-5 flex-shrink-0 mr-3" />
                  {item.name}
                </Link>
              );
            })}
          </nav>

          {/* Theme Toggle */}
          <div className="px-2 pb-4">
            <button
              onClick={toggleTheme}
              className="w-full group flex items-center px-3 py-2 text-sm font-medium rounded-md text-muted-foreground hover:bg-accent hover:text-accent-foreground transition-colors"
            >
              {isDark ? (
                <Sun className="w-5 h-5 flex-shrink-0 mr-3" />
              ) : (
                <Moon className="w-5 h-5 flex-shrink-0 mr-3" />
              )}
              {isDark ? 'Light Mode' : 'Dark Mode'}
            </button>
          </div>

          {/* User Profile */}
          <div className="border-t border-border p-4">
            <div className="flex items-center mb-3">
              <div className="w-8 h-8 bg-primary rounded-full flex items-center justify-center">
                <span className="text-primary-foreground font-bold text-xs">
                  {user ? getInitials(user.fullName) : 'U'}
                </span>
              </div>
              <div className="ml-3 flex-1">
                <p className="text-sm font-medium text-foreground truncate">
                  {user?.fullName}
                </p>
              </div>
            </div>
            
            <button
              onClick={() => {
                logout();
                onClose();
              }}
              className="w-full group flex items-center px-3 py-2 text-sm font-medium rounded-md text-destructive hover:bg-destructive/10 transition-colors"
            >
              <LogOut className="w-5 h-5 flex-shrink-0 mr-3" />
              Logout
            </button>
          </div>
        </div>
      </div>
    </>
  );
};

export default MobileMenu;
