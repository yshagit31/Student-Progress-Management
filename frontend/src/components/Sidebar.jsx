import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Users, Settings, Code, TrendingUp } from 'lucide-react';

const navigation = [
  { name: 'Dashboard', href: '/', icon: Users },
  { name: 'Settings', href: '/settings', icon: Settings },
];

function Sidebar() {
  const location = useLocation();

  return (
    <div className="flex flex-col w-64 bg-white dark:bg-gray-800 shadow-lg">
      <div className="flex items-center justify-center h-16 px-4 bg-blue-600 dark:bg-blue-700">
        <div className="flex items-center space-x-2">
          <Code className="h-8 w-8 text-white" />
          <span className="text-xl font-bold text-white">SPMS</span>
        </div>
      </div>
      
      <nav className="flex-1 px-4 py-6 space-y-2">
        {navigation.map((item) => {
          const isActive = location.pathname === item.href;
          return (
            <Link
              key={item.name}
              to={item.href}
              className={`flex items-center px-4 py-3 text-sm font-medium rounded-lg transition-colors ${
                isActive
                  ? 'bg-blue-50 dark:bg-blue-900/50 text-blue-700 dark:text-blue-300'
                  : 'text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700'
              }`}
            >
              <item.icon className="mr-3 h-5 w-5" />
              {item.name}
            </Link>
          );
        })}
      </nav>
      
      <div className="p-4 border-t border-gray-200 dark:border-gray-700">
        <div className="flex items-center space-x-3">
          <div className="flex-shrink-0">
            <TrendingUp className="h-6 w-6 text-blue-500" />
          </div>
          <div>
            <p className="text-sm font-medium text-gray-900 dark:text-white">Performance</p>
            <p className="text-xs text-gray-500 dark:text-gray-400">Tracking active</p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Sidebar;