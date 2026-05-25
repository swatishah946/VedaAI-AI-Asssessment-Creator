import mongoose, { Schema, Document } from 'mongoose';

export interface IDummy extends Document {
  message: string;
  createdAt: Date;
}

const DummySchema: Schema = new Schema({
  message: { type: String, required: true },
  createdAt: { type: Date, default: Date.now }
});

export default mongoose.model<IDummy>('Dummy', DummySchema);
