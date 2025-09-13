import React, { useState } from 'react';
import { ArrowLeft, Copy, CheckCircle, AlertCircle, Upload, Menu } from 'lucide-react';
import { Link } from 'react-router-dom';
import { toast } from 'sonner';
import { useAuth } from '../contexts/AuthContext';
import { supabase } from '../integrations/supabase/client';
import Sidebar from '../components/Dashboard/Sidebar';
import MobileMenu from '../components/Dashboard/MobileMenu';

const DepositPage = () => {
  const { user } = useAuth();
  const [isSidebarExpanded, setIsSidebarExpanded] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [amount, setAmount] = useState('');
  const [currency, setCurrency] = useState('BTC');
  const [selectedMethod, setSelectedMethod] = useState('crypto');
  const [receipt, setReceipt] = useState<File | null>(null);
  const [isUploading, setIsUploading] = useState(false);

  const cryptoAddresses = {
    BTC: '1A1zP1eP5QGefi2DMPTfTL5SLmv7DivfNa',
    ETH: '0x742d35Cc6bf3B8D3BE87eB7A8b6c1234567890AB',
    USDT: 'TLa2f6VPqDgRE67v1736s7bJ8Ray5wYjU7',
    LTC: 'LQoWc8fA2B9oB8cD3E4F5G6H7I8J9K0L1M',
  };

  const handleCopyAddress = (address: string) => {
    navigator.clipboard.writeText(address);
    toast.success('Address copied to clipboard!');
  };

  const handleFileUpload = async (file: File) => {
    if (!user) return null;

    setIsUploading(true);
    try {
      const fileExt = file.name.split('.').pop();
      const fileName = `${user.id}/${Date.now()}.${fileExt}`;
      
      const { data, error } = await supabase.storage
        .from('deposit-receipts')
        .upload(fileName, file);

      if (error) {
        console.error('Upload error:', error);
        toast.error('Failed to upload receipt');
        return null;
      }

      return data.path;
    } catch (error) {
      console.error('Upload exception:', error);
      toast.error('Failed to upload receipt');
      return null;
    } finally {
      setIsUploading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!user) {
      toast.error('Please log in to make a deposit');
      return;
    }

    const depositAmount = parseFloat(amount);
    if (isNaN(depositAmount) || depositAmount < 1000) {
      toast.error('Minimum deposit amount is $1,000');
      return;
    }

    if (!receipt) {
      toast.error('Please upload your transaction receipt');
      return;
    }

    try {
      // Upload receipt first
      const receiptUrl = await handleFileUpload(receipt);
      if (!receiptUrl) return;

      // Add transaction to database
      const { data, error } = await supabase
        .from('transactions')
        .insert([
          {
            user_id: user.id,
            type: 'Deposit',
            amount: depositAmount,
            currency: selectedMethod === 'crypto' ? currency : 'USD',
            status: 'Pending',
            hash: `deposit_${Date.now()}_${user.id}`,
            receipt_url: receiptUrl
          }
        ]);

      if (error) {
        console.error('Error creating transaction:', error);
        toast.error('Failed to process deposit');
        return;
      }

      toast.success('Deposit request submitted successfully! Your deposit is under review and the status will be communicated to you via email within 24 hours.', {
        duration: 6000,
      });
      
      // Reset form
      setAmount('');
      setReceipt(null);
      
      // Redirect to dashboard after a delay
      setTimeout(() => {
        window.location.href = '/dashboard';
      }, 3000);

    } catch (error) {
      console.error('Error submitting deposit:', error);
      toast.error('An error occurred while processing your deposit');
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
          <div className="max-w-2xl mx-auto">
            <div className="text-center mb-8">
              <h1 className="text-3xl sm:text-4xl font-bold text-foreground mb-2">Deposit</h1>
              <p className="text-muted-foreground">Add funds to your account</p>
            </div>

            {/* Method Selection */}
            <div className="mb-8">
              <h2 className="text-xl font-semibold text-foreground mb-4">Select Deposit Method</h2>
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
                      <CheckCircle className="w-6 h-6 text-primary" />
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
                      <CheckCircle className="w-6 h-6 text-primary" />
                    </div>
                    <div className="text-left">
                      <h3 className="font-semibold text-foreground">Bank Transfer</h3>
                      <p className="text-sm text-muted-foreground">Wire transfer</p>
                    </div>
                  </div>
                </button>
              </div>
            </div>

            {/* Deposit Form */}
            <div className="bg-card/50 backdrop-blur-sm rounded-xl border border-border p-6 sm:p-8 shadow-lg">
              <form onSubmit={handleSubmit} className="space-y-6">
                {/* Amount Input */}
                <div>
                  <label htmlFor="amount" className="block text-sm font-medium text-foreground mb-2">
                    Amount (USD)
                  </label>
                  <input
                    id="amount"
                    type="number"
                    step="0.01"
                    min="1000"
                    value={amount}
                    onChange={(e) => setAmount(e.target.value)}
                    className="mt-1 block w-full rounded-md border border-input bg-background px-3 py-2 text-sm shadow-sm focus:border-ring focus:outline-none focus:ring-1 focus:ring-ring"
                    placeholder="Minimum $1,000"
                    required
                  />
                  <p className="mt-1 text-sm text-muted-foreground">Minimum deposit: $1,000</p>
                </div>

                {/* Crypto Options */}
                {selectedMethod === 'crypto' && (
                  <div>
                    <label className="block text-sm font-medium text-foreground mb-3">
                      Select Cryptocurrency
                    </label>
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                      {Object.keys(cryptoAddresses).map((crypto) => (
                        <button
                          key={crypto}
                          type="button"
                          onClick={() => setCurrency(crypto)}
                          className={`p-3 border rounded-lg text-center transition-colors ${
                            currency === crypto
                              ? 'border-primary bg-primary/5 text-primary'
                              : 'border-border hover:bg-accent'
                          }`}
                        >
                          <div className="font-medium">{crypto}</div>
                        </button>
                      ))}
                    </div>

                    {/* Deposit Address */}
                    <div className="mt-6 p-4 bg-muted/30 rounded-lg">
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-sm font-medium text-foreground">
                          {currency} Deposit Address
                        </span>
                        <button
                          type="button"
                          onClick={() => handleCopyAddress(cryptoAddresses[currency as keyof typeof cryptoAddresses])}
                          className="flex items-center text-primary hover:text-primary/80 text-sm"
                        >
                          <Copy className="w-4 h-4 mr-1" />
                          Copy
                        </button>
                      </div>
                      <div className="p-3 bg-background border border-border rounded font-mono text-sm break-all">
                        {cryptoAddresses[currency as keyof typeof cryptoAddresses]}
                      </div>
                    </div>
                  </div>
                )}

                {/* Bank Transfer Info */}
                {selectedMethod === 'bank' && (
                  <div className="bg-muted/30 rounded-lg p-4">
                    <h3 className="font-medium text-foreground mb-3">Bank Transfer Details</h3>
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Bank Name:</span>
                        <span className="text-foreground">Veridian Bank Ltd.</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Account Number:</span>
                        <span className="text-foreground">1234567890</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Routing Number:</span>
                        <span className="text-foreground">021000021</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">SWIFT Code:</span>
                        <span className="text-foreground">VRDNUSNY</span>
                      </div>
                    </div>
                  </div>
                )}

                {/* Receipt Upload */}
                <div className="mb-6">
                  <label htmlFor="receipt" className="block text-sm font-medium text-foreground mb-2">
                    Upload Transaction Receipt *
                  </label>
                  <input
                    id="receipt"
                    type="file"
                    accept="image/*,.pdf"
                    onChange={(e) => setReceipt(e.target.files?.[0] || null)}
                    className="block w-full text-sm text-muted-foreground file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-medium file:bg-primary file:text-primary-foreground hover:file:bg-primary/90 border border-input rounded-md"
                    required
                  />
                  <p className="mt-1 text-sm text-muted-foreground">
                    Upload proof of your deposit transaction (JPG, PNG, or PDF)
                  </p>
                </div>

                <button
                  type="submit"
                  disabled={!receipt || isUploading}
                  className="w-full bg-primary text-primary-foreground py-3 px-4 rounded-md hover:bg-primary/90 transition-colors font-medium disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isUploading ? 'Uploading...' : 'Create Deposit Request'}
                </button>
              </form>
            </div>

            {/* Security Notice */}
            <div className="bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg p-4 mt-6">
              <div className="flex items-start">
                <CheckCircle className="w-5 h-5 text-green-600 dark:text-green-400 mt-0.5 mr-3 flex-shrink-0" />
                <div className="text-sm">
                  <p className="font-medium text-green-900 dark:text-green-200 mb-1">
                    Secure & Insured
                  </p>
                  <p className="text-green-800 dark:text-green-300">
                    Your deposits are protected by bank-level security and FDIC insurance up to $250,000.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DepositPage;