'use client';

import React, { useState } from 'react';
import { useAssessmentStore } from '../store/useAssessmentStore';

export default function AssessmentForm() {
  const [topic, setTopic] = useState('');
  const [difficulty, setDifficulty] = useState<'Easy' | 'Moderate' | 'Hard'>('Moderate');
  const [questionsCount, setQuestionsCount] = useState<number | ''>(5);
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const { setView, setAssessmentId, setError } = useAssessmentStore();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!topic.trim()) {
      alert("Please enter an assignment topic or additional information.");
      return;
    }
    
    if (!questionsCount || questionsCount <= 0 || questionsCount > 20) {
      alert("Please enter a valid number of questions (1-20).");
      return;
    }

    setIsSubmitting(true);

    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/assessments/generate`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          topic,
          difficulty,
          questionsCount: Number(questionsCount)
        })
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to trigger generation');
      }

      // Generation started successfully! Update the store.
      setAssessmentId(data.assessmentId);
      setView('loading');

    } catch (err: any) {
      console.error(err);
      setError(err.message || 'An unexpected error occurred');
      alert("Error: " + err.message);
      setIsSubmitting(false);
    }
  };

  return (
    <div className="card">
      <h2 className="form-title">Assignment Details</h2>
      <p className="form-subtitle">Basic information about your assignment</p>

      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label className="form-label">Assignment Topic / Additional Information</label>
          <textarea 
            className="form-textarea"
            placeholder="e.g. Generate a question paper on The Solar System for Grade 8..."
            value={topic}
            onChange={(e) => setTopic(e.target.value)}
          />
        </div>

        <div className="row">
          <div className="col form-group">
            <label className="form-label">Difficulty Level</label>
            <select 
              className="form-select"
              value={difficulty}
              onChange={(e) => setDifficulty(e.target.value as any)}
            >
              <option value="Easy">Easy</option>
              <option value="Moderate">Moderate</option>
              <option value="Hard">Hard</option>
            </select>
          </div>

          <div className="col form-group">
            <label className="form-label">Total Questions</label>
            <input 
              type="number"
              className="form-input"
              value={questionsCount}
              onChange={(e) => setQuestionsCount(e.target.value === '' ? '' : parseInt(e.target.value))}
              min="1"
              max="20"
            />
          </div>
        </div>

        <div style={{ marginTop: '32px' }}>
          <button type="submit" className="primary-btn" disabled={isSubmitting}>
            {isSubmitting ? 'Queueing Job...' : 'Generate with AI'}
          </button>
          <div style={{ clear: 'both' }}></div>
        </div>
      </form>
    </div>
  );
}
