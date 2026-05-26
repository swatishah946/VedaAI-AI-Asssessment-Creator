import { Router, Request, Response } from 'express';
import { assessmentQueue } from '../queue/assessmentQueue';
import Assessment from '../models/Assessment';

const router = Router();

// Fetch all assessments (history)
router.get('/', async (req: Request, res: Response): Promise<void> => {
  try {
    const assessments = await Assessment.find().sort({ createdAt: -1 }); // Newest first
    res.status(200).json(assessments);
  } catch (error) {
    console.error('Error fetching assessments:', error);
    res.status(500).json({ error: 'Failed to fetch assessments' });
  }
});

// Endpoint to fetch an assessment by ID
router.get('/:id', async (req: Request, res: Response): Promise<void> => {
  try {
    const assessment = await Assessment.findById(req.params.id);
    
    if (!assessment) {
      res.status(404).json({ error: 'Assessment not found' });
      return;
    }

    res.status(200).json({
      success: true,
      data: assessment
    });
  } catch (error) {
    console.error('Error fetching assessment:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Endpoint to generate an assessment
router.post('/generate', async (req: Request, res: Response): Promise<void> => {
  try {
    const { topic, difficulty, questionsCount } = req.body;

    if (!topic || !questionsCount) {
      res.status(400).json({ error: 'Topic and questionsCount are required.' });
      return;
    }

    // 1. Create a new document in MongoDB with status: 'processing'
    const newAssessment = new Assessment({
      topic,
      difficulty: difficulty || 'Moderate',
      questionsCount,
      status: 'processing'
    });
    
    const savedAssessment = await newAssessment.save();

    // 2. Define the job payload, including the MongoDB document ID
    const payload = {
      assessmentId: savedAssessment._id,
      topic,
      difficulty: savedAssessment.difficulty,
      questionsCount
    };

    // 3. Add the job to the queue
    const job = await assessmentQueue.add('generate-assessment', payload);

    // 4. Return the database ID so the frontend can poll or listen for it
    res.status(202).json({
      success: true,
      message: 'Assessment generation job queued successfully.',
      assessmentId: savedAssessment._id,
      jobId: job.id,
      status: 'processing'
    });
  } catch (error) {
    console.error('Error queuing assessment job:', error);
    res.status(500).json({ error: 'Internal server error while queuing job.' });
  }
});

// DELETE /api/assessments/:id
router.delete('/:id', async (req: Request, res: Response): Promise<void> => {
  try {
    const deleted = await Assessment.findByIdAndDelete(req.params.id);
    if (!deleted) {
      res.status(404).json({ error: 'Assessment not found' });
      return;
    }
    res.status(200).json({ message: 'Assessment deleted successfully' });
  } catch (error) {
    console.error('Error deleting assessment:', error);
    res.status(500).json({ error: 'Failed to delete assessment' });
  }
});

export default router;
