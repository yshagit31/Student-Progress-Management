# Student Progress Management System

[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](https://opensource.org/licenses/MIT)
[![React](https://img.shields.io/badge/React-18.2.0-61DAFB?logo=react)](https://reactjs.org/)
[![Node.js](https://img.shields.io/badge/Node.js-18.x-339933?logo=node.js)](https://nodejs.org/)
[![MongoDB](https://img.shields.io/badge/MongoDB-6.0-47A248?logo=mongodb)](https://www.mongodb.com/)

A full-stack MERN application to manage and monitor student progress using the [Codeforces API](https://codeforces.com/api/help). Key features include a searchable student table, detailed profile views with contest and problem-solving analytics, automated data syncing via cron jobs, and inactivity tracking with motivational email reminders sent via SMTP.

## 📑 Table of Contents

- [✨ Features](#-features)
  - [Student Table View](#student-table-view)
  - [Student Profile View](#student-profile-view)
  - [Data Sync (Codeforces API)](#data-sync-codeforces-api)
  - [Email Reminders (SMTP)](#email-reminders-smtp)
- [🧪 Tech Stack](#-tech-stack)
- [📂 Folder Structure](#-folder-structure)
- [🌐 API Endpoints](#-api-endpoints)
- [🚀 Setup Instructions](#-setup-instructions)
- [🎥 Video Walkthrough](#-video-walkthrough)
- [Documentation](#-documentation)
- [📚 GitHub Repository](#-github-repository)
- [🤝 Acknowledgments](#-acknowledgments)

## ✨ Features

### Student Table View
- 📋 Displays all students in a searchable, paginated table.
- 📊 Columns:
  - Name
  - Email
  - Phone
  - Codeforces Handle
  - Current Rating
  - Max Rating
  - Last Synced
  - Reminder Emails
- 🛠️ Actions:
  - ➕ Add new student
  - ✏️ Edit existing student
  - ❌ Delete student
  - 📥 Export data to CSV
  - 🔄 Manual Codeforces data sync
  - 👁️ View detailed profile

### Student Profile View
- **Contest History**:
  - 📅 Filter by last 30, 90, or 365 days
  - 📜 List of contests with rating changes and ranks
  - 📈 Interactive rating line chart
- **Problem Solving Data**:
  - 📅 Filter by last 7, 30, or 90 days
  - 📊 Most difficult problem solved
  - 🧮 Total problems solved
  - ⭐ Average problem rating
  - 📆 Average problems solved per day
  - 📉 Bar chart of problems by rating bucket
  - 🔥 Submission heat map

### Data Sync (Codeforces API)
- 🔄 Automatic daily sync using cron jobs.
- ⚡ Real-time sync when a student's Codeforces handle is updated.
- 🖱️ Manual sync for individual students or all students.
- ⚙️ Configurable sync schedule via backend settings.

### Email Reminders (SMTP)
- 📧 Sends motivational emails to students inactive for 7+ days.
- 📤 Emails sent via [Nodemailer](https://nodemailer.com/) with SMTP integration.
- 📊 Tracks the number of reminder emails sent per student.
- 🚫 Option to disable reminders for individual students.

## 🧪 Tech Stack

| Layer         | Technologies                              |
|---------------|-------------------------------------------|
| **Frontend**  | React, Tailwind CSS                       |
| **Backend**   | Node, Express.js                       |
| **Database**  | MongoDB, Mongoose                         |
| **Charts**    | ApexCharts, Chart.js                      |
| **Emails**    | Nodemailer (SMTP)                         |
| **Cron Jobs** | node-cron                                 |
| **Others**    | Joi (validation), CSV export, react-hot-toast |

## 📂 Folder Structure

<details>
<summary>Click to expand</summary>

```bash
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
```

</details>

## 🌐 API Endpoints

<details>
<summary>Click to expand</summary>

### Students
| Method | Endpoint                  | Description                        |
|--------|---------------------------|------------------------------------|
| GET    | `/api/students`           | Get all students                   |
| GET    | `/api/students/:id`       | Get student by ID                  |
| POST   | `/api/students`           | Add new student                    |
| PUT    | `/api/students/:id`       | Update student                     |
| DELETE | `/api/students/:id`       | Delete student                     |
| POST   | `/api/students/:id/sync`  | Sync Codeforces data for a student |

### Codeforces
| Method | Endpoint                        | Description                        |
|--------|---------------------------------|------------------------------------|
| GET    | `/api/codeforces/contests/:studentId` | Get contest data (30/90/365 days) |
| GET    | `/api/codeforces/problems/:studentId` | Get problem-solving data          |
| POST   | `/api/codeforces/sync-all`      | Sync all students' data            |

### Settings (Cron/Email)
| Method | Endpoint         | Description                            |
|--------|------------------|----------------------------------------|
| GET    | `/api/settings`  | Get cron and email settings            |
| PUT    | `/api/settings`  | Update cron schedule or SMTP config    |

### Emails
| Method | Endpoint                  | Description                        |
|--------|---------------------------|------------------------------------|
| GET    | `/api/test/send-reminders`| Manually trigger inactivity check  |

</details>

## 🚀 Setup Instructions

1. **Clone the Repository**
   ```bash
   git clone https://github.com/your-username/student-progress-system.git
   cd student-progress-system
   ```

2. **Install Dependencies**
   ```bash
   # Backend dependencies
   cd backend
   npm install

   # Frontend dependencies
   cd ../frontend
   npm install
   ```

3. **Configure Environment Variables**
   Create a `.env` file in the `backend/` directory:
   ```bash
   echo "MONGODB_URI=<your-mongodb-uri>" > backend/.env
   echo "FRONTEND_LOCAL_URL=http://localhost:5173" >> backend/.env
   ```
   Replace `<your-mongodb-uri>` with your MongoDB connection string.

4. **Run the Application**
   Open two terminal windows:
   ```bash
   # Terminal 1: Start backend
   cd backend
   npm run dev
   ```
   ```bash
   # Terminal 2: Start frontend
   cd frontend
   npm run dev
   ```

   The frontend will be available at `http://localhost:5173`, and the backend will run on the default port (typically `http://localhost:5000`).

## 🎥 Video Walkthrough

<!-- [Demo Video Link](#) *(Replace with your Google Drive, YouTube, or Loom link)* -->
🔗 [Click here to watch the demo video](https://raw.githubusercontent.com/yshagit31/Student-Progress-Management/main/frontend/public/assets/Demo.mp4)

## 📄 Documentation
[View Full Documentation](./frontend/docs/document.docx)


## 📚 GitHub Repository

[GitHub Repo Link](#) *(https://github.com/yshagit31/Student-Progress-Management)*

## 🤝 Acknowledgments

- [Codeforces API](https://codeforces.com/api/help) for contest and problem data.
- [Nodemailer](https://nodemailer.com/) for SMTP email integration.
- [ApexCharts](https://apexcharts.com/) and [Chart.js](https://www.chartjs.org/) for interactive visualizations.
- [react-hot-toast](https://react-hot-toast.com/) for user-friendly notifications.