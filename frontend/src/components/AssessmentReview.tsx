'use client';

import React, { useState } from 'react';
import { useAssessmentStore } from '../store/useAssessmentStore';
import { ArrowLeft, ArrowRight, RotateCcw } from 'lucide-react';

export default function AssessmentReview() {
  const { result, setResult, setView, setAssessmentId } = useAssessmentStore();
  
  // Create a local editable copy of the result
  const [editableResult, setEditableResult] = useState(result);

  if (!editableResult) return null;

  const handlePublish = async () => {
    // 1. Update the local store to hold the newly edited result
    setResult(editableResult);
    
    // 2. Ideally, we would send a PUT request to the backend to update MongoDB
    // with the new edited result string so that it saves correctly in history!
    try {
      const assessmentId = useAssessmentStore.getState().assessmentId;
      if (assessmentId) {
        await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/assessments/${assessmentId}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ result: editableResult })
        });
      }
    } catch (e) {
      console.error("Failed to update backend with edits", e);
    }
    
    // 3. Move to final view
    setView('result');
  };

  const handleRegenerate = () => {
    setAssessmentId('');
    setView('form');
  };

  const handleQuestionChange = (sIdx: number, qIdx: number, field: string, value: any) => {
    const newResult = { ...editableResult };
    newResult.sections[sIdx].questions[qIdx] = {
      ...newResult.sections[sIdx].questions[qIdx],
      [field]: value
    };
    setEditableResult(newResult);
  };

  const handleAnswerChange = (idx: number, value: string) => {
    const newResult = { ...editableResult };
    newResult.answerKey[idx] = value;
    setEditableResult(newResult);
  };

  return (
    <div style={{ maxWidth: '800px', margin: '0 auto', width: '100%' }}>
      {/* Progress Bar Header */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '16px' }}>
        <div style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#10b981' }}></div>
        <div>
          <h1 style={{ fontSize: '18px', fontWeight: 600, margin: 0 }}>Review Draft</h1>
          <p style={{ fontSize: '12px', color: 'var(--text-muted)', margin: 0 }}>Edit questions and answers before publishing</p>
        </div>
      </div>

      <div style={{ height: '2px', background: '#e5e7eb', marginBottom: '32px', display: 'flex' }}>
        <div style={{ width: '50%', background: '#10b981' }}></div>
        <div style={{ width: '50%', background: '#4b5563' }}></div>
      </div>

      <div className="card" style={{ padding: '32px' }}>
        <h2 style={{ fontSize: '20px', fontWeight: 700, marginBottom: '24px', textAlign: 'center' }}>{editableResult.title}</h2>
        
        {(editableResult.sections || []).map((section: any, sIdx: number) => (
          <div key={sIdx} style={{ marginBottom: '40px' }}>
            <h3 style={{ fontSize: '16px', fontWeight: 600, marginBottom: '8px', color: '#374151', borderBottom: '1px solid #e5e7eb', paddingBottom: '8px' }}>
              {section.title || `Section ${sIdx + 1}`}
            </h3>
            
            <div style={{ display: 'flex', flexDirection: 'column', gap: '20px', marginTop: '16px' }}>
              {(section.questions || []).map((q: any, qIdx: number) => (
                <div key={qIdx} style={{ background: '#f9fafb', padding: '16px', borderRadius: '8px', border: '1px solid #f3f4f6' }}>
                  <div style={{ display: 'flex', gap: '12px', marginBottom: '12px' }}>
                    <div style={{ fontWeight: 600, color: '#6b7280', marginTop: '8px' }}>{qIdx + 1}.</div>
                    <textarea 
                      style={{ flex: 1, width: '100%', padding: '12px', borderRadius: '8px', border: '1px solid #d1d5db', fontSize: '14px', fontFamily: 'inherit', minHeight: '60px' }}
                      value={q.text || ''}
                      onChange={(e) => handleQuestionChange(sIdx, qIdx, 'text', e.target.value)}
                    />
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '16px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <label style={{ fontSize: '12px', fontWeight: 500, color: '#6b7280' }}>Difficulty:</label>
                      <select 
                        value={q.difficulty || 'Moderate'} 
                        onChange={(e) => handleQuestionChange(sIdx, qIdx, 'difficulty', e.target.value)}
                        style={{ padding: '4px 8px', borderRadius: '4px', border: '1px solid #d1d5db', fontSize: '12px' }}
                      >
                        <option>Easy</option>
                        <option>Moderate</option>
                        <option>Hard</option>
                      </select>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <label style={{ fontSize: '12px', fontWeight: 500, color: '#6b7280' }}>Marks:</label>
                      <input 
                        type="number" 
                        value={q.marks || 0} 
                        onChange={(e) => handleQuestionChange(sIdx, qIdx, 'marks', parseInt(e.target.value) || 0)}
                        style={{ padding: '4px 8px', borderRadius: '4px', border: '1px solid #d1d5db', fontSize: '12px', width: '60px' }}
                      />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}

        {/* Editable Answer Key */}
        {editableResult.answerKey && editableResult.answerKey.length > 0 && (
          <div style={{ marginTop: '40px', borderTop: '2px solid #e5e7eb', paddingTop: '32px' }}>
            <h3 style={{ fontSize: '16px', fontWeight: 600, marginBottom: '16px', color: '#374151' }}>Answer Key</h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              {editableResult.answerKey.map((ans: string, idx: number) => (
                <div key={idx} style={{ display: 'flex', gap: '12px' }}>
                  <div style={{ fontWeight: 600, color: '#6b7280', marginTop: '8px' }}>{idx + 1}.</div>
                  <textarea 
                    style={{ flex: 1, width: '100%', padding: '12px', borderRadius: '8px', border: '1px solid #d1d5db', fontSize: '13px', fontFamily: 'inherit', minHeight: '40px' }}
                    value={ans}
                    onChange={(e) => handleAnswerChange(idx, e.target.value)}
                  />
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      <div className="bottom-actions" style={{ display: 'flex', justifyContent: 'space-between', marginTop: '32px' }}>
        <button 
          onClick={handleRegenerate}
          style={{ display: 'flex', alignItems: 'center', gap: '8px', background: 'white', border: '1px solid #e5e7eb', padding: '12px 24px', borderRadius: '30px', fontWeight: 600, cursor: 'pointer', color: '#ef4444' }}
        >
          <RotateCcw size={16} /> Regenerate Draft
        </button>
        <button 
          onClick={handlePublish}
          style={{ display: 'flex', alignItems: 'center', gap: '8px', background: '#111827', color: 'white', border: 'none', padding: '12px 32px', borderRadius: '30px', fontWeight: 600, cursor: 'pointer' }}
        >
          Publish Assessment <ArrowRight size={16} />
        </button>
      </div>
    </div>
  );
}
