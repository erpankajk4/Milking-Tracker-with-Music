import { sessionRepository } from './session.repository.js';

export const sessionService = {
  async createSession(sessionData) {
    const dataToSave = {
      start_time: new Date(sessionData.start_time),
      end_time: new Date(sessionData.end_time),
      duration: sessionData.duration,
      milk_quantity: sessionData.milk_quantity
    };

    return await sessionRepository.createSession(dataToSave);
  },

  async listSessions() {
    return await sessionRepository.listSessions();
  }
};
