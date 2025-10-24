import client from './client';

export const habitAPI = {
  getHabits: async (studyId) => {
    const res = await client.get(`/study/${studyId}/habit`);
    return res.data;
  },

  createHabit: async (studyId, name) => {
    const res = await client.post(`/study/${studyId}/habit`, { name });
    return res.data.habit;
  },

  updateHabit: async (habitId, name) => {
    const res = await client.patch(`/habit/${habitId}`, { name });
    return res.data.updatedHabit;
  },

  deleteHabit: async (habitId) => {
    await client.delete(`/habit/${habitId}`);
  },
};
