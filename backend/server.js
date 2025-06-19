import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import dotenv from 'dotenv';
import helmet from 'helmet';
import rateLimit from 'express-rate-limit';
import cron from 'node-cron';

import studentRoutes from './routes/students.js';
import codeforcesRoutes from './routes/codeforces.js';
import settingsRoutes, { initializeCronJob } from './routes/settings.js';
import { syncAllStudentsData } from './services/codeforcesService.js';
import { checkInactiveStudents } from './services/emailService.js';
import testRoutes from './routes/testRoutes.js';
import Settings from './models/Settings.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Security middleware
app.use(helmet());
app.use(cors({
  origin: process.env.FRONTEND_LOCAL_URL || 'http://localhost:5173',
  credentials: true
}));

// Rate limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 1000,
  message: 'Too many requests from this IP, please try again later.'
});
app.use(limiter);

// Body parsing middleware
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

app.use('/api/students', studentRoutes);
app.use('/api/codeforces', codeforcesRoutes);
app.use('/api/settings', settingsRoutes);
app.use('/api/test', testRoutes);

app.get('/api/health', (req, res) => {
  res.status(200).json({ status: 'OK', timestamp: new Date().toISOString() });
});

// MongoDB connection
mongoose.connect(process.env.MONGODB_URI)
.then(async () => {
  console.log('Connected to MongoDB');
  const settings = await Settings.findOne();
  // console.log("settibngs cron job",settings);
  const schedule = settings?.cronSchedule || '0 2 * * *';
  const timezone = settings?.cronTimezone || 'UTC';
  //  console.log("schedule timezone", schedule , timezone);
  initializeCronJob(schedule, timezone);
})
.catch((error) => {
  console.error('MongoDB connection error:', error);
  process.exit(1);
});

app.use((error, req, res, next) => {
  console.error(error.stack);
  res.status(500).json({
    message: 'Something went wrong!',
    error: process.env.NODE_ENV === 'production' ? {} : error.stack
  });
});

app.use('*', (req, res) => {
  res.status(404).json({ message: 'Route not found' });
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});


// import express from 'express';
// import mongoose from 'mongoose';
// import cors from 'cors';
// import dotenv from 'dotenv';
// import helmet from 'helmet';
// import rateLimit from 'express-rate-limit';
// import cron from 'node-cron';

// import studentRoutes from './routes/students.js';
// import codeforcesRoutes from './routes/codeforces.js';
// import settingsRoutes from './routes/settings.js';
// import { syncAllStudentsData } from './services/codeforcesService.js';
// import { checkInactiveStudents } from './services/emailService.js';
// import testRoutes from './routes/testRoutes.js';


// dotenv.config();

// const app = express();
// const PORT = process.env.PORT || 5000;

// // Security middleware
// app.use(helmet());
// app.use(cors({
//   origin: process.env.FRONTEND_LOCAL_URL || 'http://localhost:5173',
//   credentials: true
// }));

// // Rate limiting
// const limiter = rateLimit({
//   windowMs: 15 * 60 * 1000, // 15 minutes
//   max: 1000, 
//   message: 'Too many requests from this IP, please try again later.'
// });
// app.use(limiter);

// // Body parsing middleware
// app.use(express.json({ limit: '10mb' }));
// app.use(express.urlencoded({ extended: true, limit: '10mb' }));


// app.use('/api/students', studentRoutes);
// app.use('/api/codeforces', codeforcesRoutes);
// app.use('/api/settings', settingsRoutes);
// app.use('/api/test', testRoutes);


// app.get('/api/health', (req, res) => {
//   res.status(200).json({ status: 'OK', timestamp: new Date().toISOString() });
// });

// // MongoDB connection
// mongoose.connect(process.env.MONGODB_URI)
// .then(() => {
//   console.log('Connected to MongoDB');
// })
// .catch((error) => {
//   console.error('MongoDB connection error:', error);
//   process.exit(1);
// });

// // Default cron job - runs at 2 AM every day
// let cronJob = cron.schedule('0 2 * * *', async () => {
//   console.log('Running daily Codeforces data sync...');
//   try {
//     await syncAllStudentsData();
//     await checkInactiveStudents();
//     console.log('Daily sync completed successfully');
//   } catch (error) {
//     console.error('Daily sync failed:', error);
//   }
// }, {
//   scheduled: false,
//   timezone: "UTC"
// });


// cronJob.start();


// app.use((error, req, res, next) => {
//   console.error(error.stack);
//   res.status(500).json({
//     message: 'Something went wrong!',
//     error: process.env.NODE_ENV === 'production' ? {} : error.stack
//   });
// });


// app.use('*', (req, res) => {
//   res.status(404).json({ message: 'Route not found' });
// });

// app.listen(PORT, () => {
//   console.log(`Server running on port ${PORT}`);
// });

// export { cronJob };
