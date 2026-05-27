import mongoose, { Schema, Document } from 'mongoose';

export interface IQuestionConfig {
  type: string;
  count: number;
  marks: number;
}

export interface IAssessment extends Document {
  topic: string; // We'll map additionalInfo to topic for historical compatibility or use it as topic
  dueDate?: Date;
  questionsList?: IQuestionConfig[];
  status: 'processing' | 'completed' | 'failed';
  result?: any;
  createdAt: Date;
}

const QuestionConfigSchema: Schema = new Schema({
  type: { type: String, required: true },
  count: { type: Number, required: true },
  marks: { type: Number, required: true },
});

const AssessmentSchema: Schema = new Schema({
  topic: { type: String, required: true },
  dueDate: { type: Date },
  questionsList: { type: [QuestionConfigSchema] },
  status: { type: String, enum: ['processing', 'completed', 'failed'], default: 'processing' },
  result: { type: Schema.Types.Mixed }, // Store the JSON AI output here
  createdAt: { type: Date, default: Date.now }
});

export default mongoose.model<IAssessment>('Assessment', AssessmentSchema);
