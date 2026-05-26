'use client';

import React from 'react';
import { LayoutGrid, FileText, BookOpen, Clock, Plus } from 'lucide-react';
import { useAssessmentStore } from '../store/useAssessmentStore';

export default function MobileNav() {
  const { view, setView } = useAssessmentStore();

  return (
    <div className="mobile-nav">
      <div className="mobile-nav-item">
        <LayoutGrid size={20} />
        <span>Home</span>
      </div>
      <div 
        className={`mobile-nav-item ${view === 'list' || view === 'result' ? 'active' : ''}`}
        onClick={() => setView('list')}
        style={{ cursor: 'pointer' }}
      >
        <FileText size={20} />
        <span>Assignments</span>
      </div>
      <div 
        className="mobile-fab"
        onClick={() => setView('form')}
        style={{ cursor: 'pointer' }}
      >
        <Plus size={24} />
      </div>
      <div className="mobile-nav-item">
        <Clock size={20} />
        <span>Library</span>
      </div>
      <div className="mobile-nav-item">
        <BookOpen size={20} />
        <span>Toolkit</span>
      </div>
    </div>
  );
}
