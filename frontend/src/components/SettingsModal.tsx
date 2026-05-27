'use client';

import React, { useRef, useEffect, useState } from 'react';
import { createPortal } from 'react-dom';
import { useUserStore } from '../store/useUserStore';
import { X, Upload, Camera } from 'lucide-react';

interface SettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function SettingsModal({ isOpen, onClose }: SettingsModalProps) {
  const { name, school, avatarUrl, updateProfile } = useUserStore();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!isOpen || !mounted) return null;

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        updateProfile({ avatarUrl: reader.result as string });
      };
      reader.readAsDataURL(file);
    }
  };

  return createPortal(
    <div style={{
      position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
      backgroundColor: 'rgba(0,0,0,0.5)', backdropFilter: 'blur(4px)',
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      zIndex: 9999
    }}>
      <div className="card" style={{
        width: '100%', maxWidth: '400px', padding: '32px', position: 'relative'
      }}>
        <button 
          onClick={onClose}
          style={{ position: 'absolute', top: '16px', right: '16px', background: 'none', border: 'none', cursor: 'pointer', color: '#6b7280' }}
        >
          <X size={20} />
        </button>
        
        <h2 style={{ fontSize: '20px', fontWeight: 600, marginBottom: '24px' }}>Profile Settings</h2>

        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', marginBottom: '24px' }}>
          <div 
            onClick={() => fileInputRef.current?.click()}
            style={{
              width: '80px', height: '80px', borderRadius: '50%', background: '#f3f4f6',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              cursor: 'pointer', overflow: 'hidden', position: 'relative',
              border: '2px dashed #d1d5db'
            }}
          >
            {avatarUrl ? (
              <img src={avatarUrl} alt="Avatar" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
            ) : (
              <Camera size={32} color="#9ca3af" />
            )}
            <div style={{
              position: 'absolute', bottom: 0, left: 0, right: 0, height: '30%',
              background: 'rgba(0,0,0,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center',
              color: 'white', fontSize: '10px', fontWeight: 600
            }}>
              EDIT
            </div>
          </div>
          <input 
            type="file" 
            ref={fileInputRef} 
            onChange={handleImageUpload}
            accept="image/*"
            style={{ display: 'none' }}
          />
          <p style={{ fontSize: '12px', color: '#6b7280', marginTop: '8px' }}>Click to upload new avatar</p>
        </div>

        <div style={{ marginBottom: '16px' }}>
          <label style={{ display: 'block', fontSize: '13px', fontWeight: 600, marginBottom: '8px', color: '#374151' }}>
            Full Name
          </label>
          <input 
            type="text" 
            value={name}
            onChange={(e) => updateProfile({ name: e.target.value })}
            style={{ width: '100%', padding: '10px 12px', borderRadius: '8px', border: '1px solid #d1d5db', fontSize: '14px', outline: 'none' }}
          />
        </div>

        <div style={{ marginBottom: '32px' }}>
          <label style={{ display: 'block', fontSize: '13px', fontWeight: 600, marginBottom: '8px', color: '#374151' }}>
            School / Organization
          </label>
          <input 
            type="text" 
            value={school}
            onChange={(e) => updateProfile({ school: e.target.value })}
            style={{ width: '100%', padding: '10px 12px', borderRadius: '8px', border: '1px solid #d1d5db', fontSize: '14px', outline: 'none' }}
          />
        </div>

        <button 
          onClick={onClose}
          style={{ width: '100%', padding: '12px', background: '#111827', color: 'white', border: 'none', borderRadius: '30px', fontWeight: 600, cursor: 'pointer' }}
        >
          Save Changes
        </button>
      </div>
    </div>,
    document.body
  );
}
