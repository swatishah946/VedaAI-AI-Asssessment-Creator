import { Worker, Job } from 'bullmq';
import { connection } from './connection';
import Assessment from '../models/Assessment';
import { generateAssessmentStructure } from '../services/aiService';
import { getIO } from '../socket';

// Initialize the worker to listen to the 'assessment-generation' queue
export const assessmentWorker = new Worker(
  'assessment-generation',
  async (job: Job) => {
    const { assessmentId, topic, questionsList } = job.data;
    
    console.log(`[Worker] Starting job ${job.id} for assessment ${assessmentId}`);

    try {
      // 1. Call the AI Service
      console.log(`[Worker] Generating AI structure for "${topic}"...`);
      const generatedResult = await generateAssessmentStructure(
        topic,
        questionsList
      );

      // 2. Update the MongoDB document with the successful result
      console.log(`[Worker] AI generation complete. Updating database...`);
      const updatedAssessment = await Assessment.findByIdAndUpdate(
        assessmentId,
        {
          status: 'completed',
          result: generatedResult,
        },
        { new: true }
      );

      // 3. Emit real-time success event to the specific assessment's room
      try {
        const io = getIO();
        io.to(assessmentId).emit('assessment_completed', updatedAssessment);
        console.log(`[Socket] Emitted assessment_completed to room ${assessmentId}`);
      } catch (e) {
        console.error('[Socket] Failed to emit completion event', e);
      }

      console.log(`[Worker] Job ${job.id} finished successfully.`);
      return { success: true, assessmentId };
    } catch (error: any) {
      // 4. If it fails, update the MongoDB document to 'failed'
      console.error(`[Worker] Job ${job.id} failed:`, error.message);
      await Assessment.findByIdAndUpdate(assessmentId, {
        status: 'failed',
        error: error.message || 'Unknown error occurred during generation',
      });
      
      // 5. Emit real-time failure event
      try {
        const io = getIO();
        io.to(assessmentId).emit('assessment_failed', { error: error.message });
      } catch (e) {
         // ignore
      }

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
