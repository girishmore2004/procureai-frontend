import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { ShoppingCart, ArrowLeft, Mail } from 'lucide-react';

// Lightweight stub — intentionally does NOT implement a real reset-token
// flow yet. It exists so the "Forgot password" link on the vendor login
// page goes somewhere useful instead of being a dangling link. It does not
// call any backend endpoint or issue a reset token.
export default function VendorForgotPasswordPage() {
  const [email, setEmail] = useState('');
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    setSubmitted(true);
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
          <h1 className="text-gray-700 text-base">Vendor Password Help</h1>
        </div>
        <div className="card">
          {submitted ? (
            <div className="text-center py-4">
              <Mail className="w-8 h-8 text-brand-600 mx-auto mb-3" />
              <p className="text-sm text-gray-700">
                Thanks — we've noted your request for <span className="font-medium">{email}</span>.
              </p>
              <p className="text-xs text-gray-400 mt-2">
                Automated password reset isn't available yet. Please contact your account
                administrator, or email <a href="mailto:support@procureai.app" className="text-brand-600 hover:underline">support@procureai.app</a> to
                have your password reset manually.
              </p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              <p className="text-sm text-gray-500">
                Enter the email on your vendor account and we'll note your request.
                Automated reset links aren't available yet — support will follow up.
              </p>
              <div>
                <label className="label">Email</label>
                <input className="input" type="email" value={email}
                  onChange={(e) => setEmail(e.target.value)} required />
              </div>
              <button type="submit" className="btn-primary w-full">Submit request</button>
            </form>
          )}
          <div className="flex items-center justify-between mt-4 pt-4 border-t border-gray-100 text-xs text-gray-500">
            <Link to="/vendor-portal/login" className="flex items-center gap-1 hover:text-brand-600">
              <ArrowLeft className="w-3 h-3" /> Back to vendor login
            </Link>
            <Link to="/" className="hover:text-brand-600">Home</Link>
          </div>
        </div>
      </div>
    </div>
  );
}
