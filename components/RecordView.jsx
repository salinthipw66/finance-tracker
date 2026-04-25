'use client';
import { useState } from 'react';
import CategoryGrid from '@/components/CategoryGrid';
import DateInput from '@/components/DateInput';
import ManageCategoriesModal from '@/components/ManageCategoriesModal';



function CategoryModal({ title, placeholder, onClose, onConfirm }) {
  const [value, setValue] = useState('');

  return (
    <div className="modal-overlay" style={{ zIndex: 600 }}>
      <div className="modal-content glass-panel" style={{ maxWidth: 350 }}>
        <h3 style={{ marginBottom: '1.5rem', textAlign: 'center' }}>{title}</h3>
        <input
          type="text"
          autoFocus
          placeholder={placeholder}
          value={value}
          onChange={(e) => setValue(e.target.value)}
          onKeyDown={(e) => { if (e.key === 'Enter' && value.trim()) onConfirm(value.trim()); if (e.key === 'Escape') onClose(); }}
          style={{ width: '100%', marginBottom: '1.5rem', padding: '10px 14px', border: '1.5px solid var(--panel-border)', borderRadius: 10, fontSize: '0.95rem', fontFamily: 'inherit' }}
        />

        <div style={{ display: 'flex', gap: 10 }}>
          <button className="submit-btn" style={{ background: 'var(--panel-bg)', color: 'var(--text-primary)', border: '1px solid var(--panel-border)', marginTop: 0 }} onClick={onClose}>ยกเลิก</button>
          <button className="submit-btn" style={{ marginTop: 0 }} onClick={() => value.trim() && onConfirm(value.trim())}>บันทึก</button>
        </div>
      </div>
    </div>
  );
}

export default function RecordView({
  transactions, categories, fetchData, showToast,
  addCategory, setTransactions,
}) {
  // Form state (แทน HTML form inputs เดิม + FormData)
  const [selectedType, setSelectedType] = useState('รายจ่าย');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [amount, setAmount] = useState('');
  const [details, setDetails] = useState('');
  const [loading, setLoading] = useState(false);
  const [showManageModal, setShowManageModal] = useState(false);

  // Date helpers
  const todayStr = () => {
    const now = new Date();
    return `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-${String(now.getDate()).padStart(2, '0')}`;
  };
  const [date, setDate] = useState(todayStr());

  // Modals
  const [showPrompt, setShowPrompt] = useState(false);

  const handleTypeChange = (type) => {
    setSelectedType(type);
    setSelectedCategory('');
  };

  const handleAddNewCategory = () => setShowPrompt(true);

  const handlePromptConfirm = async (name) => {
    setShowPrompt(false);
    await addCategory(selectedType, name);
    setSelectedCategory(name);
  };

  // บันทึกรายการ → POST /api/transactions (แทน fetch(SCRIPT_URL) เดิม)
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (loading || !selectedCategory || !amount) return;
    setLoading(true);

    const data = { date, type: selectedType, category: selectedCategory, amount: parseFloat(amount), details };

    // Optimistic update
    const tempId = Date.now();
    const optimistic = { ...data, id: tempId };
    setTransactions((prev) => [optimistic, ...prev]);
    localStorage.setItem('transactionsCache', JSON.stringify([optimistic, ...transactions]));
    setAmount('');
    setDetails('');
    showToast('บันทึกรายการสำเร็จ!');
    setLoading(false);

    // Background sync
    try {
      await fetch('/api/transactions', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });
      fetchData(); // sync true IDs from DB
    } catch (err) {
      console.error('Failed to add transaction:', err);
      // Rollback optimistic update
      setTransactions((prev) => prev.filter((t) => t.id !== tempId));
      localStorage.setItem('transactionsCache', JSON.stringify(transactions));
      showToast('บันทึกไม่สำเร็จ กรุณาลองใหม่', true);
    }
  };

  return (
    <div>
      <div className="glass-panel">
        <div className="form-header">
          <h3>เพิ่มรายการใหม่</h3>
          <button className="icon-btn" onClick={() => { setAmount(''); setDetails(''); setSelectedCategory(''); }}>
            <i className="ri-refresh-line" />
          </button>
        </div>

        <form onSubmit={handleSubmit}>
          {/* Date */}
          <div className="input-group">
            <label htmlFor="date"><i className="ri-calendar-event-line" /> วันที่</label>
            <DateInput
              id="date"
              value={date}
              onChange={setDate}
              required
            />
          </div>

          {/* Type */}
          <div className="input-group">
            <label><i className="ri-exchange-funds-line" /> ประเภท</label>
            <div className="radio-group" style={{ flex: 1 }}>
              <input type="radio" id="type-income" name="type" value="รายรับ" checked={selectedType === 'รายรับ'} onChange={() => handleTypeChange('รายรับ')} />
              <label htmlFor="type-income" className="radio-label income-label">รายรับ</label>
              <input type="radio" id="type-expense" name="type" value="รายจ่าย" checked={selectedType === 'รายจ่าย'} onChange={() => handleTypeChange('รายจ่าย')} />
              <label htmlFor="type-expense" className="radio-label expense-label">รายจ่าย</label>
            </div>
          </div>

          {/* Category */}
          <div className="input-group">
            <label style={{ display: 'flex', justifyContent: 'space-between', width: '100%' }}>
              <span><i className="ri-price-tag-3-line" /> หมวดหมู่</span>
              <button type="button" className="icon-btn-small" style={{ fontSize: '0.85rem', color: 'var(--accent-primary)', fontWeight: 600, padding: 0 }} onClick={() => setShowManageModal(true)}>
                <i className="ri-settings-4-line" /> จัดการ
              </button>
            </label>
            <CategoryGrid
              options={categories[selectedType] || []}
              selected={selectedCategory}
              onSelect={setSelectedCategory}
              onAddNew={handleAddNewCategory}
            />
          </div>

          {/* Amount */}
          <div className="input-group amount-group">
            <label htmlFor="amount"><i className="ri-money-dollar-circle-line" /> จำนวนเงิน</label>
            <div className="amount-wrapper">
              <span className="currency-symbol">฿</span>
              <input
                type="number"
                id="amount"
                min="0"
                step="0.01"
                placeholder="0.00"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                required
              />
            </div>
          </div>

          {/* Details */}
          <div className="input-group">
            <label htmlFor="details"><i className="ri-file-text-line" /> รายละเอียด</label>
            <textarea
              id="details"
              rows={2}
              placeholder="รายละเอียดเพิ่มเติม..."
              value={details}
              onChange={(e) => setDetails(e.target.value)}
            />
          </div>

          <button type="submit" className={`submit-btn ${loading ? 'loading' : ''}`} disabled={loading}>
            <span className="btn-text">บันทึกรายการ</span>
            <i className="ri-send-plane-fill" />
            <div className="spinner" />
          </button>
        </form>
      </div>

      {showPrompt && (
        <CategoryModal
          title="เพิ่มหมวดหมู่ใหม่"
          placeholder="ระบุชื่อหมวดหมู่..."
          onClose={() => setShowPrompt(false)}
          onConfirm={handlePromptConfirm}
        />
      )}

      {showManageModal && (
        <ManageCategoriesModal
          showToast={showToast}
          onClose={() => setShowManageModal(false)}
          onCategoriesChange={fetchData}
        />
      )}
    </div>
  );
}
