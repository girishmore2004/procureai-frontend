import React, { useState } from 'react';
import { useParams } from 'react-router-dom';
import { useQuery, useMutation } from '@tanstack/react-query';
import { publicApi } from '../api/services';
import { Spinner, Field, Alert } from '../components/ui';
import { ShoppingCart, Upload, CheckCircle, Plus, Trash2 } from 'lucide-react';
import toast from 'react-hot-toast';

export default function VendorQuotePage() {
  const { token } = useParams();
  const [file, setFile] = useState(null);
  const [manualMode, setManualMode] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [form, setForm] = useState({ payment_terms: '', delivery_time_days: '', validity_date: '' });
  const [items, setItems] = useState([{ item_name_raw: '', quantity: '', unit_price: '', total_price: '' }]);

  const { data, isLoading, error } = useQuery({
    queryKey: ['public-rfq', token],
    queryFn: () => publicApi.getRfq(token).then((r) => r.data.data),
    retry: false,
  });

  const submitMutation = useMutation({
    mutationFn: () => {
      const payload = { ...form };
      if (manualMode) payload.items = JSON.stringify(items);
      return publicApi.submitQuote(token, manualMode ? null : file, payload);
    },
    onSuccess: () => { setSubmitted(true); },
    onError: (e) => toast.error(e.response?.data?.error?.message || 'Submission failed'),
  });

  const updateItem = (i, f, v) => setItems(items.map((it, idx) => idx === i ? { ...it, [f]: v, total_price: f === 'quantity' || f === 'unit_price' ? String((Number(f === 'quantity' ? v : it.quantity) || 0) * (Number(f === 'unit_price' ? v : it.unit_price) || 0)) : it.total_price } : it));

  if (isLoading) return <div className="flex items-center justify-center h-screen"><Spinner size="lg" /></div>;
  if (error) return <div className="flex items-center justify-center h-screen"><div className="card max-w-md text-center"><p className="text-red-600 font-medium">Invalid or expired quote link</p><p className="text-sm text-gray-500 mt-2">Contact your buyer for a new link.</p></div></div>;
  if (submitted) return (
    <div className="flex items-center justify-center h-screen bg-gray-50">
      <div className="card max-w-md text-center">
        <CheckCircle className="w-16 h-16 text-green-500 mx-auto mb-4" />
        <h2 className="text-xl font-bold mb-2">Quote Submitted!</h2>
        <p className="text-gray-500">Your quote has been received. The buyer will review it and get back to you.</p>
      </div>
    </div>
  );

  const rfq = data?.rfq;
  const vendor = data?.vendor;

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4">
      <div className="max-w-2xl mx-auto">
        {/* Header */}
        <div className="flex items-center gap-3 mb-6">
          <div className="w-10 h-10 bg-brand-600 rounded-xl flex items-center justify-center"><ShoppingCart className="w-5 h-5 text-white" /></div>
          <div>
            <p className="font-bold text-gray-900">ProcureAI — Quote Request</p>
            <p className="text-sm text-gray-500">For: {vendor?.name}</p>
          </div>
        </div>

        <div className="card mb-4">
          <h2 className="font-semibold mb-3">RFQ: {rfq?.rfq_number}</h2>
          <div className="grid grid-cols-2 gap-3 text-sm mb-3">
            <div><span className="text-gray-500">Quote Deadline:</span> <strong>{rfq?.deadline ? new Date(rfq.deadline).toLocaleDateString('en-IN') : '—'}</strong></div>
            <div><span className="text-gray-500">Delivery Location:</span> <strong>{rfq?.delivery_location || '—'}</strong></div>
          </div>
          {rfq?.terms && <div className="bg-gray-50 rounded-lg p-3 text-sm text-gray-600"><strong>Terms:</strong> {rfq.terms}</div>}
        </div>

        {/* Items requested */}
        {rfq?.PurchaseRequest?.items?.length > 0 && (
          <div className="card mb-4">
            <h2 className="font-semibold mb-3">Items Required</h2>
            <table className="min-w-full divide-y divide-gray-100">
              <thead className="bg-gray-50"><tr><th className="table-th">Item</th><th className="table-th">Qty</th><th className="table-th">Notes</th></tr></thead>
              <tbody className="divide-y divide-gray-50">
                {rfq.PurchaseRequest.items.map((it) => (
                  <tr key={it.id}>
                    <td className="table-td">{it.Item?.name || it.item_name_freetext}</td>
                    <td className="table-td">{it.quantity}</td>
                    <td className="table-td text-xs text-gray-500">{it.notes || '—'}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* Quote Submission */}
        <div className="card">
          <h2 className="font-semibold mb-4">Submit Your Quote</h2>

          <div className="grid grid-cols-3 gap-3 mb-4">
            <Field label="Payment Terms"><input className="input" placeholder="e.g. Net 30" value={form.payment_terms} onChange={(e) => setForm({ ...form, payment_terms: e.target.value })} /></Field>
            <Field label="Delivery Days"><input className="input" type="number" placeholder="e.g. 7" value={form.delivery_time_days} onChange={(e) => setForm({ ...form, delivery_time_days: e.target.value })} /></Field>
            <Field label="Valid Until"><input className="input" type="date" value={form.validity_date} onChange={(e) => setForm({ ...form, validity_date: e.target.value })} /></Field>
          </div>

          {/* Toggle between file upload and manual entry */}
          <div className="flex gap-2 mb-4">
            <button className={`text-sm px-3 py-1.5 rounded-lg font-medium transition ${!manualMode ? 'bg-brand-100 text-brand-700' : 'bg-gray-100 text-gray-600'}`} onClick={() => setManualMode(false)}>Upload Quote File</button>
            <button className={`text-sm px-3 py-1.5 rounded-lg font-medium transition ${manualMode ? 'bg-brand-100 text-brand-700' : 'bg-gray-100 text-gray-600'}`} onClick={() => setManualMode(true)}>Enter Manually</button>
          </div>

          {!manualMode ? (
            <div>
              <label className="flex flex-col items-center justify-center border-2 border-dashed border-gray-300 rounded-lg p-8 cursor-pointer hover:border-brand-400 transition">
                <Upload className="w-8 h-8 text-gray-400 mb-2" />
                <span className="text-sm text-gray-500">{file ? file.name : 'Upload your quote PDF, Excel, or image'}</span>
                <span className="text-xs text-gray-400 mt-1">Max 20MB · PDF, XLSX, JPG, PNG</span>
                <input type="file" className="hidden" accept=".pdf,.xlsx,.xls,.jpg,.jpeg,.png" onChange={(e) => setFile(e.target.files[0])} />
              </label>
              <Alert type="info" message="AI will automatically extract item prices and details from your file." />
            </div>
          ) : (
            <div>
              <div className="flex items-center justify-between mb-2">
                <label className="label mb-0">Quote Line Items</label>
                <button className="text-xs text-brand-600 flex items-center gap-1" onClick={() => setItems([...items, { item_name_raw: '', quantity: '', unit_price: '', total_price: '' }])}><Plus className="w-3 h-3" /> Add row</button>
              </div>
              <table className="min-w-full border border-gray-200 rounded-lg overflow-hidden">
                <thead className="bg-gray-50"><tr><th className="table-th">Item Name</th><th className="table-th">Qty</th><th className="table-th">Unit Price (₹)</th><th className="table-th">Total</th><th /></tr></thead>
                <tbody className="divide-y divide-gray-100">
                  {items.map((it, i) => (
                    <tr key={i}>
                      <td className="px-2 py-2"><input className="input text-sm" value={it.item_name_raw} onChange={(e) => updateItem(i, 'item_name_raw', e.target.value)} placeholder="Item name" /></td>
                      <td className="px-2 py-2"><input className="input w-16 text-sm" type="number" value={it.quantity} onChange={(e) => updateItem(i, 'quantity', e.target.value)} /></td>
                      <td className="px-2 py-2"><input className="input w-24 text-sm" type="number" value={it.unit_price} onChange={(e) => updateItem(i, 'unit_price', e.target.value)} /></td>
                      <td className="px-2 py-2 text-sm font-medium">₹{Number(it.total_price || 0).toLocaleString('en-IN')}</td>
                      <td className="px-2 py-2"><button onClick={() => setItems(items.filter((_, idx) => idx !== i))} className="text-red-400 hover:text-red-600"><Trash2 className="w-4 h-4" /></button></td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          <div className="flex justify-end mt-4">
            <button className="btn-primary px-8"
              disabled={(!file && !manualMode) || (manualMode && !items.some((i) => i.item_name_raw)) || submitMutation.isPending}
              onClick={() => submitMutation.mutate()}>
              {submitMutation.isPending ? 'Submitting…' : 'Submit Quote'}
            </button>
          </div>
        </div>

        <p className="text-center text-xs text-gray-400 mt-4">Powered by ProcureAI · This link is unique to your company</p>
      </div>
    </div>
  );
}
