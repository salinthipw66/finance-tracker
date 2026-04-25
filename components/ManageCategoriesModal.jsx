'use client';
import { useState, useEffect } from 'react';

export default function ManageCategoriesModal({ showToast, onClose, onCategoriesChange }) {
  const [categories, setCategories] = useState([]);
  const [type, setType] = useState('รายจ่าย');
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  
  const [editingId, setEditingId] = useState(null);
  const [editName, setEditName] = useState('');

  // Drag and drop state
  const [draggedItemIndex, setDraggedItemIndex] = useState(null);

  const fetchCategories = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/categories/manage');
      const json = await res.json();
      if (json.status === 'success') {
        setCategories(json.data);
      }
    } catch (err) {
      showToast('ไม่สามารถดึงข้อมูลหมวดหมู่ได้', true);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  const handleTypeChange = (t) => {
    setType(t);
    setEditingId(null);
  };

  const handleReorder = async (currentIndex, targetIndex) => {
    if (targetIndex < 0) return;
    const items = categories.filter(c => c.type === type);
    if (targetIndex >= items.length) return;

    // Create a new ordered array
    const newItems = [...items];
    const [moved] = newItems.splice(currentIndex, 1);
    newItems.splice(targetIndex, 0, moved);

    // Update sort_order locally
    newItems.forEach((item, index) => item.sort_order = index);

    // Merge back into main categories array
    const updatedCategories = categories.map(c => {
      const updated = newItems.find(n => n.id === c.id);
      return updated ? updated : c;
    }).sort((a, b) => a.sort_order - b.sort_order);

    setCategories([...updatedCategories]);

    // Save to DB
    try {
      await fetch('/api/categories/manage', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          updates: newItems.map(item => ({ id: item.id, sort_order: item.sort_order }))
        })
      });
      onCategoriesChange(); // parent should refresh logic
    } catch (err) {
      console.error('Failed to reorder categories:', err);
    }
  };

  const startEdit = (id, name) => {
    setEditingId(id);
    setEditName(name);
  };

  const handleSaveEdit = async (id) => {
    if (!editName.trim()) return setEditingId(null);
    setSaving(true);
    try {
      const res = await fetch(`/api/categories/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: editName, type })
      });
      const data = await res.json();
      if (data.status === 'success') {
        showToast('เปลี่ยนชื่อสำเร็จ!');
        await fetchCategories();
        onCategoriesChange();
      } else {
        showToast(data.message, true);
      }
    } catch (err) {
      console.error('Failed to save edit:', err);
      showToast('เกิดข้อผิดพลาด', true);
    } finally {
      setSaving(false);
      setEditingId(null);
    }
  };

  const handleDelete = async (id) => {
    if (!confirm('ยืนยันที่จะลบหมวดหมู่นี้? (รายการเก่าจะไม่ถูกลบ แต่จะไม่อยู่ในหมวดหมู่นี้อีก)')) return;
    setSaving(true);
    try {
      const res = await fetch(`/api/categories/${id}`, { method: 'DELETE' });
      if (res.ok) {
        showToast('ลบหมวดหมู่สำเร็จ');
        await fetchCategories();
        onCategoriesChange();
      }
    } catch (err) {
      console.error('Failed to delete category:', err);
      showToast('เกิดข้อผิดพลาด', true);
    } finally {
      setSaving(false);
    }
  };

  const filtered = categories.filter(c => c.type === type);

  return (
    <div className="modal-overlay" style={{ zIndex: 1000 }}>
      <div className="modal-content glass-panel" style={{ maxWidth: 500 }}>
        <div className="form-header">
          <h3>จัดการหมวดหมู่</h3>
          <button className="icon-btn" onClick={onClose}><i className="ri-close-line" /></button>
        </div>

        <div className="input-group mb-3">
          <div className="radio-group" style={{ flex: 1, width: '100%' }}>
            <input type="radio" id="man-type-income" value="รายรับ" checked={type === 'รายรับ'} onChange={() => handleTypeChange('รายรับ')} />
            <label htmlFor="man-type-income" className="radio-label income-label">รายรับ</label>
            <input type="radio" id="man-type-expense" value="รายจ่าย" checked={type === 'รายจ่าย'} onChange={() => handleTypeChange('รายจ่าย')} />
            <label htmlFor="man-type-expense" className="radio-label expense-label">รายจ่าย</label>
          </div>
        </div>

        {loading ? (
          <div style={{ textAlign: 'center', padding: '2rem 0' }}><div className="spinner active" style={{ borderColor: 'var(--text-secondary)', borderTopColor: 'transparent' }}/></div>
        ) : (
          <ul className="category-manage-list">
            {filtered.map((cat, index) => (
              <li 
                key={cat.id} 
                className="cat-manage-item"
                draggable={editingId !== cat.id}
                onDragStart={(e) => {
                  setDraggedItemIndex(index);
                  e.dataTransfer.effectAllowed = 'move';
                  e.target.style.opacity = '0.5';
                }}
                onDragEnd={(e) => {
                  e.target.style.opacity = '1';
                  setDraggedItemIndex(null);
                }}
                onDragOver={(e) => {
                  e.preventDefault();
                  e.dataTransfer.dropEffect = 'move';
                }}
                onDrop={(e) => {
                  e.preventDefault();
                  if (draggedItemIndex !== null && draggedItemIndex !== index) {
                    handleReorder(draggedItemIndex, index);
                  }
                }}
                style={{ cursor: editingId === cat.id ? 'default' : 'grab' }}
              >
                <div className="cat-actions-left" style={{ cursor: 'grab', paddingRight: '8px' }}>
                  <i className="ri-draggable" style={{ fontSize: '1.4rem', color: 'var(--text-secondary)' }} />
                </div>
                
                <div className="cat-manage-content" style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
                  {editingId === cat.id ? (
                    <input 
                      type="text" 
                      value={editName} 
                      onChange={e => setEditName(e.target.value)} 
                      style={{ padding: '6px 8px', width: '100%', borderRadius: 6, border: '1.5px solid var(--panel-border)' }}
                      autoFocus
                    />
                  ) : (
                    <span>{cat.name}</span>
                  )}
                </div>

                <div className="cat-actions-right">
                  {editingId === cat.id ? (
                     <button type="button" className="icon-btn-small text-income" onClick={() => handleSaveEdit(cat.id)} disabled={saving}><i className="ri-check-line"/></button>
                  ) : (
                     <button type="button" className="icon-btn-small" onClick={() => startEdit(cat.id, cat.name)}><i className="ri-pencil-line"/></button>
                  )}
                  <button type="button" className="icon-btn-small text-expense" onClick={() => handleDelete(cat.id)} disabled={saving || editingId === cat.id}><i className="ri-delete-bin-line"/></button>
                </div>
              </li>
            ))}
            {filtered.length === 0 && <p className="text-center text-muted" style={{ padding: '1rem' }}>ไม่มีรายการ</p>}
          </ul>
        )}
      </div>
    </div>
  );
}
