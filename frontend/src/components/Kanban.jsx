import { useState } from 'react';
import { Calendar } from 'lucide-react';
import api from '../api';
import { formatDate, isOverdue, getStatus } from '../utils';

const COLUMNS = [
  { id: 'todo', title: 'To Do', color: 'blue' },
  { id: 'inprogress', title: 'In Progress', color: 'amber' },
  { id: 'done', title: 'Done', color: 'green' },
];

export default function Kanban({ tasks, reload }) {
  const [dragId, setDragId] = useState(null);
  const [overCol, setOverCol] = useState(null);

  const moveTask = async (id, status) => {
    const task = tasks.find((t) => t._id === id);
    if (!task || getStatus(task) === status) return;
    await api.put(`/tasks/${id}`, { status });
    reload();
  };

  const onDrop = (e, status) => {
    e.preventDefault();
    if (dragId) moveTask(dragId, status);
    setDragId(null);
    setOverCol(null);
  };

  return (
    <div className="kanban">
      {COLUMNS.map((col) => {
        const items = tasks.filter((t) => getStatus(t) === col.id);
        return (
          <div
            key={col.id}
            className={overCol === col.id ? 'k-col over' : 'k-col'}
            onDragOver={(e) => { e.preventDefault(); setOverCol(col.id); }}
            onDragLeave={() => setOverCol(null)}
            onDrop={(e) => onDrop(e, col.id)}
          >
            <div className="k-head">
              <span className={`dot ${col.color}`} />
              <h3>{col.title}</h3>
              <span className="k-count">{items.length}</span>
            </div>

            {items.length === 0 && <p className="muted k-empty">Drop tasks here</p>}

            {items.map((t) => (
              <div
                key={t._id}
                className={dragId === t._id ? 'k-card dragging' : 'k-card'}
                draggable
                onDragStart={() => setDragId(t._id)}
                onDragEnd={() => { setDragId(null); setOverCol(null); }}
              >
                <div className="k-title">{t.title}</div>
                {t.description && <p className="task-desc">{t.description}</p>}
                <div className="task-meta">
                  <span className="chip">{t.category || 'Personal'}</span>
                  <span className={`badge ${t.priority}`}>{t.priority}</span>
                  {t.dueDate && (
                    <span className={isOverdue(t) ? 'due overdue' : 'due'}>
                      <Calendar size={13} /> {formatDate(t.dueDate)}
                    </span>
                  )}
                </div>
              </div>
            ))}
          </div>
        );
      })}
    </div>
  );
}