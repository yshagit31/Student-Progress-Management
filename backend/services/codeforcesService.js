import axios from 'axios';
import Student from '../models/Student.js';

const CODEFORCES_API_BASE = 'https://codeforces.com/api';

// Rate limiting for Codeforces API
const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

export async function fetchUserInfo(handle) {
  try {
    await delay(1000); // Rate limiting
    const response = await axios.get(`${CODEFORCES_API_BASE}/user.info?handles=${handle}`);
    
    if (response.data.status !== 'OK') {
      throw new Error(`Codeforces API error: ${response.data.comment}`);
    }

    return response.data.result[0];
  } catch (error) {
    console.error(`Error fetching user info for ${handle}:`, error.message);
    throw error;
  }
}

export async function fetchUserRating(handle) {
  try {
    await delay(1000); // Rate limiting
    const response = await axios.get(`${CODEFORCES_API_BASE}/user.rating?handle=${handle}`);
    
    if (response.data.status !== 'OK') {
      throw new Error(`Codeforces API error: ${response.data.comment}`);
    }

    return response.data.result;
  } catch (error) {
    console.error(`Error fetching rating for ${handle}:`, error.message);
    throw error;
  }
}

export async function fetchUserSubmissions(handle) {
  try {
    await delay(1000); // Rate limiting
    const response = await axios.get(`${CODEFORCES_API_BASE}/user.status?handle=${handle}`);
    
    if (response.data.status !== 'OK') {
      throw new Error(`Codeforces API error: ${response.data.comment}`);
    }

    return response.data.result;
  } catch (error) {
    console.error(`Error fetching submissions for ${handle}:`, error.message);
    throw error;
  }
}

export async function fetchStudentData(handle) {
  try {
    console.log(`Fetching data for ${handle}...`);

    // Fetch user info
    const userInfo = await fetchUserInfo(handle);
    
    // Fetch rating history
    const ratingHistory = await fetchUserRating(handle);
    
    // Fetch submissions
    const submissions = await fetchUserSubmissions(handle);

    const currentRating = userInfo.rating || 0;
    const maxRating = userInfo.maxRating || 0;

    // Process contests from rating history
    const contests = ratingHistory.map(contest => ({
      contestId: contest.contestId,
      contestName: contest.contestName,
      handle: contest.handle,
      rank: contest.rank,
      oldRating: contest.oldRating,
      newRating: contest.newRating,
      ratingUpdateTimeSeconds: contest.ratingUpdateTimeSeconds
    }));

    // Process submissions
    const processedSubmissions = submissions.map(submission => ({
      id: submission.id,
      contestId: submission.contestId,
      creationTimeSeconds: submission.creationTimeSeconds,
      relativeTimeSeconds: submission.relativeTimeSeconds,
      problem: submission.problem,
      author: submission.author,
      programmingLanguage: submission.programmingLanguage,
      verdict: submission.verdict,
      testset: submission.testset,
      passedTestCount: submission.passedTestCount,
      timeConsumedMillis: submission.timeConsumedMillis,
      memoryConsumedBytes: submission.memoryConsumedBytes
    }));

    return {
      currentRating,
      maxRating,
      contests,
      submissions: processedSubmissions
    };
  } catch (error) {
    console.error(`Error fetching student data for ${handle}:`, error.message);
    throw error;
  }
}

export async function syncAllStudentsData() {
  try {
    console.log('Starting sync for all students...');
    const students = await Student.find({ isActive: true });
    
    for (const student of students) {
      try {
        console.log(`Syncing data for ${student.codeforcesHandle}...`);
        const cfData = await fetchStudentData(student.codeforcesHandle);
        
        if (cfData) {
          student.currentRating = cfData.currentRating;
          student.maxRating = cfData.maxRating;
          student.contests = cfData.contests;
          student.submissions = cfData.submissions;
          student.lastUpdated = new Date();
          
          await student.save();
          console.log(`Successfully synced ${student.codeforcesHandle}`);
        }
      } catch (error) {
        console.error(`Error syncing ${student.codeforcesHandle}:`, error.message);
        // Continue with next student even if one fails
      }
      
      // Wait between requests to respect rate limits
      await delay(2000);
    }
    
    console.log('Sync completed for all students');
  } catch (error) {
    console.error('Error in syncAllStudentsData:', error);
    throw error;
  }
}