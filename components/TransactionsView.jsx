'use client';

const THAI_MONTHS_LONG = ['มกราคม', 'กุมภาพันธ์', 'มีนาคม', 'เมษายน', 'พฤษภาคม', 'มิถุนายน', 'กรกฎาคม', 'สิงหาคม', 'กันยายน', 'ตุลาคม', 'พฤศจิกายน', 'ธันวาคม'];

// Transaction list item (แทน createTransactionElement() ใน script.js)
function TransactionItem({ data, onEdit }) {
  const isIncome = data.type === 'รายรับ';
  const d = new Date(data.date);
  const dateStr = !isNaN(d) ? `${d.getDate()} ${d.toLocaleString('en', { month: 'short' })}` : '-';
  const formattedAmount = Number(data.amount).toLocaleString('en-US', { minimumFractionDigits: 2 });

  return (
    <div className="transaction-item" onClick={() => onEdit(data)}>
      <div className="t-main">
        <div className={`t-icon ${isIncome ? 'income' : 'expense'}`}>
          <i className={isIncome ? 'ri-arrow-right-down-line' : 'ri-arrow-right-up-line'} />
        </div>
        <div className="t-details">
          <h4>{data.category}</h4>
          <p>{data.details || '-'} • {dateStr}</p>
        </div>
        <div className="t-actions">
          <button className="action-btn" onClick={(e) => { e.stopPropagation(); onEdit(data); }}>
            <i className="ri-edit-line" />
          </button>
        </div>
      </div>
      <div className={`t-amount ${isIncome ? 'income' : 'expense'}`}>
        {isIncome ? '+' : '-'}฿{formattedAmount}
      </div>
    </div>
  );
}

// TransactionsView (แทน renderFullTransactions() ใน script.js)
export default function TransactionsView({ transactions, onEdit }) {
  // Group by month
  const grouped = [];
  let lastMonth = '';
  transactions.forEach((t) => {
    const d = new Date(t.date);
    if (isNaN(d)) return;
    const monthKey = `${THAI_MONTHS_LONG[d.getMonth()]} ${d.getFullYear()}`;
    if (monthKey !== lastMonth) {
      lastMonth = monthKey;
      grouped.push({ type: 'header', key: monthKey, label: monthKey });
    }
    grouped.push({ type: 'item', key: `${t.id}-${t.date}`, data: t });
  });

  if (grouped.length === 0) {
    return (
      <div className="glass-panel">
        <div className="form-header"><h3>ประวัติรายการ</h3></div>
        <div className="empty-state">
          <i className="ri-inbox-archive-line" />
          <p>ยังไม่มีรายการเลย</p>
        </div>
      </div>
    );
  }

  return (
    <div className="glass-panel">
      <div className="form-header"><h3>ประวัติรายการ</h3></div>
      <div className="transaction-list">
        {grouped.map((row) => {
          if (row.type === 'header') {
            return (
              <div key={row.key} className="month-header">
                <h5>{row.label}</h5>
              </div>
            );
          }
          return <TransactionItem key={row.key} data={row.data} onEdit={onEdit} />;
        })}
      </div>
    </div>
  );
}
