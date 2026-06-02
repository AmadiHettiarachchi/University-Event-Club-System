# University Event & Club Management System

A MERN stack web application for managing university clubs, events, student registrations, QR attendance, feedback, certificates, announcements, and admin reports.

## Features

- Student and Club Leader registration
- One Admin account
- Role-based protected dashboards
- Club-based event creation
- Student event registration
- One-time QR attendance marking
- Event feedback and ratings
- One-time certificate download
- Club announcements
- Admin dashboard with users, events, and system statistics
- 404 Not Found page

## Technologies Used

Frontend:
- React.js
- Tailwind CSS
- Axios
- React Router DOM
- Lucide React
- QRCode React
- jsPDF
- html5-qrcode

Backend:
- Node.js
- Express.js
- MongoDB
- Mongoose
- JWT
- Bcrypt.js

## User Roles

### Admin
- View system statistics
- View students
- View club leaders
- View events

### Club Leader
- Create and edit events
- Create announcements
- Mark QR attendance
- View registered students
- View present students
- View feedback

### Student
- Join clubs
- View relevant club events
- Register for events
- Show QR for attendance
- Submit feedback
- Download certificate once

## How to Run

### Backend

```bash
cd backend
npm install
npm run dev
