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
      {/* Action Bar / AI Message Bubble */}
      <div style={{ 
        background: '#111827', 
        color: 'white',
        padding: '24px', 
        borderRadius: '16px',
        marginBottom: '32px'
      }}>
        <p style={{ fontSize: '15px', lineHeight: '1.5', margin: '0 0 16px 0' }}>
          Certainly! Here is the customized Question Paper based on your instructions:
        </p>
        <button 
          onClick={handleDownloadPDF}
          style={{
            display: 'flex', alignItems: 'center', gap: '8px',
            background: 'white', color: '#111827', border: 'none', 
            padding: '10px 20px', borderRadius: '30px', cursor: 'pointer', fontWeight: 600, fontSize: '13px'
          }}
        >
          <Download size={16} /> Download as PDF
        </button>
      </div>

      {/* Actual Paper (Print Area) */}
      <div ref={printRef} style={{
        background: 'white',
        padding: '40px',
        borderRadius: '16px',
        boxShadow: '0 4px 12px rgba(0,0,0,0.05)',
        color: 'black',
        fontFamily: '"Inter", sans-serif', 
        maxWidth: '210mm', 
        margin: '0 auto'
      }}>
        
        {/* Header Information */}
        <div style={{ textAlign: 'center', paddingBottom: '16px', marginBottom: '24px' }}>
          <h1 style={{ fontSize: '20px', margin: '0 0 4px 0', fontWeight: 700 }}>Delhi Public School, Sector-4, Bokaro</h1>
          <h2 style={{ fontSize: '14px', margin: '0 0 4px 0', fontWeight: 600 }}>Subject: Science</h2>
          <h2 style={{ fontSize: '14px', margin: '0 0 32px 0', fontWeight: 600 }}>Class: 9th</h2>
          
          <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '12px', fontWeight: 600, marginBottom: '8px' }}>
            <span>Time Allowed: 45 minutes</span>
            <span>Maximum Marks: {(result.sections || []).reduce((acc: any, sec: any) => acc + (sec.questions || []).reduce((a: any, q: any) => a + (q.marks || 0), 0), 0)}</span>
          </div>
          <div style={{ fontSize: '12px', textAlign: 'left', fontStyle: 'italic', marginBottom: '24px' }}>
            All questions are compulsory unless stated otherwise.
          </div>
        </div>

        {/* Student Detail Lines */}
        <div style={{ marginBottom: '32px', fontSize: '12px', lineHeight: '2.5' }}>
          <div>Name: ________________________________________________</div>
          <div>Roll Number: _________________________________________</div>
          <div>Class: 9th Section: ___________________________________</div>
        </div>

        {/* Sections */}
        {(result.sections || []).map((section: any, sIdx: number) => (
          <div key={sIdx} style={{ marginBottom: '32px' }}>
            <h3 style={{ textAlign: 'center', fontSize: '14px', marginBottom: '8px', fontWeight: 600 }}>{section.title || `Section ${sIdx + 1}`}</h3>
            {section.instruction && (
              <div style={{ fontStyle: 'italic', fontSize: '12px', marginBottom: '16px' }}>
                {section.instruction}
              </div>
            )}

            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              {(section.questions || []).map((q: any, qIdx: number) => (
                <div key={qIdx} style={{ display: 'flex', gap: '8px', fontSize: '13px' }}>
                  <div style={{ fontWeight: 600 }}>{qIdx + 1}.</div>
                  <div style={{ flex: 1 }}>
                    <div style={{ display: 'inline' }}>
                      <span style={{ fontWeight: 600, color: '#4b5563', marginRight: '4px' }}>
                        [{q.difficulty || 'Moderate'}]
                      </span>
                      {q.text || ''}
                      <span style={{ fontWeight: 600, marginLeft: '8px' }}>[{q.marks || 0} Marks]</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}

        <div style={{ fontWeight: 700, fontSize: '13px', marginTop: '32px', marginBottom: '16px' }}>
          End of Question Paper
        </div>

        {/* Answer Key */}
        {result.answerKey && result.answerKey.length > 0 && (
          <div style={{ marginTop: '24px', borderTop: '1px solid #e5e7eb', paddingTop: '24px' }}>
            <h3 style={{ fontSize: '14px', fontWeight: 700, marginBottom: '16px' }}>Answer Key:</h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', fontSize: '13px' }}>
              {result.answerKey.map((ans: string, idx: number) => (
                <div key={idx} style={{ display: 'flex', gap: '8px' }}>
                  <div style={{ fontWeight: 600 }}>{idx + 1}.</div>
                  <div style={{ flex: 1, color: '#374151' }}>{ans}</div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
