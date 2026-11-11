require('dotenv').config();
const mongoose = require('mongoose');
const User = require('./models/User');

mongoose.connect(process.env.MONGO_URI).then(async () => {
  const user = await User.findOneAndUpdate(
    { email: 'test@example.com' },
    { role: 'admin' },
    { new: true }
  );
  console.log(user ? `${user.email} is now ${user.role}` : 'User not found');
  process.exit();
});