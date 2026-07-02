import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { companyApi } from '../api/services';
import toast from 'react-hot-toast';
import { ShoppingCart, CheckCircle } from 'lucide-react';

export function SignupPage() {
  const navigate = useNavigate();
  const [form, setForm] = useState({ company_name: '', industry: '', admin_name: '', admin_email: '', admin_password: '' });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      await companyApi.signup(form);
      toast.success('Account created! Please sign in.');
      navigate('/login');
    } catch (err) {
      setError(err.response?.data?.error?.message || 'Signup failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-brand-50 to-gray-100 px-4 py-8">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <div className="inline-flex items-center gap-2 mb-4">
            <div className="w-10 h-10 bg-brand-600 rounded-xl flex items-center justify-center">
              <ShoppingCart className="w-5 h-5 text-white" />
            </div>
            <span className="text-2xl font-bold text-gray-900">ProcureAI</span>
          </div>
          <h1 className="text-gray-700">Create your company account</h1>
        </div>
        <div className="card">
          {error && <div className="bg-red-50 border border-red-200 text-red-700 text-sm rounded-lg px-4 py-3 mb-4">{error}</div>}
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="label">Company Name <span className="text-red-500">*</span></label>
              <input className="input" value={form.company_name} onChange={(e) => setForm({ ...form, company_name: e.target.value })} required />
            </div>
            <div>
              <label className="label">Industry</label>
              <select className="input" value={form.industry} onChange={(e) => setForm({ ...form, industry: e.target.value })}>
                <option value="">Select…</option>
                {['Construction', 'Manufacturing', 'Distribution', 'Retail', 'Hospitality', 'Healthcare', 'Other'].map((i) => <option key={i}>{i}</option>)}
              </select>
            </div>
            <div className="border-t border-gray-200 pt-4">
              <p className="text-xs font-semibold text-gray-500 uppercase mb-3">Admin Account</p>
              <div className="space-y-3">
                <div>
                  <label className="label">Your Name</label>
                  <input className="input" value={form.admin_name} onChange={(e) => setForm({ ...form, admin_name: e.target.value })} />
                </div>
                <div>
                  <label className="label">Email <span className="text-red-500">*</span></label>
                  <input className="input" type="email" value={form.admin_email} onChange={(e) => setForm({ ...form, admin_email: e.target.value })} required />
                </div>
                <div>
                  <label className="label">Password <span className="text-red-500">*</span></label>
                  <input className="input" type="password" minLength={8} value={form.admin_password} onChange={(e) => setForm({ ...form, admin_password: e.target.value })} required />
                </div>
              </div>
            </div>
            <button type="submit" disabled={loading} className="btn-primary w-full">{loading ? 'Creating…' : 'Create Account'}</button>
          </form>
          <p className="text-center text-sm text-gray-500 mt-4">Already have an account? <Link to="/login" className="text-brand-600 hover:underline">Sign in</Link></p>
        </div>
      </div>
    </div>
  );
}

export default SignupPage;
