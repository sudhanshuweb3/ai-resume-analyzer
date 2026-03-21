import api from './api';

export const resumeService = {
  upload: (formData) => api.post('/resumes', formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
  }),
  list: () => api.get('/resumes'),
  get: (id) => api.get(`/resumes/${id}`),
};

export const jobDescriptionService = {
  create: (payload) => api.post('/jobs', payload),
  list: () => api.get('/jobs'),
  get: (id) => api.get(`/jobs/${id}`),
};

export const analysisService = {
  analyze: (resumeId, jobDescriptionId) =>
    api.post('/analysis', { resumeId, jobDescriptionId }),
  list: () => api.get('/analysis'),
  get: (id) => api.get(`/analysis/${id}`),
};
