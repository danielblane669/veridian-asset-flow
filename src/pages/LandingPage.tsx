
import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowDown, Shield, TrendingUp, Zap, Star, Mail, Phone, MapPin } from 'lucide-react';

const LandingPage = () => {
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors duration-300">
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-br from-purple-900 via-purple-800 to-white text-white">
        <div className="absolute inset-0 bg-black/20"></div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 lg:py-32">
          <div className="text-center">
            <h1 className="text-4xl md:text-6xl font-bold mb-6 animate-fade-in">
              Invest in Crypto with
              <span className="block bg-gradient-to-r from-purple-400 to-white bg-clip-text text-transparent">
                Veridian Assets
              </span>
            </h1>
            <p className="text-xl md:text-2xl mb-8 text-purple-100 max-w-3xl mx-auto animate-fade-in">
              Your trusted partner for cryptocurrency investments. Start building your digital wealth today with our secure and user-friendly platform.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center animate-fade-in">
              <Link
                to="/signup"
                className="bg-gradient-to-r from-purple-400 to-white text-purple-900 px-8 py-4 rounded-lg font-semibold text-lg hover:from-purple-300 hover:to-gray-100 transition-all duration-300 transform hover:scale-105"
              >
                Start Investing Now
              </Link>
              <Link
                to="/login"
                className="border-2 border-white text-white px-8 py-4 rounded-lg font-semibold text-lg hover:bg-white hover:text-purple-900 transition-all duration-300"
              >
                Login to Account
              </Link>
            </div>
          </div>
        </div>
        <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 animate-bounce">
          <ArrowDown className="w-6 h-6 text-white" />
        </div>
      </section>

      {/* How It Works Section */}
      <section id="how-it-works" className="py-20 bg-white dark:bg-gray-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">How It Works</h2>
            <p className="text-xl text-gray-600 dark:text-gray-300">Start your crypto investment journey in three simple steps</p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8">
            <div className="text-center group">
              <div className="w-20 h-20 bg-gradient-to-r from-purple-500 to-white rounded-full flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform duration-300">
                <span className="text-2xl font-bold text-purple-900">1</span>
              </div>
              <h3 className="text-2xl font-semibold text-gray-900 dark:text-white mb-4">Create Account</h3>
              <p className="text-gray-600 dark:text-gray-300">Sign up for free and verify your identity to get started with secure crypto investing.</p>
            </div>
            
            <div className="text-center group">
              <div className="w-20 h-20 bg-gradient-to-r from-purple-500 to-white rounded-full flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform duration-300">
                <span className="text-2xl font-bold text-purple-900">2</span>
              </div>
              <h3 className="text-2xl font-semibold text-gray-900 dark:text-white mb-4">Fund Your Account</h3>
              <p className="text-gray-600 dark:text-gray-300">Deposit funds using various cryptocurrencies with minimum deposit of $200.</p>
            </div>
            
            <div className="text-center group">
              <div className="w-20 h-20 bg-gradient-to-r from-purple-500 to-white rounded-full flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform duration-300">
                <span className="text-2xl font-bold text-purple-900">3</span>
              </div>
              <h3 className="text-2xl font-semibold text-gray-900 dark:text-white mb-4">Start Investing</h3>
              <p className="text-gray-600 dark:text-gray-300">Monitor your portfolio growth and withdraw your profits anytime with minimum withdrawal of $1,000.</p>
            </div>
          </div>
        </div>
      </section>

      {/* About Section */}
      <section id="about" className="py-20 bg-gray-50 dark:bg-gray-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-4xl font-bold text-gray-900 dark:text-white mb-6">About Veridian Assets</h2>
              <p className="text-lg text-gray-600 dark:text-gray-300 mb-6">
                Veridian Assets is a leading cryptocurrency investment platform that provides secure, reliable, and profitable investment opportunities. Our team of experts manages your investments to maximize returns while minimizing risks.
              </p>
              <div className="space-y-4">
                <div className="flex items-center space-x-3">
                  <Shield className="w-6 h-6 text-purple-500" />
                  <span className="text-gray-700 dark:text-gray-300">Bank-level security and encryption</span>
                </div>
                <div className="flex items-center space-x-3">
                  <TrendingUp className="w-6 h-6 text-purple-500" />
                  <span className="text-gray-700 dark:text-gray-300">Professional portfolio management</span>
                </div>
                <div className="flex items-center space-x-3">
                  <Zap className="w-6 h-6 text-purple-500" />
                  <span className="text-gray-700 dark:text-gray-300">Fast and reliable transactions</span>
                </div>
              </div>
            </div>
            <div className="lg:text-center">
              <div className="bg-gradient-to-br from-purple-500 to-white rounded-2xl p-8 text-purple-900">
                <h3 className="text-2xl font-bold mb-4">Why Choose Us?</h3>
                <div className="grid grid-cols-2 gap-4 text-center">
                  <div>
                    <div className="text-3xl font-bold">5+</div>
                    <div className="text-sm opacity-90">Years Experience</div>
                  </div>
                  <div>
                    <div className="text-3xl font-bold">10K+</div>
                    <div className="text-sm opacity-90">Happy Clients</div>
                  </div>
                  <div>
                    <div className="text-3xl font-bold">99.9%</div>
                    <div className="text-sm opacity-90">Uptime</div>
                  </div>
                  <div>
                    <div className="text-3xl font-bold">24/7</div>
                    <div className="text-sm opacity-90">Support</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="py-20 bg-white dark:bg-gray-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">What Our Clients Say</h2>
            <p className="text-xl text-gray-600 dark:text-gray-300">Hear from our satisfied investors</p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8">
            <div className="bg-gray-50 dark:bg-gray-700 p-6 rounded-xl">
              <div className="flex items-center mb-4">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="w-5 h-5 text-purple-400 fill-current" />
                ))}
              </div>
              <p className="text-gray-600 dark:text-gray-300 mb-4">
                "Veridian Assets has transformed my investment portfolio. The returns are excellent and the platform is so easy to use."
              </p>
              <div className="font-semibold text-gray-900 dark:text-white">Sarah Johnson</div>
              <div className="text-sm text-gray-500 dark:text-gray-400">Investor since 2022</div>
            </div>
            
            <div className="bg-gray-50 dark:bg-gray-700 p-6 rounded-xl">
              <div className="flex items-center mb-4">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="w-5 h-5 text-purple-400 fill-current" />
                ))}
              </div>
              <p className="text-gray-600 dark:text-gray-300 mb-4">
                "Professional service and great returns. I've been able to grow my crypto portfolio significantly with their help."
              </p>
              <div className="font-semibold text-gray-900 dark:text-white">Mike Chen</div>
              <div className="text-sm text-gray-500 dark:text-gray-400">Investor since 2021</div>
            </div>
            
            <div className="bg-gray-50 dark:bg-gray-700 p-6 rounded-xl">
              <div className="flex items-center mb-4">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="w-5 h-5 text-purple-400 fill-current" />
                ))}
              </div>
              <p className="text-gray-600 dark:text-gray-300 mb-4">
                "Secure, reliable, and profitable. Veridian Assets is the best crypto investment platform I've used."
              </p>
              <div className="font-semibold text-gray-900 dark:text-white">Emily Rodriguez</div>
              <div className="text-sm text-gray-500 dark:text-gray-400">Investor since 2023</div>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section id="faq" className="py-20 bg-gray-50 dark:bg-gray-900">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">Frequently Asked Questions</h2>
            <p className="text-xl text-gray-600 dark:text-gray-300">Get answers to common questions</p>
          </div>
          
          <div className="space-y-6">
            <div className="bg-white dark:bg-gray-800 rounded-xl p-6">
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">What is the minimum deposit amount?</h3>
              <p className="text-gray-600 dark:text-gray-300">The minimum deposit amount is $200 USD equivalent in cryptocurrency.</p>
            </div>
            
            <div className="bg-white dark:bg-gray-800 rounded-xl p-6">
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">What cryptocurrencies do you accept?</h3>
              <p className="text-gray-600 dark:text-gray-300">We accept Bitcoin (BTC), Ethereum (ETH), Litecoin (LTC), and XRP for deposits and withdrawals.</p>
            </div>
            
            <div className="bg-white dark:bg-gray-800 rounded-xl p-6">
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">How long does withdrawal processing take?</h3>
              <p className="text-gray-600 dark:text-gray-300">Withdrawal requests are typically reviewed and processed within 24-48 hours.</p>
            </div>
            
            <div className="bg-white dark:bg-gray-800 rounded-xl p-6">
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">Is my investment secure?</h3>
              <p className="text-gray-600 dark:text-gray-300">Yes, we use bank-level security measures including encryption and cold storage to protect your investments.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section id="contact" className="py-20 bg-white dark:bg-gray-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">Contact Us</h2>
            <p className="text-xl text-gray-600 dark:text-gray-300">Get in touch with our support team</p>
          </div>
          
          <div className="grid lg:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="w-16 h-16 bg-gradient-to-r from-purple-500 to-white rounded-full flex items-center justify-center mx-auto mb-4">
                <Mail className="w-8 h-8 text-purple-900" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">Email</h3>
              <p className="text-gray-600 dark:text-gray-300">support@veridianassets.com</p>
            </div>
            
            <div className="text-center">
              <div className="w-16 h-16 bg-gradient-to-r from-purple-500 to-white rounded-full flex items-center justify-center mx-auto mb-4">
                <Phone className="w-8 h-8 text-purple-900" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">Phone</h3>
              <p className="text-gray-600 dark:text-gray-300">+1 (555) 123-4567</p>
            </div>
            
            <div className="text-center">
              <div className="w-16 h-16 bg-gradient-to-r from-purple-500 to-white rounded-full flex items-center justify-center mx-auto mb-4">
                <MapPin className="w-8 h-8 text-purple-900" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">Address</h3>
              <p className="text-gray-600 dark:text-gray-300">123 Crypto Street, Digital City, DC 12345</p>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-4 gap-8">
            <div>
              <div className="flex items-center space-x-2 mb-4">
                <div className="w-8 h-8 bg-gradient-to-r from-purple-600 to-white rounded-lg flex items-center justify-center">
                  <span className="text-purple-900 font-bold text-sm">V</span>
                </div>
                <span className="text-xl font-bold">Veridian Assets</span>
              </div>
              <p className="text-gray-400">Your trusted cryptocurrency investment partner.</p>
            </div>
            
            <div>
              <h4 className="text-lg font-semibold mb-4">Quick Links</h4>
              <ul className="space-y-2 text-gray-400">
                <li><Link to="/about" className="hover:text-white transition-colors">About</Link></li>
                <li><Link to="/how-it-works" className="hover:text-white transition-colors">How It Works</Link></li>
                <li><Link to="/contact" className="hover:text-white transition-colors">Contact</Link></li>
              </ul>
            </div>
            
            <div>
              <h4 className="text-lg font-semibold mb-4">Support</h4>
              <ul className="space-y-2 text-gray-400">
                <li><a href="#" className="hover:text-white transition-colors">Help Center</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Privacy Policy</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Terms of Service</a></li>
              </ul>
            </div>
            
            <div>
              <h4 className="text-lg font-semibold mb-4">Connect</h4>
              <ul className="space-y-2 text-gray-400">
                <li><a href="#" className="hover:text-white transition-colors">Twitter</a></li>
                <li><a href="#" className="hover:text-white transition-colors">LinkedIn</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Telegram</a></li>
              </ul>
            </div>
          </div>
          
          <div className="border-t border-gray-800 mt-8 pt-8 text-center text-gray-400">
            <p>&copy; 2024 Veridian Assets. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default LandingPage;
