import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import RedesignedMainLayout from '../../layouts/RedesignedMainLayout';
import * as grievanceService from '../../services/grievanceService';
import * as categoryService from '../../services/categoryService';
import { useLanguage } from '../../context/LanguageContext';
import { toast } from 'react-toastify';

const inp = { width: '100%', padding: '10px 12px', border: '1px solid #dadce0', borderRadius: '6px', fontSize: '14px', boxSizing: 'border-box' };
const lbl = { display: 'block', fontSize: '13px', fontWeight: 600, marginBottom: '6px', color: '#3c4043' };

const RaiseGrievance = () => {
  const navigate = useNavigate();
  const { t } = useLanguage();
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(false);
  const [files, setFiles] = useState([]);
  const [form, setForm] = useState({ title: '', description: '', category_id: '', priority: 'medium' });

  useEffect(() => {
    categoryService.getAllCategories()
      .then(r => setCategories(r.data.data || []))
      .catch(() => {});
  }, []);

  const handleChange = e => setForm({ ...form, [e.target.name]: e.target.value });

  const handleFileChange = e => {
    const selected = Array.from(e.target.files);
    const valid = selected.filter(f => f.size <= 10 * 1024 * 1024);
    if (valid.length < selected.length) toast.warn('Some files exceed 10MB and were skipped');
    setFiles(prev => [...prev, ...valid]);
  };

  const removeFile = (i) => setFiles(files.filter((_, idx) => idx !== i));

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.title || !form.description || !form.category_id) {
      return toast.error('Please fill all required fields');
    }
    setLoading(true);
    try {
      const res = await grievanceService.createGrievance(form);
      const grievanceId = res.data.grievance.id;

      // Upload documents if any
      for (const file of files) {
        const fd = new FormData();
        fd.append('file', file);
        try {
          await grievanceService.uploadDocument(grievanceId, fd);
        } catch {
          toast.warn(`Could not upload ${file.name}`);
        }
      }

      toast.success(`Grievance filed! Ticket ID: #${grievanceId}`);
      navigate('/citizen/my-grievances');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to file grievance');
    } finally {
      setLoading(false);
    }
  };

  return (
    <RedesignedMainLayout role="citizen">
      <div style={{ maxWidth: '760px', margin: '0 auto', padding: '0 24px' }}>
        <div style={{ marginBottom: '24px', borderBottom: '2px solid #dadce0', paddingBottom: '20px' }}>
          <h1 style={{ margin: 0, fontSize: '28px', fontWeight: 500 }}>➕ {t('fileGrievance')}</h1>
          <p style={{ margin: '4px 0 0', color: '#5f6368', fontSize: '14px' }}>Describe your issue clearly. You'll receive a unique Ticket ID.</p>
        </div>

        <form onSubmit={handleSubmit} style={{ background: 'white', border: '1px solid #dadce0', borderRadius: '8px', padding: '28px' }}>

          <div style={{ marginBottom: '18px' }}>
            <label style={lbl}>{t('title')} *</label>
            <input name="title" value={form.title} onChange={handleChange} required
              placeholder="Brief title of your grievance" style={inp} />
          </div>

          <div style={{ marginBottom: '18px' }}>
            <label style={lbl}>{t('description')} *</label>
            <textarea name="description" value={form.description} onChange={handleChange} required
              placeholder="Detailed description of the issue..." rows={5}
              style={{ ...inp, resize: 'vertical' }} />
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', marginBottom: '18px' }}>
            <div>
              <label style={lbl}>{t('category')} *</label>
              <select name="category_id" value={form.category_id} onChange={handleChange} required style={inp}>
                <option value="">Select Category</option>
                {categories.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
              </select>
            </div>
            <div>
              <label style={lbl}>{t('priority')}</label>
              <select name="priority" value={form.priority} onChange={handleChange} style={inp}>
                <option value="low">{t('low')}</option>
                <option value="medium">{t('medium')}</option>
                <option value="high">{t('high')}</option>
              </select>
            </div>
          </div>

          {/* Document Upload */}
          <div style={{ marginBottom: '24px' }}>
            <label style={lbl}>📎 {t('uploadDoc')} (PDF, JPG, PNG, DOC — max 10MB each)</label>
            <input type="file" multiple accept=".pdf,.jpg,.jpeg,.png,.doc,.docx,.txt"
              onChange={handleFileChange}
              style={{ ...inp, padding: '8px', cursor: 'pointer' }} />
            {files.length > 0 && (
              <div style={{ marginTop: '10px', display: 'flex', flexDirection: 'column', gap: '6px' }}>
                {files.map((f, i) => (
                  <div key={i} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: '#f8f9fa', padding: '8px 12px', borderRadius: '6px', fontSize: '13px' }}>
                    <span>📄 {f.name} <span style={{ color: '#9aa0a6' }}>({(f.size / 1024).toFixed(1)} KB)</span></span>
                    <button type="button" onClick={() => removeFile(i)}
                      style={{ background: 'none', border: 'none', color: '#e53935', cursor: 'pointer', fontSize: '16px', lineHeight: 1 }}>✕</button>
                  </div>
                ))}
              </div>
            )}
          </div>

          <div style={{ display: 'flex', gap: '12px' }}>
            <button type="submit" disabled={loading}
              style={{ background: '#1a73e8', color: 'white', border: 'none', borderRadius: '6px', padding: '11px 28px', fontSize: '15px', fontWeight: 600, cursor: 'pointer' }}>
              {loading ? t('submitting') : t('submitGrievance')}
            </button>
            <button type="button" onClick={() => navigate(-1)}
              style={{ background: 'transparent', color: '#5f6368', border: '1px solid #dadce0', borderRadius: '6px', padding: '11px 20px', fontSize: '15px', cursor: 'pointer' }}>
              {t('cancel')}
            </button>
          </div>
        </form>
      </div>
    </RedesignedMainLayout>
  );
};

export default RaiseGrievance;
