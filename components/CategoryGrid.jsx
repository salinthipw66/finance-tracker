'use client';


export default function CategoryGrid({
  options,
  selected,
  onSelect,
  onAddNew,
}) {
  return (
    <div className="category-grid">
      {options.map((opt) => {
        const name = typeof opt === 'string' ? opt : opt.name;
        const isActive = selected === name;
        return (
          <button
            key={name}
            type="button"
            className={`cat-btn ${isActive ? 'active' : ''}`}
            onClick={() => onSelect(name)}
          >
            <span>{name}</span>
          </button>
        );
      })}

      {/* ปุ่มเพิ่มใหม่ */}
      <button type="button" className="cat-btn add-new-btn" onClick={onAddNew}>
        <span>+ เพิ่มใหม่</span>
      </button>
    </div>
  );
}
