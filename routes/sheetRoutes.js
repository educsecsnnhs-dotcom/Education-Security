// routes/sheetRoutes.js
const express = require('express');
const { google } = require('googleapis');
const router = express.Router();
const Class = require('../models/Class');
const { authRequired } = require('../middleware/authMiddleware');
const { requireAnyRole } = require('../middleware/roleMiddleware');

// Google auth setup
const auth = new google.auth.GoogleAuth({
  credentials: JSON.parse(process.env.GOOGLE_SERVICE_ACCOUNT),
  scopes: ['https://www.googleapis.com/auth/spreadsheets'],
});
const sheets = google.sheets({ version: 'v4', auth });

// ------------------- SHEET ROUTES -------------------

// Read data from a sheet (Moderator assigned, Registrar, Admin, Super Admin)
router.get('/:classId', authRequired, requireAnyRole('Moderator', 'Registrar', 'Admin', 'Super Admin'), async (req, res) => {
  try {
    const cls = await Class.findById(req.params.classId);
    if (!cls) return res.status(404).json({ error: 'Class not found' });

    const response = await sheets.spreadsheets.values.get({
      spreadsheetId: cls.sheetId,
      range: 'Sheet1!A:Z',
    });

    res.json({ class: cls.subject, data: response.data.values });
  } catch (e) {
    res.status(400).json({ error: e.message });
  }
});

// Update a sheet (Moderator can edit, Registrar/Admin/SuperAdmin can also update)
router.post('/:classId', authRequired, requireAnyRole('Moderator', 'Registrar', 'Admin', 'Super Admin'), async (req, res) => {
  try {
    const { values } = req.body; // 2D array for rows
    const cls = await Class.findById(req.params.classId);
    if (!cls) return res.status(404).json({ error: 'Class not found' });

    await sheets.spreadsheets.values.update({
      spreadsheetId: cls.sheetId,
      range: 'Sheet1!A1',
      valueInputOption: 'RAW',
      requestBody: { values },
    });

    res.json({ message: 'Sheet updated successfully' });
  } catch (e) {
    res.status(400).json({ error: e.message });
  }
});

// Export sheet (Registrar, Admin, SuperAdmin)
router.get('/:classId/export', authRequired, requireAnyRole('Registrar', 'Admin', 'Super Admin'), async (req, res) => {
  try {
    const cls = await Class.findById(req.params.classId);
    if (!cls) return res.status(404).json({ error: 'Class not found' });

    const response = await sheets.spreadsheets.values.get({
      spreadsheetId: cls.sheetId,
      range: 'Sheet1!A:Z',
    });

    // Convert to CSV for download
    const csv = response.data.values.map(row => row.join(',')).join('\n');
    res.header('Content-Type', 'text/csv');
    res.attachment(`${cls.subject}-record.csv`);
    res.send(csv);
  } catch (e) {
    res.status(400).json({ error: e.message });
  }
});

module.exports = router;

