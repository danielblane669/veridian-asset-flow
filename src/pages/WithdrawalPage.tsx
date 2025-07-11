
import React, { useState, useEffect } from 'react';
import { Menu, CheckCircle, Download } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { supabase } from '../integrations/supabase/client';
import { toast } from 'sonner';
import jsPDF from 'jspdf';
import 'jspdf-autotable';
import Sidebar from '../components/Dashboard/Sidebar';
import MobileMenu from '../components/Dashboard/MobileMenu';

interface Transaction {
  id: string;
  type: string;
  amount: number;
  status: string;
  created_at: string;
  currency: string;
  hash: string | null;
}

const WithdrawalPage = () => {
  const { user } = useAuth();
  const [isSidebarExpanded, setIsSidebarExpanded] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [withdrawalMethod, setWithdrawalMethod] = useState('crypto');
  const [showSuccess, setShowSuccess] = useState(false);
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [isLoadingTransactions, setIsLoadingTransactions] = useState(false);

  // Crypto withdrawal state
  const [selectedCrypto, setSelectedCrypto] = useState('bitcoin');
  const [walletAddress, setWalletAddress] = useState('');
  const [cryptoAmount, setCryptoAmount] = useState('');

  // Bank withdrawal state
  const [accountNumber, setAccountNumber] = useState('');
  const [bankName, setBankName] = useState('');
  const [fullName, setFullName] = useState('');
  const [bankAmount, setBankAmount] = useState('');

  const cryptoOptions = [
    { value: 'bitcoin', label: 'Bitcoin (BTC)' },
    { value: 'ethereum', label: 'Ethereum (ETH)' },
    { value: 'litecoin', label: 'Litecoin (LTC)' },
    { value: 'xrp', label: 'XRP' },
  ];

  const fetchTransactions = async () => {
    if (!user) return;
    
    try {
      setIsLoadingTransactions(true);
      const { data, error } = await supabase
        .from('transactions')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });

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

  const exportToPDF = () => {
    if (!user || transactions.length === 0) {
      toast.error('No transactions to export');
      return;
    }

    const doc = new jsPDF();
    
    // Add title
    doc.setFontSize(20);
    doc.text('Transaction History', 20, 20);
    
    // Add user info
    doc.setFontSize(12);
    doc.text(`Account Holder: ${user.fullName}`, 20, 35);
    doc.text(`Generated: ${new Date().toLocaleDateString()}`, 20, 45);
    
    // Prepare data for table
    const tableData = transactions.map(transaction => [
      transaction.type,
      `$${transaction.amount.toLocaleString()}`,
      transaction.currency,
      transaction.status,
      new Date(transaction.created_at).toLocaleDateString(),
      transaction.hash || 'N/A'
    ]);

    // Add table
    (doc as any).autoTable({
      head: [['Type', 'Amount', 'Currency', 'Status', 'Date', 'Hash']],
      body: tableData,
      startY: 55,
      styles: { fontSize: 8 },
      headStyles: { fillColor: [34, 34, 34] },
    });

    // Save the PDF
    doc.save(`${user.fullName}_transactions_${new Date().toISOString().split('T')[0]}.pdf`);
    toast.success('Transaction history exported successfully!');
  };

  const handleCryptoSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!cryptoAmount || parseFloat(cryptoAmount) < 1000) {
      toast.error('Minimum withdrawal amount is $1,000');
      return;
    }
    
    if (!walletAddress) {
      toast.error('Please enter your wallet address');
      return;
    }

    setShowSuccess(true);
    
    setTimeout(() => {
      window.location.href = '/dashboard';
    }, 10000);
  };

  const handleBankSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!bankAmount || parseFloat(bankAmount) < 1000) {
      toast.error('Minimum withdrawal amount is $1,000');
      return;
    }
    
    if (!accountNumber || !bankName || !fullName) {
      toast.error('Please fill in all fields');
      return;
    }

    setShowSuccess(true);
    
    setTimeout(() => {
      window.location.href = '/dashboard';
    }, 10000);
  };

  if (showSuccess) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background p-4">
        <div className="max-w-md w-full bg-card rounded-xl shadow-lg border border-border p-6 sm:p-8 text-center">
          <CheckCircle className="w-16 h-16 text-green-500 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-foreground mb-4">
            Withdrawal Request Submitted
          </h2>
          <p className="text-muted-foreground mb-6">
            Your withdrawal is being reviewed. We will communicate via email if the withdrawal is approved or denied.
          </p>
          <div className="text-sm text-muted-foreground">
            Redirecting to dashboard in 10 seconds...
          </div>
        </div>
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
        <div className="lg:hidden flex items-center justify-between p-4 bg-card shadow-sm border-b border-border">
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
              <span className="text-primary-foreground font-bold text-sm">V</span>
            </div>
            <span className="text-lg font-bold text-foreground">Withdrawal</span>
          </div>
          <button
            onClick={() => setIsMobileMenuOpen(true)}
            className="p-2 text-muted-foreground hover:bg-accent hover:text-accent-foreground rounded-lg"
          >
            <Menu className="w-6 h-6" />
          </button>
        </div>

        {/* Withdrawal Content */}
        <div className="p-4 sm:p-6">
          <div className="max-w-4xl mx-auto space-y-6">
            {/* Header with Export Button */}
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
              <div>
                <h1 className="text-2xl sm:text-3xl font-bold text-foreground mb-2">
                  Withdraw Funds
                </h1>
                <p className="text-muted-foreground">
                  Withdraw your funds via cryptocurrency or bank transfer (Minimum: $1,000)
                </p>
              </div>
              <button
                onClick={exportToPDF}
                disabled={isLoadingTransactions || transactions.length === 0}
                className="flex items-center justify-center gap-2 px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 disabled:opacity-50 disabled:cursor-not-allowed transition-colors text-sm font-medium"
              >
                <Download className="w-4 h-4" />
                Export PDF
              </button>
            </div>

            {/* Method Selection */}
            <div className="bg-card rounded-xl shadow-sm border border-border p-4 sm:p-6">
              <h2 className="text-lg sm:text-xl font-semibold text-foreground mb-4">
                Select Withdrawal Method
              </h2>
              <div className="flex flex-col sm:flex-row gap-3">
                <button
                  onClick={() => setWithdrawalMethod('crypto')}
                  className={`flex-1 px-4 py-3 rounded-lg font-medium transition-colors text-sm sm:text-base ${
                    withdrawalMethod === 'crypto'
                      ? 'bg-primary text-primary-foreground'
                      : 'bg-muted text-muted-foreground hover:bg-accent hover:text-accent-foreground'
                  }`}
                >
                  Cryptocurrency
                </button>
                <button
                  onClick={() => setWithdrawalMethod('bank')}
                  className={`flex-1 px-4 py-3 rounded-lg font-medium transition-colors text-sm sm:text-base ${
                    withdrawalMethod === 'bank'
                      ? 'bg-primary text-primary-foreground'
                      : 'bg-muted text-muted-foreground hover:bg-accent hover:text-accent-foreground'
                  }`}
                >
                  Bank Transfer
                </button>
              </div>
            </div>

            {/* Crypto Withdrawal Form */}
            {withdrawalMethod === 'crypto' && (
              <div className="bg-card rounded-xl shadow-sm border border-border p-4 sm:p-6">
                <h2 className="text-lg sm:text-xl font-semibold text-foreground mb-4">
                  Cryptocurrency Withdrawal
                </h2>
                <form onSubmit={handleCryptoSubmit} className="space-y-4 sm:space-y-6">
                  <div>
                    <label className="block text-sm font-medium text-foreground mb-2">
                      Select Cryptocurrency
                    </label>
                    <select
                      value={selectedCrypto}
                      onChange={(e) => setSelectedCrypto(e.target.value)}
                      className="w-full px-3 py-2 border border-border rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary bg-background text-foreground"
                    >
                      {cryptoOptions.map((option) => (
                        <option key={option.value} value={option.value}>
                          {option.label}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-foreground mb-2">
                      Your Wallet Address
                    </label>
                    <textarea
                      value={walletAddress}
                      onChange={(e) => setWalletAddress(e.target.value)}
                      placeholder="Enter your wallet address"
                      rows={3}
                      className="w-full px-3 py-2 border border-border rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary bg-background text-foreground resize-none"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-foreground mb-2">
                      Withdrawal Amount (USD)
                    </label>
                    <input
                      type="number"
                      min="1000"
                      step="0.01"
                      value={cryptoAmount}
                      onChange={(e) => setCryptoAmount(e.target.value)}
                      placeholder="Minimum $1,000"
                      className="w-full px-3 py-2 border border-border rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary bg-background text-foreground"
                      required
                    />
                  </div>

                  <button
                    type="submit"
                    className="w-full bg-primary text-primary-foreground py-3 px-4 rounded-md hover:bg-primary/90 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary font-medium transition-colors"
                  >
                    Place Withdrawal Request
                  </button>
                </form>
              </div>
            )}

            {/* Bank Withdrawal Form */}
            {withdrawalMethod === 'bank' && (
              <div className="bg-card rounded-xl shadow-sm border border-border p-4 sm:p-6">
                <h2 className="text-lg sm:text-xl font-semibold text-foreground mb-4">
                  Bank Transfer Withdrawal
                </h2>
                <form onSubmit={handleBankSubmit} className="space-y-4 sm:space-y-6">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-foreground mb-2">
                        Account Number
                      </label>
                      <input
                        type="text"
                        value={accountNumber}
                        onChange={(e) => setAccountNumber(e.target.value)}
                        placeholder="Enter your account number"
                        className="w-full px-3 py-2 border border-border rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary bg-background text-foreground"
                        required
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-foreground mb-2">
                        Bank Name
                      </label>
                      <input
                        type="text"
                        value={bankName}
                        onChange={(e) => setBankName(e.target.value)}
                        placeholder="Enter your bank name"
                        className="w-full px-3 py-2 border border-border rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary bg-background text-foreground"
                        required
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-foreground mb-2">
                      Full Name
                    </label>
                    <input
                      type="text"
                      value={fullName}
                      onChange={(e) => setFullName(e.target.value)}
                      placeholder="Enter your full name"
                      className="w-full px-3 py-2 border border-border rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary bg-background text-foreground"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-foreground mb-2">
                      Withdrawal Amount (USD)
                    </label>
                    <input
                      type="number"
                      min="1000"
                      step="0.01"
                      value={bankAmount}
                      onChange={(e) => setBankAmount(e.target.value)}
                      placeholder="Minimum $1,000"
                      className="w-full px-3 py-2 border border-border rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary bg-background text-foreground"
                      required
                    />
                  </div>

                  <button
                    type="submit"
                    className="w-full bg-primary text-primary-foreground py-3 px-4 rounded-md hover:bg-primary/90 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary font-medium transition-colors"
                  >
                    Place Withdrawal Request
                  </button>
                </form>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default WithdrawalPage;
