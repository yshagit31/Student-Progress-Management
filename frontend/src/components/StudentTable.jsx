import React, { useState } from 'react';
import { Edit, Trash2, Eye, UserPlus, Download, RefreshCw } from 'lucide-react';
import { format } from 'date-fns';
import { Link } from 'react-router-dom';

function StudentTable({ 
  students, 
  onEdit, 
  onDelete, 
  onAdd, 
  onSync, 
  onExportCSV, 
  loading = false 
}) {
  const [sortField, setSortField] = useState('name');
  const [sortDirection, setSortDirection] = useState('asc');

  const handleSort = (field) => {
    if (sortField === field) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortDirection('asc');
    }
  };

  const sortedStudents = [...students].sort((a, b) => {
    const aVal = a[sortField];
    const bVal = b[sortField];
    
    if (typeof aVal === 'string' && typeof bVal === 'string') {
      return sortDirection === 'asc' 
        ? aVal.localeCompare(bVal)
        : bVal.localeCompare(aVal);
    }
    
    if (typeof aVal === 'number' && typeof bVal === 'number') {
      return sortDirection === 'asc' ? aVal - bVal : bVal - aVal;
    }
    
    return 0;
  });

  const formatDate = (date) => {
    try {
      return format(new Date(date), 'MMM dd, yyyy HH:mm');
    } catch {
      return 'Never';
    }
  };

  return (
    <div className="bg-white dark:bg-gray-800 shadow-lg rounded-lg overflow-hidden">
      <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-700">
        <div className="flex justify-between items-center">
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
            Students ({students.length})
          </h2>
          <div className="flex space-x-3">
            <button
              onClick={onExportCSV}
              className="flex items-center px-4 py-2 bg-green-600 hover:bg-green-700 text-white 
                       rounded-lg transition-colors"
            >
              <Download size={16} className="mr-2" />
              Export CSV
            </button>
            <button
              onClick={onAdd}
              className="flex items-center px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white 
                       rounded-lg transition-colors"
            >
              <UserPlus size={16} className="mr-2" />
              Add Student
            </button>
          </div>
        </div>
      </div>

      {loading ? (
        <div className="p-8 text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600 dark:text-gray-400">Loading students...</p>
        </div>
      ) : students.length === 0 ? (
        <div className="p-8 text-center">
          <UserPlus size={48} className="mx-auto text-gray-400 mb-4" />
          <p className="text-gray-600 dark:text-gray-400">No students found. Add your first student!</p>
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
            <thead className="bg-gray-50 dark:bg-gray-900">
              <tr>
                {[
                  { key: 'name', label: 'Name' },
                  { key: 'email', label: 'Email' },
                  { key: 'phone', label: 'Phone' },
                  { key: 'codeforcesHandle', label: 'CF Handle' },
                  { key: 'currentRating', label: 'Current Rating' },
                  { key: 'maxRating', label: 'Max Rating' },
                  { key: 'reminderEmailCount', label: 'Reminder Emails' },
                  { key: 'lastUpdated', label: 'Last Updated' },
                ].map(({ key, label }) => (
                  <th
                    key={key}
                    onClick={() => handleSort(key)}
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 
                             uppercase tracking-wider cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-800"
                  >
                    {label}
                    {sortField === key && (
                      <span className="ml-1">
                        {sortDirection === 'asc' ? '↑' : '↓'}
                      </span>
                    )}
                  </th>
                ))}
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-400 
                             uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
              {sortedStudents.map((student) => (
                <tr key={student._id} className="hover:bg-gray-50 dark:hover:bg-gray-700">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <div className="flex-shrink-0 h-8 w-8">
                        <div className="h-8 w-8 rounded-full bg-blue-500 flex items-center justify-center">
                          <span className="text-white text-sm font-medium">
                            {student.name.charAt(0).toUpperCase()}
                          </span>
                        </div>
                      </div>
                      <div className="ml-4">
                        <div className="text-sm font-medium text-gray-900 dark:text-white">
                          {student.name}
                        </div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">
                    {student.email}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">
                    {student.phone}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium 
                                   bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200">
                      {student.codeforcesHandle}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">
                    <span className={`font-semibold ${
                      student.currentRating >= 1200 ? 'text-green-600 dark:text-green-400' : 
                      student.currentRating >= 800 ? 'text-yellow-600 dark:text-yellow-400' : 
                      'text-red-600 dark:text-red-400'
                    }`}>
                      {student.currentRating || 0}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">
                    <span className="font-semibold text-purple-600 dark:text-purple-400">
                      {student.maxRating || 0}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium 
                      ${student.reminderEmailCount >= 5 ? 'bg-red-100 dark:bg-red-900 text-red-800 dark:text-red-200' :
                        student.reminderEmailCount >= 3 ? 'bg-yellow-100 dark:bg-yellow-900 text-yellow-800 dark:text-yellow-200' :
                        'bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-200'}`}>
                      {student.reminderEmailCount || 0}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                    {formatDate(student.lastUpdated)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <div className="flex justify-end space-x-2">
                      <Link
                        to={`/student/${student._id}`}
                        className="text-blue-600 hover:text-blue-900 dark:text-blue-400 dark:hover:text-blue-300 
                                 p-1 rounded hover:bg-blue-50 dark:hover:bg-blue-900/50"
                        title="View Profile"
                      >
                        <Eye size={16} />
                      </Link>
                      <button
                        onClick={() => onSync(student._id)}
                        className="text-green-600 hover:text-green-900 dark:text-green-400 dark:hover:text-green-300 
                                 p-1 rounded hover:bg-green-50 dark:hover:bg-green-900/50"
                        title="Sync Data"
                      >
                        <RefreshCw size={16} />
                      </button>
                      <button
                        onClick={() => onEdit(student)}
                        className="text-indigo-600 hover:text-indigo-900 dark:text-indigo-400 dark:hover:text-indigo-300 
                                 p-1 rounded hover:bg-indigo-50 dark:hover:bg-indigo-900/50"
                        title="Edit Student"
                      >
                        <Edit size={16} />
                      </button>
                      <button
                        onClick={() => onDelete(student._id)}
                        className="text-red-600 hover:text-red-900 dark:text-red-400 dark:hover:text-red-300 
                                 p-1 rounded hover:bg-red-50 dark:hover:bg-red-900/50"
                        title="Delete Student"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

export default StudentTable;