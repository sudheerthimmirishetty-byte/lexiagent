import api from './api';

export const documentService = {
  uploadDocument: async (file, documentName, documentType, onProgress) => {
    const formData = new FormData();
    formData.append('file', file);
    if (documentName) formData.append('documentName', documentName);
    if (documentType) formData.append('documentType', documentType);

    const res = await api.post('/document/upload', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
      onUploadProgress: (progressEvent) => {
        if (onProgress && progressEvent.total) {
          const percentCompleted = Math.round((progressEvent.loaded * 100) / progressEvent.total);
          onProgress(percentCompleted);
        }
      },
    });
    return res.data;
  },
  getDocuments: async () => {
    const res = await api.get('/document');
    return res.data;
  },
  getDocumentById: async (id) => {
    const res = await api.get(`/document/${id}`);
    return res.data;
  },
  analyzeDocument: async (id, prompt) => {
    const res = await api.post(`/document/${id}/analyze`, { prompt });
    return res.data;
  },
  deleteDocument: async (id) => {
    const res = await api.delete(`/document/${id}`);
    return res.data;
  },
};
