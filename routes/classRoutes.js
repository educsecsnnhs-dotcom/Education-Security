// routes/classRoutes.js
const express = require('express');
const router = express.Router();
const Class = require('../models/Class');
const { authRequired } = require('../middleware/authMiddleware');
const { requireAnyRole } = require('../middleware/roleMiddleware');

// Create a new class (Registrar, Admin, Super Admin)
router.post('/', authRequired, requireAnyRole('Registrar', 'Admin', 'Super Admin'), async (req, res) => {
  try {
    const { subject, description, sheetId } = req.body;
    const newClass = new Class({ subject, description, sheetId });
    await newClass.save();
    res.json(newClass);
  } catch (e) {
    res.status(400).json({ error: e.message });
  }
});

// List all classes (any logged-in user)
router.get('/', authRequired, async (req, res) => {
  try {
    const classes = await Class.find();
    res.json(classes);
  } catch (e) {
    res.status(400).json({ error: e.message });
  }
});

// Get one class by ID
router.get('/:id', authRequired, async (req, res) => {
  try {
    const cls = await Class.findById(req.params.id);
    if (!cls) return res.status(404).json({ error: 'Class not found' });
    res.json(cls);
  } catch (e) {
    res.status(400).json({ error: e.message });
  }
});

// Update class details (Registrar, Admin, Super Admin)
router.put('/:id', authRequired, requireAnyRole('Registrar', 'Admin', 'Super Admin'), async (req, res) => {
  try {
    const cls = await Class.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!cls) return res.status(404).json({ error: 'Class not found' });
    res.json(cls);
  } catch (e) {
    res.status(400).json({ error: e.message });
  }
});

// Delete class (Super Admin only)
router.delete('/:id', authRequired, requireAnyRole('Super Admin'), async (req, res) => {
  try {
    const cls = await Class.findByIdAndDelete(req.params.id);
    if (!cls) return res.status(404).json({ error: 'Class not found' });
    res.json({ message: 'Class deleted' });
  } catch (e) {
    res.status(400).json({ error: e.message });
  }
});

module.exports = router;
