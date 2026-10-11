import { sessionService } from './session.service.js';

export const sessionController = {
  async createSession(req, res) {
    const session = await sessionService.createSession(req.body);
    res.status(201).json(session);
  },

  async getSessions(req, res) {
    const sessions = await sessionService.listSessions();
    res.status(200).json(sessions);
  }
};
