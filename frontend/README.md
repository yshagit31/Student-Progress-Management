Student Progress Management System
A full-stack MERN application to manage and monitor student progress using the Codeforces API. Features include a searchable student table, detailed profile views with contest and problem-solving data, automated data syncing via cron jobs, and inactivity tracking with motivational email reminders sent via SMTP.
✨ Features
Student Table View

📋 Searchable, paginated table displaying all students
📊 Columns: Name, Email, Phone, Codeforces Handle, Current Rating, Max Rating, Last Synced, Reminder Emails
🛠️ Actions:
➕ Add new student
✏️ Edit existing student
❌ Delete student
📥 Export data to CSV
🔄 Manual Codeforces data sync
👁️ View detailed profile



Student Profile View

Contest History:
📅 Filter by last 30, 90, or 365 days
📜 List of contests with rating changes and ranks
📈 Rating line chart


Problem Solving Data:
📅 Filter by last 7, 30, or 90 days
📊 Most difficult problem solved
🧮 Total problems solved
⭐ Average problem rating
📆 Average problems solved per day
📉 Bar chart of problems by rating bucket
🔥 Submission heat map



Data Sync (Codeforces API)

🔄 Daily automatic sync using cron jobs
⚡ Real-time sync when a student's Codeforces handle is updated
🖱️ Manual sync for individual students or all students
⚙️ Configurable sync time and frequency via backend settings

Email Reminders (SMTP)

📧 Motivational emails sent to students inactive for 7+ days
📤 Emails sent via Nodemailer with SMTP integration
📊 Tracks number of reminder emails sent per student
🚫 Option to disable reminders for individual students

🧪 Tech Stack



Layer
Technologies



Frontend
React, Tailwind CSS


Backend
Node.js, Express.js


Database
MongoDB, Mongoose


Charts
ApexCharts, Chart.js


Emails
Nodemailer (SMTP)


Cron Jobs
node-cron


Others
Joi (validation), CSV export, react-hot-toast


📂 Folder Structure
student-progress-system/
├── backend/
│   ├── models/          # Mongoose schemas
│   ├── routes/          # Express routes
│   ├── services/        # Business logic
│   ├── utils/           # Helper functions
│   ├── .env             # Environment variables
│   └── server.js        # Backend entry point
├── frontend/
│   ├── components/      # React components
│   ├── pages/           # React page components
│   └── App.jsx          # Frontend entry point
├── public/
│   └── assets/
│       └── demo.mp4     # Video walkthrough
├── docs/
│   └── document.docx    # Project documentation
└── README.md            # This file

🌐 API Endpoints
Students



Method
Endpoint
Description



GET
/api/students
Get all students


GET
/api/students/:id
Get student by ID


POST
/api/students
Add new student


PUT
/api/students/:id
Update student


DELETE
/api/students/:id
Delete student


POST
/api/students/:id/sync
Sync Codeforces data for a student


Codeforces



Method
Endpoint
Description



GET
/api/codeforces/contests/:studentId
Get contest data (30/90/365 days)


GET
/api/codeforces/problems/:studentId
Get problem-solving data


POST
/api/codeforces/sync-all
Sync all students' data


Settings (Cron/Email)



Method
Endpoint
Description



GET
/api/settings
Get cron and email settings


PUT
/api/settings
Update cron schedule or SMTP config


Emails



Method
Endpoint
Description



GET
/api/test/send-reminders
Manually trigger inactivity check


🚀 Setup Instructions

Clone and Install
git clone https://github.com/your-username/student-progress-system.git
cd student-progress-system/backend
npm install
cd ../frontend
npm install


Setup Environment VariablesCreate a .env file in the backend/ directory:
MONGODB_URI=<your-mongodb-uri>
FRONTEND_LOCAL_URL=http://localhost:5173


Run Locally
# Start backend
cd backend
npm run dev

# Start frontend (in a new terminal)
cd frontend
npm run dev



🎥 Video Walkthrough
Demo Video Link (Add your Google Drive, YouTube, or Loom link here)
📚 GitHub Repository
GitHub Repo Link (Add your repository URL here)
🤝 Acknowledgments

Codeforces API
Nodemailer
ApexCharts
react-hot-toast

