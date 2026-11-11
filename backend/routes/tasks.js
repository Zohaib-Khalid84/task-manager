const express = require('express');
const Task = require('../models/Task');
const auth = require('../middleware/auth');

const router = express.Router();
router.use(auth); // every route below requires login

// Get my tasks
router.get('/', async (req, res) => {
  const tasks = await Task.find({ user: req.userId }).sort({ createdAt: -1 });
  res.json(tasks);
});

// Add task
router.post('/', async (req, res) => {
  const { title, priority, dueDate } = req.body;
  if (!title) return res.status(400).json({ message: 'Title is required' });
  const task = await Task.create({
    user: req.userId,
    title,
    priority: priority || 'Medium',
    dueDate: dueDate || null,
  });
  res.status(201).json(task);
});

// Update task (mark done / edit title)
router.put('/:id', async (req, res) => {
  const task = await Task.findOneAndUpdate(
    { _id: req.params.id, user: req.userId },
    req.body,
    { new: true }
  );
  if (!task) return res.status(404).json({ message: 'Task not found' });
  res.json(task);
});

// Delete task
router.delete('/:id', async (req, res) => {
  const task = await Task.findOneAndDelete({ _id: req.params.id, user: req.userId });
  if (!task) return res.status(404).json({ message: 'Task not found' });
  res.json({ message: 'Task deleted' });
});

module.exports = router;