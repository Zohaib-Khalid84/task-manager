import { useEffect, useState } from 'react';
import api from '../api';

export default function Dashboard({ user, onLogout }) {
  const [tasks, setTasks] = useState([]);
  const [title, setTitle] = useState('');

  const loadTasks = async () => {
    const { data } = await api.get('/tasks');
    setTasks(data);
  };

  useEffect(() => {
    loadTasks();
  }, []);

  const addTask = async (e) => {
    e.preventDefault();
    if (!title.trim()) return;
    await api.post('/tasks', { title });
    setTitle('');
    loadTasks();
  };

  const toggleTask = async (task) => {
    await api.put(`/tasks/${task._id}`, { completed: !task.completed });
    loadTasks();
  };

  const deleteTask = async (id) => {
    await api.delete(`/tasks/${id}`);
    loadTasks();
  };

  return (
    <div className="card">
      <div className="header">
        <h2>Welcome, {user.name}</h2>
        <button className="logout" onClick={onLogout}>Logout</button>
      </div>

      <form onSubmit={addTask} className="add-form">
        <input
          placeholder="Add a new task..."
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />
        <button type="submit">Add</button>
      </form>

      <ul>
        {tasks.length === 0 && <p className="empty">No tasks yet.</p>}
        {tasks.map((task) => (
          <li key={task._id}>
            <span
              className={task.completed ? 'done' : ''}
              onClick={() => toggleTask(task)}
            >
              {task.title}
            </span>
            <button className="delete" onClick={() => deleteTask(task._id)}>✕</button>
          </li>
        ))}
      </ul>
    </div>
  );
}