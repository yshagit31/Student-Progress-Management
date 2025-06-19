import express from 'express';
import Student from '../models/Student.js';
import { syncAllStudentsData } from '../services/codeforcesService.js';

const router = express.Router();

// Get student's contest history with filtering
router.get('/contests/:studentId', async (req, res) => {
  try {
    const { studentId } = req.params;
    const { days = 365 } = req.query;

    const student = await Student.findById(studentId);
    if (!student) {
      return res.status(404).json({ message: 'Student not found' });
    }

    const cutoffDate = new Date();
    cutoffDate.setDate(cutoffDate.getDate() - parseInt(days));
    const cutoffTimestamp = Math.floor(cutoffDate.getTime() / 1000);

    const filteredContests = student.contests.filter(
      contest => contest.ratingUpdateTimeSeconds >= cutoffTimestamp
    );

    res.json({
      contests: filteredContests,
      currentRating: student.currentRating,
      maxRating: student.maxRating
    });
  } catch (error) {
    console.error('Error fetching contest history:', error);
    res.status(500).json({ message: 'Error fetching contest history' });
  }
});

// Get student's problem solving data with filtering
router.get('/problems/:studentId', async (req, res) => {
  try {
    const { studentId } = req.params;
    const { days = 90 } = req.query;

    const student = await Student.findById(studentId);
    if (!student) {
      return res.status(404).json({ message: 'Student not found' });
    }

    const cutoffDate = new Date();
    cutoffDate.setDate(cutoffDate.getDate() - parseInt(days));
    const cutoffTimestamp = Math.floor(cutoffDate.getTime() / 1000);

    const filteredSubmissions = student.submissions.filter(
      submission => submission.creationTimeSeconds >= cutoffTimestamp && 
                   submission.verdict === 'OK'
    );

    // Calculate statistics
    const totalProblems = filteredSubmissions.length;
    const avgProblemsPerDay = totalProblems / parseInt(days);
    
    const ratings = filteredSubmissions
      .map(sub => sub.problem.rating)
      .filter(rating => rating);
    
    const maxRating = ratings.length > 0 ? Math.max(...ratings) : 0;
    const avgRating = ratings.length > 0 ? ratings.reduce((a, b) => a + b, 0) / ratings.length : 0;

    // Rating buckets for chart
    const ratingBuckets = {};
    ratings.forEach(rating => {
      const bucket = Math.floor(rating / 100) * 100;
      ratingBuckets[bucket] = (ratingBuckets[bucket] || 0) + 1;
    });

    // Heat map data (submissions per day)
    const heatMapData = {};
    filteredSubmissions.forEach(submission => {
      const date = new Date(submission.creationTimeSeconds * 1000).toISOString().split('T')[0];
      heatMapData[date] = (heatMapData[date] || 0) + 1;
    });

    res.json({
      totalProblems,
      avgProblemsPerDay: parseFloat(avgProblemsPerDay.toFixed(2)),
      maxRating,
      avgRating: Math.round(avgRating),
      ratingBuckets,
      heatMapData,
      submissions: filteredSubmissions
    });
  } catch (error) {
    console.error('Error fetching problem solving data:', error);
    res.status(500).json({ message: 'Error fetching problem solving data' });
  }
});

// Manual sync for all students
router.post('/sync-all', async (req, res) => {
  try {
    await syncAllStudentsData();
    res.json({ message: 'All student data synced successfully' });
  } catch (error) {
    console.error('Error syncing all student data:', error);
    res.status(500).json({ message: 'Error syncing all student data' });
  }
});

export default router;