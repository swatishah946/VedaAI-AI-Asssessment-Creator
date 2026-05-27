'use client';

import React, { useEffect, useState } from 'react';
import { useAssessmentStore } from '../store/useAssessmentStore';
import { socketService } from '../lib/socket';

export default function LoadingState() {
  const { assessmentId, setResult, setError, setView } = useAssessmentStore();
  const [dots, setDots] = useState('');

  useEffect(() => {
    // Animation for loading dots
    const interval = setInterval(() => {
      setDots((prev) => (prev.length >= 3 ? '' : prev + '.'));
    }, 500);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    if (!assessmentId) return;

    // Connect and join the specific room for this assessment
    socketService.connect();
    socketService.joinRoom(assessmentId);

    // Listen for the success event
    socketService.onAssessmentCompleted((data) => {
      console.log('Assessment Completed!', data);
      
      // Attempt to parse result if it is a string
      let parsedResult = data.result;
      if (typeof parsedResult === 'string') {
        try {
          let cleaned = parsedResult.trim();
          if (cleaned.startsWith('```')) {
            cleaned = cleaned.replace(/^```(json)?\n?/, '').replace(/\n?```$/, '');
          }
          parsedResult = JSON.parse(cleaned);
        } catch (e) {
          console.error("Failed to parse result JSON", e);
        }
      }
      
      setResult(parsedResult);
      setView('review');
    });

    // Listen for failure event
    socketService.onAssessmentFailed((data) => {
      console.error('Assessment Failed', data);
      setError('AI generation failed. Please try again.');
    });

    // Cleanup on unmount
    return () => {
      socketService.disconnect();
    };
  }, [assessmentId, setResult, setError]);

  return (
    <div style={{
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      height: '400px',
      background: '#ffffff',
      borderRadius: '12px',
      boxShadow: '0 2px 8px rgba(0,0,0,0.04)'
    }}>
      <div className="spinner" style={{
        width: '50px',
        height: '50px',
        border: '4px solid #f3f3f3',
        borderTop: '4px solid var(--primary-color)',
        borderRadius: '50%',
        animation: 'spin 1s linear infinite',
        marginBottom: '24px'
      }} />
      <style>{`
        @keyframes spin { 0% { transform: rotate(0deg); } 100% { transform: rotate(360deg); } }
      `}</style>
      <h2 style={{ fontSize: '20px', fontWeight: 600 }}>Generating Question Paper{dots}</h2>
      <p style={{ color: 'var(--text-muted)', marginTop: '8px' }}>
        Our AI is structuring the sections and calculating marks...
      </p>
    </div>
  );
}
