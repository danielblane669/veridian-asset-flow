
import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { LayoutDashboard, Plus, Minus, History, Moon, Sun, LogOut } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import { useTheme } from '../../contexts/ThemeContext';

interface SidebarProps {
  isExpanded: boolean;
  onToggle?: () => void;
}

const Sidebar: React.FC<SidebarProps> = ({ isExpanded, onToggle }) => {
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

  return (
    <div
      className={`fixed left-0 top-0 h-full bg-card shadow-lg transition-all duration-300 z-50 ${
        isExpanded ? 'w-64' : 'w-16'
      }`}
    >
      <div className="flex flex-col h-full">
        {/* Logo */}
        <div className="flex items-center h-16 px-4 border-b border-border">
          <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
            <span className="text-primary-foreground font-bold text-sm">V</span>
          </div>
          {isExpanded && (
            <span className="ml-3 text-lg font-bold text-foreground">
              Veridian Assets
            </span>
          )}
        </div>

        {/* Navigation */}
        <nav className="flex-1 px-2 py-4 space-y-1">
          {navigation.map((item) => {
            const isActive = location.pathname === item.href;
            return (
              <Link
                key={item.name}
                to={item.href}
                className={`group flex items-center px-3 py-2 text-sm font-medium rounded-md transition-colors ${
                  isActive
                    ? 'bg-primary text-primary-foreground'
                    : 'text-muted-foreground hover:bg-accent hover:text-accent-foreground'
                }`}
              >
                <item.icon className="w-5 h-5 flex-shrink-0" />
                {isExpanded && <span className="ml-3">{item.name}</span>}
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
              <Sun className="w-5 h-5 flex-shrink-0" />
            ) : (
              <Moon className="w-5 h-5 flex-shrink-0" />
            )}
            {isExpanded && <span className="ml-3">{isDark ? 'Light Mode' : 'Dark Mode'}</span>}
          </button>
        </div>

        {/* User Profile */}
        <div className="border-t border-border p-4">
          <div className="flex items-center">
            <div className="w-8 h-8 bg-secondary rounded-full flex items-center justify-center">
              <span className="text-secondary-foreground font-bold text-xs">
                {user ? getInitials(user.fullName) : 'U'}
              </span>
            </div>
            {isExpanded && (
              <div className="ml-3 flex-1">
                <p className="text-sm font-medium text-foreground truncate">
                  {user?.fullName}
                </p>
              </div>
            )}
          </div>
          
          {isExpanded && (
            <button
              onClick={logout}
              className="mt-3 w-full group flex items-center px-3 py-2 text-sm font-medium rounded-md text-destructive hover:bg-destructive/10 transition-colors"
            >
              <LogOut className="w-5 h-5 flex-shrink-0" />
              <span className="ml-3">Logout</span>
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default Sidebar;
