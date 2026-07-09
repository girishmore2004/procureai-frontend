// import React, { useState } from 'react';
// import { useParams } from 'react-router-dom';
// import { useQuery, useMutation } from '@tanstack/react-query';
// import { publicApi } from '../api/services';
// import { Spinner, Field, Alert } from '../components/ui';
// import {
//   ShoppingCart, Upload, CheckCircle, Plus, Trash2,
//   RefreshCw, AlertTriangle, Edit3, FileText, PenLine,
// } from 'lucide-react';
// import toast from 'react-hot-toast';

// // ── Step labels ────────────────────────────────────────────────────────────
// const STEPS = ['Upload / Enter', 'Review & Confirm', 'Submitted'];

// export default function VendorQuotePage() {
//   const { token } = useParams();

//   // UI state
//   const [step, setStep] = useState(0);       // 0=upload, 1=review, 2=done
//   const [inputMode, setInputMode] = useState('upload'); // 'upload' | 'manual'
//   const [file, setFile] = useState(null);
//   const [validating, setValidating] = useState(false);
//   const [validateError, setValidateError] = useState('');

//   // Quote header fields (editable even when extracted from file)
//   const [header, setHeader] = useState({ payment_terms: '', delivery_time_days: '', validity_date: '' });

//   // Line items — pre-filled from extraction or entered manually
//   const [items, setItems] = useState([{ item_name_raw: '', quantity: '', unit_price: '', total_price: '', tax: '0', freight: '0' }]);
//   const [extractionConfidence, setExtractionConfidence] = useState(null);
//   const [extractionNote, setExtractionNote] = useState('');

//   // Load RFQ details
//   const { data, isLoading, error } = useQuery({
//     queryKey: ['public-rfq', token],
//     queryFn: () => publicApi.getRfq(token).then((r) => r.data.data),
//     retry: false,
//   });

//   // Submit final confirmed quote
//   const submitMutation = useMutation({
//     mutationFn: () => {
//       const payload = {
//         ...header,
//         items: JSON.stringify(items.filter((i) => i.item_name_raw).map((i) => ({
//           item_name_raw: i.item_name_raw,
//           quantity: parseFloat(i.quantity) || 0,
//           unit_price: parseFloat(i.unit_price) || 0,
//           total_price: parseFloat(i.total_price) || (parseFloat(i.quantity || 0) * parseFloat(i.unit_price || 0)),
//           tax: parseFloat(i.tax) || 0,
//           freight: parseFloat(i.freight) || 0,
//         }))),
//       };
//       // Always submit as manual/JSON — file was already validated; we submit confirmed items
//       return publicApi.submitQuote(token, null, payload);
//     },
//     onSuccess: () => setStep(2),
//     onError: (e) => toast.error(e.response?.data?.error?.message || 'Submission failed. Please try again.'),
//   });

//   // ── Handlers ────────────────────────────────────────────────────────────

//   const handleFileChange = (e) => {
//     setFile(e.target.files[0] || null);
//     setValidateError('');
//     setExtractionNote('');
//     setExtractionConfidence(null);
//   };

//   const handleValidate = async () => {
//     if (!file) return;
//     setValidating(true);
//     setValidateError('');
//     try {
//       const res = await publicApi.validateQuote(token, file);
//       const result = res.data.data;

//       if (!result.success) {
//         // Extraction failed — show error and auto-switch to manual
//         setValidateError(result.error || 'Could not extract data from this file.');
//         setInputMode('manual');
//         setValidating(false);
//         return;
//       }

//       // Populate form from extraction
//       setHeader({
//         payment_terms: result.payment_terms || '',
//         delivery_time_days: result.delivery_time_days ? String(result.delivery_time_days) : '',
//         validity_date: result.validity_date || '',
//       });

//       if (result.items?.length) {
//         setItems(result.items.map((i) => ({
//           item_name_raw: i.item_name_raw || '',
//           quantity: i.quantity ? String(i.quantity) : '',
//           unit_price: i.unit_price ? String(i.unit_price) : '',
//           total_price: i.total_price ? String(i.total_price) : '',
//           tax: i.tax ? String(i.tax) : '0',
//           freight: i.freight ? String(i.freight) : '0',
//           confidence_score: i.confidence_score,
//         })));
//       } else {
//         // Extraction succeeded but no items found — prompt manual entry
//         setValidateError('AI could not identify any line items in this file. Please enter them manually below.');
//         setInputMode('manual');
//       }

//       setExtractionConfidence(result.confidence_overall);
//       if (result.mock) setExtractionNote('AI is not configured — values pre-filled from template. Please review and correct all fields.');
//       else if (result.truncated) setExtractionNote('AI response was cut off — some items may be missing. Please add any missing rows.');
//       else if (result.notes) setExtractionNote(result.notes);

//       // Move to review step
//       setStep(1);
//     } catch (err) {
//       setValidateError('Extraction service unavailable. Please enter your quote manually.');
//       setInputMode('manual');
//     } finally {
//       setValidating(false);
//     }
//   };

//   const handleGoManual = () => {
//     setInputMode('manual');
//     setValidateError('');
//     setFile(null);
//   };

//   const handleProceedManual = () => {
//     if (!items.some((i) => i.item_name_raw)) {
//       toast.error('Add at least one item before proceeding');
//       return;
//     }
//     setStep(1);
//   };

//   const updateItem = (idx, field, val) => {
//     setItems(items.map((it, i) => {
//       if (i !== idx) return it;
//       const updated = { ...it, [field]: val };
//       if (field === 'quantity' || field === 'unit_price') {
//         const q = parseFloat(field === 'quantity' ? val : it.quantity) || 0;
//         const p = parseFloat(field === 'unit_price' ? val : it.unit_price) || 0;
//         updated.total_price = String((q * p).toFixed(2));
//       }
//       return updated;
//     }));
//   };

//   const addRow = () => setItems([...items, { item_name_raw: '', quantity: '', unit_price: '', total_price: '', tax: '0', freight: '0' }]);
//   const removeRow = (idx) => { if (items.length > 1) setItems(items.filter((_, i) => i !== idx)); };

//   const totalAmount = items.reduce((s, i) => s + (parseFloat(i.total_price) || 0), 0);

//   // ── Guard states ─────────────────────────────────────────────────────────
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

//   const rfq = data?.rfq;
//   const vendor = data?.vendor;

//   // ── Step 2: Success ───────────────────────────────────────────────────────
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
//           <div className="flex justify-between"><span className="text-gray-500">Items submitted:</span><span className="font-medium">{items.filter((i) => i.item_name_raw).length}</span></div>
//           <div className="flex justify-between"><span className="text-gray-500">Total quoted:</span><span className="font-semibold text-brand-600">₹{totalAmount.toLocaleString('en-IN')}</span></div>
//           <div className="flex justify-between"><span className="text-gray-500">Delivery:</span><span className="font-medium">{header.delivery_time_days ? `${header.delivery_time_days} days` : '—'}</span></div>
//           <div className="flex justify-between"><span className="text-gray-500">Payment terms:</span><span className="font-medium">{header.payment_terms || '—'}</span></div>
//         </div>
//         <p className="text-xs text-gray-400 mt-4">Powered by ProcureAI</p>
//       </div>
//     </div>
//   );

//   // ── Page wrapper ─────────────────────────────────────────────────────────
//   return (
//     <div className="min-h-screen bg-gray-50 py-6 px-4">
//       <div className="max-w-3xl mx-auto">

//         {/* Header */}
//         <div className="flex items-center gap-3 mb-6">
//           <div className="w-10 h-10 bg-brand-600 rounded-xl flex items-center justify-center shrink-0">
//             <ShoppingCart className="w-5 h-5 text-white" />
//           </div>
//           <div className="flex-1">
//             <p className="font-bold text-gray-900">ProcureAI — Quote Request</p>
//             <p className="text-sm text-gray-500">
//               {vendor?.name} · RFQ: {rfq?.rfq_number}
//             </p>
//           </div>
//           {/* Step indicator */}
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

//         {/* RFQ Summary */}
//         <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4 mb-4">
//           <div className="flex flex-wrap gap-4 text-sm">
//             <div><span className="text-gray-400">Deadline:</span> <strong>{rfq?.deadline ? new Date(rfq.deadline).toLocaleDateString('en-IN') : '—'}</strong></div>
//             <div><span className="text-gray-400">Deliver to:</span> <strong>{rfq?.delivery_location || '—'}</strong></div>
//             {rfq?.terms && <div><span className="text-gray-400">Terms:</span> {rfq.terms}</div>}
//           </div>
//         </div>

//         {/* Items Requested */}
//         {rfq?.PurchaseRequest?.items?.length > 0 && (
//           <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4 mb-4">
//             <h2 className="font-semibold text-sm text-gray-700 mb-3 flex items-center gap-2">
//               <FileText className="w-4 h-4 text-brand-600" /> Items Required
//             </h2>
//             <div className="overflow-x-auto">
//               <table className="min-w-full text-sm">
//                 <thead><tr className="border-b border-gray-100"><th className="text-left py-1.5 pr-4 text-xs text-gray-500 font-medium">Item</th><th className="text-left py-1.5 px-2 text-xs text-gray-500 font-medium">Qty</th><th className="text-left py-1.5 px-2 text-xs text-gray-500 font-medium">Unit</th><th className="text-left py-1.5 px-2 text-xs text-gray-500 font-medium">Notes</th></tr></thead>
//                 <tbody>
//                   {rfq.PurchaseRequest.items.map((it) => (
//                     <tr key={it.id} className="border-b border-gray-50 last:border-0">
//                       <td className="py-1.5 pr-4 font-medium text-gray-800">{it.Item?.name || it.item_name_freetext}</td>
//                       <td className="py-1.5 px-2 text-gray-600">{it.quantity}</td>
//                       <td className="py-1.5 px-2 text-gray-500">{it.Item?.unit || '—'}</td>
//                       <td className="py-1.5 px-2 text-gray-400 text-xs">{it.notes || '—'}</td>
//                     </tr>
//                   ))}
//                 </tbody>
//               </table>
//             </div>
//           </div>
//         )}

//         {/* ── STEP 0: Upload or Manual Entry ─────────────────────────────── */}
//         {step === 0 && (
//           <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-5">
//             <h2 className="font-semibold text-gray-800 mb-1">Submit Your Quote</h2>
//             <p className="text-sm text-gray-500 mb-4">Upload your quotation file and we'll extract the details automatically, or enter prices manually.</p>

//             {/* Mode tabs */}
//             <div className="flex gap-2 mb-5 border-b border-gray-100 pb-3">
//               <button
//                 className={`flex items-center gap-2 text-sm px-4 py-2 rounded-lg font-medium transition ${inputMode === 'upload' ? 'bg-brand-600 text-white' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'}`}
//                 onClick={() => { setInputMode('upload'); setValidateError(''); }}
//               >
//                 <Upload className="w-4 h-4" /> Upload File
//               </button>
//               <button
//                 className={`flex items-center gap-2 text-sm px-4 py-2 rounded-lg font-medium transition ${inputMode === 'manual' ? 'bg-brand-600 text-white' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'}`}
//                 onClick={handleGoManual}
//               >
//                 <PenLine className="w-4 h-4" /> Enter Manually
//               </button>
//             </div>

//             {/* Quote header fields — always visible */}
//             <div className="grid grid-cols-3 gap-3 mb-5">
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

//             {/* Upload mode */}
//             {inputMode === 'upload' && (
//               <div className="space-y-3">
//                 <label className={`flex flex-col items-center justify-center border-2 border-dashed rounded-xl p-8 cursor-pointer transition ${file ? 'border-brand-400 bg-brand-50' : 'border-gray-300 hover:border-brand-400'}`}>
//                   <Upload className={`w-8 h-8 mb-2 ${file ? 'text-brand-500' : 'text-gray-400'}`} />
//                   {file ? (
//                     <div className="text-center">
//                       <p className="text-sm font-semibold text-brand-700">{file.name}</p>
//                       <p className="text-xs text-gray-500 mt-0.5">{(file.size / 1024).toFixed(0)} KB · Click to change</p>
//                     </div>
//                   ) : (
//                     <div className="text-center">
//                       <p className="text-sm text-gray-600 font-medium">Click to upload your quote file</p>
//                       <p className="text-xs text-gray-400 mt-1">PDF · Excel (.xlsx, .xls) · Image (JPG, PNG) · Max 20MB</p>
//                       <p className="text-xs text-gray-400">Handwritten, scanned, or digital — all supported</p>
//                     </div>
//                   )}
//                   <input type="file" className="hidden" accept=".pdf,.xlsx,.xls,.jpg,.jpeg,.png,.tiff,.csv" onChange={handleFileChange} />
//                 </label>

//                 {validateError && (
//                   <div className="bg-red-50 border border-red-200 rounded-lg p-3">
//                     <p className="text-red-700 text-sm font-medium flex items-center gap-1.5 mb-1">
//                       <AlertTriangle className="w-4 h-4 shrink-0" /> Could not extract from file
//                     </p>
//                     <p className="text-red-600 text-xs">{validateError}</p>
//                     <button className="text-xs text-brand-600 hover:underline mt-2 font-medium" onClick={handleGoManual}>
//                       Switch to manual entry →
//                     </button>
//                   </div>
//                 )}

//                 <div className="flex gap-3">
//                   <button
//                     className="btn-primary flex-1 flex items-center justify-center gap-2"
//                     disabled={!file || validating}
//                     onClick={handleValidate}
//                   >
//                     {validating ? (
//                       <><RefreshCw className="w-4 h-4 animate-spin" /> Extracting with AI…</>
//                     ) : (
//                       <><RefreshCw className="w-4 h-4" /> Extract & Preview</>
//                     )}
//                   </button>
//                   <button className="btn-secondary" onClick={handleGoManual}>Enter Manually</button>
//                 </div>

//                 <p className="text-xs text-gray-400 text-center">
//                   AI reads your file, extracts item details, and shows them for your review before submission.
//                   Nothing is submitted until you confirm.
//                 </p>
//               </div>
//             )}

//             {/* Manual entry mode */}
//             {inputMode === 'manual' && (
//               <div className="space-y-3">
//                 <div className="flex items-center justify-between mb-1">
//                   <label className="text-sm font-medium text-gray-700">Quote Line Items</label>
//                   <button className="text-xs text-brand-600 flex items-center gap-1 hover:underline" onClick={addRow}>
//                     <Plus className="w-3 h-3" /> Add row
//                   </button>
//                 </div>
//                 <div className="overflow-x-auto">
//                   <table className="min-w-full border border-gray-200 rounded-xl overflow-hidden">
//                     <thead className="bg-gray-50">
//                       <tr>
//                         <th className="table-th">Item Name *</th>
//                         <th className="table-th">Qty</th>
//                         <th className="table-th">Unit Price (₹)</th>
//                         <th className="table-th">Total (₹)</th>
//                         <th className="table-th">Tax (₹)</th>
//                         <th className="table-th">Freight (₹)</th>
//                         <th className="w-8" />
//                       </tr>
//                     </thead>
//                     <tbody className="divide-y divide-gray-100 bg-white">
//                       {items.map((it, i) => (
//                         <tr key={i}>
//                           <td className="px-2 py-2"><input className="input text-sm min-w-32" value={it.item_name_raw} onChange={(e) => updateItem(i, 'item_name_raw', e.target.value)} placeholder="Item name" /></td>
//                           <td className="px-2 py-2"><input className="input w-16 text-sm" type="number" value={it.quantity} onChange={(e) => updateItem(i, 'quantity', e.target.value)} placeholder="0" /></td>
//                           <td className="px-2 py-2"><input className="input w-24 text-sm" type="number" value={it.unit_price} onChange={(e) => updateItem(i, 'unit_price', e.target.value)} placeholder="0" /></td>
//                           <td className="px-2 py-2 text-sm font-semibold text-gray-700">₹{Number(it.total_price || 0).toLocaleString('en-IN')}</td>
//                           <td className="px-2 py-2"><input className="input w-16 text-sm" type="number" value={it.tax} onChange={(e) => updateItem(i, 'tax', e.target.value)} placeholder="0" /></td>
//                           <td className="px-2 py-2"><input className="input w-16 text-sm" type="number" value={it.freight} onChange={(e) => updateItem(i, 'freight', e.target.value)} placeholder="0" /></td>
//                           <td className="px-2 py-2"><button onClick={() => removeRow(i)} className="text-red-400 hover:text-red-600 p-1"><Trash2 className="w-3.5 h-3.5" /></button></td>
//                         </tr>
//                       ))}
//                     </tbody>
//                     <tfoot className="bg-gray-50">
//                       <tr>
//                         <td colSpan={3} className="px-4 py-2 text-right text-sm font-semibold text-gray-600">Total Amount</td>
//                         <td className="px-2 py-2 font-bold text-brand-700">₹{totalAmount.toLocaleString('en-IN')}</td>
//                         <td colSpan={3} />
//                       </tr>
//                     </tfoot>
//                   </table>
//                 </div>
//                 <button
//                   className="btn-primary w-full"
//                   onClick={handleProceedManual}
//                   disabled={!items.some((i) => i.item_name_raw)}
//                 >
//                   Review & Confirm →
//                 </button>
//               </div>
//             )}
//           </div>
//         )}

//         {/* ── STEP 1: Review & Confirm ────────────────────────────────────── */}
//         {step === 1 && (
//           <div className="space-y-4">
//             {extractionConfidence !== null && (
//               <div className={`rounded-xl border p-4 ${extractionConfidence >= 0.75 ? 'bg-green-50 border-green-200' : 'bg-amber-50 border-amber-200'}`}>
//                 <div className="flex items-center gap-2 mb-1">
//                   {extractionConfidence >= 0.75 ? (
//                     <CheckCircle className="w-4 h-4 text-green-600 shrink-0" />
//                   ) : (
//                     <AlertTriangle className="w-4 h-4 text-amber-600 shrink-0" />
//                   )}
//                   <p className={`text-sm font-semibold ${extractionConfidence >= 0.75 ? 'text-green-700' : 'text-amber-700'}`}>
//                     AI Extraction: {(extractionConfidence * 100).toFixed(0)}% confidence
//                     {extractionConfidence >= 0.75 ? ' — Looks good!' : ' — Please review carefully'}
//                   </p>
//                 </div>
//                 <p className={`text-xs ml-6 ${extractionConfidence >= 0.75 ? 'text-green-600' : 'text-amber-600'}`}>
//                   {extractionConfidence >= 0.75
//                     ? 'All items were extracted successfully. Review the details below and confirm if correct.'
//                     : 'Some fields may not have been read correctly (marked in amber). Edit any incorrect values before confirming.'}
//                 </p>
//                 {extractionNote && <p className="text-xs text-amber-700 mt-1 ml-6">⚠️ {extractionNote}</p>}
//               </div>
//             )}

//             <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-5">
//               <div className="flex items-center justify-between mb-4">
//                 <h2 className="font-semibold text-gray-800 flex items-center gap-2">
//                   <Edit3 className="w-4 h-4 text-brand-600" />
//                   Review Your Quote Details
//                 </h2>
//                 <button className="text-xs text-brand-600 hover:underline" onClick={() => setStep(0)}>← Edit</button>
//               </div>

//               {/* Header fields — editable */}
//               <div className="grid grid-cols-3 gap-3 mb-5">
//                 <Field label="Payment Terms">
//                   <input className="input" value={header.payment_terms} onChange={(e) => setHeader({ ...header, payment_terms: e.target.value })} placeholder="e.g. Net 30" />
//                 </Field>
//                 <Field label="Delivery Days">
//                   <input className="input" type="number" value={header.delivery_time_days} onChange={(e) => setHeader({ ...header, delivery_time_days: e.target.value })} />
//                 </Field>
//                 <Field label="Valid Until">
//                   <input className="input" type="date" value={header.validity_date} onChange={(e) => setHeader({ ...header, validity_date: e.target.value })} />
//                 </Field>
//               </div>

//               {/* Line items — fully editable */}
//               <div className="flex items-center justify-between mb-2">
//                 <label className="text-sm font-medium text-gray-700">Line Items</label>
//                 <button className="text-xs text-brand-600 flex items-center gap-1 hover:underline" onClick={addRow}>
//                   <Plus className="w-3 h-3" /> Add row
//                 </button>
//               </div>
//               <div className="overflow-x-auto mb-4">
//                 <table className="min-w-full border border-gray-200 rounded-xl overflow-hidden">
//                   <thead className="bg-gray-50">
//                     <tr>
//                       <th className="table-th">Item Name</th>
//                       <th className="table-th">Qty</th>
//                       <th className="table-th">Unit Price (₹)</th>
//                       <th className="table-th">Total (₹)</th>
//                       <th className="table-th">Tax (₹)</th>
//                       <th className="table-th">Freight (₹)</th>
//                       <th className="w-8" />
//                     </tr>
//                   </thead>
//                   <tbody className="divide-y divide-gray-100 bg-white">
//                     {items.map((it, i) => (
//                       <tr key={i} className={it.confidence_score && it.confidence_score < 0.7 ? 'bg-amber-50' : ''}>
//                         <td className="px-2 py-2">
//                           <input className="input text-sm min-w-36" value={it.item_name_raw} onChange={(e) => updateItem(i, 'item_name_raw', e.target.value)} />
//                           {it.confidence_score && it.confidence_score < 0.7 && (
//                             <p className="text-xs text-amber-600 mt-0.5">⚠️ Low confidence — please verify</p>
//                           )}
//                         </td>
//                         <td className="px-2 py-2"><input className="input w-16 text-sm" type="number" value={it.quantity} onChange={(e) => updateItem(i, 'quantity', e.target.value)} /></td>
//                         <td className="px-2 py-2"><input className="input w-24 text-sm" type="number" value={it.unit_price} onChange={(e) => updateItem(i, 'unit_price', e.target.value)} /></td>
//                         <td className="px-2 py-2 text-sm font-semibold text-gray-700">₹{Number(it.total_price || 0).toLocaleString('en-IN')}</td>
//                         <td className="px-2 py-2"><input className="input w-16 text-sm" type="number" value={it.tax} onChange={(e) => updateItem(i, 'tax', e.target.value)} /></td>
//                         <td className="px-2 py-2"><input className="input w-16 text-sm" type="number" value={it.freight} onChange={(e) => updateItem(i, 'freight', e.target.value)} /></td>
//                         <td className="px-2 py-2"><button onClick={() => removeRow(i)} className="text-red-400 hover:text-red-600 p-1"><Trash2 className="w-3.5 h-3.5" /></button></td>
//                       </tr>
//                     ))}
//                   </tbody>
//                   <tfoot className="bg-gray-50 border-t-2 border-gray-200">
//                     <tr>
//                       <td colSpan={3} className="px-4 py-2 text-right text-sm font-semibold text-gray-600">Grand Total</td>
//                       <td className="px-2 py-2 font-bold text-brand-700 text-base">₹{totalAmount.toLocaleString('en-IN')}</td>
//                       <td colSpan={3} />
//                     </tr>
//                   </tfoot>
//                 </table>
//               </div>

//               <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 text-xs text-blue-700 mb-4">
//                 ✅ By clicking Submit, you confirm that all prices, quantities, and terms above are correct and constitute your official quotation.
//               </div>

//               <div className="flex gap-3">
//                 <button className="btn-secondary" onClick={() => setStep(0)}>← Back</button>
//                 <button
//                   className="btn-primary flex-1 flex items-center justify-center gap-2"
//                   disabled={!items.some((i) => i.item_name_raw) || submitMutation.isPending}
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


import React, { useState, useMemo } from 'react';
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
  // (see useMemo below) — never freely added/removed/retyped. Item name and
  // requested quantity always come from the buyer's item master; only these
  // per-row fields are editable.
  const [rows, setRows] = useState(null);

  const { data, isLoading, error } = useQuery({
    queryKey: ['public-rfq', token],
    queryFn: () => publicApi.getRfq(token).then((r) => r.data.data),
    retry: false,
    onSuccess: (d) => {
      if (rows) return; // don't clobber if already seeded/edited
      const items = d?.rfq?.PurchaseRequest?.items || [];
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
    },
  });

  const rfq = data?.rfq;
  const vendor = data?.vendor;

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
        const match = extracted.find((e) => {
          const candidate = normalize(e.item_name_raw);
          return candidate && (candidate === target || candidate.includes(target) || target.includes(candidate));
        });
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
        const found = (rows || []).some((row) => {
          const target = normalize(row.item_name);
          return candidate && (candidate === target || candidate.includes(target) || target.includes(candidate));
        });
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

  if (isLoading || !rows) return <div className="flex items-center justify-center h-screen"><Spinner size="lg" /></div>;
  if (error) return (
    <div className="flex items-center justify-center h-screen bg-gray-50 px-4">
      <div className="bg-white rounded-xl shadow p-8 max-w-md text-center">
        <AlertTriangle className="w-12 h-12 text-red-400 mx-auto mb-3" />
        <p className="text-red-600 font-semibold text-lg mb-1">Invalid or expired link</p>
        <p className="text-sm text-gray-500">This quote link is invalid or has already been used. Contact your buyer for a new link.</p>
      </div>
    </div>
  );

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
