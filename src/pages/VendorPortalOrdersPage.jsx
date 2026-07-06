import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { VendorPortalLayout } from './VendorPortalDashboard';
import api from '../api/client';
import { StatusBadge } from '../components/ui';
import { MessageSquare, Send, RefreshCw, Package } from 'lucide-react';
import toast from 'react-hot-toast';
import { safeFormatDistanceToNow } from '../utils/date';

export default function VendorPortalOrdersPage() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selected, setSelected] = useState(null);
  const [messages, setMessages] = useState([]);
  const [msgBody, setMsgBody] = useState('');
  const [sending, setSending] = useState(false);

  const loadOrders = () => {
    setLoading(true);
    api.get('/vendor-portal/orders')
      .then((r) => setOrders(r.data.data))
      .catch(() => toast.error('Failed to load orders'))
      .finally(() => setLoading(false));
  };

  useEffect(() => { loadOrders(); }, []);

  const loadMessages = (orderId) => {
    api.get(`/vendor-portal/orders/${orderId}/messages`)
      .then((r) => setMessages(r.data.data))
      .catch(() => {});
  };

  const selectOrder = (order) => {
    setSelected(order);
    loadMessages(order.id);
  };

  const sendReply = async () => {
    if (!msgBody.trim() || !selected) return;
    setSending(true);
    try {
      await api.post(`/vendor-portal/orders/${selected.id}/messages`, { body: msgBody.trim() });
      setMsgBody('');
      loadMessages(selected.id);
      toast.success('Reply sent');
    } catch { toast.error('Failed to send'); }
    finally { setSending(false); }
  };

  return (
    <VendorPortalLayout title="My Orders">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4" style={{ minHeight: 480 }}>
        {/* Order list */}
        <div className="md:col-span-1 card overflow-y-auto" style={{ maxHeight: 600 }}>
          <div className="flex items-center justify-between mb-3">
            <p className="text-sm font-semibold text-gray-700">Purchase Orders</p>
            <button onClick={loadOrders} className="text-xs text-gray-400 hover:text-brand-600">
              <RefreshCw className="w-3.5 h-3.5" />
            </button>
          </div>
          {loading ? (
            <p className="text-sm text-gray-400 text-center py-4">Loading…</p>
          ) : orders.length === 0 ? (
            <div className="text-center py-8">
              <Package className="w-10 h-10 text-gray-300 mx-auto mb-2" />
              <p className="text-sm text-gray-400">No orders yet</p>
            </div>
          ) : orders.map((o) => (
            <button key={o.id} onClick={() => selectOrder(o)}
              className={`w-full text-left p-3 rounded-lg border mb-2 transition
                ${selected?.id === o.id ? 'border-brand-400 bg-brand-50' : 'border-gray-100 hover:bg-gray-50'}`}>
              <div className="flex justify-between items-start">
                <p className="text-sm font-semibold text-gray-800">{o.po_number}</p>
                <StatusBadge status={o.status} />
              </div>
              <p className="text-xs text-gray-500 mt-0.5">
                ₹{Number(o.total_amount || 0).toLocaleString('en-IN')} ·{' '}
                {safeFormatDistanceToNow(o.created_at, { addSuffix: true })}
              </p>
              {o.message_count > 0 && (
                <p className="text-xs text-brand-600 mt-1 flex items-center gap-1">
                  <MessageSquare className="w-3 h-3" /> {o.message_count} message{o.message_count > 1 ? 's' : ''}
                </p>
              )}
            </button>
          ))}
        </div>

        {/* Order detail + messages */}
        <div className="md:col-span-2">
          {!selected ? (
            <div className="card h-full flex items-center justify-center text-center">
              <div>
                <Package className="w-12 h-12 text-gray-300 mx-auto mb-3" />
                <p className="text-gray-500 font-medium">Select an order to view details and messages</p>
              </div>
            </div>
          ) : (
            <div className="card flex flex-col" style={{ minHeight: 540 }}>
              <div className="mb-4 pb-4 border-b border-gray-100">
                <div className="flex items-center justify-between mb-2">
                  <h2 className="font-semibold text-gray-800">{selected.po_number}</h2>
                  <StatusBadge status={selected.status} />
                </div>
                <div className="grid grid-cols-2 gap-3 text-sm">
                  <div><p className="text-xs text-gray-400">Total Amount</p><p className="font-bold text-brand-700">₹{Number(selected.total_amount || 0).toLocaleString('en-IN')}</p></div>
                  <div><p className="text-xs text-gray-400">Expected Delivery</p><p className="font-medium">{selected.expected_delivery_date || '—'}</p></div>
                </div>
                {selected.items?.length > 0 && (
                  <div className="mt-3">
                    <p className="text-xs text-gray-500 font-semibold uppercase mb-1">Items</p>
                    {selected.items.map((it) => (
                      <div key={it.id} className="flex justify-between text-xs py-1 border-b border-gray-50">
                        <span className="text-gray-700">{it.item_name}</span>
                        <span className="text-gray-500">Qty: {it.quantity} · ₹{Number(it.unit_price || 0).toLocaleString('en-IN')}</span>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Messages */}
              <div className="flex-1 overflow-y-auto space-y-2 mb-3" style={{ maxHeight: 280 }}>
                <p className="text-xs font-semibold text-gray-500 uppercase">Messages</p>
                {messages.length === 0 ? (
                  <p className="text-sm text-gray-400 text-center py-4">No messages yet</p>
                ) : messages.map((m) => (
                  <div key={m.id} className={`flex ${m.sender_type === 'vendor' ? 'justify-end' : 'justify-start'}`}>
                    <div className={`max-w-xs rounded-xl px-3 py-2 text-sm ${
                      m.is_system ? 'bg-amber-50 border border-amber-200 text-amber-800 max-w-none w-full'
                      : m.sender_type === 'vendor' ? 'bg-brand-600 text-white'
                      : 'bg-gray-100 text-gray-800'
                    }`}>
                      <p className="text-xs opacity-70 mb-0.5">
                        {m.sender_name} · {safeFormatDistanceToNow(m.created_at, { addSuffix: true })}
                      </p>
                      <p className="whitespace-pre-line">{m.body}</p>
                    </div>
                  </div>
                ))}
              </div>

              {/* Reply */}
              <div className="flex gap-2 border-t border-gray-100 pt-3">
                <textarea className="input flex-1 resize-none" rows={2}
                  placeholder="Reply to buyer…"
                  value={msgBody}
                  onChange={(e) => setMsgBody(e.target.value)}
                  onKeyDown={(e) => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); sendReply(); } }}
                />
                <button className="btn-primary px-4 self-end flex items-center gap-1.5"
                  onClick={sendReply} disabled={!msgBody.trim() || sending}>
                  <Send className="w-4 h-4" />{sending ? '…' : 'Reply'}
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </VendorPortalLayout>
  );
}
