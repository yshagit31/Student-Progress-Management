import React from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

function ProblemRatingChart({ ratingBuckets, className = '' }) {
  const chartData = Object.entries(ratingBuckets)
    .map(([rating, count]) => ({
      rating: `${rating}-${parseInt(rating) + 99}`,
      count,
      numericRating: parseInt(rating)
    }))
    .sort((a, b) => a.numericRating - b.numericRating);

  if (chartData.length === 0) {
    return (
      <div className={`flex items-center justify-center h-64 bg-gray-50 dark:bg-gray-900 rounded-lg ${className}`}>
        <p className="text-gray-500 dark:text-gray-400">No problem data available</p>
      </div>
    );
  }

  return (
    <div className={className}>
      <ResponsiveContainer width="100%" height={300}>
        <BarChart
          data={chartData}
          margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
        >
          <CartesianGrid strokeDasharray="3 3" className="stroke-gray-200 dark:stroke-gray-700" />
          <XAxis 
            dataKey="rating" 
            className="text-gray-600 dark:text-gray-400"
            tick={{ fontSize: 12 }}
          />
          <YAxis className="text-gray-600 dark:text-gray-400" />
          <Tooltip 
            contentStyle={{
              backgroundColor: 'var(--tooltip-bg)',
              border: '1px solid var(--tooltip-border)',
              borderRadius: '8px',
              color: 'var(--tooltip-color)'
            }}
            formatter={(value) => [value, 'Problems Solved']}
            labelFormatter={(label) => `Rating Range: ${label}`}
          />
          <Legend />
          <Bar 
            dataKey="count" 
            fill="#10b981" 
            name="Problems Solved"
            radius={[4, 4, 0, 0]}
          />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}

export default ProblemRatingChart;