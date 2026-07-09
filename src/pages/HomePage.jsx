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


<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>ProcureAI — Procurement your finance team will actually trust</title>
<link rel="preconnect" href="https://fonts.googleapis.com">
<link href="https://fonts.googleapis.com/css2?family=Instrument+Sans:wght@400;500;600;700&family=IBM+Plex+Mono:wght@400;500;600&display=swap" rel="stylesheet">
<style>
  :root{
    --navy-950:#060B16;
    --navy-900:#0A1424;
    --navy-800:#101C33;
    --navy-700:#1A2A47;
    --slate-500:#7C8AA5;
    --slate-300:#B6C0D3;
    --slate-100:#E7EBF2;
    --paper:#F6F7FA;
    --white:#FFFFFF;
    --gold-300:#F0CD8C;
    --gold-400:#E4B25C;
    --gold-600:#B4863A;
    --green-500:#3FB88A;
    --red-500:#E0715C;
    --radius-md:10px;
    --radius-lg:16px;
    --shadow-sm:0 1px 2px rgba(6,11,22,0.06), 0 1px 1px rgba(6,11,22,0.04);
    --shadow-md:0 8px 24px -8px rgba(6,11,22,0.18);
    --shadow-lg:0 24px 60px -16px rgba(6,11,22,0.35);
    --font-display:'Instrument Sans', -apple-system, sans-serif;
    --font-mono:'IBM Plex Mono', 'SFMono-Regular', monospace;
  }
  *{box-sizing:border-box; margin:0; padding:0;}
  html{scroll-behavior:smooth;}
  body{
    font-family:var(--font-display);
    background:var(--paper);
    color:var(--navy-900);
    line-height:1.5;
    -webkit-font-smoothing:antialiased;
  }
  img,svg{display:block; max-width:100%;}
  a{color:inherit; text-decoration:none;}
  .wrap{max-width:1180px; margin:0 auto; padding:0 32px;}
  section{position:relative;}
  .eyebrow{
    font-family:var(--font-mono);
    font-size:12px;
    letter-spacing:.14em;
    text-transform:uppercase;
    font-weight:500;
    display:inline-flex;
    align-items:center;
    gap:8px;
    color:var(--gold-600);
  }
  .eyebrow::before{
    content:'';
    width:14px; height:1px;
    background:var(--gold-600);
    display:inline-block;
  }
  section.dark .eyebrow{color:var(--gold-300);}
  section.dark .eyebrow::before{background:var(--gold-300);}
  h1,h2,h3{
    font-weight:600;
    letter-spacing:-0.02em;
    color:var(--navy-950);
  }
  section.dark h1, section.dark h2, section.dark h3{color:var(--white);}
  h2{font-size:clamp(28px,3.4vw,40px); line-height:1.12;}
  .section-head{max-width:640px; margin-bottom:52px;}
  .section-head p{color:var(--slate-500); font-size:17px; margin-top:14px; line-height:1.6;}
  section.dark .section-head p{color:var(--slate-300);}
  .btn{
    display:inline-flex; align-items:center; justify-content:center; gap:8px;
    padding:13px 24px;
    border-radius:8px;
    font-size:15px; font-weight:600;
    cursor:pointer;
    border:1px solid transparent;
    transition:transform .15s ease, box-shadow .15s ease, background .15s ease;
    white-space:nowrap;
  }
  .btn:hover{transform:translateY(-1px);}
  .btn-primary{ background:var(--gold-400); color:var(--navy-950); box-shadow:0 1px 0 rgba(0,0,0,0.05) inset;}
  .btn-primary:hover{background:var(--gold-300); box-shadow:0 8px 20px -6px rgba(228,178,92,0.5);}
  .btn-ghost{ background:transparent; color:var(--white); border-color:rgba(255,255,255,0.22);}
  .btn-ghost:hover{background:rgba(255,255,255,0.06); border-color:rgba(255,255,255,0.4);}
  .btn-outline-dark{background:transparent; color:var(--navy-900); border-color:var(--navy-900);}
  .btn-outline-dark:hover{background:var(--navy-900); color:#fff;}

  /* ---------- NAV ---------- */
  header{
    position:sticky; top:0; z-index:50;
    background:rgba(6,11,22,0.86);
    backdrop-filter:blur(10px);
    border-bottom:1px solid rgba(255,255,255,0.08);
  }
  nav{
    max-width:1180px; margin:0 auto; padding:0 32px;
    height:68px; display:flex; align-items:center; justify-content:space-between;
  }
  .logo{
    display:flex; align-items:center; gap:10px;
    font-weight:700; font-size:17px; color:#fff; letter-spacing:-0.01em;
  }
  .logo .mark{
    width:26px; height:26px; border-radius:6px;
    background:linear-gradient(135deg,var(--gold-300),var(--gold-600));
    position:relative;
  }
  .logo .mark::after{
    content:'';
    position:absolute; inset:6px;
    border:1.4px solid var(--navy-950);
    border-radius:2px;
  }
  .nav-links{display:flex; gap:30px; font-size:14.5px; color:var(--slate-300); }
  .nav-links a:hover{color:#fff;}
  .nav-cta{display:flex; align-items:center; gap:18px;}
  .nav-cta .login{font-size:14.5px; color:var(--slate-300); font-weight:500;}
  .nav-cta .login:hover{color:#fff;}
  @media (max-width:860px){ .nav-links{display:none;} }

  /* ---------- HERO ---------- */
  .hero{
    background:
      radial-gradient(1100px 500px at 82% -10%, rgba(228,178,92,0.16), transparent 60%),
      radial-gradient(700px 400px at 8% 0%, rgba(63,184,138,0.08), transparent 55%),
      linear-gradient(180deg,var(--navy-950), var(--navy-900) 60%, var(--navy-900));
    padding:96px 0 0;
    overflow:hidden;
  }
  .hero-grid{
    display:grid; grid-template-columns:1fr; gap:20px; text-align:center;
    max-width:820px; margin:0 auto;
  }
  .hero .eyebrow{justify-content:center; color:var(--gold-300);}
  .hero .eyebrow::before{background:var(--gold-300);}
  .hero h1{
    font-size:clamp(36px,5.4vw,60px);
    line-height:1.06;
    color:#fff;
    margin-top:18px;
  }
  .hero h1 em{
    font-style:normal;
    background:linear-gradient(100deg,var(--gold-300),var(--gold-400) 60%);
    -webkit-background-clip:text; background-clip:text; color:transparent;
  }
  .hero p.sub{
    font-size:19px; color:var(--slate-300);
    max-width:600px; margin:22px auto 0;
    line-height:1.6;
  }
  .hero-ctas{
    display:flex; gap:14px; justify-content:center; margin-top:34px; flex-wrap:wrap;
  }
  .hero-trust{
    margin-top:18px; font-size:13px; color:var(--slate-500);
    font-family:var(--font-mono);
    letter-spacing:.02em;
  }
  .hero-trust svg{display:inline-block; vertical-align:-3px; margin-right:6px;}

  /* dashboard mockup */
  .mockup-stage{
    margin-top:64px;
    padding:0 32px 0;
    display:flex; justify-content:center;
  }
  .mockup{
    width:100%; max-width:1020px;
    border-radius:16px 16px 0 0;
    background:var(--navy-800);
    border:1px solid rgba(255,255,255,0.09);
    border-bottom:none;
    box-shadow:var(--shadow-lg);
    overflow:hidden;
    transform:perspective(1400px) rotateX(3deg);
    transform-origin:bottom center;
  }
  .mockup-bar{
    height:38px; display:flex; align-items:center; gap:7px; padding:0 16px;
    background:var(--navy-900); border-bottom:1px solid rgba(255,255,255,0.07);
  }
  .mockup-bar span{width:9px; height:9px; border-radius:50%; background:rgba(255,255,255,0.16);}
  .mockup-body{ display:grid; grid-template-columns:180px 1fr; min-height:380px;}
  .mockup-side{
    background:var(--navy-900);
    border-right:1px solid rgba(255,255,255,0.07);
    padding:20px 14px;
  }
  .mockup-side .item{
    font-size:12.5px; color:var(--slate-500); padding:9px 10px; border-radius:6px; margin-bottom:2px;
  }
  .mockup-side .item.active{ background:rgba(228,178,92,0.12); color:var(--gold-300); font-weight:600;}
  .mockup-main{padding:22px 26px; }
  .mockup-topline{ display:flex; justify-content:space-between; align-items:center; margin-bottom:18px;}
  .mockup-topline h4{ color:#fff; font-size:15px; font-weight:600;}
  .stamp{
    font-family:var(--font-mono); font-size:10.5px; letter-spacing:.08em;
    color:var(--green-500); border:1.4px solid var(--green-500);
    padding:4px 9px; border-radius:5px; transform:rotate(-4deg);
    text-transform:uppercase; font-weight:600;
  }
  .kpi-row{ display:grid; grid-template-columns:repeat(4,1fr); gap:12px; margin-bottom:18px;}
  .kpi{
    background:var(--navy-700); border:1px solid rgba(255,255,255,0.06);
    border-radius:10px; padding:13px 14px;
  }
  .kpi .lbl{font-size:10.5px; color:var(--slate-500); font-family:var(--font-mono); text-transform:uppercase; letter-spacing:.06em;}
  .kpi .val{font-size:20px; color:#fff; font-weight:600; margin-top:5px;}
  .kpi .delta{font-size:11px; color:var(--green-500); margin-top:2px; font-family:var(--font-mono);}
  .table-mock{ border:1px solid rgba(255,255,255,0.07); border-radius:10px; overflow:hidden;}
  .table-mock .row{
    display:grid; grid-template-columns:90px 1fr 100px 110px 90px;
    padding:10px 14px; font-size:12px; color:var(--slate-300);
    border-bottom:1px solid rgba(255,255,255,0.06);
    align-items:center;
  }
  .table-mock .row:last-child{border-bottom:none;}
  .table-mock .head{ background:var(--navy-700); color:var(--slate-500); font-family:var(--font-mono); font-size:10.5px; text-transform:uppercase; letter-spacing:.05em;}
  .pill{ font-size:10.5px; font-family:var(--font-mono); padding:3px 8px; border-radius:20px; display:inline-block; font-weight:600;}
  .pill.approved{background:rgba(63,184,138,0.14); color:var(--green-500);}
  .pill.pending{background:rgba(228,178,92,0.14); color:var(--gold-300);}
  .pill.review{background:rgba(224,113,92,0.14); color:var(--red-500);}
  .mono{font-family:var(--font-mono);}

  /* ---------- TRUST STRIP ---------- */
  .trust-strip{
    background:var(--navy-950);
    border-top:1px solid rgba(255,255,255,0.06);
    padding:36px 0 44px;
  }
  .trust-row{
    display:flex; justify-content:space-between; align-items:center; gap:24px; flex-wrap:wrap;
  }
  .trust-row .label{ font-family:var(--font-mono); font-size:12px; color:var(--slate-500); text-transform:uppercase; letter-spacing:.1em; white-space:nowrap;}
  .trust-logos{ display:flex; gap:38px; align-items:center; flex-wrap:wrap; opacity:.6;}
  .trust-logos span{ font-weight:700; color:var(--slate-300); font-size:16px; letter-spacing:-0.01em;}
  .stat-strip{
    display:grid; grid-template-columns:repeat(4,1fr); gap:20px;
    margin-top:32px; padding-top:32px; border-top:1px solid rgba(255,255,255,0.06);
  }
  .stat-strip .s{ text-align:left;}
  .stat-strip .num{ font-size:30px; font-weight:700; color:#fff; letter-spacing:-0.02em;}
  .stat-strip .num span{color:var(--gold-400);}
  .stat-strip .cap{ font-size:13px; color:var(--slate-500); margin-top:4px;}
  @media (max-width:760px){ .stat-strip{grid-template-columns:1fr 1fr;} }

  /* ---------- GENERIC LIGHT SECTION ---------- */
  section.light{ background:var(--paper); padding:100px 0;}
  section.light.alt{ background:var(--white);}

  /* how it works */
  .steps-row{ display:grid; grid-template-columns:repeat(4,1fr); gap:0; position:relative;}
  .steps-row::before{
    content:''; position:absolute; top:22px; left:6%; right:6%; height:1px;
    background:repeating-linear-gradient(to right, var(--slate-300) 0 6px, transparent 6px 12px);
  }
  .step{ position:relative; padding-right:24px;}
  .step .num{
    width:44px; height:44px; border-radius:50%; background:var(--white); border:1.5px solid var(--navy-900);
    display:flex; align-items:center; justify-content:center; font-family:var(--font-mono); font-weight:600; font-size:15px;
    position:relative; z-index:2; margin-bottom:22px;
  }
  .step h3{ font-size:17px; margin-bottom:8px;}
  .step p{ font-size:14.5px; color:var(--slate-500); line-height:1.55;}
  @media (max-width:900px){ .steps-row{grid-template-columns:1fr 1fr; row-gap:36px;} .steps-row::before{display:none;} }
  @media (max-width:560px){ .steps-row{grid-template-columns:1fr;} }

  /* workflow sections (buyer / vendor) */
  .flow-layout{ display:grid; grid-template-columns:0.95fr 1.05fr; gap:64px; align-items:center;}
  @media (max-width:920px){ .flow-layout{grid-template-columns:1fr;} }
  .flow-list{ display:flex; flex-direction:column; }
  .flow-item{
    display:flex; gap:18px; padding:20px 0; border-bottom:1px solid var(--slate-100);
  }
  .flow-item:last-child{border-bottom:none;}
  .flow-item .idx{
    font-family:var(--font-mono); font-size:13px; color:var(--gold-600); font-weight:600; padding-top:2px; min-width:22px;
  }
  .flow-item h4{ font-size:16px; margin-bottom:5px; color:var(--navy-950);}
  .flow-item p{ font-size:14px; color:var(--slate-500); line-height:1.55;}

  .diagram-card{
    background:var(--white); border:1px solid var(--slate-100); border-radius:var(--radius-lg);
    box-shadow:var(--shadow-md); padding:28px;
  }
  .diagram-card.dark-card{ background:var(--navy-900); border-color:var(--navy-700);}
  .chip-flow{ display:flex; flex-direction:column; gap:0;}
  .chip{
    display:flex; align-items:center; gap:12px;
    background:var(--paper); border:1px solid var(--slate-100); border-radius:10px;
    padding:13px 16px; font-size:13.5px; font-weight:500; color:var(--navy-900);
  }
  .chip .dot{width:8px; height:8px; border-radius:50%; background:var(--gold-400); flex-shrink:0;}
  .chip .tag{ margin-left:auto; font-family:var(--font-mono); font-size:10.5px; color:var(--slate-500);}
  .connector{ height:22px; display:flex; align-items:center; margin-left:24px;}
  .connector::before{ content:''; width:1.5px; height:100%; background:var(--slate-300);}

  /* OCR section */
  .ocr-panels{ display:grid; grid-template-columns:1fr 1fr; gap:22px;}
  @media (max-width:800px){ .ocr-panels{grid-template-columns:1fr;} }
  .panel{
    background:var(--white); border:1px solid var(--slate-100); border-radius:var(--radius-lg);
    padding:26px; box-shadow:var(--shadow-sm);
  }
  .panel .ptitle{ display:flex; align-items:center; gap:10px; margin-bottom:16px;}
  .panel .ptitle .icon{
    width:30px; height:30px; border-radius:8px; display:flex; align-items:center; justify-content:center;
    background:rgba(228,178,92,0.14); color:var(--gold-600); font-family:var(--font-mono); font-size:13px; font-weight:700;
  }
  .panel h4{ font-size:16px;}
  .panel ul{ list-style:none; margin-top:4px;}
  .panel li{ font-size:14px; color:var(--slate-500); padding:7px 0 7px 20px; position:relative; border-top:1px solid var(--slate-100);}
  .panel li:first-child{border-top:none;}
  .panel li::before{ content:'—'; position:absolute; left:0; color:var(--gold-500,var(--gold-600));}
  .conf-bar{ height:6px; border-radius:4px; background:var(--slate-100); overflow:hidden; margin:8px 0 4px;}
  .conf-bar i{ display:block; height:100%; background:linear-gradient(90deg,var(--green-500),var(--gold-400));}

  /* invoice matching diagram */
  .match-grid{ display:grid; grid-template-columns:repeat(3,1fr); gap:16px; margin-bottom:20px;}
  @media (max-width:760px){ .match-grid{grid-template-columns:1fr;} }
  .match-card{
    background:var(--white); border:1px solid var(--slate-100); border-radius:12px; padding:18px;
    text-align:center; position:relative;
  }
  .match-card .mlabel{font-family:var(--font-mono); font-size:11px; color:var(--slate-500); text-transform:uppercase; letter-spacing:.06em;}
  .match-card .mval{font-size:22px; font-weight:700; margin-top:6px;}
  .match-check{
    display:flex; align-items:center; justify-content:center; gap:10px; margin:6px 0 26px; color:var(--green-500); font-family:var(--font-mono); font-size:13px; font-weight:600;
  }

  /* inventory + billing */
  .split-2{ display:grid; grid-template-columns:1fr 1fr; gap:26px;}
  @media (max-width:800px){ .split-2{grid-template-columns:1fr;} }
  .stock-row{ display:flex; align-items:center; gap:10px; padding:10px 0; border-bottom:1px solid var(--slate-100); font-size:13.5px;}
  .stock-row:last-child{border-bottom:none;}
  .stock-bar{ flex:1; height:6px; background:var(--slate-100); border-radius:4px; overflow:hidden;}
  .stock-bar i{display:block; height:100%; background:var(--navy-900);}
  .stock-bar i.low{background:var(--red-500);}

  /* benefits grid */
  .benefit-grid{ display:grid; grid-template-columns:repeat(3,1fr); gap:20px;}
  @media (max-width:860px){ .benefit-grid{grid-template-columns:1fr 1fr;} }
  @media (max-width:560px){ .benefit-grid{grid-template-columns:1fr;} }
  .benefit-card{
    background:var(--white); border:1px solid var(--slate-100); border-radius:14px; padding:26px;
    transition:box-shadow .2s ease, transform .2s ease;
  }
  .benefit-card:hover{ box-shadow:var(--shadow-md); transform:translateY(-2px);}
  .benefit-card .bicon{
    width:36px; height:36px; border-radius:9px; background:var(--navy-950); color:var(--gold-400);
    display:flex; align-items:center; justify-content:center; margin-bottom:16px; font-size:15px;
  }
  .benefit-card h4{ font-size:16.5px; margin-bottom:8px;}
  .benefit-card p{ font-size:14px; color:var(--slate-500); line-height:1.55;}

  /* security section */
  section.security{
    background:linear-gradient(180deg,var(--navy-950), var(--navy-900));
    padding:100px 0;
  }
  .sec-grid{ display:grid; grid-template-columns:repeat(4,1fr); gap:20px;}
  @media (max-width:900px){ .sec-grid{grid-template-columns:1fr 1fr;} }
  @media (max-width:560px){ .sec-grid{grid-template-columns:1fr;} }
  .sec-card{
    background:rgba(255,255,255,0.03); border:1px solid rgba(255,255,255,0.09); border-radius:14px; padding:24px;
  }
  .sec-card .sicon{ color:var(--gold-300); font-family:var(--font-mono); font-size:12px; margin-bottom:14px; letter-spacing:.06em;}
  .sec-card h4{ color:#fff; font-size:15.5px; margin-bottom:8px;}
  .sec-card p{ color:var(--slate-300); font-size:13.5px; line-height:1.55;}

  /* final CTA */
  .final-cta{
    background:radial-gradient(900px 400px at 50% -20%, rgba(228,178,92,0.18), transparent 60%), var(--navy-950);
    padding:110px 0; text-align:center;
  }
  .final-cta h2{ color:#fff; max-width:640px; margin:0 auto;}
  .final-cta p{ color:var(--slate-300); max-width:520px; margin:16px auto 0; font-size:16.5px;}
  .final-cta .hero-ctas{ margin-top:32px;}

  /* footer */
  footer{ background:var(--navy-950); border-top:1px solid rgba(255,255,255,0.07); padding:48px 0 32px;}
  .foot-top{ display:flex; justify-content:space-between; flex-wrap:wrap; gap:40px; padding-bottom:36px; border-bottom:1px solid rgba(255,255,255,0.07);}
  .foot-cols{ display:flex; gap:60px; flex-wrap:wrap;}
  .foot-col h5{ font-family:var(--font-mono); font-size:11px; color:var(--slate-500); text-transform:uppercase; letter-spacing:.08em; margin-bottom:14px;}
  .foot-col a{ display:block; font-size:14px; color:var(--slate-300); padding:5px 0;}
  .foot-col a:hover{color:#fff;}
  .foot-bottom{ display:flex; justify-content:space-between; padding-top:22px; font-size:12.5px; color:var(--slate-500); flex-wrap:wrap; gap:10px;}

  .fade-in{ animation:fadeUp .7s ease both;}
  @keyframes fadeUp{ from{opacity:0; transform:translateY(14px);} to{opacity:1; transform:translateY(0);} }
</style>
</head>
<body>

<header>
  <nav>
    <div class="logo"><span class="mark"></span>ProcureAI</div>
    <div class="nav-links">
      <a href="#how">How it works</a>
      <a href="#buyer">For buyers</a>
      <a href="#vendor">For vendors</a>
      <a href="#security">Security</a>
      <a href="#pricing">Pricing</a>
    </div>
    <div class="nav-cta">
      <a class="login" href="#">Sign in</a>
      <a class="btn btn-primary" href="#cta" style="padding:9px 18px; font-size:14px;">Start free trial</a>
    </div>
  </nav>
</header>

<!-- ============ HERO ============ -->
<section class="hero">
  <div class="wrap hero-grid fade-in">
    <span class="eyebrow">Procure-to-pay, in one system of record</span>
    <h1>Every purchase, <em>approved on record</em> — not on email.</h1>
    <p class="sub">ProcureAI replaces spreadsheets, inboxes, and side-channel approvals with one auditable flow: requests, RFQs, purchase orders, receiving, invoice matching, and payment — tracked from the first request to the final rupee.</p>
    <div class="hero-ctas">
      <a href="#cta" class="btn btn-primary">Start free trial</a>
      <a href="#how" class="btn btn-ghost">See how it works →</a>
    </div>
    <div class="hero-trust">
      <svg width="13" height="13" viewBox="0 0 24 24" fill="none"><path d="M12 2L4 5v6c0 5 3.4 8.6 8 9 4.6-.4 8-4 8-9V5l-8-3z" stroke="#7C8AA5" stroke-width="1.6"/></svg>
      SOC-2-aligned controls · role-based approvals · full audit trail · no card required
    </div>
  </div>

  <div class="mockup-stage">
    <div class="mockup fade-in" style="animation-delay:.15s">
      <div class="mockup-bar"><span></span><span></span><span></span></div>
      <div class="mockup-body">
        <div class="mockup-side">
          <div class="item">Owner dashboard</div>
          <div class="item active">Purchase orders</div>
          <div class="item">Vendors</div>
          <div class="item">RFQs</div>
          <div class="item">Invoices</div>
          <div class="item">Inventory</div>
          <div class="item">Analytics</div>
          <div class="item">Billing</div>
        </div>
        <div class="mockup-main">
          <div class="mockup-topline">
            <h4>Purchase orders — this month</h4>
            <span class="stamp">✓ 3-way matched</span>
          </div>
          <div class="kpi-row">
            <div class="kpi"><div class="lbl">Open PRs</div><div class="val">18</div><div class="delta">4 awaiting quotes</div></div>
            <div class="kpi"><div class="lbl">Spend MTD</div><div class="val">₹41.2L</div><div class="delta">↓ 6% vs budget</div></div>
            <div class="kpi"><div class="lbl">Avg. approval</div><div class="val">6.4 hrs</div><div class="delta">↓ from 2.1 days</div></div>
            <div class="kpi"><div class="lbl">Match rate</div><div class="val">97.3%</div><div class="delta">auto-reconciled</div></div>
          </div>
          <div class="table-mock">
            <div class="row head"><span>PO#</span><span>Vendor</span><span>Amount</span><span>Stage</span><span>Status</span></div>
            <div class="row"><span class="mono">PO-2291</span><span>Sarvodaya Steel</span><span class="mono">₹2,84,000</span><span>Receiving</span><span><span class="pill approved">Approved</span></span></div>
            <div class="row"><span class="mono">PO-2292</span><span>Nova Packaging</span><span class="mono">₹96,500</span><span>Approval</span><span><span class="pill pending">Pending</span></span></div>
            <div class="row"><span class="mono">PO-2293</span><span>Kiran Traders</span><span class="mono">₹1,12,300</span><span>Invoice match</span><span><span class="pill review">Review</span></span></div>
          </div>
        </div>
      </div>
    </div>
  </div>
</section>

<!-- ============ TRUST STRIP ============ -->
<section class="trust-strip">
  <div class="wrap">
    <div class="trust-row">
      <span class="label">Built for procurement, finance &amp; ops teams at</span>
      <div class="trust-logos">
        <span>Kavach Steel</span><span>Northline Foods</span><span>Sarvodaya Group</span><span>Bluepeak Retail</span><span>Anchor Pharma</span>
      </div>
    </div>
    <div class="stat-strip">
      <div class="s"><div class="num"><span>14</span> modules</div><div class="cap">one platform, no add-on pricing</div></div>
      <div class="s"><div class="num">3-way</div><div class="cap">PO · receipt · invoice matching</div></div>
      <div class="s"><div class="num">100%</div><div class="cap">tenant-isolated data by design</div></div>
      <div class="s"><div class="num">&lt; 1 day</div><div class="cap">avg. onboarding to first PO</div></div>
    </div>
  </div>
</section>

<!-- ============ HOW IT WORKS ============ -->
<section class="light" id="how">
  <div class="wrap">
    <div class="section-head">
      <span class="eyebrow">How it works</span>
      <h2 style="margin-top:14px;">One thread, from request to payment</h2>
      <p>No forked spreadsheets, no approvals buried in email. Every purchase moves through the same tracked sequence, visible to whoever needs to see it.</p>
    </div>
    <div class="steps-row">
      <div class="step">
        <div class="num">01</div>
        <h3>Request</h3>
        <p>Anyone raises a purchase request against the item master — quantity, budget, and justification attached from the start.</p>
      </div>
      <div class="step">
        <div class="num">02</div>
        <h3>Source</h3>
        <p>Send RFQs to qualified vendors, collect quotes through the vendor portal, and compare them side by side.</p>
      </div>
      <div class="step">
        <div class="num">03</div>
        <h3>Approve</h3>
        <p>The purchase order routes through the right approval chain automatically, with every decision timestamped.</p>
      </div>
      <div class="step">
        <div class="num">04</div>
        <h3>Reconcile</h3>
        <p>Goods receipt, invoice, and PO are matched automatically before payment is ever released.</p>
      </div>
    </div>
  </div>
</section>

<!-- ============ BUYER WORKFLOW ============ -->
<section class="light alt" id="buyer">
  <div class="wrap">
    <div class="section-head">
      <span class="eyebrow">For buyers &amp; procurement teams</span>
      <h2 style="margin-top:14px;">Turn a request into a comparable, defensible decision</h2>
      <p>Every purchase request becomes a structured record — sourced, quoted, and approved with a reason attached to every step.</p>
    </div>
    <div class="flow-layout">
      <div class="flow-list">
        <div class="flow-item">
          <span class="idx">01</span>
          <div><h4>Raise a purchase request</h4><p>Pick the item from your item master, set quantity and budget, and route it to the right approver automatically.</p></div>
        </div>
        <div class="flow-item">
          <span class="idx">02</span>
          <div><h4>Send RFQs to vendors</h4><p>Push the request to shortlisted vendors at once. Each vendor responds through their own portal — no email attachments to chase.</p></div>
        </div>
        <div class="flow-item">
          <span class="idx">03</span>
          <div><h4>Compare quotes side by side</h4><p>Price, lead time, and vendor history sit in one table, so the cheapest quote isn't the only thing you're weighing.</p></div>
        </div>
        <div class="flow-item">
          <span class="idx">04</span>
          <div><h4>Approve the purchase order</h4><p>The PO routes through your approval chain by value and category — no purchase goes out without the right sign-off.</p></div>
        </div>
        <div class="flow-item">
          <span class="idx">05</span>
          <div><h4>Record goods receipt</h4><p>Confirm what actually arrived against what was ordered, quantity by quantity — the record invoice matching relies on.</p></div>
        </div>
      </div>
      <div class="diagram-card">
        <div class="chip-flow">
          <div class="chip"><span class="dot"></span>Purchase request <span class="tag">PR-1042</span></div>
          <div class="connector"></div>
          <div class="chip"><span class="dot"></span>RFQ sent to 4 vendors <span class="tag">RFQ-338</span></div>
          <div class="connector"></div>
          <div class="chip"><span class="dot"></span>Quote comparison <span class="tag">3 responses</span></div>
          <div class="connector"></div>
          <div class="chip" style="background:rgba(228,178,92,0.1); border-color:rgba(228,178,92,0.35);"><span class="dot"></span>PO approval <span class="tag">2-step chain</span></div>
          <div class="connector"></div>
          <div class="chip"><span class="dot"></span>Goods receipt logged <span class="tag">GRN-771</span></div>
        </div>
      </div>
    </div>
  </div>
</section>

<!-- ============ VENDOR WORKFLOW ============ -->
<section class="light" id="vendor">
  <div class="wrap">
    <div class="section-head">
      <span class="eyebrow">For vendors</span>
      <h2 style="margin-top:14px;">A single portal, so vendors stop calling to ask "where's my payment"</h2>
      <p>Vendors get one place to see RFQs, submit quotes, track PO status, and follow their invoice through to payment.</p>
    </div>
    <div class="flow-layout">
      <div class="diagram-card" style="order:1;">
        <div class="chip-flow">
          <div class="chip"><span class="dot" style="background:var(--green-500);"></span>Vendor invited &amp; verified <span class="tag">status: active</span></div>
          <div class="connector"></div>
          <div class="chip"><span class="dot" style="background:var(--green-500);"></span>RFQ received in portal <span class="tag">RFQ-338</span></div>
          <div class="connector"></div>
          <div class="chip"><span class="dot" style="background:var(--green-500);"></span>Quote submitted <span class="tag">₹96,500</span></div>
          <div class="connector"></div>
          <div class="chip" style="background:rgba(63,184,138,0.08); border-color:rgba(63,184,138,0.3);"><span class="dot" style="background:var(--green-500);"></span>PO received &amp; accepted <span class="tag">PO-2292</span></div>
          <div class="connector"></div>
          <div class="chip"><span class="dot" style="background:var(--green-500);"></span>Invoice submitted &amp; tracked <span class="tag">paid in 9 days</span></div>
        </div>
      </div>
      <div class="flow-list" style="order:2;">
        <div class="flow-item">
          <span class="idx">01</span>
          <div><h4>Onboard once, sell to every buyer on the platform</h4><p>Vendors register once with the documents that matter — GST, bank details, catalog — and reuse that profile across every RFQ.</p></div>
        </div>
        <div class="flow-item">
          <span class="idx">02</span>
          <div><h4>Respond to RFQs directly</h4><p>Quotes go in through the portal with pricing and lead time, timestamped the moment they're submitted.</p></div>
        </div>
        <div class="flow-item">
          <span class="idx">03</span>
          <div><h4>See PO status without asking</h4><p>Accepted, in fulfillment, received, invoiced, paid — every stage is visible without a phone call.</p></div>
        </div>
        <div class="flow-item">
          <span class="idx">04</span>
          <div><h4>Submit and track invoices</h4><p>Upload the invoice against the PO and follow it through matching and payment, with status updated automatically.</p></div>
        </div>
      </div>
    </div>
  </div>
</section>

<!-- ============ OCR / MANUAL FALLBACK ============ -->
<section class="light alt">
  <div class="wrap">
    <div class="section-head">
      <span class="eyebrow">Data entry</span>
      <h2 style="margin-top:14px;">Invoices get read automatically — and checked when they should be</h2>
      <p>OCR extracts line items, amounts, and tax from vendor invoices on upload. When confidence is low, it's routed for manual review instead of guessed at.</p>
    </div>
    <div class="ocr-panels">
      <div class="panel">
        <div class="ptitle"><span class="icon">OCR</span><h4>Automatic extraction</h4></div>
        <p style="font-size:13.5px; color:var(--slate-500); margin-bottom:10px;">Invoice INV-4471.pdf — Kiran Traders</p>
        <div class="conf-bar"><i style="width:94%;"></i></div>
        <p style="font-size:12px; color:var(--green-500); font-family:var(--font-mono); margin-bottom:6px;">94% confidence — auto-accepted</p>
        <ul>
          <li>Invoice number &amp; date matched to PO-2293</li>
          <li>Line items extracted: 6 of 6</li>
          <li>Tax and total cross-checked against PO value</li>
        </ul>
      </div>
      <div class="panel">
        <div class="ptitle"><span class="icon" style="background:rgba(224,113,92,0.14); color:var(--red-500);">!</span><h4>Manual fallback</h4></div>
        <p style="font-size:13.5px; color:var(--slate-500); margin-bottom:10px;">Invoice INV-4488.pdf — Nova Packaging</p>
        <div class="conf-bar"><i style="width:52%; background:linear-gradient(90deg,var(--red-500),var(--gold-400));"></i></div>
        <p style="font-size:12px; color:var(--red-500); font-family:var(--font-mono); margin-bottom:6px;">52% confidence — sent for review</p>
        <ul>
          <li>Scanned copy, 2 line items unreadable</li>
          <li>Routed to AP for manual entry, not silently approved</li>
          <li>Original file kept attached for audit</li>
        </ul>
      </div>
    </div>
  </div>
</section>

<!-- ============ INVOICE / PAYMENT / APPROVAL ============ -->
<section class="light">
  <div class="wrap">
    <div class="section-head">
      <span class="eyebrow">Invoice &amp; payment</span>
      <h2 style="margin-top:14px;">Payment only moves after three things agree</h2>
      <p>The purchase order, the goods receipt, and the vendor invoice are matched line by line. Mismatches stop the payment, not the other way around.</p>
    </div>
    <div class="match-grid">
      <div class="match-card">
        <div class="mlabel">Purchase order</div>
        <div class="mval">₹1,12,300</div>
        <p style="font-size:12px; color:var(--slate-500); margin-top:4px;">PO-2293 · 6 line items</p>
      </div>
      <div class="match-card">
        <div class="mlabel">Goods receipt</div>
        <div class="mval">₹1,12,300</div>
        <p style="font-size:12px; color:var(--slate-500); margin-top:4px;">GRN-771 · 6 of 6 received</p>
      </div>
      <div class="match-card">
        <div class="mlabel">Vendor invoice</div>
        <div class="mval">₹1,12,300</div>
        <p style="font-size:12px; color:var(--slate-500); margin-top:4px;">INV-4471 · matched</p>
      </div>
    </div>
    <div class="match-check">✓ All three match — cleared for payment approval</div>
    <div class="flow-layout" style="grid-template-columns:1fr 1fr;">
      <div class="diagram-card">
        <h4 style="margin-bottom:14px; font-size:15px;">Approval chain</h4>
        <div class="chip-flow">
          <div class="chip"><span class="dot"></span>AP review <span class="tag">stage 1</span></div>
          <div class="connector"></div>
          <div class="chip"><span class="dot"></span>Finance manager <span class="tag">stage 2</span></div>
          <div class="connector"></div>
          <div class="chip" style="background:rgba(63,184,138,0.08); border-color:rgba(63,184,138,0.3);"><span class="dot" style="background:var(--green-500);"></span>Payment released <span class="tag">to bank</span></div>
        </div>
      </div>
      <div style="align-self:center;">
        <h3 style="font-size:19px; margin-bottom:12px;">Mismatches get flagged, not paid</h3>
        <p style="color:var(--slate-500); font-size:14.5px; line-height:1.6;">If a vendor invoices for more than was received, or a PO changes after the fact, the payment holds automatically and routes back for review — with the discrepancy shown, not just a rejected status.</p>
      </div>
    </div>
  </div>
</section>

<!-- ============ INVENTORY & BILLING ============ -->
<section class="light alt">
  <div class="wrap">
    <div class="section-head">
      <span class="eyebrow">Inventory &amp; billing</span>
      <h2 style="margin-top:14px;">Stock and spend, tracked from the same source of truth</h2>
      <p>Goods receipt updates inventory automatically. Your own subscription and usage are billed the same way you'd expect your vendors to bill you.</p>
    </div>
    <div class="split-2">
      <div class="diagram-card">
        <h4 style="margin-bottom:16px; font-size:15px;">Inventory levels</h4>
        <div class="stock-row"><span style="width:110px;">MS Angle 40mm</span><div class="stock-bar"><i style="width:78%;"></i></div><span class="mono" style="font-size:12px; color:var(--slate-500);">780/1000</span></div>
        <div class="stock-row"><span style="width:110px;">Corrugated box L</span><div class="stock-bar"><i class="low" style="width:12%;"></i></div><span class="mono" style="font-size:12px; color:var(--red-500);">120/1000 — reorder</span></div>
        <div class="stock-row"><span style="width:110px;">Industrial primer</span><div class="stock-bar"><i style="width:55%;"></i></div><span class="mono" style="font-size:12px; color:var(--slate-500);">330/600</span></div>
        <div class="stock-row"><span style="width:110px;">Poly wrap 25kg</span><div class="stock-bar"><i style="width:91%;"></i></div><span class="mono" style="font-size:12px; color:var(--slate-500);">455/500</span></div>
      </div>
      <div class="flow-list">
        <div class="flow-item">
          <span class="idx">01</span>
          <div><h4>Inventory updates on receipt, not on guesswork</h4><p>Stock counts move the moment goods are received against a PO, so on-hand quantity reflects what actually arrived.</p></div>
        </div>
        <div class="flow-item">
          <span class="idx">02</span>
          <div><h4>Reorder points flag themselves</h4><p>Low-stock items surface on the dashboard before they become a stalled purchase request.</p></div>
        </div>
        <div class="flow-item">
          <span class="idx">03</span>
          <div><h4>Billing follows the same discipline you enforce on vendors</h4><p>Plan usage, invoices, and payment history for your own ProcureAI subscription sit in the same platform — no separate portal to check.</p></div>
        </div>
      </div>
    </div>
  </div>
</section>

<!-- ============ DASHBOARD & ANALYTICS ============ -->
<section class="light">
  <div class="wrap">
    <div class="section-head">
      <span class="eyebrow">Owner dashboard</span>
      <h2 style="margin-top:14px;">One view of spend, speed, and where things are stuck</h2>
      <p>See what's spent, what's pending, and which approvals are sitting too long — without exporting a spreadsheet to find out.</p>
    </div>
    <div class="diagram-card dark-card" style="padding:0; overflow:hidden;">
      <div class="mockup-main" style="padding:26px;">
        <div class="kpi-row">
          <div class="kpi"><div class="lbl">Total spend YTD</div><div class="val">₹4.86Cr</div><div class="delta">↓ 4% vs last year</div></div>
          <div class="kpi"><div class="lbl">Active vendors</div><div class="val">62</div><div class="delta">8 added this quarter</div></div>
          <div class="kpi"><div class="lbl">Open approvals</div><div class="val">11</div><div class="delta" style="color:var(--gold-300);">3 over SLA</div></div>
          <div class="kpi"><div class="lbl">Invoice match rate</div><div class="val">97.3%</div><div class="delta">auto-reconciled</div></div>
        </div>
        <div class="table-mock">
          <div class="row head"><span>Category</span><span>Vendor</span><span>Spend</span><span>Trend</span><span>Share</span></div>
          <div class="row"><span>Raw materials</span><span>Sarvodaya Steel</span><span class="mono">₹1.9Cr</span><span>↑ 8%</span><span class="mono">39%</span></div>
          <div class="row"><span>Packaging</span><span>Nova Packaging</span><span class="mono">₹78L</span><span>↓ 3%</span><span class="mono">16%</span></div>
          <div class="row"><span>MRO supplies</span><span>Kiran Traders</span><span class="mono">₹52L</span><span>→ flat</span><span class="mono">11%</span></div>
        </div>
      </div>
    </div>
  </div>
</section>

<!-- ============ BENEFITS ============ -->
<section class="light alt">
  <div class="wrap">
    <div class="section-head">
      <span class="eyebrow">Why teams switch</span>
      <h2 style="margin-top:14px;">Built around four things finance actually asks for</h2>
    </div>
    <div class="benefit-grid">
      <div class="benefit-card"><div class="bicon">✓</div><h4>Trust</h4><p>Every request, approval, and payment is timestamped and attributed — no more "who approved this?"</p></div>
      <div class="benefit-card"><div class="bicon">◧</div><h4>Control</h4><p>Approval chains, role-based access, and tenant isolation mean the right people see and approve the right things.</p></div>
      <div class="benefit-card"><div class="bicon">⚡</div><h4>Speed</h4><p>RFQs, quote comparison, and approval routing cut days out of a cycle that used to run on email threads.</p></div>
      <div class="benefit-card"><div class="bicon">◎</div><h4>Visibility</h4><p>One dashboard shows spend, vendor performance, and where a PO is stuck — for owners and approvers alike.</p></div>
      <div class="benefit-card"><div class="bicon">⇄</div><h4>Fewer errors</h4><p>3-way matching catches invoice discrepancies before payment, not after a vendor calls asking where the difference went.</p></div>
      <div class="benefit-card"><div class="bicon">▤</div><h4>One system</h4><p>Item master, vendors, POs, inventory, and billing live in one place instead of four disconnected tools.</p></div>
    </div>
  </div>
</section>

<!-- ============ SECURITY ============ -->
<section class="security" id="security">
  <div class="wrap">
    <div class="section-head">
      <span class="eyebrow">Security &amp; reliability</span>
      <h2 style="margin-top:14px;">Multi-tenant by design, not by convention</h2>
      <p>Each company's data, vendors, and approvals are isolated at the platform level — not just filtered in the interface.</p>
    </div>
    <div class="sec-grid">
      <div class="sec-card"><div class="sicon">TENANT ISOLATION</div><h4>Strict data boundaries</h4><p>Every query is scoped to the requesting company. One tenant's vendors, POs, and invoices are never visible to another.</p></div>
      <div class="sec-card"><div class="sicon">ROLE-BASED ACCESS</div><h4>Permissions by role</h4><p>Requesters, approvers, finance, and vendors each see only the actions their role allows — enforced on every endpoint.</p></div>
      <div class="sec-card"><div class="sicon">AUDIT TRAIL</div><h4>Nothing happens quietly</h4><p>Approvals, edits, and status changes are logged with who, what, and when — available to review at any time.</p></div>
      <div class="sec-card"><div class="sicon">RELIABLE INFRASTRUCTURE</div><h4>Built to stay up</h4><p>Background jobs, email delivery, and document processing run on monitored queues, so a slow vendor upload never blocks the rest of the platform.</p></div>
    </div>
  </div>
</section>

<!-- ============ FINAL CTA ============ -->
<section class="final-cta" id="cta">
  <div class="wrap">
    <span class="eyebrow" style="justify-content:center;">Get started</span>
    <h2 style="margin-top:14px;">Put your next purchase on the record.</h2>
    <p>Set up your company, item master, and first vendor in under an hour — no procurement overhaul required to start.</p>
    <div class="hero-ctas">
      <a href="#" class="btn btn-primary">Start free trial</a>
      <a href="#" class="btn btn-ghost">Talk to sales</a>
    </div>
  </div>
</section>

<footer>
  <div class="wrap">
    <div class="foot-top">
      <div class="logo"><span class="mark"></span>ProcureAI</div>
      <div class="foot-cols">
        <div class="foot-col">
          <h5>Product</h5>
          <a href="#buyer">Buyer workflow</a>
          <a href="#vendor">Vendor portal</a>
          <a href="#">Analytics</a>
          <a href="#">Inventory</a>
        </div>
        <div class="foot-col">
          <h5>Company</h5>
          <a href="#">About</a>
          <a href="#">Security</a>
          <a href="#">Contact</a>
        </div>
        <div class="foot-col">
          <h5>Resources</h5>
          <a href="#">Documentation</a>
          <a href="#">Status</a>
          <a href="#">Pricing</a>
        </div>
      </div>
    </div>
    <div class="foot-bottom">
      <span>© 2026 ProcureAI. All rights reserved.</span>
      <span>Made for procurement teams who'd rather not chase email threads.</span>
    </div>
  </div>
</footer>

</body>
</html>
