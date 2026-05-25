import { GoogleGenAI, Type, Schema } from '@google/genai';
import dotenv from 'dotenv';

dotenv.config();

const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY,
});

// Define the exact JSON schema we want the AI to return
const questionSchema: Schema = {
  type: Type.OBJECT,
  properties: {
    text: {
      type: Type.STRING,
      description: 'The question text itself.',
    },
    difficulty: {
      type: Type.STRING,
      enum: ['Easy', 'Moderate', 'Hard'],
      description: 'The difficulty level of the question.',
    },
    marks: {
      type: Type.INTEGER,
      description: 'The marks allocated to this question.',
    },
  },
  required: ['text', 'difficulty', 'marks'],
};

const sectionSchema: Schema = {
  type: Type.OBJECT,
  properties: {
    title: {
      type: Type.STRING,
      description: 'The title of the section (e.g., Section A).',
    },
    instruction: {
      type: Type.STRING,
      description: 'Instructions for this section (e.g., Attempt all questions).',
    },
    questions: {
      type: Type.ARRAY,
      items: questionSchema,
      description: 'The list of questions in this section.',
    },
  },
  required: ['title', 'instruction', 'questions'],
};

const assessmentSchema: Schema = {
  type: Type.OBJECT,
  properties: {
    title: {
      type: Type.STRING,
      description: 'A professional title for the exam.',
    },
    sections: {
      type: Type.ARRAY,
      items: sectionSchema,
      description: 'The sections comprising the exam paper.',
    },
    answerKey: {
      type: Type.ARRAY,
      items: { type: Type.STRING },
      description: 'A list of short answers matching the questions generated, in order.',
    },
  },
  required: ['title', 'sections', 'answerKey'],
};

export const generateAssessmentStructure = async (
  topic: string,
  difficulty: string,
  questionsCount: number
) => {
  const prompt = `You are an expert curriculum designer. Generate a highly structured exam paper on the topic of "${topic}".
  The overall difficulty should be "${difficulty}".
  Generate exactly ${questionsCount} questions in total, appropriately divided into logical sections (e.g., Section A: Short Answer, Section B: Long Answer).
  Ensure questions are a mix of difficulties if possible, but leaning towards the requested overall difficulty.`;

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: prompt,
      config: {
        responseMimeType: 'application/json',
        responseSchema: assessmentSchema,
        temperature: 0.7,
      },
    });

    if (!response.text) {
      throw new Error('No text returned from Gemini API.');
    }

    // The response is guaranteed to be a JSON string matching our schema
    const data = JSON.parse(response.text);
    return data;
  } catch (error) {
    console.error('Error in AI generation:', error);
    throw error;
  }
};
