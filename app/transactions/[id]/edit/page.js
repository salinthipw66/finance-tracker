'use client';
import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import CategoryGrid from '@/components/CategoryGrid';
import DateInput from '@/components/DateInput';
import Toast from '@/components/Toast';
import { useToast } from '@/lib/useData';

export default function EditTransactionPage() {
  const { id } = useParams();
  const router = useRouter();
  const { toast, showToast } = useToast();

  const [categories, setCategories] = useState({ รายรับ: [], รายจ่าย: [] });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const [type, setType] = useState('รายจ่าย');
  const [category, setCategory] = useState('');
  const [amount, setAmount] = useState('');
  const [details, setDetails] = useState('');
  const [date, setDate] = useState('');

  useEffect(() => {
    async function fetchData() {
      try {
        const res = await fetch('/api/transactions');
        const result = await res.json();
        if (result.status === 'success') {
          if (result.categories) setCategories(result.categories);
          const t = result.data.find((t) => String(t.id) === String(id));
          if (t) {
            setType(t.type);
            setCategory(t.category);
            setAmount(String(t.amount));
            setDetails(t.details || '');
            setDate(t.date ? t.date.split('T')[0] : '');
          } else {
            showToast('ไม่พบรายการนี้', true);
            router.push('/transactions');
          }
        }
      } catch (err) {
        console.error(err);
        showToast('ไม่สามารถดึงข้อมูลได้', true);
      } finally {
        setLoading(false);
      }
    }
    fetchData();
  }, [id]);

  const handleTypeChange = (t) => { setType(t); setCategory(''); };

  const handleSave = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      const res = await fetch(`/api/transactions/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ date, type, category, amount: parseFloat(amount), details }),
      });
      const result = await res.json();
      if (result.status === 'success') {
        showToast('อัปเดตข้อมูลสำเร็จ!');
        router.push('/transactions');
      } else {
        showToast(result.message || 'เกิดข้อผิดพลาด', true);
      }
    } catch (err) {
      showToast('ไม่สามารถอัปเดตได้', true);
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async () => {
    if (!confirm('ยืนยันที่จะลบรายการนี้?')) return;
    setSaving(true);
    try {
      const res = await fetch(`/api/transactions/${id}`, { method: 'DELETE' });
      const result = await res.json();
      if (result.status === 'success') {
        showToast('ลบรายการสำเร็จ!');
        router.push('/transactions');
      } else {
        showToast(result.message || 'เกิดข้อผิดพลาด', true);
      }
    } catch (err) {
      showToast('ไม่สามารถลบได้', true);
    } finally {
      setSaving(false);
    }
  };

  if (loading) return (
    <div className="glass-panel" style={{ textAlign: 'center', padding: '3rem' }}>
      <div className="spinner active" />
    </div>
  );

  return (
    <div className="glass-panel">
      <div className="form-header">
        <h3>แก้ไขรายการ</h3>
        <Link href="/transactions" className="icon-btn"><i className="ri-close-line" /></Link>
      </div>

      <form onSubmit={handleSave}>
        <div className="input-group">
          <label><i className="ri-calendar-event-line" /> วันที่</label>
          <DateInput value={date} onChange={setDate} required />
        </div>

        <div className="input-group">
          <label><i className="ri-exchange-funds-line" /> ประเภท</label>
          <div className="radio-group" style={{ flex: 1 }}>
            <input type="radio" id="edit-type-income" name="edit-type" value="รายรับ" checked={type === 'รายรับ'} onChange={() => handleTypeChange('รายรับ')} />
            <label htmlFor="edit-type-income" className="radio-label income-label">รายรับ</label>
            <input type="radio" id="edit-type-expense" name="edit-type" value="รายจ่าย" checked={type === 'รายจ่าย'} onChange={() => handleTypeChange('รายจ่าย')} />
            <label htmlFor="edit-type-expense" className="radio-label expense-label">รายจ่าย</label>
          </div>
        </div>

        <div className="input-group">
          <label><i className="ri-price-tag-3-line" /> หมวดหมู่</label>
          <CategoryGrid
            options={categories[type] || []}
            selected={category}
            onSelect={setCategory}
            onAddNew={() => {}}
          />
        </div>

        <div className="input-group">
          <label><i className="ri-money-dollar-circle-line" /> จำนวนเงิน</label>
          <div className="amount-wrapper">
            <span className="currency-symbol">฿</span>
            <input type="number" min="0" step="0.01" value={amount} onChange={(e) => setAmount(e.target.value)} required />
          </div>
        </div>

        <div className="input-group">
          <label><i className="ri-file-text-line" /> รายละเอียด</label>
          <textarea rows={2} value={details} onChange={(e) => setDetails(e.target.value)} />
        </div>

        <button type="submit" className={`submit-btn update-btn ${saving ? 'loading' : ''}`} style={{ marginBottom: 10 }} disabled={saving}>
          <span className="btn-text">อัปเดตข้อมูล</span>
          <i className="ri-save-line" />
          <div className="spinner" />
        </button>
        <button type="button" className="submit-btn delete-btn" onClick={handleDelete} disabled={saving}>
          <span className="btn-text">ลบรายการ</span>
          <i className="ri-delete-bin-line" />
        </button>
      </form>

      <Toast {...toast} />
    </div>
  );
}
