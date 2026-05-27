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

// Endpoint to trigger AI generation
router.post('/generate', async (req: Request, res: Response): Promise<void> => {
  try {
    const { additionalInfo, dueDate, questionsList } = req.body;

    // We'll use additionalInfo as the topic if available, otherwise a default
    const topic = additionalInfo || 'General Assessment';

    // 1. Create a new assessment record in MongoDB
    const assessment = new Assessment({
      topic,
      dueDate,
      questionsList,
      status: 'processing',
    });
    await assessment.save();

    // 2. Add job to BullMQ
    await assessmentQueue.add('generateAssessment', {
      assessmentId: assessment._id,
      topic,
      questionsList,
    });

    res.status(202).json({
      success: true,
      message: 'Assessment generation job queued successfully.',
      assessmentId: assessment._id,
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
