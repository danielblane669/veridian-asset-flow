
import React, { useState, useEffect } from 'react';
import { Menu, Wallet, TrendingUp, Gift, CreditCard } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { supabase } from '../integrations/supabase/client';
import Sidebar from '../components/Dashboard/Sidebar';
import MobileMenu from '../components/Dashboard/MobileMenu';
import PortfolioCard from '../components/Dashboard/PortfolioCard';

interface Transaction {
  id: string;
  type: string;
  amount: number;
  status: string;
  created_at: string;
  currency: string;
  hash: string | null;
}

const Dashboard = () => {
  const { user } = useAuth();
  const [isSidebarExpanded, setIsSidebarExpanded] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [isLoadingTransactions, setIsLoadingTransactions] = useState(true);

  // Fetch user transactions from database
  const fetchTransactions = async () => {
    if (!user) return;
    
    try {
      setIsLoadingTransactions(true);
      const { data, error } = await supabase
        .from('transactions')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false })
        .limit(5);

      if (error) {
        console.error('Error fetching transactions:', error);
        return;
      }

      setTransactions(data || []);
    } catch (error) {
      console.error('Error fetching transactions:', error);
    } finally {
      setIsLoadingTransactions(false);
    }
  };

  useEffect(() => {
    fetchTransactions();
  }, [user]);

  useEffect(() => {
    // Add TradingView widget script
    const script = document.createElement('script');
    script.src = 'https://s3.tradingview.com/external-embedding/embed-widget-symbol-overview.js';
    script.async = true;
    script.innerHTML = JSON.stringify({
      symbols: [
        ['BINANCE:BTCUSDT|1D'],
        ['BINANCE:ETHUSDT|1D'],
        ['BINANCE:XRPUSDT|1D']
      ],
      chartOnly: false,
      width: '100%',
      height: '400',
      locale: 'en',
      colorTheme: 'light',
      autosize: true,
      showVolume: false,
      showMA: false,
      hideDateRanges: false,
      hideMarketStatus: false,
      hideSymbolLogo: false,
      scalePosition: 'right',
      scaleMode: 'Normal',
      fontFamily: '-apple-system, BlinkMacSystemFont, Trebuchet MS, Roboto, Ubuntu, sans-serif',
      fontSize: '10',
      noTimeScale: false,
      valuesTracking: '1',
      changeMode: 'price-and-percent',
      chartType: 'area',
      maLineColor: '#2962FF',
      maLineWidth: 1,
      maLength: 9,
      backgroundColor: 'rgba(255, 255, 255, 1)',
      lineWidth: 2,
      lineType: 0,
      dateRanges: [
        '1d|1',
        '1m|30',
        '3m|60',
        '12m|1D',
        '60m|1W',
        'all|1M'
      ]
    });

    const widgetContainer = document.getElementById('tradingview-widget');
    if (widgetContainer) {
      widgetContainer.innerHTML = '';
      widgetContainer.appendChild(script);
    }

    return () => {
      if (widgetContainer && script.parentNode) {
        script.parentNode.removeChild(script);
      }
    };
  }, []);

  return (
    <div className="flex h-screen bg-background">
      {/* Desktop Sidebar */}
      <div 
        className="hidden lg:block"
        onMouseEnter={() => setIsSidebarExpanded(true)}
        onMouseLeave={() => setIsSidebarExpanded(false)}
      >
        <Sidebar isExpanded={isSidebarExpanded} />
      </div>

      {/* Mobile Menu */}
      <MobileMenu isOpen={isMobileMenuOpen} onClose={() => setIsMobileMenuOpen(false)} />

      {/* Main Content */}
      <div className={`flex-1 overflow-auto transition-all duration-300 ${isSidebarExpanded ? 'lg:ml-64' : 'lg:ml-16'}`}>
        {/* Mobile Header */}
        <div className="lg:hidden flex items-center justify-between p-4 bg-card shadow-sm border-b border-border">
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
              <span className="text-primary-foreground font-bold text-sm">V</span>
            </div>
            <span className="text-lg font-bold text-foreground">Dashboard</span>
          </div>
          <button
            onClick={() => setIsMobileMenuOpen(true)}
            className="p-2 text-muted-foreground hover:bg-accent hover:text-accent-foreground rounded-lg"
          >
            <Menu className="w-6 h-6" />
          </button>
        </div>

        {/* Dashboard Content */}
        <div className="p-4 sm:p-6">
          {/* Welcome Section */}
          <div className="mb-6 sm:mb-8">
            <h1 className="text-2xl sm:text-3xl font-bold text-foreground mb-2">
              Welcome back, {user?.fullName}!
            </h1>
            <p className="text-muted-foreground">
              Here's an overview of your investment portfolio
            </p>
          </div>

          {/* Portfolio Cards - Responsive Grid: 2 cols on mobile, 4 on desktop */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 lg:gap-6 mb-6 sm:mb-8">
            <PortfolioCard
              title="Total Portfolio Value"
              value={user?.totalPortfolio || 0}
              icon={<Wallet className="w-4 h-4 sm:w-5 sm:h-5 lg:w-6 lg:h-6" />}
              gradientColors="bg-primary"
            />
            <PortfolioCard
              title="Profit"
              value={user?.profit || 0}
              icon={<TrendingUp className="w-4 h-4 sm:w-5 sm:h-5 lg:w-6 lg:h-6" />}
              gradientColors="bg-primary"
            />
            <PortfolioCard
              title="Bonus"
              value={user?.bonus || 0}
              icon={<Gift className="w-4 h-4 sm:w-5 sm:h-5 lg:w-6 lg:h-6" />}
              gradientColors="bg-primary"
            />
            <PortfolioCard
              title="Deposit"
              value={user?.deposit || 0}
              icon={<CreditCard className="w-4 h-4 sm:w-5 sm:h-5 lg:w-6 lg:h-6" />}
              gradientColors="bg-primary"
            />
          </div>

          {/* TradingView Widget - Better mobile layout */}
          <div className="bg-card rounded-xl shadow-sm border border-border p-3 sm:p-4 lg:p-6 mb-6 sm:mb-8">
            <h2 className="text-lg sm:text-xl lg:text-2xl font-bold text-foreground mb-4">Market Overview</h2>
            <div className="tradingview-widget-container w-full overflow-hidden rounded-lg">
              <div id="tradingview-widget" className="tradingview-widget h-[350px] sm:h-[400px] lg:h-[450px] w-full min-w-0"></div>
            </div>
          </div>

          {/* Recent Transactions - Better spacing and mobile responsiveness */}
          <div className="bg-card rounded-xl shadow-sm border border-border p-3 sm:p-4 lg:p-6">
            <h2 className="text-lg sm:text-xl lg:text-2xl font-bold text-foreground mb-4 sm:mb-6">Recent Transactions</h2>
            <div className="overflow-x-auto -mx-3 sm:mx-0">
              <div className="min-w-[600px] sm:min-w-full px-3 sm:px-0">
                <table className="w-full divide-y divide-border">
                  <thead className="bg-muted/50">
                    <tr>
                      <th className="px-3 sm:px-4 lg:px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                        Type
                      </th>
                      <th className="px-3 sm:px-4 lg:px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                        Amount
                      </th>
                      <th className="px-3 sm:px-4 lg:px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                        Currency
                      </th>
                      <th className="px-3 sm:px-4 lg:px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                        Status
                      </th>
                      <th className="px-3 sm:px-4 lg:px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                        Date
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-card divide-y divide-border">
                    {isLoadingTransactions ? (
                      <tr>
                        <td colSpan={5} className="px-3 sm:px-4 lg:px-6 py-8 text-center text-muted-foreground">
                          Loading transactions...
                        </td>
                      </tr>
                    ) : transactions.length === 0 ? (
                      <tr>
                        <td colSpan={5} className="px-3 sm:px-4 lg:px-6 py-8 text-center text-muted-foreground">
                          No transactions found
                        </td>
                      </tr>
                    ) : (
                      transactions.map((transaction) => (
                        <tr key={transaction.id} className="hover:bg-muted/30">
                          <td className="px-3 sm:px-4 lg:px-6 py-4 whitespace-nowrap">
                            <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                              transaction.type === 'Deposit' 
                                ? 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400'
                                : transaction.type === 'Withdrawal'
                                ? 'bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-400'
                                : transaction.type === 'Profit'
                                ? 'bg-blue-100 text-blue-800 dark:bg-blue-900/20 dark:text-blue-400'
                                : 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-400'
                            }`}>
                              {transaction.type}
                            </span>
                          </td>
                          <td className="px-3 sm:px-4 lg:px-6 py-4 whitespace-nowrap text-sm font-medium text-foreground">
                            ${transaction.amount.toLocaleString()}
                          </td>
                          <td className="px-3 sm:px-4 lg:px-6 py-4 whitespace-nowrap text-sm text-foreground">
                            {transaction.currency}
                          </td>
                          <td className="px-3 sm:px-4 lg:px-6 py-4 whitespace-nowrap">
                            <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                              transaction.status === 'Completed'
                                ? 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400'
                                : transaction.status === 'Pending'
                                ? 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-400'
                                : 'bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-400'
                            }`}>
                              {transaction.status}
                            </span>
                          </td>
                          <td className="px-3 sm:px-4 lg:px-6 py-4 whitespace-nowrap text-sm text-foreground">
                            {new Date(transaction.created_at).toLocaleDateString()}
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
