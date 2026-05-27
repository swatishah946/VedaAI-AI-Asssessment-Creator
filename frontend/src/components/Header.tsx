'use client';

import React from 'react';
import { ArrowLeft, LayoutGrid, Bell, ChevronDown } from 'lucide-react';
import { useAssessmentStore } from '../store/useAssessmentStore';

export default function Header() {
  const { setView, history } = useAssessmentStore();

  return (
    <header className={`header ${history.length === 0 ? 'header-empty' : ''}`}>
      <div className="header-title">
        <ArrowLeft size={20} style={{ color: 'var(--text-muted)', cursor: 'pointer' }} onClick={() => setView('list')} />
        <LayoutGrid size={20} style={{ color: 'var(--text-muted)' }} />
        <span>Assignment</span>
      </div>

      <div className="header-right">
        <Bell size={20} style={{ color: 'var(--text-muted)', cursor: 'pointer' }} />
        <div className="user-profile">
          <div className="user-avatar"></div>
          <span style={{ fontSize: '14px', fontWeight: 500 }}>John Doe</span>
          <ChevronDown size={16} style={{ color: 'var(--text-muted)' }} />
        </div>
      </div>
    </header>
  );
}
