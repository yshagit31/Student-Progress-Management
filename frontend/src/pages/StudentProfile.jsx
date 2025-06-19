import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { ArrowLeft, Calendar, Trophy, Target, TrendingUp, Clock } from 'lucide-react';
import { toast } from 'react-hot-toast';
import { format } from 'date-fns';
import RatingChart from '../components/charts/RatingChart';
import ProblemRatingChart from '../components/charts/ProblemRatingChart';
import HeatMap from '../components/HeatMap';
import { studentService, codeforcesService } from '../services/api';

function StudentProfile() {
  const { id } = useParams();
  const [student, setStudent] = useState(null);
  const [contests, setContests] = useState([]);
  const [problemData, setProblemData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [contestFilter, setContestFilter] = useState('365');
  const [problemFilter, setProblemFilter] = useState('90');

  useEffect(() => {
    if (id) {
      fetchStudentData();
    }
  }, [id]);

  useEffect(() => {
    if (id) {
      fetchContestData();
    }
  }, [id, contestFilter]);

  useEffect(() => {
    if (id) {
      fetchProblemData();
    }
  }, [id, problemFilter]);

  const fetchStudentData = async () => {
    try {
      setLoading(true);
      const data = await studentService.getById(id);
      setStudent(data);
    } catch (error) {
      console.error('Error fetching student:', error);
      toast.error('Failed to fetch student data');
    } finally {
      setLoading(false);
    }
  };

  const fetchContestData = async () => {
    try {
      const data = await codeforcesService.getContests(id, contestFilter);
      setContests(data.contests);
    } catch (error) {
      console.error('Error fetching contest data:', error);
      toast.error('Failed to fetch contest data');
    }
  };

  const fetchProblemData = async () => {
    try {
      const data = await codeforcesService.getProblems(id, problemFilter);
      setProblemData(data);
    } catch (error) {
      console.error('Error fetching problem data:', error);
      toast.error('Failed to fetch problem data');
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (!student) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-500 dark:text-gray-400">Student not found</p>
        <Link to="/" className="text-blue-600 hover:text-blue-800 mt-4 inline-block">
          ← Back to Dashboard
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <Link 
            to="/" 
            className="p-2 text-gray-400 hover:text-gray-600 dark:text-gray-300 dark:hover:text-gray-100 
                     hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
          >
            <ArrowLeft size={20} />
          </Link>
          <div>
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white">{student.name}</h1>
            <p className="text-gray-600 dark:text-gray-400">
              @{student.codeforcesHandle} • {student.email}
            </p>
          </div>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-lg">
          <div className="flex items-center">
            <div className="p-2 bg-blue-100 dark:bg-blue-900 rounded-lg">
              <Trophy className="h-6 w-6 text-blue-600 dark:text-blue-400" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Current Rating</p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">
                {student.currentRating || 0}
              </p>
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-lg">
          <div className="flex items-center">
            <div className="p-2 bg-purple-100 dark:bg-purple-900 rounded-lg">
              <Target className="h-6 w-6 text-purple-600 dark:text-purple-400" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Max Rating</p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">
                {student.maxRating || 0}
              </p>
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-lg">
          <div className="flex items-center">
            <div className="p-2 bg-green-100 dark:bg-green-900 rounded-lg">
              <TrendingUp className="h-6 w-6 text-green-600 dark:text-green-400" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Total Contests</p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">
                {student.contests?.length || 0}
              </p>
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-lg">
          <div className="flex items-center">
            <div className="p-2 bg-yellow-100 dark:bg-yellow-900 rounded-lg">
              <Clock className="h-6 w-6 text-yellow-600 dark:text-yellow-400" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Last Updated</p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">
                {format(new Date(student.lastUpdated), 'MMM dd')}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Contest History Section */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white flex items-center">
            <Calendar className="mr-2 h-5 w-5" />
            Contest History
          </h2>
          <select
            value={contestFilter}
            onChange={(e) => setContestFilter(e.target.value)}
            className="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md 
                     bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
          >
            <option value="30">Last 30 days</option>
            <option value="90">Last 90 days</option>
            <option value="365">Last 365 days</option>
          </select>
        </div>
        
        <RatingChart contests={contests} />
        
        {contests.length > 0 && (
          <div className="mt-6">
            <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4">Recent Contests</h3>
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                <thead className="bg-gray-50 dark:bg-gray-900">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                      Contest
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                      Date
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                      Rank
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                      Rating Change
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
                  {contests.slice(0, 10).map((contest) => (
                    <tr key={contest.contestId}>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">
                        {contest.contestName}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                        {format(new Date(contest.ratingUpdateTimeSeconds * 1000), 'MMM dd, yyyy')}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">
                        {contest.rank}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm">
                        <span className={`font-semibold ${
                          contest.newRating - contest.oldRating > 0
                            ? 'text-green-600 dark:text-green-400'
                            : 'text-red-600 dark:text-red-400'
                        }`}>
                          {contest.newRating - contest.oldRating > 0 ? '+' : ''}
                          {contest.newRating - contest.oldRating}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>

      {/* Problem Solving Section */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white flex items-center">
            <Target className="mr-2 h-5 w-5" />
            Problem Solving Analytics
          </h2>
          <select
            value={problemFilter}
            onChange={(e) => setProblemFilter(e.target.value)}
            className="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md 
                     bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
          >
            <option value="7">Last 7 days</option>
            <option value="30">Last 30 days</option>
            <option value="90">Last 90 days</option>
          </select>
        </div>

        {problemData && (
          <>
            {/* Stats */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
              <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-lg">
                <p className="text-sm text-blue-600 dark:text-blue-400">Total Problems</p>
                <p className="text-2xl font-bold text-blue-700 dark:text-blue-300">
                  {problemData.totalProblems}
                </p>
              </div>
              <div className="bg-green-50 dark:bg-green-900/20 p-4 rounded-lg">
                <p className="text-sm text-green-600 dark:text-green-400">Avg Problems/Day</p>
                <p className="text-2xl font-bold text-green-700 dark:text-green-300">
                  {problemData.avgProblemsPerDay}
                </p>
              </div>
              <div className="bg-purple-50 dark:bg-purple-900/20 p-4 rounded-lg">
                <p className="text-sm text-purple-600 dark:text-purple-400">Max Rating</p>
                <p className="text-2xl font-bold text-purple-700 dark:text-purple-300">
                  {problemData.maxRating}
                </p>
              </div>
              <div className="bg-yellow-50 dark:bg-yellow-900/20 p-4 rounded-lg">
                <p className="text-sm text-yellow-600 dark:text-yellow-400">Avg Rating</p>
                <p className="text-2xl font-bold text-yellow-700 dark:text-yellow-300">
                  {problemData.avgRating}
                </p>
              </div>
            </div>

            {/* Charts */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div>
                <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4">
                  Problems by Rating
                </h3>
                <ProblemRatingChart ratingBuckets={problemData.ratingBuckets} />
              </div>
              <div>
                <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4">
                  Submission Activity
                </h3>
                <HeatMap data={problemData.heatMapData} days={parseInt(problemFilter)} />
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
}

export default StudentProfile;