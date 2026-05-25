import { Worker, Job } from 'bullmq';
import { connection } from './connection';
import Assessment from '../models/Assessment';
import { generateAssessmentStructure } from '../services/aiService';

// Initialize the worker to listen to the 'assessment-generation' queue
export const assessmentWorker = new Worker(
  'assessment-generation',
  async (job: Job) => {
    const { assessmentId, topic, difficulty, questionsCount } = job.data;
    
    console.log(`[Worker] Starting job ${job.id} for assessment ${assessmentId}`);

    try {
      // 1. Call the AI Service
      console.log(`[Worker] Generating AI structure for "${topic}"...`);
      const generatedResult = await generateAssessmentStructure(
        topic,
        difficulty,
        questionsCount
      );

      // 2. Update the MongoDB document with the successful result
      console.log(`[Worker] AI generation complete. Updating database...`);
      await Assessment.findByIdAndUpdate(assessmentId, {
        status: 'completed',
        result: generatedResult,
      });

      console.log(`[Worker] Job ${job.id} finished successfully.`);
      return { success: true, assessmentId };
    } catch (error: any) {
      // 3. If it fails, update the MongoDB document to 'failed'
      console.error(`[Worker] Job ${job.id} failed:`, error.message);
      await Assessment.findByIdAndUpdate(assessmentId, {
        status: 'failed',
        error: error.message || 'Unknown error occurred during generation',
      });
      throw error; // Re-throw so BullMQ knows the job failed (and can retry)
    }
  },
  {
    connection,
    concurrency: 5, // Process up to 5 jobs concurrently
  }
);

assessmentWorker.on('failed', (job, err) => {
  console.log(`[Worker] Job ${job?.id} has failed with ${err.message}`);
});
