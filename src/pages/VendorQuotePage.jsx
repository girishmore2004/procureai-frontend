// import React, { useState, useMemo, useEffect } from 'react';
// import { useParams } from 'react-router-dom';
// import { useQuery, useMutation } from '@tanstack/react-query';
// import { publicApi } from '../api/services';
// import { Spinner, Field, Alert } from '../components/ui';
// import {
//   ShoppingCart, Upload, CheckCircle, RefreshCw, AlertTriangle, Edit3, FileText,
// } from 'lucide-react';
// import toast from 'react-hot-toast';

// const STEPS = ['Enter Quote', 'Review & Confirm', 'Submitted'];
// const AVAILABILITY_OPTIONS = ['In Stock', 'Partial Stock', 'Backorder', 'Not Available'];

// // Same lightweight normalize used server-side for PO/invoice item matching —
// // good enough to line up an OCR-extracted row with the requested item it's for.
// const normalize = (s) => (s || '').toLowerCase().replace(/[^a-z0-9]+/g, ' ').trim();

// export default function VendorQuotePage() {
//   const { token } = useParams();

//   const [step, setStep] = useState(0);
//   const [file, setFile] = useState(null);
//   const [validating, setValidating] = useState(false);
//   const [validateError, setValidateError] = useState('');
//   const [extractionConfidence, setExtractionConfidence] = useState(null);
//   const [extractionNote, setExtractionNote] = useState('');
//   const [unmatchedExtracted, setUnmatchedExtracted] = useState([]);

//   const [header, setHeader] = useState({ payment_terms: '', delivery_time_days: '', validity_date: '' });

//   // Rows are keyed by purchase_request_item_id and seeded once the RFQ loads
//   // (see useEffect below) — never freely added/removed/retyped. Item name and
//   // requested quantity always come from the buyer's item master; only these
//   // per-row fields are editable.
//   const [rows, setRows] = useState(null);

//   const { data, isLoading, error } = useQuery({
//     queryKey: ['public-rfq', token],
//     queryFn: () => publicApi.getRfq(token).then((r) => r.data.data),
//     retry: false,
//   });

//   const rfq = data?.rfq;
//   const vendor = data?.vendor;

//   // Seed the editable rows once the RFQ loads. This has to be a useEffect
//   // rather than useQuery's onSuccess — TanStack Query v5 removed onSuccess
//   // from useQuery entirely (it only remains on useMutation), so the previous
//   // onSuccess handler here was silently a no-op: `rows` stayed null forever,
//   // and since the component below gates on `!rows`, the page never got past
//   // the loading spinner even though the RFQ fetch itself succeeded fine.
//   useEffect(() => {
//     if (!data || rows) return; // don't clobber if already seeded/edited
//     const items = data?.rfq?.PurchaseRequest?.items || [];
//     setRows(items.map((it) => ({
//       purchase_request_item_id: it.id,
//       item_name: it.Item?.name || it.item_name_freetext || 'Unknown item',
//       unit: it.Item?.unit || '',
//       requested_quantity: it.quantity,
//       quantity: it.quantity != null ? String(it.quantity) : '',
//       unit_price: '',
//       availability: 'In Stock',
//       notes: '',
//       tax: '0',
//       freight: '0',
//       confidence_score: null,
//     })));
//     // eslint-disable-next-line react-hooks/exhaustive-deps
//   }, [data]);

//   const updateRow = (idx, field, val) => {
//     setRows((prev) => prev.map((r, i) => (i === idx ? { ...r, [field]: val } : r)));
//   };

//   const totalAmount = useMemo(
//     () => (rows || []).reduce((s, r) => s + (parseFloat(r.quantity) || 0) * (parseFloat(r.unit_price) || 0), 0),
//     [rows],
//   );

//   // ── Optional OCR assist: upload a file, extract it, then fill matching
//   // rows' price/quantity/notes instead of replacing the item-master-seeded
//   // table. Anything extracted that doesn't match a requested item is shown
//   // as an informational note rather than silently dropped or added as a
//   // free-text row (item names must stay item-master-only).
//   const handleFileChange = (e) => {
//     setFile(e.target.files[0] || null);
//     setValidateError('');
//     setExtractionNote('');
//     setExtractionConfidence(null);
//   };

//   const handleExtract = async () => {
//     if (!file) return;
//     setValidating(true);
//     setValidateError('');
//     try {
//       const res = await publicApi.validateQuote(token, file);
//       const result = res.data.data;

//       if (!result.success) {
//         setValidateError(result.error || 'Could not extract data from this file. Enter your prices manually below instead.');
//         setValidating(false);
//         return;
//       }

//       setHeader({
//         payment_terms: result.payment_terms || header.payment_terms,
//         delivery_time_days: result.delivery_time_days ? String(result.delivery_time_days) : header.delivery_time_days,
//         validity_date: result.validity_date || header.validity_date,
//       });

//       const extracted = result.items || [];
//       const unmatched = [];
//       setRows((prev) => prev.map((row) => {
//         const target = normalize(row.item_name);
//         const match = extracted.find((e) => {
//           const candidate = normalize(e.item_name_raw);
//           return candidate && (candidate === target || candidate.includes(target) || target.includes(candidate));
//         });
//         if (!match) return row;
//         return {
//           ...row,
//           quantity: match.quantity ? String(match.quantity) : row.quantity,
//           unit_price: match.unit_price ? String(match.unit_price) : row.unit_price,
//           tax: match.tax ? String(match.tax) : row.tax,
//           freight: match.freight ? String(match.freight) : row.freight,
//           confidence_score: match.confidence_score ?? null,
//         };
//       }));
//       extracted.forEach((e) => {
//         const candidate = normalize(e.item_name_raw);
//         const found = (rows || []).some((row) => {
//           const target = normalize(row.item_name);
//           return candidate && (candidate === target || candidate.includes(target) || target.includes(candidate));
//         });
//         if (!found) unmatched.push(e.item_name_raw);
//       });
//       setUnmatchedExtracted(unmatched);

//       setExtractionConfidence(result.confidence_overall);
//       if (result.mock) setExtractionNote('AI is not configured — please review and enter prices manually.');
//       else if (result.truncated) setExtractionNote('AI response was cut off — please double-check every row below.');
//       else if (result.notes) setExtractionNote(result.notes);

//       setStep(1);
//     } catch (err) {
//       setValidateError('Extraction service unavailable. Please enter your prices manually below.');
//     } finally {
//       setValidating(false);
//     }
//   };

//   const handleProceedManual = () => {
//     if (!rows?.some((r) => parseFloat(r.unit_price) > 0)) {
//       toast.error('Enter a price for at least one item before proceeding');
//       return;
//     }
//     setStep(1);
//   };

//   const submitMutation = useMutation({
//     mutationFn: () => {
//       const payload = {
//         ...header,
//         items: JSON.stringify(
//           (rows || [])
//             .filter((r) => parseFloat(r.unit_price) > 0 || parseFloat(r.quantity) > 0)
//             .map((r) => ({
//               purchase_request_item_id: r.purchase_request_item_id,
//               item_name_raw: r.item_name,
//               quantity: parseFloat(r.quantity) || 0,
//               unit_price: parseFloat(r.unit_price) || 0,
//               total_price: (parseFloat(r.quantity) || 0) * (parseFloat(r.unit_price) || 0),
//               tax: parseFloat(r.tax) || 0,
//               freight: parseFloat(r.freight) || 0,
//               availability: r.availability,
//               notes: r.notes,
//             })),
//         ),
//       };
//       return publicApi.submitQuote(token, null, payload);
//     },
//     onSuccess: () => setStep(2),
//     onError: (e) => toast.error(e.response?.data?.error?.message || 'Submission failed. Please try again.'),
//   });

//   if (isLoading) return <div className="flex items-center justify-center h-screen"><Spinner size="lg" /></div>;
//   if (error) return (
//     <div className="flex items-center justify-center h-screen bg-gray-50 px-4">
//       <div className="bg-white rounded-xl shadow p-8 max-w-md text-center">
//         <AlertTriangle className="w-12 h-12 text-red-400 mx-auto mb-3" />
//         <p className="text-red-600 font-semibold text-lg mb-1">Invalid or expired link</p>
//         <p className="text-sm text-gray-500">This quote link is invalid or has already been used. Contact your buyer for a new link.</p>
//       </div>
//     </div>
//   );
//   // data arrived successfully but the useEffect above hasn't seeded `rows`
//   // yet (runs one tick after render) — a brief, normal loading flash, not
//   // the earlier bug where this never resolved at all.
//   if (!rows) return <div className="flex items-center justify-center h-screen"><Spinner size="lg" /></div>;

//   if (step === 2) return (
//     <div className="flex items-center justify-center h-screen bg-gray-50 px-4">
//       <div className="bg-white rounded-xl shadow p-10 max-w-md text-center">
//         <CheckCircle className="w-16 h-16 text-green-500 mx-auto mb-4" />
//         <h2 className="text-2xl font-bold mb-2">Quote Submitted!</h2>
//         <p className="text-gray-500 mb-4">
//           Your quote for <strong>{rfq?.rfq_number}</strong> has been received by the buyer.
//           They will review it and contact you if selected.
//         </p>
//         <div className="bg-gray-50 rounded-lg p-4 text-sm text-left space-y-1">
//           <div className="flex justify-between"><span className="text-gray-500">Items quoted:</span><span className="font-medium">{rows.filter((r) => parseFloat(r.unit_price) > 0).length}</span></div>
//           <div className="flex justify-between"><span className="text-gray-500">Total quoted:</span><span className="font-semibold text-brand-600">₹{totalAmount.toLocaleString('en-IN')}</span></div>
//           <div className="flex justify-between"><span className="text-gray-500">Delivery:</span><span className="font-medium">{header.delivery_time_days ? `${header.delivery_time_days} days` : '—'}</span></div>
//           <div className="flex justify-between"><span className="text-gray-500">Payment terms:</span><span className="font-medium">{header.payment_terms || '—'}</span></div>
//         </div>
//         <p className="text-xs text-gray-400 mt-4">Powered by ProcureAI</p>
//       </div>
//     </div>
//   );

//   const ItemsTable = ({ editable }) => (
//     <div className="overflow-x-auto">
//       <table className="min-w-full border border-gray-200 rounded-xl overflow-hidden">
//         <thead className="bg-gray-50">
//           <tr>
//             <th className="table-th">Item (from buyer's request)</th>
//             <th className="table-th">Requested Qty</th>
//             <th className="table-th">Your Qty Available</th>
//             <th className="table-th">Unit Price (₹)</th>
//             <th className="table-th">Total (₹)</th>
//             <th className="table-th">Availability</th>
//             <th className="table-th">Remarks</th>
//           </tr>
//         </thead>
//         <tbody className="divide-y divide-gray-100 bg-white">
//           {rows.map((r, i) => (
//             <tr key={r.purchase_request_item_id} className={r.confidence_score != null && r.confidence_score < 0.7 ? 'bg-amber-50' : ''}>
//               <td className="px-2 py-2 text-sm font-medium text-gray-800">
//                 {r.item_name}{r.unit ? <span className="text-gray-400 font-normal"> ({r.unit})</span> : null}
//                 {r.confidence_score != null && r.confidence_score < 0.7 && (
//                   <p className="text-xs text-amber-600 mt-0.5">⚠️ Low-confidence match — double-check price/qty</p>
//                 )}
//               </td>
//               <td className="px-2 py-2 text-sm text-gray-500">{r.requested_quantity}</td>
//               <td className="px-2 py-2"><input className="input w-20 text-sm" type="number" value={r.quantity} onChange={(e) => updateRow(i, 'quantity', e.target.value)} /></td>
//               <td className="px-2 py-2"><input className="input w-24 text-sm" type="number" value={r.unit_price} onChange={(e) => updateRow(i, 'unit_price', e.target.value)} placeholder="0" /></td>
//               <td className="px-2 py-2 text-sm font-semibold text-gray-700">₹{((parseFloat(r.quantity) || 0) * (parseFloat(r.unit_price) || 0)).toLocaleString('en-IN')}</td>
//               <td className="px-2 py-2">
//                 <select className="input text-sm" value={r.availability} onChange={(e) => updateRow(i, 'availability', e.target.value)}>
//                   {AVAILABILITY_OPTIONS.map((o) => <option key={o} value={o}>{o}</option>)}
//                 </select>
//               </td>
//               <td className="px-2 py-2"><input className="input text-sm min-w-28" value={r.notes} onChange={(e) => updateRow(i, 'notes', e.target.value)} placeholder="optional" /></td>
//             </tr>
//           ))}
//         </tbody>
//         <tfoot className="bg-gray-50 border-t-2 border-gray-200">
//           <tr>
//             <td colSpan={4} className="px-4 py-2 text-right text-sm font-semibold text-gray-600">Grand Total</td>
//             <td className="px-2 py-2 font-bold text-brand-700 text-base">₹{totalAmount.toLocaleString('en-IN')}</td>
//             <td colSpan={2} />
//           </tr>
//         </tfoot>
//       </table>
//     </div>
//   );

//   return (
//     <div className="min-h-screen bg-gray-50 py-6 px-4">
//       <div className="max-w-4xl mx-auto">

//         <div className="flex items-center gap-3 mb-6">
//           <div className="w-10 h-10 bg-brand-600 rounded-xl flex items-center justify-center shrink-0">
//             <ShoppingCart className="w-5 h-5 text-white" />
//           </div>
//           <div className="flex-1">
//             <p className="font-bold text-gray-900">ProcureAI — Quote Request</p>
//             <p className="text-sm text-gray-500">{vendor?.name} · RFQ: {rfq?.rfq_number}</p>
//           </div>
//           <div className="hidden sm:flex items-center gap-2">
//             {STEPS.slice(0, 2).map((s, i) => (
//               <div key={s} className="flex items-center gap-1.5">
//                 <div className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold ${i < step ? 'bg-green-500 text-white' : i === step ? 'bg-brand-600 text-white' : 'bg-gray-200 text-gray-500'}`}>
//                   {i < step ? '✓' : i + 1}
//                 </div>
//                 <span className={`text-xs ${i === step ? 'text-brand-600 font-medium' : 'text-gray-400'}`}>{s}</span>
//                 {i < 1 && <div className="w-6 h-px bg-gray-300 mx-1" />}
//               </div>
//             ))}
//           </div>
//         </div>

//         <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4 mb-4">
//           <div className="flex flex-wrap gap-4 text-sm">
//             <div><span className="text-gray-400">Deadline:</span> <strong>{rfq?.deadline ? new Date(rfq.deadline).toLocaleDateString('en-IN') : '—'}</strong></div>
//             <div><span className="text-gray-400">Deliver to:</span> <strong>{rfq?.delivery_location || '—'}</strong></div>
//             {rfq?.terms && <div><span className="text-gray-400">Terms:</span> {rfq.terms}</div>}
//           </div>
//         </div>

//         {rows.length === 0 && (
//           <Alert type="warning" message="This RFQ's purchase request has no item lines to quote against. Contact the buyer." />
//         )}

//         {step === 0 && rows.length > 0 && (
//           <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-5 space-y-5">
//             <div>
//               <h2 className="font-semibold text-gray-800 mb-1 flex items-center gap-2"><FileText className="w-4 h-4 text-brand-600" /> Items Requested</h2>
//               <p className="text-sm text-gray-500 mb-3">
//                 These are the exact items the buyer asked for — you only need to fill in your price, available quantity, availability, and any remarks. No need to retype item names.
//               </p>
//             </div>

//             <div className="grid grid-cols-3 gap-3">
//               <Field label="Payment Terms">
//                 <input className="input" placeholder="e.g. Net 30, Advance" value={header.payment_terms} onChange={(e) => setHeader({ ...header, payment_terms: e.target.value })} />
//               </Field>
//               <Field label="Delivery Days">
//                 <input className="input" type="number" placeholder="e.g. 7" value={header.delivery_time_days} onChange={(e) => setHeader({ ...header, delivery_time_days: e.target.value })} />
//               </Field>
//               <Field label="Valid Until">
//                 <input className="input" type="date" value={header.validity_date} onChange={(e) => setHeader({ ...header, validity_date: e.target.value })} />
//               </Field>
//             </div>

//             <ItemsTable editable />

//             {/* Optional OCR assist — never required, never replaces the table above */}
//             <div className="border border-dashed border-gray-300 rounded-xl p-4">
//               <p className="text-sm font-medium text-gray-700 mb-1 flex items-center gap-1.5"><Upload className="w-4 h-4 text-gray-400" /> Optional: upload your quotation file to auto-fill prices</p>
//               <p className="text-xs text-gray-400 mb-3">PDF, Excel, or a photo of a printed/handwritten quote. If we can match a line to an item above, we'll fill in its price/qty for you — everything else stays exactly as shown above either way.</p>
//               <div className="flex items-center gap-3">
//                 <input type="file" className="text-sm" accept=".pdf,.xlsx,.xls,.jpg,.jpeg,.png,.tiff,.csv" onChange={handleFileChange} />
//                 <button className="btn-secondary flex items-center gap-2 shrink-0" disabled={!file || validating} onClick={handleExtract}>
//                   {validating ? <><RefreshCw className="w-4 h-4 animate-spin" /> Extracting…</> : <><RefreshCw className="w-4 h-4" /> Extract & Fill</>}
//                 </button>
//               </div>
//               {validateError && <p className="text-red-600 text-xs mt-2">{validateError}</p>}
//             </div>

//             <button className="btn-primary w-full" onClick={handleProceedManual} disabled={!rows.some((r) => parseFloat(r.unit_price) > 0)}>
//               Review & Confirm →
//             </button>
//           </div>
//         )}

//         {step === 1 && (
//           <div className="space-y-4">
//             {extractionConfidence !== null && (
//               <div className={`rounded-xl border p-4 ${extractionConfidence >= 0.75 ? 'bg-green-50 border-green-200' : 'bg-amber-50 border-amber-200'}`}>
//                 <div className="flex items-center gap-2 mb-1">
//                   {extractionConfidence >= 0.75 ? <CheckCircle className="w-4 h-4 text-green-600 shrink-0" /> : <AlertTriangle className="w-4 h-4 text-amber-600 shrink-0" />}
//                   <p className={`text-sm font-semibold ${extractionConfidence >= 0.75 ? 'text-green-700' : 'text-amber-700'}`}>
//                     AI Extraction: {(extractionConfidence * 100).toFixed(0)}% confidence{extractionConfidence >= 0.75 ? ' — Looks good!' : ' — Please review carefully'}
//                   </p>
//                 </div>
//                 {extractionNote && <p className="text-xs text-amber-700 mt-1 ml-6">⚠️ {extractionNote}</p>}
//                 {unmatchedExtracted.length > 0 && (
//                   <p className="text-xs text-amber-700 mt-1 ml-6">
//                     ⚠️ {unmatchedExtracted.length} line{unmatchedExtracted.length > 1 ? 's' : ''} in your file didn't match a requested item and were not included: {unmatchedExtracted.join(', ')}. Contact the buyer if these should have been requested.
//                   </p>
//                 )}
//               </div>
//             )}

//             <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-5">
//               <div className="flex items-center justify-between mb-4">
//                 <h2 className="font-semibold text-gray-800 flex items-center gap-2"><Edit3 className="w-4 h-4 text-brand-600" /> Review Your Quote</h2>
//                 <button className="text-xs text-brand-600 hover:underline" onClick={() => setStep(0)}>← Edit</button>
//               </div>

//               <div className="grid grid-cols-3 gap-3 mb-5 text-sm">
//                 <div><span className="text-gray-400">Payment Terms:</span> <strong>{header.payment_terms || '—'}</strong></div>
//                 <div><span className="text-gray-400">Delivery:</span> <strong>{header.delivery_time_days ? `${header.delivery_time_days} days` : '—'}</strong></div>
//                 <div><span className="text-gray-400">Valid Until:</span> <strong>{header.validity_date || '—'}</strong></div>
//               </div>

//               <ItemsTable editable={false} />

//               <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 text-xs text-blue-700 my-4">
//                 ✅ By clicking Submit, you confirm that all prices, quantities, and terms above are correct and constitute your official quotation.
//               </div>

//               <div className="flex gap-3">
//                 <button className="btn-secondary" onClick={() => setStep(0)}>← Back</button>
//                 <button
//                   className="btn-primary flex-1 flex items-center justify-center gap-2"
//                   disabled={!rows.some((r) => parseFloat(r.unit_price) > 0) || submitMutation.isPending}
//                   onClick={() => submitMutation.mutate()}
//                 >
//                   <CheckCircle className="w-4 h-4" />
//                   {submitMutation.isPending ? 'Submitting…' : 'Confirm & Submit Quote'}
//                 </button>
//               </div>
//             </div>
//           </div>
//         )}

//         <p className="text-center text-xs text-gray-400 mt-6">Powered by ProcureAI · This link is unique to your company and should not be shared</p>
//       </div>
//     </div>
//   );
// }






import React, { useState, useMemo, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { useQuery, useMutation } from '@tanstack/react-query';
import { publicApi } from '../api/services';
import { Spinner, Field, Alert } from '../components/ui';
import {
  ShoppingCart, Upload, CheckCircle, RefreshCw, AlertTriangle, Edit3, FileText,
} from 'lucide-react';
import toast from 'react-hot-toast';

const STEPS = ['Enter Quote', 'Review & Confirm', 'Submitted'];
const AVAILABILITY_OPTIONS = ['In Stock', 'Partial Stock', 'Backorder', 'Not Available'];

// Same lightweight normalize used server-side for PO/invoice item matching —
// good enough to line up an OCR-extracted row with the requested item it's for.
const normalize = (s) => (s || '').toLowerCase().replace(/[^a-z0-9]+/g, ' ').trim();

// Small edit-distance helper (Levenshtein), used only for short, single-word fuzzy
// comparisons in fuzzyItemNameMatch below — cheap since inputs are individual words.
const levenshtein = (a, b) => {
  const m = a.length, n = b.length;
  if (!m) return n;
  if (!n) return m;
  const dp = Array.from({ length: m + 1 }, () => new Array(n + 1).fill(0));
  for (let i = 0; i <= m; i++) dp[i][0] = i;
  for (let j = 0; j <= n; j++) dp[0][j] = j;
  for (let i = 1; i <= m; i++) {
    for (let j = 1; j <= n; j++) {
      dp[i][j] = a[i - 1] === b[j - 1]
        ? dp[i - 1][j - 1]
        : 1 + Math.min(dp[i - 1][j - 1], dp[i - 1][j], dp[i][j - 1]);
    }
  }
  return dp[m][n];
};

// Fallback fuzzy match between two already-normalized item-name strings, used ONLY
// after exact match and plain substring containment have both already failed — so it
// never changes behavior for names that already matched correctly, it only recovers
// cases that previously fell through to "unmatched". Tolerates the specific kinds of
// noise that OCR/handwriting-vision extraction produces:
//   - plural vs singular: "Bearings" vs "Bearing"
//   - missing/extra spacing: "SKF 6205" vs "SKF6205"
//   - extra descriptive words either side: "Industrial Bearings" vs "Bearing"
//   - small single-letter misreads: "yelow" vs "yellow"
const fuzzyItemNameMatch = (target, candidate) => {
  const stem = (w) => (w.length > 3 && w.endsWith('s') ? w.slice(0, -1) : w);
  const targetWords = target.split(' ').filter(Boolean).map(stem);
  const candidateWords = candidate.split(' ').filter(Boolean).map(stem);
  if (!targetWords.length || !candidateWords.length) return false;

  // Condensed-form containment: once plurals are stemmed off and words are joined with
  // no spaces, catches spacing differences and extra surrounding words in one check.
  const condensedTarget = targetWords.join('');
  const condensedCandidate = candidateWords.join('');
  if (condensedTarget.length >= 5 && (condensedCandidate.includes(condensedTarget) || condensedTarget.includes(condensedCandidate))) {
    return true;
  }

  // Per-word overlap, tolerating a 1-character misread on words of 4+ letters
  // (numbers/codes and very short words are left exact-only to avoid false positives).
  let matchedWords = 0;
  for (const tw of targetWords) {
    const hit = candidateWords.some((cw) => tw === cw || (tw.length >= 4 && cw.length >= 4 && levenshtein(tw, cw) <= 1));
    if (hit) matchedWords++;
  }
  return matchedWords / targetWords.length >= 0.6;
};

// Single matching function used everywhere below: exact match, then substring
// containment (both directions), then the fuzzy fallback above. Keeping this in
// one place means the "fill rows" pass and the "flag unmatched lines" pass can
// never disagree with each other about whether two names match.
const itemNamesMatch = (target, candidate) => {
  if (!candidate) return false;
  if (candidate === target) return true;
  if (candidate.includes(target) || target.includes(candidate)) return true;
  return fuzzyItemNameMatch(target, candidate);
};

export default function VendorQuotePage() {
  const { token } = useParams();

  const [step, setStep] = useState(0);
  const [file, setFile] = useState(null);
  const [validating, setValidating] = useState(false);
  const [validateError, setValidateError] = useState('');
  const [extractionConfidence, setExtractionConfidence] = useState(null);
  const [extractionNote, setExtractionNote] = useState('');
  const [unmatchedExtracted, setUnmatchedExtracted] = useState([]);

  const [header, setHeader] = useState({ payment_terms: '', delivery_time_days: '', validity_date: '' });

  // Rows are keyed by purchase_request_item_id and seeded once the RFQ loads
  // (see useEffect below) — never freely added/removed/retyped. Item name and
  // requested quantity always come from the buyer's item master; only these
  // per-row fields are editable.
  const [rows, setRows] = useState(null);

  const { data, isLoading, error } = useQuery({
    queryKey: ['public-rfq', token],
    queryFn: () => publicApi.getRfq(token).then((r) => r.data.data),
    retry: false,
  });

  const rfq = data?.rfq;
  const vendor = data?.vendor;

  // Seed the editable rows once the RFQ loads. This has to be a useEffect
  // rather than useQuery's onSuccess — TanStack Query v5 removed onSuccess
  // from useQuery entirely (it only remains on useMutation), so the previous
  // onSuccess handler here was silently a no-op: `rows` stayed null forever,
  // and since the component below gates on `!rows`, the page never got past
  // the loading spinner even though the RFQ fetch itself succeeded fine.
  useEffect(() => {
    if (!data || rows) return; // don't clobber if already seeded/edited
    const items = data?.rfq?.PurchaseRequest?.items || [];
    setRows(items.map((it) => ({
      purchase_request_item_id: it.id,
      item_name: it.Item?.name || it.item_name_freetext || 'Unknown item',
      unit: it.Item?.unit || '',
      requested_quantity: it.quantity,
      quantity: it.quantity != null ? String(it.quantity) : '',
      unit_price: '',
      availability: 'In Stock',
      notes: '',
      tax: '0',
      freight: '0',
      confidence_score: null,
    })));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [data]);

  const updateRow = (idx, field, val) => {
    setRows((prev) => prev.map((r, i) => (i === idx ? { ...r, [field]: val } : r)));
  };

  const totalAmount = useMemo(
    () => (rows || []).reduce((s, r) => s + (parseFloat(r.quantity) || 0) * (parseFloat(r.unit_price) || 0), 0),
    [rows],
  );

  // ── Optional OCR assist: upload a file, extract it, then fill matching
  // rows' price/quantity/notes instead of replacing the item-master-seeded
  // table. Anything extracted that doesn't match a requested item is shown
  // as an informational note rather than silently dropped or added as a
  // free-text row (item names must stay item-master-only).
  const handleFileChange = (e) => {
    setFile(e.target.files[0] || null);
    setValidateError('');
    setExtractionNote('');
    setExtractionConfidence(null);
  };

  const handleExtract = async () => {
    if (!file) return;
    setValidating(true);
    setValidateError('');
    try {
      const res = await publicApi.validateQuote(token, file);
      const result = res.data.data;

      if (!result.success) {
        setValidateError(result.error || 'Could not extract data from this file. Enter your prices manually below instead.');
        setValidating(false);
        return;
      }

      setHeader({
        payment_terms: result.payment_terms || header.payment_terms,
        delivery_time_days: result.delivery_time_days ? String(result.delivery_time_days) : header.delivery_time_days,
        validity_date: result.validity_date || header.validity_date,
      });

      const extracted = result.items || [];
      const unmatched = [];
      setRows((prev) => prev.map((row) => {
        const target = normalize(row.item_name);
        const match = extracted.find((e) => itemNamesMatch(target, normalize(e.item_name_raw)));
        if (!match) return row;
        return {
          ...row,
          quantity: match.quantity ? String(match.quantity) : row.quantity,
          unit_price: match.unit_price ? String(match.unit_price) : row.unit_price,
          tax: match.tax ? String(match.tax) : row.tax,
          freight: match.freight ? String(match.freight) : row.freight,
          confidence_score: match.confidence_score ?? null,
        };
      }));
      extracted.forEach((e) => {
        const candidate = normalize(e.item_name_raw);
        const found = (rows || []).some((row) => itemNamesMatch(normalize(row.item_name), candidate));
        if (!found) unmatched.push(e.item_name_raw);
      });
      setUnmatchedExtracted(unmatched);

      setExtractionConfidence(result.confidence_overall);
      if (result.mock) setExtractionNote('AI is not configured — please review and enter prices manually.');
      else if (result.truncated) setExtractionNote('AI response was cut off — please double-check every row below.');
      else if (result.notes) setExtractionNote(result.notes);

      setStep(1);
    } catch (err) {
      setValidateError('Extraction service unavailable. Please enter your prices manually below.');
    } finally {
      setValidating(false);
    }
  };

  const handleProceedManual = () => {
    if (!rows?.some((r) => parseFloat(r.unit_price) > 0)) {
      toast.error('Enter a price for at least one item before proceeding');
      return;
    }
    setStep(1);
  };

  const submitMutation = useMutation({
    mutationFn: () => {
      const payload = {
        ...header,
        items: JSON.stringify(
          (rows || [])
            .filter((r) => parseFloat(r.unit_price) > 0 || parseFloat(r.quantity) > 0)
            .map((r) => ({
              purchase_request_item_id: r.purchase_request_item_id,
              item_name_raw: r.item_name,
              quantity: parseFloat(r.quantity) || 0,
              unit_price: parseFloat(r.unit_price) || 0,
              total_price: (parseFloat(r.quantity) || 0) * (parseFloat(r.unit_price) || 0),
              tax: parseFloat(r.tax) || 0,
              freight: parseFloat(r.freight) || 0,
              availability: r.availability,
              notes: r.notes,
            })),
        ),
      };
      return publicApi.submitQuote(token, null, payload);
    },
    onSuccess: () => setStep(2),
    onError: (e) => toast.error(e.response?.data?.error?.message || 'Submission failed. Please try again.'),
  });

  if (isLoading) return <div className="flex items-center justify-center h-screen"><Spinner size="lg" /></div>;
  if (error) return (
    <div className="flex items-center justify-center h-screen bg-gray-50 px-4">
      <div className="bg-white rounded-xl shadow p-8 max-w-md text-center">
        <AlertTriangle className="w-12 h-12 text-red-400 mx-auto mb-3" />
        <p className="text-red-600 font-semibold text-lg mb-1">Invalid or expired link</p>
        <p className="text-sm text-gray-500">This quote link is invalid or has already been used. Contact your buyer for a new link.</p>
      </div>
    </div>
  );
  // data arrived successfully but the useEffect above hasn't seeded `rows`
  // yet (runs one tick after render) — a brief, normal loading flash, not
  // the earlier bug where this never resolved at all.
  if (!rows) return <div className="flex items-center justify-center h-screen"><Spinner size="lg" /></div>;

  if (step === 2) return (
    <div className="flex items-center justify-center h-screen bg-gray-50 px-4">
      <div className="bg-white rounded-xl shadow p-10 max-w-md text-center">
        <CheckCircle className="w-16 h-16 text-green-500 mx-auto mb-4" />
        <h2 className="text-2xl font-bold mb-2">Quote Submitted!</h2>
        <p className="text-gray-500 mb-4">
          Your quote for <strong>{rfq?.rfq_number}</strong> has been received by the buyer.
          They will review it and contact you if selected.
        </p>
        <div className="bg-gray-50 rounded-lg p-4 text-sm text-left space-y-1">
          <div className="flex justify-between"><span className="text-gray-500">Items quoted:</span><span className="font-medium">{rows.filter((r) => parseFloat(r.unit_price) > 0).length}</span></div>
          <div className="flex justify-between"><span className="text-gray-500">Total quoted:</span><span className="font-semibold text-brand-600">₹{totalAmount.toLocaleString('en-IN')}</span></div>
          <div className="flex justify-between"><span className="text-gray-500">Delivery:</span><span className="font-medium">{header.delivery_time_days ? `${header.delivery_time_days} days` : '—'}</span></div>
          <div className="flex justify-between"><span className="text-gray-500">Payment terms:</span><span className="font-medium">{header.payment_terms || '—'}</span></div>
        </div>
        <p className="text-xs text-gray-400 mt-4">Powered by ProcureAI</p>
      </div>
    </div>
  );

  const ItemsTable = ({ editable }) => (
    <div className="overflow-x-auto">
      <table className="min-w-full border border-gray-200 rounded-xl overflow-hidden">
        <thead className="bg-gray-50">
          <tr>
            <th className="table-th">Item (from buyer's request)</th>
            <th className="table-th">Requested Qty</th>
            <th className="table-th">Your Qty Available</th>
            <th className="table-th">Unit Price (₹)</th>
            <th className="table-th">Total (₹)</th>
            <th className="table-th">Availability</th>
            <th className="table-th">Remarks</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-100 bg-white">
          {rows.map((r, i) => (
            <tr key={r.purchase_request_item_id} className={r.confidence_score != null && r.confidence_score < 0.7 ? 'bg-amber-50' : ''}>
              <td className="px-2 py-2 text-sm font-medium text-gray-800">
                {r.item_name}{r.unit ? <span className="text-gray-400 font-normal"> ({r.unit})</span> : null}
                {r.confidence_score != null && r.confidence_score < 0.7 && (
                  <p className="text-xs text-amber-600 mt-0.5">⚠️ Low-confidence match — double-check price/qty</p>
                )}
              </td>
              <td className="px-2 py-2 text-sm text-gray-500">{r.requested_quantity}</td>
              <td className="px-2 py-2"><input className="input w-20 text-sm" type="number" value={r.quantity} onChange={(e) => updateRow(i, 'quantity', e.target.value)} /></td>
              <td className="px-2 py-2"><input className="input w-24 text-sm" type="number" value={r.unit_price} onChange={(e) => updateRow(i, 'unit_price', e.target.value)} placeholder="0" /></td>
              <td className="px-2 py-2 text-sm font-semibold text-gray-700">₹{((parseFloat(r.quantity) || 0) * (parseFloat(r.unit_price) || 0)).toLocaleString('en-IN')}</td>
              <td className="px-2 py-2">
                <select className="input text-sm" value={r.availability} onChange={(e) => updateRow(i, 'availability', e.target.value)}>
                  {AVAILABILITY_OPTIONS.map((o) => <option key={o} value={o}>{o}</option>)}
                </select>
              </td>
              <td className="px-2 py-2"><input className="input text-sm min-w-28" value={r.notes} onChange={(e) => updateRow(i, 'notes', e.target.value)} placeholder="optional" /></td>
            </tr>
          ))}
        </tbody>
        <tfoot className="bg-gray-50 border-t-2 border-gray-200">
          <tr>
            <td colSpan={4} className="px-4 py-2 text-right text-sm font-semibold text-gray-600">Grand Total</td>
            <td className="px-2 py-2 font-bold text-brand-700 text-base">₹{totalAmount.toLocaleString('en-IN')}</td>
            <td colSpan={2} />
          </tr>
        </tfoot>
      </table>
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-50 py-6 px-4">
      <div className="max-w-4xl mx-auto">

        <div className="flex items-center gap-3 mb-6">
          <div className="w-10 h-10 bg-brand-600 rounded-xl flex items-center justify-center shrink-0">
            <ShoppingCart className="w-5 h-5 text-white" />
          </div>
          <div className="flex-1">
            <p className="font-bold text-gray-900">ProcureAI — Quote Request</p>
            <p className="text-sm text-gray-500">{vendor?.name} · RFQ: {rfq?.rfq_number}</p>
          </div>
          <div className="hidden sm:flex items-center gap-2">
            {STEPS.slice(0, 2).map((s, i) => (
              <div key={s} className="flex items-center gap-1.5">
                <div className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold ${i < step ? 'bg-green-500 text-white' : i === step ? 'bg-brand-600 text-white' : 'bg-gray-200 text-gray-500'}`}>
                  {i < step ? '✓' : i + 1}
                </div>
                <span className={`text-xs ${i === step ? 'text-brand-600 font-medium' : 'text-gray-400'}`}>{s}</span>
                {i < 1 && <div className="w-6 h-px bg-gray-300 mx-1" />}
              </div>
            ))}
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4 mb-4">
          <div className="flex flex-wrap gap-4 text-sm">
            <div><span className="text-gray-400">Deadline:</span> <strong>{rfq?.deadline ? new Date(rfq.deadline).toLocaleDateString('en-IN') : '—'}</strong></div>
            <div><span className="text-gray-400">Deliver to:</span> <strong>{rfq?.delivery_location || '—'}</strong></div>
            {rfq?.terms && <div><span className="text-gray-400">Terms:</span> {rfq.terms}</div>}
          </div>
        </div>

        {rows.length === 0 && (
          <Alert type="warning" message="This RFQ's purchase request has no item lines to quote against. Contact the buyer." />
        )}

        {step === 0 && rows.length > 0 && (
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-5 space-y-5">
            <div>
              <h2 className="font-semibold text-gray-800 mb-1 flex items-center gap-2"><FileText className="w-4 h-4 text-brand-600" /> Items Requested</h2>
              <p className="text-sm text-gray-500 mb-3">
                These are the exact items the buyer asked for — you only need to fill in your price, available quantity, availability, and any remarks. No need to retype item names.
              </p>
            </div>

            <div className="grid grid-cols-3 gap-3">
              <Field label="Payment Terms">
                <input className="input" placeholder="e.g. Net 30, Advance" value={header.payment_terms} onChange={(e) => setHeader({ ...header, payment_terms: e.target.value })} />
              </Field>
              <Field label="Delivery Days">
                <input className="input" type="number" placeholder="e.g. 7" value={header.delivery_time_days} onChange={(e) => setHeader({ ...header, delivery_time_days: e.target.value })} />
              </Field>
              <Field label="Valid Until">
                <input className="input" type="date" value={header.validity_date} onChange={(e) => setHeader({ ...header, validity_date: e.target.value })} />
              </Field>
            </div>

            <ItemsTable editable />

            {/* Optional OCR assist — never required, never replaces the table above */}
            <div className="border border-dashed border-gray-300 rounded-xl p-4">
              <p className="text-sm font-medium text-gray-700 mb-1 flex items-center gap-1.5"><Upload className="w-4 h-4 text-gray-400" /> Optional: upload your quotation file to auto-fill prices</p>
              <p className="text-xs text-gray-400 mb-3">PDF, Excel, or a photo of a printed/handwritten quote. If we can match a line to an item above, we'll fill in its price/qty for you — everything else stays exactly as shown above either way.</p>
              <div className="flex items-center gap-3">
                <input type="file" className="text-sm" accept=".pdf,.xlsx,.xls,.jpg,.jpeg,.png,.tiff,.csv" onChange={handleFileChange} />
                <button className="btn-secondary flex items-center gap-2 shrink-0" disabled={!file || validating} onClick={handleExtract}>
                  {validating ? <><RefreshCw className="w-4 h-4 animate-spin" /> Extracting…</> : <><RefreshCw className="w-4 h-4" /> Extract & Fill</>}
                </button>
              </div>
              {validateError && <p className="text-red-600 text-xs mt-2">{validateError}</p>}
            </div>

            <button className="btn-primary w-full" onClick={handleProceedManual} disabled={!rows.some((r) => parseFloat(r.unit_price) > 0)}>
              Review & Confirm →
            </button>
          </div>
        )}

        {step === 1 && (
          <div className="space-y-4">
            {extractionConfidence !== null && (
              <div className={`rounded-xl border p-4 ${extractionConfidence >= 0.75 ? 'bg-green-50 border-green-200' : 'bg-amber-50 border-amber-200'}`}>
                <div className="flex items-center gap-2 mb-1">
                  {extractionConfidence >= 0.75 ? <CheckCircle className="w-4 h-4 text-green-600 shrink-0" /> : <AlertTriangle className="w-4 h-4 text-amber-600 shrink-0" />}
                  <p className={`text-sm font-semibold ${extractionConfidence >= 0.75 ? 'text-green-700' : 'text-amber-700'}`}>
                    AI Extraction: {(extractionConfidence * 100).toFixed(0)}% confidence{extractionConfidence >= 0.75 ? ' — Looks good!' : ' — Please review carefully'}
                  </p>
                </div>
                {extractionNote && <p className="text-xs text-amber-700 mt-1 ml-6">⚠️ {extractionNote}</p>}
                {unmatchedExtracted.length > 0 && (
                  <p className="text-xs text-amber-700 mt-1 ml-6">
                    ⚠️ {unmatchedExtracted.length} line{unmatchedExtracted.length > 1 ? 's' : ''} in your file didn't match a requested item and were not included: {unmatchedExtracted.join(', ')}. Contact the buyer if these should have been requested.
                  </p>
                )}
              </div>
            )}

            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-5">
              <div className="flex items-center justify-between mb-4">
                <h2 className="font-semibold text-gray-800 flex items-center gap-2"><Edit3 className="w-4 h-4 text-brand-600" /> Review Your Quote</h2>
                <button className="text-xs text-brand-600 hover:underline" onClick={() => setStep(0)}>← Edit</button>
              </div>

              <div className="grid grid-cols-3 gap-3 mb-5 text-sm">
                <div><span className="text-gray-400">Payment Terms:</span> <strong>{header.payment_terms || '—'}</strong></div>
                <div><span className="text-gray-400">Delivery:</span> <strong>{header.delivery_time_days ? `${header.delivery_time_days} days` : '—'}</strong></div>
                <div><span className="text-gray-400">Valid Until:</span> <strong>{header.validity_date || '—'}</strong></div>
              </div>

              <ItemsTable editable={false} />

              <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 text-xs text-blue-700 my-4">
                ✅ By clicking Submit, you confirm that all prices, quantities, and terms above are correct and constitute your official quotation.
              </div>

              <div className="flex gap-3">
                <button className="btn-secondary" onClick={() => setStep(0)}>← Back</button>
                <button
                  className="btn-primary flex-1 flex items-center justify-center gap-2"
                  disabled={!rows.some((r) => parseFloat(r.unit_price) > 0) || submitMutation.isPending}
                  onClick={() => submitMutation.mutate()}
                >
                  <CheckCircle className="w-4 h-4" />
                  {submitMutation.isPending ? 'Submitting…' : 'Confirm & Submit Quote'}
                </button>
              </div>
            </div>
          </div>
        )}

        <p className="text-center text-xs text-gray-400 mt-6">Powered by ProcureAI · This link is unique to your company and should not be shared</p>
      </div>
    </div>
  );
}
