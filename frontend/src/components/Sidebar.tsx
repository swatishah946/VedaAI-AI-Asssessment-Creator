import React from 'react';
import { LayoutGrid, Users, FileText, BookOpen, Clock, Settings, Plus } from 'lucide-react';

export default function Sidebar() {
  return (
    <aside className="sidebar">
      {/* Brand */}
      <div className="brand">
        <div className="brand-icon">V</div>
        VedaAI
      </div>

      {/* Primary Action */}
      <button className="create-btn">
        <Plus size={18} /> Create Assignment
      </button>

      {/* Navigation */}
      <ul className="nav-menu">
        <li className="nav-item">
          <LayoutGrid size={20} /> Home
        </li>
        <li className="nav-item">
          <Users size={20} /> My Groups
        </li>
        <li className="nav-item active">
          <FileText size={20} /> Assignments
        </li>
        <li className="nav-item">
          <BookOpen size={20} /> AI Teacher's Toolkit
        </li>
        <li className="nav-item">
          <Clock size={20} /> My Library
        </li>
      </ul>

      {/* Bottom Section */}
      <div className="sidebar-bottom">
        <div className="nav-item" style={{ marginBottom: '16px' }}>
          <Settings size={20} /> Settings
        </div>
        
        <div className="school-profile">
          <div className="school-avatar"></div>
          <div>
            <div style={{ fontWeight: 600, fontSize: '14px' }}>Delhi Public School</div>
            <div style={{ fontSize: '12px', color: 'var(--text-muted)' }}>Bokaro Steel City</div>
          </div>
        </div>
      </div>
    </aside>
  );
}
