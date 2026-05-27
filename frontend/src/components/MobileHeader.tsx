'use client';

import React from 'react';
import { Bell, Menu } from 'lucide-react';

export default function MobileHeader() {
  return (
    <div className="mobile-header">
      <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontWeight: 700, fontSize: '20px' }}>
        <div className="brand-icon" style={{ width: '28px', height: '28px', borderRadius: '6px' }}>V</div>
        VedaAI
      </div>
      <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
        <div style={{ position: 'relative' }}>
          <Bell size={20} color="var(--text-color)" />
          <div style={{ position: 'absolute', top: 0, right: 0, width: '8px', height: '8px', background: '#ef4444', borderRadius: '50%', border: '2px solid white' }}></div>
        </div>
        <div className="user-avatar" style={{ width: '28px', height: '28px' }}></div>
        <Menu size={24} color="var(--text-color)" />
      </div>
    </div>
  );
}
