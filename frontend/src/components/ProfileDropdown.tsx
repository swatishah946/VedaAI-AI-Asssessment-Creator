/* eslint-disable @next/next/no-img-element */
'use client';

import React, { useState, useRef, useEffect } from 'react';
import { useUserStore } from '../store/useUserStore';
import { Settings, LogOut, User } from 'lucide-react';
import SettingsModal from './SettingsModal';

export default function ProfileDropdown({ showName = true }: { showName?: boolean }) {
  const { name, avatarUrl } = useUserStore();
  const [isOpen, setIsOpen] = useState(false);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <div style={{ position: 'relative' }} ref={dropdownRef}>
      {/* Trigger */}
      <div 
        onClick={() => setIsOpen(!isOpen)}
        style={{ display: 'flex', alignItems: 'center', gap: '12px', cursor: 'pointer', padding: '4px', borderRadius: '30px' }}
      >
        <div style={{ width: '36px', height: '36px', borderRadius: '50%', background: '#e5e7eb', display: 'flex', alignItems: 'center', justifyContent: 'center', overflow: 'hidden', border: '2px solid white', boxShadow: '0 0 0 1px #e5e7eb' }}>
          {avatarUrl ? (
            <img src={avatarUrl} alt={name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
          ) : (
            <span style={{ fontSize: '14px', fontWeight: 600, color: '#4b5563' }}>{name.charAt(0)}</span>
          )}
        </div>
        {showName && (
          <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
            <span style={{ fontSize: '14px', fontWeight: 600 }}>{name}</span>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ transform: isOpen ? 'rotate(180deg)' : 'none', transition: 'transform 0.2s' }}>
              <polyline points="6 9 12 15 18 9"></polyline>
            </svg>
          </div>
        )}
      </div>

      {/* Dropdown Menu */}
      {isOpen && (
        <div style={{ 
          position: 'absolute', top: 'calc(100% + 8px)', right: 0, 
          width: '200px', background: 'white', borderRadius: '12px', 
          boxShadow: '0 10px 25px rgba(0,0,0,0.1)', border: '1px solid #f3f4f6',
          zIndex: 100, overflow: 'hidden'
        }}>
          <div style={{ padding: '12px 16px', borderBottom: '1px solid #f3f4f6', background: '#f9fafb' }}>
            <div style={{ fontSize: '12px', color: '#6b7280', fontWeight: 500, marginBottom: '2px' }}>Signed in as</div>
            <div style={{ fontSize: '14px', fontWeight: 600, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{name}</div>
          </div>
          
          <div style={{ padding: '8px' }}>
            <button 
              onClick={() => { setIsSettingsOpen(true); setIsOpen(false); }}
              style={{ width: '100%', display: 'flex', alignItems: 'center', gap: '12px', padding: '10px', background: 'none', border: 'none', borderRadius: '8px', cursor: 'pointer', color: '#374151', fontSize: '14px', fontWeight: 500, textAlign: 'left' }}
              onMouseOver={(e) => e.currentTarget.style.background = '#f3f4f6'}
              onMouseOut={(e) => e.currentTarget.style.background = 'none'}
            >
              <Settings size={16} color="#6b7280" /> Profile Settings
            </button>
            <button 
              style={{ width: '100%', display: 'flex', alignItems: 'center', gap: '12px', padding: '10px', background: 'none', border: 'none', borderRadius: '8px', cursor: 'pointer', color: '#ef4444', fontSize: '14px', fontWeight: 500, textAlign: 'left' }}
              onMouseOver={(e) => e.currentTarget.style.background = '#fef2f2'}
              onMouseOut={(e) => e.currentTarget.style.background = 'none'}
            >
              <LogOut size={16} /> Log Out
            </button>
          </div>
        </div>
      )}

      {/* Settings Modal */}
      <SettingsModal isOpen={isSettingsOpen} onClose={() => setIsSettingsOpen(false)} />
    </div>
  );
}
