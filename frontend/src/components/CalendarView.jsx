import { useState } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { isOverdue } from '../utils';

const DAYS = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
const MONTHS = [
  'January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December',
];

const keyOf = (d) =>
  `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;

export default function CalendarView({ tasks }) {
  const today = new Date();
  const [cursor, setCursor] = useState(new Date(today.getFullYear(), today.getMonth(), 1));
  const [selected, setSelected] = useState(keyOf(today));

  const year = cursor.getFullYear();
  const month = cursor.getMonth();
  const firstDay = new Date(year, month, 1).getDay();
  const daysInMonth = new Date(year, month + 1, 0).getDate();

  // Group tasks by due date
  const byDate = {};
  tasks.forEach((t) => {
    if (!t.dueDate) return;
    const k = keyOf(new Date(t.dueDate));
    if (!byDate[k]) byDate[k] = [];
    byDate[k].push(t);
  });

  const cells = [];
  for (let i = 0; i < firstDay; i++) cells.push(null);
  for (let d = 1; d <= daysInMonth; d++) cells.push(new Date(year, month, d));

  const selectedTasks = byDate[selected] || [];

  return (
    <>
      <div className="panel">
        <div className="cal-head">
          <button className="icon-btn" onClick={() => setCursor(new Date(year, month - 1, 1))}>
            <ChevronLeft size={18} />
          </button>
          <h3>{MONTHS[month]} {year}</h3>
          <button className="icon-btn" onClick={() => setCursor(new Date(year, month + 1, 1))}>
            <ChevronRight size={18} />
          </button>
        </div>

        <div className="cal-grid">
          {DAYS.map((d) => <div key={d} className="cal-dayname">{d}</div>)}

          {cells.map((date, i) => {
            if (!date) return <div key={i} className="cal-cell empty" />;
            const k = keyOf(date);
            const list = byDate[k] || [];
            const cls = [
              'cal-cell',
              k === keyOf(today) ? 'today' : '',
              k === selected ? 'selected' : '',
            ].join(' ');
            return (
              <div key={i} className={cls} onClick={() => setSelected(k)}>
                <span className="cal-num">{date.getDate()}</span>
                <div className="cal-dots">
                  {list.slice(0, 3).map((t) => (
                    <span key={t._id} className={`cal-pill ${t.priority}`} title={t.title}>
                      {t.title}
                    </span>
                  ))}
                  {list.length > 3 && <span className="cal-more">+{list.length - 3} more</span>}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      <div className="panel" style={{ marginTop: 16 }}>
        <h3>Tasks on {selected}</h3>
        {selectedTasks.length === 0 && <p className="muted">No tasks on this day.</p>}
        {selectedTasks.map((t) => (
          <div className="list-row" key={t._id}>
            <span className={t.completed ? 'done' : ''}>{t.title}</span>
            <span>
              <span className="chip">{t.category || 'Personal'}</span>{' '}
              <span className={`badge ${t.priority}`}>{t.priority}</span>{' '}
              {isOverdue(t) && <span className="due overdue">Overdue</span>}
            </span>
          </div>
        ))}
      </div>
    </>
  );
}