import React from 'react';
import { Link } from 'react-router-dom';
import { Building2, Shield, Zap, MapPin, Bell, BarChart3, ArrowRight, Star, CheckCircle } from 'lucide-react';

const features = [
  { icon: '🕳️', title: 'Potholes', desc: 'Report road surface damage' },
  { icon: '🗑️', title: 'Garbage', desc: 'Waste collection issues' },
  { icon: '💧', title: 'Water Leakage', desc: 'Pipe leaks and supply problems' },
  { icon: '💡', title: 'Streetlights', desc: 'Broken or missing lighting' },
  { icon: '🚰', title: 'Sewage', desc: 'Drainage blockage' },
  { icon: '🚦', title: 'Traffic Signals', desc: 'Signal malfunctions' },
];

const stats = [
  { label: 'Complaints Resolved', value: '12,000+', icon: CheckCircle },
  { label: 'Active Citizens', value: '45,000+', icon: Shield },
  { label: 'Cities Covered', value: '50+', icon: MapPin },
  { label: 'Avg Resolution', value: '3 Days', icon: Zap },
];

export default function LandingPage() {
  return (
    <div className="min-h-screen text-white overflow-x-hidden" style={{ background: '#0a0f1e' }}>
      {/* Navbar */}
      <nav className="fixed top-0 left-0 right-0 z-50 glass border-b border-white/5">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-primary-600 to-primary-400 flex items-center justify-center">
              <Building2 className="w-5 h-5 text-white" />
            </div>
            <span className="text-white font-bold text-lg">CitizenConnect</span>
          </div>
          <div className="flex items-center gap-3">
            <Link to="/login" className="text-gray-300 hover:text-white text-sm font-medium px-4 py-2 rounded-lg hover:bg-white/5 transition-all">Login</Link>
            <Link to="/register" className="btn-primary !py-2 !px-5 text-sm">Get Started</Link>
          </div>
        </div>
      </nav>

      {/* Hero */}
      <section className="relative min-h-screen flex items-center justify-center px-4 pt-16">
        {/* BG effects */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-1/4 -left-20 w-96 h-96 bg-primary-600/20 rounded-full blur-3xl animate-pulse-slow"></div>
          <div className="absolute bottom-1/4 -right-20 w-96 h-96 bg-purple-600/20 rounded-full blur-3xl animate-pulse-slow animate-delay-300"></div>
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-primary-900/10 rounded-full blur-3xl"></div>
        </div>

        <div className="relative z-10 text-center max-w-4xl mx-auto">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary-500/10 border border-primary-500/30 text-primary-300 text-sm font-medium mb-8 animate-fade-in">
            <Zap className="w-4 h-4" />
            🏛️ Government of India Initiative
          </div>
          <h1 className="text-5xl sm:text-6xl lg:text-7xl font-black text-white leading-tight mb-6 animate-slide-up">
            Your Voice,
            <span className="block bg-gradient-to-r from-primary-400 to-purple-400 bg-clip-text text-transparent">
              Heard & Resolved
            </span>
          </h1>
          <p className="text-xl text-gray-400 max-w-2xl mx-auto mb-10 animate-slide-up animate-delay-100">
            Report civic issues, track resolution progress, and connect directly with government authorities. Making cities better, together.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 animate-slide-up animate-delay-200">
            <Link to="/register" className="btn-primary flex items-center gap-2 text-lg !px-8 !py-4">
              Report an Issue <ArrowRight className="w-5 h-5" />
            </Link>
            <Link to="/login" className="btn-secondary flex items-center gap-2 text-lg !px-8 !py-4">
              Track Complaint
            </Link>
          </div>
        </div>
      </section>

      {/* Stats */}
      <section className="py-16 px-4">
        <div className="max-w-6xl mx-auto grid grid-cols-2 lg:grid-cols-4 gap-4">
          {stats.map(({ label, value, icon: Icon }) => (
            <div key={label} className="glass-card rounded-2xl p-6 text-center hover:scale-105 transition-transform duration-300">
              <Icon className="w-8 h-8 text-primary-400 mx-auto mb-3" />
              <p className="text-3xl font-black text-white">{value}</p>
              <p className="text-gray-400 text-sm mt-1">{label}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Categories */}
      <section className="py-16 px-4">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold text-white mb-4">Report Any Civic Issue</h2>
            <p className="text-gray-400">11 categories covering all public infrastructure problems</p>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
            {features.map(({ icon, title, desc }) => (
              <div key={title} className="glass-card rounded-2xl p-4 text-center hover:scale-105 hover:border-primary-500/30 transition-all duration-300 cursor-default group">
                <div className="text-4xl mb-3 group-hover:scale-110 transition-transform">{icon}</div>
                <p className="text-white font-semibold text-sm">{title}</p>
                <p className="text-gray-500 text-xs mt-1">{desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How it works */}
      <section className="py-16 px-4">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold text-white mb-4">How It Works</h2>
          </div>
          <div className="grid md:grid-cols-3 gap-8">
            {[
              { step: '01', icon: '📝', title: 'Register & Report', desc: 'Create an account and submit your complaint with photos and location.' },
              { step: '02', icon: '🔍', title: 'Track Progress', desc: 'Get real-time updates as authorities review and work on your complaint.' },
              { step: '03', icon: '✅', title: 'Issue Resolved', desc: 'Receive notification when the issue is resolved. Rate the service.' }
            ].map(({ step, icon, title, desc }) => (
              <div key={step} className="relative glass-card rounded-2xl p-8 text-center">
                <div className="text-xs font-black text-primary-400 mb-4">{step}</div>
                <div className="text-5xl mb-4">{icon}</div>
                <h3 className="text-white text-xl font-bold mb-2">{title}</h3>
                <p className="text-gray-400">{desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 px-4">
        <div className="max-w-3xl mx-auto text-center glass-card rounded-3xl p-12 relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-primary-900/50 to-purple-900/30"></div>
          <div className="relative z-10">
            <h2 className="text-4xl font-bold text-white mb-4">Ready to Make a Difference?</h2>
            <p className="text-gray-400 text-lg mb-8">Join thousands of citizens making their city better every day.</p>
            <Link to="/register" className="btn-primary inline-flex items-center gap-2 text-lg !px-10 !py-4">
              Get Started Free <ArrowRight className="w-5 h-5" />
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-white/5 py-8 px-4 text-center">
        <p className="text-gray-500 text-sm">© 2024 CitizenConnect. A Government of India Smart City Initiative.</p>
      </footer>
    </div>
  );
}
