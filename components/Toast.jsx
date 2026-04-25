'use client';

// Toast component (แทน showToast() function ใน script.js)
export default function Toast({ visible, message, isError }) {
  return (
    <div
      className={`toast ${visible ? 'show' : ''}`}
      style={{ background: isError ? 'var(--expense-color)' : '#10b981' }}
    >
      {message}
    </div>
  );
}
