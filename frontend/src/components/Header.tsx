'use client';

import React from 'react';
import { ArrowLeft, LayoutGrid, Bell } from 'lucide-react';
import { useAssessmentStore } from '../store/useAssessmentStore';
import ProfileDropdown from './ProfileDropdown';

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
          <ProfileDropdown />
        </div>
      </div>
    </header>
  );
}
