import nodemailer from 'nodemailer';
import Student from '../models/Student.js';
import Settings from '../models/Settings.js';

let transporter = null;

async function initializeTransporter() {
  const settings = await Settings.findOne();
  if (!settings || !settings.emailSettings.smtpUser) {
    console.warn('Email settings not configured');
    return null;
  }

  transporter = nodemailer.createTransport({
    host: settings.emailSettings.smtpHost,
    port: settings.emailSettings.smtpPort,
    secure: settings.emailSettings.smtpPort === 465,
    auth: {
      user: settings.emailSettings.smtpUser,
      pass: settings.emailSettings.smtpPass
    }
  });

  return transporter;
}

export async function sendReminderEmail(student) {
  try {
    if (!transporter) {
      await initializeTransporter();
    }

    if (!transporter) {
      console.warn('Email transporter not configured');
      return false;
    }

    const settings = await Settings.findOne();
    const emailTemplate = `
      <h2>Hey ${student.name}! 👋</h2>
      <p>We noticed you haven't been active on Codeforces for the past 7 days.</p>
      <p>Don't let your coding skills get rusty! Here are some suggestions to get back on track:</p>
      <ul>
        <li>🎯 Try solving problems at your current rating level (${student.currentRating})</li>
        <li>📚 Review algorithms you've learned recently</li>
        <li>🏆 Participate in upcoming contests</li>
        <li>💪 Set a goal to solve at least one problem daily</li>
      </ul>
      <p>Remember, consistency is key to improvement in competitive programming!</p>
      <p>Happy coding! 🚀</p>
      <br>
      <p><em>This is an automated reminder. You can disable these notifications in your profile settings.</em></p>
    `;

    const mailOptions = {
      from: `${settings.emailSettings.fromName} <${settings.emailSettings.fromEmail}>`,
      to: student.email,
      subject: '🔔 Time to get back to coding!',
      html: emailTemplate
    };

    await transporter.sendMail(mailOptions);
    
    // Update student's reminder count and timestamp
    student.reminderEmailCount += 1;
    student.lastReminderSent = new Date();
    await student.save();

    console.log(`Reminder email sent to ${student.email}`);
    return true;
  } catch (error) {
    console.error(`Error sending reminder email to ${student.email}:`, error);
    return false;
  }
}

export async function checkInactiveStudents() {
  try {
    console.log('Checking for inactive students...');
    
    const settings = await Settings.findOne();
    const inactivityThreshold = settings?.inactivityThreshold || 7;
    
    const cutoffDate = new Date();
    cutoffDate.setDate(cutoffDate.getDate() - inactivityThreshold);
    const cutoffTimestamp = Math.floor(cutoffDate.getTime() / 1000);

    const students = await Student.find({ 
      isActive: true,
      emailNotificationsEnabled: true
    });

    console.log("setudents not active 7 days",students);

    for (const student of students) {
      // Check if student has any submissions in the last N days
      const recentSubmissions = student.submissions.filter(
        submission => submission.creationTimeSeconds >= cutoffTimestamp
      );

      if (recentSubmissions.length === 0) {
        // Check if we already sent a reminder recently (don't spam)
        const lastReminderDate = student.lastReminderSent;
        const oneDayAgo = new Date();
        oneDayAgo.setDate(oneDayAgo.getDate() - 1);

        if (!lastReminderDate || lastReminderDate < oneDayAgo) {
          console.log(`Sending reminder to inactive student: ${student.email}`);
          await sendReminderEmail(student);
        }
      }
    }

    console.log('Inactive student check completed');
  } catch (error) {
    console.error('Error checking inactive students:', error);
    throw error;
  }
}