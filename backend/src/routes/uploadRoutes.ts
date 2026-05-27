import { Router, Request, Response } from 'express';
import multer from 'multer';

// Polyfills required for newer versions of pdfjs-dist in Node.js
if (typeof globalThis.DOMMatrix === 'undefined') {
  (globalThis as any).DOMMatrix = class DOMMatrix { };
}
if (typeof globalThis.Path2D === 'undefined') {
  (globalThis as any).Path2D = class Path2D { };
}
if (typeof globalThis.ImageData === 'undefined') {
  (globalThis as any).ImageData = class ImageData { };
}

// pdf-parse doesn't have a perfect ES default export in some environments
const pdfParse = require('pdf-parse');

const router = Router();

// Use memory storage for quick buffer access without writing to disk
const upload = multer({ 
  storage: multer.memoryStorage(),
  limits: { fileSize: 10 * 1024 * 1024 } // 10MB limit
});

router.post('/upload-material', upload.single('file'), async (req: Request, res: Response): Promise<void> => {
  try {
    if (!req.file) {
      res.status(400).json({ error: 'No file uploaded' });
      return;
    }

    const { mimetype, buffer } = req.file;
    let extractedText = '';

    if (mimetype === 'application/pdf') {
      const data = await pdfParse(buffer);
      extractedText = data.text;
    } else if (mimetype === 'text/plain' || mimetype === 'text/csv' || mimetype === 'text/markdown') {
      extractedText = buffer.toString('utf-8');
    } else {
      res.status(400).json({ error: 'Unsupported file type. Please upload a PDF or Text file.' });
      return;
    }

    // Clean up excessive whitespace
    extractedText = extractedText.replace(/\s+/g, ' ').trim();

    res.json({ text: extractedText });
  } catch (error) {
    console.error('File parsing error:', error);
    res.status(500).json({ error: 'Failed to parse file content' });
  }
});

export default router;
