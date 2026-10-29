import axios from 'axios';

const api = axios.create({
  baseURL: '/api',
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor: add JWT Bearer token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('bhumisetu_token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor: handle 401s
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response && error.response.status === 401) {
      // If expired, clear token
      const isAuthEndpoint = error.config.url.includes('/auth/login') || error.config.url.includes('/auth/register');
      if (!isAuthEndpoint) {
        localStorage.removeItem('bhumisetu_token');
        localStorage.removeItem('bhumisetu_user');
      }
    }
    return Promise.reject(error);
  }
);

// Auth APIs
export const authApi = {
  login: (data) => api.post('/auth/login', data),
  register: (data) => api.post('/auth/register', data),
  getCurrentUser: () => api.get('/auth/me'),
};

// Parcel GIS APIs
export const parcelApi = {
  getAll: (query) => api.get('/parcels', { params: { q: query } }),
  getGeoJson: () => api.get('/parcels/geojson'),
  getById: (id) => api.get(`/parcels/${id}`),
  getByUlpin: (ulpin) => api.get(`/parcels/by-ulpin/${ulpin}`),
  getBySurvey: (surveyNo) => api.get(`/parcels/by-survey/${encodeURIComponent(surveyNo)}`),
  getDossier: (id) => api.get(`/parcels/${id}/dossier`),
  getDossierByUlpin: (ulpin) => api.get(`/parcels/by-ulpin/${ulpin}/dossier`),
  getInBBox: (minLon, minLat, maxLon, maxLat) =>
    api.get('/parcels/spatial/bbox', { params: { minLon, minLat, maxLon, maxLat } }),
  getByPoint: (lat, lon) => api.get('/parcels/spatial/point', { params: { lat, lon } }),
};

// Application Workflow APIs
export const applicationApi = {
  create: (data) => api.post('/applications', data),
  getMyApplications: () => api.get('/applications/my'),
  getById: (id) => api.get(`/applications/${id}`),
  getByAppNumber: (appNumber) => api.get(`/applications/track/${appNumber}`),
  getOfficerQueue: (status) => api.get('/applications/officer/queue', { params: { status } }),
  takeDecision: (id, decision) => api.post(`/applications/${id}/decision`, decision),
};

// AI Document & OCR APIs
export const documentApi = {
  uploadAndOcr: (formData) =>
    api.post('/documents/upload-ocr', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    }),
  verifyMetadata: (id, verifiedData) => api.put(`/documents/${id}/verify`, verifiedData),
  getByParcel: (parcelId) => api.get(`/documents/parcel/${parcelId}`),
  smartSearch: (query, parcelId, docType) =>
    api.get('/documents/search', { params: { q: query, parcelId, docType } }),
};

// Admin & Analytics APIs
export const adminApi = {
  getAnalytics: () => api.get('/admin/analytics'),
  getUsers: () => api.get('/admin/users'),
  getAuditLogs: () => api.get('/admin/audit-logs'),
};

export default api;
