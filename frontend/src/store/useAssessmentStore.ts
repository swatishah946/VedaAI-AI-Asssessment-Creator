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
  view: 'form' | 'loading' | 'result';
  assessmentId: string | null;
  result: AssessmentResult | null;
  error: string | null;
  
  // Actions
  setView: (view: 'form' | 'loading' | 'result') => void;
  setAssessmentId: (id: string) => void;
  setResult: (result: AssessmentResult) => void;
  setError: (error: string) => void;
  reset: () => void;
}

export const useAssessmentStore = create<AssessmentState>((set) => ({
  view: 'form',
  assessmentId: null,
  result: null,
  error: null,

  setView: (view) => set({ view }),
  setAssessmentId: (id) => set({ assessmentId: id }),
  setResult: (result) => set({ result, view: 'result' }),
  setError: (error) => set({ error, view: 'form' }),
  reset: () => set({ view: 'form', assessmentId: null, result: null, error: null }),
}));
