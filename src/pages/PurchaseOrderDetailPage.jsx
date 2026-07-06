import React, { useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { poApi } from '../api/services';
import api from '../api/client';
import { StatusBadge, PageLoader } from '../components/ui';
import { Send, Download, FileText, MessageSquare, RefreshCw } from 'lucide-react';
import toast from 'react-hot-toast';
import { safeFormatDistanceToNow } from '../utils/date';

export default function PurchaseOrderDetailPage() {
  const { id } = useParams();
  const qc = useQueryClient();
  const [msgBody, setMsgBody] = useState('');
  const [sendingMsg, setSendingMsg] = useState(false);

  const { data: po, isLoading } = useQuery({
    queryKey: ['po', id],
    queryFn: () => poApi.getOne(id).then((r) => r.data.data),
  });

  const { data: messages = [], refetch: refetchMsgs } = useQuery({
    queryKey: ['po-messages', id],
    queryFn: () => api.get(`/purchase-orders/${id}/messages`).then((r) => r.data.data),
    refetchInterval: 15000, // poll every 15s for new vendor replies
  });

  const sendMutation = useMutation({
    mutationFn: () => poApi.send(id),
    onSuccess: () => { toast.success('PO sent to vendor'); qc.invalidateQueries(['po', id]); },
    onError: (e) => toast.error(e.response?.data?.error?.message || 'Failed'),
  });

  const downloadPdf = async () => {
    try {
      const res = await poApi.downloadPdf(id);
      const url = URL.createObjectURL(new Blob([res.data], { type: 'application/pdf' }));
      const a = document.createElement('a'); a.href = url;
      a.download = `PO-${po.po_number}.pdf`; a.click();
      URL.revokeObjectURL(url);
    } catch { toast.error('Download failed'); }
  };

  const sendMessage = async () => {
    if (!msgBody.trim()) return;
    setSendingMsg(true);
    try {
      await api.post(`/purchase-orders/${id}/messages`, { body: msgBody.trim() });
      setMsgBody('');
      refetchMsgs();
      toast.success('Message sent to vendor');
    } catch { toast.error('Failed to send message'); }
    finally { setSendingMsg(false); }
  };

  if (isLoading) return <PageLoader />;
  if (!po) return <div className="card text-gray-500">PO not found</div>;

  const steps = ['draft', 'sent', 'partially_received', 'received', 'closed'];
  const currentStep = steps.indexOf(po.status);

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2 text-sm text-gray-500">
        <Link to="/purchase-orders" className="hover:text-brand-600">Purchase Orders</Link>
        <span>/</span>
        <span className="text-gray-900 font-medium">{po.po_number}</span>
      </div>

      <div className="card">
        <div className="flex items-start justify-between flex-wrap gap-3 mb-4">
          <div>
            <h1 className="mb-1">{po.po_number}</h1>
            <p className="text-sm text-gray-500">
              Vendor: <strong>{po.Vendor?.name}</strong> · {po.Vendor?.email}
            </p>
          </div>
          <div className="flex gap-2">
            <button className="btn-secondary flex items-center gap-2" onClick={downloadPdf}>
              <Download className="w-4 h-4" /> PDF
            </button>
            {['draft', 'approved'].includes(po.status) && (
              <button className="btn-primary flex items-center gap-2"
                onClick={() => sendMutation.mutate()} disabled={sendMutation.isPending}>
                <Send className="w-4 h-4" />
                {sendMutation.isPending ? 'Sending…' : 'Send to Vendor'}
              </button>
            )}
          </div>
        </div>

        {/* Status timeline */}
        <div className="flex items-center gap-2 mb-6 overflow-x-auto pb-1">
          {steps.map((s, i) => (
            <React.Fragment key={s}>
              <div className={`flex flex-col items-center shrink-0 ${i <= currentStep ? 'text-brand-600' : 'text-gray-300'}`}>
                <div className={`w-7 h-7 rounded-full border-2 flex items-center justify-center text-xs font-bold
                  ${i < currentStep ? 'bg-brand-600 border-brand-600 text-white'
                    : i === currentStep ? 'border-brand-600 text-brand-600'
                    : 'border-gray-200 text-gray-300'}`}>
                  {i < currentStep ? '✓' : i + 1}
                </div>
                <span className="text-xs mt-1 capitalize whitespace-nowrap">{s.replace(/_/g, ' ')}</span>
              </div>
              {i < steps.length - 1 && (
                <div className={`flex-1 h-0.5 min-w-4 ${i < currentStep ? 'bg-brand-500' : 'bg-gray-200'}`} />
              )}
            </React.Fragment>
          ))}
        </div>

        {/* Metadata */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm mb-4 pb-4 border-b border-gray-100">
          <div><p className="text-xs text-gray-400">Expected Delivery</p><p className="font-medium">{po.expected_delivery_date || '—'}</p></div>
          <div><p className="text-xs text-gray-400">Delivery Location</p><p className="font-medium">{po.delivery_location || '—'}</p></div>
          <div><p className="text-xs text-gray-400">Total Amount</p><p className="font-bold text-brand-700">₹{Number(po.total_amount || 0).toLocaleString('en-IN')}</p></div>
          <div><p className="text-xs text-gray-400">Status</p><StatusBadge status={po.status} /></div>
        </div>

        {/* Line items */}
        <h2 className="text-sm font-semibold text-gray-500 uppercase mb-3">Line Items</h2>
        <table className="min-w-full divide-y divide-gray-100 border border-gray-200 rounded-lg">
          <thead className="bg-gray-50">
            <tr>
              <th className="table-th">Item</th>
              <th className="table-th">Qty Ordered</th>
              <th className="table-th">Qty Received</th>
              <th className="table-th">Unit Price</th>
              <th className="table-th">Total</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-50">
            {po.items?.map((it) => (
              <tr key={it.id}>
                <td className="table-td">{it.item_name}</td>
                <td className="table-td">{it.quantity}</td>
                <td className="table-td">
                  <span className={`font-medium ${
                    parseFloat(it.received_quantity) >= parseFloat(it.quantity) ? 'text-green-600'
                    : parseFloat(it.received_quantity) > 0 ? 'text-amber-600'
                    : 'text-gray-400'}`}>
                    {it.received_quantity || 0}
                  </span>
                </td>
                <td className="table-td">₹{Number(it.unit_price || 0).toLocaleString('en-IN')}</td>
                <td className="table-td font-medium">₹{Number(it.total_price || 0).toLocaleString('en-IN')}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Message thread */}
      <div className="card">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-base flex items-center gap-2">
            <MessageSquare className="w-4 h-4 text-brand-600" /> Messages with Vendor
          </h2>
          <button onClick={() => refetchMsgs()} className="text-xs text-gray-400 hover:text-brand-600 flex items-center gap-1">
            <RefreshCw className="w-3 h-3" /> Refresh
          </button>
        </div>

        <div className="space-y-3 mb-4 max-h-80 overflow-y-auto">
          {messages.length === 0 ? (
            <p className="text-sm text-gray-400 text-center py-4">
              No messages yet. Send a message to {po.Vendor?.name} below.
            </p>
          ) : messages.map((m) => (
            <div key={m.id} className={`flex ${m.sender_type === 'company_user' ? 'justify-end' : 'justify-start'}`}>
              <div className={`max-w-sm rounded-xl px-4 py-2.5 text-sm ${
                m.is_system
                  ? 'bg-amber-50 border border-amber-200 text-amber-800 w-full max-w-none'
                  : m.sender_type === 'company_user'
                    ? 'bg-brand-600 text-white'
                    : 'bg-gray-100 text-gray-800'
              }`}>
                <p className="text-xs opacity-70 mb-1">
                  {m.sender_name} · {safeFormatDistanceToNow(m.created_at, { addSuffix: true })}
                  {m.is_system && ' · System'}
                </p>
                <p className="whitespace-pre-line">{m.body}</p>
              </div>
            </div>
          ))}
        </div>

        <div className="flex gap-2 border-t border-gray-100 pt-3">
          <textarea
            className="input flex-1 resize-none"
            rows={2}
            placeholder={`Send a message to ${po.Vendor?.name}…`}
            value={msgBody}
            onChange={(e) => setMsgBody(e.target.value)}
            onKeyDown={(e) => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); sendMessage(); } }}
          />
          <button
            className="btn-primary px-4 self-end flex items-center gap-1.5"
            onClick={sendMessage}
            disabled={!msgBody.trim() || sendingMsg}
          >
            <Send className="w-4 h-4" />
            {sendingMsg ? '…' : 'Send'}
          </button>
        </div>
        <p className="text-xs text-gray-400 mt-1">Press Enter to send · Shift+Enter for new line</p>
      </div>
    </div>
  );
}
