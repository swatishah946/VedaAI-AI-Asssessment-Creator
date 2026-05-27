'use client';

import React, { useEffect, useState } from 'react';
import { useAssessmentStore } from '../store/useAssessmentStore';
import { FileText, Search, Filter, MoreVertical, Plus } from 'lucide-react';
import toast from 'react-hot-toast';

export default function AssignmentsList() {
  const { history, setHistory, setView, setResult } = useAssessmentStore();
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [openMenuId, setOpenMenuId] = useState<string | null>(null);

  useEffect(() => {
    fetchHistory();
  }, []);

  const fetchHistory = async () => {
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/assessments`);
      const data = await res.json();
      setHistory(data);
    } catch (err) {
      console.error('Failed to fetch history', err);
      toast.error('Failed to load assignments');
    } finally {
      setLoading(false);
    }
  };

  const handleView = (assessment: any) => {
    if (assessment.status === 'completed' && assessment.result) {
      let parsedResult = assessment.result;
      if (typeof parsedResult === 'string') {
        try {
          let cleaned = parsedResult.trim();
          if (cleaned.startsWith('```')) {
            cleaned = cleaned.replace(/^```(json)?\n?/, '').replace(/\n?```$/, '');
          }
          parsedResult = JSON.parse(cleaned);
        } catch(e) {
          console.error("Failed to parse history result", e);
        }
      }
      setResult(parsedResult);
      setView('result');
    } else {
      toast('This assessment is still generating or failed.', { icon: '⏳' });
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this assignment?')) return;
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/assessments/${id}`, { method: 'DELETE' });
      if (res.ok) {
        setHistory(history.filter((a: any) => a._id !== id));
        toast.success('Assignment deleted successfully');
      } else {
        toast.error('Failed to delete assignment');
      }
    } catch (err) {
      console.error(err);
      toast.error('An error occurred while deleting');
    }
  };

  const filteredHistory = history.filter((a: any) => 
    (a.topic || 'Untitled Assignment').toLowerCase().includes(searchQuery.toLowerCase())
  );

  if (loading) {
    return <div style={{ padding: '40px', textAlign: 'center' }}>Loading assignments...</div>;
  }

  if (history.length === 0) {
    return (
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: '100%', minHeight: '600px', textAlign: 'center', background: 'white', borderRadius: '12px', boxShadow: 'var(--shadow-sm)', border: '1px solid var(--border-color)' }}>
        <div style={{ position: 'relative', marginBottom: '24px' }}>
          <div style={{ background: '#f0f4ff', padding: '40px', borderRadius: '50%' }}>
            <FileText size={64} color="#a0aec0" />
            <div style={{ position: 'absolute', bottom: 10, right: 10, background: '#ef4444', borderRadius: '50%', padding: '8px' }}>
              <div style={{ color: 'white', fontWeight: 'bold', fontSize: '20px', lineHeight: '20px' }}>×</div>
            </div>
          </div>
        </div>
        <h2 style={{ fontSize: '24px', fontWeight: 700, marginBottom: '12px' }}>No assignments yet</h2>
        <p style={{ color: 'var(--text-muted)', maxWidth: '500px', marginBottom: '32px', lineHeight: '1.6', fontSize: '15px' }}>
          Create your first assignment to start collecting and grading student submissions. You can set up rubrics, define marking criteria, and let AI assist with grading.
        </p>
        <button 
          onClick={() => setView('form')}
          style={{ background: '#111827', color: 'white', border: 'none', padding: '16px 32px', borderRadius: '30px', fontSize: '15px', fontWeight: 600, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '8px' }}
        >
          <Plus size={18} /> Create Your First Assignment
        </button>
      </div>
    );
  }

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '24px' }}>
        <h2 style={{ fontSize: '20px', fontWeight: 600 }}>Assignments</h2>
        <button onClick={() => setView('form')} className="create-btn" style={{ marginBottom: 0 }}>
          <Plus size={18} /> Create Assignment
        </button>
      </div>

      <div style={{ display: 'flex', gap: '16px', marginBottom: '24px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', background: 'white', padding: '10px 16px', borderRadius: '30px', border: '1px solid var(--border-color)', color: 'var(--text-muted)', cursor: 'pointer' }}>
          <Filter size={16} /> Filter By
        </div>
        <div style={{ flex: 1, display: 'flex', alignItems: 'center', gap: '8px', background: 'white', padding: '10px 16px', borderRadius: '30px', border: '1px solid var(--border-color)' }}>
          <Search size={16} color="var(--text-muted)" />
          <input 
            type="text" 
            placeholder="Search Assignment" 
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            style={{ border: 'none', outline: 'none', width: '100%', fontSize: '14px' }} 
          />
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: '16px' }}>
        {filteredHistory.map((assessment: any) => (
          <div key={assessment._id} style={{ background: 'white', borderRadius: '12px', padding: '20px', boxShadow: 'var(--shadow-sm)', border: '1px solid var(--border-color)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '32px' }}>
              <h3 style={{ fontSize: '18px', fontWeight: 600 }}>{assessment.topic || 'Untitled Assignment'}</h3>
              
              <div style={{ position: 'relative' }}>
                <div 
                  style={{ cursor: 'pointer', padding: '4px' }}
                  onClick={() => setOpenMenuId(openMenuId === assessment._id ? null : assessment._id)}
                >
                  <MoreVertical size={20} color="var(--text-muted)" />
                </div>
                
                {openMenuId === assessment._id && (
                  <div style={{ position: 'absolute', top: '100%', right: 0, background: 'white', boxShadow: 'var(--shadow-md)', borderRadius: '8px', border: '1px solid var(--border-color)', zIndex: 10, width: '150px', overflow: 'hidden' }}>
                    <div 
                      onClick={() => { handleView(assessment); setOpenMenuId(null); }}
                      style={{ padding: '12px 16px', cursor: 'pointer', fontSize: '14px', borderBottom: '1px solid var(--border-color)' }}
                    >
                      View Assignment
                    </div>
                    <div 
                      onClick={() => { handleDelete(assessment._id); setOpenMenuId(null); }}
                      style={{ padding: '12px 16px', cursor: 'pointer', fontSize: '14px', color: '#ef4444' }}
                    >
                      Delete
                    </div>
                  </div>
                )}
              </div>
            </div>

            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '13px', color: 'var(--text-muted)', fontWeight: 500 }}>
              <div>Assigned on : {new Date(assessment.createdAt).toLocaleDateString('en-GB').replace(/\//g, '-')}</div>
              <div>Due : {new Date(new Date(assessment.createdAt).setDate(new Date(assessment.createdAt).getDate() + 7)).toLocaleDateString('en-GB').replace(/\//g, '-')}</div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
