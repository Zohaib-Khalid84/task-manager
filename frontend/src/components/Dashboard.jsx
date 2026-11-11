import { useEffect, useState } from 'react';
import api from '../api';

export default function Dashboard({ user, onLogout }) {
  const [tasks, setTasks] = useState([]);
  const [title, setTitle] = useState('');
  const [priority, setPriority] = useState('Medium');
  const [dueDate, setDueDate] = useState('');
  const [editId, setEditId] = useState(null);
  const [editTitle, setEditTitle] = useState('');

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
    await api.post('/tasks', { title, priority, dueDate: dueDate || null });
    setTitle('');
    setPriority('Medium');
    setDueDate('');
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

  const startEdit = (task) => {
    setEditId(task._id);
    setEditTitle(task.title);
  };

  const saveEdit = async (id) => {
    if (!editTitle.trim()) return;
    await api.put(`/tasks/${id}`, { title: editTitle });
    setEditId(null);
    loadTasks();
  };

  const formatDate = (d) => new Date(d).toLocaleDateString();
  const isOverdue = (task) =>
    task.dueDate && !task.completed && new Date(task.dueDate) < new Date(new Date().toDateString());

  return (
    <div className="card">
      <div className="header">
        <h2>Welcome, {user.name}</h2>
        <button className="logout" onClick={onLogout}>Logout</button>
      </div>

      <form onSubmit={addTask} className="task-form">
        <input
          placeholder="Add a new task..."
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />
        <div className="row">
          <select value={priority} onChange={(e) => setPriority(e.target.value)}>
            <option>Low</option>
            <option>Medium</option>
            <option>High</option>
          </select>
          <input type="date" value={dueDate} onChange={(e) => setDueDate(e.target.value)} />
        </div>
        <button type="submit">Add Task</button>
      </form>

      <ul>
        {tasks.length === 0 && <p className="empty">No tasks yet.</p>}
        {tasks.map((task) => (
          <li key={task._id}>
            <div className="task-main">
              {editId === task._id ? (
                <input
                  className="edit-input"
                  value={editTitle}
                  onChange={(e) => setEditTitle(e.target.value)}
                  autoFocus
                />
              ) : (
                <span className={task.completed ? 'done' : ''} onClick={() => toggleTask(task)}>
                  {task.title}
                </span>
              )}
              <div className="meta">
                <span className={`badge ${task.priority}`}>{task.priority}</span>
                {task.dueDate && (
                  <span className={isOverdue(task) ? 'due overdue' : 'due'}>
                    Due: {formatDate(task.dueDate)}
                  </span>
                )}
              </div>
            </div>
            <div className="actions">
              {editId === task._id ? (
                <>
                  <button className="save" onClick={() => saveEdit(task._id)}>Save</button>
                  <button className="cancel" onClick={() => setEditId(null)}>Cancel</button>
                </>
              ) : (
                <>
                  <button className="edit" onClick={() => startEdit(task)}>Edit</button>
                  <button className="delete" onClick={() => deleteTask(task._id)}>✕</button>
                </>
              )}
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}