'use client';

import React from 'react';
import { useAssessmentStore } from '../store/useAssessmentStore';
import { FileText, Users, CheckCircle, TrendingUp, Plus } from 'lucide-react';

export default function DashboardHome() {
  const { history, setView } = useAssessmentStore();

  const totalQuestions = history.reduce((acc, curr) => {
    let qCount = 0;
    if (curr.questionsList && Array.isArray(curr.questionsList)) {
      qCount = curr.questionsList.reduce((sum: number, q: any) => sum + (q.count || 0), 0);
    }
    return acc + qCount;
  }, 0);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '32px' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div>
          <h1 style={{ fontSize: '28px', fontWeight: 700, color: 'var(--text-color)' }}>Welcome Back! 👋</h1>
          <p style={{ color: 'var(--text-muted)', marginTop: '4px' }}>Here's an overview of your recent teaching activities.</p>
        </div>
        <button onClick={() => setView('form')} className="create-btn" style={{ marginBottom: 0 }}>
          <Plus size={18} /> New Assignment
        </button>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '24px' }}>
        <div style={{ background: 'white', padding: '24px', borderRadius: '16px', boxShadow: 'var(--shadow-sm)', border: '1px solid var(--border-color)', display: 'flex', alignItems: 'center', gap: '16px' }}>
          <div style={{ background: '#eff6ff', padding: '16px', borderRadius: '12px' }}><FileText size={24} color="#3b82f6" /></div>
          <div>
            <div style={{ fontSize: '24px', fontWeight: 700 }}>{history.length}</div>
            <div style={{ color: 'var(--text-muted)', fontSize: '14px' }}>Total Assignments</div>
          </div>
        </div>
        <div style={{ background: 'white', padding: '24px', borderRadius: '16px', boxShadow: 'var(--shadow-sm)', border: '1px solid var(--border-color)', display: 'flex', alignItems: 'center', gap: '16px' }}>
          <div style={{ background: '#f0fdf4', padding: '16px', borderRadius: '12px' }}><CheckCircle size={24} color="#22c55e" /></div>
          <div>
            <div style={{ fontSize: '24px', fontWeight: 700 }}>{totalQuestions}</div>
            <div style={{ color: 'var(--text-muted)', fontSize: '14px' }}>Questions Generated</div>
          </div>
        </div>
        <div style={{ background: 'white', padding: '24px', borderRadius: '16px', boxShadow: 'var(--shadow-sm)', border: '1px solid var(--border-color)', display: 'flex', alignItems: 'center', gap: '16px' }}>
          <div style={{ background: '#fef2f2', padding: '16px', borderRadius: '12px' }}><Users size={24} color="#ef4444" /></div>
          <div>
            <div style={{ fontSize: '24px', fontWeight: 700 }}>3</div>
            <div style={{ color: 'var(--text-muted)', fontSize: '14px' }}>Active Classrooms</div>
          </div>
        </div>
        <div style={{ background: 'white', padding: '24px', borderRadius: '16px', boxShadow: 'var(--shadow-sm)', border: '1px solid var(--border-color)', display: 'flex', alignItems: 'center', gap: '16px' }}>
          <div style={{ background: '#f5f3ff', padding: '16px', borderRadius: '12px' }}><TrendingUp size={24} color="#8b5cf6" /></div>
          <div>
            <div style={{ fontSize: '24px', fontWeight: 700 }}>12 hrs</div>
            <div style={{ color: 'var(--text-muted)', fontSize: '14px' }}>Time Saved with AI</div>
          </div>
        </div>
      </div>

      <div>
        <h2 style={{ fontSize: '20px', fontWeight: 600, marginBottom: '16px' }}>Recent Assignments</h2>
        {history.length > 0 ? (
          <div style={{ background: 'white', borderRadius: '16px', boxShadow: 'var(--shadow-sm)', border: '1px solid var(--border-color)', overflow: 'hidden' }}>
            {history.slice(0, 3).map((assessment, idx) => (
              <div key={assessment._id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '20px 24px', borderBottom: idx !== Math.min(2, history.length - 1) ? '1px solid var(--border-color)' : 'none' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                  <div style={{ background: '#f8fafc', padding: '12px', borderRadius: '8px' }}>
                    <FileText size={20} color="#64748b" />
                  </div>
                  <div>
                    <div style={{ fontWeight: 600, fontSize: '15px' }}>{assessment.topic || 'Untitled Assignment'}</div>
                    <div style={{ fontSize: '13px', color: 'var(--text-muted)', marginTop: '4px' }}>
                      Created on {new Date(assessment.createdAt).toLocaleDateString('en-GB')}
                    </div>
                  </div>
                </div>
                <button 
                  onClick={() => setView('list')}
                  style={{ background: 'transparent', border: '1px solid var(--border-color)', padding: '8px 16px', borderRadius: '8px', fontSize: '14px', fontWeight: 500, cursor: 'pointer', transition: 'all 0.2s' }}
                >
                  View Detail
                </button>
              </div>
            ))}
          </div>
        ) : (
          <div style={{ background: 'white', padding: '40px', borderRadius: '16px', border: '1px dashed var(--border-color)', textAlign: 'center' }}>
            <p style={{ color: 'var(--text-muted)', marginBottom: '16px' }}>No recent assignments.</p>
            <button onClick={() => setView('form')} className="create-btn" style={{ margin: '0 auto' }}>Create One</button>
          </div>
        )}
      </div>
    </div>
  );
}
