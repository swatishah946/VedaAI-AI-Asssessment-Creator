'use client';

import React, { useRef } from 'react';
import { useAssessmentStore } from '../store/useAssessmentStore';
import { Download, RotateCcw } from 'lucide-react';
// @ts-ignore
import html2pdf from 'html2pdf.js';

export default function AssessmentResult() {
  const { result, setView, setAssessmentId } = useAssessmentStore();
  const printRef = useRef<HTMLDivElement>(null);

  if (!result) return null;

  const handleDownloadPDF = () => {
    const element = printRef.current;
    if (!element) return;

    const opt = {
      margin: 10,
      filename: `Assessment_${result.title.replace(/\s+/g, '_')}.pdf`,
      image: { type: 'jpeg', quality: 0.98 },
      html2canvas: { scale: 2 },
      jsPDF: { unit: 'mm', format: 'a4', orientation: 'portrait' }
    };

    html2pdf().set(opt).from(element).save();
  };

  const handleRegenerate = () => {
    // Reset to form
    setAssessmentId('');
    setView('form');
  };

  return (
    <div>
      {/* Action Bar */}
      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '24px' }}>
        <h2 style={{ fontSize: '20px', fontWeight: 600 }}>Generated Assessment</h2>
        <div style={{ display: 'flex', gap: '12px' }}>
          <button 
            onClick={handleRegenerate}
            style={{
              display: 'flex', alignItems: 'center', gap: '8px',
              background: '#f0f2f5', border: 'none', padding: '10px 16px',
              borderRadius: '8px', cursor: 'pointer', fontWeight: 500
            }}
          >
            <RotateCcw size={18} /> Regenerate
          </button>
          <button 
            onClick={handleDownloadPDF}
            style={{
              display: 'flex', alignItems: 'center', gap: '8px',
              background: 'var(--text-color)', color: 'white', border: 'none', 
              padding: '10px 16px', borderRadius: '8px', cursor: 'pointer', fontWeight: 500
            }}
          >
            <Download size={18} /> Download as PDF
          </button>
        </div>
      </div>

      {/* Actual Paper (Print Area) */}
      <div ref={printRef} style={{
        background: 'white',
        padding: '40px',
        borderRadius: '8px',
        boxShadow: '0 2px 8px rgba(0,0,0,0.05)',
        color: 'black',
        fontFamily: '"Times New Roman", Times, serif', // Real exam feel
        maxWidth: '210mm', // A4 width approximation
        margin: '0 auto'
      }}>
        
        {/* Header Information */}
        <div style={{ textAlign: 'center', borderBottom: '2px solid black', paddingBottom: '16px', marginBottom: '24px' }}>
          <h1 style={{ fontSize: '24px', margin: '0 0 8px 0' }}>Delhi Public School</h1>
          <h2 style={{ fontSize: '18px', margin: '0 0 16px 0', fontWeight: 'normal' }}>Assessment: {result.title}</h2>
          <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '14px' }}>
            <span>Time Allowed: 45 minutes</span>
            <span>Maximum Marks: {result.sections.reduce((acc, sec) => acc + sec.questions.reduce((a, q) => a + q.marks, 0), 0)}</span>
          </div>
        </div>

        {/* Student Detail Lines */}
        <div style={{ marginBottom: '32px', fontSize: '14px', lineHeight: '2' }}>
          <div>Name: ________________________________________________</div>
          <div style={{ display: 'flex', gap: '32px' }}>
            <span>Roll Number: _______________</span>
            <span>Section: _______________</span>
          </div>
        </div>

        {/* General Instructions */}
        <div style={{ fontStyle: 'italic', marginBottom: '24px', fontSize: '14px' }}>
          General Instructions: All questions are compulsory unless stated otherwise.
        </div>

        {/* Sections */}
        {result.sections.map((section, sIdx) => (
          <div key={sIdx} style={{ marginBottom: '32px' }}>
            <h3 style={{ textAlign: 'center', fontSize: '18px', marginBottom: '8px' }}>{section.title}</h3>
            {section.instruction && (
              <div style={{ fontStyle: 'italic', fontSize: '14px', marginBottom: '16px' }}>
                {section.instruction}
              </div>
            )}

            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              {section.questions.map((q, qIdx) => (
                <div key={qIdx} style={{ display: 'flex', gap: '8px', fontSize: '15px' }}>
                  <div style={{ fontWeight: 'bold' }}>{qIdx + 1}.</div>
                  <div style={{ flex: 1 }}>
                    <div style={{ display: 'inline' }}>
                      <span style={{
                        display: 'inline-block',
                        background: q.difficulty === 'Easy' ? '#dcfce7' : q.difficulty === 'Moderate' ? '#fef08a' : '#fee2e2',
                        color: q.difficulty === 'Easy' ? '#166534' : q.difficulty === 'Moderate' ? '#854d0e' : '#991b1b',
                        padding: '2px 8px',
                        borderRadius: '12px',
                        fontSize: '11px',
                        fontFamily: 'sans-serif',
                        marginRight: '8px',
                        fontWeight: 'bold'
                      }}>
                        {q.difficulty}
                      </span>
                      {q.text}
                    </div>
                  </div>
                  <div style={{ fontWeight: 'bold', whiteSpace: 'nowrap' }}>[{q.marks} Marks]</div>
                </div>
              ))}
            </div>
          </div>
        ))}

        <div style={{ textAlign: 'center', marginTop: '48px', fontWeight: 'bold' }}>
          *** END OF QUESTION PAPER ***
        </div>
      </div>
    </div>
  );
}
