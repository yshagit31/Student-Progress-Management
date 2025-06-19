import React, { useState, useEffect } from 'react';
import { toast } from 'react-hot-toast';
import StudentTable from '../components/StudentTable';
import StudentModal from '../components/StudentModal';
import { studentService } from '../services/api';
import Swal from 'sweetalert2';

function Dashboard() {
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [editingStudent, setEditingStudent] = useState(null);
  const [modalLoading, setModalLoading] = useState(false);

  useEffect(() => {
    fetchStudents();
  }, []);

  const fetchStudents = async () => {
    try {
      setLoading(true);
      const data = await studentService.getAll();
      setStudents(data);
    } catch (error) {
      console.error('Error fetching students:', error);
      toast.error('Failed to fetch students');
    } finally {
      setLoading(false);
    }
  };

  const handleAddStudent = () => {
    setEditingStudent(null);
    setModalOpen(true);
  };

  const handleEditStudent = (student) => {
    setEditingStudent(student);
    setModalOpen(true);
  };

  // const handleDeleteStudent = async (id) => {
  //   if (!window.confirm('Are you sure you want to delete this student?')) {
  //     return;
  //   }

  //   try {
  //     await studentService.delete(id);
  //     setStudents(students.filter(s => s._id !== id));
  //     toast.success('Student deleted successfully');
  //   } catch (error) {
  //     console.error('Error deleting student:', error);
  //     toast.error('Failed to delete student');
  //   }
  // };

  const handleDeleteStudent = async (id) => {
  const result = await Swal.fire({
    title: 'Are you sure?',
    text: 'Do you really want to delete this student?',
    icon: 'warning',
    showCancelButton: true,
    confirmButtonColor: '#d33',
    cancelButtonColor: '#3085d6',
    confirmButtonText: 'Yes, delete it!'
  });

  if (!result.isConfirmed) return;

  try {
    await studentService.delete(id);
    setStudents(students.filter(s => s._id !== id));
    toast.success('Student deleted successfully');
  } catch (error) {
    console.error('Error deleting student:', error);
    toast.error('Failed to delete student');
  }
};

  const handleSaveStudent = async (studentData) => {
    try {
      setModalLoading(true);
      
      if (editingStudent) {
        const updated = await studentService.update(editingStudent._id, studentData);
        setStudents(students.map(s => s._id === editingStudent._id ? updated : s));
        toast.success('Student updated successfully');
      } else {
        const created = await studentService.create(studentData);
        setStudents([...students, created]);
        toast.success('Student added successfully');
      }
      
      setModalOpen(false);
      setEditingStudent(null);
    } catch (error) {
      console.error('Error saving student:', error);
      toast.error(error.response?.data?.message || 'Failed to save student');
    } finally {
      setModalLoading(false);
    }
  };

  const handleSyncStudent = async (id) => {
    try {
      const updated = await studentService.sync(id);
      setStudents(students.map(s => s._id === id ? updated.student : s));
      toast.success('Student data synced successfully');
    } catch (error) {
      console.error('Error syncing student:', error);
      toast.error('Failed to sync student data');
    }
  };

  const handleExportCSV = () => {
    const headers = ['Name', 'Email', 'Phone', 'Codeforces Handle', 'Current Rating', 'Max Rating', 'Reminder Emails Count' , 'Last Updated'];
    const csvData = students.map(student => [
      student.name,
      student.email,
      student.phone,
      student.codeforcesHandle,
      student.currentRating || 0,
      student.maxRating || 0,
      student.reminderEmailCount || 0,
      new Date(student.lastUpdated).toLocaleString()
    ]);

    const csvContent = [headers, ...csvData]
      .map(row => row.map(field => `"${field}"`).join(','))
      .join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', `students_${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    
    toast.success('CSV exported successfully');
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Dashboard</h1>
          <p className="text-gray-600 dark:text-gray-400 mt-1">
            Manage and track student progress on Codeforces
          </p>
        </div>
      </div>

      <StudentTable
        students={students}
        onEdit={handleEditStudent}
        onDelete={handleDeleteStudent}
        onAdd={handleAddStudent}
        onSync={handleSyncStudent}
        onExportCSV={handleExportCSV}
        loading={loading}
      />

      <StudentModal
        isOpen={modalOpen}
        onClose={() => {
          setModalOpen(false);
          setEditingStudent(null);
        }}
        onSave={handleSaveStudent}
        student={editingStudent}
        loading={modalLoading}
      />
    </div>
  );
}

export default Dashboard;