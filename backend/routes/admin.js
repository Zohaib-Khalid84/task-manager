const express = require('express');
const User = require('../models/User');
const Task = require('../models/Task');
const auth = require('../middleware/auth');
const admin = require('../middleware/admin');

const router = express.Router();
router.use(auth, admin);

// System statistics
router.get('/stats', async (req, res) => {
  const [users, tasks, completed] = await Promise.all([
    User.countDocuments(),
    Task.countDocuments(),
    Task.countDocuments({ completed: true }),
  ]);
  res.json({ users, tasks, completed, pending: tasks - completed });
});

// All users with their task counts
router.get('/users', async (req, res) => {
  const users = await User.find().select('-password').sort({ createdAt: -1 });
  const counts = await Task.aggregate([{ $group: { _id: '$user', count: { $sum: 1 } } }]);
  const map = {};
  counts.forEach((c) => (map[c._id.toString()] = c.count));
  res.json(users.map((u) => ({ ...u.toObject(), taskCount: map[u._id.toString()] || 0 })));
});

// Delete a user and their tasks
router.delete('/users/:id', async (req, res) => {
  if (req.params.id === req.userId) {
    return res.status(400).json({ message: 'You cannot delete your own account' });
  }
  await Task.deleteMany({ user: req.params.id });
  await User.findByIdAndDelete(req.params.id);
  res.json({ message: 'User deleted' });
});

module.exports = router;