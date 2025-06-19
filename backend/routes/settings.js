
import express from 'express';
import cron from 'node-cron';
import Settings from '../models/Settings.js';
import { syncAllStudentsData } from '../services/codeforcesService.js';
import { checkInactiveStudents } from '../services/emailService.js';

const router = express.Router();

let cronJob = null;

function initializeCronJob(schedule, timezone = 'UTC') {
  if (cronJob) cronJob.stop();

  cronJob = cron.schedule(schedule, async () => {
    console.log(`Running scheduled job at ${new Date().toISOString()}`);
    try {
      await syncAllStudentsData();
      await checkInactiveStudents();
      console.log('Scheduled sync completed successfully');
    } catch (err) {
      console.error('Scheduled sync failed:', err);
    }
  }, {
    scheduled: true,
    timezone
  });

  console.log(`Cron job scheduled with: ${schedule} (${timezone})`);
  return cronJob;
}

// Get current settings
router.get('/', async (req, res) => {
  try {
    let settings = await Settings.findOne();
    if (!settings) {
      settings = new Settings();
      await settings.save();
    }
    res.json(settings);
  } catch (error) {
    console.error('Error fetching settings:', error);
    res.status(500).json({ message: 'Error fetching settings' });
  }
});

// Update settings
router.put('/', async (req, res) => {
  try {
    let settings = await Settings.findOne();
    if (!settings) settings = new Settings();

    Object.assign(settings, req.body);
    await settings.save();

    if (req.body.cronSchedule || req.body.cronTimezone) {
      const schedule = settings.emailSettings?.cronSchedule || '0 2 * * *';
      const timezone = settings.emailSettings?.cronTimezone || 'UTC';
      initializeCronJob(schedule, timezone);
    }

    res.json(settings);
  } catch (error) {
    console.error('Error updating settings:', error);
    res.status(500).json({ message: 'Error updating settings' });
  }
});

export { initializeCronJob };
export default router;


// import express from 'express';
// import Settings from '../models/Settings.js';
// import { cronJob } from '../server.js';

// const router = express.Router();

// // Get current settings
// router.get('/', async (req, res) => {
//   try {
//     let settings = await Settings.findOne();
//     if (!settings) {
//       settings = new Settings();
//       await settings.save();
//     }
//     res.json(settings);
//   } catch (error) {
//     console.error('Error fetching settings:', error);
//     res.status(500).json({ message: 'Error fetching settings' });
//   }
// });

// // Update settings
// router.put('/', async (req, res) => {
//   try {
//     let settings = await Settings.findOne();
//     if (!settings) {
//       settings = new Settings();
//     }

//     Object.assign(settings, req.body);
//     await settings.save();

//     // Update cron job if schedule changed
//     if (req.body.cronSchedule) {
//       cronJob.stop();
//       // Create new cron job with updated schedule
//       // Note: In production, you might want to implement this differently
//     }

//     res.json(settings);
//   } catch (error) {
//     console.error('Error updating settings:', error);
//     res.status(500).json({ message: 'Error updating settings' });
//   }
// });

// export default router;
