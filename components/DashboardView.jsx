'use client';
import { useState, useEffect, useRef } from 'react';
import Chart from 'chart.js/auto';

const THAI_MONTHS_SHORT = ['ม.ค.', 'ก.พ.', 'มี.ค.', 'เม.ย.', 'พ.ค.', 'มิ.ย.', 'ก.ค.', 'ส.ค.', 'ก.ย.', 'ต.ค.', 'พ.ย.', 'ธ.ค.'];
const THAI_MONTHS_LONG = ['มกราคม', 'กุมภาพันธ์', 'มีนาคม', 'เมษายน', 'พฤษภาคม', 'มิถุนายน', 'กรกฎาคม', 'สิงหาคม', 'กันยายน', 'ตุลาคม', 'พฤศจิกายน', 'ธันวาคม'];

function todayStr() {
  const now = new Date();
  return `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-${String(now.getDate()).padStart(2, '0')}`;
}

function thisMonthStr() {
  const now = new Date();
  return `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}`;
}

// แทน analyzeAndRenderDashboard() ใน script.js
function analyze(transactions) {
  let income = 0, expense = 0;
  const incCats = {}, expCats = {};
  transactions.forEach((t) => {
    if (t.type === 'รายรับ') {
      income += Number(t.amount);
      incCats[t.category] = (incCats[t.category] || 0) + Number(t.amount);
    } else {
      expense += Number(t.amount);
      expCats[t.category] = (expCats[t.category] || 0) + Number(t.amount);
    }
  });
  const sortedInc = Object.entries(incCats).sort((a, b) => b[1] - a[1]);
  const sortedExp = Object.entries(expCats).sort((a, b) => b[1] - a[1]);
  return { income, expense, balance: income - expense, sortedInc, sortedExp };
}

// Chart.js canvas component (แทน updateCharts() ใน script.js)
function CashflowChart({ income, expense }) {
  const ref = useRef(null);
  const chartRef = useRef(null);

  useEffect(() => {
    if (!ref.current) return;
    if (chartRef.current) chartRef.current.destroy();
    chartRef.current = new Chart(ref.current, {
      type: 'bar',
      data: {
        labels: ['Cashflow'],
        datasets: [
          { label: 'รายรับ', data: [income], backgroundColor: '#10b981', borderRadius: 4 },
          { label: 'รายจ่าย', data: [expense], backgroundColor: '#ef4444', borderRadius: 4 },
        ],
      },
      options: {
        responsive: true, maintainAspectRatio: false,
        plugins: {
          legend: { position: 'top', labels: { usePointStyle: true, boxWidth: 8 } },
          tooltip: { callbacks: { label: (c) => `${c.dataset.label}: ฿${c.raw.toLocaleString()}` } },
        },
        scales: { y: { beginAtZero: true } },
      },
    });
    return () => { if (chartRef.current) chartRef.current.destroy(); };
  }, [income, expense]);

  return <canvas ref={ref} />;
}

function DoughnutChart({ data, colors, totalLabel }) {
  const ref = useRef(null);
  const chartRef = useRef(null);

  useEffect(() => {
    if (!ref.current) return;
    if (chartRef.current) chartRef.current.destroy();
    const total = data.reduce((s, [, v]) => s + v, 0);
    chartRef.current = new Chart(ref.current, {
      type: 'doughnut',
      data: {
        labels: data.map(([k]) => k),
        datasets: [{ data: data.map(([, v]) => v), backgroundColor: colors, borderWidth: 2, borderColor: '#fff' }],
      },
      options: {
        responsive: true, maintainAspectRatio: false, cutout: '65%',
        plugins: {
          legend: { position: 'right', labels: { boxWidth: 12 } },
          tooltip: { callbacks: { label: (c) => `${c.label}: ฿${c.raw.toLocaleString()} (${total > 0 ? ((c.raw / total) * 100).toFixed(1) : 0}%)` } },
        },
      },
    });
    return () => { if (chartRef.current) chartRef.current.destroy(); };
  }, [data, colors]);

  return <canvas ref={ref} />;
}

export default function DashboardView({ transactions }) {
  const [mode, setMode] = useState('monthly'); // 'monthly' | 'daily'
  const [selectedMonth, setSelectedMonth] = useState(thisMonthStr());
  const [selectedDay, setSelectedDay] = useState(todayStr());

  // กรองตาม filter (แทน applyMonthFilter() ใน script.js)
  const filtered = transactions.filter((t) => {
    const d = new Date(t.date);
    if (isNaN(d)) return false;
    if (mode === 'monthly') {
      if (selectedMonth === 'all') return true;
      const ym = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`;
      return ym === selectedMonth;
    } else {
      const ds = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
      return ds === selectedDay;
    }
  });

  const { income, expense, balance, sortedInc, sortedExp } = analyze(filtered);

  // สร้างรายการเดือนที่มีข้อมูล (แทน populateMonthFilter() ใน script.js)
  const monthOptions = (() => {
    const seen = new Set();
    const opts = [{ value: 'all', label: 'ทั้งหมด' }];
    const now = new Date();
    const curYm = thisMonthStr();
    transactions.forEach((t) => {
      const d = new Date(t.date);
      if (isNaN(d)) return;
      const ym = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`;
      if (!seen.has(ym)) {
        seen.add(ym);
        opts.push({
          value: ym,
          label: ym === curYm
            ? `เดือนนี้ (${THAI_MONTHS_SHORT[d.getMonth()]} ${d.getFullYear()})`
            : `${THAI_MONTHS_SHORT[d.getMonth()]} ${d.getFullYear()}`,
        });
      }
    });
    if (!seen.has(curYm)) {
      const d = now;
      opts.splice(1, 0, { value: curYm, label: `เดือนนี้ (${THAI_MONTHS_SHORT[d.getMonth()]} ${d.getFullYear()})` });
    }
    return opts;
  })();

  const displayLabel = (() => {
    if (mode === 'monthly') {
      return monthOptions.find((o) => o.value === selectedMonth)?.label || 'ทั้งหมด';
    } else {
      const d = new Date(selectedDay);
      return `วันที่ ${d.getDate()} ${THAI_MONTHS_SHORT[d.getMonth()]} ${d.getFullYear()}`;
    }
  })();

  const incColors = ['#10b981', '#059669', '#34d399', '#6ee7b7', '#a7f3d0'];
  const expColors = ['#ef4444', '#f59e0b', '#10b981', '#3b82f6', '#8b5cf6', '#ec4899', '#14b8a6', '#f43f5e', '#6366f1', '#84cc16'];

  return (
    <div>
      {/* Summary Card */}
      <div className="summary-section glass-panel">
        {/* Mode Toggle */}
        <div className="mode-toggle">
          <button className={`mode-btn ${mode === 'monthly' ? 'active' : ''}`} onClick={() => setMode('monthly')}>รายเดือน</button>
          <button className={`mode-btn ${mode === 'daily' ? 'active' : ''}`} onClick={() => setMode('daily')}>รายวัน</button>
        </div>

        <div className="form-header" style={{ alignItems: 'flex-start' }}>
          <h3 style={{ lineHeight: 1.4 }}>
            สรุปยอด:<br />
            <span style={{ fontSize: '1rem', color: 'var(--accent-primary)' }}>{displayLabel}</span>
          </h3>
          <div style={{ flex: 1, textAlign: 'right' }}>
            {mode === 'monthly' ? (
              <select className="filter-select" value={selectedMonth} onChange={(e) => setSelectedMonth(e.target.value)}>
                {monthOptions.map((o) => <option key={o.value} value={o.value}>{o.label}</option>)}
              </select>
            ) : (
              <input
                type="date"
                className="filter-select"
                value={selectedDay}
                onChange={(e) => setSelectedDay(e.target.value)}
              />
            )}
          </div>
        </div>

        {/* Summary Cards */}
        <div className="summary-cards-grid">
          <div className="scard scard-summary">
            <p>รายรับรวม</p>
            <h2 className="text-income">+{income.toLocaleString()}</h2>
          </div>
          <div className="scard scard-summary">
            <p>รายจ่ายรวม</p>
            <h2 className="text-expense">-{expense.toLocaleString()}</h2>
          </div>
          <div className="scard scard-list">
            <p>รายรับสูงสุด</p>
            <ul>
              {sortedInc.slice(0, 4).length > 0
                ? sortedInc.slice(0, 4).map(([cat, amt]) => (
                  <li key={cat}><span>{cat}</span><span>+{amt.toLocaleString()}</span></li>
                ))
                : <li><span style={{ opacity: 0.5 }}>ไม่มีข้อมูล</span></li>
              }
            </ul>
          </div>
          <div className="scard scard-list">
            <p>รายจ่ายสูงสุด</p>
            <ul>
              {sortedExp.slice(0, 4).length > 0
                ? sortedExp.slice(0, 4).map(([cat, amt]) => (
                  <li key={cat}><span>{cat}</span><span>-{amt.toLocaleString()}</span></li>
                ))
                : <li><span style={{ opacity: 0.5 }}>ไม่มีข้อมูล</span></li>
              }
            </ul>
          </div>
          <div className="scard scard-balance">
            <p>คงเหลือรวม</p>
            <h2 style={{ color: balance >= 0 ? 'var(--income-color)' : 'var(--expense-color)' }}>
              ฿{balance.toLocaleString('en-US', { minimumFractionDigits: 2 })}
            </h2>
          </div>
        </div>
      </div>

      {/* Charts (แสดงเฉพาะ monthly mode) */}
      {mode === 'monthly' && (
        <div className="charts-grid">
          <div className="chart-container">
            <h4>กระแสเงินสด</h4>
            <div style={{ flexGrow: 1, position: 'relative' }}>
              <CashflowChart income={income} expense={expense} />
            </div>
          </div>
          {sortedInc.length > 0 && (
            <div className="chart-container">
              <h4 style={{ color: 'var(--income-color)' }}>สัดส่วนรายรับ</h4>
              <div style={{ flexGrow: 1, position: 'relative' }}>
                <DoughnutChart data={sortedInc} colors={incColors} />
              </div>
            </div>
          )}
          {sortedExp.length > 0 && (
            <div className="chart-container">
              <h4 style={{ color: 'var(--expense-color)' }}>สัดส่วนรายจ่าย</h4>
              <div style={{ flexGrow: 1, position: 'relative' }}>
                <DoughnutChart data={sortedExp} colors={expColors} />
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
