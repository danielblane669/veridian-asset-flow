import React, { useState, useEffect } from 'react';
import { Menu, CheckCircle, Download, Bitcoin, Building } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { supabase } from '../integrations/supabase/client';
import { toast } from 'sonner';
import { useNavigate } from 'react-router-dom';
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
  const navigate = useNavigate();
  const [isSidebarExpanded, setIsSidebarExpanded] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [selectedMethod, setSelectedMethod] = useState('crypto');
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [isLoadingTransactions, setIsLoadingTransactions] = useState(false);

  // Crypto withdrawal state
  const [cryptoCurrency, setCryptoCurrency] = useState('BTC');
  const [cryptoAddress, setCryptoAddress] = useState('');
  const [cryptoAmount, setCryptoAmount] = useState('');

  // Bank withdrawal state
  const [accountNumber, setAccountNumber] = useState('');
  const [routingNumber, setRoutingNumber] = useState('');
  const [accountName, setAccountName] = useState('');
  const [bankAmount, setBankAmount] = useState('');

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

  const handleCryptoSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!user) {
      toast.error('Please log in to request a withdrawal');
      return;
    }

    const withdrawalAmount = parseFloat(cryptoAmount);
    if (isNaN(withdrawalAmount) || withdrawalAmount < 10000) {
      toast.error('Minimum withdrawal amount is $10,000');
      return;
    }

    if (!cryptoAddress.trim()) {
      toast.error('Please enter your crypto address');
      return;
    }

    try {
      // Add transaction to database
      const { data, error } = await supabase
        .from('transactions')
        .insert([
          {
            user_id: user.id,
            type: 'Withdrawal',
            amount: withdrawalAmount,
            currency: cryptoCurrency,
            status: 'Pending',
            hash: `withdrawal_${Date.now()}_${user.id}`
          }
        ]);

      if (error) {
        console.error('Error creating transaction:', error);
        toast.error('Failed to process withdrawal');
        return;
      }

      toast.success('Withdrawal request submitted successfully! Your withdrawal is under review and the status will be communicated to you via email within 24 hours.', {
        duration: 6000,
      });
      
      // Reset form
      setCryptoAmount('');
      setCryptoAddress('');
      
      // Redirect to dashboard after a delay
      setTimeout(() => {
        navigate('/dashboard');
      }, 3000);

    } catch (error) {
      console.error('Error submitting withdrawal:', error);
      toast.error('An error occurred while processing your withdrawal');
    }
  };

  const handleBankSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!user) {
      toast.error('Please log in to request a withdrawal');
      return;
    }

    const withdrawalAmount = parseFloat(bankAmount);
    if (isNaN(withdrawalAmount) || withdrawalAmount < 10000) {
      toast.error('Minimum withdrawal amount is $10,000');
      return;
    }

    if (!accountNumber.trim() || !routingNumber.trim() || !accountName.trim()) {
      toast.error('Please fill in all bank details');
      return;
    }

    try {
      // Add transaction to database
      const { data, error } = await supabase
        .from('transactions')
        .insert([
          {
            user_id: user.id,
            type: 'Withdrawal',
            amount: withdrawalAmount,
            currency: 'USD',
            status: 'Pending',
            hash: `withdrawal_${Date.now()}_${user.id}`
          }
        ]);

      if (error) {
        console.error('Error creating transaction:', error);
        toast.error('Failed to process withdrawal');
        return;
      }

      toast.success('Withdrawal request submitted successfully! Your withdrawal is under review and the status will be communicated to you via email within 24 hours.', {
        duration: 6000,
      });
      
      // Reset form
      setBankAmount('');
      setAccountNumber('');
      setRoutingNumber('');
      setAccountName('');
      
      // Redirect to dashboard after a delay
      setTimeout(() => {
        navigate('/dashboard');
      }, 3000);

    } catch (error) {
      console.error('Error submitting withdrawal:', error);
      toast.error('An error occurred while processing your withdrawal');
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-muted/20">
      <Sidebar isExpanded={isSidebarExpanded} />
      <MobileMenu isOpen={isMobileMenuOpen} onClose={() => setIsMobileMenuOpen(false)} />
      
      <div className={`transition-all duration-300 ${isSidebarExpanded ? 'ml-64' : 'ml-16'}`}>
        <div className="lg:hidden p-4 border-b border-border bg-card/50 backdrop-blur-sm">
          <button
            onClick={() => setIsMobileMenuOpen(true)}
            className="p-2 text-muted-foreground hover:text-foreground"
          >
            <Menu className="h-6 w-6" />
          </button>
        </div>

        <div className="p-4 sm:p-6 lg:p-8">
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-8">
              <h1 className="text-3xl sm:text-4xl font-bold text-foreground mb-2">Withdrawal</h1>
              <p className="text-muted-foreground">Request a withdrawal from your account</p>
            </div>

            {/* Method Selection */}
            <div className="mb-8">
              <h2 className="text-xl font-semibold text-foreground mb-4">Select Withdrawal Method</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <button
                  onClick={() => setSelectedMethod('crypto')}
                  className={`p-6 rounded-xl border-2 transition-all duration-200 hover:scale-105 ${
                    selectedMethod === 'crypto'
                      ? 'border-primary bg-primary/10 shadow-lg'
                      : 'border-border hover:border-primary/50 bg-card'
                  }`}
                >
                  <div className="flex items-center space-x-4">
                    <div className="p-3 rounded-full bg-primary/20">
                      <Bitcoin className="w-6 h-6 text-primary" />
                    </div>
                    <div className="text-left">
                      <h3 className="font-semibold text-foreground">Cryptocurrency</h3>
                      <p className="text-sm text-muted-foreground">Bitcoin, Ethereum, USDT</p>
                    </div>
                  </div>
                </button>

                <button
                  onClick={() => setSelectedMethod('bank')}
                  className={`p-6 rounded-xl border-2 transition-all duration-200 hover:scale-105 ${
                    selectedMethod === 'bank'
                      ? 'border-primary bg-primary/10 shadow-lg'
                      : 'border-border hover:border-primary/50 bg-card'
                  }`}
                >
                  <div className="flex items-center space-x-4">
                    <div className="p-3 rounded-full bg-primary/20">
                      <Building className="w-6 h-6 text-primary" />
                    </div>
                    <div className="text-left">
                      <h3 className="font-semibold text-foreground">Bank Transfer</h3>
                      <p className="text-sm text-muted-foreground">Wire transfer to your bank</p>
                    </div>
                  </div>
                </button>
              </div>
            </div>

            {/* Crypto Withdrawal Form */}
            {selectedMethod === 'crypto' && (
              <div className="bg-card/50 backdrop-blur-sm rounded-xl border border-border p-6 sm:p-8 shadow-lg">
                <h3 className="text-xl font-semibold text-foreground mb-6">Cryptocurrency Withdrawal</h3>
                <form onSubmit={handleCryptoSubmit} className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label htmlFor="cryptoAmount" className="block text-sm font-medium text-foreground mb-2">
                        Amount (USD)
                      </label>
                      <input
                        id="cryptoAmount"
                        type="number"
                        step="0.01"
                        min="10000"
                        value={cryptoAmount}
                        onChange={(e) => setCryptoAmount(e.target.value)}
                        className="w-full px-4 py-3 border border-input rounded-lg bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary transition-colors"
                        placeholder="Minimum $10,000"
                        required
                      />
                      <p className="mt-1 text-sm text-muted-foreground">Minimum withdrawal: $10,000</p>
                    </div>

                    <div>
                      <label htmlFor="cryptoCurrency" className="block text-sm font-medium text-foreground mb-2">
                        Currency
                      </label>
                      <select
                        id="cryptoCurrency"
                        value={cryptoCurrency}
                        onChange={(e) => setCryptoCurrency(e.target.value)}
                        className="w-full px-4 py-3 border border-input rounded-lg bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary transition-colors"
                      >
                        <option value="BTC">Bitcoin (BTC)</option>
                        <option value="ETH">Ethereum (ETH)</option>
                        <option value="USDT">Tether (USDT)</option>
                      </select>
                    </div>
                  </div>

                  <div>
                    <label htmlFor="cryptoAddress" className="block text-sm font-medium text-foreground mb-2">
                      Wallet Address
                    </label>
                    <input
                      id="cryptoAddress"
                      type="text"
                      value={cryptoAddress}
                      onChange={(e) => setCryptoAddress(e.target.value)}
                      className="w-full px-4 py-3 border border-input rounded-lg bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary transition-colors"
                      placeholder="Enter your wallet address"
                      required
                    />
                  </div>

                  <button
                    type="submit"
                    className="w-full bg-primary text-primary-foreground py-3 px-6 rounded-lg hover:bg-primary/90 transition-colors font-medium shadow-lg hover:shadow-xl"
                  >
                    Place Withdrawal Request
                  </button>
                </form>
              </div>
            )}

            {/* Bank Withdrawal Form */}
            {selectedMethod === 'bank' && (
              <div className="bg-card/50 backdrop-blur-sm rounded-xl border border-border p-6 sm:p-8 shadow-lg">
                <h3 className="text-xl font-semibold text-foreground mb-6">Bank Wire Transfer</h3>
                <form onSubmit={handleBankSubmit} className="space-y-6">
                  <div>
                    <label htmlFor="bankAmount" className="block text-sm font-medium text-foreground mb-2">
                      Amount (USD)
                    </label>
                    <input
                      id="bankAmount"
                      type="number"
                      step="0.01"
                      min="10000"
                      value={bankAmount}
                      onChange={(e) => setBankAmount(e.target.value)}
                      className="w-full px-4 py-3 border border-input rounded-lg bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary transition-colors"
                      placeholder="Minimum $10,000"
                      required
                    />
                    <p className="mt-1 text-sm text-muted-foreground">Minimum withdrawal: $10,000</p>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label htmlFor="accountNumber" className="block text-sm font-medium text-foreground mb-2">
                        Account Number
                      </label>
                      <input
                        id="accountNumber"
                        type="text"
                        value={accountNumber}
                        onChange={(e) => setAccountNumber(e.target.value)}
                        className="w-full px-4 py-3 border border-input rounded-lg bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary transition-colors"
                        placeholder="Enter account number"
                        required
                      />
                    </div>

                    <div>
                      <label htmlFor="routingNumber" className="block text-sm font-medium text-foreground mb-2">
                        Routing Number
                      </label>
                      <input
                        id="routingNumber"
                        type="text"
                        value={routingNumber}
                        onChange={(e) => setRoutingNumber(e.target.value)}
                        className="w-full px-4 py-3 border border-input rounded-lg bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary transition-colors"
                        placeholder="Enter routing number"
                        required
                      />
                    </div>
                  </div>

                  <div>
                    <label htmlFor="accountName" className="block text-sm font-medium text-foreground mb-2">
                      Account Holder Name
                    </label>
                    <input
                      id="accountName"
                      type="text"
                      value={accountName}
                      onChange={(e) => setAccountName(e.target.value)}
                      className="w-full px-4 py-3 border border-input rounded-lg bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary transition-colors"
                      placeholder="Enter account holder name"
                      required
                    />
                  </div>

                  <button
                    type="submit"
                    className="w-full bg-primary text-primary-foreground py-3 px-6 rounded-lg hover:bg-primary/90 transition-colors font-medium shadow-lg hover:shadow-xl"
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