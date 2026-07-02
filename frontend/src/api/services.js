import api from './client';

// AUTH
export const authApi = {
  login: (data) => api.post('/auth/login', data),
  logout: () => api.post('/auth/logout'),
  forgotPassword: (email) => api.post('/auth/forgot-password', { email }),
  resetPassword: (data) => api.post('/auth/reset-password', data),
};

// COMPANY
export const companyApi = {
  getMe: () => api.get('/companies/me'),
  update: (data) => api.patch('/companies/me', data),
  signup: (data) => api.post('/companies', data),
};

// USERS
export const usersApi = {
  list: (params) => api.get('/users', { params }),
  create: (data) => api.post('/users', data),
  getOne: (id) => api.get(`/users/${id}`),
  update: (id, data) => api.patch(`/users/${id}`, data),
  remove: (id) => api.delete(`/users/${id}`),
  listRoles: () => api.get('/roles'),
  updateRolePermissions: (id, data) => api.patch(`/roles/${id}/permissions`, data),
};

// VENDORS
export const vendorsApi = {
  list: (params) => api.get('/vendors', { params }),
  create: (data) => api.post('/vendors', data),
  importCsv: (file) => { const f = new FormData(); f.append('file', file); return api.post('/vendors/import', f, { headers: { 'Content-Type': 'multipart/form-data' } }); },
  getOne: (id) => api.get(`/vendors/${id}`),
  update: (id, data) => api.patch(`/vendors/${id}`, data),
  remove: (id) => api.delete(`/vendors/${id}`),
  getScores: (id) => api.get(`/vendors/${id}/scores`),
  uploadDoc: (id, file, type) => { const f = new FormData(); f.append('file', file); f.append('type', type); return api.post(`/vendors/${id}/documents`, f, { headers: { 'Content-Type': 'multipart/form-data' } }); },
  compare: (ids) => api.get('/vendors/compare', { params: { ids: ids.join(',') } }),
};

// ITEMS
export const itemsApi = {
  list: (params) => api.get('/items', { params }),
  create: (data) => api.post('/items', data),
  importCsv: (file) => { const f = new FormData(); f.append('file', file); return api.post('/items/import', f, { headers: { 'Content-Type': 'multipart/form-data' } }); },
  getOne: (id) => api.get(`/items/${id}`),
  update: (id, data) => api.patch(`/items/${id}`, data),
  remove: (id) => api.delete(`/items/${id}`),
};

// PURCHASE REQUESTS
export const prApi = {
  list: (params) => api.get('/purchase-requests', { params }),
  create: (data) => api.post('/purchase-requests', data),
  getOne: (id) => api.get(`/purchase-requests/${id}`),
  update: (id, data) => api.patch(`/purchase-requests/${id}`, data),
  submit: (id) => api.post(`/purchase-requests/${id}/submit`),
  cancel: (id) => api.post(`/purchase-requests/${id}/cancel`),
};

// RFQs
export const rfqApi = {
  list: (params) => api.get('/rfqs', { params }),
  create: (data) => api.post('/rfqs', data),
  getOne: (id) => api.get(`/rfqs/${id}`),
  send: (id) => api.post(`/rfqs/${id}/send`),
  remind: (id) => api.post(`/rfqs/${id}/remind`),
  getQuotes: (id) => api.get(`/rfqs/${id}/quotes`),
  getComparison: (id) => api.get(`/rfqs/${id}/comparison`),
  recommend: (id) => api.post(`/rfqs/${id}/recommend`),
  selectVendor: (id, data) => api.post(`/rfqs/${id}/select-vendor`, data),
};

// QUOTES
export const quotesApi = {
  getOne: (id) => api.get(`/quotes/${id}`),
  reprocess: (id) => api.post(`/quotes/${id}/reprocess`),
  updateItem: (quoteId, itemId, data) => api.patch(`/quotes/${quoteId}/items/${itemId}`, data),
  reviewComplete: (id) => api.post(`/quotes/${id}/review-complete`),
};

// APPROVALS
export const approvalsApi = {
  getPending: (params) => api.get('/approvals/pending', { params }),
  act: (id, data) => api.post(`/approvals/${id}/act`, data),
  getHistory: (type, entityId) => api.get(`/approvals/${type}/${entityId}/history`),
};

// PURCHASE ORDERS
export const poApi = {
  list: (params) => api.get('/purchase-orders', { params }),
  create: (data) => api.post('/purchase-orders', data),
  getOne: (id) => api.get(`/purchase-orders/${id}`),
  update: (id, data) => api.patch(`/purchase-orders/${id}`, data),
  send: (id) => api.post(`/purchase-orders/${id}/send`),
  downloadPdf: (id) => api.get(`/purchase-orders/${id}/pdf`, { responseType: 'blob' }),
};

// GRN
export const grnApi = {
  create: (data) => api.post('/goods-receipts', data),
  getOne: (id) => api.get(`/goods-receipts/${id}`),
  inspect: (id, data) => api.patch(`/goods-receipts/${id}/inspect`, data),
};

// INVOICES
export const invoicesApi = {
  list: (params) => api.get('/invoices', { params }),
  upload: (file, data) => { const f = new FormData(); f.append('file', file); Object.entries(data).forEach(([k, v]) => f.append(k, v)); return api.post('/invoices', f, { headers: { 'Content-Type': 'multipart/form-data' } }); },
  getOne: (id) => api.get(`/invoices/${id}`),
  match: (id) => api.post(`/invoices/${id}/match`),
  approve: (id) => api.post(`/invoices/${id}/approve`),
  updateItem: (invoiceId, itemId, data) => api.patch(`/invoices/${invoiceId}/items/${itemId}`, data),
};

// INVENTORY
export const inventoryApi = {
  getAll: () => api.get('/inventory'),
  getReorderAlerts: () => api.get('/inventory/reorder-alerts'),
  updateReorderRule: (itemId, data) => api.patch(`/reorder-rules/${itemId}`, data),
  computeScores: () => api.post('/vendor-scores/compute'),
};

// ANALYTICS
export const analyticsApi = {
  getDashboard: () => api.get('/analytics/dashboard'),
  getSpend: (params) => api.get('/analytics/spend', { params }),
  getCycleTimes: () => api.get('/analytics/cycle-times'),
  getVendorPerformance: () => api.get('/analytics/vendor-performance'),
  getSavings: () => api.get('/analytics/savings'),
};

// NOTIFICATIONS
export const notificationsApi = {
  list: (params) => api.get('/notifications', { params }),
  markRead: (id) => api.patch(`/notifications/${id}/read`),
};

// AUDIT
export const auditApi = {
  list: (params) => api.get('/audit-logs', { params }),
};

// PUBLIC (vendor quote submission)
export const publicApi = {
  getRfq: (token) => api.get(`/public/rfq/${token}`),
  submitQuote: (token, file, data) => {
    const f = new FormData();
    if (file) f.append('file', file);
    Object.entries(data || {}).forEach(([k, v]) => f.append(k, v));
    return api.post(`/public/rfq/${token}/quote`, f, { headers: { 'Content-Type': 'multipart/form-data' } });
  },
};
