
import React, { useState } from 'react';
import { ArrowLeft, Copy, CheckCircle, AlertCircle } from 'lucide-react';
import { Link } from 'react-router-dom';
import { toast } from 'sonner';
import { useAuth } from '../contexts/AuthContext';
import { supabase } from '../integrations/supabase/client';

const DepositPage = () => {
  const { user } = useAuth();
  const [amount, setAmount] = useState('');
  const [currency, setCurrency] = useState('BTC');
  const [selectedMethod, setSelectedMethod] = useState('crypto');
  const [isSubmitting, setIsSubmitting] = useState(false);

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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!user) {
      toast.error('Please log in to make a deposit');
      return;
    }

    if (!amount || parseFloat(amount) <= 0) {
      toast.error('Please enter a valid amount');
      return;
    }

    setIsSubmitting(true);

    try {
      const { error } = await supabase
        .from('transactions')
        .insert({
          user_id: user.id,
          type: 'Deposit',
          amount: parseFloat(amount),
          currency: currency,
          status: 'Pending',
          hash: null
        });

      if (error) {
        console.error('Error creating deposit:', error);
        toast.error('Failed to create deposit request');
        return;
      }

      toast.success('Deposit request created successfully! Please send the funds to the provided address.');
      setAmount('');
    } catch (error) {
      console.error('Error:', error);
      toast.error('An error occurred while processing your request');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-background py-8 px-4 sm:px-6 lg:px-8 pt-20">
      <div className="max-w-2xl mx-auto">
        {/* Header */}
        <div className="flex items-center mb-6 sm:mb-8">
          <Link 
            to="/dashboard" 
            className="mr-3 sm:mr-4 p-2 hover:bg-accent rounded-lg transition-colors"
          >
            <ArrowLeft className="w-5 h-5 sm:w-6 sm:h-6 text-foreground" />
          </Link>
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold text-foreground">Make a Deposit</h1>
            <p className="text-muted-foreground mt-1">Add funds to your account</p>
          </div>
        </div>

        {/* Deposit Form */}
        <div className="bg-card rounded-xl shadow-sm border border-border p-4 sm:p-6 lg:p-8">
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Amount Input */}
            <div>
              <label htmlFor="amount" className="block text-sm font-medium text-foreground mb-2">
                Amount
              </label>
              <div className="relative">
                <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground">
                  $
                </span>
                <input
                  type="number"
                  id="amount"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  className="w-full pl-8 pr-3 py-3 border border-border rounded-lg focus:ring-2 focus:ring-primary focus:border-primary bg-background text-foreground placeholder-muted-foreground"
                  placeholder="0.00"
                  min="0"
                  step="0.01"
                  required
                />
              </div>
            </div>

            {/* Payment Method */}
            <div>
              <label className="block text-sm font-medium text-foreground mb-3">
                Payment Method
              </label>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <button
                  type="button"
                  onClick={() => setSelectedMethod('crypto')}
                  className={`p-4 border rounded-lg text-left transition-colors ${
                    selectedMethod === 'crypto'
                      ? 'border-primary bg-primary/5 text-primary'
                      : 'border-border hover:bg-accent'
                  }`}
                >
                  <div className="font-medium">Cryptocurrency</div>
                  <div className="text-sm text-muted-foreground">BTC, ETH, USDT, LTC</div>
                </button>
                <button
                  type="button"
                  onClick={() => setSelectedMethod('bank')}
                  className={`p-4 border rounded-lg text-left transition-colors ${
                    selectedMethod === 'bank'
                      ? 'border-primary bg-primary/5 text-primary'
                      : 'border-border hover:bg-accent'
                  }`}
                >
                  <div className="font-medium">Bank Transfer</div>
                  <div className="text-sm text-muted-foreground">Wire transfer</div>
                </button>
              </div>
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

                {/* Instructions */}
                <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-4 mt-4">
                  <div className="flex items-start">
                    <AlertCircle className="w-5 h-5 text-blue-600 dark:text-blue-400 mt-0.5 mr-3 flex-shrink-0" />
                    <div className="text-sm">
                      <p className="font-medium text-blue-900 dark:text-blue-200 mb-2">
                        Important Deposit Instructions:
                      </p>
                      <ul className="space-y-1 text-blue-800 dark:text-blue-300 list-disc list-inside">
                        <li>Send only {currency} to this address</li>
                        <li>Minimum deposit: $50</li>
                        <li>Deposits are processed after 3 network confirmations</li>
                        <li>Processing time: 10-30 minutes</li>
                      </ul>
                    </div>
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

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isSubmitting || !amount}
              className="w-full bg-primary text-primary-foreground py-3 px-4 rounded-lg hover:bg-primary/90 disabled:opacity-50 disabled:cursor-not-allowed transition-colors font-medium"
            >
              {isSubmitting ? (
                <div className="flex items-center justify-center">
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-primary-foreground mr-2"></div>
                  Processing...
                </div>
              ) : (
                'Create Deposit Request'
              )}
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
  );
};

export default DepositPage;
