import { useEffect, useState } from 'react';
import { Users, ListTodo, CheckCircle2, Clock, Trash2 } from 'lucide-react';
import api from '../api';
import { formatDate } from '../utils';

export default function Admin({ currentUser }) {
  const [stats, setStats] = useState(null);
  const [users, setUsers] = useState([]);
  const [error, setError] = useState('');

  const load = async () => {
    try {
      const [s, u] = await Promise.all([api.get('/admin/stats'), api.get('/admin/users')]);
      setStats(s.data);
      setUsers(u.data);
    } catch (err) {
      setError(err.response?.data?.message || 'Could not load admin data');
    }
  };

  useEffect(() => {
    load();
  }, []);

  const removeUser = async (u) => {
    if (!window.confirm(`Delete ${u.name} and all their tasks?`)) return;
    try {
      await api.delete(`/admin/users/${u._id}`);
      load();
    } catch (err) {
      alert(err.response?.data?.message || 'Could not delete user');
    }
  };

  if (error) return <div className="panel error">{error}</div>;
  if (!stats) return <div className="panel muted">Loading...</div>;

  const cards = [
    { label: 'Total Users', value: stats.users, icon: <Users size={22} />, color: 'blue' },
    { label: 'Total Tasks', value: stats.tasks, icon: <ListTodo size={22} />, color: 'amber' },
    { label: 'Completed', value: stats.completed, icon: <CheckCircle2 size={22} />, color: 'green' },
    { label: 'Pending', value: stats.pending, icon: <Clock size={22} />, color: 'red' },
  ];

  return (
    <>
      <div className="stat-grid">
        {cards.map((c) => (
          <div className="stat-card" key={c.label}>
            <div className={`stat-icon ${c.color}`}>{c.icon}</div>
            <div>
              <div className="stat-value">{c.value}</div>
              <div className="stat-label">{c.label}</div>
            </div>
          </div>
        ))}
      </div>

      <div className="panel">
        <h3>All Users</h3>
        <div className="table-wrap">
          <table className="table">
            <thead>
              <tr>
                <th>Name</th>
                <th>Email</th>
                <th>Role</th>
                <th>Tasks</th>
                <th>Joined</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              {users.map((u) => (
                <tr key={u._id}>
                  <td>{u.name}</td>
                  <td>{u.email}</td>
                  <td><span className={u.role === 'admin' ? 'badge High' : 'chip'}>{u.role || 'user'}</span></td>
                  <td>{u.taskCount}</td>
                  <td>{formatDate(u.createdAt)}</td>
                  <td>
                    {u._id !== currentUser.id && (
                      <button className="icon-btn danger" onClick={() => removeUser(u)} title="Delete user">
                        <Trash2 size={15} />
                      </button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </>
  );
}