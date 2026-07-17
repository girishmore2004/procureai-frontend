import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import api from '../api/client';
import { Package, User, LogOut, ShoppingCart, Star, Clock, FileText, AlertCircle } from 'lucide-react';
import toast from 'react-hot-toast';

const VENDOR_TOKEN_KEY = 'procureai_vendor_token';
const VENDOR_USER_KEY = 'procureai_vendor_user';

export function useVendorAuth() {
  const navigate = useNavigate();
  const [vendor, setVendor] = useState(null);

  useEffect(() => {
    const token = localStorage.getItem(VENDOR_TOKEN_KEY);
    const stored = localStorage.getItem(VENDOR_USER_KEY);
    if (!token || !stored) { navigate('/vendor-portal/login'); return; }
    api.defaults.headers.common['Authorization'] = `Bearer ${token}`;
    setVendor(JSON.parse(stored));
  }, []);

  const logout = () => {
    localStorage.removeItem(VENDOR_TOKEN_KEY);
    localStorage.removeItem(VENDOR_USER_KEY);
    delete api.defaults.headers.common['Authorization'];
    navigate('/vendor-portal/login');
  };

  return { vendor, logout };
}

export function VendorPortalLayout({ children, title }) {
  const { vendor, logout } = useVendorAuth();

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Top nav */}
      <nav className="bg-white border-b border-gray-200 px-6 py-3 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 bg-brand-600 rounded-lg flex items-center justify-center">
            <ShoppingCart className="w-4 h-4 text-white" />
          </div>
          <span className="font-bold text-gray-900">ProcureAI Vendor Portal</span>
        </div>
        <div className="flex items-center gap-4">
          <Link to="/vendor-portal/dashboard" className="text-sm text-gray-600 hover:text-brand-600">Dashboard</Link>
          <Link to="/vendor-portal/catalog" className="text-sm text-gray-600 hover:text-brand-600">My Catalog</Link>
          <Link to="/vendor-portal/orders" className="text-sm text-gray-600 hover:text-brand-600">My Orders</Link>
          <Link to="/vendor-portal/payments" className="text-sm text-gray-600 hover:text-brand-600">Payments</Link>
          <Link to="/vendor-portal/profile" className="text-sm text-gray-600 hover:text-brand-600">Profile</Link>
          <button onClick={logout} className="flex items-center gap-1 text-sm text-red-500 hover:text-red-700">
            <LogOut className="w-4 h-4" /> Sign out
          </button>
        </div>
      </nav>

      <main className="max-w-5xl mx-auto px-4 py-6">
        {title && <h1 className="text-2xl font-bold text-gray-900 mb-6">{title}</h1>}
        {children}
      </main>
    </div>
  );
}

export default function VendorPortalDashboard() {
  const { vendor } = useVendorAuth();
  const [me, setMe] = useState(null);
  const [catalog, setCatalog] = useState([]);
  const [quoteRequests, setQuoteRequests] = useState([]);

  useEffect(() => {
    api.get('/vendor-portal/me').then((r) => setMe(r.data.data)).catch(() => {});
    api.get('/vendor-portal/catalog').then((r) => setCatalog(r.data.data)).catch(() => {});
    api.get('/vendor-portal/quote-requests').then((r) => setQuoteRequests(r.data.data)).catch(() => {});
  }, []);

  // Not yet responded to — this is the actionable "task" list. Already-
  // submitted ones just aren't shown here (they're in the pipeline, nothing
  // for the vendor to do until the buyer selects/PO's them).
  const pending = quoteRequests.filter((q) => q.status !== 'responded');

  return (
    <VendorPortalLayout title={`Welcome, ${me?.contact_person || me?.name || '…'}`}>
      {pending.length > 0 && (
        <div className="card mb-6 border-l-4 border-l-amber-400">
          <h2 className="font-semibold mb-3 flex items-center gap-2">
            <AlertCircle className="w-4 h-4 text-amber-500" /> Pending Quote Requests ({pending.length})
          </h2>
          <div className="space-y-2">
            {pending.map((q) => (
              <a
                key={q.rfq_vendor_id}
                href={`/vendor/quote/${q.access_token}`}
                className="flex items-center justify-between gap-3 p-3 rounded-lg border border-amber-100 bg-amber-50 hover:bg-amber-100 transition"
              >
                <div className="min-w-0">
                  <p className="text-sm font-medium text-gray-800">{q.rfq_number} — {q.item_count} item{q.item_count === 1 ? '' : 's'}</p>
                  <p className="text-xs text-gray-500 truncate">{q.item_summary}{q.item_count > 3 ? '…' : ''}</p>
                  <p className="text-xs text-gray-400 mt-0.5">
                    Deadline: {q.deadline ? new Date(q.deadline).toLocaleDateString('en-IN') : '—'}
                  </p>
                </div>
                <span className="btn-primary text-xs px-3 py-1.5 shrink-0">Fill Quote</span>
              </a>
            ))}
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <div className="card flex items-center gap-4">
          <div className="p-3 bg-brand-50 rounded-lg"><Package className="w-5 h-5 text-brand-600" /></div>
          <div>
            <p className="text-xs text-gray-500">Catalog Items</p>
            <p className="text-2xl font-bold">{catalog.length}</p>
          </div>
        </div>
        <div className="card flex items-center gap-4">
          <div className="p-3 bg-amber-50 rounded-lg"><Star className="w-5 h-5 text-amber-500" /></div>
          <div>
            <p className="text-xs text-gray-500">Rating</p>
            <p className="text-2xl font-bold">{me?.rating ? `${Number(me.rating).toFixed(1)}/10` : '—'}</p>
          </div>
        </div>
        <div className="card flex items-center gap-4">
          <div className="p-3 bg-green-50 rounded-lg"><Clock className="w-5 h-5 text-green-600" /></div>
          <div>
            <p className="text-xs text-gray-500">Lead Time</p>
            <p className="text-2xl font-bold">{me?.lead_time_days ? `${me.lead_time_days}d` : '—'}</p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="card">
          <h2 className="font-semibold mb-3">Quick Actions</h2>
          <div className="space-y-2">
            <Link to="/vendor-portal/catalog" className="flex items-center gap-2 p-3 rounded-lg border border-gray-100 hover:bg-gray-50 text-sm font-medium">
              <Package className="w-4 h-4 text-brand-600" /> Manage My Catalog
            </Link>
            <Link to="/vendor-portal/orders" className="flex items-center gap-2 p-3 rounded-lg border border-gray-100 hover:bg-gray-50 text-sm font-medium">
              <Package className="w-4 h-4 text-brand-600" /> View My Orders & Messages
            </Link>
            <Link to="/vendor-portal/payments" className="flex items-center gap-2 p-3 rounded-lg border border-gray-100 hover:bg-gray-50 text-sm font-medium">
              <Clock className="w-4 h-4 text-brand-600" /> View Payment History
            </Link>
            <Link to="/vendor-portal/profile" className="flex items-center gap-2 p-3 rounded-lg border border-gray-100 hover:bg-gray-50 text-sm font-medium">
              <User className="w-4 h-4 text-brand-600" /> Update My Profile
            </Link>
          </div>
        </div>
        <div className="card">
          <h2 className="font-semibold mb-3">My Profile Summary</h2>
          <dl className="space-y-2 text-sm">
            {[
              ['Company', me?.name],
              ['Contact', me?.contact_person],
              ['Phone', me?.phone],
              ['GSTIN', me?.gstin],
              ['Payment Terms', me?.payment_terms],
              ['Categories', me?.categories?.join(', ')],
            ].map(([k, v]) => v ? (
              <div key={k} className="flex justify-between">
                <dt className="text-gray-500">{k}</dt>
                <dd className="font-medium text-right max-w-xs truncate">{v}</dd>
              </div>
            ) : null)}
          </dl>
        </div>
      </div>
    </VendorPortalLayout>
  );
}
