import mongoose from 'mongoose';

const sessionSchema = new mongoose.Schema(
  {
    start_time: {
      type: Date,
      required: true
    },
    end_time: {
      type: Date,
      required: true
    },
    duration: {
      type: Number,
      required: true,
      min: 0,
      validate: {
        validator: Number.isInteger,
        message: '{VALUE} is not an integer duration'
      }
    },
    milk_quantity: {
      type: Number,
      required: true,
      min: 0.000001
    }
  },
  {
    timestamps: true,
    collection: 'milking_sessions',
    toJSON: {
      transform(doc, ret) {
        ret.id = ret._id.toString();
        delete ret._id;
        delete ret.__v;
        return ret;
      }
    },
    toObject: {
      transform(doc, ret) {
        ret.id = ret._id.toString();
        delete ret._id;
        delete ret.__v;
        return ret;
      }
    }
  }
);

sessionSchema.index({ start_time: -1, _id: -1 });

export const SessionModel = mongoose.model('MilkingSession', sessionSchema);
