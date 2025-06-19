import React, { useState, useEffect } from 'react';
import { toast } from 'react-hot-toast';
import { Settings as SettingsIcon, Clock, Mail, RefreshCw } from 'lucide-react';
import { settingsService } from '../services/api';

function Settings() {
  const [settings, setSettings] = useState({
    cronSchedule: '0 2 * * *',
    cronTimezone: 'UTC',
    emailSettings: {
      smtpHost: 'smtp.gmail.com',
      smtpPort: 587,
      smtpUser: '',
      smtpPass: '',
      fromEmail: '',
      fromName: 'SPMS'
    },
    inactivityThreshold: 7,
    lastSyncTime: ''
  });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);


//   const fetchSettings = async () => {
//   try {
//     setLoading(true);
//     const response = await fetch('/api/settings');
//     if (!response.ok) throw new Error('Failed to fetch');

//     const data = await response.json();
//     setSettings(data);
//   } catch (error) {
//     console.error('Error fetching settings:', error);
//     toast.error('Failed to fetch settings');
//   } finally {
//     setLoading(false);
//   }
// };

const fetchSettings = async () => {
  try {
    setLoading(true);
    const data = await settingsService.get(); // ← Use the service method
    setSettings(data);
  } catch (error) {
    console.error('Error fetching settings:', error);
    toast.error('Failed to fetch settings');
  } finally {
    setLoading(false);
  }
};


  useEffect(() => {
    fetchSettings();
  }, []);


// const handleSave = async () => {
//   try {
//     setSaving(true);
//     const response = await fetch('/api/settings', {
//       method: 'PUT',
//       headers: {
//         'Content-Type': 'application/json'
//       },
//       body: JSON.stringify(settings)
//     });

//     if (!response.ok) throw new Error('Failed to save');

//     toast.success('Settings saved successfully');
//   } catch (error) {
//     console.error('Error saving settings:', error);
//     toast.error('Failed to save settings');
//   } finally {
//     setSaving(false);
//   }
// };


const handleSave = async () => {
  try {
    setSaving(true);
    await settingsService.update(settings); // ← Use the service method
    toast.success('Settings saved successfully');
  } catch (error) {
    console.error('Error saving settings:', error);
    toast.error('Failed to save settings');
  } finally {
    setSaving(false);
  }
};


  const handleInputChange = (field, value) => {
    if (field.startsWith('emailSettings.')) {
      const emailField = field.split('.')[1];
      setSettings(prev => ({
        ...prev,
        emailSettings: {
          ...prev.emailSettings,
          [emailField]: value
        }
      }));
    } else {
      setSettings(prev => ({ ...prev, [field]: value }));
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white flex items-center">
          <SettingsIcon className="mr-3 h-6 w-6" />
          Settings
        </h1>
        <p className="text-gray-600 dark:text-gray-400 mt-1">
          Configure system settings and preferences
        </p>
      </div>

      {/* Sync Settings */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6">
        <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4 flex items-center">
          <Clock className="mr-2 h-5 w-5" />
          Data Synchronization
        </h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Cron Schedule
            </label>
            <input
              type="text"
              value={settings.cronSchedule}
              onChange={(e) => handleInputChange('cronSchedule', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md 
                       bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
              placeholder="0 2 * * *"
            />
            <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
              Cron expression (e.g., "0 2 * * *" for 2 AM daily)
            </p>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Timezone
            </label>
            <select
              value={settings.cronTimezone}
              onChange={(e) => handleInputChange('cronTimezone', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md 
                       bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
            >
              <option value="UTC">UTC</option>
              <option value="America/New_York">Eastern Time</option>
              <option value="America/Chicago">Central Time</option>
              <option value="America/Denver">Mountain Time</option>
              <option value="America/Los_Angeles">Pacific Time</option>
              <option value="Asia/Kolkata">India Standard Time</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Inactivity Threshold (days)
            </label>
            <input
              type="number"
              value={settings.inactivityThreshold}
              onChange={(e) => handleInputChange('inactivityThreshold', parseInt(e.target.value))}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md 
                       bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
              min="1"
              max="30"
            />
            <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
              Send reminders after N days of inactivity
            </p>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Last Sync
            </label>
            <div className="flex items-center space-x-2">
              <input
                type="text"
                value={settings.lastSyncTime || 'Never'}
                readOnly
                className="flex-1 px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md 
                         bg-gray-50 dark:bg-gray-600 text-gray-900 dark:text-white"
              />
              <button
                onClick={() => toast.success('Manual sync triggered')}
                className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-md 
                         transition-colors flex items-center space-x-2"
              >
                <RefreshCw size={16} />
                <span>Sync Now</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Email Settings */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6">
        <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4 flex items-center">
          <Mail className="mr-2 h-5 w-5" />
          Email Configuration
        </h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              SMTP Host
            </label>
            <input
              type="text"
              value={settings.emailSettings.smtpHost||''}
              onChange={(e) => handleInputChange('emailSettings.smtpHost', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md 
                       bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
              placeholder="smtp.gmail.com"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              SMTP Port
            </label>
            <input
              type="number"
              value={settings.emailSettings.smtpPort||''}
              onChange={(e) => handleInputChange('emailSettings.smtpPort', parseInt(e.target.value))}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md 
                       bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
              placeholder="587"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              SMTP Username
            </label>
            <input
              type="email"
              value={settings.emailSettings.smtpUser||''}
              onChange={(e) => handleInputChange('emailSettings.smtpUser', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md 
                       bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
              placeholder="your-email@gmail.com"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              SMTP Password
            </label>
            <input
              type="password"
              value={settings.emailSettings.smtpPass ||''}
              onChange={(e) => handleInputChange('emailSettings.smtpPass', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md 
                       bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
              placeholder="Your app password"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              From Email
            </label>
            <input
              type="email"
              value={settings.emailSettings.fromEmail||''}
              onChange={(e) => handleInputChange('emailSettings.fromEmail', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md 
                       bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
              placeholder="noreply@yourdomain.com"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              From Name
            </label>
            <input
              type="text"
              value={settings.emailSettings.fromName||''}
              onChange={(e) => handleInputChange('emailSettings.fromName', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md 
                       bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
              placeholder="SPMS"
            />
          </div>
        </div>

        <div className="mt-6 p-4 bg-yellow-50 dark:bg-yellow-900/20 rounded-lg">
          <p className="text-sm text-yellow-800 dark:text-yellow-200">
            <strong>Note:</strong> For Gmail, use an App Password instead of your regular password. 
            Enable 2-factor authentication and generate an app-specific password in your Google Account settings.
          </p>
        </div>
      </div>

      {/* Save Button */}
      <div className="flex justify-end">
        <button
          onClick={handleSave}
          disabled={saving}
          className="px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg 
                   transition-colors disabled:opacity-50 disabled:cursor-not-allowed
                   flex items-center space-x-2"
        >
          {saving && (
            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
          )}
          <span>Save Settings</span>
        </button>
      </div>
    </div>
  );
}

export default Settings;