import axios from 'axios';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL
     ? `${import.meta.env.VITE_API_URL}/api/v1`
     : '/api/v1',
  headers: { 'Content-Type': 'application/json' },
});

// Response interceptor: auto-refresh token on 401
api.interceptors.response.use(
  (res) => res,
  async (error) => {
    const original = error.config;
    if (error.response?.status === 401 && !original._retry) {
      original._retry = true;
      const refresh = localStorage.getItem('procureai_refresh');
      if (refresh) {
        try {
          const { data } = await axios.post('/api/v1/auth/refresh', { refresh_token: refresh });
          const newToken = data.data.access_token;
          localStorage.setItem('procureai_token', newToken);
          api.defaults.headers.common['Authorization'] = `Bearer ${newToken}`;
          original.headers['Authorization'] = `Bearer ${newToken}`;
          return api(original);
        } catch {
          localStorage.clear();
          window.location.href = '/login';
        }
      }
    }
    return Promise.reject(error);
  }
);

export default api;
