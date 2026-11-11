export const formatDate = (d) =>
  new Date(d).toLocaleDateString(undefined, { day: 'numeric', month: 'short', year: 'numeric' });

export const isOverdue = (task) =>
  task.dueDate && !task.completed && new Date(task.dueDate) < new Date(new Date().toDateString());