import { Queue } from 'bullmq';
import { connection } from './connection';

// Create a new queue for assessment generation jobs
export const assessmentQueue = new Queue('assessment-generation', {
  connection,
  defaultJobOptions: {
    attempts: 3,
    backoff: {
      type: 'exponential',
      delay: 1000,
    },
    removeOnComplete: true,
    removeOnFail: 1000, // keep the last 1000 failed jobs
  },
});
