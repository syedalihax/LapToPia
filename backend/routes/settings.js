import { Router } from 'express';
import { getSettings, updateSettings } from '../db/store.js';

const router = Router();

router.get('/', (req, res) => {
  try {
    const settings = getSettings();
    res.json({ success: true, data: settings });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

router.put('/', (req, res) => {
  try {
    const updated = updateSettings(req.body);
    res.json({ success: true, message: 'Settings saved and synchronized', data: updated });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

export default router;
