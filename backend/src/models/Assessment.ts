import mongoose, { Schema, Document } from 'mongoose';

export interface IAssessment extends Document {
  topic: string;
  difficulty: string;
  questionsCount: number;
  status: 'processing' | 'completed' | 'failed';
  result?: any;
  error?: string;
  createdAt: Date;
  updatedAt: Date;
}

const AssessmentSchema: Schema = new Schema(
  {
    topic: { type: String, required: true },
    difficulty: { type: String, required: true },
    questionsCount: { type: Number, required: true },
    status: {
      type: String,
      enum: ['processing', 'completed', 'failed'],
      default: 'processing',
    },
    result: { type: Schema.Types.Mixed },
    error: { type: String },
  },
  { timestamps: true }
);

export default mongoose.model<IAssessment>('Assessment', AssessmentSchema);
