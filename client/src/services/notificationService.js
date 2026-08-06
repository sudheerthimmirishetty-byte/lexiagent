import api from './api';

export const notificationService = {
  getNotifications: async () => {
    const res = await api.get('/notifications');
    return res.data;
  },
  markAsRead: async () => {
    const res = await api.put('/notifications/read');
    return res.data;
  },
  clearAll: async () => {
    const res = await api.delete('/notifications');
    return res.data;
  },
};
