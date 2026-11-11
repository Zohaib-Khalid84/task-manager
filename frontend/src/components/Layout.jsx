import { LayoutDashboard, ListChecks, Kanban as KanbanIcon, CalendarDays, Sun, Moon, LogOut } from 'lucide-react';

export default function Layout({ user, page, setPage, theme, toggleTheme, onLogout, children }) {
  const items = [
    { id: 'overview', label: 'Overview', icon: <LayoutDashboard size={18} /> },
    { id: 'tasks', label: 'My Tasks', icon: <ListChecks size={18} /> },
        { id: 'kanban', label: 'Board', icon: <KanbanIcon size={18} /> },
            { id: 'calendar', label: 'Calendar', icon: <CalendarDays size={18} /> },
  ];

  return (
    <div className="app">
      <aside className="sidebar">
        <div className="brand">
          <span className="logo">✓</span>
          <span className="brand-text">TaskFlow</span>
        </div>
        <nav>
          {items.map((it) => (
            <button
              key={it.id}
              className={page === it.id ? 'nav-item active' : 'nav-item'}
              onClick={() => setPage(it.id)}
            >
              {it.icon}
              <span>{it.label}</span>
            </button>
          ))}
        </nav>
        <button className="nav-item logout-btn" onClick={onLogout}>
          <LogOut size={18} />
          <span>Logout</span>
        </button>
      </aside>

      <div className="main">
        <header className="topbar">
         <h1>{{ overview: 'Overview', tasks: 'My Tasks', kanban: 'Task Board', calendar: 'Calendar' }[page]}</h1>
          <div className="topbar-right">
            <button className="icon-btn" onClick={toggleTheme} title="Toggle theme">
              {theme === 'light' ? <Moon size={18} /> : <Sun size={18} />}
            </button>
            <div className="user-chip">
              <div className="avatar">{user.name.charAt(0).toUpperCase()}</div>
              <span className="user-name">{user.name}</span>
            </div>
          </div>
        </header>
        <div className="content">{children}</div>
      </div>
    </div>
  );
}