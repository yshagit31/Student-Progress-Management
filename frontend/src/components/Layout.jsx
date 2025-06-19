import React from 'react';
import { useLocation } from 'react-router-dom';
import Navbar from './Navbar';
import Sidebar from './Sidebar';

function Layout({ children }) {
  const location = useLocation();
  const isStudentProfile = location.pathname.startsWith('/student/');

  return (
    <div className="flex h-screen bg-gray-50 dark:bg-gray-900">
      <Sidebar />
      <div className="flex-1 flex flex-col overflow-hidden">
        <Navbar />
        <main className={`flex-1 overflow-x-hidden overflow-y-auto bg-gray-50 dark:bg-gray-900 ${
          isStudentProfile ? 'p-4' : 'p-6'
        }`}>
          {children}
        </main>
      </div>
    </div>
  );
}

export default Layout;