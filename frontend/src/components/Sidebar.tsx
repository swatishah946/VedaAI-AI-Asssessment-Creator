'use client';

import React from 'react';
import { LayoutGrid, Users, FileText, BookOpen, Clock, Settings, Plus } from 'lucide-react';
import { useAssessmentStore } from '../store/useAssessmentStore';
import { useUserStore } from '../store/useUserStore';
import { useState } from 'react';
import SettingsModal from './SettingsModal';

export default function Sidebar() {
  const { view, setView, history } = useAssessmentStore();
  const { school, avatarUrl } = useUserStore();
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);

  // Split school string safely
  const schoolParts = school.split(',');
  const mainSchoolName = schoolParts[0] || 'VedaAI School';
  const subSchoolName = schoolParts[1] || '';

  return (
    <aside className="sidebar">
      {/* Brand */}
      <div className="brand">
        <div className="brand-icon">V</div>
        VedaAI
      </div>

      {/* Primary Action */}
      <button className="create-btn" onClick={() => setView('form')}>
        <Plus size={18} /> Create Assignment
      </button>

      {/* Navigation */}
      <ul className="nav-menu">
        <li className={`nav-item ${view === 'home' ? 'active' : ''}`} onClick={() => setView('home')}>
          <LayoutGrid size={20} /> Home
        </li>
        <li className={`nav-item ${view === 'groups' ? 'active' : ''}`} onClick={() => setView('groups')}>
          <Users size={20} /> My Groups
        </li>
        <li className={`nav-item ${view === 'list' || view === 'result' || view === 'form' || view === 'review' || view === 'loading' ? 'active' : ''}`} onClick={() => setView('list')} style={{ justifyContent: 'space-between' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <FileText size={20} /> Assignments
          </div>
          {history.length > 0 && (
            <span style={{
              background: 'var(--primary-color)', color: 'white', borderRadius: '12px',
              padding: '2px 8px', fontSize: '11px', fontWeight: 600
            }}>
              {history.length}
            </span>
          )}
        </li>
        <li className={`nav-item ${view === 'toolkit' ? 'active' : ''}`} onClick={() => setView('toolkit')}>
          <BookOpen size={20} /> AI Teacher's Toolkit
        </li>
        <li className="nav-item">
          <Clock size={20} /> My Library
        </li>
      </ul>

      {/* Bottom Section */}
      <div className="sidebar-bottom">
        <div className="nav-item" style={{ marginBottom: '16px' }} onClick={() => setIsSettingsOpen(true)}>
          <Settings size={20} /> Settings
        </div>
        
        <div className="school-profile">
          <div className="school-avatar" style={{ overflow: 'hidden', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            {avatarUrl ? (
              <img src={avatarUrl} alt="School" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
            ) : (
              <span style={{ fontSize: '12px', fontWeight: 600 }}>{mainSchoolName.charAt(0)}</span>
            )}
          </div>
          <div style={{ overflow: 'hidden' }}>
            <div style={{ fontWeight: 600, fontSize: '14px', whiteSpace: 'nowrap', textOverflow: 'ellipsis', overflow: 'hidden' }}>{mainSchoolName}</div>
            {subSchoolName && (
              <div style={{ fontSize: '12px', color: 'var(--text-muted)', whiteSpace: 'nowrap', textOverflow: 'ellipsis', overflow: 'hidden' }}>{subSchoolName}</div>
            )}
          </div>
        </div>
      </div>
      
      <SettingsModal isOpen={isSettingsOpen} onClose={() => setIsSettingsOpen(false)} />
    </aside>
  );
}
