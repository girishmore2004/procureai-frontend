import React, { useState, useEffect } from 'react';
import { VendorPortalLayout } from './VendorPortalDashboard';
import api from '../api/client';
import { vendorPortalApi } from '../api/services';
import toast from 'react-hot-toast';
import { Upload, FileText, Trash2 } from 'lucide-react';

export default function VendorPortalProfilePage() {
  const [profile, setProfile] = useState(null);
  const [form, setForm] = useState({});
  const [categoriesInput, setCategoriesInput] = useState('');
  const [pwForm, setPwForm] = useState({ current_password: '', new_password: '', confirm: '' });
  const [saving, setSaving] = useState(false);
  const [savingPw, setSavingPw] = useState(false);
  const [documents, setDocuments] = useState([]);
  const [uploading, setUploading] = useState(false);

  const loadProfile = () => {
    api.get('/vendor-portal/me').then((r) => {
      setProfile(r.data.data);
      const { id, portal_status, rating, company_id, profile_completeness, ...editable } = r.data.data;
      setForm(editable);
      setCategoriesInput((r.data.data.categories || []).join(', '));
    }).catch(() => toast.error('Failed to load profile'));
  };

  const loadDocuments = () => {
    vendorPortalApi.listDocuments().then((r) => setDocuments(r.data.data)).catch(() => {});
  };

  useEffect(() => {
    loadProfile();
    loadDocuments();
  }, []);

  const handleSave = async () => {
    setSaving(true);
    try {
      const payload = {
        ...form,
        categories: categoriesInput.split(',').map((c) => c.trim()).filter(Boolean),
      };
      const { data } = await api.patch('/vendor-portal/me', payload);
      toast.success('Profile updated');
      loadProfile();
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

  const handleDocUpload = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploading(true);
    try {
      await vendorPortalApi.uploadDocument(file);
      toast.success('Document uploaded');
      loadDocuments();
    } catch (err) {
      toast.error(err.response?.data?.error?.message || 'Upload failed');
    } finally {
      setUploading(false);
      e.target.value = '';
    }
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
      {profile && (
        <div className="card mb-6 flex items-center gap-4">
          <div className="flex-1">
            <p className="text-xs text-gray-500 mb-1">Profile completeness</p>
            <div className="w-full bg-gray-100 rounded-full h-2">
              <div className="bg-brand-600 h-2 rounded-full transition-all"
                style={{ width: `${profile.profile_completeness || 0}%` }} />
            </div>
          </div>
          <span className="text-lg font-bold text-brand-600">{profile.profile_completeness || 0}%</span>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Profile form */}
        <div className="card">
          <h2 className="font-semibold mb-4">Business Details</h2>
          <div className="space-y-3">
            {fields.map(({ key, label, type, placeholder, required }) => (
              <div key={key}>
                <label className="label">{label}{required && <span className="text-red-500 ml-0.5">*</span>}</label>
                <input className="input" type={type || 'text'} placeholder={placeholder}
                  value={form[key] || ''} onChange={(e) => setForm({ ...form, [key]: e.target.value })} />
              </div>
            ))}
            <div>
              <label className="label">Address</label>
              <input className="input" placeholder="Street, city, state, PIN"
                value={form.address?.line1 || ''}
                onChange={(e) => setForm({ ...form, address: { ...(form.address || {}), line1: e.target.value } })} />
            </div>
            <div>
              <label className="label">Products / Services (categories)</label>
              <input className="input" placeholder="e.g. Steel pipes, Electrical fittings"
                value={categoriesInput} onChange={(e) => setCategoriesInput(e.target.value)} />
              <p className="text-xs text-gray-400 mt-1">Comma-separated — used for buyer matching</p>
            </div>
          </div>
          <button className="btn-primary mt-4 w-full" onClick={handleSave} disabled={saving}>
            {saving ? 'Saving…' : 'Save Profile'}
          </button>
        </div>

        <div className="space-y-6">
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

          {/* Documents */}
          <div className="card">
            <h2 className="font-semibold mb-4">Business Documents</h2>
            <label className="flex items-center justify-center gap-2 border-2 border-dashed border-gray-200 rounded-lg py-4 text-sm text-gray-500 cursor-pointer hover:border-brand-300 hover:text-brand-600">
              <Upload className="w-4 h-4" />
              {uploading ? 'Uploading…' : 'Upload a document'}
              <input type="file" className="hidden" onChange={handleDocUpload} disabled={uploading} />
            </label>
            <div className="mt-3 space-y-2">
              {documents.length === 0 && <p className="text-xs text-gray-400">No documents uploaded yet</p>}
              {documents.map((doc) => (
                <div key={doc.id} className="flex items-center gap-2 text-sm border border-gray-100 rounded-lg px-3 py-2">
                  <FileText className="w-4 h-4 text-gray-400" />
                  <span className="flex-1 truncate">{doc.type || 'Document'}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </VendorPortalLayout>
  );
}
