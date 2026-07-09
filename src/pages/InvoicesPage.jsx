// import React, { useState } from 'react';
// import { useParams, Link, useNavigate } from 'react-router-dom';
// import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
// import { invoicesApi, vendorsApi, poApi } from '../api/services';
// import { toAbsoluteFileUrl } from '../api/client';
// import { Table, EmptyState, StatusBadge, PageLoader, Alert, Modal, Field } from '../components/ui';
// import { Upload, CheckCircle, GitMerge, AlertTriangle } from 'lucide-react';
// import toast from 'react-hot-toast';
// import { safeFormatDistanceToNow } from '../utils/date';

// export function InvoicesPage() {
//   const navigate = useNavigate();
//   const qc = useQueryClient();
//   const [uploadOpen, setUploadOpen] = useState(false);
//   const [file, setFile] = useState(null);
//   const [uploadForm, setUploadForm] = useState({ purchase_order_id: '', vendor_id: '' });

//   const { data, isLoading } = useQuery({ queryKey: ['invoices'], queryFn: () => invoicesApi.list({ per_page: 50 }).then((r) => r.data) });
//   const { data: vendors } = useQuery({ queryKey: ['vendors-all'], queryFn: () => vendorsApi.list({ per_page: 100 }).then((r) => r.data.data) });
//   const { data: pos } = useQuery({ queryKey: ['pos-invoice'], queryFn: () => poApi.list({ per_page: 100 }).then((r) => r.data.data) });

//   const uploadMutation = useMutation({
//     mutationFn: () => invoicesApi.upload(file, uploadForm),
//     onSuccess: (res) => { toast.success('Invoice uploaded and processed'); qc.invalidateQueries(['invoices']); setUploadOpen(false); navigate(`/invoices/${res.data.data.id}`); },
//     onError: (e) => toast.error(e.response?.data?.error?.message || 'Upload failed'),
//   });

//   const invoices = data?.data || [];

//   return (
//     <div className="space-y-4">
//       <div className="flex items-center justify-between">
//         <h1>Invoices</h1>
//         <button className="btn-primary flex items-center gap-2" onClick={() => setUploadOpen(true)}><Upload className="w-4 h-4" /> Upload Invoice</button>
//       </div>

//       <Table headers={['Invoice No.', 'Vendor', 'PO', 'Amount', 'Match', 'Payment', 'Date']} loading={isLoading}
//         empty={<EmptyState title="No invoices yet" description="Upload vendor invoices to begin 3-way matching" />}>
//         {invoices.map((inv) => (
//           <tr key={inv.id} className="hover:bg-gray-50 cursor-pointer" onClick={() => navigate(`/invoices/${inv.id}`)}>
//             <td className="table-td"><Link to={`/invoices/${inv.id}`} className="text-brand-600 hover:underline font-medium">{inv.invoice_number || '—'}</Link></td>
//             <td className="table-td">{inv.vendor_id?.slice(-6)}</td>
//             <td className="table-td text-xs">{inv.purchase_order_id?.slice(-6) || '—'}</td>
//             <td className="table-td font-semibold">₹{Number(inv.total_amount || 0).toLocaleString('en-IN')}</td>
//             <td className="table-td">
//               <div className="flex items-center gap-1">
//                 {inv.match_status === 'mismatched' && <AlertTriangle className="w-3.5 h-3.5 text-red-500" />}
//                 {inv.match_status === 'matched' && <CheckCircle className="w-3.5 h-3.5 text-green-500" />}
//                 <StatusBadge status={inv.match_status} />
//               </div>
//             </td>
//             <td className="table-td"><StatusBadge status={inv.payment_status} /></td>
//             <td className="table-td text-xs text-gray-500">{safeFormatDistanceToNow(inv.created_at, { addSuffix: true })}</td>
//           </tr>
//         ))}
//       </Table>

//       <Modal open={uploadOpen} onClose={() => setUploadOpen(false)} title="Upload Invoice" size="md">
//         <div className="space-y-4">
//           <Field label="Vendor" required>
//             <select className="input" value={uploadForm.vendor_id} onChange={(e) => setUploadForm({ ...uploadForm, vendor_id: e.target.value })}>
//               <option value="">Select vendor…</option>
//               {vendors?.map((v) => <option key={v.id} value={v.id}>{v.name}</option>)}
//             </select>
//           </Field>
//           <Field label="Linked PO (for matching)">
//             <select className="input" value={uploadForm.purchase_order_id} onChange={(e) => setUploadForm({ ...uploadForm, purchase_order_id: e.target.value })}>
//               <option value="">Select PO (optional)…</option>
//               {pos?.map((p) => <option key={p.id} value={p.id}>{p.po_number} — {p.Vendor?.name}</option>)}
//             </select>
//           </Field>
//           <div>
//             <label className="label">Invoice File (PDF / Image)</label>
//             <label className="flex flex-col items-center justify-center border-2 border-dashed border-gray-300 rounded-lg p-6 cursor-pointer hover:border-brand-400">
//               <Upload className="w-6 h-6 text-gray-400 mb-2" />
//               <span className="text-sm text-gray-500">{file ? file.name : 'Click to upload PDF or image'}</span>
//               <input type="file" className="hidden" accept=".pdf,.jpg,.jpeg,.png" onChange={(e) => setFile(e.target.files[0])} />
//             </label>
//           </div>
//         </div>
//         <div className="flex justify-end gap-3 mt-4">
//           <button className="btn-secondary" onClick={() => setUploadOpen(false)}>Cancel</button>
//           <button className="btn-primary" disabled={!file || !uploadForm.vendor_id || uploadMutation.isPending} onClick={() => uploadMutation.mutate()}>{uploadMutation.isPending ? 'Uploading…' : 'Upload & Extract'}</button>
//         </div>
//       </Modal>
//     </div>
//   );
// }

// export function InvoiceDetailPage() {
//   const { id } = useParams();
//   const qc = useQueryClient();

//   const { data: invoice, isLoading } = useQuery({ queryKey: ['invoice', id], queryFn: () => invoicesApi.getOne(id).then((r) => r.data.data) });

//   const matchMutation = useMutation({
//     mutationFn: () => invoicesApi.match(id),
//     onSuccess: (res) => {
//       const { match_status, mismatches } = res.data.data;
//       if (match_status === 'matched') toast.success('Invoice matched successfully!');
//       else toast.error(`Mismatches found: ${mismatches?.join(', ')}`);
//       qc.invalidateQueries(['invoice', id]);
//     },
//     onError: (e) => toast.error(e.response?.data?.error?.message || 'Match failed'),
//   });

//   const approveMutation = useMutation({
//     mutationFn: () => invoicesApi.approve(id),
//     onSuccess: () => { toast.success('Invoice approved for payment'); qc.invalidateQueries(['invoice', id]); },
//     onError: (e) => toast.error(e.response?.data?.error?.message || 'Failed'),
//   });

//   // Previously there was no way to ever record that a vendor was actually
//   // paid — "Approve for Payment" only changed match_status, and once it did,
//   // the button vanished (it required match_status === 'matched') with no
//   // further action available. This closes that gap.
//   const markPaidMutation = useMutation({
//     mutationFn: () => invoicesApi.markPaid(id),
//     onSuccess: () => { toast.success('Invoice marked as paid'); qc.invalidateQueries(['invoice', id]); qc.invalidateQueries(['invoices']); },
//     onError: (e) => toast.error(e.response?.data?.error?.message || 'Failed'),
//   });

//   if (isLoading) return <PageLoader />;
//   if (!invoice) return <div className="card text-gray-500">Invoice not found</div>;

//   return (
//     <div className="space-y-4">
//       <div className="flex items-center gap-2 text-sm text-gray-500">
//         <Link to="/invoices" className="hover:text-brand-600">Invoices</Link>
//         <span>/</span><span className="text-gray-900 font-medium">{invoice.invoice_number || id.slice(-8)}</span>
//       </div>

//       {invoice.match_status === 'mismatched' && <Alert type="error" message={`Mismatch: ${invoice.mismatch_reason}`} />}
//       {invoice.match_status === 'matched' && <Alert type="success" message={`${invoice.match_type} match successful — invoice amounts and quantities verified`} />}

//       <div className="card">
//         <div className="flex items-start justify-between flex-wrap gap-3 mb-4">
//           <div>
//             <h1 className="mb-1">Invoice {invoice.invoice_number || '—'}</h1>
//             <p className="text-sm text-gray-500">Date: {invoice.invoice_date || '—'} · PO: {invoice.purchase_order_id?.slice(-8) || 'Not linked'}</p>
//           </div>
//           <div className="flex gap-2">
//             {invoice.match_status === 'pending' && <button className="btn-secondary flex items-center gap-2" onClick={() => matchMutation.mutate()} disabled={matchMutation.isPending}><GitMerge className="w-4 h-4" />{matchMutation.isPending ? 'Matching…' : 'Run 3-Way Match'}</button>}
//             {invoice.match_status === 'matched' && invoice.payment_status === 'unpaid' && <button className="btn-primary flex items-center gap-2" onClick={() => approveMutation.mutate()} disabled={approveMutation.isPending}><CheckCircle className="w-4 h-4" />Approve for Payment</button>}
//             {invoice.match_status === 'approved' && invoice.payment_status === 'unpaid' && <button className="btn-primary flex items-center gap-2" onClick={() => markPaidMutation.mutate()} disabled={markPaidMutation.isPending}><CheckCircle className="w-4 h-4" />{markPaidMutation.isPending ? 'Marking…' : 'Mark as Paid'}</button>}
//             <StatusBadge status={invoice.match_status} />
//             <StatusBadge status={invoice.payment_status} />
//           </div>
//         </div>

//         <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm mb-4 pb-4 border-b border-gray-100">
//           <div><p className="text-xs text-gray-400">Total Amount</p><p className="font-bold text-brand-700">₹{Number(invoice.total_amount || 0).toLocaleString('en-IN')}</p></div>
//           <div><p className="text-xs text-gray-400">Match Type</p><p className="font-medium">{invoice.match_type || 'Pending'}</p></div>
//           <div><p className="text-xs text-gray-400">Source</p>{toAbsoluteFileUrl(invoice.file_url) ? <a href={toAbsoluteFileUrl(invoice.file_url)} target="_blank" rel="noopener noreferrer" className="text-brand-600 text-xs hover:underline">View File</a> : <p className="text-xs text-gray-400">{invoice.file_url ? 'File unavailable' : '—'}</p>}</div>
//           <div><p className="text-xs text-gray-400">Paid On</p><p className="font-medium">{invoice.paid_at ? new Date(invoice.paid_at).toLocaleDateString('en-IN') : '—'}</p></div>
//         </div>

//         <h2 className="text-sm font-semibold text-gray-500 uppercase mb-3">Extracted Line Items</h2>
//         <table className="min-w-full divide-y divide-gray-100 border border-gray-200 rounded-lg">
//           <thead className="bg-gray-50"><tr><th className="table-th">Item</th><th className="table-th">Qty</th><th className="table-th">Unit Price</th><th className="table-th">Total</th><th className="table-th">Tax</th><th className="table-th">Freight</th><th className="table-th">Discount</th><th className="table-th">Confidence</th></tr></thead>
//           <tbody className="divide-y divide-gray-50">
//             {invoice.items?.map((it) => (
//               <tr key={it.id} className={it.confidence_score < 0.7 ? 'bg-amber-50' : ''}>
//                 <td className="table-td">{it.item_name_raw}</td>
//                 <td className="table-td">{it.quantity}</td>
//                 <td className="table-td">₹{Number(it.unit_price || 0).toLocaleString('en-IN')}</td>
//                 <td className="table-td font-medium">₹{Number(it.total_price || 0).toLocaleString('en-IN')}</td>
//                 <td className="table-td text-xs">{it.tax ? `₹${Number(it.tax).toLocaleString('en-IN')}` : '—'}</td>
//                 <td className="table-td text-xs">{it.freight ? `₹${Number(it.freight).toLocaleString('en-IN')}` : '—'}</td>
//                 <td className="table-td text-xs">{it.discount ? `₹${Number(it.discount).toLocaleString('en-IN')}` : '—'}</td>
//                 <td className="table-td"><span className={`text-xs font-semibold ${it.confidence_score >= 0.8 ? 'text-green-600' : 'text-amber-600'}`}>{it.confidence_score ? `${(it.confidence_score * 100).toFixed(0)}%` : '—'}</span></td>
//               </tr>
//             ))}
//             {!invoice.items?.length && <tr><td colSpan={8} className="text-center py-6 text-sm text-gray-400">Extracting invoice data…</td></tr>}
//           </tbody>
//         </table>
//       </div>
//     </div>
//   );
// }

// export default InvoicesPage;



import React, { useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { invoicesApi, vendorsApi, poApi, paymentsApi } from '../api/services';
import { toAbsoluteFileUrl } from '../api/client';
import { Table, EmptyState, StatusBadge, PageLoader, Alert, Modal, Field } from '../components/ui';
import { Upload, CheckCircle, GitMerge, AlertTriangle, Wallet } from 'lucide-react';
import toast from 'react-hot-toast';
import { safeFormatDistanceToNow } from '../utils/date';

export function InvoicesPage() {
  const navigate = useNavigate();
  const qc = useQueryClient();
  const [uploadOpen, setUploadOpen] = useState(false);
  const [file, setFile] = useState(null);
  const [uploadForm, setUploadForm] = useState({ purchase_order_id: '', vendor_id: '' });

  const { data, isLoading } = useQuery({ queryKey: ['invoices'], queryFn: () => invoicesApi.list({ per_page: 50 }).then((r) => r.data) });
  const { data: vendors } = useQuery({ queryKey: ['vendors-all'], queryFn: () => vendorsApi.list({ per_page: 100 }).then((r) => r.data.data) });
  const { data: pos } = useQuery({ queryKey: ['pos-invoice'], queryFn: () => poApi.list({ per_page: 100 }).then((r) => r.data.data) });

  const uploadMutation = useMutation({
    mutationFn: () => invoicesApi.upload(file, uploadForm),
    onSuccess: (res) => { toast.success('Invoice uploaded and processed'); qc.invalidateQueries(['invoices']); setUploadOpen(false); navigate(`/invoices/${res.data.data.id}`); },
    onError: (e) => toast.error(e.response?.data?.error?.message || 'Upload failed'),
  });

  const invoices = data?.data || [];

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h1>Invoices</h1>
        <button className="btn-primary flex items-center gap-2" onClick={() => setUploadOpen(true)}><Upload className="w-4 h-4" /> Upload Invoice</button>
      </div>

      <Table headers={['Invoice No.', 'Vendor', 'PO', 'Amount', 'Match', 'Payment', 'Date']} loading={isLoading}
        empty={<EmptyState title="No invoices yet" description="Upload vendor invoices to begin 3-way matching" />}>
        {invoices.map((inv) => (
          <tr key={inv.id} className="hover:bg-gray-50 cursor-pointer" onClick={() => navigate(`/invoices/${inv.id}`)}>
            <td className="table-td"><Link to={`/invoices/${inv.id}`} className="text-brand-600 hover:underline font-medium">{inv.invoice_number || '—'}</Link></td>
            <td className="table-td">{inv.vendor_id?.slice(-6)}</td>
            <td className="table-td text-xs">{inv.purchase_order_id?.slice(-6) || '—'}</td>
            <td className="table-td font-semibold">₹{Number(inv.total_amount || 0).toLocaleString('en-IN')}</td>
            <td className="table-td">
              <div className="flex items-center gap-1">
                {inv.match_status === 'mismatched' && <AlertTriangle className="w-3.5 h-3.5 text-red-500" />}
                {inv.match_status === 'matched' && <CheckCircle className="w-3.5 h-3.5 text-green-500" />}
                <StatusBadge status={inv.match_status} />
              </div>
            </td>
            <td className="table-td"><StatusBadge status={inv.payment_status} /></td>
            <td className="table-td text-xs text-gray-500">{safeFormatDistanceToNow(inv.created_at, { addSuffix: true })}</td>
          </tr>
        ))}
      </Table>

      <Modal open={uploadOpen} onClose={() => setUploadOpen(false)} title="Upload Invoice" size="md">
        <div className="space-y-4">
          <Field label="Vendor" required>
            <select className="input" value={uploadForm.vendor_id} onChange={(e) => setUploadForm({ ...uploadForm, vendor_id: e.target.value })}>
              <option value="">Select vendor…</option>
              {vendors?.map((v) => <option key={v.id} value={v.id}>{v.name}</option>)}
            </select>
          </Field>
          <Field label="Linked PO (for matching)">
            <select className="input" value={uploadForm.purchase_order_id} onChange={(e) => setUploadForm({ ...uploadForm, purchase_order_id: e.target.value })}>
              <option value="">Select PO (optional)…</option>
              {pos?.map((p) => <option key={p.id} value={p.id}>{p.po_number} — {p.Vendor?.name}</option>)}
            </select>
          </Field>
          <div>
            <label className="label">Invoice File (PDF / Image)</label>
            <label className="flex flex-col items-center justify-center border-2 border-dashed border-gray-300 rounded-lg p-6 cursor-pointer hover:border-brand-400">
              <Upload className="w-6 h-6 text-gray-400 mb-2" />
              <span className="text-sm text-gray-500">{file ? file.name : 'Click to upload PDF or image'}</span>
              <input type="file" className="hidden" accept=".pdf,.jpg,.jpeg,.png" onChange={(e) => setFile(e.target.files[0])} />
            </label>
          </div>
        </div>
        <div className="flex justify-end gap-3 mt-4">
          <button className="btn-secondary" onClick={() => setUploadOpen(false)}>Cancel</button>
          <button className="btn-primary" disabled={!file || !uploadForm.vendor_id || uploadMutation.isPending} onClick={() => uploadMutation.mutate()}>{uploadMutation.isPending ? 'Uploading…' : 'Upload & Extract'}</button>
        </div>
      </Modal>
    </div>
  );
}

export function InvoiceDetailPage() {
  const { id } = useParams();
  const qc = useQueryClient();
  const navigate = useNavigate();
  const [payModalOpen, setPayModalOpen] = useState(false);
  const [method, setMethod] = useState('bank_transfer');

  const { data: invoice, isLoading } = useQuery({ queryKey: ['invoice', id], queryFn: () => invoicesApi.getOne(id).then((r) => r.data.data) });

  const matchMutation = useMutation({
    mutationFn: () => invoicesApi.match(id),
    onSuccess: (res) => {
      const { match_status, mismatches } = res.data.data;
      if (match_status === 'matched') toast.success('Invoice matched successfully!');
      else toast.error(`Mismatches found: ${mismatches?.join(', ')}`);
      qc.invalidateQueries(['invoice', id]);
    },
    onError: (e) => toast.error(e.response?.data?.error?.message || 'Match failed'),
  });

  const approveMutation = useMutation({
    mutationFn: () => invoicesApi.approve(id),
    onSuccess: () => { toast.success('Invoice approved for payment'); qc.invalidateQueries(['invoice', id]); },
    onError: (e) => toast.error(e.response?.data?.error?.message || 'Failed'),
  });

  // Payment sequence: invoice approved -> payment queued (here) -> executed
  // (on the Payments page, generating a reference/UTR) -> vendor confirms
  // receipt from the vendor portal -> order closed. This replaces the old
  // one-click "Mark as Paid" with the real queue -> execute -> confirm flow.
  const queuePaymentMutation = useMutation({
    mutationFn: () => invoicesApi.queuePayment(id, { method }),
    onSuccess: () => {
      toast.success('Payment queued — execute it from the Payments page');
      qc.invalidateQueries(['invoice', id]);
      setPayModalOpen(false);
      navigate('/payments');
    },
    onError: (e) => toast.error(e.response?.data?.error?.message || 'Failed'),
  });

  if (isLoading) return <PageLoader />;
  if (!invoice) return <div className="card text-gray-500">Invoice not found</div>;

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2 text-sm text-gray-500">
        <Link to="/invoices" className="hover:text-brand-600">Invoices</Link>
        <span>/</span><span className="text-gray-900 font-medium">{invoice.invoice_number || id.slice(-8)}</span>
      </div>

      {invoice.match_status === 'mismatched' && <Alert type="error" message={`Mismatch: ${invoice.mismatch_reason}`} />}
      {invoice.match_status === 'matched' && <Alert type="success" message={`${invoice.match_type} match successful — invoice amounts and quantities verified`} />}
      {invoice.payment_status === 'payment_queued' && <Alert type="warning" message={<>Payment queued. <Link to="/payments" className="underline font-medium">Go to Payments</Link> to execute it and generate a reference.</>} />}

      <div className="card">
        <div className="flex items-start justify-between flex-wrap gap-3 mb-4">
          <div>
            <h1 className="mb-1">Invoice {invoice.invoice_number || '—'}</h1>
            <p className="text-sm text-gray-500">Date: {invoice.invoice_date || '—'} · PO: {invoice.purchase_order_id?.slice(-8) || 'Not linked'}</p>
          </div>
          <div className="flex gap-2">
            {invoice.match_status === 'pending' && <button className="btn-secondary flex items-center gap-2" onClick={() => matchMutation.mutate()} disabled={matchMutation.isPending}><GitMerge className="w-4 h-4" />{matchMutation.isPending ? 'Matching…' : 'Run 3-Way Match'}</button>}
            {invoice.match_status === 'matched' && invoice.payment_status === 'unpaid' && <button className="btn-primary flex items-center gap-2" onClick={() => approveMutation.mutate()} disabled={approveMutation.isPending}><CheckCircle className="w-4 h-4" />Approve for Payment</button>}
            {invoice.match_status === 'approved' && invoice.payment_status === 'unpaid' && <button className="btn-primary flex items-center gap-2" onClick={() => setPayModalOpen(true)}><Wallet className="w-4 h-4" />Queue Payment</button>}
            <StatusBadge status={invoice.match_status} />
            <StatusBadge status={invoice.payment_status} />
          </div>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm mb-4 pb-4 border-b border-gray-100">
          <div><p className="text-xs text-gray-400">Total Amount</p><p className="font-bold text-brand-700">₹{Number(invoice.total_amount || 0).toLocaleString('en-IN')}</p></div>
          <div><p className="text-xs text-gray-400">Match Type</p><p className="font-medium">{invoice.match_type || 'Pending'}</p></div>
          <div><p className="text-xs text-gray-400">Source</p>{toAbsoluteFileUrl(invoice.file_url) ? <a href={toAbsoluteFileUrl(invoice.file_url)} target="_blank" rel="noopener noreferrer" className="text-brand-600 text-xs hover:underline">View File</a> : <p className="text-xs text-gray-400">{invoice.file_url ? 'File unavailable' : '—'}</p>}</div>
          <div><p className="text-xs text-gray-400">Paid On</p><p className="font-medium">{invoice.paid_at ? new Date(invoice.paid_at).toLocaleDateString('en-IN') : '—'}</p></div>
        </div>

        <h2 className="text-sm font-semibold text-gray-500 uppercase mb-3">Extracted Line Items</h2>
        <table className="min-w-full divide-y divide-gray-100 border border-gray-200 rounded-lg">
          <thead className="bg-gray-50"><tr><th className="table-th">Item</th><th className="table-th">Qty</th><th className="table-th">Unit Price</th><th className="table-th">Total</th><th className="table-th">Tax</th><th className="table-th">Freight</th><th className="table-th">Discount</th><th className="table-th">Confidence</th></tr></thead>
          <tbody className="divide-y divide-gray-50">
            {invoice.items?.map((it) => (
              <tr key={it.id} className={it.confidence_score < 0.7 ? 'bg-amber-50' : ''}>
                <td className="table-td">{it.item_name_raw}</td>
                <td className="table-td">{it.quantity}</td>
                <td className="table-td">₹{Number(it.unit_price || 0).toLocaleString('en-IN')}</td>
                <td className="table-td font-medium">₹{Number(it.total_price || 0).toLocaleString('en-IN')}</td>
                <td className="table-td text-xs">{it.tax ? `₹${Number(it.tax).toLocaleString('en-IN')}` : '—'}</td>
                <td className="table-td text-xs">{it.freight ? `₹${Number(it.freight).toLocaleString('en-IN')}` : '—'}</td>
                <td className="table-td text-xs">{it.discount ? `₹${Number(it.discount).toLocaleString('en-IN')}` : '—'}</td>
                <td className="table-td"><span className={`text-xs font-semibold ${it.confidence_score >= 0.8 ? 'text-green-600' : 'text-amber-600'}`}>{it.confidence_score ? `${(it.confidence_score * 100).toFixed(0)}%` : '—'}</span></td>
              </tr>
            ))}
            {!invoice.items?.length && <tr><td colSpan={8} className="text-center py-6 text-sm text-gray-400">Extracting invoice data…</td></tr>}
          </tbody>
        </table>
      </div>

      <Modal open={payModalOpen} onClose={() => setPayModalOpen(false)} title="Queue Payment" size="sm">
        <div className="space-y-4">
          <p className="text-sm text-gray-600">This queues a payment of <strong>₹{Number(invoice.total_amount || 0).toLocaleString('en-IN')}</strong> for finance to execute.</p>
          <Field label="Payment Method" required>
            <select className="input" value={method} onChange={(e) => setMethod(e.target.value)}>
              <option value="bank_transfer">Bank Transfer</option>
              <option value="neft">NEFT</option>
              <option value="rtgs">RTGS</option>
              <option value="upi">UPI</option>
              <option value="ach">ACH</option>
              <option value="cheque">Cheque</option>
              <option value="card">Virtual Card</option>
            </select>
          </Field>
        </div>
        <div className="flex justify-end gap-3 mt-4">
          <button className="btn-secondary" onClick={() => setPayModalOpen(false)}>Cancel</button>
          <button className="btn-primary" disabled={queuePaymentMutation.isPending} onClick={() => queuePaymentMutation.mutate()}>{queuePaymentMutation.isPending ? 'Queuing…' : 'Queue Payment'}</button>
        </div>
      </Modal>
    </div>
  );
}

export default InvoicesPage;
