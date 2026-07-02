import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { CheckCircle, Upload, ChevronRight, ChevronLeft } from 'lucide-react';
import { companyApi, vendorsApi, itemsApi } from '../api/services';
import toast from 'react-hot-toast';

const STEPS = ['Company Info', 'Invite Team', 'Import Vendors', 'Import Items', 'Go Live'];

export default function OnboardingPage() {
  const navigate = useNavigate();
  const [step, setStep] = useState(0);
  const [companyData, setCompanyData] = useState({ name: '', gstin: '', industry: '', currency: 'INR', timezone: 'Asia/Kolkata' });
  const [loading, setLoading] = useState(false);

  const saveCompany = async () => {
    setLoading(true);
    try { await companyApi.update(companyData); setStep(1); } catch { toast.error('Failed to save company info'); } finally { setLoading(false); }
  };

  const handleVendorImport = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setLoading(true);
    try {
      const { data } = await vendorsApi.importCsv(file);
      toast.success(`Imported ${data.data.created} vendors`);
      if (data.data.errors?.length) toast.error(`${data.data.errors.length} rows had errors`);
    } catch { toast.error('Import failed'); } finally { setLoading(false); }
  };

  const handleItemImport = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setLoading(true);
    try {
      const { data } = await itemsApi.importCsv(file);
      toast.success(`Imported ${data.data.created} items`);
    } catch { toast.error('Import failed'); } finally { setLoading(false); }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4 py-8">
      <div className="w-full max-w-2xl">
        <div className="text-center mb-8">
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Welcome to ProcureAI</h1>
          <p className="text-gray-500">Let's set up your procurement workspace</p>
        </div>

        {/* Step indicators */}
        <div className="flex items-center justify-center mb-8 gap-2 flex-wrap">
          {STEPS.map((s, i) => (
            <div key={s} className="flex items-center gap-2">
              <div className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold transition ${i < step ? 'bg-green-500 text-white' : i === step ? 'bg-brand-600 text-white' : 'bg-gray-200 text-gray-500'}`}>
                {i < step ? <CheckCircle className="w-4 h-4" /> : i + 1}
              </div>
              {i < STEPS.length - 1 && <div className={`w-8 h-0.5 ${i < step ? 'bg-green-400' : 'bg-gray-200'}`} />}
            </div>
          ))}
        </div>

        <div className="card">
          {step === 0 && (
            <div className="space-y-4">
              <h2 className="font-semibold mb-4">Company Information</h2>
              <div className="grid grid-cols-2 gap-4">
                <div className="col-span-2"><label className="label">Company Name *</label><input className="input" value={companyData.name} onChange={(e) => setCompanyData({ ...companyData, name: e.target.value })} /></div>
                <div><label className="label">GSTIN</label><input className="input" value={companyData.gstin} onChange={(e) => setCompanyData({ ...companyData, gstin: e.target.value })} placeholder="27AAPFD1234F1Z5" /></div>
                <div><label className="label">Industry</label>
                  <select className="input" value={companyData.industry} onChange={(e) => setCompanyData({ ...companyData, industry: e.target.value })}>
                    <option value="">Select…</option>
                    {['Construction', 'Manufacturing', 'Distribution', 'Retail', 'Healthcare', 'Hospitality', 'Other'].map((i) => <option key={i}>{i}</option>)}
                  </select>
                </div>
              </div>
              <div className="flex justify-end mt-4"><button className="btn-primary" onClick={saveCompany} disabled={loading || !companyData.name}>{loading ? 'Saving…' : 'Next'} <ChevronRight className="w-4 h-4 inline" /></button></div>
            </div>
          )}

          {step === 1 && (
            <div>
              <h2 className="font-semibold mb-2">Invite Your Team</h2>
              <p className="text-sm text-gray-500 mb-6">You can invite team members from Settings → Users after setup. Skip for now to continue.</p>
              <div className="flex justify-between"><button className="btn-secondary" onClick={() => setStep(0)}><ChevronLeft className="w-4 h-4 inline" /> Back</button><button className="btn-primary" onClick={() => setStep(2)}>Skip <ChevronRight className="w-4 h-4 inline" /></button></div>
            </div>
          )}

          {step === 2 && (
            <div>
              <h2 className="font-semibold mb-2">Import Vendors</h2>
              <p className="text-sm text-gray-500 mb-4">Upload a CSV/Excel with columns: name, email, phone, gstin, payment_terms, lead_time_days</p>
              <a href="#" className="text-xs text-brand-600 underline mb-4 block" onClick={(e) => e.preventDefault()}>Download sample CSV</a>
              <label className="flex flex-col items-center justify-center border-2 border-dashed border-gray-300 rounded-lg p-8 cursor-pointer hover:border-brand-400 transition">
                <Upload className="w-8 h-8 text-gray-400 mb-2" />
                <span className="text-sm text-gray-500">Click to upload vendor CSV/Excel</span>
                <input type="file" className="hidden" accept=".csv,.xlsx,.xls" onChange={handleVendorImport} />
              </label>
              <div className="flex justify-between mt-4"><button className="btn-secondary" onClick={() => setStep(1)}><ChevronLeft className="w-4 h-4 inline" /> Back</button><button className="btn-primary" onClick={() => setStep(3)}>Next <ChevronRight className="w-4 h-4 inline" /></button></div>
            </div>
          )}

          {step === 3 && (
            <div>
              <h2 className="font-semibold mb-2">Import Item Master</h2>
              <p className="text-sm text-gray-500 mb-4">Upload a CSV/Excel with columns: name, category, unit, hsn_sac, tax_rate, reorder_level, opening_stock</p>
              <a href="#" className="text-xs text-brand-600 underline mb-4 block" onClick={(e) => e.preventDefault()}>Download sample CSV</a>
              <label className="flex flex-col items-center justify-center border-2 border-dashed border-gray-300 rounded-lg p-8 cursor-pointer hover:border-brand-400 transition">
                <Upload className="w-8 h-8 text-gray-400 mb-2" />
                <span className="text-sm text-gray-500">Click to upload item CSV/Excel</span>
                <input type="file" className="hidden" accept=".csv,.xlsx,.xls" onChange={handleItemImport} />
              </label>
              <div className="flex justify-between mt-4"><button className="btn-secondary" onClick={() => setStep(2)}><ChevronLeft className="w-4 h-4 inline" /> Back</button><button className="btn-primary" onClick={() => setStep(4)}>Next <ChevronRight className="w-4 h-4 inline" /></button></div>
            </div>
          )}

          {step === 4 && (
            <div className="text-center py-6">
              <CheckCircle className="w-16 h-16 text-green-500 mx-auto mb-4" />
              <h2 className="text-xl font-bold mb-2">You're all set! 🎉</h2>
              <p className="text-gray-500 mb-6">Your procurement workspace is ready. Start by creating your first purchase request.</p>
              <button className="btn-primary px-8" onClick={() => navigate('/dashboard')}>Go to Dashboard</button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
