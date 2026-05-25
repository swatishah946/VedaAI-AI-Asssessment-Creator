import { Router, Request, Response } from 'express';
import Dummy from '../models/Dummy';

const router = Router();

router.post('/', async (req: Request, res: Response): Promise<void> => {
  try {
    const { message } = req.body;
    
    if (!message) {
      res.status(400).json({ error: 'Message is required' });
      return;
    }

    const newDummy = new Dummy({ message });
    const savedDummy = await newDummy.save();

    res.status(201).json({
      success: true,
      data: savedDummy
    });
  } catch (error) {
    console.error('Error saving dummy data:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

router.get('/', async (req: Request, res: Response): Promise<void> => {
  try {
    const dummies = await Dummy.find().sort({ createdAt: -1 });
    res.status(200).json({
      success: true,
      data: dummies
    });
  } catch (error) {
    res.status(500).json({ error: 'Internal server error' });
  }
});

export default router;
