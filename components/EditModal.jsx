'use client';
import { useState } from 'react';
import CategoryGrid from '@/components/CategoryGrid';
import DateInput from '@/components/DateInput';

function ConfirmModal({ message, onCancel, onConfirm }) {
  return (
    <div className="modal-overlay" style={{ zIndex: 600 }}>
      <div className="modal-content glass-panel" style={{ maxWidth: 350, textAlign: 'center', padding: '2rem' }}>
        <i className="ri-error-warning-line" style={{ fontSize: '3rem', color: 'var(--expense-color)', marginBottom: '1rem', display: 'block' }} />
        <h3 style={{ marginBottom: '0.5rem' }}>ยืนยันการลบ</h3>
        <p style={{ color: 'var(--text-secondary)', marginBottom: '2rem' }}>{message}</p>
        <div style={{ display: 'flex', gap: 10 }}>
          <button className="submit-btn" style={{ background: 'var(--panel-bg)', color: 'var(--text-primary)', border: '1px solid var(--panel-border)', flex: 1, marginTop: 0 }} onClick={onCancel}>ยกเลิก</button>
          <button className="submit-btn delete-btn" style={{ flex: 1, marginTop: 0 }} onClick={onConfirm}>ยืนยัน</button>
        </div>
      </div>
    </div>
  );
}

// EditModal (แทน handleEditSubmit() + deleteTransaction() ใน script.js)
// ใช้ fetch PUT/DELETE → /api/transactions/[id] แทน fetch POST → SCRIPT_URL
export default function EditModal({
  transaction, categories, addCategory,
  onClose, onSaved, showToast, setTransactions,
}) {
  const [type, setType] = useState(transaction.type || 'รายจ่าย');
  const [category, setCategory] = useState(transaction.category || '');
  const [amount, setAmount] = useState(String(transaction.amount || ''));
  const [details, setDetails] = useState(transaction.details || '');
  const [date, setDate] = useState(
    transaction.date ? transaction.date.split('T')[0] : ''
  );
  const [loading, setLoading] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  const handleTypeChange = (t) => { setType(t); setCategory(''); };

  // PUT /api/transactions/[id]
  const handleSave = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await fetch(`/api/transactions/${transaction.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ date, type, category, amount: parseFloat(amount), details }),
      });
      const result = await res.json();
      if (result.status === 'success') {
        showToast('อัปเดตข้อมูลสำเร็จ!');
        onClose();
        onSaved();
      } else {
        showToast(result.message || 'เกิดข้อผิดพลาด', true);
      }
    } catch (err) {
      showToast('ไม่สามารถอัปเดตได้', true);
    } finally {
      setLoading(false);
    }
  };

  // DELETE /api/transactions/[id]
  const handleDelete = async () => {
    setShowConfirm(false);
    setLoading(true);
    try {
      const res = await fetch(`/api/transactions/${transaction.id}`, { method: 'DELETE' });
      const result = await res.json();
      if (result.status === 'success') {
        setTransactions((prev) => prev.filter((t) => t.id !== transaction.id));
        showToast('ลบรายการสำเร็จ!');
        onClose();
      } else {
        showToast(result.message || 'เกิดข้อผิดพลาด', true);
      }
    } catch {
      showToast('ไม่สามารถลบได้', true);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <div className="modal-overlay" style={{ zIndex: 500 }}>
        <div className="modal-content glass-panel">
          <div className="form-header">
            <h3>แก้ไขรายการ</h3>
            <button className="icon-btn" onClick={onClose}><i className="ri-close-line" /></button>
          </div>

          <form onSubmit={handleSave}>
            {/* Date */}
            <div className="input-group">
              <label><i className="ri-calendar-event-line" /> วันที่</label>
              <DateInput value={date} onChange={setDate} required />
            </div>

            {/* Type */}
            <div className="input-group">
              <label><i className="ri-exchange-funds-line" /> ประเภท</label>
              <div className="radio-group" style={{ flex: 1 }}>
                <input type="radio" id="edit-type-income" name="edit-type" value="รายรับ" checked={type === 'รายรับ'} onChange={() => handleTypeChange('รายรับ')} />
                <label htmlFor="edit-type-income" className="radio-label income-label">รายรับ</label>
                <input type="radio" id="edit-type-expense" name="edit-type" value="รายจ่าย" checked={type === 'รายจ่าย'} onChange={() => handleTypeChange('รายจ่าย')} />
                <label htmlFor="edit-type-expense" className="radio-label expense-label">รายจ่าย</label>
              </div>
            </div>

            {/* Category */}
            <div className="input-group">
              <label><i className="ri-price-tag-3-line" /> หมวดหมู่</label>
              <CategoryGrid
                options={categories[type] || []}
                selected={category}
                onSelect={setCategory}
                onAddNew={() => {}}
              />
            </div>

            {/* Amount */}
            <div className="input-group">
              <label><i className="ri-money-dollar-circle-line" /> จำนวนเงิน</label>
              <div className="amount-wrapper">
                <span className="currency-symbol">฿</span>
                <input type="number" min="0" step="0.01" value={amount} onChange={(e) => setAmount(e.target.value)} required />
              </div>
            </div>

            {/* Details */}
            <div className="input-group">
              <label><i className="ri-file-text-line" /> รายละเอียด</label>
              <textarea rows={2} value={details} onChange={(e) => setDetails(e.target.value)} />
            </div>

            <button type="submit" className={`submit-btn update-btn ${loading ? 'loading' : ''}`} style={{ marginBottom: 10 }} disabled={loading}>
              <span className="btn-text">อัปเดตข้อมูล</span>
              <i className="ri-save-line" />
              <div className="spinner" />
            </button>
            <button type="button" className="submit-btn delete-btn" onClick={() => setShowConfirm(true)} disabled={loading}>
              <span className="btn-text">ลบรายการ</span>
              <i className="ri-delete-bin-line" />
            </button>
          </form>
        </div>
      </div>

      {showConfirm && (
        <ConfirmModal
          message="คุณแน่ใจหรือไม่ว่าต้องการลบรายการนี้?"
          onCancel={() => setShowConfirm(false)}
          onConfirm={handleDelete}
        />
      )}
    </>
  );
}
