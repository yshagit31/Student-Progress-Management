import express from 'express';
import Student from '../models/Student.js';
import { fetchStudentData } from '../services/codeforcesService.js';
import Joi from 'joi';

const router = express.Router();


const studentSchema = Joi.object({
  name: Joi.string().min(2).max(100).required(),
  email: Joi.string().email().required(),
  phone: Joi.string().min(10).max(15).required(),
  codeforcesHandle: Joi.string().min(1).max(50).required(),
  emailNotificationsEnabled: Joi.boolean()
});

const updateStudentSchema = Joi.object({
  name: Joi.string().min(2).max(100),
  email: Joi.string().email(),
  phone: Joi.string().min(10).max(15),
  codeforcesHandle: Joi.string().min(1).max(50),
  emailNotificationsEnabled: Joi.boolean()
});

// Get all students
router.get('/', async (req, res) => {
  try {
    const students = await Student.find().select('-submissions -contests');
    res.json(students);
  } catch (error) {
    console.error('Error fetching students:', error);
    res.status(500).json({ message: 'Error fetching students' });
  }
});

// Get student by ID with full data
router.get('/:id', async (req, res) => {
  try {
    const student = await Student.findById(req.params.id);
    if (!student) {
      return res.status(404).json({ message: 'Student not found' });
    }
    res.json(student);
  } catch (error) {
    console.error('Error fetching student:', error);
    res.status(500).json({ message: 'Error fetching student' });
  }
});

// Create new student
router.post('/', async (req, res) => {
  try {
    // console.log("enetr stdeubt add",req.body);
    const { error, value } = studentSchema.validate(req.body);
    //  console.log("enetr stdeubt add 2");
    if (error) {
      //  console.log("enetr stdeubt add error ");
      return res.status(400).json({ message: error.details[0].message });
    }

    // Check if email or handle already exists
    const existingStudent = await Student.findOne({
      $or: [
        { email: value.email },
        { codeforcesHandle: value.codeforcesHandle }
      ]
    });

    if (existingStudent) {
      return res.status(400).json({ 
        message: 'Student with this email or Codeforces handle already exists' 
      });
    }

    const student = new Student(value);
    
    // Fetch initial Codeforces data
    try {
      const cfData = await fetchStudentData(value.codeforcesHandle);
      if (cfData) {
        student.currentRating = cfData.currentRating;
        student.maxRating = cfData.maxRating;
        student.contests = cfData.contests;
        student.submissions = cfData.submissions;
        student.lastUpdated = new Date();
      }
    } catch (cfError) {
      console.error('Error fetching Codeforces data for new student:', cfError);
      // Continue with student creation even if CF data fetch fails
    }

    await student.save();
    res.status(201).json(student);
  } catch (error) {
    console.error('Error creating student:', error);
    res.status(500).json({ message: 'Error creating student' });
  }
});

// Update student
router.put('/:id', async (req, res) => {
  try {
    const { error, value } = updateStudentSchema.validate(req.body);
    if (error) {
      return res.status(400).json({ message: error.details[0].message });
    }

    const student = await Student.findById(req.params.id);
    if (!student) {
      return res.status(404).json({ message: 'Student not found' });
    }

    const oldHandle = student.codeforcesHandle;
    
    // Update student fields
    Object.assign(student, value);

    // If Codeforces handle changed, fetch new data
    if (value.codeforcesHandle && value.codeforcesHandle !== oldHandle) {
      try {
        const cfData = await fetchStudentData(value.codeforcesHandle);
        if (cfData) {
          student.currentRating = cfData.currentRating;
          student.maxRating = cfData.maxRating;
          student.contests = cfData.contests;
          student.submissions = cfData.submissions;
          student.lastUpdated = new Date();
        }
      } catch (cfError) {
        console.error('Error fetching Codeforces data for updated handle:', cfError);
        return res.status(400).json({ message: 'Invalid Codeforces handle' });
      }
    }

    await student.save();
    res.json(student);
  } catch (error) {
    console.error('Error updating student:', error);
    res.status(500).json({ message: 'Error updating student' });
  }
});

// Delete student
router.delete('/:id', async (req, res) => {
  try {
    const student = await Student.findByIdAndDelete(req.params.id);
    if (!student) {
      return res.status(404).json({ message: 'Student not found' });
    }
    res.json({ message: 'Student deleted successfully' });
  } catch (error) {
    console.error('Error deleting student:', error);
    res.status(500).json({ message: 'Error deleting student' });
  }
});

// Sync specific student's Codeforces data
router.post('/:id/sync', async (req, res) => {
  try {
    const student = await Student.findById(req.params.id);
    if (!student) {
      return res.status(404).json({ message: 'Student not found' });
    }

    const cfData = await fetchStudentData(student.codeforcesHandle);
    if (cfData) {
      student.currentRating = cfData.currentRating;
      student.maxRating = cfData.maxRating;
      student.contests = cfData.contests;
      student.submissions = cfData.submissions;
      student.lastUpdated = new Date();
      await student.save();
    }

    res.json({ message: 'Student data synced successfully', student });
  } catch (error) {
    console.error('Error syncing student data:', error);
    res.status(500).json({ message: 'Error syncing student data' });
  }
});

export default router;