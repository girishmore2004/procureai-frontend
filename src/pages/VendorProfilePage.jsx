// VendorProfilePage.jsx
import React, { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { vendorsApi } from '../api/services';
import { StatusBadge, PageLoader, StatCard } from '../components/ui';
import { Star, Phone, Mail, MapPin, FileText } from 'lucide-react';
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';

export default function VendorProfilePage() {
  const { id } = useParams();
  const [tab, setTab] = useState('overview');

  const { data: vendor, isLoading } = useQuery({
    queryKey: ['vendor', id],
    queryFn: () => vendorsApi.getOne(id).then((r) => r.data.data),
  });

  const { data: scores } = useQuery({
    queryKey: ['vendor-scores', id],
    queryFn: () => vendorsApi.getScores(id).then((r) => r.data.data),
  });

  if (isLoading) return <PageLoader />;
  if (!vendor) return <div className="card"><p className="text-gray-500">Vendor not found</p></div>;

  const TABS = ['overview', 'documents', 'history', 'score'];

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2 text-sm text-gray-500">
        <Link to="/vendors" className="hover:text-brand-600">Vendors</Link>
        <span>/</span>
        <span className="text-gray-900 font-medium">{vendor.name}</span>
      </div>

      <div className="card">
        <div className="flex items-start justify-between flex-wrap gap-4">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <h1>{vendor.name}</h1>
              {vendor.preferred && <span className="badge-amber flex items-center gap-1"><Star className="w-3 h-3" /> Preferred</span>}
              <StatusBadge status={vendor.status} />
            </div>
            <p className="text-sm text-gray-500">{vendor.legal_name} · Code: {vendor.vendor_code}</p>
          </div>
          <div className="text-right">
            {vendor.rating && <div className="text-3xl font-bold text-amber-500">{Number(vendor.rating).toFixed(1)}<span className="text-lg text-gray-400">/10</span></div>}
            <p className="text-xs text-gray-400">Overall Score</p>
          </div>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-4 pt-4 border-t border-gray-100">
          <div className="flex items-center gap-2 text-sm"><Mail className="w-4 h-4 text-gray-400" />{vendor.email || '—'}</div>
          <div className="flex items-center gap-2 text-sm"><Phone className="w-4 h-4 text-gray-400" />{vendor.phone || '—'}</div>
          <div className="flex items-center gap-2 text-sm"><FileText className="w-4 h-4 text-gray-400" />GSTIN: {vendor.gstin || '—'}</div>
          <div className="text-sm text-gray-600">Lead: {vendor.lead_time_days ? `${vendor.lead_time_days} days` : '—'} · Terms: {vendor.payment_terms || '—'}</div>
        </div>
      </div>

      <div className="flex gap-2 border-b border-gray-200 pb-0">
        {TABS.map((t) => <button key={t} onClick={() => setTab(t)} className={`px-4 py-2 text-sm font-medium capitalize border-b-2 transition ${tab === t ? 'border-brand-600 text-brand-600' : 'border-transparent text-gray-500 hover:text-gray-700'}`}>{t}</button>)}
      </div>

      {tab === 'overview' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="card">
            <h2 className="text-base mb-3">Details</h2>
            <dl className="space-y-2 text-sm">
              {[['Categories', vendor.categories?.join(', ')], ['Contact Person', vendor.contact_person], ['WhatsApp', vendor.whatsapp_number], ['MOQ', vendor.moq], ['Notes', vendor.notes]].map(([k, v]) => v ? <div key={k} className="flex justify-between"><dt className="text-gray-500">{k}</dt><dd className="font-medium text-right">{String(v)}</dd></div> : null)}
            </dl>
          </div>
          <div className="card">
            <h2 className="text-base mb-3">Recent Orders</h2>
            {vendor.recent_orders?.length ? vendor.recent_orders.map((po) => (
              <div key={po.id} className="flex justify-between text-sm py-1.5 border-b border-gray-50 last:border-0">
                <Link to={`/purchase-orders/${po.id}`} className="text-brand-600 hover:underline">{po.po_number}</Link>
                <div className="flex items-center gap-2"><span>₹{Number(po.total_amount).toLocaleString('en-IN')}</span><StatusBadge status={po.status} /></div>
              </div>
            )) : <p className="text-sm text-gray-400">No orders yet</p>}
          </div>
        </div>
      )}

      {tab === 'score' && (
        <div className="card">
          <h2 className="text-base mb-4">Score History (last 12 months)</h2>
          {scores?.length ? (
            <ResponsiveContainer width="100%" height={250}>
              <LineChart data={[...scores].reverse()}>
                <XAxis dataKey="period" tickFormatter={(d) => d?.slice(0, 7)} tick={{ fontSize: 11 }} />
                <YAxis domain={[0, 10]} tick={{ fontSize: 11 }} />
                <Tooltip />
                <Line type="monotone" dataKey="overall_score" stroke="#2563eb" strokeWidth={2} name="Overall" />
                <Line type="monotone" dataKey="delivery_reliability" stroke="#10b981" strokeWidth={1.5} name="Delivery" />
                <Line type="monotone" dataKey="response_time_score" stroke="#f59e0b" strokeWidth={1.5} name="Response" />
              </LineChart>
            </ResponsiveContainer>
          ) : <p className="text-sm text-gray-400">No score data yet. Scores are computed after transactions.</p>}
        </div>
      )}

      {tab === 'documents' && (
        <div className="card">
          <h2 className="text-base mb-4">Documents</h2>
          {vendor.VendorDocuments?.length ? vendor.VendorDocuments.map((d) => (
            <div key={d.id} className="flex justify-between items-center py-2 border-b border-gray-100">
              <span className="text-sm capitalize">{d.type}</span>
              <a href={d.file_url} target="_blank" rel="noopener noreferrer" className="text-xs text-brand-600 hover:underline">View</a>
            </div>
          )) : <p className="text-sm text-gray-400">No documents uploaded</p>}
        </div>
      )}
    </div>
  );
}
