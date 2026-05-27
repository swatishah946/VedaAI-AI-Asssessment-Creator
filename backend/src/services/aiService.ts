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
  questionsList: any[],
  materialContext?: string
) => {
  let structureInstructions = '';
  if (questionsList && questionsList.length > 0) {
    structureInstructions = 'The paper MUST strictly contain the following sections and exactly this number of questions:\n';
    questionsList.forEach((q: any) => {
      structureInstructions += `- Section: ${q.type}. Exactly ${q.count} questions. Each question is worth ${q.marks} marks.\n`;
    });
  } else {
    structureInstructions = 'Generate a mix of 5 Multiple Choice and 5 Short Answer questions.\n';
  }

  const prompt = `You are an expert curriculum designer. Generate a highly structured exam paper based on the following instructions:
  Topic or Additional Information: "${topic}".
  
  ${materialContext ? `CRITICAL SOURCE MATERIAL: You MUST extract information and base your questions strictly on the following text context:\n"""\n${materialContext.substring(0, 30000)}\n"""\n` : ''}
  
  ${structureInstructions}
  
  Ensure the output strictly adheres to the requested number of questions and marks.`;

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

    let cleanedText = response.text.trim();
    if (cleanedText.startsWith('```')) {
      // Remove ```json at the start and ``` at the end
      cleanedText = cleanedText.replace(/^```(json)?\n?/, '').replace(/\n?```$/, '');
    }

    const data = JSON.parse(cleanedText);
    return data;
  } catch (error) {
    console.error('Error in AI generation:', error);
    throw error;
  }
};
