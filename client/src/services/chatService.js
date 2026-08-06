import api from './api';

export const chatService = {
  startConversation: async (data) => {
    const res = await api.post('/chat/start', data);
    return res.data;
  },
  sendMessage: async (payload) => {
    const res = await api.post('/chat/message', payload);
    return res.data;
  },
  getConversations: async () => {
    const res = await api.get('/chat/history');
    return res.data;
  },
  getMessages: async (conversationId) => {
    const res = await api.get(`/chat/${conversationId}`);
    return res.data;
  },
  deleteConversation: async (conversationId) => {
    const res = await api.delete(`/chat/${conversationId}`);
    return res.data;
  },
};
