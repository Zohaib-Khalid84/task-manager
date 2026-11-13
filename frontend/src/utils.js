export const formatDate = (d) =>
  new Date(d).toLocaleDateString(undefined, { day: 'numeric', month: 'short', year: 'numeric' });

export const isOverdue = (task) =>
  task.dueDate && !task.completed && new Date(task.dueDate) < new Date(new Date().toDateString());
export const getStatus = (t) => (t.completed ? 'done' : t.status || 'todo');
export const toast = (message, type = 'success') =>
  window.dispatchEvent(new CustomEvent('toast', { detail: { message, type } }));