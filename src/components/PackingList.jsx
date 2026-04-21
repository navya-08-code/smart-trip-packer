/**
 * PackingList.jsx
 * Renders packing items grouped by category with
 * collapsible sections, checkboxes, and item tags.
 */
import { useState } from 'react';
import { groupByCategory } from '../utils/packingLogic';

/* Category open/close is local UI state – not persisted */
export default function PackingList({ items, checkedState, onToggle }) {
  const grouped = groupByCategory(items);
  // Start all categories open by default
  const [openCats, setOpenCats] = useState(() =>
    Object.keys(grouped).reduce((acc, k) => ({ ...acc, [k]: true }), {})
  );

  function toggleCat(catId) {
    setOpenCats((prev) => ({ ...prev, [catId]: !prev[catId] }));
  }

  const totalItems   = items.length;
  const checkedCount = items.filter((i) => checkedState[i.id]).length;

  return (
    <section className="packing-section" aria-label="Packing List">
      <h2>
        🧳 Packing List
        <span>{checkedCount}/{totalItems} packed</span>
      </h2>

      {Object.values(grouped).map(({ meta, items: catItems }) => {
        const isOpen       = !!openCats[meta.id];
        const catChecked   = catItems.filter((i) => checkedState[i.id]).length;

        return (
          <div key={meta.id} className="category-group">
            {/* Category header / toggle */}
            <div
              role="button"
              tabIndex={0}
              aria-expanded={isOpen}
              id={`cat-header-${meta.id}`}
              className={`category-header${isOpen ? ' open' : ''}`}
              onClick={() => toggleCat(meta.id)}
              onKeyDown={(e) => (e.key === 'Enter' || e.key === ' ') && toggleCat(meta.id)}
            >
              <span className="cat-icon">{meta.icon}</span>
              <span className="cat-name">{meta.label}</span>
              <span className="cat-count">{catChecked}/{catItems.length}</span>
              <span className="cat-chevron">▼</span>
            </div>

            {/* Items list */}
            <div
              className={`items-list${isOpen ? ' expanded' : ''}`}
              aria-hidden={!isOpen}
              role="list"
            >
              {catItems.map((item) => {
                const checked = !!checkedState[item.id];
                return (
                  <div
                    key={item.id}
                    role="listitem"
                    id={`item-${item.id}`}
                    className={`pack-item${checked ? ' checked' : ''}`}
                    onClick={() => onToggle(item.id)}
                    onKeyDown={(e) => (e.key === 'Enter' || e.key === ' ') && onToggle(item.id)}
                    tabIndex={0}
                    aria-checked={checked}
                  >
                    {/* Custom checkbox */}
                    <div className="item-checkbox" aria-hidden="true" />
                    {/* Emoji */}
                    <span className="item-emoji" aria-hidden="true">{item.emoji}</span>
                    {/* Name */}
                    <span className="item-text">{item.name}</span>
                    {/* Tag pill */}
                    <span className={`item-tag ${item.tag}`}>{item.tag}</span>
                  </div>
                );
              })}
            </div>
          </div>
        );
      })}
    </section>
  );
}
