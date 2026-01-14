import axios from 'axios';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE || '/api',
});

export async function uploadLog(file) {
  const formData = new FormData();
  formData.append('file', file);

  const response = await api.post('/logs', formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });
  return response.data;
}

export async function fetchLogs(params = {}) {
  const response = await api.get('/logs', { params });
  return response.data.data;
}

export async function fetchLogById(id) {
  const response = await api.get(`/logs/${id}`);
  return response.data.data;
}

export default api;

