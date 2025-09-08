// routes/roleRoutes.js
const express = require('express');
const router = express.Router();
const User = require('../models/User');
const { authRequired } = require('../middleware/authMiddleware');
const { requireAnyRole } = require('../middleware/roleMiddleware');

// Helper: check if at least one user remains with a critical role
async function ensureNotLastCritical(user, rolesToRemove) {
  for (const role of rolesToRemove) {
    if (['Registrar', 'Super Admin'].includes(role) && user.roles.includes(role)) {
      const count = await User.countDocuments({ roles: role });
      if (count <= 1) {
        throw new Error(`Cannot remove the last ${role} from the system`);
      }
    }
  }
}

// ---------------------- REGISTRAR ----------------------

// Registrar can assign: Student, Moderator, SSG
router.post('/promote', authRequired, requireAnyRole('Registrar'), async (req, res) => {
  try {
    const { username, addRoles = [] } = req.body;
    const allowed = ['Student', 'Moderator', 'SSG'];
    const rolesToAdd = addRoles.filter(r => allowed.includes(r));

    const user = await User.findOne({ username });
    if (!user) return res.status(404).json({ error: 'User not found' });

    const set = new Set([...(user.roles || []), ...rolesToAdd]);
    user.roles = Array.from(set);
    await user.save();

    res.json({ username: user.username, roles: user.roles });
  } catch (e) {
    res.status(400).json({ error: e.message });
  }
});

// Registrar can remove: Student, Moderator, SSG
router.post('/demote', authRequired, requireAnyRole('Registrar'), async (req, res) => {
  try {
    const { username, removeRoles = [] } = req.body;
    const allowed = ['Student', 'Moderator', 'SSG'];
    const rolesToRemove = removeRoles.filter(r => allowed.includes(r));

    const user = await User.findOne({ username });
    if (!user) return res.status(404).json({ error: 'User not found' });

    user.roles = user.roles.filter(r => !rolesToRemove.includes(r));
    if (user.roles.length === 0) user.roles = ['User']; // fallback role

    await user.save();
    res.json({ username: user.username, roles: user.roles });
  } catch (e) {
    res.status(400).json({ error: e.message });
  }
});

// ---------------------- SUPER ADMIN ----------------------

// Super Admin can assign: Registrar, Admin
router.post('/assign', authRequired, requireAnyRole('Super Admin'), async (req, res) => {
  try {
    const { username, addRoles = [] } = req.body;
    const allowed = ['Registrar', 'Admin'];
    const rolesToAdd = addRoles.filter(r => allowed.includes(r));

    const user = await User.findOne({ username });
    if (!user) return res.status(404).json({ error: 'User not found' });

    const set = new Set([...(user.roles || []), ...rolesToAdd]);
    user.roles = Array.from(set);
    await user.save();

    res.json({ username: user.username, roles: user.roles });
  } catch (e) {
    res.status(400).json({ error: e.message });
  }
});

// Super Admin can remove: Registrar, Admin (but never the last Super Admin)
router.post('/unassign', authRequired, requireAnyRole('Super Admin'), async (req, res) => {
  try {
    const { username, removeRoles = [] } = req.body;
    const allowed = ['Registrar', 'Admin'];
    const rolesToRemove = removeRoles.filter(r => allowed.includes(r));

    const user = await User.findOne({ username });
    if (!user) return res.status(404).json({ error: 'User not found' });

    // Prevent removing the last critical role
    await ensureNotLastCritical(user, rolesToRemove);

    user.roles = user.roles.filter(r => !rolesToRemove.includes(r));
    if (user.roles.length === 0) user.roles = ['User']; // fallback role

    await user.save();
    res.json({ username: user.username, roles: user.roles });
  } catch (e) {
    res.status(400).json({ error: e.message });
  }
});

module.exports = router;
