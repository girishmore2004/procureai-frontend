import React from 'react';
import { Link } from 'react-router-dom';
import {
  ShoppingCart, Building2, Truck, CheckCircle,
  BarChart2, Shield, Zap, ArrowRight,
} from 'lucide-react';

const FEATURES = [
  { icon: ShoppingCart, title: 'Purchase Requests', desc: 'Raise and approve procurement requests with multi-level workflows.' },
  { icon: Truck, title: 'Vendor Management', desc: 'Onboard vendors, send RFQs, compare quotes with AI, and track performance.' },
  { icon: CheckCircle, title: '3-Way Invoice Matching', desc: 'Automatically match invoices against POs and GRNs. Flag mismatches instantly.' },
  { icon: BarChart2, title: 'Analytics & Reports', desc: 'Spend by vendor, cycle times, savings, and vendor score trends in one dashboard.' },
  { icon: Shield, title: 'Role-Based Access', desc: 'Requesters, approvers, finance, warehouse — each role sees only what they need.' },
  { icon: Zap, title: 'AI-Powered', desc: 'OCR quote extraction, AI vendor recommendation, and plain-language explanations.' },
];

export default function HomePage() {
  return (
    <div className="min-h-screen bg-white">
      {/* Nav */}
      <nav className="border-b border-gray-100 px-6 py-4 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 bg-brand-600 rounded-lg flex items-center justify-center">
            <ShoppingCart className="w-4 h-4 text-white" />
          </div>
          <span className="font-bold text-gray-900 text-lg">ProcureAI</span>
        </div>
        <div className="flex items-center gap-3">
          <Link
            to="/vendor-portal/login"
            className="text-sm text-gray-600 hover:text-brand-600 font-medium"
          >
            Vendor Portal
          </Link>
          <Link to="/login" className="btn-secondary text-sm py-1.5 px-4">
            Company Login
          </Link>
          <Link to="/signup" className="btn-primary text-sm py-1.5 px-4">
            Get Started
          </Link>
        </div>
      </nav>

      {/* Hero */}
      <section className="max-w-5xl mx-auto px-6 pt-20 pb-16 text-center">
        <div className="inline-flex items-center gap-2 bg-brand-50 text-brand-700 text-xs font-semibold px-3 py-1.5 rounded-full mb-6">
          <Zap className="w-3.5 h-3.5" /> AI-Powered Procurement for SMEs
        </div>
        <h1 className="text-4xl md:text-5xl font-bold text-gray-900 leading-tight mb-5">
          Your Digital<br />
          <span className="text-brand-600">Procurement Head</span>
        </h1>
        <p className="text-lg text-gray-500 max-w-2xl mx-auto mb-8">
          Replace WhatsApp, Excel, and manual vendor follow-ups with one platform.
          From purchase requests to invoice matching — fully automated, fully audited.
        </p>
        <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
          <Link
            to="/signup"
            className="btn-primary flex items-center gap-2 text-base px-6 py-3"
          >
            Start Free Trial <ArrowRight className="w-4 h-4" />
          </Link>
          <Link
            to="/login"
            className="btn-secondary flex items-center gap-2 text-base px-6 py-3"
          >
            Company Login
          </Link>
        </div>
      </section>

      {/* Vendor CTA strip */}
      <section className="bg-gray-50 border-y border-gray-100 py-5">
        <div className="max-w-5xl mx-auto px-6 flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <Building2 className="w-5 h-5 text-brand-600" />
            <p className="text-sm text-gray-700 font-medium">
              Are you a <strong>Supplier / Vendor?</strong> Manage your catalog and respond to RFQs.
            </p>
          </div>
          <Link
            to="/vendor-portal/login"
            className="btn-secondary flex items-center gap-2 text-sm shrink-0"
          >
            <Truck className="w-4 h-4" /> Vendor Portal Login
          </Link>
        </div>
      </section>

      {/* Features */}
      <section className="max-w-5xl mx-auto px-6 py-16">
        <h2 className="text-2xl font-bold text-gray-900 text-center mb-10">
          Everything procurement in one place
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {FEATURES.map(({ icon: Icon, title, desc }) => (
            <div key={title} className="p-5 rounded-xl border border-gray-100 hover:border-brand-200 hover:shadow-sm transition">
              <div className="w-9 h-9 bg-brand-50 rounded-lg flex items-center justify-center mb-3">
                <Icon className="w-4 h-4 text-brand-600" />
              </div>
              <h3 className="font-semibold text-gray-800 mb-1">{title}</h3>
              <p className="text-sm text-gray-500">{desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Workflow steps */}
      <section className="bg-brand-600 py-14">
        <div className="max-w-5xl mx-auto px-6">
          <h2 className="text-2xl font-bold text-white text-center mb-10">
            How it works
          </h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {[
              { step: '01', label: 'Raise PR', desc: 'Department creates purchase request' },
              { step: '02', label: 'Get Quotes', desc: 'RFQ sent to vendors, AI extracts prices' },
              { step: '03', label: 'Issue PO', desc: 'AI recommends best vendor, PO generated' },
              { step: '04', label: 'Match & Pay', desc: '3-way match, invoice approved for payment' },
            ].map(({ step, label, desc }) => (
              <div key={step} className="text-center">
                <div className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center text-white font-bold text-sm mx-auto mb-2">
                  {step}
                </div>
                <p className="text-white font-semibold text-sm mb-1">{label}</p>
                <p className="text-brand-100 text-xs">{desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="max-w-5xl mx-auto px-6 py-16 text-center">
        <h2 className="text-2xl font-bold text-gray-900 mb-3">
          Ready to streamline your procurement?
        </h2>
        <p className="text-gray-500 mb-6">
          Free trial · No credit card · Setup in 5 minutes
        </p>
        <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
          <Link to="/signup" className="btn-primary flex items-center gap-2 px-8 py-3 text-base">
            Create Company Account <ArrowRight className="w-4 h-4" />
          </Link>
          <Link to="/vendor-portal/login" className="btn-secondary flex items-center gap-2 px-6 py-3 text-base">
            <Truck className="w-4 h-4" /> I'm a Vendor
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-gray-100 py-6 text-center text-xs text-gray-400">
        © {new Date().getFullYear()} ProcureAI · Built for Indian SMEs
      </footer>
    </div>
  );
}
