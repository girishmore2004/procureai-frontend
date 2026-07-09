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
  Package, Lock, Users, Clock, Sparkles, Eye, RefreshCw, Layers, ShieldCheck,
  TrendingUp, TrendingDown, Minus, AlertTriangle,
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
  'PO Approved', 'Goods Received', 'Invoice Matched', 'Invoice Approved', 'Payment Released',
];

const BENEFITS = [
  { icon: ShieldCheck, title: 'Trust', desc: 'Every request, approval, and payment is timestamped and attributed \u2014 no more \u201cwho approved this?\u201d' },
  { icon: Lock, title: 'Control', desc: 'Approval chains, role-based access, and tenant isolation mean the right people see and approve the right things.' },
  { icon: Zap, title: 'Speed', desc: 'RFQs, quote comparison, and approval routing cut days out of a cycle that used to run on email threads.' },
  { icon: Eye, title: 'Visibility', desc: 'One dashboard shows spend, vendor performance, and where a PO is stuck \u2014 for owners and approvers alike.' },
  { icon: RefreshCw, title: 'Fewer Errors', desc: '3-way matching catches invoice discrepancies before payment, not after a vendor calls asking where the difference went.' },
  { icon: Layers, title: 'One System', desc: 'Item master, vendors, POs, inventory, and billing live in one place instead of four disconnected tools.' },
];

const SECURITY_CARDS = [
  { label: 'TENANT ISOLATION', title: 'Strict data boundaries', desc: 'Every query is scoped to the requesting company. One tenant\u2019s vendors, POs, and invoices are never visible to another.' },
  { label: 'ROLE-BASED ACCESS', title: 'Permissions by role', desc: 'Requesters, approvers, finance, and vendors each see only the actions their role allows \u2014 enforced on every endpoint.' },
  { label: 'AUDIT TRAIL', title: 'Nothing happens quietly', desc: 'Approvals, edits, and status changes are logged with who, what, and when \u2014 available to review at any time.' },
  { label: 'RELIABLE INFRASTRUCTURE', title: 'Built to stay up', desc: 'Background jobs, email delivery, and document processing run on monitored queues, so a slow vendor upload never blocks the rest of the platform.' },
];

function Chip({ label, tag, tone = 'default' }) {
  const tones = {
    default: 'bg-[#F6F7FA] border-[#E7EBF2] text-[#0A1424]',
    gold: 'bg-[#E4B25C]/10 border-[#E4B25C]/35 text-[#0A1424]',
    green: 'bg-[#3FB88A]/10 border-[#3FB88A]/30 text-[#0A1424]',
  };
  const dot = { default: 'bg-[#E4B25C]', gold: 'bg-[#E4B25C]', green: 'bg-[#3FB88A]' };
  return (
    <div className={`flex items-center gap-3 rounded-lg border px-4 py-3 text-sm font-medium ${tones[tone]}`}>
      <span className={`h-2 w-2 rounded-full shrink-0 ${dot[tone]}`} />
      <span>{label}</span>
      {tag && <span className="ml-auto font-mono text-[10.5px] text-[#7C8AA5]">{tag}</span>}
    </div>
  );
}

function Connector() {
  return <div className="ml-6 h-5 w-px bg-[#B6C0D3]" />;
}

export default function HomePage() {
  return (
    <div className="min-h-screen bg-[#F6F7FA] text-[#0A1424] font-sans">

      {/* Nav */}
      <nav className="sticky top-0 z-50 bg-[#060B16]/90 backdrop-blur border-b border-white/10 px-6 py-4 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-[#F0CD8C] to-[#B4863A] flex items-center justify-center">
            <ShoppingCart className="w-4 h-4 text-[#060B16]" />
          </div>
          <span className="font-bold text-white text-lg tracking-tight">ProcureAI</span>
        </div>
        <div className="flex items-center gap-3">
          <Link to="/vendor-portal/login" className="text-sm text-[#B6C0D3] hover:text-white font-medium hidden sm:block">
            Vendor Portal
          </Link>
          <Link to="/login" className="text-sm text-[#B6C0D3] hover:text-white font-medium border border-white/20 rounded-lg px-4 py-1.5 hover:border-white/40 transition">
            Company Login
          </Link>
          <Link to="/signup" className="text-sm font-semibold bg-[#E4B25C] text-[#060B16] rounded-lg px-4 py-1.5 hover:bg-[#F0CD8C] transition">
            Get Started
          </Link>
        </div>
      </nav>

      {/* Hero */}
      <section className="relative overflow-hidden bg-gradient-to-b from-[#060B16] via-[#0A1424] to-[#0A1424] pt-20 pb-0">
        <div
          className="pointer-events-none absolute inset-0"
          style={{ background: 'radial-gradient(1100px 500px at 82% -10%, rgba(228,178,92,0.16), transparent 60%), radial-gradient(700px 400px at 8% 0%, rgba(63,184,138,0.08), transparent 55%)' }}
        />
        <div className="relative max-w-3xl mx-auto px-6 text-center">
          <span className="inline-flex items-center gap-2 text-[12px] font-mono uppercase tracking-widest text-[#F0CD8C]">
            <span className="h-px w-3.5 bg-[#F0CD8C] inline-block" /> Procure-to-pay, in one system of record
          </span>
          <h1 className="mt-5 text-4xl md:text-6xl font-semibold tracking-tight leading-[1.06] text-white">
            Every purchase,{' '}
            <span className="bg-gradient-to-r from-[#F0CD8C] to-[#E4B25C] bg-clip-text text-transparent">approved on record</span> — not on email.
          </h1>
          <p className="mt-6 text-lg text-[#B6C0D3] max-w-xl mx-auto leading-relaxed">
            ProcureAI replaces spreadsheets, inboxes, and side-channel approvals with one auditable flow: requests,
            RFQs, purchase orders, receiving, invoice matching, and payment — tracked from the first request to the
            final rupee.
          </p>
          <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-3">
            <Link to="/signup" className="inline-flex items-center gap-2 bg-[#E4B25C] text-[#060B16] font-semibold rounded-lg px-6 py-3 hover:bg-[#F0CD8C] transition">
              Start Free Trial <ArrowRight className="w-4 h-4" />
            </Link>
            <Link to="/login" className="inline-flex items-center gap-2 text-white border border-white/25 rounded-lg px-6 py-3 hover:bg-white/5 hover:border-white/40 transition">
              Company Login
            </Link>
          </div>
          <div className="mt-5 flex flex-wrap items-center justify-center gap-x-6 gap-y-2 text-xs font-mono text-[#7C8AA5]">
            <span className="flex items-center gap-1.5"><Lock className="w-3.5 h-3.5" /> Role-based access control</span>
            <span className="flex items-center gap-1.5"><Shield className="w-3.5 h-3.5" /> Full audit trail on every action</span>
            <span className="flex items-center gap-1.5"><Clock className="w-3.5 h-3.5" /> Setup in 5 minutes</span>
          </div>
        </div>

        {/* Dashboard mockup */}
        <div className="relative mt-14 px-6 flex justify-center">
          <div className="w-full max-w-4xl rounded-t-2xl border border-white/10 bg-[#101C33] shadow-2xl overflow-hidden" style={{ transform: 'perspective(1400px) rotateX(3deg)', transformOrigin: 'bottom center' }}>
            <div className="h-9 flex items-center gap-1.5 px-4 bg-[#0A1424] border-b border-white/10">
              <span className="w-2.5 h-2.5 rounded-full bg-white/15" />
              <span className="w-2.5 h-2.5 rounded-full bg-white/15" />
              <span className="w-2.5 h-2.5 rounded-full bg-white/15" />
            </div>
            <div className="grid grid-cols-[160px_1fr]">
              <div className="hidden sm:block bg-[#0A1424] border-r border-white/10 p-4 space-y-1 text-xs">
                <div className="text-[#7C8AA5] px-2.5 py-2 rounded-md">Owner dashboard</div>
                <div className="text-[#F0CD8C] bg-[#E4B25C]/10 font-semibold px-2.5 py-2 rounded-md">Purchase orders</div>
                <div className="text-[#7C8AA5] px-2.5 py-2 rounded-md">Vendors</div>
                <div className="text-[#7C8AA5] px-2.5 py-2 rounded-md">RFQs</div>
                <div className="text-[#7C8AA5] px-2.5 py-2 rounded-md">Invoices</div>
                <div className="text-[#7C8AA5] px-2.5 py-2 rounded-md">Analytics</div>
              </div>
              <div className="p-5 sm:p-6">
                <div className="flex items-center justify-between mb-4">
                  <h4 className="text-white text-sm font-semibold">Purchase orders — this month</h4>
                  <span className="text-[10px] font-mono uppercase tracking-wide text-[#3FB88A] border border-[#3FB88A] rounded px-2 py-1 -rotate-2 inline-block font-semibold">
                    ✓ 3-way matched
                  </span>
                </div>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-5">
                  {[
                    { l: 'Open PRs', v: '18', d: '4 awaiting quotes' },
                    { l: 'Spend MTD', v: '\u20b941.2L', d: '\u2193 6% vs budget' },
                    { l: 'Avg. approval', v: '6.4 hrs', d: '\u2193 from 2.1 days' },
                    { l: 'Match rate', v: '97.3%', d: 'auto-reconciled' },
                  ].map((k) => (
                    <div key={k.l} className="bg-[#1A2A47] border border-white/10 rounded-lg p-3">
                      <div className="text-[10px] font-mono uppercase tracking-wide text-[#7C8AA5]">{k.l}</div>
                      <div className="text-lg font-semibold text-white mt-1">{k.v}</div>
                      <div className="text-[10.5px] font-mono text-[#3FB88A] mt-0.5">{k.d}</div>
                    </div>
                  ))}
                </div>
                <div className="border border-white/10 rounded-lg overflow-hidden text-xs hidden sm:block">
                  <div className="grid grid-cols-5 gap-2 px-3.5 py-2 bg-[#1A2A47] text-[#7C8AA5] font-mono uppercase text-[10px] tracking-wide">
                    <span>PO#</span><span>Vendor</span><span>Amount</span><span>Stage</span><span>Status</span>
                  </div>
                  {[
                    { po: 'PO-2291', v: 'Sarvodaya Steel', amt: '\u20b92,84,000', stage: 'Receiving', status: 'Approved', tone: 'green' },
                    { po: 'PO-2292', v: 'Nova Packaging', amt: '\u20b996,500', stage: 'Approval', status: 'Pending', tone: 'gold' },
                    { po: 'PO-2293', v: 'Kiran Traders', amt: '\u20b91,12,300', stage: 'Invoice match', status: 'Review', tone: 'red' },
                  ].map((r) => (
                    <div key={r.po} className="grid grid-cols-5 gap-2 px-3.5 py-2.5 border-t border-white/10 text-[#B6C0D3] items-center">
                      <span className="font-mono">{r.po}</span>
                      <span>{r.v}</span>
                      <span className="font-mono">{r.amt}</span>
                      <span>{r.stage}</span>
                      <span>
                        <span className={`font-mono text-[10px] font-semibold px-2 py-0.5 rounded-full ${
                          r.tone === 'green' ? 'bg-[#3FB88A]/15 text-[#3FB88A]' : r.tone === 'gold' ? 'bg-[#E4B25C]/15 text-[#F0CD8C]' : 'bg-[#E0715C]/15 text-[#E0715C]'
                        }`}>{r.status}</span>
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Trust strip */}
      <section className="bg-[#060B16] border-t border-white/5 pt-9 pb-11 px-6">
        <div className="max-w-5xl mx-auto">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <span className="font-mono text-xs uppercase tracking-widest text-[#7C8AA5] whitespace-nowrap">
              Built for procurement, finance &amp; ops teams
            </span>
            <div className="flex flex-wrap gap-8 opacity-60">
              {['Kavach Steel', 'Northline Foods', 'Sarvodaya Group', 'Bluepeak Retail'].map((n) => (
                <span key={n} className="font-bold text-[#B6C0D3] text-base tracking-tight">{n}</span>
              ))}
            </div>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-5 mt-8 pt-8 border-t border-white/10">
            {[
              { n: '14', l: 'modules \u2014 one platform, no add-on pricing' },
              { n: '3-way', l: 'PO \u00b7 receipt \u00b7 invoice matching' },
              { n: '100%', l: 'tenant-isolated data by design' },
              { n: '< 1 day', l: 'avg. onboarding to first PO' },
            ].map((s) => (
              <div key={s.l}>
                <div className="text-2xl font-bold text-white tracking-tight">{s.n}</div>
                <div className="text-xs text-[#7C8AA5] mt-1 leading-snug">{s.l}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How it works */}
      <section className="py-20 px-6 bg-[#F6F7FA]">
        <div className="max-w-5xl mx-auto">
          <div className="max-w-xl mb-12">
            <span className="font-mono text-xs uppercase tracking-widest text-[#B4863A] flex items-center gap-2">
              <span className="h-px w-3.5 bg-[#B4863A] inline-block" /> How it works
            </span>
            <h2 className="text-3xl font-semibold tracking-tight mt-3">One thread, from request to payment</h2>
            <p className="text-[#7C8AA5] mt-3 leading-relaxed">
              No forked spreadsheets, no approvals buried in email. Every purchase moves through the same tracked
              sequence, visible to whoever needs to see it.
            </p>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {[
              { n: '01', t: 'Request', d: 'Anyone raises a purchase request against the item master \u2014 quantity, budget, and justification attached from the start.' },
              { n: '02', t: 'Source', d: 'Send RFQs to qualified vendors, collect quotes through the vendor portal, and compare them side by side.' },
              { n: '03', t: 'Approve', d: 'The purchase order routes through the right approval chain automatically, with every decision timestamped.' },
              { n: '04', t: 'Reconcile', d: 'Goods receipt, invoice, and PO are matched automatically before payment is ever released.' },
            ].map((s) => (
              <div key={s.n}>
                <div className="w-11 h-11 rounded-full border border-[#0A1424] flex items-center justify-center font-mono font-semibold text-sm mb-5">{s.n}</div>
                <h3 className="font-semibold text-[15px] mb-2">{s.t}</h3>
                <p className="text-sm text-[#7C8AA5] leading-relaxed">{s.d}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Buyer workflow */}
      <section className="py-20 px-6 bg-white border-y border-[#E7EBF2]">
        <div className="max-w-5xl mx-auto">
          <div className="max-w-xl mb-12">
            <span className="font-mono text-xs uppercase tracking-widest text-[#B4863A] flex items-center gap-2">
              <span className="h-px w-3.5 bg-[#B4863A] inline-block" /> For buyers &amp; procurement teams
            </span>
            <h2 className="text-3xl font-semibold tracking-tight mt-3">Turn a request into a comparable, defensible decision</h2>
            <p className="text-[#7C8AA5] mt-3 leading-relaxed">
              Items you define once automatically flow into purchase requests, RFQs, goods receipts, invoice matching,
              inventory, and billing \u2014 nobody retypes an item name twice.
            </p>
          </div>
          <div className="grid md:grid-cols-2 gap-14 items-center">
            <div className="divide-y divide-[#E7EBF2]">
              {BUYER_STEPS.map(({ icon: Icon, title, desc }, i) => (
                <div key={title} className="flex gap-4 py-5 first:pt-0 last:pb-0">
                  <span className="font-mono text-[13px] font-semibold text-[#B4863A] pt-0.5 shrink-0 w-6">{`0${i + 1}`}</span>
                  <div>
                    <h4 className="font-semibold text-[15.5px] mb-1 flex items-center gap-2"><Icon className="w-4 h-4 text-[#B4863A]" />{title}</h4>
                    <p className="text-sm text-[#7C8AA5] leading-relaxed">{desc}</p>
                  </div>
                </div>
              ))}
            </div>
            <div className="bg-white border border-[#E7EBF2] rounded-2xl shadow-lg p-7">
              <Chip label="Purchase request" tag="PR-1042" />
              <Connector />
              <Chip label="RFQ sent to 4 vendors" tag="RFQ-338" />
              <Connector />
              <Chip label="Quote comparison" tag="3 responses" />
              <Connector />
              <Chip label="PO approval" tag="2-step chain" tone="gold" />
              <Connector />
              <Chip label="Goods receipt logged" tag="GRN-771" />
            </div>
          </div>
        </div>
      </section>

      {/* Vendor workflow */}
      <section className="py-20 px-6 bg-[#F6F7FA]">
        <div className="max-w-5xl mx-auto">
          <div className="max-w-xl mb-12">
            <span className="font-mono text-xs uppercase tracking-widest text-[#B4863A] flex items-center gap-2">
              <span className="h-px w-3.5 bg-[#B4863A] inline-block" /> For vendors
            </span>
            <h2 className="text-3xl font-semibold tracking-tight mt-3">A single portal, so vendors stop calling to ask "where's my payment"</h2>
            <p className="text-[#7C8AA5] mt-3 leading-relaxed">
              Vendors get one place to see RFQs, submit quotes, track PO status, and follow their invoice through to payment.
            </p>
          </div>
          <div className="grid md:grid-cols-2 gap-14 items-center">
            <div className="bg-white border border-[#E7EBF2] rounded-2xl shadow-lg p-7 order-1">
              <Chip label="Vendor invited & verified" tag="status: active" tone="green" />
              <Connector />
              <Chip label="RFQ received in portal" tag="RFQ-338" tone="green" />
              <Connector />
              <Chip label="Quote submitted" tag="\u20b996,500" tone="green" />
              <Connector />
              <Chip label="PO received & accepted" tag="PO-2292" tone="green" />
              <Connector />
              <Chip label="Invoice submitted & tracked" tag="paid in 9 days" tone="green" />
            </div>
            <div className="divide-y divide-[#E7EBF2] order-2">
              {VENDOR_STEPS.map(({ icon: Icon, title, desc }, i) => (
                <div key={title} className="flex gap-4 py-5 first:pt-0 last:pb-0">
                  <span className="font-mono text-[13px] font-semibold text-[#B4863A] pt-0.5 shrink-0 w-6">{`0${i + 1}`}</span>
                  <div>
                    <h4 className="font-semibold text-[15.5px] mb-1 flex items-center gap-2"><Icon className="w-4 h-4 text-[#B4863A]" />{title}</h4>
                    <p className="text-sm text-[#7C8AA5] leading-relaxed">{desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* OCR / manual fallback */}
      <section className="py-20 px-6 bg-white border-y border-[#E7EBF2]">
        <div className="max-w-5xl mx-auto">
          <div className="max-w-xl mb-12">
            <span className="font-mono text-xs uppercase tracking-widest text-[#B4863A] flex items-center gap-2">
              <span className="h-px w-3.5 bg-[#B4863A] inline-block" /> Data entry
            </span>
            <h2 className="text-3xl font-semibold tracking-tight mt-3">Invoices get read automatically \u2014 and checked when they should be</h2>
            <p className="text-[#7C8AA5] mt-3 leading-relaxed">
              OCR extracts line items, amounts, and tax from vendor invoices on upload. When confidence is low, it's
              routed for manual review instead of guessed at \u2014 every row stays fully editable either way.
            </p>
          </div>
          <div className="grid md:grid-cols-2 gap-6">
            <div className="border border-[#E7EBF2] rounded-2xl p-6 shadow-sm">
              <div className="flex items-center gap-2.5 mb-4">
                <span className="w-8 h-8 rounded-lg bg-[#E4B25C]/15 text-[#B4863A] flex items-center justify-center font-mono text-[11px] font-bold"><ScanLine className="w-4 h-4" /></span>
                <h4 className="font-semibold">Automatic extraction</h4>
              </div>
              <p className="text-sm text-[#7C8AA5] mb-2">Invoice INV-4471.pdf \u2014 Kiran Traders</p>
              <div className="h-1.5 rounded bg-[#E7EBF2] overflow-hidden mb-2">
                <div className="h-full bg-gradient-to-r from-[#3FB88A] to-[#E4B25C]" style={{ width: '94%' }} />
              </div>
              <p className="text-xs font-mono text-[#3FB88A] mb-3">94% confidence \u2014 auto-accepted</p>
              <ul className="text-sm text-[#7C8AA5] divide-y divide-[#E7EBF2]">
                <li className="py-2">Invoice number &amp; date matched to PO-2293</li>
                <li className="py-2">Line items extracted: 6 of 6</li>
                <li className="py-2">Tax and total cross-checked against PO value</li>
              </ul>
            </div>
            <div className="border border-[#E7EBF2] rounded-2xl p-6 shadow-sm">
              <div className="flex items-center gap-2.5 mb-4">
                <span className="w-8 h-8 rounded-lg bg-[#E0715C]/15 text-[#E0715C] flex items-center justify-center"><AlertTriangle className="w-4 h-4" /></span>
                <h4 className="font-semibold">Manual fallback</h4>
              </div>
              <p className="text-sm text-[#7C8AA5] mb-2">Invoice INV-4488.pdf \u2014 Nova Packaging</p>
              <div className="h-1.5 rounded bg-[#E7EBF2] overflow-hidden mb-2">
                <div className="h-full bg-gradient-to-r from-[#E0715C] to-[#E4B25C]" style={{ width: '52%' }} />
              </div>
              <p className="text-xs font-mono text-[#E0715C] mb-3">52% confidence \u2014 sent for review</p>
              <ul className="text-sm text-[#7C8AA5] divide-y divide-[#E7EBF2]">
                <li className="py-2">Scanned copy, 2 line items unreadable</li>
                <li className="py-2">Routed to AP for manual entry, not silently approved</li>
                <li className="py-2">Original file kept attached for audit</li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* Invoice, payment & approval flow */}
      <section className="py-20 px-6 bg-[#F6F7FA]">
        <div className="max-w-5xl mx-auto">
          <div className="max-w-xl mb-12">
            <span className="font-mono text-xs uppercase tracking-widest text-[#B4863A] flex items-center gap-2">
              <span className="h-px w-3.5 bg-[#B4863A] inline-block" /> Invoice &amp; payment
            </span>
            <h2 className="text-3xl font-semibold tracking-tight mt-3">Payment only moves after three things agree</h2>
            <p className="text-[#7C8AA5] mt-3 leading-relaxed">
              The purchase order, the goods receipt, and the vendor invoice are matched line by line. Mismatches
              stop the payment, not the other way around.
            </p>
          </div>
          <div className="grid sm:grid-cols-3 gap-4 mb-4">
            {[
              { l: 'Purchase order', v: '\u20b91,12,300', s: 'PO-2293 \u00b7 6 line items' },
              { l: 'Goods receipt', v: '\u20b91,12,300', s: 'GRN-771 \u00b7 6 of 6 received' },
              { l: 'Vendor invoice', v: '\u20b91,12,300', s: 'INV-4471 \u00b7 matched' },
            ].map((c) => (
              <div key={c.l} className="bg-white border border-[#E7EBF2] rounded-xl p-5 text-center">
                <div className="font-mono text-[11px] uppercase tracking-wide text-[#7C8AA5]">{c.l}</div>
                <div className="text-xl font-bold mt-1.5">{c.v}</div>
                <div className="text-xs text-[#7C8AA5] mt-1">{c.s}</div>
              </div>
            ))}
          </div>
          <div className="flex items-center justify-center gap-2 text-[#3FB88A] font-mono text-sm font-semibold mb-12">
            <CheckCircle className="w-4 h-4" /> All three match \u2014 cleared for payment approval
          </div>
          <div className="grid md:grid-cols-2 gap-10 items-center">
            <div className="bg-white border border-[#E7EBF2] rounded-2xl shadow-md p-6">
              <h4 className="font-semibold text-sm mb-4">Approval chain</h4>
              <div className="flex flex-wrap items-center gap-2">
                {PAYMENT_FLOW.map((label, i) => (
                  <React.Fragment key={label}>
                    <div className={`text-xs font-medium px-3 py-2 rounded-lg text-center ${
                      i === PAYMENT_FLOW.length - 1 ? 'bg-[#3FB88A]/10 border border-[#3FB88A]/30 text-[#0A1424]' : 'bg-[#F6F7FA] border border-[#E7EBF2]'
                    }`}>{label}</div>
                    {i < PAYMENT_FLOW.length - 1 && <ArrowRight className="w-3.5 h-3.5 text-[#B6C0D3] shrink-0" />}
                  </React.Fragment>
                ))}
              </div>
            </div>
            <div>
              <h3 className="text-lg font-semibold mb-3">Mismatches get flagged, not paid</h3>
              <p className="text-sm text-[#7C8AA5] leading-relaxed">
                If a vendor invoices for more than was received, or a PO changes after the fact, the payment holds
                automatically and routes back for review \u2014 with the discrepancy shown, not just a rejected status.
                Payments support bank transfer, UPI, and cheque, and every executed payment gets a reference value
                recorded against the invoice.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Inventory & billing */}
      <section className="py-20 px-6 bg-white border-y border-[#E7EBF2]">
        <div className="max-w-5xl mx-auto">
          <div className="max-w-xl mb-12">
            <span className="font-mono text-xs uppercase tracking-widest text-[#B4863A] flex items-center gap-2">
              <span className="h-px w-3.5 bg-[#B4863A] inline-block" /> Inventory &amp; billing
            </span>
            <h2 className="text-3xl font-semibold tracking-tight mt-3">Stock and spend, tracked from the same source of truth</h2>
            <p className="text-[#7C8AA5] mt-3 leading-relaxed">
              Goods receipt updates inventory automatically. Bills raised against stocked items reduce it the same way.
            </p>
          </div>
          <div className="grid md:grid-cols-2 gap-14 items-center">
            <div className="bg-[#F6F7FA] border border-[#E7EBF2] rounded-2xl p-6">
              <div className="flex items-center gap-3 mb-4">
                <Package className="w-7 h-7 text-[#B4863A]" />
                <div>
                  <p className="font-semibold text-sm">Inventory stays accurate automatically</p>
                  <p className="text-xs text-[#7C8AA5]">No manual stock adjustments needed for normal flow</p>
                </div>
              </div>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between bg-white rounded-lg p-3 border border-[#E7EBF2]">
                  <span className="text-[#7C8AA5]">Goods Receipt recorded</span>
                  <span className="font-medium text-[#3FB88A] flex items-center gap-1"><TrendingUp className="w-3.5 h-3.5" /> Stock increases</span>
                </div>
                <div className="flex justify-between bg-white rounded-lg p-3 border border-[#E7EBF2]">
                  <span className="text-[#7C8AA5]">Bill raised for a sale</span>
                  <span className="font-medium text-[#E0715C] flex items-center gap-1"><TrendingDown className="w-3.5 h-3.5" /> Stock decreases</span>
                </div>
              </div>
            </div>
            <div className="divide-y divide-[#E7EBF2]">
              <div className="flex gap-4 py-5 first:pt-0">
                <span className="font-mono text-[13px] font-semibold text-[#B4863A] pt-0.5 shrink-0 w-6">01</span>
                <div><h4 className="font-semibold text-[15.5px] mb-1">Updates on receipt, not guesswork</h4><p className="text-sm text-[#7C8AA5] leading-relaxed">Stock counts move the moment goods are received against a PO, so on-hand quantity reflects what actually arrived.</p></div>
              </div>
              <div className="flex gap-4 py-5">
                <span className="font-mono text-[13px] font-semibold text-[#B4863A] pt-0.5 shrink-0 w-6">02</span>
                <div><h4 className="font-semibold text-[15.5px] mb-1">Reorder points flag themselves</h4><p className="text-sm text-[#7C8AA5] leading-relaxed">Low-stock items surface on the dashboard before they become a stalled purchase request.</p></div>
              </div>
              <div className="flex gap-4 py-5 last:pb-0">
                <span className="font-mono text-[13px] font-semibold text-[#B4863A] pt-0.5 shrink-0 w-6">03</span>
                <div className="flex items-center gap-2"><Receipt className="w-4 h-4 text-[#B4863A] shrink-0" /><div><h4 className="font-semibold text-[15.5px] mb-1">Bills reduce stock the moment they're raised</h4><p className="text-sm text-[#7C8AA5] leading-relaxed">Using the same item master records used everywhere else, so your stock count is never out of sync with the shelf.</p></div></div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Owner dashboard / analytics */}
      <section className="py-20 px-6 bg-[#F6F7FA]">
        <div className="max-w-5xl mx-auto">
          <div className="max-w-xl mb-12">
            <span className="font-mono text-xs uppercase tracking-widest text-[#B4863A] flex items-center gap-2">
              <span className="h-px w-3.5 bg-[#B4863A] inline-block" /> Owner dashboard
            </span>
            <h2 className="text-3xl font-semibold tracking-tight mt-3">One view of spend, speed, and where things are stuck</h2>
            <p className="text-[#7C8AA5] mt-3 leading-relaxed">
              See what's spent, what's pending, and which approvals are sitting too long \u2014 without exporting a spreadsheet to find out.
            </p>
          </div>
          <div className="bg-[#0A1424] border border-[#1A2A47] rounded-2xl shadow-xl p-6 sm:p-7">
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-5">
              {[
                { l: 'Total spend YTD', v: '\u20b94.86Cr', d: '\u2193 4% vs last year' },
                { l: 'Active vendors', v: '62', d: '8 added this quarter' },
                { l: 'Open approvals', v: '11', d: '3 over SLA', warn: true },
                { l: 'Invoice match rate', v: '97.3%', d: 'auto-reconciled' },
              ].map((k) => (
                <div key={k.l} className="bg-[#1A2A47] border border-white/10 rounded-lg p-3.5">
                  <div className="text-[10px] font-mono uppercase tracking-wide text-[#7C8AA5]">{k.l}</div>
                  <div className="text-xl font-semibold text-white mt-1">{k.v}</div>
                  <div className={`text-[10.5px] font-mono mt-0.5 ${k.warn ? 'text-[#F0CD8C]' : 'text-[#3FB88A]'}`}>{k.d}</div>
                </div>
              ))}
            </div>
            <div className="border border-white/10 rounded-lg overflow-hidden text-xs hidden sm:block">
              <div className="grid grid-cols-5 gap-2 px-4 py-2.5 bg-[#1A2A47] text-[#7C8AA5] font-mono uppercase text-[10px] tracking-wide">
                <span>Category</span><span>Vendor</span><span>Spend</span><span>Trend</span><span>Share</span>
              </div>
              {[
                { c: 'Raw materials', v: 'Sarvodaya Steel', s: '\u20b91.9Cr', t: '\u2191 8%', sh: '39%' },
                { c: 'Packaging', v: 'Nova Packaging', s: '\u20b978L', t: '\u2193 3%', sh: '16%' },
                { c: 'MRO supplies', v: 'Kiran Traders', s: '\u20b952L', t: '\u2192 flat', sh: '11%' },
              ].map((r) => (
                <div key={r.c} className="grid grid-cols-5 gap-2 px-4 py-2.5 border-t border-white/10 text-[#B6C0D3] items-center">
                  <span>{r.c}</span><span>{r.v}</span><span className="font-mono">{r.s}</span><span>{r.t}</span><span className="font-mono">{r.sh}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Benefits */}
      <section className="py-20 px-6 bg-white border-y border-[#E7EBF2]">
        <div className="max-w-5xl mx-auto">
          <div className="max-w-xl mb-12">
            <span className="font-mono text-xs uppercase tracking-widest text-[#B4863A] flex items-center gap-2">
              <span className="h-px w-3.5 bg-[#B4863A] inline-block" /> Why teams switch
            </span>
            <h2 className="text-3xl font-semibold tracking-tight mt-3">Built around four things finance actually asks for</h2>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {BENEFITS.map(({ icon: Icon, title, desc }) => (
              <div key={title} className="border border-[#E7EBF2] rounded-2xl p-6 hover:shadow-md hover:-translate-y-0.5 transition">
                <div className="w-9 h-9 rounded-lg bg-[#0A1424] text-[#E4B25C] flex items-center justify-center mb-4">
                  <Icon className="w-4 h-4" />
                </div>
                <h4 className="font-semibold text-[15.5px] mb-1.5">{title}</h4>
                <p className="text-sm text-[#7C8AA5] leading-relaxed">{desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Full feature grid */}
      <section className="py-20 px-6 bg-[#F6F7FA]">
        <div className="max-w-5xl mx-auto">
          <h2 className="text-2xl font-semibold tracking-tight text-center mb-10">Everything procurement in one place</h2>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {FEATURES.map(({ icon: Icon, title, desc }) => (
              <div key={title} className="bg-white p-5 rounded-xl border border-[#E7EBF2] hover:border-[#E4B25C]/50 hover:shadow-sm transition">
                <div className="w-9 h-9 bg-[#E4B25C]/10 rounded-lg flex items-center justify-center mb-3">
                  <Icon className="w-4 h-4 text-[#B4863A]" />
                </div>
                <h3 className="font-semibold text-[#0A1424] mb-1">{title}</h3>
                <p className="text-sm text-[#7C8AA5]">{desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Security */}
      <section className="py-20 px-6 bg-gradient-to-b from-[#060B16] to-[#0A1424]">
        <div className="max-w-5xl mx-auto">
          <div className="max-w-xl mb-12">
            <span className="font-mono text-xs uppercase tracking-widest text-[#F0CD8C] flex items-center gap-2">
              <span className="h-px w-3.5 bg-[#F0CD8C] inline-block" /> Security &amp; reliability
            </span>
            <h2 className="text-3xl font-semibold tracking-tight mt-3 text-white">Multi-tenant by design, not by convention</h2>
            <p className="text-[#B6C0D3] mt-3 leading-relaxed">
              Each company's data, vendors, and approvals are isolated at the platform level \u2014 not just filtered in the interface.
            </p>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {SECURITY_CARDS.map((c) => (
              <div key={c.title} className="bg-white/[0.03] border border-white/10 rounded-2xl p-6">
                <div className="font-mono text-[11px] text-[#F0CD8C] tracking-wide mb-3">{c.label}</div>
                <h4 className="text-white font-semibold text-[15px] mb-2">{c.title}</h4>
                <p className="text-[#B6C0D3] text-[13.5px] leading-relaxed">{c.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Vendor CTA strip */}
      <section className="bg-white border-b border-[#E7EBF2] py-6 px-6">
        <div className="max-w-5xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <Building2 className="w-5 h-5 text-[#B4863A]" />
            <p className="text-sm text-[#0A1424] font-medium">
              Are you a <strong>Supplier / Vendor?</strong> Manage your catalog and respond to RFQs.
            </p>
          </div>
          <Link to="/vendor-portal/login" className="inline-flex items-center gap-2 text-sm font-medium border border-[#0A1424] rounded-lg px-4 py-2 hover:bg-[#0A1424] hover:text-white transition shrink-0">
            <Truck className="w-4 h-4" /> Vendor Portal Login
          </Link>
        </div>
      </section>

      {/* Final CTA */}
      <section className="relative py-24 px-6 text-center overflow-hidden bg-[#060B16]">
        <div className="pointer-events-none absolute inset-0" style={{ background: 'radial-gradient(900px 400px at 50% -20%, rgba(228,178,92,0.18), transparent 60%)' }} />
        <div className="relative max-w-xl mx-auto">
          <span className="font-mono text-xs uppercase tracking-widest text-[#F0CD8C]">Get started</span>
          <h2 className="text-3xl font-semibold tracking-tight text-white mt-3">Put your next purchase on the record.</h2>
          <p className="text-[#B6C0D3] mt-3 leading-relaxed">
            Set up your company, item master, and first vendor in under an hour \u2014 no procurement overhaul required to start.
          </p>
          <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-3">
            <Link to="/signup" className="inline-flex items-center gap-2 bg-[#E4B25C] text-[#060B16] font-semibold rounded-lg px-7 py-3 hover:bg-[#F0CD8C] transition">
              Create Company Account <ArrowRight className="w-4 h-4" />
            </Link>
            <Link to="/vendor-portal/login" className="inline-flex items-center gap-2 text-white border border-white/25 rounded-lg px-6 py-3 hover:bg-white/5 hover:border-white/40 transition">
              <Truck className="w-4 h-4" /> I'm a Vendor
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-[#060B16] border-t border-white/10 py-6 text-center text-xs text-[#7C8AA5]">
        © {new Date().getFullYear()} ProcureAI · Built for Indian SMEs
      </footer>
    </div>
  );
}
