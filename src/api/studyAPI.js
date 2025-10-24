import client from './client';

export const studyAPI = {
  getStudies: async (params) => {
    const res = await client.get('/study', { params });
    return res.data;
  },

  getStudyById: async (id) => {
    const res = await client.get(`/study/${id}`);
    return res.data;
  },

  createStudy: async (data) => {
    const res = await client.post('/study', data);
    return res.data;
  },

  updateStudy: async (id, data) => {
    const res = await client.patch(`/study/${id}`, data);
    return res.data;
  },

  deleteStudy: async (id) => {
    const res = await client.delete(`/study/${id}`);
    return res.data;
  },
};
