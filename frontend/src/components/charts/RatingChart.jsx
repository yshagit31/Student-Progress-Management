import React from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { format } from 'date-fns';

function RatingChart({ contests, className = '' }) {
  const chartData = contests
    .sort((a, b) => a.ratingUpdateTimeSeconds - b.ratingUpdateTimeSeconds)
    .map((contest) => ({
      contestName: contest.contestName.length > 20 
        ? contest.contestName.substring(0, 20) + '...' 
        : contest.contestName,
      rating: contest.newRating,
      change: contest.newRating - contest.oldRating,
      date: format(new Date(contest.ratingUpdateTimeSeconds * 1000), 'MMM dd, yyyy'),
      rank: contest.rank,
      contestId: contest.contestId
    }));

  const formatTooltip = (value, name, props) => {
    if (name === 'rating') {
      const change = props.payload.change;
      const changeText = change > 0 ? `+${change}` : `${change}`;
      const changeColor = change > 0 ? '#10b981' : change < 0 ? '#ef4444' : '#6b7280';
      
      return [
        <span key="rating">
          Rating: <strong>{value}</strong> 
          <span style={{ color: changeColor, marginLeft: '8px' }}>
            ({changeText})
          </span>
        </span>,
        ''
      ];
    }
    return [value, name];
  };

  const formatLabel = (label, payload) => {
    if (payload && payload.length > 0) {
      const data = payload[0].payload;
      return (
        <div className="bg-white dark:bg-gray-800 p-3 border border-gray-200 dark:border-gray-700 rounded-lg shadow-lg">
          <p className="font-semibold text-gray-900 dark:text-white">{data.contestName}</p>
          <p className="text-sm text-gray-600 dark:text-gray-400">{data.date}</p>
          <p className="text-sm text-gray-600 dark:text-gray-400">Rank: {data.rank}</p>
        </div>
      );
    }
    return null;
  };

  if (chartData.length === 0) {
    return (
      <div className={`flex items-center justify-center h-64 bg-gray-50 dark:bg-gray-900 rounded-lg ${className}`}>
        <p className="text-gray-500 dark:text-gray-400">No contest data available</p>
      </div>
    );
  }

  return (
    <div className={className}>
      <ResponsiveContainer width="100%" height={400}>
        <LineChart
          data={chartData}
          margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
        >
          <CartesianGrid strokeDasharray="3 3" className="stroke-gray-200 dark:stroke-gray-700" />
          <XAxis 
            dataKey="contestName" 
            className="text-gray-600 dark:text-gray-400"
            tick={{ fontSize: 12 }}
            angle={-45}
            textAnchor="end"
            height={60}
          />
          <YAxis className="text-gray-600 dark:text-gray-400" />
          <Tooltip 
            content={({ active, payload, label }) => {
              if (active && payload && payload.length) {
                return formatLabel(label, payload);
              }
              return null;
            }}
          />
          <Legend />
          <Line 
            type="monotone" 
            dataKey="rating" 
            stroke="#3b82f6" 
            strokeWidth={3}
            dot={{ fill: '#3b82f6', strokeWidth: 2, r: 4 }}
            activeDot={{ r: 6, stroke: '#3b82f6', strokeWidth: 2 }}
            name="Rating"
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}

export default RatingChart;