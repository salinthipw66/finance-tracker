'use client';
import { useState, useEffect } from 'react';

export default function DateInput({ value, onChange, required, id }) {
  // value is expected to be YYYY-MM-DD
  const [textValue, setTextValue] = useState('');

  // Sync textValue when value changes from outside (e.g. initial load, form reset)
  useEffect(() => {
    if (value) {
      const [y, m, d] = value.split('-');
      if (y && m && d && y.length === 4) {
        setTextValue(`${d}/${m}/${y}`);
      }
    } else {
      setTextValue('');
    }
  }, [value]);

  const handleTextChange = (e) => {
    let val = e.target.value.replace(/[^0-9]/g, '');
    if (val.length > 2) val = val.slice(0, 2) + '/' + val.slice(2);
    if (val.length > 5) val = val.slice(0, 5) + '/' + val.slice(5, 9);
    setTextValue(val);

    if (val.length === 10) {
      const [d, m, y] = val.split('/');
      if (typeof onChange === 'function') {
        onChange(`${y}-${m}-${d}`);
      }
    } else if (val === '') {
      if (typeof onChange === 'function') {
        onChange('');
      }
    }
  };

  const handleNativeChange = (e) => {
    const val = e.target.value; // YYYY-MM-DD
    if (typeof onChange === 'function') {
      onChange(val);
    }
  };

  return (
    <div style={{ position: 'relative', display: 'flex', flex: 1 }}>
      <input
        type="text"
        id={id}
        placeholder="วว/ดด/ปปปป"
        required={required}
        value={textValue}
        onChange={handleTextChange}
        autoComplete="off"
        inputMode="numeric"
        style={{ flex: 1, paddingRight: 45 }}
      />
      <input
        type="date"
        value={value}
        onChange={handleNativeChange}
        style={{
          position: 'absolute', right: 0, top: 0, bottom: 0, width: 45,
          opacity: 0, cursor: 'pointer', zIndex: 10, margin: 0, padding: 0, border: 'none'
        }}
      />
      <i
        className="ri-calendar-2-line"
        style={{
          position: 'absolute', right: 14, top: '50%', transform: 'translateY(-50%)',
          color: 'var(--text-secondary)', pointerEvents: 'none', fontSize: '1.2rem'
        }}
      />
    </div>
  );
}
