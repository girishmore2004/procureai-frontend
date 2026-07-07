import axios from 'axios';

const API_BASE = import.meta.env.VITE_API_URL
  ? `${import.meta.env.VITE_API_URL}/api/v1`
  : '/api/v1';

const api = axios.create({
  baseURL: API_BASE,
  headers: { 'Content-Type': 'application/json' },
});

// ── Request interceptor: pick the right token for the right endpoint ───────
// The company-user app (AuthContext) and the vendor portal (VendorPortalDashboard's
// useVendorAuth) both used to set `api.defaults.headers.common['Authorization']`
// directly. Since `api` is one shared axios instance for the whole SPA, whichever
// effect ran last "won" — and because AuthProvider wraps every route (including
// /vendor-portal/*), its effect (parent) commits AFTER a vendor page's own effect
// (child) on the same page load, silently overwriting the vendor JWT with a stale
// buyer JWT left in localStorage. Every subsequent vendor-portal call would then
// 401 even though the vendor had just logged in successfully. Setting the header
// per request, based on the endpoint being called, makes this deterministic
// regardless of component mount order.
api.interceptors.request.use((config) => {
  const url = config.url || '';
  if (url.startsWith('/public/')) {
    // Token-based public endpoints — never send a stale session token.
    delete config.headers.Authorization;
  } else if (url.startsWith('/vendor-portal')) {
    const vendorToken = localStorage.getItem('procureai_vendor_token');
    if (vendorToken) config.headers.Authorization = `Bearer ${vendorToken}`;
    else delete config.headers.Authorization;
  } else {
    const token = localStorage.getItem('procureai_token');
    if (token) config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Response interceptor: auto-refresh token on 401 (company-user sessions only —
// the vendor portal has no refresh-token flow, it just re-prompts for login).
api.interceptors.response.use(
  (res) => res,
  async (error) => {
    const original = error.config;
    const url = original?.url || '';
    const isVendorPortal = url.startsWith('/vendor-portal');

    if (error.response?.status === 401 && isVendorPortal) {
      // Vendor session expired/invalid — send the vendor back to their own login,
      // not the buyer /login page, and don't touch the buyer's localStorage/session.
      localStorage.removeItem('procureai_vendor_token');
      localStorage.removeItem('procureai_vendor_user');
      window.location.href = '/vendor-portal/login';
      return Promise.reject(error);
    }

    if (error.response?.status === 401 && !isVendorPortal && !original._retry) {
      original._retry = true;
      const refresh = localStorage.getItem('procureai_refresh');
      if (refresh) {
        try {
          const { data } = await axios.post(`${API_BASE}/auth/refresh`, { refresh_token: refresh });
          const newToken = data.data.access_token;
          localStorage.setItem('procureai_token', newToken);
          api.defaults.headers.common['Authorization'] = `Bearer ${newToken}`;
          original.headers['Authorization'] = `Bearer ${newToken}`;
          return api(original);
        } catch {
          localStorage.removeItem('procureai_token');
          localStorage.removeItem('procureai_refresh');
          localStorage.removeItem('procureai_user');
          window.location.href = '/login';
        }
      }
    }
    return Promise.reject(error);
  }
);

export default api;
