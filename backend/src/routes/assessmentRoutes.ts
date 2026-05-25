import { Router, Request, Response } from 'express';
import { assessmentQueue } from '../queue/assessmentQueue';

const router = Router();

router.post('/generate', async (req: Request, res: Response): Promise<void> => {
  try {
    const { topic, difficulty, questionsCount } = req.body;

    if (!topic || !questionsCount) {
      res.status(400).json({ error: 'Topic and questionsCount are required.' });
      return;
    }

    // Define the job payload
    const payload = {
      topic,
      difficulty: difficulty || 'Medium',
      questionsCount,
      createdAt: new Date().toISOString()
    };

    // Add a job to the queue
    const job = await assessmentQueue.add('generate-assessment', payload);

    // Immediately return the job ID so the frontend can start tracking it
    res.status(202).json({
      success: true,
      message: 'Assessment generation job queued successfully.',
      jobId: job.id,
      status: 'processing'
    });
  } catch (error) {
    console.error('Error queuing assessment job:', error);
    res.status(500).json({ error: 'Internal server error while queuing job.' });
  }
});

export default router;
