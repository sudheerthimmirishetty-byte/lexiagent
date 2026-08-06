import api from './api';

export const draftService = {
  generateDraft: async (payload) => {
    const res = await api.post('/draft/generate', payload);
    return res.data;
  },
  getDrafts: async () => {
    const res = await api.get('/draft');
    return res.data;
  },
  getDraftById: async (id) => {
    const res = await api.get(`/draft/${id}`);
    return res.data;
  },
  deleteDraft: async (id) => {
    const res = await api.delete(`/draft/${id}`);
    return res.data;
  },
};
