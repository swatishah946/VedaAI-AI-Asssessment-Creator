import { create } from 'zustand';

// Types mimicking the backend response
export interface Question {
  text: string;
  difficulty: 'Easy' | 'Moderate' | 'Hard';
  marks: number;
}

export interface Section {
  title: string;
  instruction: string;
  questions: Question[];
}

export interface AssessmentResult {
  title: string;
  sections: Section[];
  answerKey: string[];
}

interface AssessmentState {
  view: 'list' | 'form' | 'loading' | 'review' | 'result';
  assessmentId: string | null;
  result: AssessmentResult | null;
  history: any[]; // Stores fetched assessments
  error: string | null;
  
  // Actions
  setView: (view: 'list' | 'form' | 'loading' | 'review' | 'result') => void;
  setAssessmentId: (id: string) => void;
  setResult: (result: AssessmentResult) => void;
  setHistory: (history: any[]) => void;
  setError: (error: string) => void;
  reset: () => void;
}

export const useAssessmentStore = create<AssessmentState>((set) => ({
  view: 'list', // Default to list view
  assessmentId: null,
  result: null,
  history: [],
  error: null,

  setView: (view) => set({ view }),
  setAssessmentId: (id) => set({ assessmentId: id }),
  setResult: (result) => set({ result }),
  setHistory: (history) => set({ history }),
  setError: (error) => set({ error, view: 'form' }),
  reset: () => set({ view: 'list', assessmentId: null, result: null, error: null }),
}));
