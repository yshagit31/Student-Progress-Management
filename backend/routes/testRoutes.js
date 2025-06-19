import express from 'express';
import { checkInactiveStudents } from '../services/emailService.js'; 

const router = express.Router();

router.get('/send-reminders', async (req, res) => {
  try {
    await checkInactiveStudents();
    res.send("Reminder check completed.");
  } catch (err) {
    console.error(err);
    res.status(500).send("Error triggering reminders");
  }
});

export default router;
