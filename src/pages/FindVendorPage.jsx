import React, { useState, useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import api from '../api/client';
import { SearchInput, EmptyState, PageLoader } from '../components/ui';
import { Building2, Package, Clock, Star, Phone } from 'lucide-react';
import toast from 'react-hot-toast';

export default function FindVendorPage() {
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState('');
  const [maxPrice, setMaxPrice] = useState('');
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);

  const { data: categories = [] } = useQuery({
    queryKey: ['vendor-categories'],
    queryFn: () => api.get('/vendor-discovery/categories').then((r) => r.data.data),
  });

  const runSearch = async () => {
    setLoading(true);
    try {
      const params = {};
      if (search) params.q = search;
      if (category) params.category = category;
      if (maxPrice) params.max_price = maxPrice;
      const { data } = await api.get('/vendor-discovery/search', { params });
      setResults(data.data);
    } catch {
      toast.error('Search failed');
    } finally { setLoading(false); }
  };

  useEffect(() => { runSearch(); }, [search, category, maxPrice]);

  return (
    <div className="space-y-4">
      <div>
        <h1>Find Vendor</h1>
        <p className="text-sm text-gray-500 mt-0.5">Discover vendors by the materials and products they supply</p>
      </div>

      {/* Filters */}
      <div className="card flex flex-wrap gap-3 items-end">
        <div className="flex-1 min-w-48">
          <label className="label">Search material</label>
          <SearchInput value={search} onChange={setSearch} placeholder="e.g. Steel Pipe, Cement, Cable…" />
        </div>
        <div className="w-48">
          <label className="label">Category</label>
          <select className="input" value={category} onChange={(e) => setCategory(e.target.value)}>
            <option value="">All categories</option>
            {categories.map((c) => <option key={c}>{c}</option>)}
          </select>
        </div>
        <div className="w-36">
          <label className="label">Max price (₹)</label>
          <input className="input" type="number" value={maxPrice}
            onChange={(e) => setMaxPrice(e.target.value)} placeholder="Any" />
        </div>
      </div>

      {loading ? <PageLoader /> : results.length === 0 ? (
        <div className="card">
          <EmptyState
            title="No vendors found"
            description={search || category ? 'Try a different search term or category' : 'No vendors have added catalog items yet'}
          />
        </div>
      ) : (
        <div className="space-y-3">
          {results.map(({ vendor, catalog_items }) => (
            <div key={vendor.id} className="card">
              <div className="flex items-start justify-between flex-wrap gap-3 mb-3">
                <div className="flex items-start gap-3">
                  <div className="p-2 bg-brand-50 rounded-lg">
                    <Building2 className="w-5 h-5 text-brand-600" />
                  </div>
                  <div>
                    <p className="font-semibold text-gray-900">{vendor.name}</p>
                    <div className="flex items-center gap-3 text-xs text-gray-500 mt-0.5 flex-wrap">
                      {vendor.contact_person && <span>{vendor.contact_person}</span>}
                      {vendor.phone && (
                        <span className="flex items-center gap-1">
                          <Phone className="w-3 h-3" />{vendor.phone}
                        </span>
                      )}
                      {vendor.payment_terms && <span>Terms: {vendor.payment_terms}</span>}
                      {vendor.lead_time_days && (
                        <span className="flex items-center gap-1">
                          <Clock className="w-3 h-3" />{vendor.lead_time_days}d lead time
                        </span>
                      )}
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  {vendor.rating && (
                    <span className="flex items-center gap-1 text-amber-600 text-sm font-semibold">
                      <Star className="w-4 h-4 fill-amber-400" />{Number(vendor.rating).toFixed(1)}/10
                    </span>
                  )}
                  <span className={`badge-${vendor.preferred ? 'blue' : 'gray'}`}>
                    {vendor.preferred ? '⭐ Preferred' : 'Vendor'}
                  </span>
                </div>
              </div>

              {/* Catalog items */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-2">
                {catalog_items.map((ci) => (
                  <div key={ci.id} className="flex justify-between items-start bg-gray-50 rounded-lg p-3 border border-gray-100">
                    <div>
                      <p className="text-sm font-medium text-gray-800">{ci.name}</p>
                      <p className="text-xs text-gray-500 mt-0.5">
                        {ci.category} · {ci.unit || 'unit'}
                        {ci.min_order_qty > 1 && ` · Min: ${ci.min_order_qty}`}
                      </p>
                      {ci.description && <p className="text-xs text-gray-400 mt-0.5 truncate">{ci.description}</p>}
                    </div>
                    {ci.price && (
                      <span className="text-sm font-bold text-brand-700 ml-2 shrink-0">
                        ₹{Number(ci.price).toLocaleString('en-IN')}
                        <span className="text-xs font-normal text-gray-400">/{ci.unit || 'unit'}</span>
                      </span>
                    )}
                  </div>
                ))}
              </div>

              {vendor.categories?.length > 0 && (
                <div className="flex gap-1 mt-3 flex-wrap">
                  {vendor.categories.map((c) => (
                    <span key={c} className="badge-gray text-xs">{c}</span>
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
