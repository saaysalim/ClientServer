// API Service for communicating with backend server

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

// Generic fetch wrapper
async function fetchAPI(endpoint, options = {}) {
  const url = `${API_BASE_URL}${endpoint}`;
  const response = await fetch(url, {
    headers: {
      'Content-Type': 'application/json',
      ...options.headers,
    },
    ...options,
  });

  if (!response.ok) {
    throw new Error(`API error: ${response.status} ${response.statusText}`);
  }

  return response.json();
}

// Courses API
export const coursesAPI = {
  list: () => fetchAPI('/courses'),
  get: (id) => fetchAPI(`/courses/${id}`),
  create: (data) => fetchAPI('/courses', { method: 'POST', body: JSON.stringify(data) }),
};

// Media Centers API
export const mediaCentersAPI = {
  list: () => fetchAPI('/media-centers'),
  create: (data) => fetchAPI('/media-centers', { method: 'POST', body: JSON.stringify(data) }),
};

// Uploads API
export const uploadsAPI = {
  list: () => fetchAPI('/uploads'),
  create: (data) => fetchAPI('/uploads', { method: 'POST', body: JSON.stringify(data) }),
};

// Collaborations API
export const collaborationsAPI = {
  list: () => fetchAPI('/collaborations'),
  create: (data) => fetchAPI('/collaborations', { method: 'POST', body: JSON.stringify(data) }),
};

// Analytics API
export const analyticsAPI = {
  get: () => fetchAPI('/analytics'),
  update: (data) => fetchAPI('/analytics', { method: 'PUT', body: JSON.stringify(data) }),
};

// Health check
export const healthAPI = {
  check: () => fetchAPI('/health'),
};
