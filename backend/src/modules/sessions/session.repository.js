import { SessionModel } from './session.model.js';

const mapSessionDocument = (doc) => ({
  id: doc._id.toString(),
  start_time: doc.start_time instanceof Date ? doc.start_time.toISOString() : new Date(doc.start_time).toISOString(),
  end_time: doc.end_time instanceof Date ? doc.end_time.toISOString() : new Date(doc.end_time).toISOString(),
  duration: doc.duration,
  milk_quantity: doc.milk_quantity,
  createdAt: doc.createdAt instanceof Date ? doc.createdAt.toISOString() : new Date(doc.createdAt).toISOString(),
  updatedAt: doc.updatedAt instanceof Date ? doc.updatedAt.toISOString() : new Date(doc.updatedAt).toISOString()
});

export const sessionRepository = {
  async createSession(data) {
    const document = await SessionModel.create(data);
    return mapSessionDocument(document);
  },

  async listSessions() {
    const documents = await SessionModel.find({})
      .sort({ start_time: -1, _id: -1 })
      .lean()
      .exec();

    return documents.map(mapSessionDocument);
  }
};
