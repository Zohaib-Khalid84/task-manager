import { CheckCircle2, Clock, ListTodo, AlertTriangle } from 'lucide-react';
import { formatDate, isOverdue } from '../utils';
import WeeklyChart from './WeeklyChart';
import CountUp from './CountUp';
export default function Overview({ user, tasks, goToTasks }) {
  const total = tasks.length;
  const done = tasks.filter((t) => t.completed).length;
  const pending = total - done;
  const overdue = tasks.filter(isOverdue).length;
  const percent = total ? Math.round((done / total) * 100) : 0;

  const R = 54;
  const C = 2 * Math.PI * R;

  const priorities = ['High', 'Medium', 'Low'].map((p) => ({
    name: p,
    count: tasks.filter((t) => t.priority === p).length,
  }));
  const maxP = Math.max(1, ...priorities.map((p) => p.count));

  const upcoming = tasks
    .filter((t) => t.dueDate && !t.completed)
    .sort((a, b) => new Date(a.dueDate) - new Date(b.dueDate))
    .slice(0, 5);

  const recent = tasks.slice(0, 5);

  const hour = new Date().getHours();
  const greet = hour < 12 ? 'Good morning' : hour < 18 ? 'Good afternoon' : 'Good evening';

  const cards = [
    { label: 'Total Tasks', value: total, icon: <ListTodo size={22} />, color: 'blue' },
    { label: 'Completed', value: done, icon: <CheckCircle2 size={22} />, color: 'green' },
    { label: 'Pending', value: pending, icon: <Clock size={22} />, color: 'amber' },
    { label: 'Overdue', value: overdue, icon: <AlertTriangle size={22} />, color: 'red' },
  ];

  return (
    <>
      <div className="hero">
        <div>
          <h2>{greet}, {user.name.split(' ')[0]} 👋</h2>
          <p>
            {pending === 0
              ? 'You are all caught up. Great work!'
              : `You have ${pending} pending task${pending > 1 ? 's' : ''}.`}
          </p>
        </div>
        <button className="btn-primary" onClick={goToTasks}>Manage Tasks</button>
      </div>

      <div className="stat-grid">
        {cards.map((c) => (
          <div className="stat-card" key={c.label}>
            <div className={`stat-icon ${c.color}`}>{c.icon}</div>
            <div>
              <div className="stat-value"><CountUp value={c.value} /></div>
              <div className="stat-label">{c.label}</div>
            </div>
          </div>
        ))}
      </div>
            <div className="panel" style={{ marginBottom: 18 }}>
        <h3>Weekly Activity</h3>
        <WeeklyChart tasks={tasks} />
      </div>

      <div className="grid-2">
        <div className="panel">
          <h3>Completion</h3>
          <div className="donut-wrap">
            <svg viewBox="0 0 140 140" width="160" height="160">
              <circle cx="70" cy="70" r={R} className="donut-bg" />
              <circle
                cx="70" cy="70" r={R}
                className="donut-fg"
                strokeDasharray={`${(percent / 100) * C} ${C}`}
                transform="rotate(-90 70 70)"
              />
              <text x="70" y="76" textAnchor="middle" className="donut-text">{percent}%</text>
            </svg>
            <div className="legend">
              <div><span className="dot green" /> Completed: {done}</div>
              <div><span className="dot gray" /> Pending: {pending}</div>
            </div>
          </div>
        </div>

        <div className="panel">
          <h3>Tasks by Priority</h3>
          {priorities.map((p) => (
            <div className="bar-row" key={p.name}>
              <span className="bar-label">{p.name}</span>
              <div className="bar-track">
                <div className={`bar-fill ${p.name}`} style={{ width: `${(p.count / maxP) * 100}%` }} />
              </div>
              <span className="bar-count">{p.count}</span>
            </div>
          ))}
        </div>
      </div>

      <div className="grid-2">
        <div className="panel">
          <h3>Upcoming Deadlines</h3>
          {upcoming.length === 0 && <p className="muted">No upcoming deadlines.</p>}
          {upcoming.map((t) => (
            <div className="list-row" key={t._id}>
              <span>{t.title}</span>
              <span className={isOverdue(t) ? 'due overdue' : 'due'}>{formatDate(t.dueDate)}</span>
            </div>
          ))}
        </div>

        <div className="panel">
          <h3>Recent Tasks</h3>
          {recent.length === 0 && <p className="muted">No tasks yet.</p>}
          {recent.map((t) => (
            <div className="list-row" key={t._id}>
              <span className={t.completed ? 'done' : ''}>{t.title}</span>
              <span className={`badge ${t.priority}`}>{t.priority}</span>
            </div>
          ))}
        </div>
      </div>
    </>
  );
}
