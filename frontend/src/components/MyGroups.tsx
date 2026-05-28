'use client';

import React from 'react';
import { Users, MoreVertical, Plus } from 'lucide-react';

export default function MyGroups() {
  const groups = [
    { id: 1, name: '9th Grade Science', students: 34, assignments: 12, color: '#3b82f6', bg: '#eff6ff' },
    { id: 2, name: '10th Grade Math', students: 28, assignments: 8, color: '#22c55e', bg: '#f0fdf4' },
    { id: 3, name: '11th Grade Physics', students: 42, assignments: 15, color: '#8b5cf6', bg: '#f5f3ff' },
  ];

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '32px' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div>
          <h1 style={{ fontSize: '28px', fontWeight: 700, color: 'var(--text-color)' }}>My Groups</h1>
          <p style={{ color: 'var(--text-muted)', marginTop: '4px' }}>Manage your classrooms and student groups.</p>
        </div>
        <button className="create-btn" style={{ marginBottom: 0 }}>
          <Plus size={18} /> Create Group
        </button>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: '24px' }}>
        {groups.map((group) => (
          <div key={group.id} style={{ background: 'white', borderRadius: '16px', padding: '24px', boxShadow: 'var(--shadow-sm)', border: '1px solid var(--border-color)', position: 'relative' }}>
            <div style={{ position: 'absolute', top: '24px', right: '24px', cursor: 'pointer', color: 'var(--text-muted)' }}>
              <MoreVertical size={20} />
            </div>
            <div style={{ width: '48px', height: '48px', borderRadius: '12px', background: group.bg, display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '16px' }}>
              <Users size={24} color={group.color} />
            </div>
            <h3 style={{ fontSize: '20px', fontWeight: 600, marginBottom: '8px' }}>{group.name}</h3>
            <div style={{ display: 'flex', gap: '16px', color: 'var(--text-muted)', fontSize: '14px', marginBottom: '24px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                <Users size={16} /> {group.students} Students
              </div>
            </div>
            
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderTop: '1px solid var(--border-color)', paddingTop: '16px', marginTop: 'auto' }}>
              <span style={{ fontSize: '14px', fontWeight: 500, color: 'var(--text-muted)' }}>{group.assignments} Assignments</span>
              <button style={{ background: 'transparent', border: 'none', color: group.color, fontWeight: 600, fontSize: '14px', cursor: 'pointer' }}>View Details</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
