
import React, { useState } from 'react';
import { Menu, Copy, Upload, CheckCircle } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { toast } from 'sonner';
import Sidebar from '../components/Dashboard/Sidebar';
import MobileMenu from '../components/Dashboard/MobileMenu';

const DepositPage = () => {
  const { user } = useAuth();
  const [isSidebarExpanded, setIsSidebarExpanded] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [selectedCrypto, setSelectedCrypto] = useState('bitcoin');
  const [amount, setAmount] = useState('');
  const [receipt, setReceipt] = useState<File | null>(null);
  const [showSuccess, setShowSuccess] = useState(false);

  const cryptoOptions = [
    { value: 'bitcoin', label: 'Bitcoin (BTC)', address: '1A1zP1eP5QGefi2DMPTfTL5SLmv7DivfNa' },
    { value: 'ethereum', label: 'Ethereum (ETH)', address: '0x742F2c7b8b8E76BAE9E87C5C8b5F7A7e3b5F8c4d' },
    { value: 'litecoin', label: 'Litecoin (LTC)', address: 'LTC1234567890abcdefghijklmnopqrstuvwxyz' },
    { value: 'xrp', label: 'XRP', address: 'rXRP1234567890abcdefghijklmnopqrstuvwxyz' },
  ];

  const selectedCryptoData = cryptoOptions.find(crypto => crypto.value === selectedCrypto);

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    toast.success('Address copied to clipboard!');
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setReceipt(e.target.files[0]);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!amount || parseFloat(amount) < 200) {
      toast.error('Minimum deposit amount is $200');
      return;
    }
    
    if (!receipt) {
      toast.error('Please upload a payment receipt');
      return;
    }

    setShowSuccess(true);
    
    // Auto-redirect after 10 seconds
    setTimeout(() => {
      window.location.href = '/dashboard';
    }, 10000);
  };

  if (showSuccess) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="max-w-md w-full bg-card rounded-xl shadow-lg p-8 text-center">
          <CheckCircle className="w-16 h-16 text-green-500 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-foreground mb-4">
            Deposit Request Submitted
          </h2>
          <p className="text-muted-foreground mb-6">
            Your deposit is being reviewed. We will communicate via email if the deposit is approved or denied.
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
        <div className="lg:hidden flex items-center justify-between p-4 bg-card shadow-sm">
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
              <span className="text-primary-foreground font-bold text-sm">V</span>
            </div>
            <span className="text-lg font-bold text-foreground">Deposit</span>
          </div>
          <button
            onClick={() => setIsMobileMenuOpen(true)}
            className="p-2 text-muted-foreground hover:bg-accent hover:text-accent-foreground rounded-lg"
          >
            <Menu className="w-6 h-6" />
          </button>
        </div>

        {/* Deposit Content */}
        <div className="p-6">
          <div className="max-w-2xl mx-auto">
            <h1 className="text-3xl font-bold text-foreground mb-2">
              Deposit Funds
            </h1>
            <p className="text-muted-foreground mb-8">
              Fund your account with cryptocurrency (Minimum: $200)
            </p>

            <div className="bg-card rounded-xl shadow-lg p-6">
              <form onSubmit={handleSubmit} className="space-y-6">
                {/* Cryptocurrency Selection */}
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

                {/* Wallet Address */}
                <div>
                  <label className="block text-sm font-medium text-foreground mb-2">
                    Wallet Address
                  </label>
                  <div className="flex items-center space-x-2">
                    <input
                      type="text"
                      value={selectedCryptoData?.address || ''}
                      readOnly
                      className="flex-1 px-3 py-2 border border-border rounded-md shadow-sm bg-muted text-foreground"
                    />
                    <button
                      type="button"
                      onClick={() => copyToClipboard(selectedCryptoData?.address || '')}
                      className="px-3 py-2 bg-primary text-primary-foreground rounded-md hover:bg-primary/90 transition-colors"
                    >
                      <Copy className="w-4 h-4" />
                    </button>
                  </div>
                  <p className="text-sm text-muted-foreground mt-1">
                    Send your {selectedCryptoData?.label} to this address
                  </p>
                </div>

                {/* Amount */}
                <div>
                  <label className="block text-sm font-medium text-foreground mb-2">
                    Deposit Amount (USD)
                  </label>
                  <input
                    type="number"
                    min="200"
                    step="0.01"
                    value={amount}
                    onChange={(e) => setAmount(e.target.value)}
                    placeholder="Minimum $200"
                    className="w-full px-3 py-2 border border-border rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary bg-background text-foreground"
                    required
                  />
                </div>

                {/* Receipt Upload */}
                <div>
                  <label className="block text-sm font-medium text-foreground mb-2">
                    Payment Receipt
                  </label>
                  <div className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-border border-dashed rounded-md">
                    <div className="space-y-1 text-center">
                      <Upload className="mx-auto h-12 w-12 text-muted-foreground" />
                      <div className="flex text-sm text-muted-foreground">
                        <label
                          htmlFor="receipt"
                          className="relative cursor-pointer bg-background rounded-md font-medium text-primary hover:text-primary/90 focus-within:outline-none focus-within:ring-2 focus-within:ring-offset-2 focus-within:ring-primary"
                        >
                          <span>Upload a file</span>
                          <input
                            id="receipt"
                            name="receipt"
                            type="file"
                            accept="image/*,.pdf"
                            onChange={handleFileChange}
                            className="sr-only"
                            required
                          />
                        </label>
                        <p className="pl-1">or drag and drop</p>
                      </div>
                      <p className="text-xs text-muted-foreground">
                        PNG, JPG, PDF up to 10MB
                      </p>
                      {receipt && (
                        <p className="text-sm text-green-600 dark:text-green-400">
                          File selected: {receipt.name}
                        </p>
                      )}
                    </div>
                  </div>
                </div>

                {/* Submit Button */}
                <button
                  type="submit"
                  className="w-full bg-primary text-primary-foreground py-3 px-4 rounded-md hover:bg-primary/90 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary font-medium transition-all duration-300"
                >
                  Place Deposit Request
                </button>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DepositPage;
