'use client';

import React from 'react';
import { BookOpen, PenTool, LayoutTemplate, MessageSquare, Sparkles } from 'lucide-react';

export default function AIToolkit() {
  const tools = [
    { id: 1, title: 'AI Syllabus Generator', desc: 'Automatically generate a structured curriculum for any subject and grade level.', icon: BookOpen, color: '#3b82f6', bg: '#eff6ff' },
    { id: 2, title: 'AI Auto-Grader', desc: 'Instantly grade subjective and objective assignments with feedback.', icon: PenTool, color: '#22c55e', bg: '#f0fdf4' },
    { id: 3, title: 'Rubric Creator', desc: 'Generate highly detailed grading rubrics based on assignment criteria.', icon: LayoutTemplate, color: '#f59e0b', bg: '#fef3c7' },
    { id: 4, title: 'Student Feedback Gen', desc: 'Write personalized, constructive feedback for student reports automatically.', icon: MessageSquare, color: '#8b5cf6', bg: '#f5f3ff' },
  ];

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '32px' }}>
      <div>
        <h1 style={{ fontSize: '28px', fontWeight: 700, color: 'var(--text-color)', display: 'flex', alignItems: 'center', gap: '12px' }}>
          AI Teacher&apos;s Toolkit <Sparkles size={24} color="#f59e0b" />
        </h1>
        <p style={{ color: 'var(--text-muted)', marginTop: '4px' }}>Supercharge your workflow with our advanced suite of AI teaching tools.</p>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '24px' }}>
        {tools.map((tool) => (
          <div key={tool.id} style={{ background: 'white', borderRadius: '16px', padding: '24px', boxShadow: 'var(--shadow-sm)', border: '1px solid var(--border-color)', display: 'flex', flexDirection: 'column', transition: 'transform 0.2s, box-shadow 0.2s', cursor: 'pointer' }}
               onMouseEnter={(e) => { e.currentTarget.style.transform = 'translateY(-4px)'; e.currentTarget.style.boxShadow = 'var(--shadow-md)'; }}
               onMouseLeave={(e) => { e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.boxShadow = 'var(--shadow-sm)'; }}
          >
            <div style={{ width: '48px', height: '48px', borderRadius: '12px', background: tool.bg, display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '20px' }}>
              <tool.icon size={24} color={tool.color} />
            </div>
            <h3 style={{ fontSize: '18px', fontWeight: 600, marginBottom: '8px' }}>{tool.title}</h3>
            <p style={{ color: 'var(--text-muted)', fontSize: '14px', lineHeight: '1.5', flex: 1 }}>{tool.desc}</p>
            
            <button style={{ marginTop: '24px', background: 'transparent', border: `1px solid ${tool.color}`, color: tool.color, padding: '10px 16px', borderRadius: '8px', fontSize: '14px', fontWeight: 600, cursor: 'pointer' }}>
              Launch Tool
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
