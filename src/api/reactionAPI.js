import client from './client';

export const reactionAPI = {
  getReactions: async (studyId) => {
    const res = await client.get(`/study/${studyId}/reaction`);
    return res.data;
  },

  addReaction: async (studyId, emoji) => {
    const res = await client.post(`/study/${studyId}/reaction`, { emoji });
    return res.data;
  },

  deleteReaction: async (studyId, emoji) => {
    const res = await client.delete(`/study/${studyId}/reaction`, {
      data: { emoji },
    });
    return res.data;
  },
};
