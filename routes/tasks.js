// routes/tasks.js
const express = require('express');
const Task = require('../models/Task');
const auth = require('./auth');

const router = express.Router();

// Create Task
router.post('/', auth, async (req, res) => {
  const { title, description, dueDate, category, priority } = req.body;
  try {
    const newTask = new Task({
      title,
      description,
      dueDate,
      category,
      priority,
      user: req.user.id
    });

    const task = await newTask.save();
    res.json(task);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

// Get Tasks
router.get('/', auth, async (req, res) => {
  try {
    const tasks = await Task.find({ user: req.user.id }).sort({ dueDate: 1 });
    res.json(tasks);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

// Update Task Status
router.put('/:id', auth, async (req, res) => {
  try {
    let task = await Task.findById(req.params.id);
    if (!task) {
      return res.status(404).json({ msg: 'Task not found' });
    }

    task.completed = !task.completed;
    await task.save();
    res.json(task);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

module.exports = router;
