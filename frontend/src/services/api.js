const API_BASE_URL = '/api';

async function request(endpoint, options = {}) {
  const token = localStorage.getItem('token');
  const headers = {
    'Content-Type': 'application/json',
    ...(token ? { 'Authorization': `Bearer ${token}` } : {}),
    ...(options.headers || {})
  };

  const response = await fetch(`${API_BASE_URL}${endpoint}`, {
    ...options,
    headers
  });

  const data = await response.json().catch(() => ({}));

  if (!response.ok) {
    const errorMsg = data.message || `Request failed with status ${response.status}`;
    const error = new Error(errorMsg);
    error.status = response.status;
    error.data = data;
    throw error;
  }

  return data;
}

export const api = {
  // Auth
  auth: {
    login: (credentials) => request('/auth/login', { method: 'POST', body: JSON.stringify(credentials) }),
    register: (userData) => request('/auth/register', { method: 'POST', body: JSON.stringify(userData) }),
    me: () => request('/auth/me')
  },

  // Scholarships
  scholarships: {
    getAll: (params = {}) => {
      const query = new URLSearchParams();
      Object.entries(params).forEach(([key, value]) => {
        if (value !== undefined && value !== null && value !== '') {
          query.append(key, value);
        }
      });
      return request(`/scholarships?${query.toString()}`);
    },
    getFeatured: () => request('/scholarships/featured'),
    getCategories: () => request('/scholarships/categories'),
    getDetail: (idOrSlug) => request(`/scholarships/${idOrSlug}`)
  },

  // Eligibility Rule Matcher
  eligibility: {
    check: (criteriaData) => request('/eligibility/check', { method: 'POST', body: JSON.stringify(criteriaData) })
  },

  // Profile & Saved
  profile: {
    get: () => request('/profile'),
    update: (profileData) => request('/profile', { method: 'PUT', body: JSON.stringify(profileData) }),
    getSaved: () => request('/profile/saved'),
    toggleSave: (scholarshipId) => request(`/profile/save-scholarship/${scholarshipId}`, { method: 'POST' }),
    uploadDoc: (docData) => request('/profile/documents', { method: 'POST', body: JSON.stringify(docData) }),
    getNotifications: () => request('/profile/notifications'),
    markNotifRead: (id = 'all') => request(`/profile/notifications/${id}/read`, { method: 'PUT' })
  },

  // Applications
  applications: {
    apply: (appData) => request('/applications/apply', { method: 'POST', body: JSON.stringify(appData) }),
    getMy: () => request('/applications/my'),
    getDetail: (id) => request(`/applications/${id}`)
  },

  // Articles & Educational Resources
  content: {
    getArticles: (params = {}) => {
      const query = new URLSearchParams(params).toString();
      return request(`/articles?${query}`);
    },
    getArticleDetail: (slug) => request(`/articles/${slug}`),
    getResults: () => request('/results'),
    getVideos: () => request('/videos'),
    getQnA: () => request('/qna'),
    askQuestion: (data) => request('/qna/ask', { method: 'POST', body: JSON.stringify(data) }),
    answerQuestion: (id, answer_text) => request(`/qna/${id}/answer`, { method: 'POST', body: JSON.stringify({ answer_text }) }),
    contact: (contactData) => request('/contact', { method: 'POST', body: JSON.stringify(contactData) })
  },

  // Admin Operations
  admin: {
    getStats: () => request('/admin/stats'),
    getScholarships: () => request('/admin/scholarships'),
    createScholarship: (data) => request('/admin/scholarships', { method: 'POST', body: JSON.stringify(data) }),
    updateScholarship: (id, data) => request(`/admin/scholarships/${id}`, { method: 'PUT', body: JSON.stringify(data) }),
    deleteScholarship: (id) => request(`/admin/scholarships/${id}`, { method: 'DELETE' }),
    getApplications: (status) => request(`/admin/applications${status ? `?status=${status}` : ''}`),
    updateAppStatus: (id, status, reviewer_notes) => request(`/admin/applications/${id}/status`, { method: 'PUT', body: JSON.stringify({ status, reviewer_notes }) }),
    getUsers: () => request('/admin/users')
  }
};
