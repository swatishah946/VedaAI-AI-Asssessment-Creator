'use client';

import React, { useState, useMemo } from 'react';
import { useAssessmentStore } from '../store/useAssessmentStore';
import { CloudUpload, Plus, X, Mic, Calendar } from 'lucide-react';

interface QuestionConfig {
  id: string;
  type: string;
  count: number;
  marks: number;
}

export default function AssessmentForm() {
  const { setView, setAssessmentId, setError } = useAssessmentStore();
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const [additionalInfo, setAdditionalInfo] = useState('');
  const [dueDate, setDueDate] = useState('');
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  
  const [questionsList, setQuestionsList] = useState<QuestionConfig[]>([
    { id: '1', type: 'Multiple Choice Questions', count: 4, marks: 1 },
    { id: '2', type: 'Short Questions', count: 3, marks: 2 },
    { id: '3', type: 'Diagram/Graph-Based Questions', count: 5, marks: 5 },
    { id: '4', type: 'Numerical Problems', count: 5, marks: 5 }
  ]);

  const totalQuestions = useMemo(() => questionsList.reduce((acc, q) => acc + q.count, 0), [questionsList]);
  const totalMarks = useMemo(() => questionsList.reduce((acc, q) => acc + (q.count * q.marks), 0), [questionsList]);

  const addQuestionType = () => {
    setQuestionsList([...questionsList, { 
      id: Math.random().toString(36).substr(2, 9), 
      type: 'Multiple Choice Questions', 
      count: 1, 
      marks: 1 
    }]);
  };

  const updateQuestion = (id: string, field: keyof QuestionConfig, value: any) => {
    setQuestionsList(questionsList.map(q => {
      if (q.id === id) {
        if (field === 'count' || field === 'marks') {
          return { ...q, [field]: Math.max(1, value) };
        }
        return { ...q, [field]: value };
      }
      return q;
    }));
  };

  const removeQuestion = (id: string) => {
    setQuestionsList(questionsList.filter(q => q.id !== id));
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      setSelectedFile(e.target.files[0]);
    }
  };

  const handleSubmit = async () => {
    if (questionsList.length === 0) {
      alert("Please add at least one question type.");
      return;
    }

    setIsSubmitting(true);

    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/assessments/generate`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          additionalInfo,
          dueDate,
          questionsList
        })
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to trigger generation');
      }

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
    <div style={{ maxWidth: '800px', margin: '0 auto', width: '100%' }}>
      {/* Top Header matching Figma */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '16px' }}>
        <div style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#10b981' }}></div>
        <div>
          <h1 style={{ fontSize: '18px', fontWeight: 600, margin: 0 }}>Create Assignment</h1>
          <p style={{ fontSize: '12px', color: 'var(--text-muted)', margin: 0 }}>Set up a new assignment for your students</p>
        </div>
      </div>

      <div style={{ height: '2px', background: '#e5e7eb', marginBottom: '32px', display: 'flex' }}>
        <div style={{ width: '50%', background: '#4b5563' }}></div>
      </div>

      <div className="card">
        <h2 className="form-title">Assignment Details</h2>
        <p className="form-subtitle">Basic information about your assignment</p>

        {/* Dropzone */}
        <div className="file-dropzone">
          <CloudUpload size={32} color="#6b7280" style={{ margin: '0 auto 12px' }} />
          {selectedFile ? (
            <p style={{ fontWeight: 600, color: '#10b981', marginBottom: '16px' }}>{selectedFile.name}</p>
          ) : (
            <>
              <p style={{ fontWeight: 600, marginBottom: '4px' }}>Choose a file or drag & drop it here</p>
              <p style={{ fontSize: '12px', color: 'var(--text-muted)', marginBottom: '16px' }}>JPEG, PNG, upto 10MB</p>
            </>
          )}
          
          <label style={{ display: 'inline-block', padding: '8px 24px', background: 'transparent', border: '1px solid #d1d5db', borderRadius: '30px', cursor: 'pointer', fontSize: '12px', fontWeight: 500 }}>
            Browse Files
            <input 
              type="file" 
              accept=".pdf,image/png,image/jpeg"
              style={{ display: 'none' }} 
              onChange={handleFileChange}
            />
          </label>
        </div>
        <p style={{ textAlign: 'center', fontSize: '12px', color: 'var(--text-muted)', marginBottom: '32px' }}>Upload images of your preferred document/image</p>

        {/* Due Date */}
        <div className="form-group">
          <label className="form-label">Due Date</label>
          <div style={{ position: 'relative' }}>
            <input 
              type="date" 
              className="form-input" 
              value={dueDate}
              onChange={(e) => setDueDate(e.target.value)}
              style={{ color: dueDate ? 'var(--text-color)' : 'var(--text-muted)' }}
            />
          </div>
        </div>

        {/* Question Types */}
        <div className="form-group" style={{ marginTop: '32px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '16px', fontSize: '12px', fontWeight: 600 }}>
            <span>Question Type</span>
            <div style={{ display: 'flex', gap: '40px' }}>
              <span>No. of Questions</span>
              <span>Marks</span>
            </div>
          </div>

          {questionsList.map((q) => (
            <div key={q.id} className="question-type-row">
              <div style={{ flex: 1, position: 'relative' }}>
                <select 
                  className="form-select" 
                  value={q.type}
                  onChange={(e) => updateQuestion(q.id, 'type', e.target.value)}
                  style={{ appearance: 'none', paddingRight: '32px' }}
                >
                  <option>Multiple Choice Questions</option>
                  <option>Short Questions</option>
                  <option>Diagram/Graph-Based Questions</option>
                  <option>Numerical Problems</option>
                  <option>Long Essay</option>
                </select>
              </div>
              
              <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                <X size={16} color="#9ca3af" className="row-delete-btn" style={{ cursor: 'pointer' }} onClick={() => removeQuestion(q.id)} />
                
                <div className="stepper-control">
                  <button className="stepper-btn" onClick={() => updateQuestion(q.id, 'count', q.count - 1)}>-</button>
                  <span className="stepper-value">{q.count}</span>
                  <button className="stepper-btn" onClick={() => updateQuestion(q.id, 'count', q.count + 1)}>+</button>
                </div>

                <div className="stepper-control">
                  <button className="stepper-btn" onClick={() => updateQuestion(q.id, 'marks', q.marks - 1)}>-</button>
                  <span className="stepper-value">{q.marks}</span>
                  <button className="stepper-btn" onClick={() => updateQuestion(q.id, 'marks', q.marks + 1)}>+</button>
                </div>
              </div>
            </div>
          ))}

          <button 
            type="button" 
            onClick={addQuestionType}
            style={{ display: 'flex', alignItems: 'center', gap: '8px', background: 'transparent', border: 'none', cursor: 'pointer', fontWeight: 600, fontSize: '12px', marginTop: '16px' }}
          >
            <div style={{ background: '#111827', color: 'white', borderRadius: '50%', width: '20px', height: '20px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <Plus size={14} />
            </div>
            Add Question Type
          </button>
        </div>

        <div style={{ textAlign: 'right', fontSize: '12px', fontWeight: 600, marginTop: '24px', marginBottom: '32px' }}>
          <div>Total Questions : {totalQuestions}</div>
          <div>Total Marks : {totalMarks}</div>
        </div>

        {/* Additional Info */}
        <div className="form-group">
          <label className="form-label" style={{ fontSize: '12px' }}>Additional Information (For better output)</label>
          <div style={{ position: 'relative' }}>
            <textarea 
              className="form-textarea"
              placeholder="e.g Generate a question paper for 3 hour exam duration..."
              value={additionalInfo}
              onChange={(e) => setAdditionalInfo(e.target.value)}
              style={{ minHeight: '80px', paddingBottom: '32px', background: '#f8f9fa', border: 'none' }}
            />
            <Mic size={16} color="#9ca3af" style={{ position: 'absolute', bottom: '16px', right: '16px', cursor: 'pointer' }} />
          </div>
        </div>
      </div>

      <div className="bottom-actions">
        <button 
          onClick={() => setView('list')}
          style={{ background: 'white', border: '1px solid #e5e7eb', padding: '12px 32px', borderRadius: '30px', fontWeight: 600, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '8px' }}
        >
          &larr; Previous
        </button>
        <button 
          onClick={handleSubmit}
          disabled={isSubmitting}
          style={{ background: '#111827', color: 'white', border: 'none', padding: '12px 32px', borderRadius: '30px', fontWeight: 600, cursor: isSubmitting ? 'not-allowed' : 'pointer', display: 'flex', alignItems: 'center', gap: '8px' }}
        >
          {isSubmitting ? 'Generating...' : 'Next \u2192'}
        </button>
      </div>
    </div>
  );
}
