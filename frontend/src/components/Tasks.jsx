import { useState } from 'react';
import { Plus, Search, Pencil, Trash2, Calendar, X } from 'lucide-react';
import api from '../api';
import { formatDate, isOverdue , toast } from '../utils';

const CATEGORIES = ['Work', 'Study', 'Personal', 'Health', 'Other'];
const EMPTY = { title: '', description: '', category: 'Personal', priority: 'Medium', dueDate: '' };
const RANK = { High: 0, Medium: 1, Low: 2 };

export default function Tasks({ tasks, reload }) {
  const [search, setSearch] = useState('');
  const [status, setStatus] = useState('All');
  const [priority, setPriority] = useState('All');
  const [sort, setSort] = useState('newest');
  const [showModal, setShowModal] = useState(false);
  const [editId, setEditId] = useState(null);
  const [form, setForm] = useState(EMPTY);
  const [error, setError] = useState('');

  const openNew = () => {
    setEditId(null);
    setForm(EMPTY);
    setError('');
    setShowModal(true);
  };

  const openEdit = (t) => {
    setEditId(t._id);
    setForm({
      title: t.title,
      description: t.description || '',
      category: t.category || 'Personal',
      priority: t.priority,
      dueDate: t.dueDate ? t.dueDate.slice(0, 10) : '',
    });
    setError('');
    setShowModal(true);
  };

  const save = async (e) => {
    e.preventDefault();
    if (!form.title.trim()) return setError('Title is required');
    const payload = { ...form, title: form.title.trim(), dueDate: form.dueDate || null };
    try {
      if (editId) await api.put(`/tasks/${editId}`, payload);
      else await api.post('/tasks', payload);
      setShowModal(false);
      toast(editId ? 'Task updated' : 'Task created');
      reload();
    } catch (err) {
      setError(err.response?.data?.message || 'Could not save task');
    }
  };

  const toggle = async (t) => {
    await api.put(`/tasks/${t._id}`, { completed: !t.completed });
    reload();
  };

  const remove = async (id) => {
    if (!window.confirm('Delete this task?')) return;
    await api.delete(`/tasks/${id}`);
    toast('Task deleted');
    reload();
  };

  const visible = tasks
    .filter((t) => t.title.toLowerCase().includes(search.toLowerCase()))
    .filter((t) => status === 'All' || (status === 'Completed' ? t.completed : !t.completed))
    .filter((t) => priority === 'All' || t.priority === priority)
    .sort((a, b) => {
      if (sort === 'due') {
        if (!a.dueDate) return 1;
        if (!b.dueDate) return -1;
        return new Date(a.dueDate) - new Date(b.dueDate);
      }
      if (sort === 'priority') return RANK[a.priority] - RANK[b.priority];
      return new Date(b.createdAt) - new Date(a.createdAt);
    });

  return (
    <>
      <div className="toolbar">
        <div className="search-box">
          <Search size={16} />
          <input placeholder="Search tasks..." value={search} onChange={(e) => setSearch(e.target.value)} />
        </div>
        <select value={priority} onChange={(e) => setPriority(e.target.value)}>
          <option value="All">All priorities</option>
          <option>High</option>
          <option>Medium</option>
          <option>Low</option>
        </select>
        <select value={sort} onChange={(e) => setSort(e.target.value)}>
          <option value="newest">Newest first</option>
          <option value="due">Due date</option>
          <option value="priority">Priority</option>
        </select>
        <button className="btn-primary" onClick={openNew}>
          <Plus size={16} /> New Task
        </button>
      </div>

      <div className="tabs">
        {['All', 'Pending', 'Completed'].map((s) => (
          <button key={s} className={status === s ? 'tab active' : 'tab'} onClick={() => setStatus(s)}>
            {s}
          </button>
        ))}
      </div>

      {visible.length === 0 && <div className="panel empty-state">No tasks found.</div>}

      <div className="task-grid">
        {visible.map((t) => (
          <div className={t.completed ? 'task-card completed' : 'task-card'} key={t._id}>
            <div className="task-top">
              <label className="check">
                <input type="checkbox" checked={t.completed} onChange={() => toggle(t)} />
                <span className="task-title">{t.title}</span>
              </label>
              <div className="card-actions">
                <button className="icon-btn" onClick={() => openEdit(t)} title="Edit"><Pencil size={15} /></button>
                <button className="icon-btn danger" onClick={() => remove(t._id)} title="Delete"><Trash2 size={15} /></button>
              </div>
            </div>
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

      {showModal && (
        <div className="modal-bg" onClick={() => setShowModal(false)}>
          <form className="modal" onClick={(e) => e.stopPropagation()} onSubmit={save}>
            <div className="modal-head">
              <h3>{editId ? 'Edit Task' : 'New Task'}</h3>
              <button type="button" className="icon-btn" onClick={() => setShowModal(false)}><X size={18} /></button>
            </div>
            <label>Title</label>
            <input value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} autoFocus />
            <label>Description</label>
            <textarea rows="3" value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} />
            <div className="form-row">
              <div>
                <label>Category</label>
                <select value={form.category} onChange={(e) => setForm({ ...form, category: e.target.value })}>
                  {CATEGORIES.map((c) => <option key={c}>{c}</option>)}
                </select>
              </div>
              <div>
                <label>Priority</label>
                <select value={form.priority} onChange={(e) => setForm({ ...form, priority: e.target.value })}>
                  <option>Low</option>
                  <option>Medium</option>
                  <option>High</option>
                </select>
              </div>
            </div>
            <label>Due date</label>
            <input type="date" value={form.dueDate} onChange={(e) => setForm({ ...form, dueDate: e.target.value })} />
            {error && <p className="error">{error}</p>}
            <div className="modal-actions">
              <button type="button" className="btn-ghost" onClick={() => setShowModal(false)}>Cancel</button>
              <button type="submit" className="btn-primary">{editId ? 'Save Changes' : 'Create Task'}</button>
            </div>
          </form>
        </div>
      )}
    </>
  );
}