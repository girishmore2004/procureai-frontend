import React, { useState, useEffect } from 'react';
import { VendorPortalLayout } from './VendorPortalDashboard';
import api from '../api/client';
import toast from 'react-hot-toast';

export default function VendorPortalProfilePage() {
  const [profile, setProfile] = useState(null);
  const [form, setForm] = useState({});
  const [pwForm, setPwForm] = useState({ current_password: '', new_password: '', confirm: '' });
  const [saving, setSaving] = useState(false);
  const [savingPw, setSavingPw] = useState(false);

  useEffect(() => {
    api.get('/vendor-portal/me').then((r) => {
      setProfile(r.data.data);
      const { id, portal_status, rating, ...editable } = r.data.data;
      setForm(editable);
    }).catch(() => toast.error('Failed to load profile'));
  }, []);

  const handleSave = async () => {
    setSaving(true);
    try {
      await api.patch('/vendor-portal/me', form);
      toast.success('Profile updated');
    } catch (e) {
      toast.error(e.response?.data?.error?.message || 'Save failed');
    } finally { setSaving(false); }
  };

  const handlePwChange = async () => {
    if (pwForm.new_password !== pwForm.confirm) return toast.error('Passwords do not match');
    if (pwForm.new_password.length < 8) return toast.error('Password must be at least 8 characters');
    setSavingPw(true);
    try {
      await api.patch('/vendor-portal/change-password', {
        current_password: pwForm.current_password,
        new_password: pwForm.new_password,
      });
      toast.success('Password changed');
      setPwForm({ current_password: '', new_password: '', confirm: '' });
    } catch (e) {
      toast.error(e.response?.data?.error?.message || 'Failed');
    } finally { setSavingPw(false); }
  };

  const fields = [
    { key: 'name', label: 'Company Name', required: true },
    { key: 'legal_name', label: 'Legal Name' },
    { key: 'contact_person', label: 'Contact Person' },
    { key: 'phone', label: 'Phone' },
    { key: 'whatsapp_number', label: 'WhatsApp Number' },
    { key: 'gstin', label: 'GSTIN' },
    { key: 'payment_terms', label: 'Payment Terms', placeholder: 'e.g. Net 30' },
    { key: 'lead_time_days', label: 'Lead Time (days)', type: 'number' },
    { key: 'moq', label: 'Minimum Order Qty', type: 'number' },
  ];

  return (
    <VendorPortalLayout title="My Profile">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Profile form */}
        <div className="card">
          <h2 className="font-semibold mb-4">Company Details</h2>
          <div className="space-y-3">
            {fields.map(({ key, label, type, placeholder, required }) => (
              <div key={key}>
                <label className="label">{label}{required && <span className="text-red-500 ml-0.5">*</span>}</label>
                <input className="input" type={type || 'text'} placeholder={placeholder}
                  value={form[key] || ''} onChange={(e) => setForm({ ...form, [key]: e.target.value })} />
              </div>
            ))}
          </div>
          <button className="btn-primary mt-4 w-full" onClick={handleSave} disabled={saving}>
            {saving ? 'Saving…' : 'Save Profile'}
          </button>
        </div>

        {/* Password change */}
        <div className="card">
          <h2 className="font-semibold mb-4">Change Password</h2>
          <div className="space-y-3">
            <div>
              <label className="label">Current Password</label>
              <input className="input" type="password" value={pwForm.current_password}
                onChange={(e) => setPwForm({ ...pwForm, current_password: e.target.value })} />
            </div>
            <div>
              <label className="label">New Password</label>
              <input className="input" type="password" value={pwForm.new_password}
                onChange={(e) => setPwForm({ ...pwForm, new_password: e.target.value })} />
            </div>
            <div>
              <label className="label">Confirm New Password</label>
              <input className="input" type="password" value={pwForm.confirm}
                onChange={(e) => setPwForm({ ...pwForm, confirm: e.target.value })} />
            </div>
          </div>
          <button className="btn-primary mt-4 w-full" onClick={handlePwChange} disabled={savingPw}>
            {savingPw ? 'Updating…' : 'Change Password'}
          </button>
        </div>
      </div>
    </VendorPortalLayout>
  );
}
