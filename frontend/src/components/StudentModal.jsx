import React, { useState, useEffect } from 'react';
import { X } from 'lucide-react';

function StudentModal({ isOpen, onClose, onSave, student, loading = false }) {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    codeforcesHandle: '',
    emailNotificationsEnabled: true
  });

  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (student) {
      setFormData({
        name: student.name || '',
        email: student.email || '',
        phone: student.phone || '',
        codeforcesHandle: student.codeforcesHandle || '',
        emailNotificationsEnabled: student.emailNotificationsEnabled ?? true
      });
    } else {
      setFormData({
        name: '',
        email: '',
        phone: '',
        codeforcesHandle: '',
        emailNotificationsEnabled: true
      });
    }
    setErrors({});
  }, [student, isOpen]);

  const validateForm = () => {
    const newErrors = {};

    if (!formData.name.trim()) {
      newErrors.name = 'Name is required';
    }

    if (!formData.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Email is invalid';
    }

    if (!formData.phone.trim()) {
      newErrors.phone = 'Phone is required';
    }

    if (!formData.codeforcesHandle.trim()) {
      newErrors.codeforcesHandle = 'Codeforces handle is required';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (validateForm()) {
      onSave(formData);
    }
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
    
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl w-full max-w-md">
        <div className="flex items-center justify-between p-6 border-b border-gray-200 dark:border-gray-700">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
            {student ? 'Edit Student' : 'Add New Student'}
          </h3>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
          >
            <X size={24} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6">
          <div className="space-y-4">
            <div>
              <label htmlFor="name" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                Name *
              </label>
              <input
                type="text"
                id="name"
                name="name"
                value={formData.name}
                onChange={handleChange}
                className={`mt-1 block w-full rounded-md border-gray-300 dark:border-gray-600 shadow-sm 
                          focus:border-blue-500 focus:ring-blue-500 dark:bg-gray-700 dark:text-white
                          ${errors.name ? 'border-red-500' : ''}`}
                placeholder="Enter student name"
              />
              {errors.name && <p className="mt-1 text-sm text-red-600 dark:text-red-400">{errors.name}</p>}
            </div>

            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                Email *
              </label>
              <input
                type="email"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                className={`mt-1 block w-full rounded-md border-gray-300 dark:border-gray-600 shadow-sm 
                          focus:border-blue-500 focus:ring-blue-500 dark:bg-gray-700 dark:text-white
                          ${errors.email ? 'border-red-500' : ''}`}
                placeholder="Enter email address"
              />
              {errors.email && <p className="mt-1 text-sm text-red-600 dark:text-red-400">{errors.email}</p>}
            </div>

            <div>
              <label htmlFor="phone" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                Phone *
              </label>
              <input
                type="tel"
                id="phone"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                className={`mt-1 block w-full rounded-md border-gray-300 dark:border-gray-600 shadow-sm 
                          focus:border-blue-500 focus:ring-blue-500 dark:bg-gray-700 dark:text-white
                          ${errors.phone ? 'border-red-500' : ''}`}
                placeholder="Enter phone number"
              />
              {errors.phone && <p className="mt-1 text-sm text-red-600 dark:text-red-400">{errors.phone}</p>}
            </div>

            <div>
              <label htmlFor="codeforcesHandle" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                Codeforces Handle *
              </label>
              <input
                type="text"
                id="codeforcesHandle"
                name="codeforcesHandle"
                value={formData.codeforcesHandle}
                onChange={handleChange}
                className={`mt-1 block w-full rounded-md border-gray-300 dark:border-gray-600 shadow-sm 
                          focus:border-blue-500 focus:ring-blue-500 dark:bg-gray-700 dark:text-white
                          ${errors.codeforcesHandle ? 'border-red-500' : ''}`}
                placeholder="Enter Codeforces handle"
              />
              {errors.codeforcesHandle && <p className="mt-1 text-sm text-red-600 dark:text-red-400">{errors.codeforcesHandle}</p>}
            </div>

            <div className="flex items-center">
              <input
                type="checkbox"
                id="emailNotificationsEnabled"
                name="emailNotificationsEnabled"
                checked={formData.emailNotificationsEnabled}
                onChange={handleChange}
                className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
              />
              <label htmlFor="emailNotificationsEnabled" className="ml-2 block text-sm text-gray-700 dark:text-gray-300">
                Enable email notifications
              </label>
            </div>
          </div>

          <div className="flex justify-end space-x-3 mt-6">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 bg-gray-100 
                       dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 rounded-md transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="px-4 py-2 text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 
                       rounded-md transition-colors disabled:opacity-50 disabled:cursor-not-allowed
                       flex items-center space-x-2"
            >
              {loading && (
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
              )}
              <span>{student ? 'Update' : 'Add'} Student</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default StudentModal;