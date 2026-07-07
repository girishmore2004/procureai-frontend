import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { ShoppingCart, Eye, EyeOff, ArrowLeft } from 'lucide-react';
import toast from 'react-hot-toast';
import api from '../api/client';

const VENDOR_TOKEN_KEY = 'procureai_vendor_token';
const VENDOR_USER_KEY = 'procureai_vendor_user';

export default function VendorPortalLoginPage() {
  const navigate = useNavigate();
  const [form, setForm] = useState({ email: '', password: '' });
  const [showPw, setShowPw] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const { data } = await api.post('/vendor-portal/login', form);
      localStorage.setItem(VENDOR_TOKEN_KEY, data.data.token);
      localStorage.setItem(VENDOR_USER_KEY, JSON.stringify(data.data.vendor));
      api.defaults.headers.common['Authorization'] = `Bearer ${data.data.token}`;
      navigate('/vendor-portal/dashboard');
    } catch (err) {
      setError(err.response?.data?.error?.message || 'Login failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-brand-50 to-gray-100 px-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <div className="inline-flex items-center gap-2 mb-4">
            <div className="w-10 h-10 bg-brand-600 rounded-xl flex items-center justify-center">
              <ShoppingCart className="w-5 h-5 text-white" />
            </div>
            <span className="text-2xl font-bold text-gray-900">ProcureAI</span>
          </div>
          <h1 className="text-gray-700 text-base">Vendor Portal Login</h1>
          <p className="text-xs text-gray-400 mt-1">Sign in with your vendor portal account</p>
        </div>
        <div className="card">
          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 text-sm rounded-lg px-4 py-3 mb-4">{error}</div>
          )}
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="label">Email</label>
              <input className="input" type="email" value={form.email}
                onChange={(e) => setForm({ ...form, email: e.target.value })} required />
            </div>
            <div>
              <label className="label">Password</label>
              <div className="relative">
                <input className="input pr-10" type={showPw ? 'text' : 'password'} value={form.password}
                  onChange={(e) => setForm({ ...form, password: e.target.value })} required />
                <button type="button" className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400"
                  onClick={() => setShowPw(!showPw)}>
                  {showPw ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
              <div className="flex justify-end mt-1">
                <Link to="/vendor-portal/forgot-password" className="text-xs text-brand-600 hover:underline">Forgot password?</Link>
              </div>
            </div>
            <button type="submit" disabled={loading} className="btn-primary w-full">
              {loading ? 'Signing in…' : 'Sign in to Vendor Portal'}
            </button>
          </form>
          <p className="text-center text-xs text-gray-400 mt-4">
            New vendor? <Link to="/vendor-portal/signup" className="text-brand-600 hover:underline">Create an account</Link>
          </p>
          <div className="flex items-center justify-between mt-4 pt-4 border-t border-gray-100 text-xs text-gray-500">
            <Link to="/" className="flex items-center gap-1 hover:text-brand-600">
              <ArrowLeft className="w-3 h-3" /> Back to home
            </Link>
            <Link to="/login" className="hover:text-brand-600">Buyer login</Link>
          </div>
        </div>
      </div>
    </div>
  );
}
