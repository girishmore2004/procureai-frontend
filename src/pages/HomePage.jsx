// import React from 'react';
// import { Link } from 'react-router-dom';
// import {
//   ShoppingCart, Building2, Truck, CheckCircle,
//   BarChart2, Shield, Zap, ArrowRight,
// } from 'lucide-react';

// const FEATURES = [
//   { icon: ShoppingCart, title: 'Purchase Requests', desc: 'Raise and approve procurement requests with multi-level workflows.' },
//   { icon: Truck, title: 'Vendor Management', desc: 'Onboard vendors, send RFQs, compare quotes with AI, and track performance.' },
//   { icon: CheckCircle, title: '3-Way Invoice Matching', desc: 'Automatically match invoices against POs and GRNs. Flag mismatches instantly.' },
//   { icon: BarChart2, title: 'Analytics & Reports', desc: 'Spend by vendor, cycle times, savings, and vendor score trends in one dashboard.' },
//   { icon: Shield, title: 'Role-Based Access', desc: 'Requesters, approvers, finance, warehouse — each role sees only what they need.' },
//   { icon: Zap, title: 'AI-Powered', desc: 'OCR quote extraction, AI vendor recommendation, and plain-language explanations.' },
// ];

// export default function HomePage() {
//   return (
//     <div className="min-h-screen bg-white">
//       {/* Nav */}
//       <nav className="border-b border-gray-100 px-6 py-4 flex items-center justify-between">
//         <div className="flex items-center gap-2">
//           <div className="w-8 h-8 bg-brand-600 rounded-lg flex items-center justify-center">
//             <ShoppingCart className="w-4 h-4 text-white" />
//           </div>
//           <span className="font-bold text-gray-900 text-lg">ProcureAI</span>
//         </div>
//         <div className="flex items-center gap-3">
//           <Link
//             to="/vendor-portal/login"
//             className="text-sm text-gray-600 hover:text-brand-600 font-medium"
//           >
//             Vendor Portal
//           </Link>
//           <Link to="/login" className="btn-secondary text-sm py-1.5 px-4">
//             Company Login
//           </Link>
//           <Link to="/signup" className="btn-primary text-sm py-1.5 px-4">
//             Get Started
//           </Link>
//         </div>
//       </nav>

//       {/* Hero */}
//       <section className="max-w-5xl mx-auto px-6 pt-20 pb-16 text-center">
//         <div className="inline-flex items-center gap-2 bg-brand-50 text-brand-700 text-xs font-semibold px-3 py-1.5 rounded-full mb-6">
//           <Zap className="w-3.5 h-3.5" /> AI-Powered Procurement for SMEs
//         </div>
//         <h1 className="text-4xl md:text-5xl font-bold text-gray-900 leading-tight mb-5">
//           Your Digital<br />
//           <span className="text-brand-600">Procurement Head</span>
//         </h1>
//         <p className="text-lg text-gray-500 max-w-2xl mx-auto mb-8">
//           Replace WhatsApp, Excel, and manual vendor follow-ups with one platform.
//           From purchase requests to invoice matching — fully automated, fully audited.
//         </p>
//         <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
//           <Link
//             to="/signup"
//             className="btn-primary flex items-center gap-2 text-base px-6 py-3"
//           >
//             Start Free Trial <ArrowRight className="w-4 h-4" />
//           </Link>
//           <Link
//             to="/login"
//             className="btn-secondary flex items-center gap-2 text-base px-6 py-3"
//           >
//             Company Login
//           </Link>
//         </div>
//       </section>

//       {/* Vendor CTA strip */}
//       <section className="bg-gray-50 border-y border-gray-100 py-5">
//         <div className="max-w-5xl mx-auto px-6 flex flex-col sm:flex-row items-center justify-between gap-3">
//           <div className="flex items-center gap-3">
//             <Building2 className="w-5 h-5 text-brand-600" />
//             <p className="text-sm text-gray-700 font-medium">
//               Are you a <strong>Supplier / Vendor?</strong> Manage your catalog and respond to RFQs.
//             </p>
//           </div>
//           <Link
//             to="/vendor-portal/login"
//             className="btn-secondary flex items-center gap-2 text-sm shrink-0"
//           >
//             <Truck className="w-4 h-4" /> Vendor Portal Login
//           </Link>
//         </div>
//       </section>

//       {/* Features */}
//       <section className="max-w-5xl mx-auto px-6 py-16">
//         <h2 className="text-2xl font-bold text-gray-900 text-center mb-10">
//           Everything procurement in one place
//         </h2>
//         <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
//           {FEATURES.map(({ icon: Icon, title, desc }) => (
//             <div key={title} className="p-5 rounded-xl border border-gray-100 hover:border-brand-200 hover:shadow-sm transition">
//               <div className="w-9 h-9 bg-brand-50 rounded-lg flex items-center justify-center mb-3">
//                 <Icon className="w-4 h-4 text-brand-600" />
//               </div>
//               <h3 className="font-semibold text-gray-800 mb-1">{title}</h3>
//               <p className="text-sm text-gray-500">{desc}</p>
//             </div>
//           ))}
//         </div>
//       </section>

//       {/* Workflow steps */}
//       <section className="bg-brand-600 py-14">
//         <div className="max-w-5xl mx-auto px-6">
//           <h2 className="text-2xl font-bold text-white text-center mb-10">
//             How it works
//           </h2>
//           <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
//             {[
//               { step: '01', label: 'Raise PR', desc: 'Department creates purchase request' },
//               { step: '02', label: 'Get Quotes', desc: 'RFQ sent to vendors, AI extracts prices' },
//               { step: '03', label: 'Issue PO', desc: 'AI recommends best vendor, PO generated' },
//               { step: '04', label: 'Match & Pay', desc: '3-way match, invoice approved for payment' },
//             ].map(({ step, label, desc }) => (
//               <div key={step} className="text-center">
//                 <div className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center text-white font-bold text-sm mx-auto mb-2">
//                   {step}
//                 </div>
//                 <p className="text-white font-semibold text-sm mb-1">{label}</p>
//                 <p className="text-brand-100 text-xs">{desc}</p>
//               </div>
//             ))}
//           </div>
//         </div>
//       </section>

//       {/* CTA */}
//       <section className="max-w-5xl mx-auto px-6 py-16 text-center">
//         <h2 className="text-2xl font-bold text-gray-900 mb-3">
//           Ready to streamline your procurement?
//         </h2>
//         <p className="text-gray-500 mb-6">
//           Free trial · No credit card · Setup in 5 minutes
//         </p>
//         <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
//           <Link to="/signup" className="btn-primary flex items-center gap-2 px-8 py-3 text-base">
//             Create Company Account <ArrowRight className="w-4 h-4" />
//           </Link>
//           <Link to="/vendor-portal/login" className="btn-secondary flex items-center gap-2 px-6 py-3 text-base">
//             <Truck className="w-4 h-4" /> I'm a Vendor
//           </Link>
//         </div>
//       </section>

//       {/* Footer */}
//       <footer className="border-t border-gray-100 py-6 text-center text-xs text-gray-400">
//         © {new Date().getFullYear()} ProcureAI · Built for Indian SMEs
//       </footer>
//     </div>
//   );
// }


import React from 'react';
import { Link } from 'react-router-dom';
import {
  ShoppingCart, Building2, Truck, CheckCircle, BarChart2, Shield, Zap, ArrowRight,
  ClipboardList, FileText, PackageCheck, Receipt, Wallet, ScanLine, PenLine,
  Package, Lock, Users, Clock, Sparkles,
} from 'lucide-react';

const FEATURES = [
  { icon: ShoppingCart, title: 'Purchase Requests', desc: 'Raise and approve procurement requests with multi-level workflows.' },
  { icon: Truck, title: 'Vendor Management', desc: 'One vendor list — add vendors yourself or invite them by email to self-register. No duplicate vendor screens.' },
  { icon: CheckCircle, title: '3-Way Invoice Matching', desc: 'Automatically match invoices against POs and goods receipts. Flag mismatches instantly.' },
  { icon: Wallet, title: 'Controlled Payments', desc: 'Payments only queue after invoice approval, and only execute once you release them — never automatic.' },
  { icon: BarChart2, title: 'Analytics & Reports', desc: 'Spend by vendor, cycle times, savings, and vendor score trends in one dashboard.' },
  { icon: Shield, title: 'Role-Based Access', desc: 'Requesters, approvers, finance, warehouse — each role sees only what they need.' },
];

const BUYER_STEPS = [
  { icon: ClipboardList, title: 'Raise a Request', desc: 'Pick items straight from your Item Master — no retyping, no ambiguity about what\u2019s being bought.' },
  { icon: FileText, title: 'Send RFQs', desc: 'Approved requests go out to shortlisted vendors from your one vendor list, with the exact item lines attached.' },
  { icon: BarChart2, title: 'Compare & Approve', desc: 'Compare quotes side by side, see what differs from what you asked for, and approve a PO through your approval workflow.' },
  { icon: PackageCheck, title: 'Receive & Reconcile', desc: 'Record goods received (with proof photos), match invoices against the PO and GRN, then release payment.' },
];

const VENDOR_STEPS = [
  { icon: Users, title: 'Get Invited or Self-Register', desc: 'A buyer invites you by email, or you register yourself from a portal link — either way, you land in the same vendor profile.' },
  { icon: FileText, title: 'Receive RFQs', desc: 'See exactly what\u2019s being requested, with item names and quantities already filled in.' },
  { icon: PenLine, title: 'Quote in Minutes', desc: 'Fill in price, availability, and delivery time next to each item. Optionally upload a file and let AI pre-fill the numbers for you.' },
  { icon: Wallet, title: 'Get Paid, Confirm Receipt', desc: 'Track order, invoice, and payment status from your portal, and confirm once payment lands in your account.' },
];

const PAYMENT_FLOW = [
  'PO Approved', 'Goods Received', 'Invoice Uploaded', 'Invoice Matched', 'Invoice Approved',
  'Payment Queued', 'Payment Executed', 'Vendor Confirms', 'Order Closed',
];

export default function HomePage() {
  return (
    <div className="min-h-screen bg-white">
      {/* Nav */}
      <nav className="border-b border-gray-100 px-6 py-4 flex items-center justify-between sticky top-0 bg-white/90 backdrop-blur z-10">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 bg-brand-600 rounded-lg flex items-center justify-center">
            <ShoppingCart className="w-4 h-4 text-white" />
          </div>
          <span className="font-bold text-gray-900 text-lg">ProcureAI</span>
        </div>
        <div className="flex items-center gap-3">
          <Link to="/vendor-portal/login" className="text-sm text-gray-600 hover:text-brand-600 font-medium">
            Vendor Portal
          </Link>
          <Link to="/login" className="btn-secondary text-sm py-1.5 px-4">Company Login</Link>
          <Link to="/signup" className="btn-primary text-sm py-1.5 px-4">Get Started</Link>
        </div>
      </nav>

      {/* Hero */}
      <section className="max-w-5xl mx-auto px-6 pt-20 pb-16 text-center">
        <div className="inline-flex items-center gap-2 bg-brand-50 text-brand-700 text-xs font-semibold px-3 py-1.5 rounded-full mb-6">
          <Zap className="w-3.5 h-3.5" /> AI-Powered Procurement for SMEs
        </div>
        <h1 className="text-4xl md:text-5xl font-bold text-gray-900 leading-tight mb-5">
          Your Digital<br /><span className="text-brand-600">Procurement Head</span>
        </h1>
        <p className="text-lg text-gray-500 max-w-2xl mx-auto mb-8">
          Replace WhatsApp, Excel, and manual vendor follow-ups with one platform — from purchase request
          to controlled, audited payment. Your item master, vendor list, and approval rules stay the single
          source of truth throughout.
        </p>
        <div className="flex flex-col sm:flex-row items-center justify-center gap-3 mb-10">
          <Link to="/signup" className="btn-primary flex items-center gap-2 text-base px-6 py-3">
            Start Free Trial <ArrowRight className="w-4 h-4" />
          </Link>
          <Link to="/login" className="btn-secondary flex items-center gap-2 text-base px-6 py-3">
            Company Login
          </Link>
        </div>
        {/* Trust signals */}
        <div className="flex flex-wrap items-center justify-center gap-x-8 gap-y-2 text-xs text-gray-400 font-medium">
          <span className="flex items-center gap-1.5"><Lock className="w-3.5 h-3.5" /> Role-based access control</span>
          <span className="flex items-center gap-1.5"><Shield className="w-3.5 h-3.5" /> Full audit trail on every action</span>
          <span className="flex items-center gap-1.5"><Clock className="w-3.5 h-3.5" /> Setup in 5 minutes</span>
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
          <Link to="/vendor-portal/login" className="btn-secondary flex items-center gap-2 text-sm shrink-0">
            <Truck className="w-4 h-4" /> Vendor Portal Login
          </Link>
        </div>
      </section>

      {/* How it works — high level */}
      <section className="bg-brand-600 py-14">
        <div className="max-w-5xl mx-auto px-6">
          <h2 className="text-2xl font-bold text-white text-center mb-2">How it works, step by step</h2>
          <p className="text-brand-100 text-sm text-center mb-10">One item master, one vendor list, one thread from request to payment.</p>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {[
              { step: '01', label: 'Raise PR', desc: 'From your item master' },
              { step: '02', label: 'Get Quotes', desc: 'RFQ sent, AI assists extraction' },
              { step: '03', label: 'Issue PO', desc: 'Compare, approve, send' },
              { step: '04', label: 'Receive & Pay', desc: 'GRN → match → queue → pay' },
            ].map(({ step, label, desc }) => (
              <div key={step} className="text-center">
                <div className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center text-white font-bold text-sm mx-auto mb-2">{step}</div>
                <p className="text-white font-semibold text-sm mb-1">{label}</p>
                <p className="text-brand-100 text-xs">{desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Buyer workflow */}
      <section className="max-w-5xl mx-auto px-6 py-16">
        <div className="text-center mb-10">
          <span className="text-xs font-semibold text-brand-600 uppercase tracking-wide">For Buyers</span>
          <h2 className="text-2xl font-bold text-gray-900 mt-1">Everything sourced from your item master</h2>
          <p className="text-gray-500 text-sm mt-2 max-w-2xl mx-auto">
            Items you define once automatically flow into purchase requests, RFQs, goods receipts, invoice
            matching, inventory, and billing — nobody retypes an item name twice.
          </p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-5">
          {BUYER_STEPS.map(({ icon: Icon, title, desc }, i) => (
            <div key={title} className="p-5 rounded-xl border border-gray-100 hover:border-brand-200 hover:shadow-sm transition relative">
              <div className="w-9 h-9 bg-brand-50 rounded-lg flex items-center justify-center mb-3">
                <Icon className="w-4 h-4 text-brand-600" />
              </div>
              <h3 className="font-semibold text-gray-800 mb-1 text-sm">{i + 1}. {title}</h3>
              <p className="text-sm text-gray-500">{desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Vendor workflow */}
      <section className="bg-gray-50 py-16">
        <div className="max-w-5xl mx-auto px-6">
          <div className="text-center mb-10">
            <span className="text-xs font-semibold text-brand-600 uppercase tracking-wide">For Vendors</span>
            <h2 className="text-2xl font-bold text-gray-900 mt-1">Quote in minutes, not item-by-item retyping</h2>
            <p className="text-gray-500 text-sm mt-2 max-w-2xl mx-auto">
              Every RFQ arrives with the buyer's exact item list pre-filled. You only add your price,
              availability, and delivery time.
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-5">
            {VENDOR_STEPS.map(({ icon: Icon, title, desc }, i) => (
              <div key={title} className="bg-white p-5 rounded-xl border border-gray-100 hover:border-brand-200 hover:shadow-sm transition">
                <div className="w-9 h-9 bg-brand-50 rounded-lg flex items-center justify-center mb-3">
                  <Icon className="w-4 h-4 text-brand-600" />
                </div>
                <h3 className="font-semibold text-gray-800 mb-1 text-sm">{i + 1}. {title}</h3>
                <p className="text-sm text-gray-500">{desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* OCR / extraction fallback explanation */}
      <section className="max-w-5xl mx-auto px-6 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-10 items-center">
          <div>
            <span className="text-xs font-semibold text-brand-600 uppercase tracking-wide">AI Extraction, Never a Blocker</span>
            <h2 className="text-2xl font-bold text-gray-900 mt-1 mb-3">OCR helps when it can — manual entry always works</h2>
            <p className="text-gray-500 text-sm mb-4">
              Vendors can upload a PDF, spreadsheet, or even a photo of a handwritten quote. AI attempts to
              read prices and match them to the buyer's requested items automatically.
            </p>
            <p className="text-gray-500 text-sm">
              If extraction is incomplete, low-confidence, or fails outright, the vendor is never stuck —
              every item row stays fully editable, pre-labelled with the correct item name, so they can just
              type in a price and move on. Extraction is an assist, never a requirement.
            </p>
          </div>
          <div className="bg-gray-50 rounded-2xl border border-gray-100 p-6 space-y-3">
            <div className="flex items-center gap-3 bg-white rounded-lg p-3 border border-gray-100">
              <ScanLine className="w-5 h-5 text-brand-600 shrink-0" />
              <div className="text-sm"><span className="font-medium text-gray-800">Upload a file</span><p className="text-xs text-gray-400">PDF, Excel, or photo — clean or messy</p></div>
            </div>
            <div className="flex items-center gap-3 bg-white rounded-lg p-3 border border-gray-100">
              <Sparkles className="w-5 h-5 text-brand-600 shrink-0" />
              <div className="text-sm"><span className="font-medium text-gray-800">AI fills what it can read</span><p className="text-xs text-gray-400">Matched line-by-line against requested items</p></div>
            </div>
            <div className="flex items-center gap-3 bg-white rounded-lg p-3 border border-gray-100">
              <PenLine className="w-5 h-5 text-brand-600 shrink-0" />
              <div className="text-sm"><span className="font-medium text-gray-800">Everything stays editable</span><p className="text-xs text-gray-400">Low-confidence rows are flagged for a quick check</p></div>
            </div>
          </div>
        </div>
      </section>

      {/* Payment & inventory flow */}
      <section className="bg-gray-900 py-16">
        <div className="max-w-5xl mx-auto px-6">
          <div className="text-center mb-10">
            <span className="text-xs font-semibold text-blue-300 uppercase tracking-wide">Payment & Inventory Flow</span>
            <h2 className="text-2xl font-bold text-white mt-1">Payment never fires automatically</h2>
            <p className="text-gray-400 text-sm mt-2 max-w-2xl mx-auto">
              A PO being approved does not release money. Payment only becomes possible after goods are
              received and the invoice is matched and approved — and even then, it's a deliberate two-step
              queue-then-execute action, followed by the vendor confirming receipt.
            </p>
          </div>
          <div className="flex flex-wrap items-center justify-center gap-2">
            {PAYMENT_FLOW.map((label, i) => (
              <React.Fragment key={label}>
                <div className="bg-white/10 text-white text-xs font-medium px-3 py-2 rounded-lg text-center">{label}</div>
                {i < PAYMENT_FLOW.length - 1 && <ArrowRight className="w-3.5 h-3.5 text-gray-500 shrink-0" />}
              </React.Fragment>
            ))}
          </div>
          <p className="text-center text-gray-500 text-xs mt-6">
            Supports bank transfer / NEFT / RTGS, UPI, ACH, and cheque — every executed payment gets a
            reference/UTR value recorded against the invoice.
          </p>
        </div>
      </section>

      {/* Billing & stock explanation */}
      <section className="max-w-5xl mx-auto px-6 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-10 items-center">
          <div className="order-2 md:order-1 bg-gray-50 rounded-2xl border border-gray-100 p-6">
            <div className="flex items-center gap-3 mb-4">
              <Package className="w-8 h-8 text-brand-600" />
              <div>
                <p className="font-semibold text-gray-800 text-sm">Inventory stays accurate automatically</p>
                <p className="text-xs text-gray-400">No manual stock adjustments needed for normal flow</p>
              </div>
            </div>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between bg-white rounded-lg p-3 border border-gray-100"><span className="text-gray-500">Goods Receipt recorded</span><span className="font-medium text-green-600">+ Stock increases</span></div>
              <div className="flex justify-between bg-white rounded-lg p-3 border border-gray-100"><span className="text-gray-500">Bill raised for a sale</span><span className="font-medium text-red-600">− Stock decreases</span></div>
            </div>
          </div>
          <div className="order-1 md:order-2">
            <span className="text-xs font-semibold text-brand-600 uppercase tracking-wide">Billing</span>
            <h2 className="text-2xl font-bold text-gray-900 mt-1 mb-3 flex items-center gap-2"><Receipt className="w-6 h-6 text-brand-600" /> Bills reduce stock the moment they're raised</h2>
            <p className="text-gray-500 text-sm">
              When items you've stocked are sold out, raising a bill against them automatically reduces
              available inventory — using the same item master records used everywhere else in the platform,
              so your stock count is never out of sync with what's actually on the shelf.
            </p>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="bg-gray-50 py-16">
        <div className="max-w-5xl mx-auto px-6">
          <h2 className="text-2xl font-bold text-gray-900 text-center mb-10">Everything procurement in one place</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {FEATURES.map(({ icon: Icon, title, desc }) => (
              <div key={title} className="bg-white p-5 rounded-xl border border-gray-100 hover:border-brand-200 hover:shadow-sm transition">
                <div className="w-9 h-9 bg-brand-50 rounded-lg flex items-center justify-center mb-3">
                  <Icon className="w-4 h-4 text-brand-600" />
                </div>
                <h3 className="font-semibold text-gray-800 mb-1">{title}</h3>
                <p className="text-sm text-gray-500">{desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="max-w-5xl mx-auto px-6 py-16 text-center">
        <h2 className="text-2xl font-bold text-gray-900 mb-3">Ready to streamline your procurement?</h2>
        <p className="text-gray-500 mb-6">Free trial · No credit card · Setup in 5 minutes</p>
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
