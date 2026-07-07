import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { ShoppingCart, Eye, EyeOff } from 'lucide-react';
import toast from 'react-hot-toast';
import api from '../api/client';
import { vendorPortalApi } from '../api/services';

const VENDOR_TOKEN_KEY = 'procureai_vendor_token';
const VENDOR_USER_KEY = 'procureai_vendor_user';

export default function VendorPortalSignupPage() {
  const navigate = useNavigate();
  const [form, setForm] = useState({
    name: '', email: '', password: '', phone: '', contact_person: '', gstin: '', categories: '',
  });
  const [showPw, setShowPw] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    if (form.password.length < 8) {
      setError('Password must be at least 8 characters');
      return;
    }
    setLoading(true);
    try {
      const payload = {
        ...form,
        categories: form.categories
          ? form.categories.split(',').map((c) => c.trim()).filter(Boolean)
          : [],
      };
      const { data } = await vendorPortalApi.signup(payload);
      localStorage.setItem(VENDOR_TOKEN_KEY, data.data.token);
      localStorage.setItem(VENDOR_USER_KEY, JSON.stringify(data.data.vendor));
      api.defaults.headers.common['Authorization'] = `Bearer ${data.data.token}`;
      toast.success('Account created — welcome to ProcureAI');
      navigate('/vendor-portal/profile');
    } catch (err) {
      setError(err.response?.data?.error?.message || 'Signup failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-brand-50 to-gray-100 px-4 py-10">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <div className="inline-flex items-center gap-2 mb-4">
            <div className="w-10 h-10 bg-brand-600 rounded-xl flex items-center justify-center">
              <ShoppingCart className="w-5 h-5 text-white" />
            </div>
            <span className="text-2xl font-bold text-gray-900">ProcureAI</span>
          </div>
          <h1 className="text-gray-700 text-base">Vendor Signup</h1>
          <p className="text-xs text-gray-400 mt-1">Create your own vendor portal account — no buyer sign-up required</p>
        </div>
        <div className="card">
          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 text-sm rounded-lg px-4 py-3 mb-4">{error}</div>
          )}
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="label">Vendor / company name</label>
              <input className="input" value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })} required />
            </div>
            <div>
              <label className="label">Email</label>
              <input className="input" type="email" value={form.email}
                onChange={(e) => setForm({ ...form, email: e.target.value })} required />
            </div>
            <div>
              <label className="label">Password</label>
              <div className="relative">
                <input className="input pr-10" type={showPw ? 'text' : 'password'} value={form.password}
                  onChange={(e) => setForm({ ...form, password: e.target.value })} minLength={8} required />
                <button type="button" className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400"
                  onClick={() => setShowPw(!showPw)}>
                  {showPw ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
              <p className="text-xs text-gray-400 mt-1">At least 8 characters</p>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="label">Contact person</label>
                <input className="input" value={form.contact_person}
                  onChange={(e) => setForm({ ...form, contact_person: e.target.value })} required />
              </div>
              <div>
                <label className="label">Phone</label>
                <input className="input" value={form.phone}
                  onChange={(e) => setForm({ ...form, phone: e.target.value })} required />
              </div>
            </div>
            <div>
              <label className="label">GSTIN (optional)</label>
              <input className="input" value={form.gstin}
                onChange={(e) => setForm({ ...form, gstin: e.target.value })} />
            </div>
            <div>
              <label className="label">Products / services you offer (optional)</label>
              <input className="input" placeholder="e.g. Steel pipes, Electrical fittings" value={form.categories}
                onChange={(e) => setForm({ ...form, categories: e.target.value })} />
              <p className="text-xs text-gray-400 mt-1">Comma-separated — you can refine this after logging in</p>
            </div>
            <button type="submit" disabled={loading} className="btn-primary w-full">
              {loading ? 'Creating account…' : 'Create vendor account'}
            </button>
          </form>
          <p className="text-center text-xs text-gray-400 mt-4">
            Already have an account? <Link to="/vendor-portal/login" className="text-brand-600 hover:underline">Sign in</Link>
          </p>
        </div>
      </div>
    </div>
  );
}
