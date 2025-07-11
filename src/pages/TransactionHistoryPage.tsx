
import React, { useState, useEffect } from 'react';
import { Menu, Filter, Download } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { supabase } from '../integrations/supabase/client';
import Sidebar from '../components/Dashboard/Sidebar';
import MobileMenu from '../components/Dashboard/MobileMenu';
import jsPDF from 'jspdf';
import 'jspdf-autotable';

interface Transaction {
  id: string;
  type: string;
  amount: number;
  status: string;
  created_at: string;
  currency: string;
  hash: string | null;
}

const TransactionHistoryPage = () => {
  const { user } = useAuth();
  const [isSidebarExpanded, setIsSidebarExpanded] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [filterType, setFilterType] = useState('all');
  const [filterStatus, setFilterStatus] = useState('all');
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (user) {
      fetchTransactions();
    }
  }, [user]);

  const fetchTransactions = async () => {
    try {
      const { data, error } = await supabase
        .from('transactions')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Error fetching transactions:', error);
      } else {
        setTransactions(data || []);
      }
    } catch (error) {
      console.error('Error:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const filteredTransactions = transactions.filter(transaction => {
    const typeMatch = filterType === 'all' || transaction.type.toLowerCase() === filterType;
    const statusMatch = filterStatus === 'all' || transaction.status.toLowerCase() === filterStatus;
    return typeMatch && statusMatch;
  });

  const exportToPDF = () => {
    const doc = new jsPDF();
    
    // Add title
    doc.setFontSize(20);
    doc.text('Transaction History', 20, 20);
    
    // Add user info
    doc.setFontSize(12);
    doc.text(`User: ${user?.fullName || 'N/A'}`, 20, 35);
    doc.text(`Generated on: ${new Date().toLocaleDateString()}`, 20, 45);
    
    // Prepare table data
    const tableData = filteredTransactions.map(transaction => [
      transaction.type,
      `$${transaction.amount.toLocaleString()}`,
      transaction.currency,
      transaction.status,
      new Date(transaction.created_at).toLocaleDateString(),
      transaction.hash || 'N/A'
    ]);
    
    // Add table
    (doc as any).autoTable({
      head: [['Type', 'Amount', 'Currency', 'Status', 'Date', 'Transaction ID']],
      body: tableData,
      startY: 55,
      styles: {
        fontSize: 10,
        cellPadding: 3,
      },
      headStyles: {
        fillColor: [128, 90, 213], // Purple color
        textColor: [255, 255, 255],
      },
    });
    
    // Save the PDF
    doc.save(`transaction-history-${new Date().toISOString().split('T')[0]}.pdf`);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Completed':
        return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200';
      case 'Pending':
        return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200';
      case 'Denied':
        return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200';
      default:
        return 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200';
    }
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'Deposit':
        return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200';
      case 'Withdrawal':
        return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200';
      case 'Bonus':
        return 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200';
      case 'Profit':
        return 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200';
      default:
        return 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200';
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary"></div>
      </div>
    );
  }

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
        <div className="lg:hidden flex items-center justify-between p-4 bg-card shadow-sm">
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
              <span className="text-primary-foreground font-bold text-sm">V</span>
            </div>
            <span className="text-lg font-bold text-foreground">Transactions</span>
          </div>
          <button
            onClick={() => setIsMobileMenuOpen(true)}
            className="p-2 text-muted-foreground hover:bg-accent hover:text-accent-foreground rounded-lg"
          >
            <Menu className="w-6 h-6" />
          </button>
        </div>

        {/* Transaction History Content */}
        <div className="p-4 sm:p-6">
          <div className="mb-6 sm:mb-8">
            <h1 className="text-2xl sm:text-3xl font-bold text-foreground mb-2">
              Transaction History
            </h1>
            <p className="text-muted-foreground">
              View all your deposits, withdrawals, bonuses, and profits
            </p>
          </div>

          {/* Filters and Actions */}
          <div className="bg-card rounded-xl shadow-lg p-4 sm:p-6 mb-6 sm:mb-8">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-4 sm:space-y-0">
              <div className="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-4">
                <div className="flex items-center space-x-2">
                  <Filter className="w-5 h-5 text-muted-foreground" />
                  <select
                    value={filterType}
                    onChange={(e) => setFilterType(e.target.value)}
                    className="px-3 py-2 border border-border rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary bg-background text-foreground text-sm"
                  >
                    <option value="all">All Types</option>
                    <option value="deposit">Deposits</option>
                    <option value="withdrawal">Withdrawals</option>
                    <option value="bonus">Bonuses</option>
                    <option value="profit">Profits</option>
                  </select>
                </div>
                
                <select
                  value={filterStatus}
                  onChange={(e) => setFilterStatus(e.target.value)}
                  className="px-3 py-2 border border-border rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary bg-background text-foreground text-sm"
                >
                  <option value="all">All Status</option>
                  <option value="completed">Completed</option>
                  <option value="pending">Pending</option>
                  <option value="denied">Denied</option>
                </select>
              </div>
              
              <button 
                onClick={exportToPDF}
                className="flex items-center justify-center space-x-2 px-4 py-2 bg-primary text-primary-foreground rounded-md hover:bg-primary/90 transition-colors text-sm"
              >
                <Download className="w-4 h-4" />
                <span>Export PDF</span>
              </button>
            </div>
          </div>

          {/* Transactions Table */}
          <div className="bg-card rounded-xl shadow-lg overflow-hidden">
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-border">
                <thead className="bg-muted">
                  <tr>
                    <th className="px-3 sm:px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                      Type
                    </th>
                    <th className="px-3 sm:px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                      Amount
                    </th>
                    <th className="px-3 sm:px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                      Currency
                    </th>
                    <th className="px-3 sm:px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                      Status
                    </th>
                    <th className="px-3 sm:px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                      Date
                    </th>
                    <th className="hidden sm:table-cell px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                      Transaction ID
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-card divide-y divide-border">
                  {filteredTransactions.map((transaction) => (
                    <tr key={transaction.id} className="hover:bg-muted/50">
                      <td className="px-3 sm:px-6 py-4 whitespace-nowrap">
                        <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getTypeColor(transaction.type)}`}>
                          {transaction.type}
                        </span>
                      </td>
                      <td className="px-3 sm:px-6 py-4 whitespace-nowrap text-sm font-medium text-foreground">
                        ${Number(transaction.amount).toLocaleString()}
                      </td>
                      <td className="px-3 sm:px-6 py-4 whitespace-nowrap text-sm text-foreground">
                        {transaction.currency}
                      </td>
                      <td className="px-3 sm:px-6 py-4 whitespace-nowrap">
                        <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(transaction.status)}`}>
                          {transaction.status}
                        </span>
                      </td>
                      <td className="px-3 sm:px-6 py-4 whitespace-nowrap text-sm text-foreground">
                        <div>
                          <div>{new Date(transaction.created_at).toLocaleDateString()}</div>
                          <div className="text-xs text-muted-foreground">
                            {new Date(transaction.created_at).toLocaleTimeString()}
                          </div>
                        </div>
                      </td>
                      <td className="hidden sm:table-cell px-6 py-4 whitespace-nowrap text-sm text-foreground font-mono">
                        {transaction.hash || 'N/A'}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            
            {filteredTransactions.length === 0 && (
              <div className="text-center py-12">
                <p className="text-muted-foreground">No transactions found matching your filters.</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default TransactionHistoryPage;
