
import React from 'react';
import { Link } from 'react-router-dom';
import { TrendingUp, Shield, Users, Award, ArrowRight, CheckCircle, Star } from 'lucide-react';
import Navigation from '../components/Layout/Navigation';

const LandingPage = () => {
  const features = [
    {
      icon: <TrendingUp className="w-8 h-8" />,
      title: 'Smart Investment Strategies',
      description: 'AI-powered portfolio management that adapts to market conditions and maximizes your returns.'
    },
    {
      icon: <Shield className="w-8 h-8" />,
      title: 'Bank-Level Security',
      description: 'Your investments are protected with enterprise-grade security and insurance coverage.'
    },
    {
      icon: <Users className="w-8 h-8" />,
      title: 'Expert Advisory',
      description: 'Access to professional financial advisors and market insights to guide your decisions.'
    },
    {
      icon: <Award className="w-8 h-8" />,
      title: 'Proven Track Record',
      description: 'Consistent returns and satisfied clients across global markets and asset classes.'
    }
  ];

  const testimonials = [
    {
      name: 'Sarah Johnson',
      role: 'Entrepreneur',
      content: 'Veridian Assets transformed my financial future. The returns have been consistently impressive.',
      avatar: '👩‍💼'
    },
    {
      name: 'Michael Chen',
      role: 'Software Engineer',
      content: 'Professional service and transparent communication. I trust them with my long-term investments.',
      avatar: '👨‍💼'
    },
    {
      name: 'Emily Rodriguez',
      role: 'Doctor',
      content: 'The AI-driven approach gives me confidence that my portfolio is always optimized.',
      avatar: '👩‍⚕️'
    }
  ];

  const stats = [
    { number: '$1.6B+', label: 'Assets Under Management' },
    { number: '15,000+', label: 'Active Investors' },
    { number: '98%', label: 'Client Satisfaction' },
    { number: '12%', label: 'Average Annual Return' }
  ];

  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      
      {/* Hero Section - Enhanced for better mobile display */}
      <section className="pt-24 sm:pt-28 lg:pt-32 pb-16 sm:pb-20 lg:pb-24 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center">
            <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold text-foreground mb-6 sm:mb-8 leading-tight">
              Invest Smarter with{' '}
              <span className="text-primary">Veridian Assets</span>
            </h1>
            <p className="text-lg sm:text-xl lg:text-2xl text-muted-foreground mb-8 sm:mb-10 lg:mb-12 max-w-4xl mx-auto leading-relaxed">
              Professional investment management powered by AI technology. 
              Build wealth with confidence through our proven strategies and expert guidance.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 sm:gap-6 justify-center items-center">
              <Link
                to="/signup"
                className="w-full sm:w-auto bg-primary text-primary-foreground px-6 sm:px-8 py-3 sm:py-4 rounded-lg hover:bg-primary/90 transition-colors font-semibold text-base sm:text-lg inline-flex items-center justify-center"
              >
                Start Investing Today
                <ArrowRight className="ml-2 w-5 h-5" />
              </Link>
              <Link
                to="#how-it-works"
                className="w-full sm:w-auto border border-border text-foreground px-6 sm:px-8 py-3 sm:py-4 rounded-lg hover:bg-accent transition-colors font-semibold text-base sm:text-lg"
              >
                Learn More
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-12 sm:py-16 lg:py-20 bg-muted/30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 sm:gap-8">
            {stats.map((stat, index) => (
              <div key={index} className="text-center">
                <div className="text-2xl sm:text-3xl md:text-4xl font-bold text-primary mb-2">
                  {stat.number}
                </div>
                <div className="text-sm sm:text-base text-muted-foreground">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="about" className="py-16 sm:py-20 lg:py-24 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12 sm:mb-16">
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-foreground mb-4">
              Why Choose Veridian Assets?
            </h2>
            <p className="text-lg sm:text-xl text-muted-foreground max-w-3xl mx-auto">
              We combine cutting-edge technology with proven investment strategies 
              to deliver superior returns for our clients.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {features.map((feature, index) => (
              <div key={index} className="bg-card p-6 rounded-xl shadow-sm border border-border hover:shadow-md transition-shadow">
                <div className="text-primary mb-4">{feature.icon}</div>
                <h3 className="text-xl font-semibold text-card-foreground mb-3">
                  {feature.title}
                </h3>
                <p className="text-muted-foreground">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section id="how-it-works" className="py-16 sm:py-20 lg:py-24 bg-muted/30 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12 sm:mb-16">
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-foreground mb-4">
              How It Works
            </h2>
            <p className="text-lg sm:text-xl text-muted-foreground max-w-3xl mx-auto">
              Getting started with Veridian Assets is simple and straightforward.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="w-16 h-16 bg-primary text-primary-foreground rounded-full flex items-center justify-center text-2xl font-bold mx-auto mb-4">
                1
              </div>
              <h3 className="text-xl font-semibold text-foreground mb-3">Sign Up</h3>
              <p className="text-muted-foreground">
                Create your account in minutes with our simple registration process.
              </p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-primary text-primary-foreground rounded-full flex items-center justify-center text-2xl font-bold mx-auto mb-4">
                2
              </div>
              <h3 className="text-xl font-semibold text-foreground mb-3">Fund Your Account</h3>
              <p className="text-muted-foreground">
                Deposit funds securely using various payment methods including crypto and bank transfers.
              </p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-primary text-primary-foreground rounded-full flex items-center justify-center text-2xl font-bold mx-auto mb-4">
                3
              </div>
              <h3 className="text-xl font-semibold text-foreground mb-3">Watch It Grow</h3>
              <p className="text-muted-foreground">
                Our AI manages your portfolio automatically while you track your returns in real-time.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="py-16 sm:py-20 lg:py-24 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12 sm:mb-16">
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-foreground mb-4">
              What Our Clients Say
            </h2>
            <p className="text-lg sm:text-xl text-muted-foreground max-w-3xl mx-auto">
              Join thousands of satisfied investors who trust Veridian Assets with their financial future.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {testimonials.map((testimonial, index) => (
              <div key={index} className="bg-card p-6 rounded-xl shadow-sm border border-border">
                <div className="flex items-center mb-4">
                  <div className="text-2xl mr-3">{testimonial.avatar}</div>
                  <div>
                    <h4 className="font-semibold text-card-foreground">{testimonial.name}</h4>
                    <p className="text-sm text-muted-foreground">{testimonial.role}</p>
                  </div>
                </div>
                <div className="flex mb-3">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                  ))}
                </div>
                <p className="text-muted-foreground italic">"{testimonial.content}"</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section id="faq" className="py-16 sm:py-20 lg:py-24 bg-muted/30 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-12 sm:mb-16">
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-foreground mb-4">
              Frequently Asked Questions
            </h2>
          </div>

          <div className="space-y-6">
            {[
              {
                question: "How does Veridian Assets generate returns?",
                answer: "We use a combination of AI-driven analysis, diversified portfolios, and expert oversight to identify and capitalize on market opportunities across various asset classes."
              },
              {
                question: "What is the minimum investment amount?",
                answer: "The minimum investment starts at $1,000, making our platform accessible to a wide range of investors."
              },
              {
                question: "How can I withdraw my funds?",
                answer: "You can withdraw your funds anytime through our secure platform using bank transfers or cryptocurrency, with processing times typically 1-3 business days."
              },
              {
                question: "Is my investment insured?",
                answer: "Yes, all client funds are protected through comprehensive insurance coverage and segregated accounts for maximum security."
              }
            ].map((faq, index) => (
              <div key={index} className="bg-card p-6 rounded-xl shadow-sm border border-border">
                <h3 className="text-lg font-semibold text-card-foreground mb-3 flex items-center">
                  <CheckCircle className="w-5 h-5 text-primary mr-2" />
                  {faq.question}
                </h3>
                <p className="text-muted-foreground pl-7">{faq.answer}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 sm:py-20 lg:py-24 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-foreground mb-4">
            Ready to Start Your Investment Journey?
          </h2>
          <p className="text-lg sm:text-xl text-muted-foreground mb-8">
            Join Veridian Assets today and take control of your financial future.
          </p>
          <Link
            to="/signup"
            className="bg-primary text-primary-foreground px-6 sm:px-8 py-3 sm:py-4 rounded-lg hover:bg-primary/90 transition-colors font-semibold text-base sm:text-lg inline-flex items-center"
          >
            Get Started Now
            <ArrowRight className="ml-2 w-5 h-5" />
          </Link>
        </div>
      </section>

      {/* Contact Section */}
      <section id="contact" className="py-16 sm:py-20 lg:py-24 bg-muted/30 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-foreground mb-4">
            Get In Touch
          </h2>
          <p className="text-lg sm:text-xl text-muted-foreground mb-8">
            Have questions? Our team is here to help you make informed investment decisions.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a
              href="mailto:support@veridiancapital.com"
              className="bg-card text-card-foreground px-6 py-3 rounded-lg hover:bg-accent transition-colors border border-border"
            >
              Email Support
            </a>
            <a
              href="tel:+1-555-0123"
              className="bg-card text-card-foreground px-6 py-3 rounded-lg hover:bg-accent transition-colors border border-border"
            >
              Call Us
            </a>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-card border-t border-border py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center">
            <div className="flex items-center justify-center space-x-2 mb-4">
              <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
                <span className="text-primary-foreground font-bold text-sm">V</span>
              </div>
              <span className="text-xl font-bold text-card-foreground">Veridian Assets</span>
            </div>
            <p className="text-muted-foreground mb-4">
              Professional investment management for the digital age.
            </p>
            <p className="text-sm text-muted-foreground">
              © 2024 Veridian Assets. All rights reserved. | Investment advisory services provided by licensed professionals.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default LandingPage;
