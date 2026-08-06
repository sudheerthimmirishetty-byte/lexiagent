import api from './api';

export const dashboardService = {
  getOverview: async () => {
    const res = await api.get('/dashboard');
    return res.data;
  },
  getStats: async () => {
    const res = await api.get('/dashboard/stats');
    return res.data;
  },
  getRecentActivities: async () => {
    const res = await api.get('/dashboard/recent');
    return res.data;
  },
};
