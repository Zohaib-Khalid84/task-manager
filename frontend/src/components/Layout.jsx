import { useState } from 'react';
import {
  LayoutDashboard, ListChecks, Kanban as KanbanIcon, CalendarDays, UserCircle,
  ShieldCheck, Sun, Moon, LogOut, PanelLeft,
} from 'lucide-react';

const TITLES = {
  overview: 'Overview', tasks: 'My Tasks', kanban: 'Task Board',
  calendar: 'Calendar', profile: 'Profile', admin: 'Admin Panel',
};

export default function Layout({ user, page, setPage, theme, toggleTheme, onLogout, children }) {
  const [collapsed, setCollapsed] = useState(false);

  const items = [
    { id: 'overview', label: 'Overview', icon: <LayoutDashboard size={18} /> },
    { id: 'tasks', label: 'My Tasks', icon: <ListChecks size={18} /> },
    { id: 'kanban', label: 'Board', icon: <KanbanIcon size={18} /> },
    { id: 'calendar', label: 'Calendar', icon: <CalendarDays size={18} /> },
    { id: 'profile', label: 'Profile', icon: <UserCircle size={18} /> },
  ];
  if (user.role === 'admin') {
    items.push({ id: 'admin', label: 'Admin', icon: <ShieldCheck size={18} /> });
  }

  const today = new Date().toLocaleDateString(undefined, {
    weekday: 'long', day: 'numeric', month: 'long', year: 'numeric',
  });

  return (
    <div className="app">
      <aside className={collapsed ? 'sidebar collapsed' : 'sidebar'}>
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
              title={it.label}
            >
              {it.icon}
              <span>{it.label}</span>
            </button>
          ))}
        </nav>
        <button className="nav-item logout-btn" onClick={onLogout} title="Logout">
          <LogOut size={18} />
          <span>Logout</span>
        </button>
      </aside>

      <div className="main">
        <header className="topbar">
          <div className="topbar-left">
            <button className="icon-btn" onClick={() => setCollapsed(!collapsed)} title="Toggle sidebar">
              <PanelLeft size={18} />
            </button>
            <div>
              <h1>{TITLES[page]}</h1>
              <span className="date-text">{today}</span>
            </div>
          </div>
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
        <div className="content" key={page}>{children}</div>
      </div>
    </div>
  );
}