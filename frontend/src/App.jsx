import { useState, useEffect, useCallback } from 'react';
import Auth from './components/Auth';
import Layout from './components/Layout';
import Overview from './components/Overview';
import Tasks from './components/Tasks';
import api from './api';

export default function App() {
  const [user, setUser] = useState(() => {
    const saved = localStorage.getItem('user');
    return saved ? JSON.parse(saved) : null;
  });
  const [theme, setTheme] = useState(localStorage.getItem('theme') || 'light');
  const [page, setPage] = useState('overview');
  const [tasks, setTasks] = useState([]);

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem('theme', theme);
  }, [theme]);

  const loadTasks = useCallback(async () => {
    try {
      const { data } = await api.get('/tasks');
      setTasks(data);
    } catch (err) {
      console.error(err);
    }
  }, []);

  useEffect(() => {
    if (user) loadTasks();
  }, [user, loadTasks]);

  const handleLogin = (data) => {
    localStorage.setItem('token', data.token);
    localStorage.setItem('user', JSON.stringify(data.user));
    setUser(data.user);
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setUser(null);
    setTasks([]);
    setPage('overview');
  };

  if (!user) return <Auth onLogin={handleLogin} />;

  return (
    <Layout
      user={user}
      page={page}
      setPage={setPage}
      theme={theme}
      toggleTheme={() => setTheme(theme === 'light' ? 'dark' : 'light')}
      onLogout={handleLogout}
    >
      {page === 'overview' ? (
        <Overview user={user} tasks={tasks} goToTasks={() => setPage('tasks')} />
      ) : (
        <Tasks tasks={tasks} reload={loadTasks} />
      )}
    </Layout>
  );
}